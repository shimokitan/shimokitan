
import React, { Suspense } from 'react';
import { getDb, schema } from '@shimokitan/db';
import ArtifactForm from '../../ArtifactForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import { isNull } from 'drizzle-orm';
import InterceptedClose from '../(.)[id]/InterceptedClose';

export default async function InterceptedArtifactCreate() {
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
        <Sheet defaultOpen={true}>
            <InterceptedClose />
            <SheetContent className="sm:max-w-3xl overflow-y-auto bg-black border-zinc-800">
                <SheetHeader className="mb-8">
                    <SheetTitle>Register_New_Artifact</SheetTitle>
                    <SheetDescription>Initialize a new entry in the artifact registry.</SheetDescription>
                </SheetHeader>

                <Suspense fallback={<div className="text-white font-mono text-[10px] animate-pulse p-12 text-center uppercase tracking-widest bg-zinc-950/20 border border-zinc-900">Configuring_Interface...</div>}>
                    <ArtifactForm
                        entities={entities}
                    />
                </Suspense>
            </SheetContent>
        </Sheet>
    );
}
