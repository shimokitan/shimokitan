
import React from 'react';
import EntityForm from '../../EntityForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import InterceptedClose from '../../../artifacts/@modal/(.)[id]/InterceptedClose';
import { getDb } from '@shimokitan/db';

export default async function InterceptedEntityCreate() {
    const db = getDb();
    const allEntities = db ? await db.query.entities.findMany({
        where: (e, { isNull }) => isNull(e.deletedAt),
        with: { translations: true }
    }) : [];

    const entitySelectData = allEntities.map(e => ({
        id: e.id,
        name: e.translations?.[0]?.name || "Untitled",
        type: e.type,
        avatarUrl: e.avatarUrl
    }));
    return (
        <Sheet defaultOpen={true}>
            <InterceptedClose />
            <SheetContent className="sm:max-w-3xl overflow-y-auto bg-black border-zinc-800">
                <SheetHeader className="mb-8">
                    <SheetTitle>Register_New_Entity</SheetTitle>
                    <SheetDescription>Initialize a new identity in the district registry.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <EntityForm entities={entitySelectData} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
