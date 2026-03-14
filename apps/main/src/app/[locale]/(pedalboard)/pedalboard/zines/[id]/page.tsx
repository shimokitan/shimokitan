
import React from 'react';
import { getDb, schema, eq, isNull } from '@shimokitan/db';
import ZineForm from '../ZineForm';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';

export default async function EditZinePage(props: { params: Promise<{ locale: string; id: string }> }) {
    const params = await props.params;
    const db = getDb();

    const zine = db ? await db.query.zines.findFirst({
        where: eq(schema.zines.id, params.id),
        with: {
            translations: true
        }
    }) : null;

    if (!zine) {
        notFound();
    }

    // Fetch Artifacts for the selector
    const rawArtifacts = db ? await db.query.artifacts.findMany({
        where: isNull(schema.artifacts.deletedAt),
        with: {
            translations: true
        }
    }) : [];

    const artifacts = rawArtifacts.map(a => ({
        id: a.id,
        title: a.translations?.[0]?.title || "Untitled"
    }));

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between border-b border-zinc-900 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/pedalboard/zines" className="text-zinc-500 hover:text-white transition-colors">
                            <Icon icon="lucide:arrow-left" width={14} />
                        </Link>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Library / Publishing / Update</span>
                    </div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">
                        Edit <span className="text-emerald-500">Zine.</span>
                    </h1>
                </div>
            </header>

            <div className="max-w-3xl">
                <section className="bg-zinc-950/50 border border-zinc-900 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Icon icon="lucide:file-text" width={160} />
                    </div>
                    <ZineForm artifacts={artifacts} initialData={zine} />
                </section>
            </div>
        </div>
    );
}
