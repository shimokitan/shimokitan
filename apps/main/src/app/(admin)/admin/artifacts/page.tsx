
import React from 'react';
import { Icon } from '@iconify/react';
import { seedArtifact } from '../actions';

export default function ArtifactsPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                    Manage <span className="text-rose-600">Artifacts.</span>
                </h1>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                    Create and manage system artifacts.
                </p>
            </header>

            <section className="bg-zinc-950/50 border border-zinc-900 p-6 space-y-6 relative overflow-hidden group max-w-2xl">
                <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                    <Icon icon="lucide:package-plus" width={120} />
                </div>
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon="lucide:package-plus" className="text-rose-600" width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">New_Artifact</h2>
                </div>

                <form action={seedArtifact} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Title</label>
                            <input name="title" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none transition-colors" placeholder="Artifact Title" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Description</label>
                            <textarea name="description" rows={3} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none resize-none transition-colors" placeholder="Brief description..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Category</label>
                            <select name="category" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none transition-colors">
                                <option value="anime">ANIME</option>
                                <option value="music">MUSIC</option>
                                <option value="vtuber">VTUBER</option>
                                <option value="asmr">ASMR</option>
                                <option value="zine">ZINE</option>
                                <option value="art">ART</option>
                                <option value="game">GAME</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Description</label>
                        <textarea name="description" rows={3} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none resize-none transition-colors" placeholder="Brief description..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Cover URL</label>
                            <input name="coverImage" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none transition-colors" placeholder="https://..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Initial Score</label>
                            <input name="score" type="number" defaultValue="0" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none transition-colors" />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-rose-600 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4">
                        REGISTER_ARTIFACT
                    </button>
                </form>
            </section>
        </div>
    );
}
