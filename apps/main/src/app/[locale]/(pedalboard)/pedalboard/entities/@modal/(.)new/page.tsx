
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

export default async function InterceptedEntityCreate() {
    return (
        <Sheet defaultOpen={true}>
            <InterceptedClose />
            <SheetContent className="sm:max-w-3xl overflow-y-auto bg-black border-zinc-800">
                <SheetHeader className="mb-8">
                    <SheetTitle>Register_New_Entity</SheetTitle>
                    <SheetDescription>Initialize a new identity in the district registry.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <EntityForm />
                </div>
            </SheetContent>
        </Sheet>
    );
}
