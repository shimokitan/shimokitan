
import React from 'react';
import { Icon } from '@iconify/react';
import { getDb, schema, desc } from '@shimokitan/db';
import ArtifactForm from './ArtifactForm';
import AdminTable from '../components/AdminTable';
import { deleteArtifact } from '../actions';

import { isNull, isNotNull } from 'drizzle-orm';
import Link from 'next/link';

export default async function ArtifactsPage(props: { searchParams: Promise<{ trash?: string }> }) {
    const searchParams = await props.searchParams;
    const isTrash = searchParams.trash === 'true';

    // Fetch Entities for the credits selector
    const db = getDb();
    const entities = db ? await db.query.entities.findMany({
        where: isNull(schema.entities.deletedAt),
        columns: { id: true, name: true, type: true }
    }) : [];

    const allArtifacts = db ? await db.query.artifacts.findMany({
        where: isTrash ? isNotNull(schema.artifacts.deletedAt) : isNull(schema.artifacts.deletedAt),
        orderBy: [desc(schema.artifacts.createdAt)]
    }) : [];

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Manage <span className="text-rose-600">Artifacts.</span>
                    </h1>
                    <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                        {isTrash ? 'Recover or permanently purge entries.' : 'Create and manage system artifacts.'}
                    </p>
                </div>
                <Link
                    href={isTrash ? '/admin/artifacts' : '/admin/artifacts?trash=true'}
                    className={`text-[10px] font-mono px-3 py-1 border transition-colors ${isTrash ? 'bg-rose-600 border-rose-600 text-white hover:bg-white hover:text-black' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                >
                    {isTrash ? 'VIEW_ACTIVE' : 'VIEW_TRASH'}
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Creation Form */}
                {!isTrash && (
                    <section className="bg-zinc-950/50 border border-zinc-900 p-6 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                            <Icon icon="lucide:package-plus" width={120} />
                        </div>
                        <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-4">
                            <Icon icon="lucide:package-plus" className="text-rose-600" width={18} />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">New_Artifact</h2>
                        </div>

                        <ArtifactForm entities={entities as any} />
                    </section>
                )}

                {/* List View */}
                <section className={`${isTrash ? 'md:col-span-2' : ''} space-y-6`}>
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                        <Icon icon={isTrash ? "lucide:trash-2" : "lucide:list"} className={isTrash ? "text-rose-500" : "text-zinc-500"} width={18} />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                            {isTrash ? 'TRASH_PURGE' : 'Recent_Entries'}
                        </h2>
                    </div>

                    <AdminTable
                        data={allArtifacts}
                        onDelete={deleteArtifact}
                        columns={[
                            { key: 'title', label: 'Title', render: (val) => <span className="font-bold text-white">{val}</span> },
                            { key: 'category', label: 'Category', render: (val) => <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-800 rounded">{val}</span> },
                            { key: 'status', label: 'Status' },
                            { key: 'score', label: 'Score', render: (val) => <span className="text-rose-500 font-bold">+{val}</span> }
                        ]}
                    />
                </section>
            </div>
        </div>
    );
}
