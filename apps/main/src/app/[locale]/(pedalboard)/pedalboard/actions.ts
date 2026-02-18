'use server';

import { auth } from '@/lib/auth-neon/server';
import { getDb, schema, eq, sql } from '@shimokitan/db';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { slugify } from '@shimokitan/utils';

// --- AUTH & RBAC ---
export async function ensureUserSync() {
    const { data: session } = await auth.getSession();
    if (!session?.user) return null;

    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    let existing = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, session.user.id)
    });

    // Handle pre-registered users by email
    if (!existing) {
        existing = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, session.user.email)
        });

        if (existing) {
            // Update the ID to match the auth provider's ID
            await db.update(schema.users)
                .set({ id: session.user.id })
                .where(eq(schema.users.email, session.user.email));
        }
    }

    if (!existing) {
        const newUser = {
            id: session.user.id,
            email: session.user.email,
            role: 'resident' as const, // Default role for new signals
        };
        await db.insert(schema.users).values(newUser);
        return { ...session.user, role: 'resident' };
    }

    return { ...session.user, role: existing.role };
}

export async function requestArchitectAccess() {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
        throw new Error('Unauthorized_Access_Signal_Lost');
    }

    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    // Check if already requested
    const existing = await db.query.verificationRegistry.findFirst({
        where: (vr, { and, eq }) => and(
            eq(vr.targetId, session.user.id),
            eq(vr.targetType, 'role_upgrade'),
            eq(vr.status, 'pending')
        )
    });

    if (existing) {
        return { success: false, message: 'Request_Already_In_Queue' };
    }

    await db.insert(schema.verificationRegistry).values({
        id: `VR_${nanoid(10)}`,
        targetId: session.user.id,
        targetType: 'role_upgrade',
        status: 'pending',
        issuer: session.user.id,
        internalNotes: `Architect promotion request from ${session.user.email} (${session.user.name})`,
    });

    revalidatePath('/[locale]/pedalboard', 'page');
    return { success: true, message: 'Signal_Sent_To_Founders' };
}

export async function approveRoleUpgrade(verificationId: string) {
    const { data: session } = await auth.getSession();
    // Only founders can approve
    if (session?.user?.role !== 'founder' && process.env.NODE_ENV === 'production') {
        throw new Error('Founder_Privilege_Required');
    }

    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const request = await db.query.verificationRegistry.findFirst({
        where: eq(schema.verificationRegistry.id, verificationId)
    });

    if (!request || request.targetType !== 'role_upgrade') {
        throw new Error('Invalid_Request_Record');
    }

    await db.transaction(async (tx) => {
        // 1. Approve the request
        await tx.update(schema.verificationRegistry)
            .set({
                status: 'approved',
                grantedBy: session?.user?.name || 'Architect_Oversight',
                updatedAt: new Date()
            })
            .where(eq(schema.verificationRegistry.id, verificationId));

        // 2. Upgrade the user
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

// --- ENTITIES ---

export async function createFullEntity(data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const entityId = `ENT_${nanoid(10)}`;
    const slug = slugify(data.translations?.[0]?.name || entityId);

    await db.transaction(async (tx) => {
        await tx.insert(schema.entities).values({
            id: entityId,
            type: data.type,
            slug,
            avatarUrl: data.avatarUrl,
            isMajor: data.isMajor,
            isVerified: data.isVerified,
            allowMirroring: data.allowMirroring,
            socialLinks: data.socialLinks,
        });

        if (data.translations?.length) {
            await tx.insert(schema.entitiesI18n).values(
                data.translations.map((t: any) => ({
                    entityId,
                    locale: t.locale,
                    name: t.name,
                    bio: t.bio,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/entities', 'page');
    return { id: entityId };
}

export async function updateFullEntity(id: string, data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        await tx.update(schema.entities)
            .set({
                type: data.type,
                avatarUrl: data.avatarUrl,
                isMajor: data.isMajor,
                isVerified: data.isVerified,
                allowMirroring: data.allowMirroring,
                socialLinks: data.socialLinks,
                updatedAt: new Date(),
            })
            .where(eq(schema.entities.id, id));

        await tx.delete(schema.entitiesI18n).where(eq(schema.entitiesI18n.entityId, id));

        if (data.translations?.length) {
            await tx.insert(schema.entitiesI18n).values(
                data.translations.map((t: any) => ({
                    entityId: id,
                    locale: t.locale,
                    name: t.name,
                    bio: t.bio,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/entities', 'page');
    return { success: true };
}

// --- ARTIFACTS ---

export async function createFullArtifact(data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const artifactId = `ART_${nanoid(10)}`;
    const slug = slugify(data.translations?.[0]?.title || artifactId);

    await db.transaction(async (tx) => {
        await tx.insert(schema.artifacts).values({
            id: artifactId,
            category: data.category,
            slug,
            coverImage: data.coverImage,
            status: data.status,
            score: data.score,
            specs: data.specs,
            isMajor: data.isMajor,
            isVerified: data.isVerified,
            allowMirroring: data.allowMirroring,
        });

        if (data.translations?.length) {
            await tx.insert(schema.artifactsI18n).values(
                data.translations.map((t: any) => ({
                    artifactId,
                    locale: t.locale,
                    title: t.title,
                    description: t.description,
                }))
            );
        }

        if (data.resources?.length) {
            await tx.insert(schema.artifactResources).values(
                data.resources.map((r: any) => ({
                    id: `RES_${nanoid(10)}`,
                    artifactId,
                    type: r.type,
                    platform: r.platform,
                    value: r.url,
                    isPrimary: r.isPrimary,
                }))
            );
        }

        if (data.credits?.length) {
            await tx.insert(schema.artifactCredits).values(
                data.credits.map((c: any) => ({
                    id: `CRD_${nanoid(10)}`,
                    artifactId,
                    entityId: c.entityId,
                    role: c.role,
                }))
            );
        }

        // Handle Tags
        if (data.tags?.length) {
            for (const tagName of data.tags.map((t: any) => t.name)) {
                let tag = await tx.query.tags.findFirst({
                    with: { translations: true },
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

export async function updateFullArtifact(id: string, data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        await tx.update(schema.artifacts)
            .set({
                category: data.category,
                coverImage: data.coverImage,
                status: data.status,
                score: data.score,
                specs: data.specs,
                isMajor: data.isMajor,
                isVerified: data.isVerified,
                allowMirroring: data.allowMirroring,
                updatedAt: new Date(),
            })
            .where(eq(schema.artifacts.id, id));

        await tx.delete(schema.artifactsI18n).where(eq(schema.artifactsI18n.artifactId, id));
        if (data.translations?.length) {
            await tx.insert(schema.artifactsI18n).values(
                data.translations.map((t: any) => ({
                    artifactId: id,
                    locale: t.locale,
                    title: t.title,
                    description: t.description,
                }))
            );
        }

        await tx.delete(schema.artifactResources).where(eq(schema.artifactResources.artifactId, id));
        if (data.resources?.length) {
            await tx.insert(schema.artifactResources).values(
                data.resources.map((r: any) => ({
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
        if (data.credits?.length) {
            await tx.insert(schema.artifactCredits).values(
                data.credits.map((c: any) => ({
                    id: `CRD_${nanoid(10)}`,
                    artifactId: id,
                    entityId: c.entityId,
                    role: c.role,
                }))
            );
        }

        await tx.delete(schema.artifactTags).where(eq(schema.artifactTags.artifactId, id));
        if (data.tags?.length) {
            for (const tagName of data.tags.map((t: any) => t.name)) {
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

// --- COLLECTIONS ---

export async function createFullCollection(data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const collectionId = `COL_${nanoid(10)}`;
    const slug = slugify(data.translations?.[0]?.title || collectionId);

    await db.transaction(async (tx) => {
        await tx.insert(schema.collections).values({
            id: collectionId,
            slug,
            coverImage: data.coverImage,
            isMajor: data.isMajor,
            allowMirroring: data.allowMirroring,
            resonance: data.resonance,
        });

        if (data.translations?.length) {
            await tx.insert(schema.collectionsI18n).values(
                data.translations.map((t: any) => ({
                    collectionId,
                    locale: t.locale,
                    title: t.title,
                    thesis: t.description,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/collections', 'page');
    return { id: collectionId };
}

export async function updateFullCollection(id: string, data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        await tx.update(schema.collections)
            .set({
                coverImage: data.coverImage,
                isMajor: data.isMajor,
                allowMirroring: data.allowMirroring,
                resonance: data.resonance,
                updatedAt: new Date(),
            })
            .where(eq(schema.collections.id, id));

        await tx.delete(schema.collectionsI18n).where(eq(schema.collectionsI18n.collectionId, id));
        if (data.translations?.length) {
            await tx.insert(schema.collectionsI18n).values(
                data.translations.map((t: any) => ({
                    collectionId: id,
                    locale: t.locale,
                    title: t.title,
                    thesis: t.description,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/collections', 'page');
    return { success: true };
}

// --- ZINES ---

export async function createFullZine(data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const zineId = `ZIN_${nanoid(10)}`;

    await db.transaction(async (tx) => {
        await tx.insert(schema.zines).values({
            id: zineId,
            artifactId: data.artifactId,
            author: data.author,
            resonance: data.resonance,
        });

        if (data.translations?.length) {
            await tx.insert(schema.zinesI18n).values(
                data.translations.map((t: any) => ({
                    zineId,
                    locale: t.locale,
                    content: t.content,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/zines', 'page');
    return { id: zineId };
}

export async function updateFullZine(id: string, data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        await tx.update(schema.zines)
            .set({
                artifactId: data.artifactId,
                author: data.author,
                resonance: data.resonance,
                updatedAt: new Date(),
            })
            .where(eq(schema.zines.id, id));

        await tx.delete(schema.zinesI18n).where(eq(schema.zinesI18n.zineId, id));
        if (data.translations?.length) {
            await tx.insert(schema.zinesI18n).values(
                data.translations.map((t: any) => ({
                    zineId: id,
                    locale: t.locale,
                    content: t.content,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/zines', 'page');
    return { success: true };
}

// --- TAGS ---

export async function createFullTag(data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const tagId = `TAG_${nanoid(10)}`;

    await db.transaction(async (tx) => {
        await tx.insert(schema.tags).values({
            id: tagId,
            category: data.category,
        });

        if (data.translations?.length) {
            await tx.insert(schema.tagsI18n).values(
                data.translations.map((t: any) => ({
                    tagId,
                    locale: t.locale,
                    name: t.name,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/tags', 'page');
    return { id: tagId };
}

export async function updateFullTag(id: string, data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        await tx.update(schema.tags)
            .set({
                category: data.category,
                updatedAt: new Date(),
            })
            .where(eq(schema.tags.id, id));

        await tx.delete(schema.tagsI18n).where(eq(schema.tagsI18n.tagId, id));
        if (data.translations?.length) {
            await tx.insert(schema.tagsI18n).values(
                data.translations.map((t: any) => ({
                    tagId: id,
                    locale: t.locale,
                    name: t.name,
                }))
            );
        }
    });

    revalidatePath('/[locale]/pedalboard/tags', 'page');
    return { success: true };
}

// --- VERIFICATIONS ---

export async function createVerification(data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const verificationId = `VR_${nanoid(10)}`;

    await db.insert(schema.verificationRegistry).values({
        id: verificationId,
        targetId: data.targetId,
        targetType: data.targetType,
        status: data.status || 'pending',
        issuer: data.issuer,
        r2Key: data.r2Key,
        grantedBy: data.grantedBy,
        expiresAt: data.expiresAt,
        internalNotes: data.internalNotes,
    });

    revalidatePath('/[locale]/pedalboard/verifications', 'page');
    return { id: verificationId };
}

export async function updateVerification(id: string, data: any) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.update(schema.verificationRegistry)
        .set({
            targetId: data.targetId,
            targetType: data.targetType,
            status: data.status,
            issuer: data.issuer,
            r2Key: data.r2Key,
            grantedBy: data.grantedBy,
            expiresAt: data.expiresAt,
            internalNotes: data.internalNotes,
            updatedAt: new Date(),
        })
        .where(eq(schema.verificationRegistry.id, id));

    revalidatePath('/[locale]/pedalboard/verifications', 'page');
    return { success: true };
}

// --- DELETE ACTIONS (Soft Deletes where supported) ---

export async function deleteEntity(id: string) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');
    await db.update(schema.entities).set({ deletedAt: new Date() }).where(eq(schema.entities.id, id));
    revalidatePath('/[locale]/pedalboard/entities', 'page');
}

export async function deleteArtifact(id: string) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');
    await db.update(schema.artifacts).set({ deletedAt: new Date() }).where(eq(schema.artifacts.id, id));
    revalidatePath('/[locale]/pedalboard/artifacts', 'page');
}

export async function deleteCollection(id: string) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');
    await db.update(schema.collections).set({ deletedAt: new Date() }).where(eq(schema.collections.id, id));
    revalidatePath('/[locale]/pedalboard/collections', 'page');
}

export async function deleteZine(id: string) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');
    await db.update(schema.zines).set({ deletedAt: new Date() }).where(eq(schema.zines.id, id));
    revalidatePath('/[locale]/pedalboard/zines', 'page');
}

export async function deleteTag(id: string) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');
    await db.delete(schema.tags).where(eq(schema.tags.id, id));
    revalidatePath('/[locale]/pedalboard/tags', 'page');
}

export async function deleteVerification(id: string) {
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');
    await db.delete(schema.verificationRegistry).where(eq(schema.verificationRegistry.id, id));
    revalidatePath('/[locale]/pedalboard/verifications', 'page');
}
