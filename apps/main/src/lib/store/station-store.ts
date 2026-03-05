import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StationState {
    isInitialized: boolean;
    isMinimized: boolean;
    initialize: () => void;
    reset: () => void;
    toggle: () => void;
    setMinimized: (minimized: boolean) => void;
}

export const useStationStore = create<StationState>()(
    persist(
        (set) => ({
            isInitialized: false,
            isMinimized: false,
            initialize: () => set({ isInitialized: true, isMinimized: false }),
            reset: () => set({ isInitialized: false, isMinimized: false }),
            toggle: () => set((state) => ({ isInitialized: !state.isInitialized })),
            setMinimized: (minimized) => set({ isMinimized: minimized }),
        }),
        {
            name: 'shimokitan-station-storage',
        }
    )
);
