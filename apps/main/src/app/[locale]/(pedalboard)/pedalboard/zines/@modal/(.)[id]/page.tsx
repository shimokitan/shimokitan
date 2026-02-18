
import React from 'react';
import { getDb, schema, eq, isNull } from '@shimokitan/db';
import ZineForm from '../../ZineForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import InterceptedClose from '../../../artifacts/@modal/(.)[id]/InterceptedClose';

export default async function InterceptedZineEdit(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const db = getDb();

    const zine = db ? await db.query.zines.findFirst({
        where: eq(schema.zines.id, id),
        with: {
            translations: true
        }
    }) : null;

    if (!zine) return null;

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
        <Sheet defaultOpen={true}>
            <InterceptedClose />
            <SheetContent className="sm:max-w-3xl overflow-y-auto bg-black border-zinc-800">
                <SheetHeader className="mb-8">
                    <SheetTitle>Audit_Zine // {id}</SheetTitle>
                    <SheetDescription>Modify zine content and metadata.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <ZineForm initialData={zine} artifacts={artifacts} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
