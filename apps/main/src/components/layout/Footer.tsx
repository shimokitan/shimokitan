"use client"

import React from 'react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-zinc-800/30 bg-zinc-950/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between px-6 py-4 text-[10px] text-zinc-400 shrink-0 relative z-40 gap-4 w-full">
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono uppercase tracking-tight items-center">
                <Link href="/contact" className="hover:text-violet-400 transition-colors">CONTACT US</Link>
                <div className="w-px h-3 bg-zinc-800" />
                <a href="https://x.com/shimokitan_off" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">X</a>
                <a href="https://www.instagram.com/shimokitan.live/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">Instagram</a>
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
                <div className="font-mono opacity-60 tracking-[0.3em] text-[10px] uppercase font-bold">
                    © 2026 SHIMOKITAN
                </div>
            </div>
        </footer>
    );
}
