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

const MOCK_ARTIFACTS: Artifact[] = [
    {
        id: "cowboy-bebop-shard",
        title: "COWBOY BEBOP // THE ASH REGISTRY",
        category: "anime",
        coverImage: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1200&q=80",
        description: "A Jazz-fueled drift through the Martian craters, documented as a series of expensive memories and broken cigarette filters.",
        score: 98,
        status: "the_pit",
        specs: {}
    },
    {
        id: "lain-wired",
        title: "SERIAL EXPERIMENTS LAIN // NODE_01",
        category: "anime",
        coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
        description: "No matter where you are, everyone is always connected. The architecture of the Wired documented for the first time.",
        score: 94,
        status: "back_alley",
        specs: {}
    },
    {
        id: "lamp-shore",
        title: "LAMP // GHOST ON THE SHORE",
        category: "music",
        coverImage: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80",
        description: "The sound of rain in a 1970s coffee shop in Shibuya. A collection of bossa-nova rhythms and city-pop ghosts.",
        score: 89,
        status: "back_alley",
        specs: {}
    },
    {
        id: "fishmans-long",
        title: "FISHMANS // LONG SEASON (98.12.28)",
        category: "music",
        coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
        description: "A 35-minute suspension of time. The final transmission from the Akasaka Blitz. Pure resonance.",
        score: 96,
        status: "the_pit",
        specs: {}
    },
    {
        id: "perfect-blue",
        title: "PERFECT BLUE // IDOL_GLITCH",
        category: "anime",
        coverImage: "https://images.unsplash.com/photo-1453306458620-5bbef13a5bca?w=800&q=80",
        description: "The breakdown of identity archived in high-fidelity. Who is the real Mima?",
        score: 92,
        status: "back_alley",
        specs: {}
    },
    {
        id: "casiopea-mint",
        title: "CASIOPEA // MINT JAMS (LIVE)",
        category: "music",
        coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
        description: "Technical perfection documented in a single evening. The definition of the Japanese Fusion frequency.",
        score: 87,
        status: "back_alley",
        specs: {}
    }
];

const MOCK_ZINES: (Zine & { artifact: Artifact })[] = [
    {
        id: "zine-1",
        artifact_id: "cowboy-bebop-shard",
        author: "JetBlack_98",
        content: "We were just kids looking at the stars, now we are just data points in the ash.",
        resonance: 42,
        artifact: MOCK_ARTIFACTS[0]
    },
    {
        id: "zine-2",
        artifact_id: "lain-wired",
        author: "Alice_8bit",
        content: "I felt her pulse in the CPU fan last night. The district is waking up.",
        resonance: 88,
        artifact: MOCK_ARTIFACTS[1]
    },
    {
        id: "zine-3",
        artifact_id: "lamp-shore",
        author: "Mina_Bossa",
        content: "This album tastes like cold coffee and expensive nostalgia.",
        resonance: 12,
        artifact: MOCK_ARTIFACTS[2]
    },
    {
        id: "zine-4",
        artifact_id: "casiopea-mint",
        author: "Fusion_Kid",
        content: "My fingers hurt just listening to that bass line. Peak human era.",
        resonance: 65,
        artifact: MOCK_ARTIFACTS[5]
    }
];

const MOCK_ENTITIES = [
    {
        id: "yoasobi-signal",
        name: "YOASOBI",
        type: "Major_Circuit",
        uid: "UID_SIG_001",
        avatar: "https://images.unsplash.com/photo-1514525253361-9f7a83707e4d?w=400&q=80",
        highlights: ["Racing into the Night", "IDOL"]
    },
    {
        id: "lamp-signal",
        name: "Lamp",
        type: "Underground_Echo",
        uid: "UID_SIG_042",
        avatar: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&q=80",
        highlights: ["Ghost on the Shore", "Cool Evening"]
    },
    {
        id: "ado-signal",
        name: "ADO",
        type: "Major_Circuit",
        uid: "UID_SIG_077",
        avatar: "https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=400&q=80",
        highlights: ["USSEEWA", "GIRA GIRA"]
    },
    {
        id: "eve-signal",
        name: "EVE",
        type: "Underground_Echo",
        uid: "UID_SIG_009",
        avatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
        highlights: ["Kaikai Kitan", "Dramaturgy"]
    }
];

export default function HomeClient({
    spotlightArtifacts: initialSpotlight,
    recentZines: initialZines,
    featuredArtifact: initialFeatured,
    entities: initialEntities,
    dict
}: {
    spotlightArtifacts: Artifact[],
    recentZines: (Zine & { artifact: Artifact })[],
    featuredArtifact: Artifact | null,
    entities: any[],
    dict: Dictionary
}) {
    const spotlightArtifacts = initialSpotlight.length > 0 ? initialSpotlight : MOCK_ARTIFACTS;
    const recentZines = initialZines.length > 0 ? initialZines : MOCK_ZINES;
    const featuredArtifact = initialFeatured || MOCK_ARTIFACTS.find(a => a.status === 'the_pit') || null;
    const entities = initialEntities && initialEntities.length > 0 ? initialEntities : MOCK_ENTITIES;

    const [activeSpotlight, setActiveSpotlight] = useState<number>(0);
    // Resident Registry - No rotation
    const [activeEntity, setActiveEntity] = useState<number>(0);

    const [randomFreq, setRandomFreq] = useState<string>("000");
    const time = useTime();

    useEffect(() => {
        setRandomFreq(Math.floor(Math.random() * 1000).toString(16));
    }, []);

    const heroArtifact = spotlightArtifacts[0];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 md:grid-rows-7 gap-3 h-auto md:h-full">
            {/* 1. Hero / Asymmetrical Editorial Dossier */}
            <div className="col-span-2 md:col-span-3 md:row-span-3 relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col md:flex-row">
                {/* Left Side: Visual Archive */}
                <div className="w-full md:w-2/3 relative h-64 md:h-auto overflow-hidden border-r border-zinc-900">
                    <img
                        src={heroArtifact?.coverImage || "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1200&q=80"}
                        alt="Magazine Cover"
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-50 group-hover:opacity-70"
                    />
                    {/* Flat Legibility Overlays (No Gradients) */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-zinc-950/80 backdrop-blur-sm p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-3 bg-violet-600" />
                            <span className="text-[8px] font-mono text-zinc-500 tracking-[0.3em] uppercase">Visual_Resource // {heroArtifact?.id || "VOID"}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black italic text-white uppercase tracking-tighter truncate">
                            {heroArtifact?.title || "Untitled Transmission"}
                        </h3>
                    </div>

                    {/* Technical HUD Overlays */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1 border-l border-violet-500/50 pl-2">
                        <span className="text-[7px] font-mono text-violet-500 leading-none">REG_TYPE // PRIMARY</span>
                        <span className="text-[7px] font-mono text-zinc-600 leading-none">SECTOR // 03</span>
                    </div>
                </div>

                {/* Right Side: District Navigation */}
                <div className="flex-1 bg-zinc-950 p-6 md:p-8 flex flex-col justify-between relative">
                    <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-zinc-800" />

                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-px bg-zinc-800" />
                            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{dict.home.district}</span>
                        </div>

                        <h2 className="flex flex-col text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter uppercase italic leading-[0.85]">
                            <span className="text-zinc-800">SHIMO</span>
                            <span className="text-white">KITAN</span>
                            <span className="text-violet-600 text-[10px] font-mono tracking-[0.5em] mt-2 italic">DIGITAL_DISTRICT</span>
                        </h2>
                    </div>

                    <div className="mt-8 md:mt-0">
                        <p className="text-zinc-500 text-[9px] font-mono leading-relaxed uppercase tracking-wider mb-6 line-clamp-4">
                            {dict.home.description}
                        </p>

                        <Link href={`/artifacts/${heroArtifact?.id}`} className="inline-flex items-center justify-between w-full bg-zinc-900 border border-zinc-800 text-white p-4 hover:bg-violet-600 hover:border-violet-500 transition-all group">
                            <span className="text-xs font-black tracking-[0.2em]">{dict.home.initialize}</span>
                            <Icon icon="lucide:arrow-right" className="group-hover:translate-x-1 transition-transform" />
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
                                <div className="bg-white p-1.5 md:p-2 rounded-lg shadow-2xl border-2 border-zinc-800 w-28 sm:w-32 md:w-40 text-black">
                                    <img src={item.coverImage || undefined} alt={item.title} className="w-full h-24 md:h-32 object-cover rounded" />
                                    <div className="mt-1.5 text-[9px] md:text-[10px] font-bold truncate">{item.title}</div>
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
                    <div className="mt-2 md:mt-4">
                        <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white italic leading-none">
                            {time || "00:00"}
                        </div>
                        <div className="text-[8px] md:text-[9px] text-violet-500 font-mono tracking-[0.2em] mt-1 md:mt-2 uppercase font-bold">
                            {parseInt(time?.split(':')[0] || '12') < 5 ? "GHOST_HOUR // PHASE_04" :
                                parseInt(time?.split(':')[0] || '12') < 12 ? "MORNING_FLUX // PHASE_01" :
                                    parseInt(time?.split(':')[0] || '12') < 18 ? "NEON_DUSK // PHASE_02" : "VOID_NIGHT // PHASE_03"}
                        </div>
                    </div>

                    {/* Scanner Activity Feed */}
                    <div className="mt-auto space-y-1 md:space-y-1.5">
                        <div className="h-px bg-zinc-900 w-full" />
                        <div className="flex flex-col gap-0.5 md:gap-1 font-mono text-[7px] text-zinc-500 uppercase overflow-hidden h-10 md:h-12">
                            <div className="flex justify-between items-center opacity-40">
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

            {/* 4. Resident Mirroring */}
            <BentoCard className="col-span-2 md:col-span-1 md:row-span-2 md:col-start-3 md:row-start-4" title="Resident Mirroring" icon="lucide:users">
                <div className="grid grid-cols-2 gap-2 h-full">
                    {entities.map((entity) => (
                        <Link key={entity.id} href={`/artists/${entity.id}`} className="relative group rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950">
                            <img src={entity.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute inset-0 bg-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/60 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform">
                                <div className="text-[6px] font-black text-white uppercase text-center truncate">{entity.name}</div>
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
                                <img src={featuredArtifact.coverImage || undefined} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                                {/* Solid Flat Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-zinc-950/60 flex flex-col justify-end p-2">
                                    <div className="text-[6px] font-mono text-rose-500 uppercase tracking-tighter">High_Resonance // 0.96</div>
                                </div>
                            </div>
                            <h3 className="text-xs font-bold uppercase truncate">{featuredArtifact.title}</h3>
                            <p className="text-[9px] text-zinc-500 line-clamp-1">{featuredArtifact.description}</p>
                        </div>
                    </BentoCard>
                </Link>
            )}

            {/* 6. District Residents List */}
            <BentoCard className="col-span-2 md:col-span-1 md:row-span-2 md:col-start-2 md:row-start-4 px-2 relative overflow-hidden" title="District Residents" icon="lucide:user-check">
                <div className="flex flex-col gap-2 h-full py-2">
                    {entities.slice(0, 3).map((entity) => (
                        <Link key={entity.id} href={`/artists/${entity.id}`} className="flex items-center gap-3 p-1.5 rounded bg-zinc-900/40 border border-zinc-800/80 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group">
                            <div className="w-10 h-10 shrink-0 relative">
                                <img src={entity.avatar} className="w-full h-full object-cover rounded grayscale group-hover:grayscale-0 transition-all shadow-lg" />
                                <div className="absolute -top-1 -right-1 bg-emerald-500 w-2 h-2 rounded-full border border-black" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-[9px] font-black text-white uppercase italic tracking-tighter group-hover:text-violet-400 truncate">{entity.name}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[6px] font-mono text-zinc-500 uppercase">{entity.uid}</span>
                                    <span className="w-1 h-1 rounded-full bg-violet-600/50" />
                                    <span className="text-[6px] font-mono text-violet-500 uppercase truncate">{entity.type.split('_')[0]}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div className="mt-auto pt-1 flex justify-center opacity-40">
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-zinc-700" />)}
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* 8. Video */}
            <BentoCard className="col-span-2 md:col-span-2 md:row-span-4 md:col-start-4 md:row-start-4 overflow-hidden p-0 bg-black" minimal>
                <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    className="w-full h-full border-0"
                    allowFullScreen
                />
            </BentoCard>

            {/* 9. Editorial */}
            <BentoCard className="col-span-2 md:col-span-3 md:row-span-2 md:col-start-1 md:row-start-6 overflow-hidden p-0" minimal>
                <div className="flex h-full w-full">
                    <div className="w-1/2 relative hidden md:block">
                        <img src={heroArtifact?.coverImage || undefined} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-opacity" />
                        {/* Shard Overlay - Sharp Split */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-zinc-950" />
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
