
"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            router.push('/admin');
            router.refresh();
        } else {
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-black text-violet-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-rose-600/50">
            {/* NOISE & SCANLINES */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat z-50" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-40 opacity-20" />

            <div className="w-full max-w-md relative z-10">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-0.5 bg-rose-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600/70 italic">Restricted_Access</span>
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                        System <span className="text-white">Override.</span>
                    </h1>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative group">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.3em]">Access_Code</span>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(false);
                                    }}
                                    className={`bg-zinc-950 border ${error ? 'border-rose-600' : 'border-zinc-800'} px-4 py-4 text-xl font-black italic uppercase outline-none text-white focus:border-rose-600 transition-colors w-full tracking-widest`}
                                    placeholder="••••••••"
                                    autoFocus
                                />
                                {error && (
                                    <div className="absolute -bottom-6 left-0 text-[10px] font-black uppercase text-rose-600 animate-pulse">
                                        [ ACCESS_DENIED // INVALID_CREDENTIALS ]
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-4 bg-rose-600 text-black font-black italic text-xl uppercase tracking-tighter hover:bg-white transition-all shadow-[0_0_20px_rgba(225,29,72,0.2)]"
                        >
                            ESTABLISH_CONNECTION.
                        </button>
                    </div>
                </form>

                <div className="mt-16 text-[8px] font-mono text-zinc-800 uppercase tracking-widest flex justify-between items-end border-t border-zinc-900 pt-4">
                    <div>
                        SHKN_OS // ADM_V4.2<br />
                        KERNEL_BOOT: SUCCESSFUL
                    </div>
                    <div className="text-right italic">
                        SIGNAL_LOCK: ENCRYPTED<br />
                        DIRECTIVE: SEED_ONLY
                    </div>
                </div>
            </div>
        </div>
    );
}
