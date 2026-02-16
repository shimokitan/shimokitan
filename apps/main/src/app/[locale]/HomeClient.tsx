"use client"

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { BentoCard, Badge } from '@shimokitan/ui';
import { useTime } from '../../hooks/use-time';
import Link from '../../components/Link';
import { Dictionary } from '@shimokitan/utils';

type Artifact = {
    id: string;
    title: string;
    category: string;
    coverImage: string | null;
    description: string | null;
    score: number | null;
    status: string | null;
    specs: any;
};

type Zine = {
    id: string;
    artifact_id: string;
    author: string;
    content: string;
    resonance: number | null;
};

export default function HomeClient({
    spotlightArtifacts,
    recentZines,
    featuredArtifact,
    dict
}: {
    spotlightArtifacts: Artifact[],
    recentZines: (Zine & { artifact: Artifact })[],
    featuredArtifact: Artifact | null,
    dict: Dictionary
}) {
    const [activeSpotlight, setActiveSpotlight] = useState<number>(0);
    const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
    const time = useTime();

    const [randomFreq, setRandomFreq] = useState<string>("000");

    useEffect(() => {
        setRandomFreq(Math.floor(Math.random() * 1000).toString(16));
    }, []);

    const heroArtifact = spotlightArtifacts[0];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 md:grid-rows-7 gap-3 h-auto md:h-full">
            {/* 1. Hero / Magazine Cover */}
            <div className="col-span-2 md:col-span-3 md:row-span-3 relative group rounded-xl overflow-hidden border border-zinc-800/80 hover:border-violet-500/50 transition-all min-h-[45vh] md:min-h-0 bg-zinc-950 shadow-2xl">
                {/* Background Image */}
                <img
                    src={heroArtifact?.coverImage || "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1200&q=80"}
                    alt="Magazine Cover"
                    className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s] opacity-60 mix-blend-lighten"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 p-8 z-10">
                    <div className="w-12 h-1 bg-violet-600 mb-6" />
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.8] text-white mb-4 italic">
                        {dict.home.title.split(' // ')[0]}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">{dict.home.title.split(' // ')[1]}</span>
                    </h2>

                    <p className="text-zinc-300 text-xs font-mono leading-relaxed max-w-xs mb-8 uppercase tracking-wide">
                        {dict.home.description}
                    </p>

                    <div className="flex gap-3">
                        <Link href={`/artifacts/${heroArtifact?.id}`} className="bg-violet-600 text-white px-6 py-2 rounded-sm text-xs font-black tracking-widest hover:bg-violet-500 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] group">
                            {dict.home.initialize} <Icon icon="lucide:zap" width={12} height={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Featured Card Stack */}
            <BentoCard className="col-span-2 md:col-span-1 md:row-span-3 overflow-visible min-h-[340px] md:min-h-0" title={dict.home.recent_shards} icon="lucide:star">
                <div className="flex flex-col items-center justify-center h-full relative">
                    <div className="relative w-full h-64 flex items-center justify-center">
                        {spotlightArtifacts.map((item, i) => (
                            <div
                                key={item.id}
                                onClick={() => setActiveSpotlight(i)}
                                className={`absolute cursor-pointer transition-all duration-500 hover:z-40 ${activeSpotlight === i ? 'z-30 scale-110 shadow-2xl' : 'z-10 opacity-80'}`}
                                style={{
                                    transform: activeSpotlight === i
                                        ? 'rotate(0deg) translateX(0) translateY(0)'
                                        : `rotate(${i === 0 ? -12 : i === 1 ? 5 : -6}deg) translateX(${(i - 1) * 20}px) translateY(${i * 10}px)`,
                                }}
                            >
                                <div className="bg-white p-2 rounded-lg shadow-2xl border-2 border-zinc-800 w-36 md:w-44 text-black">
                                    <img src={item.coverImage || undefined} alt={item.title} className="w-full h-28 md:h-36 object-cover rounded" />
                                    <div className="mt-2 text-[10px] font-bold truncate">{item.title}</div>
                                    <Badge variant="distortion" className="text-[8px] mt-1">{item.category}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </BentoCard>

            {/* 3. District / Dynamic Time */}
            <BentoCard className="col-span-1 md:col-span-1 md:row-span-3 px-3" title={dict.home.district} icon="lucide:map-pin">
                <div className="flex flex-col h-full justify-between py-2">
                    {/* Header: Signal Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[8px] font-mono text-emerald-500 font-black tracking-widest uppercase">{dict.home.signal_stable}</span>
                        </div>
                        <span className="text-[8px] font-mono text-zinc-600">CH_404</span>
                    </div>

                    {/* Main: Clock & Phase */}
                    <div className="mt-4">
                        <div className="text-4xl md:text-5xl font-black tracking-tighter text-white italic leading-none">
                            {time || "00:00"}
                        </div>
                        <div className="text-[9px] text-violet-500 font-mono tracking-[0.2em] mt-2 uppercase font-bold">
                            {parseInt(time?.split(':')[0] || '12') < 5 ? "GHOST_HOUR // PHASE_04" :
                                parseInt(time?.split(':')[0] || '12') < 12 ? "MORNING_FLUX // PHASE_01" :
                                    parseInt(time?.split(':')[0] || '12') < 18 ? "NEON_DUSK // PHASE_02" : "VOID_NIGHT // PHASE_03"}
                        </div>
                    </div>

                    {/* Scanner Activity Feed */}
                    <div className="mt-auto space-y-1.5">
                        <div className="h-px bg-zinc-900 w-full" />
                        <div className="flex flex-col gap-1 font-mono text-[7px] text-zinc-500 uppercase overflow-hidden h-12">
                            <div className="flex justify-between items-center opacity-40 animate-out fade-out slide-out-to-top duration-1000">
                                <span>{dict.home.scanning_freq}</span>
                                <span>0x{randomFreq}</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400">
                                <span>SHIMO_VALVE_82</span>
                                <span className="text-violet-500">{dict.home.active}</span>
                            </div>
                            <div className="flex justify-between items-center opacity-60">
                                <span>{dict.home.data_resonance}</span>
                                <span>74.2%</span>
                            </div>
                        </div>

                        {/* Weather/Stats Row */}
                        <div className="flex items-center justify-between gap-1 pt-2">
                            <div className="flex items-center gap-1.5 bg-zinc-900/40 px-2 py-1 rounded border border-zinc-800">
                                <Icon icon="lucide:thermometer" width={10} height={10} className="text-rose-500" />
                                <span className="text-[9px] font-bold text-white leading-none">8°C</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-zinc-900/40 px-2 py-1 rounded border border-zinc-800">
                                <Icon icon="lucide:users" width={10} height={10} className="text-violet-500" />
                                <span className="text-[9px] font-bold text-white leading-none">1.2K</span>
                            </div>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* 4. Recent Echoes Grid */}
            <BentoCard className="col-span-2 md:col-span-1 md:row-span-2 md:col-start-3 md:row-start-4" title={dict.home.recent_echoes} icon="lucide:ghost">
                <div className="grid grid-cols-2 gap-1.5 h-full">
                    {recentZines.map((zine) => (
                        <Link key={zine.id} href={`/artifacts/${zine.artifact_id}`} className="relative group rounded-lg overflow-hidden border border-zinc-800">
                            <img src={zine.artifact.coverImage || undefined} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[8px] font-black text-white uppercase tracking-tighter">{dict.home.view_shard}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </BentoCard>

            {/* 5. In The Pit (Featured Item) */}
            {featuredArtifact && (
                <Link href={`/artifacts/${featuredArtifact.id}`} className="col-span-1 md:col-span-1 md:row-span-2 md:col-start-1 md:row-start-4">
                    <BentoCard className="h-full" title={dict.home.in_the_pit} icon="lucide:flame">
                        <div className="flex flex-col h-full">
                            <div className="relative flex-1 rounded-lg overflow-hidden mb-2">
                                <img src={featuredArtifact.coverImage || undefined} className="object-cover w-full h-full" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            </div>
                            <h3 className="text-xs font-bold uppercase truncate">{featuredArtifact.title}</h3>
                            <p className="text-[9px] text-zinc-500 line-clamp-1">{featuredArtifact.description}</p>
                        </div>
                    </BentoCard>
                </Link>
            )}

            {/* 6. Soundtrack / Playback */}
            <Link href={`/artifacts/${spotlightArtifacts[1]?.id || heroArtifact?.id}`} className="col-span-2 md:col-span-1 md:row-span-2 md:col-start-2 md:row-start-4">
                <BentoCard className="h-full px-3" title={dict.home.playlist} icon="lucide:disc">
                    <div className="flex flex-col items-center h-full justify-center gap-3">
                        <div className="relative aspect-square w-24 rounded-lg overflow-hidden border border-zinc-800/50 group-hover:border-violet-500/50 transition-all shadow-lg shrink-0">
                            <img
                                src={spotlightArtifacts[1]?.coverImage || heroArtifact?.coverImage || undefined}
                                alt="Album Cover"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        <div className="flex flex-col w-full text-center min-w-0">
                            <h4 className="text-[10px] font-black text-white leading-tight truncate uppercase tracking-tighter">
                                {spotlightArtifacts[1]?.title || "UNKNOWN_SIGNAL"}
                            </h4>
                            <div className="flex items-center justify-center gap-3 mt-3">
                                <button className="text-zinc-600 hover:text-white transition-colors">
                                    <Icon icon="lucide:skip-back" width={12} height={12} />
                                </button>
                                <div
                                    onClick={(e) => { e.preventDefault(); setIsAudioPlaying(!isAudioPlaying); }}
                                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg cursor-pointer"
                                >
                                    <Icon icon={isAudioPlaying ? "lucide:pause" : "lucide:play"} width={14} height={14} className="text-black ml-0.5" />
                                </div>
                                <button className="text-zinc-600 hover:text-white transition-colors">
                                    <Icon icon="lucide:skip-forward" width={12} height={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                </BentoCard>
            </Link>

            {/* 8. Video Integration */}
            <BentoCard className="col-span-2 md:col-span-2 md:row-span-4 md:col-start-4 md:row-start-4 overflow-hidden p-0 bg-black" minimal>
                <iframe
                    src="https://www.youtube.com/embed/a51asfqw"
                    className="w-full h-full border-0"
                    allowFullScreen
                />
            </BentoCard>

            {/* 9. Bottom Featured / Editorial */}
            <BentoCard className="col-span-2 md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-6 overflow-hidden p-0" minimal>
                <div className="flex h-full w-full">
                    <div className="w-1/2 relative hidden md:block">
                        <img src={heroArtifact?.coverImage || undefined} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950" />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-center bg-zinc-950/50 backdrop-blur-sm">
                        <Badge variant="gold" className="mb-2">{dict.home.editorial_sigil}</Badge>
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">{dict.home.featured_title}</h3>
                        <p className="text-zinc-500 text-xs italic leading-relaxed line-clamp-2">
                            {dict.home.featured_description}
                        </p>
                    </div>
                </div>
            </BentoCard>
        </div>
    );
}
