"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { BentoCard, Badge, cn } from '@shimokitan/ui';
import Link from 'next/link';

type Entity = {
    id: string;
    name: string;
    type: string;
    avatarUrl: string | null;
    isVerified: boolean | null;
    artifactCount: number;
};

const entityTypes = [
    { label: 'ALL_ARTISTS', value: 'all' },
    { label: 'INDIVIDUAL', value: 'individual' },
    { label: 'CIRCLE', value: 'circle' },
    { label: 'ORGANIZATION', value: 'organization' },
    { label: 'AGENCY', value: 'agency' },
];

export default function ArtistsBrowser({ initialEntities }: { initialEntities: Entity[] }) {
    const [activeType, setActiveType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEntities = initialEntities.filter(e => {
        const matchesType = activeType === 'all' || e.type === activeType;
        const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-violet-600" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em]">District // Artist_Registry</span>
                </div>
                <h1 className="text-5xl font-black italic tracking-tighter uppercase line-height-[0.8] mb-4">
                    The <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-500 to-rose-500">Inhabitants.</span>
                </h1>
                <p className="text-zinc-500 max-w-xl text-xs uppercase font-mono tracking-tight">
                    The architects of the district's resonance. Creators, agencies, and circles operating within the analog shadows.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 sticky top-0 z-40 bg-black/80 backdrop-blur-md py-4 border-b border-zinc-900">
                {entityTypes.map((type) => (
                    <button
                        key={type.value}
                        onClick={() => setActiveType(type.value)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all border ${activeType === type.value
                            ? 'bg-violet-600 border-violet-500 text-black shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        {type.label}
                    </button>
                ))}
                <div className="flex-1" />
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-full">
                    <Icon icon="lucide:search" width={12} height={12} className="text-zinc-600" />
                    <input
                        type="text"
                        placeholder="SEARCH_ARTIST..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-[10px] uppercase font-mono text-zinc-300 placeholder:text-zinc-700 w-32"
                    />
                </div>
            </div>

            {/* Entity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredEntities.map((entity) => (
                    <Link
                        key={entity.id}
                        href={`/artists/${entity.id}`}
                        className="group relative bg-zinc-950 border border-zinc-900 hover:border-violet-500/40 p-4 transition-all duration-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 p-1 transform group-hover:-rotate-3 transition-transform duration-500">
                                {entity.avatarUrl ? (
                                    <img
                                        src={entity.avatarUrl}
                                        alt={entity.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-700">
                                        <div className="w-2 h-2 bg-zinc-800 rounded-full mb-1" />
                                        <span className="text-[6px] font-mono tracking-tighter">NO_SIGNAL</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest bg-zinc-900 px-1 py-0.5">{entity.type}</span>
                                    {entity.isVerified && <Icon icon="lucide:check-circle" width={10} className="text-emerald-500" />}
                                </div>
                                <h3 className="text-lg font-black italic tracking-tighter uppercase text-white truncate group-hover:text-violet-400 transition-colors">
                                    {entity.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-1">
                                        <Icon icon="lucide:layers" width={10} className="text-zinc-500" />
                                        <span className="text-[9px] font-mono text-zinc-500">{entity.artifactCount} SHARDS</span>
                                    </div>
                                    <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                                    <span className="text-[9px] font-mono text-zinc-700">UID_{entity.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Static Deco HUD */}
                        <div className="absolute top-0 right-0 p-1 border-b border-l border-zinc-900 opacity-20 group-hover:opacity-100 group-hover:border-violet-500/20 transition-all">
                            <div className="w-2 h-2 bg-zinc-800 group-hover:bg-violet-600" />
                        </div>
                    </Link>
                ))}
            </div>
            {filteredEntities.length === 0 && (
                <div className="py-20 text-center border border-dashed border-zinc-900">
                    <span className="text-zinc-700 font-mono text-xs uppercase">No artists matching the current frequency.</span>
                </div>
            )}
        </div>
    );
}
