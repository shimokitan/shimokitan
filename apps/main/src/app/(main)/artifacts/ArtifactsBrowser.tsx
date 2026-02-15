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
    score: number | null;
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
        <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-violet-600" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em]">District // Archive</span>
                </div>
                <h1 className="text-5xl font-black italic tracking-tighter uppercase line-height-[0.8] mb-4">
                    Crate <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-rose-500">Digging.</span>
                </h1>
                <p className="text-zinc-500 max-w-xl text-xs uppercase font-mono tracking-tight">
                    Consult the shards of the district. Sift through the analog noise to find the resonance that fits your current frequency.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 sticky top-0 z-40 bg-black/80 backdrop-blur-md py-4 border-b border-zinc-900">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setActiveCategory(cat.value)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all border ${activeCategory === cat.value
                            ? 'bg-violet-600 border-violet-500 text-black shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
                <div className="flex-1" />
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-full">
                    <Icon icon="lucide:search" width={12} height={12} className="text-zinc-600" />
                    <input
                        type="text"
                        placeholder="SEARCH_SHARD..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-[10px] uppercase font-mono text-zinc-300 placeholder:text-zinc-700 w-32"
                    />
                </div>
            </div>

            {/* Artifact Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 auto-rows-[140px]">
                {filteredArtifacts.map((artifact, i) => {
                    const isWide = i % 7 === 0;
                    const isTall = i % 5 === 0;

                    return (
                        <Link
                            key={artifact.id}
                            href={`/artifacts/${artifact.id}`}
                            className={cn(
                                "group/item transition-all duration-500",
                                isWide && "md:col-span-2",
                                isTall && "md:row-span-2"
                            )}
                        >
                            <BentoCard minimal className="h-full border-zinc-900 shadow-xl p-0 hover:z-10 overflow-hidden">
                                <div className="relative h-full flex flex-col">
                                    <div className={cn(
                                        "relative overflow-hidden grayscale group-hover/item:grayscale-0 transition-all duration-700",
                                        isTall ? "h-full" : "h-3/4"
                                    )}>
                                        <img
                                            src={artifact.coverImage || '/placeholder.png'}
                                            alt={artifact.title}
                                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                                        <div className="absolute top-2 right-2">
                                            <Badge variant={artifact.status === 'the_pit' ? 'distortion' : 'clean'} className="text-[7px] py-0 px-1 border-none shadow-[0_0_10px_black]">
                                                {artifact.status === 'the_pit' ? 'PIT' : 'ALLEY'}
                                            </Badge>
                                        </div>

                                        {(isTall || isWide) && (
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <h3 className="text-lg font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-md truncate">
                                                    {artifact.title}
                                                </h3>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <div className="w-1 h-1 bg-violet-500 rounded-full" />
                                                    <span className="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">{artifact.category}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {!(isTall || isWide) && (
                                        <div className="flex-1 p-2 bg-zinc-950 flex flex-col justify-between">
                                            <h3 className="text-[10px] font-black italic tracking-tighter uppercase leading-tight truncate">
                                                {artifact.title}
                                            </h3>
                                            <div className="flex justify-between items-center opacity-60">
                                                <span className="text-[8px] font-mono text-zinc-500 uppercase">{artifact.category}</span>
                                                <div className="flex items-center gap-0.5">
                                                    <Icon icon="lucide:flame" width={8} height={8} className="text-rose-600" />
                                                    <span className="text-[8px] font-bold text-rose-600">{artifact.score}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {isWide && !isTall && (
                                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-sm backdrop-blur-md border border-zinc-800">
                                            <Icon icon="lucide:flame" width={10} height={10} className="text-rose-500" />
                                            <span className="text-[10px] font-black text-rose-500">+{artifact.score}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent h-20 w-full -translate-y-full group-hover/item:translate-y-[400%] transition-transform duration-[4s] pointer-events-none" />
                            </BentoCard>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
