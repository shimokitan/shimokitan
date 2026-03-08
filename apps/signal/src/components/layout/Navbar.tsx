"use client";

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export function Navbar() {
    return (
        <header className="h-14 border-b border-border flex items-center justify-between px-4 sm:px-8 bg-background/80 backdrop-blur-2xl z-40 sticky top-0 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="w-3 h-3 bg-foreground rounded-sm rotate-45 group-hover:bg-foreground/80 transition-colors" />
                        <div className="absolute inset-0 w-3 h-3 bg-foreground/50 rounded-sm rotate-45 animate-ping opacity-20" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <h1 className="font-black tracking-tighter text-lg italic uppercase group-hover:text-foreground/80 transition-colors text-foreground">SHIMOKITAN</h1>
                        <span className="text-muted-foreground text-[10px] font-mono tracking-[0.3em] font-bold group-hover:text-muted-foreground/80 transition-colors">V.2.0.26 // DIGITAL_DISTRICT</span>
                    </div>
                    <div className="ml-2 bg-foreground text-background text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm tracking-widest leading-none self-center">
                        SIGNAL
                    </div>
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-4 text-xs font-mono font-bold tracking-tight uppercase text-muted-foreground">
                    <Link href="/" className="text-foreground hover:underline underline-offset-4">Open (12)</Link>
                    <Link href="/" className="hover:text-foreground transition-colors">Resolved (40)</Link>
                    <Link href="/" className="hover:text-foreground transition-colors">All</Link>
                </div>

                <div className="h-4 w-px bg-border hidden sm:block" />

                <a
                    href="https://shimokitan.live"
                    className="flex items-center gap-2 px-3 py-1.5 bg-foreground text-background hover:bg-foreground/80 transition-colors text-[10px] font-black uppercase tracking-widest rounded-sm shadow-sm"
                >
                    Back to district
                    <Icon icon="lucide:arrow-up-right" width={12} />
                </a>
            </div>
        </header>
    );
}
