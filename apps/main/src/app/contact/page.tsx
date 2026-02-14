"use client"

import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CyberpunkShell } from '@shimokitan/ui';
import { Icon } from '@iconify/react';

export default function ContactPage() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <CyberpunkShell>
            <div className="min-h-screen w-full bg-black text-zinc-300 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200">
                {/* Dynamic Background Mesh */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-900/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
                </div>

                <Navbar />

                <main className="flex-1 relative z-10 flex items-center justify-center p-6">
                    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 items-start">

                        {/* Contact Info */}
                        <div className="flex-1 space-y-8 mt-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-4">
                                    ESTABLISH<br />CONNECTION
                                </h1>
                                <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                                    Have a question, feedback, or just want to say hello?
                                    Open a channel and reach out to the Shimokitan team.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-violet-500/50 transition-colors">
                                        <Icon icon="lucide:mail" className="text-violet-400 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold mb-1">Email</h3>
                                        <a href="mailto:support@shimokitan.live" className="text-zinc-500 hover:text-violet-400 transition-colors block">support@shimokitan.live</a>
                                        <a href="mailto:business@shimokitan.live" className="text-zinc-500 hover:text-violet-400 transition-colors block">business@shimokitan.live</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-violet-500/50 transition-colors">
                                        <Icon icon="lucide:map-pin" className="text-violet-400 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-mono uppercase tracking-wider text-white font-bold mb-1">HQ Location</h3>
                                        <p className="text-zinc-500">
                                            Sector 7, Shimokitazawa District<br />
                                            Tokyo, Neo-Japan 155-0031
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="flex-1 w-full relative">
                            <div className="absolute inset-0 bg-violet-500/5 blur-3xl -z-10 rounded-full" />
                            <div className="bg-zinc-950/50 border border-zinc-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative overflow-hidden group hover:border-zinc-700/50 transition-colors">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

                                {submitted ? (
                                    <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-2">
                                            <Icon icon="lucide:check" className="text-emerald-500 w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Transmission Sent</h3>
                                        <p className="text-zinc-400 max-w-xs">
                                            Your message has been successfully encrypted and delivered to our secure servers.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="mt-6 text-sm font-mono uppercase tracking-wider text-violet-400 hover:text-white transition-colors"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 block">Identity</label>
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                required
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 block">Comms Channel</label>
                                            <input
                                                type="email"
                                                placeholder="email@example.com"
                                                required
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 block">Encryption Subject</label>
                                            <select className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all appearance-none">
                                                <option>General Inquiry</option>
                                                <option>Support Request</option>
                                                <option>Partnership</option>
                                                <option>Report Bug</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2 block">Transmission</label>
                                            <textarea
                                                rows={5}
                                                placeholder="Type your message..."
                                                required
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-md transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Icon icon="lucide:loader-2" className="animate-spin" />
                                                    <span>Transmitting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Send Transmission</span>
                                                    <Icon icon="lucide:arrow-right" className="group-hover/btn:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </CyberpunkShell>
    );
}
