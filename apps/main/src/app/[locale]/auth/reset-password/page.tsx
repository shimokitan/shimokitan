"use client"

import { Icon } from '@iconify/react';
import { authClient } from '@/lib/auth-neon/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { PasswordInput } from '@/components/auth/PasswordInput';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [isPending, setIsPending] = useState(false);

    async function handleReset(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            toast.error('Sync_Error: Passwords do not match.');
            setIsPending(false);
            return;
        }

        if (!token) {
            toast.error('Auth_Error: Missing recovery token.');
            setIsPending(false);
            return;
        }

        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token,
            });

            if (error) {
                toast.error(`Reset_Failure: ${error.message || 'Signal_Corrupted'}`);
            } else {
                toast.success('Identity_Re-established: Access code updated.');
                router.push('/auth/signin');
            }
        } catch (err: any) {
            const errorMessage = err.body?.message || err.message || 'Signal_Corrupted';
            toast.error(`System_Error: ${errorMessage}`);
        } finally {
            setIsPending(false);
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-black text-rose-600 flex flex-col items-center justify-center p-6 font-mono text-center">
                <Icon icon="lucide:alert-octagon" width={64} className="mb-6 animate-pulse" />
                <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4">CRITICAL_ERROR.</h1>
                <p className="max-w-md text-xs uppercase tracking-widest leading-relaxed text-zinc-500 mb-8 px-12">
                    RECOVERY_TOKEN_MISSING_OR_MALFORMED. PLEASE INITIATE THE RECOVERY PROTOCOL AGAIN.
                </p>
                <Link href="/auth/forgot-password" className="px-12 py-4 bg-rose-600 text-black font-black italic text-sm uppercase tracking-tighter hover:bg-white transition-all">
                    REINITIATE.
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-violet-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-violet-600/50">
            {/* RAW TEXTURE OVERLAYS */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat z-50" />

            <div className="w-full max-w-2xl relative z-10 py-12">
                {/* VERTICAL ACCENT */}
                <div className="absolute -left-8 top-0 h-32 w-[1px] bg-violet-600/50" />

                <header className="mb-16 relative">
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-white">
                            SIGNAL
                        </span>
                        <div className="flex-1 h-1 bg-violet-600/40" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-tight text-violet-600 md:ml-20">
                        RECODE.
                    </h2>
                </header>

                <form className="max-w-xl space-y-12" onSubmit={handleReset}>
                    <div className="relative group">
                        <div className="absolute -left-10 top-2 text-violet-600/50">
                            <Icon icon="lucide:key-round" width={20} height={20} className="group-focus-within:rotate-45 transition-transform" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-baseline justify-between">
                                <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">New Password</label>
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest hidden sm:block">Recode_Input</span>
                            </div>
                            <PasswordInput
                                name="password"
                                required
                                className="text-xl py-2 text-white placeholder:text-zinc-700"
                                placeholder="••••••••"
                                accentColor="violet"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -left-10 top-2 text-violet-600/50">
                            <Icon icon="lucide:shield-check" width={20} height={20} className="group-focus-within:scale-110 transition-transform" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-baseline justify-between">
                                <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Confirm New Password</label>
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest hidden sm:block">Verify_Recode</span>
                            </div>
                            <PasswordInput
                                name="confirmPassword"
                                required
                                className="text-xl py-2 text-white placeholder:text-zinc-700"
                                placeholder="••••••••"
                                accentColor="violet"
                            />
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row items-start md:items-center gap-8">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="relative px-12 py-4 bg-white text-black font-black italic text-xl uppercase tracking-tighter hover:bg-violet-600 hover:text-white transition-all shadow-[6px_6px_0px_#2e1065] hover:shadow-none translate-y-[0px] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'ENCRYPTING...' : 'RE-ESTABLISH.'}
                        </button>

                        <div className="flex flex-col gap-2">
                            <Link href="/auth/signin" className="text-zinc-500 text-[10px] font-black italic uppercase hover:text-white transition-colors border-b border-zinc-900 pb-0.5">
                                [ CANCEL? // RETURN_TO_BASE ]
                            </Link>
                            <span className="text-[7px] font-mono text-zinc-700 uppercase tracking-widest italic">Sector_TYO_Dist_00</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-violet-600 font-mono text-xs animate-pulse uppercase">Recoding_Handshake...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
