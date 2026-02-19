
"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export default function RestoreButton({ id, action }: { id: string, action: (id: string) => Promise<void> }) {
    const [isRestoring, setIsRestoring] = useState(false);

    const handleRestore = async () => {
        setIsRestoring(true);
        try {
            await action(id);
        } catch (e) {
            console.error(e);
            alert('Failed to restore');
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <button
            onClick={handleRestore}
            disabled={isRestoring}
            className="text-zinc-600 hover:text-emerald-500 transition-colors disabled:opacity-50"
            title="Restore Entry"
        >
            <Icon icon={isRestoring ? "lucide:loader-2" : "lucide:rotate-ccw"} className={isRestoring ? "animate-spin" : ""} width={14} />
        </button>
    );
}
