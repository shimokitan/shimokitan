"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-black text-violet-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-violet-600/50">
            {/* RAW TEXTURE OVERLAYS */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat z-50" />

            {/* VIOLET SPRAY */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-950/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-2xl relative z-10 py-12">

                {/* VERTICAL ACCENT */}
                <div className="absolute -left-8 top-0 h-32 w-[1px] bg-violet-600/50" />

                <header className="mb-16 relative">
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                            ECHO
                        </span>
                        <div className="flex-1 h-1 bg-violet-600/40" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight text-violet-600 md:ml-20">
                        STATION.
                    </h2>
                </header>

                <form className="max-w-xl space-y-12" onSubmit={(e) => e.preventDefault()}>

                    <div className="relative group">
                        <div className="absolute -left-10 top-2 text-violet-600/50">
                            <Icon icon="lucide:arrow-right-to-line" width={20} height={20} className="group-focus-within:translate-x-2 transition-transform" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.3em]">Identity_Input</span>
                            <input
                                type="email"
                                className="bg-transparent border-none text-2xl md:text-4xl font-black italic uppercase outline-none text-white placeholder:text-zinc-900 transition-colors w-full"
                                placeholder="ID_REQUIRED"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -left-10 top-2 text-violet-600/50">
                            <Icon icon="lucide:key-round" width={20} height={20} className="group-focus-within:rotate-45 transition-transform" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.3em]">Access_Code</span>
                            <input
                                type="password"
                                className="bg-transparent border-none text-2xl md:text-4xl font-black italic uppercase outline-none text-white placeholder:text-zinc-900 transition-colors w-full"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row items-start md:items-center gap-8">
                        <button className="relative px-12 py-4 bg-white text-black font-black italic text-xl uppercase tracking-tighter hover:bg-violet-600 hover:text-white transition-all shadow-[6px_6px_0px_#2e1065] hover:shadow-none translate-y-[0px] hover:translate-x-[2px] hover:translate-y-[2px]">
                            ESTABLISH.
                        </button>

                        <div className="flex flex-col gap-2">
                            <Link href="/auth/signup" className="text-zinc-500 text-[10px] font-black italic uppercase hover:text-white transition-colors border-b border-zinc-900 pb-0.5">
                                [ NO_IDENTIFIER? // REGISTER ]
                            </Link>
                            <span className="text-[7px] font-mono text-zinc-700 uppercase tracking-widest italic">Sector_TYO_Dist_00</span>
                        </div>
                    </div>
                </form>

                {/* BACKGROUND DECOR - NEATER */}
                <div className="absolute top-0 right-0 text-[80px] font-black text-zinc-900/20 select-none pointer-events-none uppercase italic">
                    012
                </div>
            </div>

            {/* MINIMAL FOOTER BAR */}
            <aside className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-center opacity-30 select-none">
                <div className="flex gap-6 items-center">
                    <div className="flex gap-4">
                        <Icon icon="logos:google-icon" width={14} height={14} className="grayscale" />
                        <Icon icon="lucide:github" width={14} height={14} />
                    </div>
                    <div className="w-px h-3 bg-zinc-800" />
                    <span className="text-[8px] font-mono uppercase tracking-widest leading-none">External_Sync_Ready</span>
                </div>
                <div className="text-[7px] font-mono uppercase text-right leading-none">
                    Session_Tunnel: Established // 2026.SHKN
                </div>
            </aside>
        </div>
    );
}
