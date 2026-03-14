"use server"

import { getDb, schema, eq, ilike, or } from '@shimokitan/db';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { slugify } from '@shimokitan/utils';
import { workSchema } from '@shimokitan/utils';
import { z } from 'zod';
import { requireFounder, requireArchitect, requireUser } from '../auth-helpers';

export async function searchWorks(query: string) {
    const db = getDb();
    if (!db) return [];

    const results = await db.query.works.findMany({
        where: (w, { isNull }) => isNull(w.deletedAt),
        with: {
            translations: {
                where: (t, { ilike }) => ilike(t.title, `%${query}%`)
            }
        },
        limit: 10
    });

    return results.map(w => ({
        id: w.id,
        title: w.translations?.[0]?.title || 'Untitled Work',
        category: w.category || 'unknown'
    }));
}

export async function createFullWork(data: z.infer<typeof workSchema>) {
    await requireArchitect();
    const validated = workSchema.parse(data);

    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const workId = nanoid();
    const slug = validated.slug || slugify(validated.translations?.[0]?.title || workId);

    await db.transaction(async (tx) => {
        await tx.insert(schema.works).values({
            id: workId,
            category: validated.category,
            slug,
            thumbnailId: validated.thumbnailId || null,
        });

        if (validated.translations?.length) {
            await tx.insert(schema.worksI18n).values(
                validated.translations.map((t) => ({
                    workId,
                    locale: t.locale,
                    title: t.title || '',
                    description: t.description,
                }))
            );
        }

        if (validated.thumbnailId) {
            await tx.update(schema.media).set({ isOrphan: false }).where(eq(schema.media.id, validated.thumbnailId));
        }
    });

    revalidatePath('/[locale]/works', 'page');
    revalidatePath('/[locale]/', 'layout');
    return { id: workId };
}

export async function updateFullWork(id: string, data: z.infer<typeof workSchema>) {
    await requireArchitect();
    const validated = workSchema.parse(data);
    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    await db.transaction(async (tx) => {
        const updateData: any = {
            category: validated.category,
            thumbnailId: validated.thumbnailId || null,
            updatedAt: new Date(),
        };

        if (validated.slug) {
            updateData.slug = validated.slug;
        }

        await tx.update(schema.works)
            .set(updateData)
            .where(eq(schema.works.id, id));

        await tx.delete(schema.worksI18n).where(eq(schema.worksI18n.workId, id));

        if (validated.translations?.length) {
            await tx.insert(schema.worksI18n).values(
                validated.translations.map((t) => ({
                    workId: id,
                    locale: t.locale,
                    title: t.title || '',
                    description: t.description,
                }))
            );
        }

        if (validated.thumbnailId) {
            await tx.update(schema.media).set({ isOrphan: false }).where(eq(schema.media.id, validated.thumbnailId));
        }
    });

    revalidatePath('/[locale]/works', 'page');
    revalidatePath('/[locale]/', 'layout');
    return { success: true };
}

export async function deleteWork(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.update(schema.works).set({ deletedAt: new Date() }).where(eq(schema.works.id, id));
    revalidatePath('/[locale]/works', 'page');
}

export async function restoreWork(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.update(schema.works).set({ deletedAt: null }).where(eq(schema.works.id, id));
    revalidatePath('/[locale]/works', 'page');
}

export async function purgeWork(id: string) {
    await requireFounder();
    const db = getDb();
    if (db) await db.delete(schema.works).where(eq(schema.works.id, id));
    revalidatePath('/[locale]/works', 'page');
}
