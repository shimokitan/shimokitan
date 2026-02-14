"use client"

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { BentoCard, Badge } from '@shimokitan/ui';
import { MainLayout } from '../../../../components/layout/MainLayout';
import { MOCK_ARTIFACTS, Artifact, MOCK_ZINES, Zine } from '../../../../lib/mock-data';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ArtifactPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;
    const artifact = MOCK_ARTIFACTS[slug];

    if (!artifact) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 font-mono">
                    <Icon icon="lucide:search-x" width={48} height={48} className="mb-4 opacity-20" />
                    <h1 className="text-xl font-black uppercase tracking-widest">Shard Not Found</h1>
                    <button onClick={() => router.push('/')} className="mt-4 text-xs underline">RETURN_TO_DISTRICT</button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                {/* 1. Header: The Masking Tape Label */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-950 border-y border-zinc-800 p-3 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none" />

                    <div className="flex items-center gap-4 z-10">
                        <div className="bg-violet-600 text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter transform -skew-x-12">
                            ARTIFACT_{artifact.id.split('_')[1]}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">{artifact.title}</h1>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0 font-mono text-[10px] text-zinc-500 tracking-widest z-10">
                        <div className="flex flex-col items-end">
                            <span className="text-zinc-600 uppercase">Category</span>
                            <span className="text-zinc-300 font-bold">{artifact.category.toUpperCase()}</span>
                        </div>
                        <div className="w-px h-6 bg-zinc-800" />
                        <div className="flex flex-col items-end">
                            <span className="text-zinc-600 uppercase">Status</span>
                            <Badge variant={artifact.status === 'the_pit' ? 'distortion' : 'clean'}>
                                {artifact.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                        <div className="w-px h-6 bg-zinc-800" />
                        <div className="flex flex-col items-end">
                            <span className="text-zinc-600 uppercase">Resonance</span>
                            <span className="text-violet-500 font-black">+{artifact.heatIndex}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Side A: The Media Deck */}
                    <div className="md:col-span-8 space-y-6">
                        <BentoCard minimal className="aspect-video bg-black overflow-hidden relative border-violet-500/20">
                            {artifact.category === 'anime' ? (
                                <div className="absolute inset-0 flex items-center justify-center group/player">
                                    <img src={artifact.coverImage} className="w-full h-full object-cover opacity-60 mix-blend-lighten" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                    <div className="absolute inset-0 cyber-grid opacity-20" />
                                    <button className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-transform group-hover/player:bg-violet-600 group-hover/player:border-violet-400">
                                        <Icon icon="lucide:play" width={32} height={32} className="text-white ml-2" />
                                    </button>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                    {/* Rotating Vinyl */}
                                    <div className="relative w-80 h-80 animate-[spin_10s_linear_infinite]">
                                        <div className="absolute inset-0 bg-zinc-950 rounded-full border-4 border-zinc-900 shadow-[0_0_50px_rgba(0,0,0,1)]" />
                                        <div className="absolute inset-[30%] bg-zinc-800 rounded-full border border-zinc-700 overflow-hidden">
                                            <img src={artifact.coverImage} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute inset-[48%] bg-zinc-900 rounded-full border border-zinc-700" />
                                        {/* Vinyl Grooves Effect */}
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="absolute inset-0 rounded-full border border-white/[0.03]" style={{ margin: `${(i + 1) * 15}px` }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Grain & Noise Overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        </BentoCard>

                        <div className="p-6 bg-zinc-950/40 border border-zinc-800/80 rounded-xl backdrop-blur-md">
                            <h2 className="text-xs font-black text-violet-500 uppercase tracking-[0.3em] mb-4">Editorial // Notes</h2>
                            <p className="text-zinc-300 italic text-lg leading-relaxed font-serif">
                                &ldquo;{artifact.editorialDescription}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Side B: The Controls (Pedals) */}
                    <div className="md:col-span-4 space-y-4">

                        {/* Zine Signal Pedal */}
                        <BentoCard title="Zine Signal" icon="lucide:message-square-plus">
                            <div className="flex flex-col gap-4">
                                <p className="text-[9px] font-mono text-zinc-500 uppercase leading-tight">
                                    Broadcast your life shard resonance for this artifact.
                                </p>
                                <Link
                                    href={`/artifacts/${artifact.slug}/zines/post`}
                                    className="w-full flex items-center justify-center p-3 bg-rose-600/10 border border-rose-500/20 rounded-lg text-[10px] font-black text-rose-500 hover:bg-rose-600 hover:text-black transition-all uppercase tracking-widest"
                                >
                                    Initialize Echo
                                </Link>
                            </div>
                        </BentoCard>

                        {/* Credits Pedal */}
                        <BentoCard title="Credits" icon="lucide:book-user">
                            <div className="space-y-4 font-mono">
                                {artifact.category === 'anime' ? (
                                    <>
                                        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
                                            <span className="text-[10px] text-zinc-500">STUDIO</span>
                                            <span className="text-xs font-bold text-white">{artifact.metadata.studio}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
                                            <span className="text-[10px] text-zinc-500">SEASON</span>
                                            <span className="text-xs font-bold text-white uppercase">{artifact.metadata.season} {artifact.metadata.year}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
                                            <span className="text-[10px] text-zinc-500">EPISODES</span>
                                            <span className="text-xs font-bold text-white">{artifact.metadata.episodes}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
                                            <span className="text-[10px] text-zinc-500">ARTIST</span>
                                            <span className="text-xs font-bold text-white">{artifact.metadata.artist}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
                                            <span className="text-[10px] text-zinc-500">LABEL</span>
                                            <span className="text-xs font-bold text-white">{artifact.metadata.label}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
                                            <span className="text-[10px] text-zinc-500">BPM_INDEX</span>
                                            <span className="text-xs font-bold text-violet-400">{artifact.metadata.bpm}</span>
                                        </div>
                                    </>
                                )}
                                <div className="pt-2">
                                    <div className="text-[9px] text-zinc-600 mb-2 uppercase">Tags // Vibe_Signature</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(artifact.metadata.vibe || artifact.metadata.mood).split(' / ').map((tag: string, i: number) => (
                                            <span key={i} className="px-2 py-0.5 bg-zinc-800/50 border border-zinc-700/50 text-[9px] text-zinc-400 rounded-sm">
                                                {tag.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </BentoCard>

                        {/* Gateway Pedal */}
                        <BentoCard title="Gateways" icon="lucide:external-link">
                            <div className="space-y-2">
                                {artifact.category === 'anime' ? (
                                    <a href="#" className="flex items-center justify-between p-3 bg-orange-600/10 border border-orange-500/20 rounded-lg hover:bg-orange-600/20 transition-all group">
                                        <span className="text-xs font-black text-orange-500 uppercase">Crunchyroll</span>
                                        <Icon icon="lucide:arrow-up-right" width={14} height={14} className="text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                ) : (
                                    <a href="#" className="flex items-center justify-between p-3 bg-rose-600/10 border border-rose-500/20 rounded-lg hover:bg-rose-600/20 transition-all group">
                                        <span className="text-xs font-black text-rose-500 uppercase">Apple Music</span>
                                        <Icon icon="lucide:arrow-up-right" width={14} height={14} className="text-rose-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                )}
                                <button className="w-full flex items-center justify-center p-3 border border-zinc-800 rounded-lg text-[10px] font-black text-zinc-500 hover:text-white hover:border-zinc-400 transition-all uppercase tracking-widest">
                                    Metadata Source
                                </button>
                            </div>
                        </BentoCard>

                        {/* Heat Index Pedal */}
                        <BentoCard title="Resonance" icon="lucide:flame">
                            <div className="flex items-center gap-6 py-4">
                                <div className="relative w-12 h-32 bg-zinc-950 border border-zinc-800 rounded-full flex items-end p-1 overflow-hidden">
                                    <div className="w-full bg-gradient-to-t from-violet-600 to-rose-600 rounded-full transition-all duration-1000" style={{ height: '70%', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }} />
                                    <div className="absolute inset-0 flex flex-col justify-between p-1 py-4 pointer-events-none">
                                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-1 h-px bg-zinc-700" />)}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="text-4xl font-black text-white italic tracking-tighter leading-none italic-selection">+{artifact.heatIndex}</div>
                                    <div className="text-[10px] text-zinc-500 font-mono leading-tight uppercase">Narrative Density // Current heat level measured by collective resonance.</div>
                                </div>
                            </div>
                        </BentoCard>

                    </div>
                </div>

                {/* 3. The Basement: Echoes */}
                <div className="mt-12 border-t border-zinc-900 pt-12 pb-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-12 bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.4)]" />
                            <div className="flex flex-col">
                                <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Echo Resonance</h2>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Fragmented Collective Memoirs</span>
                            </div>
                        </div>

                        <Link
                            href={`/artifacts/${artifact.slug}/zines`}
                            className="text-xs font-black uppercase text-zinc-400 hover:text-white transition-colors border-b-2 border-zinc-900 pb-1 flex items-center gap-2 group"
                        >
                            See All Shards
                            <Icon icon="lucide:chevron-right" width={14} height={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Zine Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {MOCK_ZINES.filter(z => z.artifactSlug === artifact.slug).length > 0 ? (
                            MOCK_ZINES.filter(z => z.artifactSlug === artifact.slug).map((zine) => (
                                <div key={zine.id} className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-500">
                                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <Icon icon="lucide:quote-right" className="text-zinc-800" width={24} height={24} />
                                    </div>

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                            <Icon icon="lucide:user" className="text-zinc-600" width={14} height={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-200 uppercase">{zine.authorName}</span>
                                            <span className="text-[8px] font-mono text-zinc-600">{zine.authorHandle}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-zinc-400 italic leading-relaxed mb-6 line-clamp-4">
                                        &ldquo;{zine.content}&rdquo;
                                    </p>

                                    <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest">
                                        <span className="text-zinc-700">{new Date(zine.createdAt).toLocaleDateString()}</span>
                                        <div className="flex items-center gap-1 text-rose-500">
                                            <Icon icon="lucide:flame" width={10} height={10} />
                                            {zine.resonanceRating}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="md:col-span-3 py-12 text-center border border-dashed border-zinc-900 rounded-2xl">
                                <p className="text-zinc-700 font-mono text-xs uppercase">No echoes recorded for this shard yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Zine CTA - The Prompts */}
                    <div className="relative group overflow-hidden">
                        <div className="absolute inset-0 bg-rose-600 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity" />
                        <div className="relative p-12 border-2 border-zinc-900 rounded-3xl flex flex-col items-center text-center gap-8 group-hover:border-rose-900/40 transition-colors">
                            <div className="space-y-4">
                                <Icon icon="lucide:message-square-plus" width={40} height={40} className="text-rose-600 mx-auto animate-bounce-slow" />
                                <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                                    Cast Your <span className="text-rose-600">Echo.</span>
                                </h3>
                                <p className="text-zinc-500 text-sm font-mono max-w-lg mx-auto uppercase leading-relaxed tracking-tight">
                                    Identity is not a profile. It is a moment. <br />
                                    <span className="text-zinc-300 font-bold italic mt-2 block">
                                        &ldquo;What state in your life were you in when you experienced this?&rdquo;
                                    </span>
                                </p>
                            </div>

                            <Link
                                href={`/artifacts/${artifact.slug}/zines/post`}
                                className="bg-rose-600 text-black font-black italic text-xl px-12 py-4 shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-tighter"
                            >
                                INITIALIZE_ZINE
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
