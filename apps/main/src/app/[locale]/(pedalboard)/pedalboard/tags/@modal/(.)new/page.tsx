
import React from 'react';
import TagForm from '../../TagForm';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@shimokitan/ui';
import InterceptedClose from '../../../artifacts/@modal/(.)[id]/InterceptedClose';

export default async function InterceptedTagCreate() {
    return (
        <Sheet defaultOpen={true}>
            <InterceptedClose />
            <SheetContent className="sm:max-w-xl overflow-y-auto bg-black border-zinc-800">
                <SheetHeader className="mb-8">
                    <SheetTitle>Define_New_Descriptor</SheetTitle>
                    <SheetDescription>Register a new metadata tag into the district taxonomy.</SheetDescription>
                </SheetHeader>

                <div className="mt-4">
                    <TagForm />
                </div>
            </SheetContent>
        </Sheet>
    );
}
