
import React from 'react';
import { Icon } from '@iconify/react';
import { getDb, schema, desc } from '@shimokitan/db';
import ArtifactForm from './ArtifactForm';
import AdminTable from '../components/AdminTable';

export default async function ArtifactsPage() {
    // Fetch Entities for the credits selector
    const db = getDb();
    const entities = db ? await db.query.entities.findMany({
        columns: { id: true, name: true, type: true }
    }) : [];
    const allArtifacts = db ? await db.query.artifacts.findMany({
        orderBy: [desc(schema.artifacts.createdAt)]
    }) : [];

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                    Manage <span className="text-rose-600">Artifacts.</span>
                </h1>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                    Create and manage system artifacts.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Creation Form */}
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

                {/* List View */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                        <Icon icon="lucide:list" className="text-zinc-500" width={18} />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Recent_Entries</h2>
                    </div>

                    <AdminTable
                        data={allArtifacts}
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
