import React from 'react';
import { Icon } from '@iconify/react';
import { BentoCard, Badge, cn } from '@shimokitan/ui';
import { MainLayout } from '@/components/layout/MainLayout';
import { getArtifactById } from '@shimokitan/db';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';

export default async function ArtifactPage(props: { params: Promise<{ locale: string, id: string }> }) {
    const { locale, id } = await props.params;

    // Fetch by NanoID directly
    const artifact = await getArtifactById(id);

    if (!artifact) {
        notFound();
    }

    // Get localized content
    const translation = artifact.translations?.find((t: any) => t.locale === locale) || artifact.translations?.[0];
    const title = translation?.title || "Untitled";
    const description = translation?.description || "";

    // Helper to get primary resource
    const primaryResource = artifact.resources?.find((r: any) => r.isPrimary) || artifact.resources?.[0];

    // Find the primary artist/author for the header
    const primaryCredit = artifact.credits?.find((c: any) => c.isPrimary && c.contributorClass === 'author') ||
        artifact.credits?.find((c: any) => c.isPrimary) ||
        artifact.credits?.[0];
    const primaryEntity = primaryCredit?.entity;
    const primaryArtistName = primaryEntity?.translations?.find((t: any) => t.locale === locale)?.name ||
        primaryEntity?.translations?.[0]?.name ||
        "ANONYMOUS_SOURCE";

    return (
        <MainLayout>
            <div className="w-full flex flex-col gap-8 animate-in fade-in duration-700 pb-24">

                {/* 1. Identity Header: Compact & High Impact */}
                <header className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-zinc-900 relative">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-px bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.3)]" />
                            <div className="flex flex-col">
                                <span className="text-[11px] font-mono text-rose-500 uppercase tracking-[0.3em] font-black italic">
                                    Registry_Record // Sector_03
                                </span>
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] font-bold mt-0.5">
                                    Authenticity_Verified // Ver_{artifact.id.slice(-2).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase italic leading-none text-white transition-all">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col items-end gap-1 font-mono">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Classification_Unit</span>
                            <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-sm italic font-black text-white tracking-tighter uppercase relative group">
                                <div className="absolute top-0 left-0 w-0.5 h-full bg-violet-600" />
                                {artifact.category}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 font-mono">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Status_Feed</span>
                            <div className="flex items-center gap-2 px-1 text-[10px] text-emerald-500 uppercase tracking-widest font-black italic bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                SIGNAL_OK
                            </div>
                        </div>
                    </div>
                </header>

                {/* 2. Main Console: Editorial Flow */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pl-1 pr-1 lg:pl-0 lg:pr-0">

                    {/* Left Column: Media & Content (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-8">

                        {/* 2.1 Media Hero */}
                        <div className="flex flex-col gap-3">
                            <BentoCard className="w-full aspect-video p-0 bg-black overflow-hidden relative border-zinc-900 shadow-2xl group" minimal>
                                {/* Ambient Signal Aura */}
                                <div className="absolute inset-0 opacity-20 filter blur-3xl saturate-200 pointer-events-none scale-110">
                                    <img src={(artifact as any).cover?.url || undefined} className="w-full h-full object-cover" />
                                </div>

                                {primaryResource?.platform === 'youtube' ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${primaryResource.value.includes('v=') ? primaryResource.value.split('v=')[1].split('&')[0] : primaryResource.value.split('/').pop()}`}
                                        className="absolute inset-0 w-full h-full border-0 z-10"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img src={(artifact as any).cover?.url || undefined} className="w-full h-full object-cover opacity-60 mix-blend-screen" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                    </div>
                                )}

                                {/* HUD Frame */}
                                <div className="absolute top-4 left-4 flex flex-col gap-0.5 opacity-40 z-20 pointer-events-none">
                                    <div className="flex gap-0.5">
                                        {[1, 2].map(i => <div key={i} className="w-2 h-0.5 bg-violet-500" />)}
                                    </div>
                                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">SIGNAL_LOCK // 16:9</span>
                                </div>
                            </BentoCard>

                            {/* Back Link & Session */}
                            <div className="flex items-center justify-between px-1 mt-2">
                                <Link href="/artifacts" className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-[10px] font-mono font-black uppercase tracking-[0.2em] group">
                                    <Icon icon="lucide:arrow-left" className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                                    BACK_TO_DATABASE
                                </Link>
                                <div className="text-[9px] font-mono text-zinc-700 font-bold uppercase tracking-[0.3em]">
                                    SESSION_ID // SHM_{Math.random().toString(36).slice(2, 6).toUpperCase()}
                                </div>
                            </div>
                        </div>

                        {/* 2.2 Editorial Analysis */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-px bg-violet-600" />
                                <span className="text-[11px] font-mono text-violet-500 font-black uppercase tracking-[0.4em]">Editorial_Analysis</span>
                            </div>
                            <div className="prose prose-invert prose-zinc max-w-none">
                                <p className="text-base lg:text-lg text-zinc-300 italic font-medium leading-relaxed tracking-tight">
                                    {description || "UNIDENTIFIED_CONTENT_ORIGIN"}
                                </p>
                            </div>
                        </div>

                        {/* 2.3 Tags */}
                        {artifact.tags && artifact.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-900/50">
                                {artifact.tags.map((at: any, i: number) => (
                                    <span key={`tag-${i}`} className="px-2.5 py-1 bg-zinc-900/50 border border-zinc-800 text-[10px] font-mono font-black text-zinc-400 rounded-md hover:border-zinc-700 hover:text-zinc-300 transition-colors uppercase tracking-widest">
                                        #{at.tag.translations?.find((t: any) => t.locale === locale)?.name || at.tag.translations?.[0]?.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 2.4 Echo Flux (Zines/Reviews) */}
                        <div className="flex flex-col gap-4 pt-12">
                            <div className="flex items-center justify-between pb-4 border-b border-zinc-900/50">
                                <div className="flex items-center gap-2">
                                    <Icon icon="lucide:message-square-quote" width={16} className="text-rose-500" />
                                    <h3 className="text-sm font-mono text-white font-black uppercase tracking-[0.3em]">Echo_Flux</h3>
                                    <Badge variant="clean" className="ml-2 text-[10px] bg-rose-500/10 text-rose-500 border-rose-500/20">{artifact.zines?.length || 0}</Badge>
                                </div>
                                <Link
                                    href={`/artifacts/${id}/zines/post`}
                                    className="flex items-center gap-1.5 text-[10px] font-mono font-black text-rose-500 hover:text-white hover:bg-rose-600 transition-all px-3 py-1.5 rounded-md border border-rose-600/30 uppercase tracking-widest"
                                >
                                    <Icon icon="lucide:plus" width={12} />
                                    INITIALIZE_ZINE
                                </Link>
                            </div>

                            <div className="flex flex-col gap-4">
                                {artifact.zines?.length ? artifact.zines.map((zine: any) => (
                                    <div key={zine.id} className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl relative overflow-hidden group/zine">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-600/50" />
                                        <p className="text-sm text-zinc-300 italic leading-relaxed">
                                            &ldquo;{zine.translations?.find((t: any) => t.locale === locale)?.content || zine.translations?.[0]?.content}&rdquo;
                                        </p>
                                        <div className="flex justify-between items-center mt-4 text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500">
                                            <span className="flex items-center gap-2">
                                                <Icon icon="lucide:user" width={10} />
                                                {zine.author?.name}
                                            </span>
                                            <span className="text-rose-500 border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded">+{zine.resonance || 0}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-8 border border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest italic">
                                        NO_ECHOES_DETECTED
                                    </div>
                                )}
                            </div>
                            {artifact.zines && artifact.zines.length > 2 && (
                                <Link
                                    href={`/artifacts/${id}/zines`}
                                    className="block mt-2 text-center p-3 bg-zinc-900/20 border border-zinc-800 rounded-lg text-[10px] font-mono font-black text-zinc-500 hover:text-white hover:border-zinc-700 transition-all uppercase tracking-[0.2em]"
                                >
                                    [ VIEW_FULL_ARCHIVE // SIGNAL_OVERFLOW ]
                                </Link>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Sticky Sidebar (4 cols) */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-24 flex flex-col gap-8">

                            {/* Resonance Gauge */}
                            <div className="bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-2xl relative shadow-lg overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-rose-900/10 to-transparent pointer-events-none" />
                                <div className="relative z-10 flex items-center justify-between gap-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                                            <span className="text-[10px] font-mono text-rose-400 font-black uppercase tracking-[0.3em]">Resonance</span>
                                        </div>
                                        <div className="text-4xl lg:text-5xl font-black italic text-white tracking-tighter leading-none">
                                            <span className="text-zinc-700 text-3xl group-hover:text-rose-600 transition-colors">+</span>{(artifact.score || 0)}
                                        </div>
                                    </div>
                                    <div className="flex-1 h-12 bg-black border border-zinc-800 rounded-lg flex items-end p-1 overflow-hidden relative">
                                        <div
                                            className="w-full bg-gradient-to-t from-rose-900 to-rose-500 shadow-[0_0_12px_rgba(225,29,72,0.5)] relative z-10"
                                            style={{ height: `${Math.min(100, (artifact.score || 0) * 10)}%` }}
                                        />
                                        <div className="absolute inset-0 cyber-grid opacity-10" />
                                    </div>
                                </div>
                            </div>

                            {/* Provenance Tree (Entity & Credits) */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 mb-1 px-1">
                                    <Icon icon="lucide:cpu" width={14} className="text-zinc-500" />
                                    <span className="text-[11px] font-mono text-white font-black uppercase tracking-[0.3em]">Provenance_Tree</span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {/* Primary Artist */}
                                    <Link
                                        href={`/artists/${primaryEntity?.id || '#'}`}
                                        className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl flex items-center gap-4 hover:border-violet-500/50 hover:bg-zinc-900 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-violet-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-10 h-10 shrink-0 relative p-0.5 border border-zinc-700 rounded-full bg-zinc-950 group-hover:border-violet-400 transition-all duration-500">
                                            {primaryEntity?.avatar?.url ? (
                                                <img src={primaryEntity.avatar.url} className="w-full h-full object-cover rounded-full md:grayscale md:group-hover:grayscale-0 transition-all" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-900">
                                                    <Icon icon="lucide:user" width={16} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[9px] font-mono text-violet-400 font-bold uppercase tracking-[0.2em] mb-0.5 block">Primary_Source</span>
                                            <div className="text-sm font-black text-zinc-200 group-hover:text-white transition-colors truncate italic uppercase tracking-tighter">
                                                {primaryArtistName}
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Additional Credits */}
                                    {artifact.credits?.filter((c: any) => !c.isPrimary || c.contributorClass === 'staff').map((credit: any, i: number) => {
                                        const name = credit.entity.translations?.find((t: any) => t.locale === locale)?.name || credit.entity.translations?.[0]?.name || "Anon";
                                        return (
                                            <Link
                                                key={`crew-${i}`}
                                                href={`/artists/${credit.entityId}`}
                                                className="flex items-center gap-3 p-2.5 bg-zinc-900/30 border border-zinc-800/80 rounded-lg hover:border-violet-500/30 transition-all group/item ml-4"
                                            >
                                                <div className="w-7 h-7 shrink-0 bg-zinc-950 border border-zinc-800 rounded md:grayscale md:group-hover/item:grayscale-0 transition-all flex items-center justify-center">
                                                    {credit.entity.avatar?.url ? (
                                                        <img src={credit.entity.avatar.url} className="w-full h-full object-cover rounded-sm" />
                                                    ) : (
                                                        <Icon icon="lucide:user" width={12} className="text-zinc-700" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-[11px] font-bold text-zinc-400 group-hover/item:text-zinc-200 truncate uppercase italic leading-none transition-colors">{name}</div>
                                                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1 truncate">{credit.displayRole || credit.role}</div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Gateway Links */}
                            {artifact.resources && artifact.resources.length > 0 && (
                                <div className="flex flex-col gap-2 pt-2">
                                    <div className="flex items-center justify-between px-1 mb-1">
                                        <span className="text-[10px] font-mono text-zinc-500 font-black uppercase tracking-[0.4em]">Gateway_Links</span>
                                        <span className="text-[9px] font-mono text-zinc-700">UPLINK_STABLE</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        {artifact.resources.map((res: any, i: number) => (
                                            <a
                                                key={i}
                                                href={res.value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800 hover:border-violet-500/50 hover:bg-zinc-900 transition-all group/gate rounded-xl"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-800 group-hover/gate:border-violet-500/50 transition-all shadow-inner">
                                                        <Icon icon={`simple-icons:${res.platform.toLowerCase()}`} className="text-zinc-500 group-hover/gate:text-violet-400" width={14} />
                                                    </div>
                                                    <span className="text-[11px] font-black text-zinc-400 group-hover/gate:text-white uppercase tracking-tighter transition-colors">{res.platform}</span>
                                                </div>
                                                <Icon icon="lucide:external-link" width={12} className="text-zinc-800 group-hover/gate:text-violet-500" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
