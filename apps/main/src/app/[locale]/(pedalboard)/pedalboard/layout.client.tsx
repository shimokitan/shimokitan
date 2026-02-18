"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-neon/client';
import { Toaster } from '@shimokitan/ui';

export default function PedalboardLayoutClient({ children, user }: { children: React.ReactNode, user?: any }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authClient.signOut();
        } catch (error) {
            console.warn('SignOut_Signal_Interrupted:', error);
        } finally {
            router.push('/auth/signin');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-rose-600/50 flex flex-col">
            {/* Top Command Bar */}
            <header className="h-14 border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/pedalboard" className="flex items-center gap-2 group">
                        <div className="w-3 h-3 bg-rose-600 group-hover:rotate-45 transition-transform" />
                        <span className="text-sm font-black italic tracking-tighter text-white uppercase shrink-0">SHIMOKITAN // PEDALBOARD</span>
                    </Link>

                    <div className="h-4 w-px bg-zinc-800 shrink-0" />

                    {/* Mode Switcher (The Presets) */}
                    <nav className="flex items-center bg-zinc-950 border border-zinc-900 p-0.5 rounded overflow-hidden">
                        <Link
                            href="/pedalboard"
                            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${pathname === '/pedalboard' ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                        >
                            Resident
                        </Link>
                        <Link
                            href="/pedalboard?mode=workbench"
                            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${pathname?.includes('mode=workbench') ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                        >
                            Workbench
                        </Link>
                        <Link
                            href="/pedalboard?mode=registry"
                            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${pathname?.includes('mode=registry') ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                        >
                            Registry
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase text-white tracking-wider">
                            {user?.name || user?.email?.split('@')[0] || 'RESIDENT_GHOST'}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
                        title="Disconnect"
                    >
                        <Icon icon="lucide:power" width={16} />
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
                {children}
            </main>
            <Toaster />
        </div>
    );
}
