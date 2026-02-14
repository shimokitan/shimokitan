"use client"

import React from 'react';
import { CyberpunkShell } from '@shimokitan/ui';
import { useTime } from '../../hooks/use-time';

import { Footer } from './Footer';

export function MaintenanceLayout({ children }: { children: React.ReactNode }) {
    const time = useTime();

    return (
        <CyberpunkShell>
            <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200 uppercase overflow-hidden">
                {/* Background Decorative Grid - Large 40px grid for 'technical/restricted' look */}
                <div className="fixed inset-0 pointer-events-none opacity-20">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                {/* Top Status Bar */}
                <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 z-10 shrink-0 bg-zinc-950/20 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-violet-600 rounded-sm rotate-45" />
                        <div className="flex flex-col leading-none">
                            <h1 className="font-black tracking-tighter text-xl italic uppercase">SHIMOKITAN</h1>
                            <span className="text-zinc-600 text-[9px] font-mono tracking-[0.4em] font-bold">V.2.0.26 // CORE_OFFLINE</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest">Protocol St.</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
                                <span className="text-rose-600 text-[10px] font-mono font-bold uppercase tracking-tight">Maintenance Mode</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-zinc-900 mx-2" />
                        <div className="text-zinc-400 font-mono text-sm font-bold tracking-tighter">
                            {time}
                        </div>
                    </div>
                </header>

                <main className="flex-1 relative z-10 flex flex-col items-center justify-center overflow-y-auto hide-scroll">
                    {children}
                </main>

                <Footer minimal />
            </div>
        </CyberpunkShell>
    );
}
