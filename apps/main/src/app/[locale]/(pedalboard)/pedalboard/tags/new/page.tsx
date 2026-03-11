
import React from 'react';
import TagForm from '../TagForm';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';

export default async function NewTagPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header className="border-b border-zinc-900 pb-6">
                <Link 
                    href="/pedalboard/tags" 
                    className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all mb-6"
                >
                    <Icon icon="lucide:arrow-left" width={14} />
                    Return_to_Registry
                </Link>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                        Create_Tag
                    </h1>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">
                        Manual Taxonomy Entry
                    </p>
                </div>
            </header>

            <div className="bg-zinc-950/50 border border-zinc-900 p-8 rounded-lg">
                <TagForm />
            </div>
        </div>
    );
}
