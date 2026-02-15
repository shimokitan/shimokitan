
import React from 'react';
import { Icon } from '@iconify/react';
import { seedCollection, deleteCollection } from '../actions';
import { getDb, desc, schema } from '@shimokitan/db';
import AdminTable from '../components/AdminTable';

import { isNull, isNotNull } from 'drizzle-orm';
import Link from 'next/link';

export default async function CollectionsPage(props: { searchParams: Promise<{ trash?: string }> }) {
    const searchParams = await props.searchParams;
    const isTrash = searchParams.trash === 'true';

    const db = getDb();
    const allCollections = db ? await db.query.collections.findMany({
        where: isTrash ? isNotNull(schema.collections.deletedAt) : isNull(schema.collections.deletedAt),
        orderBy: [desc(schema.collections.createdAt)]
    }) : [];

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Curated <span className="text-amber-500">Collections.</span>
                    </h1>
                    <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                        {isTrash ? 'Purge or recover curated collections.' : 'Manage mixtapes and curated collections.'}
                    </p>
                </div>
                <Link
                    href={isTrash ? '/admin/collections' : '/admin/collections?trash=true'}
                    className={`text-[10px] font-mono px-3 py-1 border transition-colors ${isTrash ? 'bg-amber-500 border-amber-500 text-black hover:bg-white' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                >
                    {isTrash ? 'VIEW_ACTIVE' : 'VIEW_TRASH'}
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {!isTrash && (
                    <section className="bg-zinc-950/50 border border-zinc-900 p-6 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                            <Icon icon="lucide:disc" width={120} />
                        </div>
                        <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                            <Icon icon="lucide:disc" className="text-amber-500" width={18} />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">New_Collection</h2>
                        </div>

                        <form action={seedCollection} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-400">Title</label>
                                <input name="title" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none transition-colors" placeholder="Collection Title" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-400">Thesis</label>
                                <textarea name="thesis" rows={3} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none resize-none transition-colors" placeholder="Collection Thesis / Description..." />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-400">Cover URL</label>
                                <input name="coverImage" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none transition-colors" placeholder="https://..." />
                            </div>

                            <button type="submit" className="w-full py-4 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4">
                                CREATE_COLLECTION
                            </button>
                        </form>
                    </section>
                )}

                <section className={`${isTrash ? 'md:col-span-2' : ''} space-y-6`}>
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                        <Icon icon={isTrash ? "lucide:trash-2" : "lucide:list"} className={isTrash ? "text-rose-500" : "text-zinc-500"} width={18} />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                            {isTrash ? 'TRASH_PURGE' : 'All_Collections'}
                        </h2>
                    </div>

                    <AdminTable
                        data={allCollections}
                        onDelete={deleteCollection}
                        columns={[
                            { key: 'title', label: 'Title', render: (val) => <span className="font-bold text-white">{val}</span> },
                            { key: 'coverImage', label: 'Cover', render: (val) => val ? <img src={val} className="w-8 h-8 rounded border border-zinc-800" /> : '-' }
                        ]}
                    />
                </section>
            </div>
        </div>
    );
}
