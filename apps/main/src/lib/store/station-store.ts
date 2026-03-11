import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StationTrack {
    title: string;
    artist: string;
    album: string;
    cover: string;
    bitrate: string;
    format: string;
    src: string; // The HLS index.m3u8 URL
}

interface StationState {
    isInitialized: boolean;
    isMinimized: boolean;
    currentTrack: StationTrack | null;
    initialize: (track?: StationTrack) => void;
    reset: () => void;
    toggle: () => void;
    setMinimized: (minimized: boolean) => void;
    setTrack: (track: StationTrack) => void;
}

export const useStationStore = create<StationState>()(
    persist(
        (set) => ({
            isInitialized: false,
            isMinimized: false,
            currentTrack: null,
            initialize: (track) => set((state) => ({ 
                isInitialized: true, 
                isMinimized: false,
                currentTrack: track || state.currentTrack,
            })),
            reset: () => set({ isInitialized: false, isMinimized: false, currentTrack: null }),
            toggle: () => set((state) => ({ isInitialized: !state.isInitialized })),
            setMinimized: (minimized) => set({ isMinimized: minimized }),
            setTrack: (track) => set({ currentTrack: track, isInitialized: true }),
        }),
        {
            name: 'shimokitan-station-storage',
        }
    )
);
