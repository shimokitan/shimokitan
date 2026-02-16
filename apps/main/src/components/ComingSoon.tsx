"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export function ComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center p-6 min-h-full">
            <div className="max-w-4xl w-full flex flex-col items-center">

                {/* Visual Indicator */}
                <div className="mb-12 relative">
                    <div className="w-32 h-32 border-2 border-zinc-800 rounded-full flex items-center justify-center relative">
                        <div className="absolute inset-0 border-t-2 border-violet-600 rounded-full animate-spin [animation-duration:3s]" />
                        <div className="w-24 h-24 border border-zinc-900 rounded-full flex items-center justify-center">
                            <Icon icon="lucide:lock" width={32} height={32} className="text-zinc-700" />
                        </div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded text-xs font-mono text-zinc-400 font-bold uppercase tracking-widest whitespace-nowrap">
                        Access Restricted
                    </div>
                </div>

                {/* Heading */}
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-white leading-none">
                        COMING<br />
                        <span className="text-transparent bg-zinc-900" style={{ WebkitTextStroke: '1px rgba(139, 92, 246, 0.5)' }}>SOON.</span>
                    </h2>
                    <p className="text-zinc-400 font-mono text-xs md:text-sm tracking-[0.1em] max-w-2xl mx-auto leading-relaxed">
                        SHIMOKITAN is a district for Japanese culture enthusiasts <br className="hidden md:block" />
                        who document their anime, games, and music as lived memories — <br className="hidden md:block" />
                        not data points. Inspired by the back-alleys of Shimokitazawa, <br className="hidden md:block" />
                        this is where your taste becomes a curated archive of experience.
                    </p>
                </div>

                {/* Social / Follow */}
                <div className="w-full max-w-md bg-zinc-950/50 border border-zinc-900 p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[60px] pointer-events-none" />

                    <div className="flex flex-col gap-2 mb-6 border-l-2 border-violet-600 pl-4 py-2 bg-zinc-900/40 rounded-r-xl">
                        <label className="block text-zinc-100 text-xs font-mono uppercase tracking-[0.3em] font-black">
                            Stay Connected
                        </label>
                        <p className="text-zinc-400 text-xs font-mono leading-relaxed normal-case">
                            Follow us on social media for updates on when the District opens its gates.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <a
                            href="https://x.com/shimokitan_off"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-black tracking-widest text-zinc-300 uppercase transition-all active:scale-95 cursor-pointer"
                        >
                            <Icon icon="ri:twitter-x-fill" width={14} height={14} />
                            X
                        </a>
                        <a
                            href="https://www.instagram.com/shimokitan.live/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-black tracking-widest text-zinc-300 uppercase transition-all active:scale-95 cursor-pointer"
                        >
                            <Icon icon="ri:instagram-fill" width={14} height={14} />
                            IG
                        </a>
                    </div>
                </div>

                {/* Legal links */}
                <div className="mt-8 flex gap-5 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                    <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
                    <Link href="/cookies" className="hover:text-zinc-400 transition-colors">Cookies</Link>
                </div>
            </div>
        </div>
    );
}
