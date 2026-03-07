
import React, { Suspense } from 'react';
import { getDb, schema, eq, isNull } from '@shimokitan/db';
import ArtifactForm from '../ArtifactForm';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';

export default async function EditArtifactPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const db = getDb();

    const artifact = db ? await db.query.artifacts.findFirst({
        where: eq(schema.artifacts.id, params.id),
        with: {
            credits: true,
            resources: true,
            translations: true,
            tags: {
                with: {
                    tag: {
                        with: {
                            translations: true
                        }
                    }
                }
            }
        }
    }) : null;

    if (!artifact) {
        notFound();
    }

    const rawEntities = db ? await db.query.entities.findMany({
        where: isNull(schema.entities.deletedAt),
        with: {
            avatar: true,
            translations: true
        }
    }) : [];

    const entities = rawEntities.map(e => ({
        id: e.id,
        name: e.translations?.[0]?.name || "Untitled",
        type: e.type,
        avatarUrl: e.avatar?.url || null
    }));

    return (
        <div className="max-w-4xl mx-auto py-12">
            <header className="mb-12">
                <div className="flex items-center gap-2 mb-2">
                    <Link href="/pedalboard/artifacts" className="text-zinc-500 hover:text-white transition-colors">
                        <Icon icon="lucide:arrow-left" width={16} />
                    </Link>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">Registry_Management // Audit</span>
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
                    Modify_Artifact <span className="text-rose-600">// {params.id}</span>
                </h1>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Update existing registry entry with verified metadata.</p>
            </header>

            <Suspense fallback={<div className="text-white font-mono text-xs animate-pulse p-12 text-center uppercase tracking-widest bg-zinc-950/20 border border-zinc-900">Configuring_Interface...</div>}>
                <ArtifactForm
                    entities={entities}
                    initialData={artifact}
                />
            </Suspense>
        </div>
    );
}
