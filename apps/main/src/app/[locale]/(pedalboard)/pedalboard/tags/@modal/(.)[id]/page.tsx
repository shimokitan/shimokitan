
import React from 'react';
import { getDb, schema, eq } from '@shimokitan/db';
import TagForm from '../../TagForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import InterceptedClose from '@/components/InterceptedClose';

export default async function InterceptedTagEdit(props: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await props.params;
    const db = getDb();

    const tag = db ? await db.query.tags.findFirst({
        where: eq(schema.tags.id, id),
        with: {
            translations: true
        }
    }) : null;

    if (!tag) return null;

    return (
        <Sheet defaultOpen={true}>
            <InterceptedClose />
            <SheetContent className="sm:max-w-xl overflow-y-auto bg-black border-zinc-800">
                <SheetHeader className="mb-8">
                    <SheetTitle>Audit_Descriptor // {id}</SheetTitle>
                    <SheetDescription>Modify tag metadata and translations.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <TagForm initialData={tag} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
