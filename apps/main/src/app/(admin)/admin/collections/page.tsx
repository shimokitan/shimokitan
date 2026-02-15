
import React from 'react';
import { Icon } from '@iconify/react';
import { seedCollection } from '../actions';

export default function CollectionsPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                    Curated <span className="text-amber-500">Collections.</span>
                </h1>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                    Manage mixtapes and curated collections.
                </p>
            </header>

            <section className="bg-zinc-950/50 border border-zinc-900 p-6 space-y-6 relative overflow-hidden group max-w-2xl">
                <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                    <Icon icon="lucide:disc" width={120} />
                </div>
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon="lucide:disc" className="text-amber-500" width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">New_Collection</h2>
                </div>

                <form action={seedCollection} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Title</label>
                        <input name="title" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none transition-colors" placeholder="Collection Title" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Thesis</label>
                        <textarea name="thesis" rows={3} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none resize-none transition-colors" placeholder="Collection Thesis / Description..." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Cover URL</label>
                        <input name="coverImage" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none transition-colors" placeholder="https://..." />
                    </div>

                    <button type="submit" className="w-full py-4 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4">
                        CREATE_COLLECTION
                    </button>
                </form>
            </section>
        </div>
    );
}
