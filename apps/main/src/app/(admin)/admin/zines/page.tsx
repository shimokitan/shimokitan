
import React from 'react';
import { Icon } from '@iconify/react';
import { seedZine, deleteZine } from '../actions';
import { getDb, desc, schema } from '@shimokitan/db';
import AdminTable from '../components/AdminTable';

import { isNull, isNotNull } from 'drizzle-orm';
import Link from 'next/link';

export default async function ZinesPage(props: { searchParams: Promise<{ trash?: string }> }) {
    const searchParams = await props.searchParams;
    const isTrash = searchParams.trash === 'true';

    const db = getDb();

    const artifacts = db ? await db.query.artifacts.findMany({
        where: isNull(schema.artifacts.deletedAt),
        columns: { id: true, title: true }
    }) : [];

    const allZines = db ? await db.query.zines.findMany({
        where: isTrash ? isNotNull(schema.zines.deletedAt) : isNull(schema.zines.deletedAt),
        orderBy: [desc(schema.zines.createdAt)],
        with: {
            artifact: {
                columns: { title: true }
            }
        }
    }) : [];

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Underground <span className="text-emerald-500">Zines.</span>
                    </h1>
                    <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                        {isTrash ? 'Purge or recover zine articles.' : 'Publish zines and articles.'}
                    </p>
                </div>
                <Link
                    href={isTrash ? '/admin/zines' : '/admin/zines?trash=true'}
                    className={`text-[10px] font-mono px-3 py-1 border transition-colors ${isTrash ? 'bg-emerald-500 border-emerald-500 text-black hover:bg-white' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                >
                    {isTrash ? 'VIEW_ACTIVE' : 'VIEW_TRASH'}
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {!isTrash && (
                    <section className="bg-zinc-950/50 border border-zinc-900 p-6 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                            <Icon icon="lucide:file-text" width={120} />
                        </div>
                        <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                            <Icon icon="lucide:file-text" className="text-emerald-500" width={18} />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">New_Zine</h2>
                        </div>

                        <form action={seedZine} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono uppercase text-zinc-400">Related Artifact</label>
                                    <select name="artifactId" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors">
                                        <option value="">Select Artifact</option>
                                        {artifacts.map((a: any) => (
                                            <option key={a.id} value={a.id}>{a.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono uppercase text-zinc-400">Author</label>
                                    <input name="author" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" placeholder="Author Name" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-400">Content</label>
                                <textarea name="content" required rows={4} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none resize-none transition-colors" placeholder="Write content..." />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-400">Resonance Score</label>
                                <input name="resonance" type="number" defaultValue="0" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" />
                            </div>

                            <button type="submit" className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4">
                                PUBLISH_ZINE
                            </button>
                        </form>
                    </section>
                )}

                <section className={`${isTrash ? 'md:col-span-2' : ''} space-y-6`}>
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                        <Icon icon={isTrash ? "lucide:trash-2" : "lucide:list"} className={isTrash ? "text-rose-500" : "text-zinc-500"} width={18} />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                            {isTrash ? 'TRASH_PURGE' : 'Published_Zines'}
                        </h2>
                    </div>

                    <AdminTable
                        data={allZines as any}
                        onDelete={deleteZine}
                        columns={[
                            { key: 'author', label: 'Author', render: (val) => <span className="font-bold text-white">{val}</span> },
                            { key: 'artifact', label: 'Artifact', render: (val) => <span className="text-xs text-zinc-500">{val?.title || '-'}</span> },
                            { key: 'resonance', label: 'Resonance', render: (val) => <span className="text-emerald-500 font-bold">{val}</span> }
                        ]}
                    />
                </section>
            </div>
        </div>
    );
}
