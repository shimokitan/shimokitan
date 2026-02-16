"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-rose-600/50">
            {/* RAW TEXTURE OVERLAYS */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat z-50" />

            {/* DECONSTRUCTED TEXT - SCALED DOWN */}
            <div className="absolute top-10 left-10 rotate-12 select-none pointer-events-none opacity-[0.03]">
                <span className="text-[100px] font-black uppercase tracking-tighter italic">CENSUS</span>
            </div>

            {/* THE "ZINE" FORM */}
            <div className="w-full max-w-2xl relative z-10 py-12">

                {/* HUD ACCENTS */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-rose-600/50" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-rose-600/50" />

                <header className="mb-16 relative">
                    <div className="absolute -left-6 top-0 h-full w-1 bg-rose-600" />
                    <span className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.4em] mb-3 block">
                        PROTOCOL_ENTRY // V.9.0
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.8]">
                        NEW<br />
                        <span className="text-rose-600">STREET</span><br />
                        BLOOD.
                    </h1>
                </header>

                <form className="space-y-16" onSubmit={(e) => e.preventDefault()}>
                    {/* INPUT 01: HANDLE */}
                    <div className="relative group">
                        <label className="absolute -top-6 left-0 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-950 px-2 flex items-center gap-2">
                            <span className="text-rose-600">01_</span> USERNAME <span className="text-zinc-700 font-mono text-[9px] hidden sm:inline-block">{'//'} IDENTIFIER</span>
                        </label>
                        <input
                            type="text"
                            className="w-full bg-transparent border-b-2 border-zinc-900 text-3xl font-black italic uppercase tracking-tighter outline-none focus:border-rose-600 text-white placeholder:text-zinc-800 transition-colors pb-2"
                            placeholder="username"
                        />
                    </div>

                    {/* TWO COLUMN RAW INPUTS - TIGHTER */}
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                        {/* EMAIL */}
                        <div className="relative group">
                            <label className="absolute -top-6 left-0 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-950 px-2 flex items-center gap-2">
                                <span className="text-rose-600">02_</span> EMAIL <span className="text-zinc-700 font-mono text-[9px] hidden sm:inline-block">{'//'} COMM_LINK</span>
                            </label>
                            <input
                                type="email"
                                className="w-full bg-transparent border-b border-zinc-900 text-lg font-medium text-zinc-100 outline-none focus:border-rose-600 placeholder:text-zinc-700 transition-colors py-2"
                                placeholder="email@example.com"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="relative group">
                            <label className="absolute -top-6 left-0 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-950 px-2 flex items-center gap-2">
                                <span className="text-rose-600">03_</span> PASSWORD <span className="text-zinc-700 font-mono text-[9px] hidden sm:inline-block">{'//'} ACCESS_CODE</span>
                            </label>
                            <input
                                type="password"
                                className="w-full bg-transparent border-b border-zinc-900 text-lg font-medium text-zinc-100 outline-none focus:border-rose-600 placeholder:text-zinc-700 transition-colors py-2"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* ACTION AREA - SCALED DOWN */}
                    <div className="pt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
                        <div className="flex flex-col gap-4 max-w-sm">
                            <p className="text-[9px] font-mono text-zinc-600 uppercase leading-snug tracking-tighter italic">
                                Total data resonance established upon entry. Welcome to the archive.
                            </p>
                            <Link href="/auth/signin" className="text-xs font-black italic uppercase text-zinc-500 hover:text-white transition-colors border-b border-zinc-900 pb-1 w-fit">
                                [ BACK_ALLEY_LOGON ]
                            </Link>
                        </div>

                        <button className="relative px-8 py-4 group/btn">
                            <div className="absolute inset-0 bg-rose-600 -rotate-1 group-hover/btn:rotate-0 transition-transform shadow-[6px_6px_0px_#000]" />
                            <span className="relative z-10 text-xl font-black italic tracking-tighter uppercase text-black">
                                ENTER_SECTOR
                            </span>
                        </button>
                    </div>
                </form>

                {/* HUD SPECS - CONTEXTUAL */}
                {/* FOOTER - MATCHING MAIN FOOTER STYLE */}
                <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 select-none">
                    <nav className="flex gap-5 font-mono uppercase tracking-widest text-[8px] md:text-[10px]">
                        <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
                    </nav>
                    <span className="font-mono tracking-[0.3em] text-[8px] md:text-[10px] uppercase font-bold opacity-40">
                        © 2026 SHIMOKITAN
                    </span>
                </div>
            </div>
        </div>
    );
}
