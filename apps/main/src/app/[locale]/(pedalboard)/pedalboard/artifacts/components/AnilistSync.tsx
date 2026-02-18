
"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@shimokitan/ui';
import { useAnilistSync } from '@/hooks/useAnilistSync';

interface AnilistSyncProps {
    onSync: (data: any) => void;
    initialIdentifier?: string | number | null;
}

export default function AnilistSync({ onSync, initialIdentifier }: AnilistSyncProps) {
    const [identifier, setIdentifier] = useState(initialIdentifier?.toString() || '');
    const [triggerId, setTriggerId] = useState<string | number | null>(initialIdentifier || null);

    const { data, isLoading, isError, refetch } = useAnilistSync(triggerId);

    const handleFetch = () => {
        if (!identifier) return;
        setTriggerId(identifier);
    };

    React.useEffect(() => {
        if (data) {
            onSync(data);
            setTriggerId(null);
        }
    }, [data, onSync]);

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Icon icon="lucide:refresh-cw" className="text-violet-500" width={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Metadata_Pull // AniList</span>
            </div>

            <div className="flex gap-2">
                <input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="AniList ID or Anime Title..."
                    className="flex-1 bg-black border border-zinc-800 p-2 text-xs text-white focus:border-violet-600 outline-none transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                />
                <Button
                    type="button"
                    onClick={handleFetch}
                    disabled={isLoading || !identifier}
                    variant="outline"
                    className="h-9 px-4 text-[10px] font-black uppercase border-zinc-800 hover:bg-violet-600 hover:text-black hover:border-violet-600 transition-all"
                >
                    {isLoading ? (
                        <Icon icon="lucide:loader-2" className="animate-spin" width={12} />
                    ) : (
                        'Sync_Meta'
                    )}
                </Button>
            </div>

            {isError && (
                <p className="text-[10px] text-rose-500 font-mono uppercase">Error_Fetching_Metadata</p>
            )}
        </div>
    );
}
