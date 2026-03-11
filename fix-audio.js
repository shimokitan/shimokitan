const fs = require('fs');
const file = 'e:/works/projects/internal/shimokitan/packages/ui/src/components/AudioWidget.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace("import React, { useState, useEffect, useRef } from 'react';", 
`import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';`);

code = code.replace(`interface Track {
    title: string;
    artist: string;
    album: string;
    cover: string;
    bitrate: string;
    format: string;
}`, `export interface Track {
    title: string;
    artist: string;
    album: string;
    cover: string;
    bitrate: string;
    format: string;
    src?: string;
}

interface AudioWidgetProps {
    track?: Track | null;
}`);

code = code.replace(`export const AudioWidget: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress] = useState<number>(35);
    const [volume] = useState<number>(80);`, 
`export const AudioWidget: React.FC<AudioWidgetProps> = ({ track }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(80);
    const audioRef = useRef<HTMLAudioElement>(null);`);

code = code.replace(`    // Song Data
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
    };`, 
`    const currentTrack = track || {
        title: "Starboy",
        artist: "The Weeknd, Daft Punk",
        album: "Starboy",
        cover: "https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png",
        bitrate: "1411 KBPS",
        format: "LOSSLESS",
        src: ""
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return \`\${m}:\${s < 10 ? '0' : ''}\${s}\`;
    };

    const togglePlay = (e: React.MouseEvent): void => {
        e.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(console.error);
                setIsPlaying(true);
            }
        } else {
           setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (!audioRef.current || !currentTrack?.src) return;

        let hls: Hls | null = null;
        const audio = audioRef.current;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / (audio.duration || 1)) * 100);
        };
        const onLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);

        if (Hls.isSupported() && currentTrack.src.endsWith('.m3u8')) {
            hls = new Hls();
            hls.loadSource(currentTrack.src);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (isPlaying) {
                     audio.play().catch(console.error);
                }
            });
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari supports HLS natively
            audio.src = currentTrack.src;
            if (isPlaying) {
                audio.play().catch(console.error);
            }
        } else {
            // Fallback
            audio.src = currentTrack.src;
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
    }, [currentTrack]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);`);

code = code.replace(`{/* --- CONTENT AREA --- */}`, 
`<audio ref={audioRef} />
                        {/* --- CONTENT AREA --- */}`);

code = code.replace(`<span className="w-8 text-right tracking-tight">1:24</span>
                                        <div className="flex-1 h-1 bg-zinc-800 rounded-full relative group cursor-pointer overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-violet-600 rounded-full transition-all duration-300"
                                                style={{ width: \`\${progress}%\` }}
                                            />
                                        </div>
                                        <span className="w-8 tracking-tight">3:50</span>`, 
`<span className="w-8 text-right tracking-tight">{formatTime(currentTime)}</span>
                                        <div 
                                          className="flex-1 h-1 bg-zinc-800 rounded-full relative group cursor-pointer overflow-hidden"
                                          onClick={(e) => {
                                              if (!audioRef.current) return;
                                              const rect = e.currentTarget.getBoundingClientRect();
                                              const pos = (e.clientX - rect.left) / rect.width;
                                              audioRef.current.currentTime = pos * (audioRef.current.duration || 0);
                                          }}
                                        >
                                            <div
                                                className="absolute top-0 left-0 h-full bg-violet-600 rounded-full pointer-events-none transition-all duration-100 ease-linear"
                                                style={{ width: \`\${progress}%\` }}
                                            />
                                        </div>
                                        <span className="w-8 tracking-tight">{formatTime(duration)}</span>`);

code = code.replace(`<div className="flex-1 h-1 bg-zinc-800 rounded-full cursor-pointer relative">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-zinc-500 group-hover:bg-violet-500 transition-all rounded-full"
                                            style={{ width: \`\${volume}%\` }}
                                        />
                                    </div>`, 
`<div className="flex-1 h-1 bg-zinc-800 rounded-full cursor-pointer relative"
    onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setVolume(pos * 100);
    }}
>
                                        <div
                                            className="absolute top-0 left-0 h-full bg-zinc-500 group-hover:bg-violet-500 rounded-full pointer-events-none transition-all duration-300"
                                            style={{ width: \`\${volume}%\` }}
                                        />
                                    </div>`);

fs.writeFileSync(file, code);
