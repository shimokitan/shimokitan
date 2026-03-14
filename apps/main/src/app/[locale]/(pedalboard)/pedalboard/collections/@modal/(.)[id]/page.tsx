
import React from 'react';
import { getDb, schema, eq } from '@shimokitan/db';
import CollectionForm from '../../CollectionForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import InterceptedClose from '@/components/InterceptedClose';

export default async function InterceptedCollectionEdit(props: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await props.params;
    const db = getDb();

    const collection = db ? await db.query.collections.findFirst({
        where: eq(schema.collections.id, id),
        with: {
            translations: true
        }
    }) : null;

    if (!collection) return null;

    return (
        <Sheet defaultOpen={true}>
            <InterceptedClose />
            <SheetContent className="sm:max-w-3xl overflow-y-auto bg-black border-zinc-800">
                <SheetHeader className="mb-8">
                    <SheetTitle>Audit_Mixtape // {id}</SheetTitle>
                    <SheetDescription>Modify curated collection metadata.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <CollectionForm initialData={collection} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
