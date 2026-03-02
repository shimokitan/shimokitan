
'use server';

import { getDb, schema, eq } from '@shimokitan/db';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { slugify } from '@shimokitan/utils';
import { artifactSchema } from '@/lib/validations/pedalboard';
import { z } from 'zod';
import { uploadImageFromUrl } from '@/lib/r2';
import { requireArchitect, requireFounder } from '../auth-helpers';

export async function createFullArtifact(data: z.infer<typeof artifactSchema>) {
    await requireArchitect();
    const validated = artifactSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const artifactId = `ART_${nanoid(10)}`;
    const slug = slugify(validated.translations?.[0]?.title || artifactId);

    let coverImage = validated.coverImage;
    if (coverImage && (coverImage.startsWith('http') && !coverImage.includes('cdn.shimokitan.live'))) {
        coverImage = await uploadImageFromUrl(coverImage, artifactId, 'artifact');
    }

    await db.transaction(async (tx) => {
        await tx.insert(schema.artifacts).values({
            id: artifactId,
            category: validated.category,
            slug,
            coverImage: coverImage || null,
            status: validated.status,
            score: validated.score,
            specs: validated.specs,
            isMajor: validated.isMajor,
            isVerified: validated.isVerified,
        });

        if (validated.verificationId) {
            await tx.update(schema.verificationRegistry)
                .set({
                    targetId: artifactId,
                    targetType: 'artifact',
                    updatedAt: new Date()
                })
                .where(eq(schema.verificationRegistry.id, validated.verificationId));
        }

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
                    artifactId,
                    entityId: c.entityId,
                    role: c.role,
                    displayRole: c.displayRole,
                    contributorClass: c.contributorClass,
                    isPrimary: c.isPrimary,
                    position: c.position,
                }))
            );
        }

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

    let coverImage = validated.coverImage;
    if (coverImage && (coverImage.startsWith('http') && !coverImage.includes('cdn.shimokitan.live'))) {
        coverImage = await uploadImageFromUrl(coverImage, id, 'artifact');
    }

    await db.transaction(async (tx) => {
        await tx.update(schema.artifacts)
            .set({
                category: validated.category,
                coverImage: coverImage || null,
                status: validated.status,
                score: validated.score,
                specs: validated.specs,
                isMajor: validated.isMajor,
                isVerified: validated.isVerified,
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
                    artifactId: id,
                    entityId: c.entityId,
                    role: c.role,
                    displayRole: c.displayRole,
                    contributorClass: c.contributorClass,
                    isPrimary: c.isPrimary,
                    position: c.position,
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

export async function deleteArtifact(id: string) {
    await requireArchitect();
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.update(schema.artifacts)
        .set({ deletedAt: new Date() })
        .where(eq(schema.artifacts.id, id));

    revalidatePath('/[locale]/pedalboard/artifacts', 'page');
    return { success: true };
}

export async function restoreArtifact(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.update(schema.artifacts).set({ deletedAt: null }).where(eq(schema.artifacts.id, id));
    revalidatePath('/[locale]/pedalboard/artifacts', 'page');
}

export async function purgeArtifact(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.delete(schema.artifacts).where(eq(schema.artifacts.id, id));
    revalidatePath('/[locale]/pedalboard/artifacts', 'page');
}
