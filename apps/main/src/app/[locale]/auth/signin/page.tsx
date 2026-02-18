"use client"

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-neon/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useState, FormEvent, Suspense } from 'react';

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackURL = searchParams.get('callbackUrl') || '/pedalboard';
    const [isPending, setIsPending] = useState(false);

    async function handleSignIn(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
                callbackURL
            });

            if (error) {
                toast.error(`Auth_Failure: ${error.message || 'Signal_Corrupted'}`);
            } else {
                toast.success('Identity_Established: Welcome back.');
                router.push(callbackURL);
            }
        } catch (err: any) {
            toast.error('System_Critical: Connection to Neon Auth lost.');
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="min-h-screen bg-black text-violet-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-violet-600/50">
            {/* RAW TEXTURE OVERLAYS */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat z-50" />

            {/* VIOLET SPRAY */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-950/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-2xl relative z-10 py-12">

                {/* VERTICAL ACCENT */}
                <div className="absolute -left-8 top-0 h-32 w-[1px] bg-violet-600/50" />

                <header className="mb-16 relative">
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                            ECHO
                        </span>
                        <div className="flex-1 h-1 bg-violet-600/40" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight text-violet-600 md:ml-20">
                        STATION.
                    </h2>
                </header>

                <form className="max-w-xl space-y-12" onSubmit={handleSignIn}>

                    <div className="relative group">
                        <div className="absolute -left-10 top-2 text-violet-600/50">
                            <Icon icon="lucide:arrow-right-to-line" width={20} height={20} className="group-focus-within:translate-x-2 transition-transform" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-baseline justify-between">
                                <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Email / Username</label>
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest hidden sm:block">Identity_Input</span>
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                className="bg-transparent border-b border-zinc-800 focus:border-violet-600 text-xl py-2 font-medium outline-none text-white placeholder:text-zinc-700 transition-colors w-full"
                                placeholder="user@example.com"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -left-10 top-2 text-violet-600/50">
                            <Icon icon="lucide:key-round" width={20} height={20} className="group-focus-within:rotate-45 transition-transform" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-baseline justify-between">
                                <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Password</label>
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest hidden sm:block">Access_Code</span>
                            </div>
                            <input
                                type="password"
                                name="password"
                                required
                                className="bg-transparent border-b border-zinc-800 focus:border-violet-600 text-xl py-2 font-medium outline-none text-white placeholder:text-zinc-700 transition-colors w-full"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row items-start md:items-center gap-8">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="relative px-12 py-4 bg-white text-black font-black italic text-xl uppercase tracking-tighter hover:bg-violet-600 hover:text-white transition-all shadow-[6px_6px_0px_#2e1065] hover:shadow-none translate-y-[0px] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'NEGOTIATING...' : 'ESTABLISH.'}
                        </button>

                        <div className="flex flex-col gap-2">
                            <Link href="/auth/signup" className="text-zinc-500 text-[10px] font-black italic uppercase hover:text-white transition-colors border-b border-zinc-900 pb-0.5">
                                [ NO_IDENTIFIER? // REGISTER ]
                            </Link>
                            <span className="text-[7px] font-mono text-zinc-700 uppercase tracking-widest italic">Sector_TYO_Dist_00</span>
                        </div>
                    </div>
                </form>

                {/* BACKGROUND DECOR - NEATER */}
                <div className="absolute top-0 right-0 text-[80px] font-black text-zinc-900/20 select-none pointer-events-none uppercase italic">
                    012
                </div>
            </div>

            {/* MINIMAL FOOTER BAR - MATCHING MAIN FOOTER STYLE */}
            <aside className="fixed bottom-0 left-0 w-full border-t border-zinc-800/30 bg-zinc-950/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between px-6 py-4 text-[10px] shrink-0 z-50 gap-4 text-zinc-500">
                <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono uppercase tracking-tight items-center">
                    <div className="flex gap-4">
                        <div
                            onClick={async () => {
                                await authClient.signIn.social({ provider: 'google', callbackURL });
                            }}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <Icon icon="logos:google-icon" width={14} height={14} className="grayscale group-hover:grayscale-0 transition-all" />
                            <span className="group-hover:text-white transition-colors">GOOGLE_UPLINK</span>
                        </div>
                        <div
                            onClick={async () => {
                                await authClient.signIn.social({ provider: 'github', callbackURL });
                            }}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <Icon icon="lucide:github" width={14} height={14} className="group-hover:text-white transition-colors" />
                            <span className="group-hover:text-white transition-colors">GITHUB_BRIDGE</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex gap-5 font-mono uppercase tracking-widest text-[8px] md:text-[10px]">
                        <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-zinc-300 transition-colors">Cookies</Link>
                    </div>
                    <div className="font-mono tracking-[0.3em] text-[8px] md:text-[10px] uppercase font-bold opacity-40">
                        © 2026 SHIMOKITAN
                    </div>
                </div>
            </aside>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-violet-600 font-mono text-xs animate-pulse uppercase">Syncing_Bridges...</div>}>
            <SignInContent />
        </Suspense>
    );
}
