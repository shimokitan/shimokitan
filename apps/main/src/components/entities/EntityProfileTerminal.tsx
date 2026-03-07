import React from 'react';
import { Icon } from '@iconify/react';
import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';

export function EntityProfileTerminal({ entity, locale }: { entity: any, locale: string }) {
    const translations = entity.translations || [];
    const translation = translations.find((t: any) => t.locale === locale) || translations[0];
    const name = translation?.name || "Anonymous Artist";
    const bio = translation?.bio || "";
    const circuit = entity.circuit?.toUpperCase() || "UNDERGROUND";

    const credits = entity.credits || [];
    const sortedCredits = [...credits].sort((a, b) => (b.artifact?.score || 0) - (a.artifact?.score || 0));

    return (
        <MainLayout>
            {/* Ambient Background Scan */}
            <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5 animate-pulse" style={{ top: '15%' }} />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5 animate-pulse" style={{ top: '85%' }} />
                <div className="absolute top-0 left-[10%] w-[1px] h-full bg-white/5" />
                <div className="absolute top-0 left-[90%] w-[1px] h-full bg-white/5" />
            </div>

            <div className="relative z-10 animate-in fade-in duration-1000">
                {/* 1. Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-zinc-900 border-x border-zinc-900 min-h-screen">

                    {/* LEFT PANEL: RESIDENT_ID */}
                    <div className="lg:col-span-3 lg:sticky lg:top-0 h-fit bg-black p-6 space-y-8 lg:border-r lg:border-zinc-900">
                        <div className="space-y-6">
                            {/* Bio-Scan Frame */}
                            <div className="relative group mx-auto lg:mx-0 w-48 lg:w-full aspect-square bg-zinc-950 border border-zinc-800 p-2 overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-500" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-500" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-500" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-500" />

                                {entity.avatar?.url ? (
                                    <img src={entity.avatar.url} className="w-full h-full object-cover md:grayscale md:brightness-75 md:group-hover:grayscale-0 md:group-hover:brightness-100 transition-all duration-700" alt={name} />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-800">
                                        <Icon icon="lucide:user-round" width={64} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end text-xs font-black text-zinc-400 uppercase tracking-widest">
                                    <span>Resident_Class</span>
                                    <span className="text-zinc-300 font-bold">{circuit}</span>
                                </div>
                                <h1 className="text-5xl font-black italic tracking-tighther uppercase text-white leading-none">{name}</h1>
                                <div className="text-sm text-zinc-400 font-mono font-bold tracking-tighter">UID_{entity.id.toUpperCase()}</div>
                            </div>

                            <div className="pt-6 border-t border-zinc-900">
                                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest block mb-2">Subject Dossier</span>
                                <p className="text-base text-zinc-300 leading-relaxed font-serif italic italic-shadow">
                                    {bio || "DATA_PURGED // NO_HISTORICAL_MATCH"}
                                </p>
                            </div>

                            {/* HUD Stats */}
                            <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-4">
                                <div className="flex justify-between items-center text-xs font-mono font-bold text-zinc-400 uppercase">
                                    <span>Resonating_Shards</span>
                                    <span className="text-white text-sm">{credits.length}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-mono font-bold text-zinc-400 uppercase">
                                    <span>Encryption_Key</span>
                                    <span className="text-zinc-300">AES_256_LOCAL</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-900 relative overflow-hidden">
                                    <div className="absolute inset-y-0 left-0 bg-white/30 w-3/4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CENTER PANEL: UPLINK_TERMINAL */}
                    <div className="lg:col-span-5 bg-black border-r border-zinc-900 min-h-screen">
                        {/* Terminal Header */}
                        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md px-6 py-6 border-b border-zinc-900 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-black tracking-widest text-zinc-100 uppercase italic">Uplink: Terminal_01</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-tighter">Lat: 35.66 // Long: 139.66</span>
                        </div>

                        <div className="p-6 space-y-6">
                            {Array.isArray(entity.socialLinks) && entity.socialLinks.length > 0 ? (
                                entity.socialLinks.map((link: any, i: number) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative block bg-zinc-950 border border-zinc-900 hover:border-white p-6 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 flex items-center justify-center bg-zinc-900 border border-zinc-800 group-hover:border-zinc-500 group-hover:bg-zinc-950 transition-colors">
                                                    <Icon
                                                        icon={`simple-icons:${link.platform?.toLowerCase() || 'link'}`}
                                                        className="text-zinc-400 group-hover:text-white"
                                                        width={32}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300">Connection_Established</div>
                                                    <div className="text-xl font-black uppercase tracking-widest text-zinc-100 group-hover:text-white transition-colors">
                                                        {link.platform || 'General Terminal'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Icon icon="lucide:chevron-right" className="text-zinc-700 group-hover:text-white transition-all outline-none" width={24} />
                                                <span className="text-[10px] font-mono text-emerald-500/0 group-hover:text-emerald-400 transition-all uppercase font-black tracking-widest">STATUS_OK</span>
                                            </div>
                                        </div>
                                    </a>
                                ))
                            ) : (
                                <div className="py-20 text-center border border-dashed border-zinc-900">
                                    <Icon icon="lucide:unplug" className="mx-auto text-zinc-800 mb-2" width={48} />
                                    <span className="text-sm font-mono font-bold text-zinc-600 uppercase tracking-widest">No primary uplinks connected.</span>
                                </div>
                            )}

                            {/* Featured Highlight for Mobile/Middle */}
                            {sortedCredits[0] && (
                                <div className="pt-10 space-y-6">
                                    <div className="text-sm font-black tracking-widest text-zinc-300 uppercase flex items-center gap-3">
                                        <div className="w-2 h-6 bg-zinc-700" /> Featured_Signal
                                    </div>
                                    <Link href={`/artifacts/${sortedCredits[0].artifact.id}`} className="block group relative bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
                                        <div className="aspect-16/9 md:grayscale md:group-hover:grayscale-0 contrast-125 transition-all duration-700">
                                            {sortedCredits[0].artifact.cover?.url ? (
                                                <img src={sortedCredits[0].artifact.cover.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-800">
                                                    <Icon icon="lucide:film" width={64} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black via-black/95 to-transparent">
                                            <div className="text-sm font-mono font-bold text-white/40 uppercase mb-2 tracking-[0.2em]">{sortedCredits[0].role}</div>
                                            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white group-hover:text-violet-400 transition-colors leading-none">
                                                {sortedCredits[0].artifact.translations?.find((t: any) => t.locale === locale)?.title || "UNTITLED_SHARD"}
                                            </h2>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: RESONANCE_SHARDS */}
                    <div className="lg:col-span-4 bg-black p-0 min-h-screen">
                        {/* Shard Archive Header */}
                        <div className="lg:sticky lg:top-0 z-20 bg-zinc-950/90 backdrop-blur-md px-6 py-6 border-b border-zinc-900">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-zinc-600 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-zinc-300" />
                                    </div>
                                    <span className="text-sm font-black tracking-widest text-white uppercase italic">Shard_Archive</span>
                                </div>
                                <span className="text-xs font-mono font-bold text-zinc-400 py-1.5 px-3 bg-zinc-900 border border-zinc-800">COUNT: {sortedCredits.length}</span>
                            </div>
                        </div>

                        <div className="divide-y divide-zinc-900">
                            {sortedCredits.length > 0 ? (
                                sortedCredits.map((credit: any, i: number) => (
                                    <Link
                                        key={i}
                                        href={`/artifacts/${credit.artifact.id}`}
                                        className="group flex flex-col p-8 hover:bg-white/[0.03] transition-colors relative"
                                    >
                                        <div className="flex gap-8 items-start">
                                            <div className="w-40 h-24 bg-zinc-900 flex-shrink-0 border-2 border-zinc-800 overflow-hidden group-hover:border-white transition-all md:grayscale md:group-hover:grayscale-0 shadow-2xl">
                                                {credit.artifact.cover?.url ? (
                                                    <img src={credit.artifact.cover.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                                        <Icon icon="lucide:disc" width={32} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-3">
                                                <div className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:text-violet-400 transition-colors flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-zinc-700 rounded-full group-hover:bg-violet-500 transition-colors" />
                                                    RES_{credit.artifact.score} // {credit.artifact.category}
                                                </div>
                                                <h3 className="text-lg font-black uppercase text-zinc-200 group-hover:text-white transition-colors leading-tight">
                                                    {credit.artifact.translations?.find((t: any) => t.locale === locale)?.title || "UNTITLED"}
                                                </h3>
                                                <div className="text-xs font-mono font-bold uppercase tracking-tighter">
                                                    <span className="text-zinc-600">ROLE:</span> <span className="text-zinc-300 group-hover:text-white uppercase">{credit.role}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Physical Tape Deco */}
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-zinc-800 group-hover:bg-violet-500 transition-colors" />
                                    </Link>
                                ))
                            ) : (
                                <div className="p-12 text-center text-zinc-800">
                                    <span className="text-sm font-mono font-bold uppercase tracking-widest">NO_RESONANCE_DETECTED</span>
                                </div>
                            )}
                        </div>

                        {/* Footer Hardware Spec */}
                        <div className="p-6 pt-20">
                            <div className="border-2 border-zinc-900 p-6 space-y-6">
                                <div className="flex justify-between items-center text-xs font-mono font-bold text-zinc-600 uppercase">
                                    <span>Signal_Origin</span>
                                    <span>Shimokitazawa_Node_01</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <div key={i} className={`h-1.5 flex-1 bg-zinc-900 ${i % 3 === 0 ? 'bg-zinc-700' : ''}`} />
                                    ))}
                                </div>
                                <div className="text-center">
                                    <span className="text-xs font-mono text-zinc-700 font-black uppercase tracking-[0.6em]">End_Transmission</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
