
import React from 'react';
import { getDb, schema, eq } from '@shimokitan/db';
import EntityForm from '../../EntityForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import InterceptedClose from '../../../artifacts/@modal/(.)[id]/InterceptedClose';

export default async function InterceptedEntityEdit(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const db = getDb();

    const entity = db ? await db.query.entities.findFirst({
        where: eq(schema.entities.id, id),
        with: {
            translations: true
        }
    }) : null;

    if (!entity) return null;

    return (
        <Sheet defaultOpen={true}>
            <InterceptedClose />
            <SheetContent className="sm:max-w-3xl overflow-y-auto bg-black border-zinc-800">
                <SheetHeader className="mb-8">
                    <SheetTitle>Audit_Entity // {id}</SheetTitle>
                    <SheetDescription>Modify registry details for this identity.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <EntityForm initialData={entity} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
