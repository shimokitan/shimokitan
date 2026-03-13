
import React from 'react';
import { getDb, schema, isNull } from '@shimokitan/db';
import VerificationForm from '../../VerificationForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import InterceptedClose from '../../../artifacts/@modal/(.)[id]/InterceptedClose';

export default async function InterceptedVerificationCreate() {
    const db = getDb();

    // Fetch Artifacts and Entities for the form
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
        <Sheet defaultOpen={true}>
            <InterceptedClose />
            <SheetContent className="sm:max-w-2xl overflow-y-auto bg-black border-zinc-800">
                <SheetHeader className="mb-8">
                    <SheetTitle>Issue_Verification_Manifest</SheetTitle>
                    <SheetDescription>Grant a verification status to a registered artifact or entity.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <VerificationForm artifacts={artifacts} entities={entities} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
