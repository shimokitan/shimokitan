"use client"

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useMutation } from '@tanstack/react-query';

export function ComingSoon() {
    const [time, setTime] = useState("");
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (value === "") {
            setIsValid(null);
        } else {
            setIsValid(emailRegex.test(value));
        }
    };

    const mutation = useMutation({
        mutationFn: async (newEmail: string) => {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to register');
            }
            return response.json();
        },
        onSuccess: () => {
            setEmail("");
            setIsValid(null);
            alert("COORDINATES_RECEIVED // TRANSMISSION_COMPLETE");
        },
        onError: (error) => {
            alert(`UPLINK_FAILURE: ${error.message}`);
        }
    });

    const handleSubmit = () => {
        if (isValid && email) {
            mutation.mutate(email);
        }
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200 uppercase">
            {/* Background Decorative Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Top Navigation / Status Bar */}
            <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-violet-600 rounded-sm rotate-45" />
                    <div className="flex flex-col leading-none">
                        <h1 className="font-black tracking-tighter text-xl italic uppercase">SHIMOKITAN</h1>
                        <span className="text-zinc-600 text-[9px] font-mono tracking-[0.4em] font-bold">V.2.0.26 // CORE_OFFLINE</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest">Protocol St.</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
                            <span className="text-rose-600 text-[10px] font-mono font-bold uppercase tracking-tight">Maintenance Mode</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-zinc-900 mx-2" />
                    <div className="text-zinc-400 font-mono text-sm font-bold tracking-tighter">
                        {time}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <div className="max-w-4xl w-full flex flex-col items-center">

                    {/* Visual Indicator */}
                    <div className="mb-12 relative">
                        <div className="w-32 h-32 border-2 border-zinc-800 rounded-full flex items-center justify-center relative">
                            <div className="absolute inset-0 border-t-2 border-violet-600 rounded-full animate-spin [animation-duration:3s]" />
                            <div className="w-24 h-24 border border-zinc-900 rounded-full flex items-center justify-center">
                                <Icon icon="lucide:lock" width={32} height={32} className="text-zinc-700" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-widest">
                            Access Restricted
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-white leading-none">
                            COMING<br />
                            <span className="text-transparent bg-zinc-900" style={{ WebkitTextStroke: '1px rgba(139, 92, 246, 0.5)' }}>SOON.</span>
                        </h2>
                        <p className="text-zinc-500 font-mono text-xs md:text-sm tracking-[0.2em] uppercase max-w-lg mx-auto leading-relaxed">
                            We are recalibrating the district conduits. <br className="hidden md:block" />
                            Expected synchronization in the next cycle.
                        </p>
                    </div>

                    {/* Action / Notification */}
                    <div className="w-full max-w-md bg-zinc-950/50 border border-zinc-900 p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[60px] pointer-events-none" />

                        <div className="flex flex-col gap-2 mb-8 border-l-2 border-violet-600 pl-4 py-2 bg-zinc-900/40 rounded-r-xl">
                            <label className="block text-zinc-100 text-[10px] font-mono uppercase tracking-[0.3em] font-black">
                                Receive Broadcast Ping
                            </label>
                            <p className="text-zinc-400 text-[11px] font-mono leading-relaxed normal-case">
                                We only use your email to notify you when the District opens. <span className="text-violet-400 font-bold uppercase tracking-tighter">No spam, no selling data.</span>
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="YOUR_COMMS@ENDPOINT.ZIP"
                                    className={`w-full bg-black border rounded-xl px-4 py-3 text-xs font-mono text-zinc-300 placeholder:text-zinc-700 focus:outline-none transition-all ${isValid === false ? 'border-rose-900 focus:border-rose-600' : 'border-zinc-800 focus:border-violet-600'
                                        }`}
                                />
                                {isValid === false && (
                                    <div className="absolute -bottom-5 left-1 text-[8px] text-rose-600 font-mono font-bold tracking-widest italic animate-pulse">
                                        INVALID_ENDPOINT_FORMAT
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={!isValid || mutation.isPending}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all shrink-0 ${isValid && !mutation.isPending
                                    ? 'bg-zinc-100 text-black hover:bg-white active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                    : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                                    }`}
                            >
                                {mutation.isPending ? 'UPLINKING...' : 'SUBSCRIBE'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer / Meta Data */}
            <footer className="h-20 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between px-8 z-10 shrink-0 text-zinc-600 font-mono text-[9px] gap-4 md:gap-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                        <span className="tracking-widest uppercase">ESTABLISHING CONNECTION...</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                        <span className="tracking-widest uppercase">ENCRYPTED // SHA-256</span>
                    </div>
                </div>
                <div className="flex gap-8 items-center">
                    <div className="flex gap-4">
                        <button className="hover:text-zinc-400 transition-colors uppercase tracking-widest">Twitter</button>
                        <button className="hover:text-zinc-400 transition-colors uppercase tracking-widest">Discord</button>
                    </div>
                    <div className="tracking-[0.3em] font-bold uppercase">
                        © 2026 SHIMOKITAN_PROJECT
                    </div>
                </div>
            </footer>
        </div>
    );
}
