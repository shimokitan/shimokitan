
import React from 'react';
import { Icon } from '@iconify/react';
import { seedZine } from '../actions';
import { getDb } from '@shimokitan/db';

export default async function ZinesPage() {
    const db = getDb();
    const artifacts = db ? await db.query.artifacts.findMany({
        columns: { id: true, title: true }
    }) : [];

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                    Underground <span className="text-emerald-500">Zines.</span>
                </h1>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                    Publish zines and articles.
                </p>
            </header>

            <section className="bg-zinc-950/50 border border-zinc-900 p-6 space-y-6 relative overflow-hidden group max-w-2xl">
                <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                    <Icon icon="lucide:file-text" width={120} />
                </div>
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon="lucide:file-text" className="text-emerald-500" width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">New_Zine</h2>
                </div>

                <form action={seedZine} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Related Artifact</label>
                            <select name="artifactId" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors">
                                <option value="">Select Artifact</option>
                                {artifacts.map((a: any) => (
                                    <option key={a.id} value={a.id}>{a.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Author</label>
                            <input name="author" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" placeholder="Author Name" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Content</label>
                        <textarea name="content" required rows={4} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none resize-none transition-colors" placeholder="Write content..." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Resonance Score</label>
                        <input name="resonance" type="number" defaultValue="0" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" />
                    </div>

                    <button type="submit" className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4">
                        PUBLISH_ZINE
                    </button>
                </form>
            </section>
        </div>
    );
}
