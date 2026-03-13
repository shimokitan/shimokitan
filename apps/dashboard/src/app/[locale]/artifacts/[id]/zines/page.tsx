
import React from 'react';
import { getDb, schema, eq, desc } from '@shimokitan/db';
import { notFound } from 'next/navigation';
import Link from '@/components/Link';
import { Icon } from '@iconify/react';

export default async function ArtifactZinesManagementPage(props: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await props.params;
    const db = getDb();
    if (!db) return <div>DB_OFFLINE</div>;

    const artifact = await db.query.artifacts.findFirst({
        where: eq(schema.artifacts.id, id),
        with: {
            translations: {
                where: (t, { eq }) => eq(t.locale, 'en')
            }
        }
    });

    if (!artifact) notFound();

    const zines = await db.query.zines.findMany({
        where: eq(schema.zines.artifactId, id),
        orderBy: [desc(schema.zines.createdAt)],
        with: {
            author: true,
            translations: {
                where: (t, { eq }) => eq(t.locale, 'en')
            }
        }
    });

    return (
        <div className="max-w-4xl mx-auto py-12">
            <header className="mb-12">
                <div className="flex items-center gap-2 mb-2">
                    <Link href={`/artifacts/${id}`} className="text-zinc-500 hover:text-white transition-colors">
                        <Icon icon="lucide:arrow-left" width={16} />
                    </Link>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">Registry // Echo_Pulse</span>
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
                    Zines_for <span className="text-rose-600">// {artifact.translations?.[0]?.title || id}</span>
                </h1>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Management of community signals and editorial resonance.</p>
            </header>

            <div className="space-y-4">
                {zines.length > 0 ? zines.map((zine) => (
                    <div key={zine.id} className="p-6 bg-zinc-950 border border-zinc-900 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <Icon icon="lucide:message-square" className="text-zinc-600" width={18} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-xs font-black uppercase tracking-tight">{zine.author?.name || 'Resident'}</span>
                                    <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                                    <span className="text-[10px] font-mono text-rose-600 uppercase italic">Resonance // {zine.resonance}</span>
                                </div>
                                <p className="text-zinc-400 text-sm italic line-clamp-1 max-w-xl">
                                    "{zine.translations?.[0]?.content || 'Signal_fragmented'}"
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2 text-zinc-600 hover:text-rose-500 transition-colors">
                                <Icon icon="lucide:trash-2" width={18} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="p-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
                        <Icon icon="lucide:radio" width={48} className="mx-auto text-zinc-800 mb-4" />
                        <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">No_Signals_Linked_To_This_Artifact</p>
                    </div>
                )}
            </div>
        </div>
    );
}
