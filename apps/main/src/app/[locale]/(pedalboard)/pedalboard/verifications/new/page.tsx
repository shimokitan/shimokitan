
import React from 'react';
import { getDb, schema, isNull } from '@shimokitan/db';
import VerificationForm from '../VerificationForm';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';

export default async function NewVerificationPage() {
    const db = getDb();

    const rawArtifacts = db ? await db.query.artifacts.findMany({
        where: isNull(schema.artifacts.deletedAt),
        with: { translations: true }
    }) : [];

    const rawEntities = db ? await db.query.entities.findMany({
        where: isNull(schema.entities.deletedAt),
        with: { translations: true }
    }) : [];

    const artifacts = rawArtifacts.map(a => ({
        id: a.id,
        name: a.translations?.[0]?.title || "Untitled"
    }));

    const entities = rawEntities.map(e => ({
        id: e.id,
        name: e.translations?.[0]?.name || "Untitled"
    }));

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="border-b border-zinc-900 pb-6">
                <Link 
                    href="/pedalboard/verifications" 
                    className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all mb-6"
                >
                    <Icon icon="lucide:arrow-left" width={14} />
                    Return_to_Log
                </Link>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                        Issue_Verification
                    </h1>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">
                        Manual Entry // Registry Override
                    </p>
                </div>
            </header>

            <div className="bg-zinc-950/50 border border-zinc-900 p-8 rounded-lg">
                <VerificationForm artifacts={artifacts} entities={entities} />
            </div>
        </div>
    );
}
