'use server';

import { auth } from '@/lib/auth-neon/server';
import { getDb, schema, eq, sql } from '@shimokitan/db';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { slugify } from '@shimokitan/utils';
import {
    entitySchema,
    artifactSchema,
    collectionSchema,
    zineSchema,
    tagSchema,
    verificationSchema
} from '@/lib/validations/pedalboard';
import { z } from 'zod';
import { generateStoragePath } from '@shimokitan/utils';
import { uploadFileToR2 } from '@/lib/r2';

// --- AUTH HELPERS ---
async function requireUser() {
    const user = await ensureUserSync();
    if (!user) throw new Error('Unauthorized_Signal: Identity_Lost');
    return user;
}

async function requireArchitect() {
    const user = await requireUser();
    if (user.role !== 'architect' && user.role !== 'founder') {
        throw new Error('Forbidden_Signal: Architects_Only');
    }
    return user;
}

async function requireFounder() {
    const user = await requireUser();
    if (user.role !== 'founder') {
        throw new Error('Forbidden_Signal: Founders_Only');
    }
    return user;
}

// --- AUTH & RBAC ---

export async function ensureUserSync() {
    const { data: session } = await auth.getSession();
    if (!session?.user) return null;

    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const userId = session.user.id;
    const userEmail = session.user.email;
    const userName = session.user.name;
    const userImage = session.user.image;

    try {
        // 1. Try to find the user by ID first (Fast Path)
        const existingById = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, userId)
        });

        if (existingById) {
            // Sync email/name/image if changed on provider side and user hasn't customized them?
            // For now, just sync email and basic info if missing
            const updateObj: any = {};
            if (existingById.email !== userEmail) updateObj.email = userEmail;
            if (!existingById.name && userName) updateObj.name = userName;
            if (!existingById.avatarUrl && userImage) updateObj.avatarUrl = userImage;

            if (Object.keys(updateObj).length > 0) {
                updateObj.updatedAt = new Date();
                await db.update(schema.users)
                    .set(updateObj)
                    .where(eq(schema.users.id, userId));
            }

            return { ...session.user, role: existingById.role };
        }

        // 2. If not found by ID, try to find by Email (Account Linking / Migration Path)
        const existingByEmail = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, userEmail)
        });

        if (existingByEmail) {
            // User exists with this email but different ID. Update to new Auth ID.
            await db.update(schema.users)
                .set({
                    id: userId,
                    name: existingByEmail.name || userName,
                    avatarUrl: existingByEmail.avatarUrl || userImage,
                    updatedAt: new Date()
                })
                .where(eq(schema.users.email, userEmail));

            return { ...session.user, role: existingByEmail.role };
        }

        // 3. Create new user
        const newUser = {
            id: userId,
            email: userEmail,
            name: userName,
            avatarUrl: userImage,
            role: 'resident' as const,
        };
        await db.insert(schema.users).values(newUser);

        return { ...session.user, role: 'resident' };

    } catch (error: any) {
        // Postgres unique_violation code '23505'
        if (error.code === '23505') {
            const racingUser = await db.query.users.findFirst({
                where: (u, { or, eq }) => or(eq(u.id, userId), eq(u.email, userEmail))
            });
            if (racingUser) return { ...session.user, role: racingUser.role };
        }
        console.error('User_Sync_Critical_Failure:', error);
        throw new Error('Identity_Establishment_Failed');
    }
}


export async function requestArchitectAccess() {
    const user = await requireUser();
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const existing = await db.query.verificationRegistry.findFirst({
        where: (vr, { and, eq }) => and(
            eq(vr.targetId, user.id),
            eq(vr.targetType, 'role_upgrade'),
            eq(vr.status, 'pending')
        )
    });

    if (existing) {
        return { success: false, message: 'Request_Already_In_Queue' };
    }

    await db.insert(schema.verificationRegistry).values({
        id: `VR_${nanoid(10)}`,
        targetId: user.id,
        targetType: 'role_upgrade',
        status: 'pending',
        issuer: user.id,
        internalNotes: `Architect promotion request from ${user.email} (${user.name})`,
    });

    revalidatePath('/[locale]/pedalboard', 'page');
    return { success: true, message: 'Signal_Sent_To_Founders' };
}

export async function approveRoleUpgrade(verificationId: string) {
    const user = await requireFounder();
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const request = await db.query.verificationRegistry.findFirst({
        where: eq(schema.verificationRegistry.id, verificationId)
    });

    if (!request || request.targetType !== 'role_upgrade') {
        throw new Error('Invalid_Request_Record');
    }

    await db.transaction(async (tx) => {
        await tx.update(schema.verificationRegistry)
            .set({
                status: 'approved',
                grantedBy: user.name || 'Architect_Oversight',
                updatedAt: new Date()
            })
            .where(eq(schema.verificationRegistry.id, verificationId));

        await tx.update(schema.users)
            .set({
                role: 'architect',
                updatedAt: new Date()
            })
            .where(eq(schema.users.id, request.targetId));
    });

    revalidatePath('/[locale]/pedalboard', 'layout');
    revalidatePath('/[locale]/pedalboard/verifications', 'page');
    return { success: true };
}

// --- ENTITIES (Founder Only) ---

export async function createFullEntity(data: z.infer<typeof entitySchema>) {
    await requireFounder();
    const validated = entitySchema.parse(data);

    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const entityId = `ENT_${nanoid(10)}`;
    const slug = slugify(validated.translations?.[0]?.name || entityId);

    await db.transaction(async (tx) => {
        await tx.insert(schema.entities).values({
            id: entityId,
            type: validated.type,
            slug,
            avatarUrl: validated.avatarUrl || null,
            isMajor: validated.isMajor,
            isVerified: validated.isVerified,
            allowMirroring: validated.allowMirroring,
            socialLinks: validated.socialLinks,
        });

        if (validated.translations?.length) {
            await tx.insert(schema.entitiesI18n).values(
                validated.translations.map((t) => ({
                    entityId,
                    locale: t.locale,
                    name: t.name || '', // Ensure not null validation passes if schema allowed optional
                    bio: t.bio,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/entities', 'page');
    return { id: entityId };
}

export async function updateFullEntity(id: string, data: z.infer<typeof entitySchema>) {
    await requireFounder();
    const validated = entitySchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        await tx.update(schema.entities)
            .set({
                type: validated.type,
                avatarUrl: validated.avatarUrl || null,
                isMajor: validated.isMajor,
                isVerified: validated.isVerified,
                allowMirroring: validated.allowMirroring,
                socialLinks: validated.socialLinks,
                updatedAt: new Date(),
            })
            .where(eq(schema.entities.id, id));

        await tx.delete(schema.entitiesI18n).where(eq(schema.entitiesI18n.entityId, id));

        if (validated.translations?.length) {
            await tx.insert(schema.entitiesI18n).values(
                validated.translations.map((t) => ({
                    entityId: id,
                    locale: t.locale,
                    name: t.name || '',
                    bio: t.bio,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/entities', 'page');
    return { success: true };
}

// --- ARTIFACTS (Architect+) ---

export async function createFullArtifact(data: z.infer<typeof artifactSchema>) {
    await requireArchitect();
    const validated = artifactSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const artifactId = `ART_${nanoid(10)}`;
    const slug = slugify(validated.translations?.[0]?.title || artifactId);

    await db.transaction(async (tx) => {
        await tx.insert(schema.artifacts).values({
            id: artifactId,
            category: validated.category,
            slug,
            coverImage: validated.coverImage || null,
            status: validated.status,
            score: validated.score,
            specs: validated.specs,
            isMajor: validated.isMajor,
            isVerified: validated.isVerified,
            allowMirroring: validated.allowMirroring,
        });

        if (validated.translations?.length) {
            await tx.insert(schema.artifactsI18n).values(
                validated.translations.map((t) => ({
                    artifactId,
                    locale: t.locale,
                    title: t.title || '',
                    description: t.description,
                }))
            );
        }

        if (validated.resources?.length) {
            await tx.insert(schema.artifactResources).values(
                validated.resources.map((r) => ({
                    id: `RES_${nanoid(10)}`,
                    artifactId,
                    type: r.type,
                    platform: r.platform,
                    value: r.url,
                    isPrimary: r.isPrimary,
                }))
            );
        }

        if (validated.credits?.length) {
            await tx.insert(schema.artifactCredits).values(
                validated.credits.map((c) => ({
                    id: `CRD_${nanoid(10)}`,
                    artifactId,
                    entityId: c.entityId,
                    role: c.role,
                }))
            );
        }

        if (validated.tags?.length) {
            for (const tagObj of validated.tags) {
                const tagName = tagObj.name;
                // Simplified tag handling - ideally this should be optimized
                let tag = await tx.query.tags.findFirst({
                    where: (tags, { exists, and, eq }) => exists(
                        tx.select().from(schema.tagsI18n).where(and(
                            eq(schema.tagsI18n.tagId, tags.id),
                            eq(schema.tagsI18n.name, tagName)
                        ))
                    )
                });

                if (!tag) {
                    const newTagId = `TAG_${nanoid(10)}`;
                    await tx.insert(schema.tags).values({ id: newTagId, category: 'other' });
                    await tx.insert(schema.tagsI18n).values({ tagId: newTagId, locale: 'en', name: tagName });
                    tag = { id: newTagId } as any;
                }

                await tx.insert(schema.artifactTags).values({ artifactId, tagId: tag!.id });
            }
        }
    });

    revalidatePath('/[locale]/pedalboard/artifacts', 'page');
    return { id: artifactId };
}

export async function updateFullArtifact(id: string, data: z.infer<typeof artifactSchema>) {
    await requireArchitect();
    const validated = artifactSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        await tx.update(schema.artifacts)
            .set({
                category: validated.category,
                coverImage: validated.coverImage || null,
                status: validated.status,
                score: validated.score,
                specs: validated.specs,
                isMajor: validated.isMajor,
                isVerified: validated.isVerified,
                allowMirroring: validated.allowMirroring,
                updatedAt: new Date(),
            })
            .where(eq(schema.artifacts.id, id));

        await tx.delete(schema.artifactsI18n).where(eq(schema.artifactsI18n.artifactId, id));
        if (validated.translations?.length) {
            await tx.insert(schema.artifactsI18n).values(
                validated.translations.map((t) => ({
                    artifactId: id,
                    locale: t.locale,
                    title: t.title || '',
                    description: t.description,
                }))
            );
        }

        // Resources, Credits, Tags logic remains same as create but with delete first
        await tx.delete(schema.artifactResources).where(eq(schema.artifactResources.artifactId, id));
        if (validated.resources?.length) {
            await tx.insert(schema.artifactResources).values(
                validated.resources.map((r) => ({
                    id: `RES_${nanoid(10)}`,
                    artifactId: id,
                    type: r.type,
                    platform: r.platform,
                    value: r.url,
                    isPrimary: r.isPrimary,
                }))
            );
        }

        await tx.delete(schema.artifactCredits).where(eq(schema.artifactCredits.artifactId, id));
        if (validated.credits?.length) {
            await tx.insert(schema.artifactCredits).values(
                validated.credits.map((c) => ({
                    id: `CRD_${nanoid(10)}`,
                    artifactId: id,
                    entityId: c.entityId,
                    role: c.role,
                }))
            );
        }

        await tx.delete(schema.artifactTags).where(eq(schema.artifactTags.artifactId, id));
        if (validated.tags?.length) {
            for (const tagObj of validated.tags) {
                const tagName = tagObj.name;
                let tag = await tx.query.tags.findFirst({
                    where: (tags, { exists, and, eq }) => exists(
                        tx.select().from(schema.tagsI18n).where(and(
                            eq(schema.tagsI18n.tagId, tags.id),
                            eq(schema.tagsI18n.name, tagName)
                        ))
                    )
                });

                if (!tag) {
                    const newTagId = `TAG_${nanoid(10)}`;
                    await tx.insert(schema.tags).values({ id: newTagId, category: 'other' });
                    await tx.insert(schema.tagsI18n).values({ tagId: newTagId, locale: 'en', name: tagName });
                    tag = { id: newTagId } as any;
                }

                await tx.insert(schema.artifactTags).values({ artifactId: id, tagId: tag!.id });
            }
        }
    });

    revalidatePath('/[locale]/pedalboard/artifacts', 'page');
    return { success: true };
}

// --- COLLECTIONS (Founder Only) ---

export async function createFullCollection(data: z.infer<typeof collectionSchema>) {
    await requireFounder();
    const validated = collectionSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const collectionId = `COL_${nanoid(10)}`;
    const slug = slugify(validated.translations?.[0]?.title || collectionId);

    await db.transaction(async (tx) => {
        await tx.insert(schema.collections).values({
            id: collectionId,
            slug,
            coverImage: validated.coverImage || null,
            isMajor: validated.isMajor,
            allowMirroring: validated.allowMirroring,
            resonance: validated.resonance,
        });

        if (validated.translations?.length) {
            await tx.insert(schema.collectionsI18n).values(
                validated.translations.map((t) => ({
                    collectionId,
                    locale: t.locale,
                    title: t.title || '',
                    thesis: t.thesis || t.description,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/collections', 'page');
    return { id: collectionId };
}

export async function updateFullCollection(id: string, data: z.infer<typeof collectionSchema>) {
    await requireFounder();
    const validated = collectionSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        await tx.update(schema.collections)
            .set({
                coverImage: validated.coverImage || null,
                isMajor: validated.isMajor,
                allowMirroring: validated.allowMirroring,
                resonance: validated.resonance,
                updatedAt: new Date(),
            })
            .where(eq(schema.collections.id, id));

        await tx.delete(schema.collectionsI18n).where(eq(schema.collectionsI18n.collectionId, id));
        if (validated.translations?.length) {
            await tx.insert(schema.collectionsI18n).values(
                validated.translations.map((t) => ({
                    collectionId: id,
                    locale: t.locale,
                    title: t.title || '',
                    thesis: t.thesis || t.description,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/collections', 'page');
    return { success: true };
}

// --- ZINES (Architect+) ---

export async function createFullZine(data: z.infer<typeof zineSchema>) {
    await requireArchitect();
    const validated = zineSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const zineId = `ZIN_${nanoid(10)}`;

    await db.transaction(async (tx) => {
        await tx.insert(schema.zines).values({
            id: zineId,
            artifactId: validated.artifactId,
            author: validated.author || 'Anonymous',
            resonance: validated.resonance,
        });

        if (validated.translations?.length) {
            await tx.insert(schema.zinesI18n).values(
                validated.translations.map((t) => ({
                    zineId,
                    locale: t.locale,
                    content: t.content || '',
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/zines', 'page');
    return { id: zineId };
}

export async function updateFullZine(id: string, data: z.infer<typeof zineSchema>) {
    await requireArchitect();
    const validated = zineSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        await tx.update(schema.zines)
            .set({
                artifactId: validated.artifactId,
                author: validated.author,
                resonance: validated.resonance,
                updatedAt: new Date(),
            })
            .where(eq(schema.zines.id, id));

        await tx.delete(schema.zinesI18n).where(eq(schema.zinesI18n.zineId, id));
        if (validated.translations?.length) {
            await tx.insert(schema.zinesI18n).values(
                validated.translations.map((t) => ({
                    zineId: id,
                    locale: t.locale,
                    content: t.content || '',
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/zines', 'page');
    return { success: true };
}

// --- TAGS (Founder Only) ---

export async function createFullTag(data: z.infer<typeof tagSchema>) {
    await requireFounder();
    const validated = tagSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const tagId = `TAG_${nanoid(10)}`;

    await db.transaction(async (tx) => {
        await tx.insert(schema.tags).values({
            id: tagId,
            category: validated.category,
        });

        if (validated.translations?.length) {
            await tx.insert(schema.tagsI18n).values(
                validated.translations.map((t) => ({
                    tagId,
                    locale: t.locale,
                    name: t.name || '',
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/tags', 'page');
    return { id: tagId };
}

export async function updateFullTag(id: string, data: z.infer<typeof tagSchema>) {
    await requireFounder();
    const validated = tagSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        await tx.update(schema.tags)
            .set({
                category: validated.category,
                updatedAt: new Date(),
            })
            .where(eq(schema.tags.id, id));

        await tx.delete(schema.tagsI18n).where(eq(schema.tagsI18n.tagId, id));
        if (validated.translations?.length) {
            await tx.insert(schema.tagsI18n).values(
                validated.translations.map((t) => ({
                    tagId: id,
                    locale: t.locale,
                    name: t.name || '',
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/tags', 'page');
    return { success: true };
}

// --- VERIFICATIONS (Founder Only) ---

export async function createVerification(data: z.infer<typeof verificationSchema>) {
    await requireFounder();
    const validated = verificationSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const verificationId = `VR_${nanoid(10)}`;

    await db.insert(schema.verificationRegistry).values({
        id: verificationId,
        targetId: validated.targetId,
        targetType: validated.targetType,
        status: validated.status,
        issuer: validated.issuer,
        r2Key: validated.r2Key,
        grantedBy: validated.grantedBy,
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : undefined,
        internalNotes: validated.internalNotes,
    });

    revalidatePath('/[locale]/pedalboard/verifications', 'page');
    return { id: verificationId };
}

export async function updateVerification(id: string, data: z.infer<typeof verificationSchema>) {
    await requireFounder();
    const validated = verificationSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.update(schema.verificationRegistry)
        .set({
            targetId: validated.targetId,
            targetType: validated.targetType,
            status: validated.status,
            issuer: validated.issuer,
            r2Key: validated.r2Key,
            grantedBy: validated.grantedBy,
            expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : undefined,
            internalNotes: validated.internalNotes,
            updatedAt: new Date(),
        })
        .where(eq(schema.verificationRegistry.id, id));

    revalidatePath('/[locale]/pedalboard/verifications', 'page');
    return { success: true };
}

// --- DELETE ACTIONS (Founder Only) ---

export async function deleteEntity(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.update(schema.entities).set({ deletedAt: new Date() }).where(eq(schema.entities.id, id));
    revalidatePath('/[locale]/pedalboard/entities', 'page');
}

export async function deleteArtifact(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.update(schema.artifacts).set({ deletedAt: new Date() }).where(eq(schema.artifacts.id, id));
    revalidatePath('/[locale]/pedalboard/artifacts', 'page');
}

export async function deleteCollection(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.update(schema.collections).set({ deletedAt: new Date() }).where(eq(schema.collections.id, id));
    revalidatePath('/[locale]/pedalboard/collections', 'page');
}

export async function deleteZine(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.update(schema.zines).set({ deletedAt: new Date() }).where(eq(schema.zines.id, id));
    revalidatePath('/[locale]/pedalboard/zines', 'page');
}

export async function deleteTag(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.delete(schema.tags).where(eq(schema.tags.id, id));
    revalidatePath('/[locale]/pedalboard/tags', 'page');
}

export async function deleteVerification(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.delete(schema.verificationRegistry).where(eq(schema.verificationRegistry.id, id));
    revalidatePath('/[locale]/pedalboard/verifications', 'page');
}

// --- STORAGE & PROFILE (All Users) ---

export async function uploadToR2Action(formData: FormData) {
    const user = await requireUser();
    const file = formData.get('file') as File;
    const context = formData.get('context') as 'artifacts' | 'profiles' | 'zines';

    if (!file) throw new Error('No_File_Targeted');

    const fileId = nanoid(12);
    const extension = file.name.split('.').pop() || 'webp';
    const key = generateStoragePath({
        mediaType: 'images',
        context,
        identifier: user.id,
        filename: `${fileId}.${extension}`
    });

    const buffer = await file.arrayBuffer();
    const publicUrl = await uploadFileToR2(buffer, key, file.type);

    return { publicUrl, key };
}

export async function updateUserProfile(data: { name: string; status: string; bio: string; avatarUrl?: string; headerUrl?: string }) {
    const user = await requireUser();
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.update(schema.users)
        .set({
            name: data.name,
            status: data.status,
            bio: data.bio,
            avatarUrl: data.avatarUrl,
            headerUrl: data.headerUrl,
            updatedAt: new Date()
        })
        .where(eq(schema.users.id, user.id));

    revalidatePath('/[locale]/pedalboard', 'page');
    revalidatePath('/[locale]/pedalboard/profile/edit', 'page');
    return { success: true };
}
