
import React from 'react';
import TagForm from '../TagForm';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default async function NewTagPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header className="flex items-center justify-between border-b border-zinc-900 pb-6">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                        Create_Tag
                    </h1>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">
                        Manual Taxonomy Entry
                    </p>
                </div>
                <Link href="/pedalboard/tags" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white flex items-center gap-2">
                    <Icon icon="lucide:arrow-left" /> BACK_TO_TAGS
                </Link>
            </header>

            <div className="bg-zinc-950/50 border border-zinc-900 p-8 rounded-lg">
                <TagForm />
            </div>
        </div>
    );
}
