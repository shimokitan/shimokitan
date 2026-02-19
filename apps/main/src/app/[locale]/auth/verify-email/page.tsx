'use client';

import { authClient } from '@/lib/auth-neon/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'waiting'>('verifying');

    useEffect(() => {
        async function check() {
            // 1. Check if we are already authenticated
            const { data } = await authClient.getSession();
            if (data?.user) {
                setStatus('success');
                setTimeout(() => {
                    router.push('/pedalboard');
                }, 2000);
                return;
            }

            // 2. If no session, check for token
            if (token) {
                try {
                    const { error } = await authClient.verifyEmail({
                        query: { token: token }
                    });

                    if (error) {
                        setStatus('error');
                    } else {
                        setStatus('success');
                        setTimeout(() => router.push('/pedalboard'), 2000);
                    }
                } catch (err) {
                    setStatus('error');
                }
            } else {
                // No token and no session -> User might have just landed here after signup
                setStatus('waiting');
            }
        }

        check();
    }, [token, router]);

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-rose-600/50">
            {/* RAW TEXTURE OVERLAYS */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat z-50" />

            <div className="w-full max-w-md relative z-10 text-center space-y-8">
                {/* HUD CROSSHAIRS */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-[1px] h-24 bg-rose-600/20" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12 w-[1px] h-24 bg-rose-600/20" />

                <header className="space-y-4">
                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.4em]">
                        SIGNAL_VERIFICATION_PROTOCOL
                    </div>
                </header>

                <div className="border border-zinc-900 bg-zinc-900/10 p-12 backdrop-blur-sm relative group overflow-hidden">
                    {/* CORNER ACCENTS */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700" />

                    {status === 'verifying' && (
                        <div className="space-y-6 animate-pulse">
                            <Icon icon="lucide:radio" width={48} className="mx-auto text-zinc-500" />
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                                TUNING_FREQUENCY...
                            </h2>
                            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                                Establishing secure handshake
                            </p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="w-12 h-12 bg-rose-600 text-black mx-auto flex items-center justify-center">
                                <Icon icon="lucide:check-circle-2" width={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                                    SIGNAL_LOCKED
                                </h2>
                                <div className="h-0.5 w-12 bg-rose-600 mx-auto my-3" />
                                <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                                    Identity confirmed. Entering sector...
                                </p>
                            </div>
                        </div>
                    )}

                    {status === 'waiting' && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-rose-600 mb-6">
                                <Icon icon="lucide:mail" width={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                                    AWAIT_SIGNAL
                                </h2>
                                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-4 px-8 leading-relaxed">
                                    Check your comm-link inbox for the verification sequence.
                                </p>
                            </div>
                            <Link href="/auth/signin" className="inline-block pt-4 border-b border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                                Return_To_Base
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-6 animate-in shake duration-300">
                            <div className="w-12 h-12 bg-zinc-800 text-rose-600 border border-rose-900 mx-auto flex items-center justify-center">
                                <Icon icon="lucide:alert-triangle" width={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-rose-600">
                                    SIGNAL_LOST
                                </h2>
                                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2 px-8 leading-relaxed">
                                    Token expired or invalid. Please request a new verification link.
                                </p>
                            </div>
                            <Link href="/auth/signin" className="inline-block pt-4 border-b border-rose-900 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-white transition-colors">
                                Return_To_Base
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmailContent />
        </Suspense>
    );
}
