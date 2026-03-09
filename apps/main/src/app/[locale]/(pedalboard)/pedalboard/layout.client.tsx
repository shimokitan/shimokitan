"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { authClient } from '@/lib/auth-neon/client';
import { Toaster } from '@shimokitan/ui';

export default function PedalboardLayoutClient({ children, user }: { children: React.ReactNode, user?: any }) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-rose-600/50 flex flex-col overflow-hidden">
            {/* Main Navbar */}
            <Navbar />

            {/* Main Workspace */}
            <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500 overflow-y-auto custom-scroll min-h-0">
                {children}
            </main>

            <Footer />
            <Toaster />
        </div>
    );
}
