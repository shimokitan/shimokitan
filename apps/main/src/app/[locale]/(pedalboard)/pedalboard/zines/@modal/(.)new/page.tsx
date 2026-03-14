
import React from 'react';
import { getDb, schema, isNull } from '@shimokitan/db';
import ZineForm from '../../ZineForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import InterceptedClose from '@/components/InterceptedClose';

export default async function InterceptedZineCreate() {
    const db = getDb();
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
                    <SheetTitle>New_Underground_Zine</SheetTitle>
                    <SheetDescription>Initialize a new article in the zine collection.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <ZineForm artifacts={artifacts} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
