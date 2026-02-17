
import React from 'react';
import { getDb, schema, eq, isNull } from '@shimokitan/db';
import VerificationForm from '../VerificationForm';
import { notFound } from 'next/navigation';
import { Icon } from '@iconify/react';

export default async function EditVerificationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const db = getDb();
    if (!db) return <div>DB Connection Failed</div>;

    const [verification, artifacts, entities] = await Promise.all([
        db.query.verificationRegistry.findFirst({
            where: eq(schema.verificationRegistry.id, id),
        }),
        db.query.artifacts.findMany({
            where: isNull(schema.artifacts.deletedAt),
            with: { translations: true }
        }),
        db.query.entities.findMany({
            where: isNull(schema.entities.deletedAt),
            with: { translations: true }
        })
    ]);

    if (!verification) notFound();

    const artifactOptions = artifacts.map(a => ({ id: a.id, name: a.translations?.[0]?.title || a.id }));
    const entityOptions = entities.map(e => ({ id: e.id, name: e.translations?.[0]?.name || e.id }));

    return (
        <div className="space-y-6">
            <header className="flex items-center gap-4">
                <a href="/admin/verifications" className="p-2 border border-zinc-900 bg-zinc-950 text-zinc-500 hover:text-white transition-colors">
                    <Icon icon="lucide:arrow-left" width={16} />
                </a>
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-1">
                        Edit <span className="text-blue-600">Verification.</span>
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">SEQ_ID // {verification.id}</p>
                </div>
            </header>

            <div className="max-w-xl bg-zinc-950/50 border border-zinc-900 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Icon icon="lucide:shield-check" width={160} />
                </div>
                <VerificationForm
                    artifacts={artifactOptions}
                    entities={entityOptions}
                    initialData={verification}
                />
            </div>
        </div>
    );
}
