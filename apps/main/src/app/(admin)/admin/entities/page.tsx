
import React from 'react';
import { Icon } from '@iconify/react';
import { seedEntity } from '../actions';

export default function EntitiesPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                    Known <span className="text-violet-600">Entities.</span>
                </h1>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                    Manage known entities, organizations, and individuals.
                </p>
            </header>

            <section className="bg-zinc-950/50 border border-zinc-900 p-6 space-y-6 relative overflow-hidden group max-w-2xl">
                <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                    <Icon icon="lucide:user-plus" width={120} />
                </div>
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon="lucide:user-plus" className="text-violet-600" width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">New_Entity</h2>
                </div>

                <form action={seedEntity} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Name</label>
                            <input name="name" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors" placeholder="Entity Name" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Type</label>
                            <select name="type" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors">
                                <option value="individual">INDIVIDUAL</option>
                                <option value="organization">ORGANIZATION</option>
                                <option value="agency">AGENCY</option>
                                <option value="circle">CIRCLE</option>
                                <option value="staff">STAFF</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Bio</label>
                        <textarea name="bio" rows={3} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none resize-none transition-colors" placeholder="About this entity..." />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Avatar URL</label>
                        <input name="avatarUrl" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors" placeholder="https://..." />
                    </div>

                    <button type="submit" className="w-full py-4 bg-violet-600 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4">
                        REGISTER_ENTITY
                    </button>
                </form>
            </section>
        </div>
    );
}
