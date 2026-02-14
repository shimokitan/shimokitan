"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import { useTime } from '../../hooks/use-time';

import Link from 'next/link';

export function Navbar() {
    const time = useTime();

    return (
        <header className="h-14 border-b border-zinc-800/80 flex items-center justify-between px-4 bg-zinc-950/40 backdrop-blur-2xl z-40 shrink-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="w-3 h-3 bg-violet-600 rounded-sm rotate-45 pulse-glow group-hover:bg-violet-500 transition-colors" />
                        <div className="absolute inset-0 w-3 h-3 bg-violet-400 rounded-sm rotate-45 animate-ping opacity-20" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <h1 className="font-black tracking-tighter text-lg italic uppercase group-hover:text-violet-400 transition-colors text-white">SHIMOKITAN</h1>
                        <span className="text-zinc-500 text-[10px] font-mono tracking-[0.3em] font-bold group-hover:text-zinc-400 transition-colors">V.2.0.26 // DIGITAL_DISTRICT</span>
                    </div>
                </Link>

                <div className="hidden lg:flex gap-4 items-center h-8 border-l border-zinc-800/80 pl-6">
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-[9px] font-mono uppercase">System Status</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-emerald-500/80 text-[10px] font-mono font-bold tracking-tight uppercase">Operational</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-[9px] font-mono uppercase">Location</span>
                        <span className="text-zinc-300 text-[10px] font-mono font-bold tracking-tight uppercase">TyO-Dist_012</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-[9px] font-mono uppercase">Time</span>
                        <span className="text-zinc-100 text-[10px] font-mono font-bold tracking-tight uppercase">{time} JST</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-sm px-3 py-1.5 flex items-center gap-2 w-32 sm:w-48 md:w-64 backdrop-blur-md group focus-within:border-violet-500/50 transition-colors">
                    <Icon icon="lucide:search" width={12} height={12} className="text-zinc-500 group-focus-within:text-violet-400" />
                    <input
                        type="text"
                        placeholder="Query database..."
                        className="bg-transparent border-none outline-none text-xs w-full placeholder-zinc-500 text-zinc-300 font-mono"
                    />
                </div>
                <div className="h-8 w-px bg-zinc-800/80 mx-1 hidden sm:block" />
                <button className="w-9 h-9 rounded-sm bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center hover:bg-violet-600 transition-all hover:scale-105 active:scale-95 group">
                    <Icon icon="lucide:user" width={16} height={16} className="text-zinc-400 group-hover:text-white" />
                </button>
            </div>
        </header>
    );
}
