'use client';

import React, { useTransition } from 'react';
import { Icon } from '@iconify/react';
import { requestArchitectAccess } from '../actions';
import { toast } from 'sonner';

export function RequestAccessButton() {
    const [isPending, startTransition] = useTransition();

    const handleRequest = () => {
        startTransition(async () => {
            try {
                const result = await requestArchitectAccess();
                if (result.success) {
                    toast.success(result.message);
                } else {
                    toast.error(result.message);
                }
            } catch (err) {
                toast.error('System_Failure: Access_Protocol_Interrupted');
            }
        });
    };

    return (
        <button
            onClick={handleRequest}
            disabled={isPending}
            className="w-full bg-rose-600 text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
            {isPending ? (
                <>
                    <Icon icon="lucide:loader-2" width={16} className="animate-spin" />
                    Transmitting_Request...
                </>
            ) : (
                <>
                    <Icon icon="lucide:arrow-big-up-dash" width={16} className="group-hover:-translate-y-1 transition-transform" />
                    Request_Access
                </>
            )}

            {/* VIBE LINE ACCENT */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </button>
    );
}
