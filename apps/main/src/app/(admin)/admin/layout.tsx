
"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-rose-600/50">
            {/* Sidebar / Nav */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-zinc-900 z-50 p-6 flex flex-col">
                <div className="mb-12">
                    <Link href="/admin" className="block">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 bg-rose-600" />
                            <span className="text-xl font-black italic tracking-tighter text-white uppercase">SHKN_ADM</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Version_4.2.0 // Terminal</span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-1">
                    <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors ${pathname === '/admin' ? 'bg-zinc-900 text-white border-l-2 border-rose-600' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}>
                        <Icon icon="lucide:layout-dashboard" width={14} />
                        Overview
                    </Link>

                    <div className="pt-4 pb-2 px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Database</div>

                    <Link href="/admin/artifacts" className={`flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors ${pathname === '/admin/artifacts' ? 'bg-zinc-900 text-white border-l-2 border-rose-600' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
                        <Icon icon="lucide:package" width={14} />
                        Artifacts
                    </Link>
                    <Link href="/admin/entities" className={`flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors ${pathname === '/admin/entities' ? 'bg-zinc-900 text-white border-l-2 border-rose-600' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}>
                        <Icon icon="lucide:users" width={14} />
                        Entities
                    </Link>
                    <Link href="/admin/collections" className={`flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors ${pathname === '/admin/collections' ? 'bg-zinc-900 text-white border-l-2 border-rose-600' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}>
                        <Icon icon="lucide:disc" width={14} />
                        Collections
                    </Link>
                    <Link href="/admin/zines" className={`flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors ${pathname === '/admin/zines' ? 'bg-zinc-900 text-white border-l-2 border-rose-600' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'}`}>
                        <Icon icon="lucide:file-text" width={14} />
                        Zines
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-zinc-900">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-rose-500 transition-colors w-full"
                    >
                        <Icon icon="lucide:log-out" width={14} />
                        Terminal_Off
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-64 min-h-screen">
                <header className="h-16 border-b border-zinc-900 bg-black/50 backdrop-blur-sm sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                            <span className="text-rose-600 mr-2">●</span> System_Status: Nominal
                        </div>
                    </div>
                </header>

                <div className="p-8 pb-24">
                    {children}
                </div>
            </main>
        </div>
    );
}
