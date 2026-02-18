
import React, { Suspense } from 'react';
import { getDb, schema } from '@shimokitan/db';
import ArtifactForm from '../ArtifactForm';
import { isNull } from 'drizzle-orm';

export default async function NewArtifactPage() {
    const db = getDb();

    // Fetch Entities for credits selector
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
        <div className="max-w-4xl mx-auto py-12">
            <header className="mb-12">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Register_New_Artifact</h1>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Initialization of a new entry in the artifact registry.</p>
            </header>

            <Suspense fallback={<div className="text-white font-mono text-xs animate-pulse p-12 text-center uppercase tracking-widest bg-zinc-950/20 border border-zinc-900">Configuring_Interface...</div>}>
                <ArtifactForm
                    entities={entities}
                />
            </Suspense>
        </div>
    );
}
