
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@shimokitan/ui';
import ZineCreateForm from './ZineCreateForm';
import { Icon } from '@iconify/react';

interface ZineModalDispatcherProps {
    artifactId: string;
    artifactTitle: string;
}

export default function ZineModalDispatcher({ artifactId, artifactTitle }: ZineModalDispatcherProps) {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        // Delay to allow animation to play
        setTimeout(() => {
            router.back();
        }, 200);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent className="max-w-[95vw] md:max-w-2xl bg-black border-zinc-900 p-0 overflow-hidden rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <DialogTitle className="sr-only">Broadcast Echo for {artifactTitle}</DialogTitle>
                
                {/* Visual Header - Warmer Context */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-rose-600 rounded-full" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] font-bold leading-none mb-1 text-left">Broadcasting // Shard</span>
                            <span className="text-sm font-black uppercase italic text-amber-50 leading-none text-left">{artifactTitle}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-full hover:bg-rose-600 hover:border-rose-500 hover:text-white transition-all text-zinc-500"
                    >
                        <Icon icon="lucide:x" width={20} />
                    </button>
                </div>

                <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto custom-scroll">
                    <ZineCreateForm 
                        artifactId={artifactId} 
                        onSuccess={() => {
                            setOpen(false);
                            setTimeout(() => {
                                router.refresh();
                                router.back();
                            }, 400);
                        }} 
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
