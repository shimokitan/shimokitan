"use client"

import React from 'react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-zinc-800/30 bg-zinc-950/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between px-6 py-4 text-[9px] text-zinc-500 shrink-0 relative z-40 gap-4 w-full">
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono uppercase tracking-tight">
                <a href="mailto:social@shimokitan.live" className="hover:text-violet-400 transition-colors">SOCIAL@SHIMOKITAN.LIVE</a>
                <a href="mailto:feedback@shimokitan.live" className="hover:text-violet-400 transition-colors">FEEDBACK@SHIMOKITAN.LIVE</a>
                <a href="mailto:dmca@shimokitan.live" className="hover:text-violet-400 transition-colors">DMCA@SHIMOKITAN.LIVE</a>
                <a href="mailto:support@shimokitan.live" className="hover:text-violet-400 transition-colors">SUPPORT@SHIMOKITAN.LIVE</a>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex gap-5 font-mono uppercase tracking-widest">
                    <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
                    <Link href="/community-guidelines" className="hover:text-zinc-300 transition-colors">Guidelines</Link>
                    <Link href="/copyright" className="hover:text-zinc-300 transition-colors">Copyright</Link>
                    <Link href="/dmca" className="hover:text-zinc-300 transition-colors">DMCA</Link>
                    <Link href="/cookies" className="hover:text-zinc-300 transition-colors">Cookies</Link>
                </div>
                <div className="font-mono opacity-40 tracking-[0.3em] text-[8px] uppercase font-bold">
                    © 2026 SHIMOKITAN
                </div>
            </div>
        </footer>
    );
}
