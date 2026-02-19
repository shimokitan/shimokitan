
"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

export default function DeleteButton({
    id,
    action,
    confirmMessage = 'Are you sure you want to delete this entry?',
    title = 'Delete Entry'
}: {
    id: string,
    action: (id: string) => Promise<void>,
    confirmMessage?: string,
    title?: string
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(confirmMessage)) return;

        setIsDeleting(true);
        try {
            await action(id);
        } catch (e) {
            console.error(e);
            alert('Failed to delete');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-zinc-600 hover:text-rose-500 transition-colors disabled:opacity-50"
            title={title}
        >
            <Icon icon={isDeleting ? "lucide:loader-2" : "lucide:trash-2"} className={isDeleting ? "animate-spin" : ""} width={14} />
        </button>
    );
}
