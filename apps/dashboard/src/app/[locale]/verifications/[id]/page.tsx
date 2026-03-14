
import React from 'react';
import { getDb, schema, eq, isNull } from '@shimokitan/db';
import VerificationForm from '../VerificationForm';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';

export default async function EditVerificationPage(props: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await props.params;
    const db = getDb();

    const verification = db ? await db.query.verificationRegistry.findFirst({
        where: eq(schema.verificationRegistry.id, id)
    }) : null;

    if (!verification) return <div>Verification not found</div>;

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
            <header className="flex items-center justify-between border-b border-zinc-900 pb-6">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                        Edit_Verification
                    </h1>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">
                        Ref // {id}
                    </p>
                </div>
                <Link href="/verifications" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white flex items-center gap-2">
                    <Icon icon="lucide:arrow-left" /> BACK_TO_LOG
                </Link>
            </header>

            <div className="bg-zinc-950/50 border border-zinc-900 p-8 rounded-lg">
                <VerificationForm initialData={verification} artifacts={artifacts} entities={entities} />
            </div>
        </div>
    );
}
