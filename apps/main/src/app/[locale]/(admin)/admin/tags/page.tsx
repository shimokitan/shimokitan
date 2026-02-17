
import React from 'react';
import { Icon } from '@iconify/react';
import { getDb, schema, desc, eq } from '@shimokitan/db';
import AdminTable from '../components/AdminTable';
import TagForm from './TagForm';
import { deleteTag } from '../actions';

export default async function TagsPage() {
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
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                    Manage genres, moods, and thematic taxonomies.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Creation Form */}
                <section className="md:col-span-1 bg-zinc-950/50 border border-zinc-900 p-6 space-y-6 relative overflow-hidden group h-fit">
                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                        <Icon icon="lucide:tags" width={120} />
                    </div>
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-4">
                        <Icon icon="lucide:plus" className="text-pink-600" width={18} />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">New_Tag</h2>
                    </div>
                    <TagForm />
                </section>

                {/* List View */}
                <section className="md:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                        <Icon icon="lucide:list" className="text-zinc-500" width={18} />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Recent_Tags</h2>
                    </div>

                    <AdminTable
                        data={allTags}
                        onDelete={deleteTag}
                        editUrl={(row) => `/admin/tags/${row.id}`}
                        columns={[
                            { key: 'name_en', label: 'English', render: (val) => <span className="font-bold text-white">{val}</span> },
                            { key: 'name_id', label: 'Indonesian' },
                            { key: 'name_jp', label: 'Japanese' },
                            { key: 'category', label: 'Category', render: (val) => <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-800 rounded uppercase">{val}</span> },
                        ]}
                    />
                </section>
            </div>
        </div>
    );
}
