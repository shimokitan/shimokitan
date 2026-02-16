
import React from 'react';
import { getDb, schema, eq, isNull } from '@shimokitan/db';
import ArtifactForm from '../ArtifactForm';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditArtifactPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const db = getDb();

    const artifact = db ? await db.query.artifacts.findFirst({
        where: eq(schema.artifacts.id, params.id),
        with: {
            credits: true,
            resources: true,
            translations: true
        }
    }) : null;

    if (!artifact) {
        notFound();
    }

    // Fetch Entities for the credits selector
    const rawEntities = db ? await db.query.entities.findMany({
        where: isNull(schema.entities.deletedAt),
        with: {
            translations: true
        }
    }) : [];

    const entities = rawEntities.map(e => ({
        id: e.id,
        name: e.translations?.[0]?.name || "Untitled",
        type: e.type
    }));

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between border-b border-zinc-900 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/artifacts" className="text-zinc-500 hover:text-white transition-colors">
                            <Icon icon="lucide:arrow-left" width={14} />
                        </Link>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">System_Archive / Update</span>
                    </div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">
                        Edit <span className="text-rose-600">Artifact.</span>
                    </h1>
                </div>
            </header>

            <div className="max-w-5xl">
                <section className="bg-zinc-950/50 border border-zinc-900 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Icon icon="lucide:database" width={160} />
                    </div>
                    <ArtifactForm entities={entities as any} initialData={artifact} />
                </section>
            </div>
        </div>
    );
}
