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
                        <label className="absolute -top-6 left-0 text-[9px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2 flex items-center gap-2">
                            <span className="text-rose-600">01_</span> IDENTIFIER
                        </label>
                        <input
                            type="text"
                            className="w-full bg-transparent border-b-2 border-zinc-900 text-3xl md:text-5xl font-black italic uppercase tracking-tighter outline-none focus:border-rose-600 transition-colors placeholder:text-zinc-900/50 pb-2"
                            placeholder="YOUR_TAG"
                        />
                    </div>

                    {/* TWO COLUMN RAW INPUTS - TIGHTER */}
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                        {/* EMAIL */}
                        <div className="relative group">
                            <label className="absolute -top-6 left-0 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                                <span className="text-rose-600">02_</span> DISTRICT_COMMS
                            </label>
                            <input
                                type="email"
                                className="w-full bg-transparent border-b border-zinc-900 text-lg font-mono text-zinc-100 outline-none focus:border-rose-600 transition-colors py-2 uppercase"
                                placeholder="MAIL@VOID.COM"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="relative group">
                            <label className="absolute -top-6 left-0 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                                <span className="text-rose-600">03_</span> ACCESS_CODE
                            </label>
                            <input
                                type="password"
                                className="w-full bg-transparent border-b border-zinc-900 text-lg font-mono text-zinc-100 outline-none focus:border-rose-600 transition-colors py-2 uppercase"
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
                <div className="mt-16 pt-8 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-30 select-none">
                    <span className="text-[8px] font-mono uppercase tracking-widest">LOC: TYO_DIST</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest">PRT: CNS_99</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest">STS: WAIT_USER</span>
                    <span className="text-[8px] font-mono uppercase tracking-widest">SYS: SHKN_OS</span>
                </div>
            </div>
        </div>
    );
}
