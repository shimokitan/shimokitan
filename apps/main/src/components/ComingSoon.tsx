"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useMutation } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@shimokitan/ui';

/** Modal feedback state after subscription attempt. */
type ModalState = {
    open: boolean;
    variant: 'success' | 'warning' | 'error';
    title: string;
    description: string;
};

const MODAL_INITIAL: ModalState = {
    open: false,
    variant: 'success',
    title: '',
    description: '',
};

export function ComingSoon() {
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [modal, setModal] = useState<ModalState>(MODAL_INITIAL);

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

            const data = await response.json();

            if (!response.ok) {
                const err = new Error(data.error || 'Failed to register');
                (err as Error & { status: number }).status = response.status;
                (err as Error & { code: string }).code = data.error || 'UNKNOWN';
                throw err;
            }

            return data;
        },
        onSuccess: () => {
            setEmail("");
            setIsValid(null);
            setModal({
                open: true,
                variant: 'success',
                title: 'COORDINATES RECEIVED',
                description: 'Transmission complete. You will be notified when the District opens.',
            });
        },
        onError: (error: Error & { code?: string }) => {
            if (error.code === 'ALREADY_REGISTERED') {
                setModal({
                    open: true,
                    variant: 'warning',
                    title: 'SIGNAL ALREADY REGISTERED',
                    description: 'This endpoint is already in our broadcast network. You will receive a ping when the District opens.',
                });
            } else {
                setModal({
                    open: true,
                    variant: 'error',
                    title: 'UPLINK FAILURE',
                    description: error.message || 'An unexpected error occurred. Please retry your transmission.',
                });
            }
        }
    });

    const handleSubmit = () => {
        if (isValid && email) {
            mutation.mutate(email);
        }
    };

    /** Accent color per variant */
    const variantStyles = {
        success: {
            border: 'border-emerald-600',
            icon: 'lucide:circle-check',
            iconColor: 'text-emerald-500',
            accent: 'bg-emerald-600/10',
            dot: 'bg-emerald-500',
        },
        warning: {
            border: 'border-amber-600',
            icon: 'lucide:triangle-alert',
            iconColor: 'text-amber-500',
            accent: 'bg-amber-600/10',
            dot: 'bg-amber-500',
        },
        error: {
            border: 'border-rose-600',
            icon: 'lucide:octagon-x',
            iconColor: 'text-rose-500',
            accent: 'bg-rose-600/10',
            dot: 'bg-rose-500',
        },
    } as const;

    const vs = variantStyles[modal.variant];

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
                    <p className="text-zinc-400 font-mono text-xs md:text-sm tracking-[0.2em] uppercase max-w-lg mx-auto leading-relaxed">
                        We are recalibrating the district conduits. <br className="hidden md:block" />
                        Expected synchronization in the next cycle.
                    </p>
                </div>

                {/* Action / Notification */}
                <div className="w-full max-w-md bg-zinc-950/50 border border-zinc-900 p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[60px] pointer-events-none" />

                    <div className="flex flex-col gap-2 mb-8 border-l-2 border-violet-600 pl-4 py-2 bg-zinc-900/40 rounded-r-xl">
                        <label className="block text-zinc-100 text-xs font-mono uppercase tracking-[0.3em] font-black">
                            Receive Broadcast Ping
                        </label>
                        <p className="text-zinc-400 text-xs font-mono leading-relaxed normal-case">
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
                                <div className="absolute -bottom-5 left-1 text-[10px] text-rose-600 font-mono font-bold tracking-widest italic animate-pulse">
                                    INVALID_ENDPOINT_FORMAT
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid || mutation.isPending}
                            className={`px-6 py-3 rounded-xl text-xs font-black tracking-widest transition-all shrink-0 ${isValid && !mutation.isPending
                                ? 'bg-zinc-100 text-black hover:bg-white active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
                                }`}
                        >
                            {mutation.isPending ? 'UPLINKING...' : 'SUBSCRIBE'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
            <Dialog open={modal.open} onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}>
                <DialogContent
                    showCloseButton={false}
                    className={`bg-zinc-950 border ${vs.border} rounded-xl max-w-sm mx-auto p-0 overflow-hidden`}
                >
                    {/* Top status bar */}
                    <div className={`flex items-center gap-2 px-5 py-2.5 ${vs.accent} border-b ${vs.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${vs.dot} animate-pulse`} />
                        <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-zinc-400 uppercase">
                            {modal.variant === 'success' && 'TRANSMISSION // COMPLETE'}
                            {modal.variant === 'warning' && 'SIGNAL // DUPLICATE'}
                            {modal.variant === 'error' && 'TRANSMISSION // FAILED'}
                        </span>
                    </div>

                    <div className="px-6 py-5 space-y-4">
                        <DialogHeader className="gap-3 p-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${vs.accent} border ${vs.border} flex items-center justify-center shrink-0`}>
                                    <Icon icon={vs.icon} width={20} height={20} className={vs.iconColor} />
                                </div>
                                <DialogTitle className="text-zinc-100 font-black text-sm tracking-tight uppercase leading-tight">
                                    {modal.title}
                                </DialogTitle>
                            </div>
                            <DialogDescription className="text-zinc-400 text-xs font-mono leading-relaxed normal-case">
                                {modal.description}
                            </DialogDescription>
                        </DialogHeader>

                        <button
                            onClick={() => setModal(MODAL_INITIAL)}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-black tracking-widest uppercase py-2.5 rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                        >
                            ACKNOWLEDGED
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
