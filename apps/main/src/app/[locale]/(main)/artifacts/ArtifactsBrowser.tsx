"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BentoCard, Badge, cn } from '@shimokitan/ui';
import Link from 'next/link';

type Artifact = {
    id: string;
    title: string;
    category: string;
    coverImage: string | null;
    status: string | null;
    resonance: number | null;
    isMajor: boolean;
    isVerified: boolean;
    artist?: string;
};

const categories = [
    { label: 'ALL_SHARDS', value: 'all' },
    { label: 'ANIME', value: 'anime' },
    { label: 'MUSIC', value: 'music' },
    { label: 'VTUBER', value: 'vtuber' },
    { label: 'ZINES', value: 'zine' },
];

export default function ArtifactsBrowser({ initialArtifacts }: { initialArtifacts: Artifact[] }) {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredArtifacts = initialArtifacts.filter(a => {
        const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="w-full flex flex-col gap-6 pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-px bg-violet-600" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em]">District // Archive</span>
                </div>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
                    Crate <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-rose-500">Digging.</span>
                </h1>
                <p className="text-zinc-600 max-w-lg text-[12px] uppercase font-mono tracking-tight leading-relaxed">
                    Consult the shards of the district. Sift through the analog noise to find the resonance that fits your frequency.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 sticky top-0 z-40 bg-black/80 backdrop-blur-md py-3 border-b border-zinc-900">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setActiveCategory(cat.value)}
                        className={`px-3 py-1 rounded-full text-[11px] font-black tracking-widest transition-all border ${activeCategory === cat.value
                            ? 'bg-violet-600 border-violet-500 text-black shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
                <div className="flex-1" />
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full">
                    <Icon icon="lucide:search" width={10} height={10} className="text-zinc-600" />
                    <input
                        type="text"
                        placeholder="SEARCH_SHARD..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-[11px] uppercase font-mono text-zinc-300 placeholder:text-zinc-700 w-28"
                    />
                </div>
            </div>

            {/* Artifact Registry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {filteredArtifacts.map((artifact) => (
                    <Link
                        key={artifact.id}
                        href={`/artifacts/${artifact.id}`}
                        className="group/item transition-all duration-500"
                    >
                        <BentoCard
                            minimal
                            className={cn(
                                "h-full border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/50 transition-all duration-500 overflow-hidden",
                                artifact.isMajor && "border-rose-900/20"
                            )}
                        >
                            <div className="flex flex-col h-full">
                                {/* Visual Entry Focus */}
                                <div className="relative aspect-video overflow-hidden bg-zinc-900">
                                    <img
                                        src={artifact.coverImage || '/placeholder.png'}
                                        alt={artifact.title}
                                        className="w-full h-full object-cover md:grayscale md:group-hover/item:grayscale-0 group-hover/item:scale-105 transition-all duration-700 md:opacity-70 group-hover/item:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                                    {/* Verification Stamp */}
                                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                        {artifact.isVerified && (
                                            <div className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center shadow-[0_0_10px_rgba(225,29,72,0.3)]">
                                                <Icon icon="lucide:check" width={8} className="text-white" />
                                            </div>
                                        )}
                                        <Badge variant={artifact.status === 'the_pit' ? 'distortion' : 'clean'} className="text-[9px] py-0 px-1 border-none bg-black/60 backdrop-blur-md">
                                            {artifact.status === 'the_pit' ? 'PIT' : 'ALLEY'}
                                        </Badge>
                                    </div>

                                    {/* Industry Signature */}
                                    <div className="absolute bottom-2 left-2">
                                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-0.5">Origin</span>
                                        <div className="text-[11px] font-black italic text-white/80 group-hover/item:text-white uppercase tracking-tighter truncate max-w-[100px]">
                                            {artifact.artist || "ANON"}
                                        </div>
                                    </div>
                                </div>

                                {/* Registry Entry Data */}
                                <div className="p-3.5 flex flex-col gap-3 relative">
                                    <div className="flex flex-col gap-0.5 pt-0.5">
                                        <h3 className="text-sm font-black italic tracking-tighter uppercase text-zinc-300 group-hover/item:text-white transition-colors leading-tight">
                                            {artifact.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1 h-1 bg-violet-600/20 group-hover/item:bg-violet-600 transition-colors rounded-full" />
                                            <span className="text-[10px] font-mono text-zinc-500 group-hover/item:text-zinc-400 uppercase tracking-widest transition-colors font-bold">
                                                {artifact.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Icon icon="lucide:zap" width={8} height={8} className="text-rose-500" />
                                            <span className="text-xs font-black text-rose-500 italic">
                                                {artifact.resonance || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BentoCard>
                    </Link>
                ))}
            </div>
        </div>
    );
}
