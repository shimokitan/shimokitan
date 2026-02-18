
"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Button
} from '@shimokitan/ui';
import { useRouter } from 'next/navigation';
import { fetchAnilistMetadata, AnilistMedia } from '@/services/anilist';

export default function AnilistGlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<AnilistMedia | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSearch = async () => {
        if (!query) return;
        setIsLoading(true);
        const data = await fetchAnilistMetadata(query);
        setResults(data);
        setIsLoading(false);
    };

    const handleRegister = (id: number) => {
        router.push(`/pedalboard/artifacts/new?anilist_id=${id}`);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 border border-zinc-800 text-zinc-500 text-[10px] font-black uppercase px-4 py-2 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all shadow-lg group">
                    <Icon icon="lucide:search" width={14} className="group-hover:animate-pulse" />
                    SEARCH_ANILIST
                </button>
            </DialogTrigger>
            <DialogContent className="bg-black border-zinc-900 sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-white font-black uppercase tracking-widest text-sm italic">Anilist_Deep_Search</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                    <div className="flex gap-2">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="QUERY_ANIME_TITLE_OR_ID..."
                            className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-xs text-white focus:border-violet-600 outline-none font-mono"
                        />
                        <Button
                            type="button"
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="bg-violet-600 hover:bg-violet-500 text-black h-auto py-3 px-6 text-[10px] font-black uppercase"
                        >
                            {isLoading ? <Icon icon="lucide:loader-2" className="animate-spin" width={14} /> : 'FETCH'}
                        </Button>
                    </div>

                    {results && (
                        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg flex gap-4 animate-in fade-in slide-in-from-bottom-4">
                            <img src={results.coverImage.extraLarge} alt="" className="w-24 h-32 object-cover rounded border border-zinc-800" />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="text-sm font-black text-white uppercase italic leading-tight">{results.title.english || results.title.romaji}</h3>
                                    <span className="text-[9px] font-mono text-violet-500 bg-violet-500/10 px-1 rounded border border-violet-500/20 whitespace-nowrap">{results.format}</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-mono line-clamp-2 uppercase leading-relaxed">{results.description?.replace(/<[^>]*>?/gm, '')}</p>
                                <div className="flex gap-3 text-[9px] font-bold font-mono">
                                    <span className="text-violet-400">ID: {results.id}</span>
                                    <span className="text-zinc-500">{results.season} {results.seasonYear}</span>
                                    <span className="text-amber-500">{results.episodes} EPS</span>
                                </div>
                                <button
                                    onClick={() => handleRegister(results.id)}
                                    className="w-full mt-4 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-violet-600 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                >
                                    INITIALIZE_REGISTRY_ENTRY
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
