
import React from 'react';
import CollectionForm from '../../CollectionForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import InterceptedClose from '@/components/InterceptedClose';

export default async function InterceptedCollectionCreate() {
    return (
        <Sheet defaultOpen={true}>
            <InterceptedClose />
            <SheetContent className="sm:max-w-3xl overflow-y-auto bg-black border-zinc-800">
                <SheetHeader className="mb-8">
                    <SheetTitle>New_Mixtape_Registry</SheetTitle>
                    <SheetDescription>Archive a new curated collection into the district database.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <CollectionForm />
                </div>
            </SheetContent>
        </Sheet>
    );
}
