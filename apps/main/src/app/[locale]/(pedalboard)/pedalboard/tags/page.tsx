
import React from 'react';
export const dynamic = 'force-dynamic';
import { Icon } from '@iconify/react';
import { getDb, schema, desc, eq } from '@shimokitan/db';
import Link from 'next/link';
import TagRegistry from './components/TagRegistry';
import { deleteTag, ensureUserSync } from '../actions';
import { redirect } from 'next/navigation';

export default async function TagsPage() {
    const user = await ensureUserSync();
    if (!user || (user.role !== 'founder' && user.role !== 'architect')) {
        redirect('/pedalboard');
    }

    const db = getDb();
    if (!db) return <div>DB Connection Failed</div>;

    const rawTags = await db.query.tags.findMany({
        orderBy: [desc(schema.tags.createdAt)],
        with: {
            translations: true
        }
    });

    const allTags = rawTags.map(t => ({
        ...t,
        name_en: t.translations.find(tr => tr.locale === 'en')?.name || '-',
        name_id: t.translations.find(tr => tr.locale === 'id')?.name || '-',
        name_jp: t.translations.find(tr => tr.locale === 'jp')?.name || '-',
    }));

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                    Tag <span className="text-pink-600">Registry.</span>
                </h1>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em] mb-4">
                    Manage genres, moods, and thematic taxonomies.
                </p>
                <div className="flex gap-2">
                    <Link
                        href="/pedalboard/tags/new"
                        className="flex items-center gap-2 bg-white text-black text-[10px] font-black uppercase px-4 py-2 hover:bg-pink-600 hover:text-white transition-all shadow-lg"
                    >
                        <Icon icon="lucide:plus" width={14} />
                        REGISTER_TAG
                    </Link>
                </div>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon="lucide:list" className="text-zinc-500" width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Recent_Tags</h2>
                </div>

                <div className="bg-zinc-950/20 rounded-lg p-1 border border-zinc-900">
                    <TagRegistry data={allTags} />
                </div>
            </section>
        </div>
    );
}
