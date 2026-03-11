import React from 'react';
import { Icon } from '@iconify/react';
import { BrandIcon } from '@/components/BrandIcon';
import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';
import { Dictionary } from '@shimokitan/utils';

export function EntityProfileTerminal({ entity, locale, dict }: { entity: any, locale: string, dict: Dictionary }) {
    const translations = entity.translations || [];
    const translation = translations.find((t: any) => t.locale === locale) || translations[0];
    const name = translation?.name || "Anonymous Artist";

    /**
     * CONSENT_FIRST_GATE
     * Encrypted entities are sealed — only the name leaks through.
     * No data, no pages, just a message.
     */
    if (entity.isEncrypted) {
        return (
            <MainLayout>
                <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5 animate-pulse" style={{ top: '15%' }} />
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5 animate-pulse" style={{ top: '85%' }} />
                </div>

                <div className="relative z-10 animate-in fade-in duration-1000 min-h-[80vh] flex items-center justify-center">
                    <div className="text-center space-y-8 max-w-md mx-auto px-6">
                        {/* Encrypted Signal Icon */}
                        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-zinc-800 animate-pulse" />
                            <div className="absolute inset-2 border border-zinc-900" />
                            <Icon icon="lucide:lock" width={32} className="text-zinc-700" />
                        </div>

                        {/* Absolute Encryption — No data leakage */}
                        <div className="space-y-2">
                            <div className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-[0.4em]">
                                Signal_Lost
                            </div>
                            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-zinc-800 leading-none">
                                [REDACTED]
                            </h1>
                        </div>

                        {/* Encryption Message */}
                        <div className="space-y-4 pt-4">
                            <div className="inline-block px-4 py-2 border border-zinc-800 bg-zinc-950">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                                    Current_Channel_Is_Sealed
                                </span>
                            </div>
                            <p className="text-xs text-zinc-700 font-mono leading-relaxed">
                                This entity has not opened a channel in the district.
                                <br />
                                There is nothing here.
                            </p>
                        </div>

                        {/* Back Navigation */}
                        <div className="pt-8">
                            <Link href="/artists" className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-800 text-zinc-600 hover:text-white hover:border-zinc-500 transition-all text-[10px] font-black uppercase tracking-widest">
                                <Icon icon="lucide:arrow-left" width={14} />
                                Back_To_Registry
                            </Link>
                        </div>

                        {/* Bottom Signal Deco */}
                        <div className="pt-12 flex justify-center">
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className={`h-1 w-3 ${i % 4 === 0 ? 'bg-zinc-800' : 'bg-zinc-900'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const bio = translation?.bio || "";
    const type = entity.type?.toUpperCase() || "INDIVIDUAL";

    const credits = entity.credits || [];
    const sortedCredits = [...credits].sort((a, b) => (b.artifact?.resonance || 0) - (a.artifact?.resonance || 0));

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
                    <div className="lg:col-span-3 lg:sticky lg:top-0 h-fit bg-black p-6 space-y-8 lg:border-r lg:border-zinc-900 flex flex-col items-center text-center">
                        <div className="space-y-6 w-full">
                            {/* Bio-Scan Frame */}
                            <div className="relative group mx-auto w-48 aspect-square bg-zinc-950 border border-zinc-800 overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-500" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-500" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-500" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-500" />

                                {entity.avatar?.url ? (
                                    <img src={entity.avatar.url} className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-700" alt={name} />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-800">
                                        <Icon icon="lucide:user-round" width={64} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-center items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                                    <span>Identity //</span>
                                    <span className="text-zinc-400">{type}</span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black italic tracking-tighter uppercase text-white leading-none whitespace-pre-wrap">{name}</h1>
                            </div>

                            <div className="pt-6 border-t border-zinc-900 flex flex-col items-center">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] block mb-2">{dict.entities.biography}</span>
                                <p className="text-base text-zinc-300 leading-relaxed font-serif italic italic-shadow text-center">
                                    {bio || dict.entities.biography_empty}
                                </p>
                            </div>


                        </div >
                    </div >

                    {/* CENTER PANEL: UPLINK_TERMINAL */}
                    < div className="lg:col-span-5 bg-black border-r border-zinc-900 min-h-screen" >
                        <div className="lg:sticky lg:top-0 z-20 h-16 lg:h-20 bg-zinc-950/90 backdrop-blur-md px-4 lg:px-6 border-b border-zinc-900">
                            <div className="flex items-center justify-between h-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-zinc-600 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-emerald-500/50" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase italic">Active_Links</span>
                                </div>
                                <span className="hidden sm:block text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-tighter px-3 py-1 bg-zinc-900 border border-zinc-800">Registry_Uplink // Stable_Channel</span>
                            </div>
                        </div >

                        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                            {Array.isArray(entity.socialLinks) && entity.socialLinks.length > 0 ? (
                                entity.socialLinks.map((link: any, i: number) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative block bg-zinc-950 border border-zinc-900 hover:border-white p-4 lg:p-6 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 lg:gap-6">
                                                <div className="w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center bg-zinc-900 border border-zinc-800 group-hover:border-zinc-500 group-hover:bg-zinc-950 transition-colors">
                                                    <BrandIcon
                                                        platform={link.platform}
                                                        className="text-zinc-400 group-hover:text-white w-full h-full"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400">Current_Channel</div>
                                                    <div className="text-lg lg:text-xl font-black uppercase tracking-widest text-zinc-100 group-hover:text-white transition-colors">
                                                        {link.platform || 'General Terminal'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Icon icon="lucide:chevron-right" className="text-zinc-700 group-hover:text-white transition-all outline-none" width={24} />
                                                <span className="text-[10px] font-mono text-emerald-500/0 group-hover:text-emerald-500/60 transition-all uppercase font-black tracking-widest">LIVE</span>
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
                                    <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-3">
                                        <div className="w-1.5 h-4 bg-zinc-800" /> Featured_Artifact
                                    </div>
                                    <Link href={`/artifacts/${sortedCredits[0].artifact.id}`} className="block group relative bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
                                        <div className="aspect-16/9 md:group-hover:contrast-125 transition-all duration-700">
                                            {sortedCredits[0].artifact.thumbnail?.url ? (
                                                <img src={sortedCredits[0].artifact.thumbnail.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
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
                    </div >

                    {/* RIGHT PANEL: RESONANCE_SHARDS */}
                    < div className="lg:col-span-4 bg-black p-0 min-h-screen" >
                        {/* Shard Archive Header */}
                        <div className="lg:sticky lg:top-0 z-20 h-16 lg:h-20 bg-zinc-950/90 backdrop-blur-md px-4 lg:px-6 border-b border-zinc-900">
                            <div className="flex items-center justify-between h-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-zinc-600 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-zinc-300" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase italic">Archive</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-zinc-500 py-1 px-3 bg-zinc-900 border border-zinc-800 uppercase tracking-tighter">COUNT: {sortedCredits.length}</span>
                            </div>
                        </div >

                        <div className="divide-y divide-zinc-900">
                            {sortedCredits.length > 0 ? (
                                sortedCredits.map((credit: any, i: number) => (
                                    <Link
                                        key={i}
                                        href={`/artifacts/${credit.artifact.id}`}
                                        className="group flex flex-col p-4 lg:p-8 hover:bg-white/[0.03] transition-colors relative"
                                    >
                                        <div className="flex gap-4 lg:gap-8 items-start">
                                            <div className="w-24 h-16 lg:w-40 lg:h-24 bg-zinc-900 flex-shrink-0 border-2 border-zinc-800 overflow-hidden group-hover:border-white transition-all shadow-2xl">
                                                {credit.artifact.thumbnail?.url ? (
                                                    <img src={credit.artifact.thumbnail.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                                        <Icon icon="lucide:disc" width={32} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-3">
                                                <div className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-[0.2em] group-hover:text-violet-400 transition-colors flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-zinc-700 rounded-full group-hover:bg-violet-500 transition-colors" />
                                                    RES_{credit.artifact.resonance} // {credit.artifact.category}
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


                    </div >

                </div >
            </div >
        </MainLayout >
    );
}
