
import React from 'react';
import { getDb, schema, eq, isNull } from '@shimokitan/db';
import VerificationForm from '../../VerificationForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import InterceptedClose from '../../../artifacts/@modal/(.)[id]/InterceptedClose';

export default async function InterceptedVerificationEdit(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const db = getDb();

    const verification = db ? await db.query.verificationRegistry.findFirst({
        where: eq(schema.verificationRegistry.id, id)
    }) : null;

    if (!verification) return null;

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
                    <SheetTitle>Audit_Verification // {id}</SheetTitle>
                    <SheetDescription>Modify verification status and manifest details.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <VerificationForm initialData={verification} artifacts={artifacts} entities={entities} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
