"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import {
    AudioWidget,
    BentoCard,
    CyberpunkShell,
    NavigationLink,
} from '@shimokitan/ui';

import { useTime } from '../../hooks/use-time';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const time = useTime();

    return (
        <CyberpunkShell>
            <div className="bg-black text-white h-screen w-screen overflow-hidden flex flex-col font-sans selection:bg-violet-500/40 selection:text-violet-100 italic-selection">

                {/* Dynamic Background Mesh */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-900/5 rounded-full blur-[100px]" />
                </div>

                {/* --- Navbar --- */}
                <header className="h-14 border-b border-zinc-800/80 flex items-center justify-between px-4 bg-zinc-950/40 backdrop-blur-2xl z-40 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-3 h-3 bg-violet-600 rounded-sm rotate-45 pulse-glow" />
                                <div className="absolute inset-0 w-3 h-3 bg-violet-400 rounded-sm rotate-45 animate-ping opacity-20" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <h1 className="font-black tracking-tighter text-lg italic uppercase">SHIMOKITAN</h1>
                                <span className="text-zinc-600 text-[8px] font-mono tracking-[0.3em] font-bold">V.2.0.26 // DIGITAL_DISTRICT</span>
                            </div>
                        </div>

                        <div className="hidden lg:flex gap-4 items-center h-8 border-l border-zinc-800/80 pl-6">
                            <div className="flex flex-col">
                                <span className="text-zinc-500 text-[7px] font-mono uppercase">System Status</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-emerald-500/80 text-[9px] font-mono font-bold tracking-tight uppercase">Operational</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-zinc-500 text-[7px] font-mono uppercase">Location</span>
                                <span className="text-zinc-300 text-[9px] font-mono font-bold tracking-tight uppercase">TyO-Dist_012</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-zinc-500 text-[7px] font-mono uppercase">Time</span>
                                <span className="text-zinc-100 text-[9px] font-mono font-bold tracking-tight uppercase">{time} JST</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-sm px-3 py-1.5 flex items-center gap-2 w-32 sm:w-48 md:w-64 backdrop-blur-md group focus-within:border-violet-500/50 transition-colors">
                            <Icon icon="lucide:search" width={12} height={12} className="text-zinc-600 group-focus-within:text-violet-400" />
                            <input
                                type="text"
                                placeholder="Query database..."
                                className="bg-transparent border-none outline-none text-[9px] w-full placeholder-zinc-700 text-zinc-300 font-mono"
                            />
                        </div>
                        <div className="h-8 w-px bg-zinc-800/80 mx-1 hidden sm:block" />
                        <button className="w-9 h-9 rounded-sm bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center hover:bg-violet-600 transition-all hover:scale-105 active:scale-95 group">
                            <Icon icon="lucide:user" width={16} height={16} className="text-zinc-400 group-hover:text-white" />
                        </button>
                    </div>
                </header>

                {/* --- Main Content Area --- */}
                <div className="flex-1 flex p-4 gap-6 overflow-hidden relative">
                    {/* Sidebar */}
                    <nav className="hidden md:flex flex-col gap-4 shrink-0 justify-center z-50">
                        <div className="bg-zinc-950/40 border border-zinc-800/80 p-2.5 rounded-3xl backdrop-blur-2xl flex flex-col items-center gap-3.5 shadow-2xl relative w-16">
                            <NavigationLink icon="lucide:radio" label="The District" active />
                            <NavigationLink icon="lucide:disc" label="Crate Digging" />
                            <NavigationLink icon="lucide:layers" label="Pedalboard" />
                            <NavigationLink icon="lucide:ghost" label="Back-Alley" />
                            <div className="h-px bg-zinc-800/80 w-full my-1" />
                            <NavigationLink icon="lucide:headphones" label="Mixtapes" />
                            <NavigationLink icon="lucide:tv" label="Live Feed" />
                        </div>
                    </nav>

                    {/* Children / Page Content */}
                    <main className="flex-1 overflow-y-auto hide-scroll z-30">
                        {children}
                    </main>
                </div>

                <AudioWidget />

                <footer className="h-10 border-t border-zinc-800/30 bg-zinc-950/20 backdrop-blur-xl flex items-center justify-between px-6 text-[10px] text-zinc-500 shrink-0 relative z-40">
                    <div className="flex items-center gap-8">
                        <div className="w-4 h-4 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-[8px] text-zinc-100">N</div>
                        <div className="flex gap-6 font-mono">
                            <a href="#" className="hover:text-zinc-300 transition-colors tracking-tight">PRIVACY</a>
                            <a href="#" className="hover:text-zinc-300 transition-colors tracking-tight">TERMS</a>
                            <a href="#" className="hover:text-zinc-300 transition-colors tracking-tight">GUIDELINES</a>
                        </div>
                    </div>
                    <div className="font-mono opacity-60 tracking-widest text-[9px] uppercase">
                        © 2026 SHIMOKITAN PROJECT
                    </div>
                </footer>
            </div>
        </CyberpunkShell>
    );
}
