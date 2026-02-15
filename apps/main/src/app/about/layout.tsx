
import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-violet-600/50 flex flex-col">
            <Navbar />
            <div className="flex-1 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12 pt-12 pb-20">
                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-8 text-zinc-500 hover:text-white transition-colors group">
                            <Icon icon="lucide:arrow-left" width={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-mono uppercase tracking-widest">Return_to_District</span>
                        </Link>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center border border-violet-600/50">
                                <Icon icon="lucide:book-open" width={16} className="text-violet-400" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest text-white">Documentation</span>
                        </div>

                        <nav className="space-y-1">
                            <Link href="/about" className="flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-sm transition-colors group">
                                <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-rose-500 transition-colors" />
                                About_Project
                            </Link>
                            <Link href="/about/vision" className="flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-sm transition-colors group">
                                <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-violet-500 transition-colors" />
                                Vision_Statement
                            </Link>
                            <Link href="/about/changelog" className="flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-sm transition-colors group">
                                <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-emerald-500 transition-colors" />
                                System_Changelog
                            </Link>
                        </nav>
                    </div>

                    <div className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Contributors</h4>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-[8px] font-mono text-zinc-500">
                                    USR
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="lg:col-span-3 min-h-[60vh]">
                    <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-zinc-400 prose-p:font-light prose-strong:text-white prose-code:text-rose-400 prose-code:bg-rose-950/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                        {children}
                    </article>
                </main>
            </div>
            <Footer />
        </div>
    );
}
