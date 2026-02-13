"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

// --- Types ---

interface Track {
    title: string;
    artist: string;
    album: string;
    cover: string;
    bitrate: string;
    format: string;
}

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "zinc" }) => (
    <span className={`px-2 py-0.5 rounded bg-${color}-900/30 text-${color}-200 border border-${color}-700/30 text-[9px] font-mono tracking-tighter uppercase whitespace-nowrap`}>
        {children}
    </span>
);

export const AudioWidget: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress] = useState<number>(35);
    const [volume] = useState<number>(80);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // Dragging State
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [hasDragged, setHasDragged] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const widgetRef = useRef<HTMLDivElement>(null);

    // Initialize position to bottom right
    useEffect(() => {
        setPosition({
            x: window.innerWidth - 120, // 24*4 = 96px width + some margin
            y: window.innerHeight - 120
        });
    }, []);

    // Song Data
    const currentTrack: Track = {
        title: "Starboy",
        artist: "The Weeknd, Daft Punk",
        album: "Starboy",
        cover: "https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png",
        bitrate: "1411 KBPS",
        format: "LOSSLESS"
    };

    const togglePlay = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setIsPlaying(!isPlaying);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsDragging(true);
        setHasDragged(false);
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        e.stopPropagation();
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const newX = e.clientX - dragStart.current.x;
            const newY = e.clientY - dragStart.current.y;

            // If we move more than a tiny threshold, count it as a drag
            if (Math.abs(e.clientX - (dragStart.current.x + position.x)) > 5 ||
                Math.abs(e.clientY - (dragStart.current.y + position.y)) > 5) {
                setHasDragged(true);
            }

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, position.x, position.y]);

    const handleWidgetClick = () => {
        if (!isExpanded && !hasDragged) {
            setIsExpanded(true);
        }
    };

    return (
        <div
            ref={widgetRef}
            className="fixed z-[9999] select-none"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'auto'
            }}
        >
            <div
                className="relative group transition-all duration-500"
                onMouseDown={!isExpanded ? handleMouseDown : undefined}
            >
                {/* --- FLOATING WIDGET CONTAINER --- */}
                <div
                    id="music-widget"
                    className={`
            relative bg-zinc-950/40 backdrop-blur-2xl border border-zinc-800/80 shadow-[0_32px_64px_-16px_rgba(0,0,0,1)]
            transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${isExpanded ? 'w-[calc(100vw-4rem)] max-w-2xl h-32 rounded-xl p-0' : 'w-24 h-24 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center ring-4 ring-zinc-900/50'}
          `}
                    onClick={handleWidgetClick}
                >
                    {/* Pulsing Aura for minimized state */}
                    {!isExpanded && isPlaying && (
                        <div className="absolute inset-0 rounded-full bg-violet-500/10 animate-pulse scale-110 pointer-events-none" />
                    )}
                    {isExpanded && (
                        <div
                            className="absolute top-0 left-0 right-0 h-8 border-b border-zinc-800/50 flex items-center justify-between px-4 bg-zinc-950/60 rounded-t-xl cursor-grab active:cursor-grabbing"
                            onMouseDown={handleMouseDown}
                        >
                            <div className="flex items-center gap-2 text-zinc-500 ml-32 pointer-events-none">
                                <Icon icon="lucide:disc" width={14} height={14} className={isPlaying ? "animate-spin" : ""} />
                                <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Artifact.Audio /// DRAGGABLE_VINYL</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-2 py-0.5 rounded bg-violet-900/40 text-violet-200 border border-violet-700/40 text-[9px] font-mono tracking-tighter uppercase whitespace-nowrap">LIVE RESONANCE</div>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-2" />
                                <div className="h-4 w-px bg-zinc-800 mx-1" />
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                    className="p-1 text-zinc-500 hover:text-white transition-colors hover:bg-zinc-800 rounded-md cursor-pointer"
                                >
                                    <Icon icon="lucide:minimize-2" width={14} height={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={`flex items-center h-full ${isExpanded ? 'pt-8' : ''}`}>

                        {/* --- VINYL RECORD AREA --- */}
                        <div
                            className={`
                relative flex-shrink-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${isExpanded ? 'w-40 h-40 -ml-16' : 'w-24 h-24'}
              `}
                        >
                            {/* The Spinning Disc */}
                            <div
                                className={`
                w-full h-full rounded-full border border-zinc-800
                flex items-center justify-center bg-zinc-950 overflow-hidden relative
                ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'transition-transform duration-1000'}
                shadow-[0_0_30px_rgba(139,92,246,0.15)]
              `}
                            >
                                {/* Groove Texture */}
                                <div className="absolute inset-2 rounded-full border border-zinc-900" />
                                <div className="absolute inset-4 rounded-full border border-zinc-900" />
                                <div className="absolute inset-6 rounded-full border border-zinc-900" />
                                <div className="absolute inset-8 rounded-full border border-zinc-900" />

                                {/* Album Art */}
                                <div className="relative w-[42%] h-[42%] rounded-full overflow-hidden border-[3px] border-zinc-950 z-10">
                                    <img src={currentTrack.cover} className="w-full h-full object-cover" alt="cover" />
                                </div>

                                {/* Spindle */}
                                <div className="absolute w-2.5 h-2.5 bg-zinc-400 rounded-full border border-zinc-950 z-20" />
                            </div>

                            {/* --- ENHANCED STYLUS (TONE ARM) --- */}
                            {isExpanded && (
                                <div
                                    className={`absolute -right-2 top-0 w-24 h-32 origin-top transition-transform duration-1000 ease-[cubic-bezier(0.45,0.05,0.55,0.95)] z-20
                  ${isPlaying ? 'rotate-[20deg]' : 'rotate-[-12deg]'}
                `}
                                    style={{ transformOrigin: '80% 15%' }}
                                >
                                    {/* Main Pivot Base */}
                                    <div className="absolute top-0 right-2 w-14 h-14 bg-zinc-900 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex items-center justify-center border border-zinc-800">
                                        <div className="w-10 h-10 bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-zinc-700 rounded-full border border-zinc-900 flex items-center justify-center shadow-inner">
                                                <div className="w-2 h-2 bg-zinc-500 rounded-full" />
                                            </div>
                                        </div>
                                        {/* Counterweight */}
                                        <div className="absolute -top-7 right-0 w-7 h-12 bg-zinc-700 rounded-sm border-x border-b border-zinc-800 shadow-[2px_2px_0px_rgba(0,0,0,0.4)] transform rotate-[-15deg]" />
                                    </div>

                                    {/* Arm Tube */}
                                    <div className="absolute right-[30px] top-6 w-[8px] h-28 bg-zinc-400 rounded-full origin-top rotate-[5deg] overflow-hidden border-x border-zinc-500">
                                        <div className="absolute inset-y-0 left-0 w-[1px] bg-white/40" />
                                        <div className="absolute inset-y-0 right-0 w-[2px] bg-black/20" />
                                    </div>

                                    {/* Headshell & Needle Assembly */}
                                    <div className="absolute bottom-[-18px] left-[14px] w-8 h-12 flex flex-col items-center transform rotate-[20deg]">
                                        <div className="w-6 h-10 bg-zinc-900 rounded-t-sm rounded-br-2xl border-l-2 border-zinc-800 relative shadow-[4px_4px_0px_rgba(0,0,0,0.4)]">
                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />
                                            <div className="absolute top-1 -right-4 w-5 h-1.5 bg-zinc-800 rounded-full rotate-[-30deg] border-b border-black/40" />
                                        </div>
                                        <div className="w-3 h-4 bg-rose-600 rounded-b-sm mt-[-2px] ml-2 z-30 border-x border-b border-rose-800 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] flex flex-col items-center">
                                            <div className="w-full h-[1px] bg-white/20" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* --- CONTENT AREA --- */}
                        {isExpanded && (
                            <div className="flex-1 flex items-center justify-between ml-10 mr-4 transition-all duration-500">
                                {/* Track Info */}
                                <div className="flex flex-col min-w-[180px] ml-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge color="zinc">{currentTrack.format}</Badge>
                                        <span className="text-[9px] font-mono text-zinc-600 tracking-tighter">{currentTrack.bitrate}</span>
                                    </div>
                                    <h3 className="text-white font-bold text-xl leading-none tracking-tighter truncate max-w-[220px] uppercase">
                                        {currentTrack.title}
                                    </h3>
                                    <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider mt-1.5 flex items-center gap-2">
                                        <span className="w-4 h-px bg-zinc-800" /> {currentTrack.artist}
                                    </p>
                                </div>

                                {/* Controls & Progress */}
                                <div className="flex flex-col items-center flex-1 max-w-xs px-6 border-x border-zinc-800/30 h-full justify-center">
                                    <div className="flex items-center gap-10 mb-4">
                                        <button className="text-zinc-500 hover:text-white transition-all transform hover:scale-110 active:scale-90">
                                            <Icon icon="lucide:skip-back" width={18} height={18} />
                                        </button>
                                        <button
                                            onClick={togglePlay}
                                            className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 active:scale-90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                        >
                                            <Icon icon={isPlaying ? "lucide:pause" : "lucide:play"} width={20} height={20} />
                                        </button>
                                        <button className="text-zinc-500 hover:text-white transition-all transform hover:scale-110 active:scale-90">
                                            <Icon icon="lucide:skip-forward" width={18} height={18} />
                                        </button>
                                    </div>

                                    {/* Scrubber */}
                                    <div className="w-full flex items-center gap-4 text-[10px] text-zinc-600 font-black font-mono">
                                        <span className="w-8 text-right tracking-tight">1:24</span>
                                        <div className="flex-1 h-1 bg-zinc-800 rounded-full relative group cursor-pointer overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-violet-600 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="w-8 tracking-tight">3:50</span>
                                    </div>
                                </div>

                                {/* Volume */}
                                <div className="flex items-center gap-3 w-28 group px-2">
                                    <Icon icon="lucide:volume-2" width={16} height={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                                    <div className="flex-1 h-1 bg-zinc-800 rounded-full cursor-pointer relative">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-zinc-500 group-hover:bg-violet-500 transition-all rounded-full"
                                            style={{ width: `${volume}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Play Button Overlay for Minimized State */}
                        {!isExpanded && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className={`w-12 h-12 rounded-full border border-violet-500/30 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100 group-hover:opacity-100'}`}>
                                    <button
                                        onClick={togglePlay}
                                        className="pointer-events-auto w-10 h-10 flex items-center justify-center"
                                    >
                                        <Icon icon={isPlaying ? "lucide:pause" : "lucide:play"} width={24} height={24} className="text-white ml-1" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
