
"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { SheetPortal } from '@shimokitan/ui';

export default function InterceptedClose() {
    const router = useRouter();

    // We use a clean listener for the escape key or clicking the overlay
    // But since we use shadcn Sheet, it handles many things.
    // However, when it closes, we need to make sure Next.js goes back.

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                router.back();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return (
        <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={() => router.back()}
        />
    );
}
