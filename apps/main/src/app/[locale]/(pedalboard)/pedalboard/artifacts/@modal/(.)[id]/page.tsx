
import React from 'react';
import { getDb, schema, eq } from '@shimokitan/db';
import ArtifactForm from '../../ArtifactForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import { isNull } from 'drizzle-orm';
import InterceptedClose from './InterceptedClose';

export default async function InterceptedArtifactEdit(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const db = getDb();

    // Fetch Artifact data
    const artifact = db ? await db.query.artifacts.findFirst({
        where: eq(schema.artifacts.id, id),
        with: {
            translations: true,
            resources: true,
            credits: true,
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
                    <SheetTitle>Audit_Artifact // {id}</SheetTitle>
                    <SheetDescription>Verify and modify registry metadata for this entry.</SheetDescription>
                </SheetHeader>

                <ArtifactForm
                    entities={entities}
                    initialData={artifact}
                />
            </SheetContent>
        </Sheet>
    );
}
