"use client";

import React from 'react';
import { AudioWidget, cn } from '@shimokitan/ui';
import { useStationStore } from '@/lib/store/station-store';

/**
 * PersistAudio ensures the audio engine remains mounted across all page navigations.
 * It should be placed in the root layout to prevent the <audio> element from being killed.
 */
export function PersistAudio() {
    const { 
        isInitialized, 
        isMinimized, 
        isClosed, 
        currentTrack, 
        setClosed 
    } = useStationStore();

    const [mounted, setMounted] = React.useState(false);
    
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div 
            className={cn(
                "transition-opacity duration-300 z-[9999]", 
                (!isInitialized || !isMinimized || isClosed) 
                    ? "opacity-0 pointer-events-none absolute -bottom-full" 
                    : "opacity-100"
            )}
        >
            <AudioWidget 
                track={currentTrack} 
                onClose={() => setClosed(true)}
            />
        </div>
    );
}
