"use client"

import React from 'react';
import {
    AudioWidget,
    CyberpunkShell,
    NavigationLink,
} from '@shimokitan/ui';

import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <CyberpunkShell>
            <div className="bg-black text-white h-screen w-screen overflow-hidden flex flex-col font-sans selection:bg-violet-500/40 selection:text-violet-100 italic-selection">

                {/* Dynamic Background Mesh */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-900/5 rounded-full blur-[100px]" />
                </div>

                <Navbar />

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

                <Footer />
            </div>
        </CyberpunkShell>
    );
}
