"use server"

import { getDb, schema, eq, ilike, or } from '@shimokitan/db';

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
