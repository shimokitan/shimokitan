import React from 'react';
import { Icon } from '@iconify/react';
import { BentoCard, Badge, cn } from '@shimokitan/ui';
import { MainLayout } from '@/components/layout/MainLayout';
import { getArtifactById } from '@shimokitan/db';
import Link from '@/components/Link';
import { getEntityUrl } from '@shimokitan/utils';
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

    // Original artists from ledger - single source of truth for provenance root
    const originalArtistCredits = artifact.credits?.filter((c: any) => c.isOriginalArtist) || [];

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

    // Specs categorization
    const specs = (artifact.specs as Record<string, any>) || {};
    const hasSpecs = Object.keys(specs).length > 0;

    return (
        <MainLayout>
            <div className="w-full flex flex-col gap-8 animate-in fade-in duration-700 pb-24 text-white">

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
                                    Authenticity_Verified // ID_{artifact.id.slice(0, 8).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase italic leading-none text-white transition-all">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col items-end gap-1 font-mono">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Nature_Registry</span>
                            <div className="px-3 py-1 bg-violet-600/10 border border-violet-600/30 text-[10px] italic font-black text-violet-400 tracking-tighter uppercase relative group">
                                <div className="absolute top-0 left-0 w-0.5 h-full bg-violet-600" />
                                {artifact.nature || 'original'}
                            </div>
                        </div>
                        <div className="hidden lg:flex flex-col items-end gap-1 font-mono">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Classification</span>
                            <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] italic font-black text-white tracking-tighter uppercase relative group">
                                {artifact.category || 'music'}
                                {artifact.animeType && ` // ${artifact.animeType}`}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 font-mono">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">Signal_Status</span>
                            <div className="flex items-center gap-2 px-3 py-1 text-[10px] text-emerald-500 uppercase tracking-widest font-black italic bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {(artifact.status || 'the_pit').replace(/_/g, ' ')}
                            </div>
                        </div>
                    </div>
                </header>

                {/* 2. Main Console: Editorial Flow */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Media & Content (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-8">

                        {/* 2.1 Media Hero */}
                        <div className="flex flex-col gap-3">
                            <BentoCard className="w-full aspect-video p-0 bg-black overflow-hidden relative border-zinc-900 shadow-2xl group" minimal>
                                {/* Ambient Signal Aura */}
                                <div className="absolute inset-0 opacity-20 filter blur-3xl saturate-200 pointer-events-none scale-110">
                                    <img src={artifact.thumbnail?.url || undefined} className="w-full h-full object-cover" />
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
                                        <img src={artifact.thumbnail?.url || undefined} className="w-full h-full object-cover opacity-60 mix-blend-screen" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                    </div>
                                )}

                                {/* HUD Frame */}
                                <div className="absolute top-4 left-4 flex flex-col gap-0.5 opacity-40 z-20 pointer-events-none">
                                    <div className="flex gap-0.5">
                                        {[1, 2].map(i => <div key={i} className="w-2 h-0.5 bg-violet-500" />)}
                                    </div>
                                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">SIGNAL_LOCK // {(artifact as any).hostingStatus || 'OFFLINE'}</span>
                                </div>
                            </BentoCard>

                            {/* Back Link & Session */}
                            <div className="flex items-center justify-between px-1 mt-2">
                                <Link href="/artifacts" className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-[10px] font-mono font-black uppercase tracking-[0.2em] group">
                                    <Icon icon="lucide:arrow-left" className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                    BACK_TO_DATABASE
                                </Link>
                                <div className="text-[9px] font-mono text-zinc-700 font-bold uppercase tracking-[0.3em]">
                                    REGISTRY_VERIFY // {artifact.isVerified ? 'ENCRYPTED_AUTH' : 'OPEN_SOURCE'}
                                </div>
                            </div>
                        </div>


                        {/* 2.3 Editorial Analysis */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-px bg-violet-600" />
                                <span className="text-[11px] font-mono text-violet-500 font-black uppercase tracking-[0.4em]">Editorial_Analysis</span>
                            </div>
                            {description ? (
                                <div className="prose prose-invert prose-zinc max-w-none">
                                    <p className="text-base lg:text-lg text-zinc-300 italic font-medium leading-relaxed tracking-tight whitespace-pre-wrap">
                                        {description}
                                    </p>
                                </div>
                            ) : (
                                <div className="p-8 border border-dashed border-zinc-900 rounded-2xl flex items-center justify-center text-[10px] font-mono text-zinc-700 uppercase tracking-widest italic bg-zinc-950/20">
                                    ANALYSIS_PENDING // VACUUM_STATE
                                </div>
                            )}
                        </div>

                        {/* 2.4 Specs Grid */}
                        {hasSpecs && (
                            <div className="flex flex-col gap-4 pt-6 mt-4 border-t border-zinc-900/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-px bg-zinc-700" />
                                    <span className="text-[9px] font-mono text-zinc-500 font-black uppercase tracking-[0.4em]">Technical_Specifications</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(specs).map(([key, value]) => {
                                        let displayValue = typeof value === 'boolean' ? (value ? 'YES' : 'NO') : String(value);
                                        
                                        if (key === 'durationMs' && typeof value === 'number') {
                                            const mins = Math.floor(value / 60000);
                                            const secs = Math.floor((value % 60000) / 1000);
                                            displayValue = `${mins}:${secs.toString().padStart(2, '0')}`;
                                        }

                                        return (
                                            <div key={key} className="flex flex-col p-3 bg-zinc-950 border border-zinc-900 rounded-lg">
                                                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{key.replace(/([A-Z])/g, '_$1')}</span>
                                                <span className="text-xs font-black uppercase italic text-zinc-300">
                                                    {displayValue}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 2.5 Tags */}
                        {artifact.tags && artifact.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-6 mt-4 border-t border-zinc-900/50">
                                {artifact.tags.map((at: any, i: number) => (
                                    <span key={`tag-${i}`} className="px-2.5 py-1 bg-zinc-900/50 border border-zinc-800 text-[10px] font-mono font-black text-zinc-400 rounded-md hover:border-zinc-700 hover:text-zinc-300 transition-colors uppercase tracking-widest">
                                        #{at.tag.translations?.find((t: any) => t.locale === locale)?.name || at.tag.translations?.[0]?.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 2.6 Echo Flux (Zines) */}
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
                                    <div key={zine.id} className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl relative overflow-hidden group/zine transition-colors hover:border-zinc-800">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-600/30" />
                                        <p className="text-sm md:text-base text-amber-50/80 font-serif italic leading-relaxed">
                                            &ldquo;{zine.translations?.find((t: any) => t.locale === locale)?.content || zine.translations?.[0]?.content}&rdquo;
                                        </p>
                                        <div className="flex justify-between items-center mt-6 text-[10px] font-mono font-black uppercase tracking-widest text-zinc-600">
                                            <span className="flex items-center gap-2 group-hover/zine:text-zinc-400 transition-colors">
                                                <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                                    <Icon icon="lucide:user" width={10} />
                                                </div>
                                                {zine.author?.name || 'Resident'}
                                            </span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[9px] text-zinc-800 italic">LOG_{new Date(zine.createdAt).toLocaleDateString()}</span>
                                                {zine.resonance > 0 && (
                                                    <div className="flex items-center gap-2 text-rose-600 italic">
                                                        <Icon icon="lucide:radio" width={10} />
                                                        <span>Resonance // {zine.resonance}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 border border-dashed border-zinc-900 rounded-2xl flex items-center justify-center text-[10px] font-mono text-zinc-700 uppercase tracking-widest italic bg-zinc-950/20">
                                        NO_ECHOES_DETECTED // VACUUM_STATE
                                    </div>
                                )}
                            </div>
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
                                            {artifact.resonance || 0}
                                        </div>
                                    </div>
                                    <div className="flex-1 h-12 bg-black border border-zinc-800 rounded-lg flex items-end p-1 overflow-hidden relative">
                                        <div
                                            className="w-full bg-gradient-to-t from-rose-900 to-rose-500 shadow-[0_0_12px_rgba(225,29,72,0.5)] relative z-10 animate-pulse"
                                            style={{ height: `${Math.min(100, (artifact.resonance || 0) * 1.33)}%` }}
                                        />
                                        <div className="absolute inset-0 cyber-grid opacity-10" />
                                    </div>
                                </div>
                            </div>

                            {/* Provenance Tree (Entity & Credits) */}
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-2 mb-1 px-1">
                                    <Icon icon="lucide:cpu" width={14} className="text-zinc-500" />
                                    <span className="text-[11px] font-mono text-white font-black uppercase tracking-[0.3em]">Provenance_Tree</span>
                                </div>

                                <div className="flex flex-col gap-6">
                                    {[
                                        { id: 'ROOT_AUTHORITY', label: 'Root_Authority', source: true },
                                        { id: 'CORE_AUTHORITY', label: 'Core_Authority', classes: ['author'] },
                                        { id: 'COLLABORATIVE_FLUX', label: 'Collaborative_Flux', classes: ['collaborator'] },
                                        { id: 'SUPPORT_GRID', label: 'Support_Grid', classes: ['staff'] }
                                    ].map((group) => {
                                        if (group.source) {
                                            const hasOrigin = artifact.sourceArtifact || artifact.externalOriginal || originalArtistCredits.length > 0;
                                            if (!hasOrigin) return null;

                                            return (
                                                <div key={group.id} className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 px-1 mb-1">
                                                        <Icon icon="lucide:anchor" width={10} className="text-rose-500" />
                                                        <span className="text-[8px] font-mono text-rose-500 font-bold uppercase tracking-[0.4em]">{group.label}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {artifact.sourceArtifact && (
                                                            <Link
                                                                href={`/artifacts/${artifact.sourceArtifact.id}`}
                                                                className="flex items-center gap-3 p-2.5 bg-rose-950/20 border border-rose-900/30 rounded-lg group/root transition-all hover:bg-rose-900/10 relative overflow-hidden"
                                                            >
                                                                <div className="absolute top-0 left-0 w-0.5 h-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.5)]" />
                                                                <div className="w-8 h-8 shrink-0 bg-zinc-950 border border-zinc-800 rounded overflow-hidden flex items-center justify-center">
                                                                    {artifact.sourceArtifact.thumbnail?.url ? (
                                                                        <img src={artifact.sourceArtifact.thumbnail.url} className="w-full h-full object-cover grayscale opacity-50 group-hover/root:grayscale-0 group-hover/root:opacity-100 transition-all" />
                                                                    ) : (
                                                                        <Icon icon="lucide:database" width={14} className="text-zinc-700" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="text-[11px] font-black text-rose-100 uppercase italic truncate">
                                                                        {artifact.sourceArtifact.translations?.find((t: any) => t.locale === locale)?.title || artifact.sourceArtifact.translations?.[0]?.title}
                                                                    </div>
                                                                    <div className="text-[9px] font-mono text-rose-500/60 uppercase tracking-widest mt-1 italic">LINKED_REGISTRY</div>
                                                                </div>
                                                            </Link>
                                                        )}

                                                        {artifact.externalOriginal && (
                                                            <div className="flex items-center gap-3 p-2.5 bg-rose-950/10 border border-rose-900/20 rounded-lg relative overflow-hidden">
                                                                <div className="absolute top-0 left-0 w-0.5 h-full bg-rose-900/50" />
                                                                <div className="w-8 h-8 shrink-0 bg-zinc-950 border border-zinc-900 rounded overflow-hidden flex items-center justify-center">
                                                                    <Icon icon="lucide:external-link" width={14} className="text-rose-900" />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="text-[11px] font-black text-rose-200 uppercase italic truncate">
                                                                        {artifact.externalOriginal.title}
                                                                    </div>
                                                                    <div className="text-[9px] font-mono text-rose-800 uppercase tracking-widest mt-1 italic">EXTERNAL_ORIGIN</div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {originalArtistCredits.length > 0 && !artifact.sourceArtifact && !artifact.externalOriginal && (
                                                            <div className="flex flex-col gap-2">
                                                                {originalArtistCredits.map((credit: any, i: number) => {
                                                                    const name = credit.entity?.translations?.find((t: any) => t.locale === locale)?.name || credit.entity?.translations?.[0]?.name || "ANON";
                                                                    const url = credit.entity ? getEntityUrl(credit.entity) : "#";
                                                                    
                                                                    return (
                                                                        <Link 
                                                                            key={i} 
                                                                            href={url}
                                                                            className="flex items-center gap-3 p-2.5 bg-rose-950/20 border border-rose-900/30 rounded-lg group/root transition-all hover:bg-rose-900/10 relative overflow-hidden"
                                                                        >
                                                                            <div className="absolute top-0 left-0 w-0.5 h-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.5)]" />
                                                                            <div className="w-8 h-8 shrink-0 bg-zinc-950 border border-zinc-800 rounded overflow-hidden flex items-center justify-center">
                                                                                {credit.entity?.avatar?.url ? (
                                                                                    <img src={credit.entity.avatar.url} className="w-full h-full object-cover grayscale opacity-50 group-hover/root:grayscale-0 group-hover/root:opacity-100 transition-all" />
                                                                                ) : (
                                                                                    <Icon icon="lucide:feather" width={14} className="text-rose-900" />
                                                                                )}
                                                                            </div>
                                                                            <div className="min-w-0 flex-1">
                                                                                <div className="text-[11px] font-black text-rose-100 uppercase italic truncate">
                                                                                    {name}
                                                                                </div>
                                                                                <div className="text-[9px] font-mono text-rose-500/60 uppercase tracking-widest mt-1 italic">CITATIONAL_ANCESTRY</div>
                                                                            </div>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-center -mb-2 -mt-1 opacity-50">
                                                        <div className="h-4 w-px border-l border-dashed border-rose-900" />
                                                    </div>
                                                </div>
                                            );
                                        }

                                        const groupCredits = artifact.credits?.filter((c: any) => 
                                            group.classes!.includes(c.contributorClass) && !c.isOriginalArtist
                                        ) || [];
                                        if (groupCredits.length === 0) return null;

                                        return (
                                            <div key={group.id} className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 px-1 mb-1">
                                                    <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                                                    <span className="text-[8px] font-mono text-zinc-600 font-bold uppercase tracking-[0.4em]">{group.label}</span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {groupCredits.sort((a: any, b: any) => (a.isPrimary ? -1 : 1)).map((credit: any, i: number) => {
                                                        const name = credit.entity?.translations?.find((t: any) => t.locale === locale)?.name || credit.entity?.translations?.[0]?.name || "Anon";
                                                        const isEncrypted = credit.entity?.isEncrypted;
                                                        const isPrimary = credit.isPrimary;
                                                        const isOriginal = credit.isOriginalArtist;

                                                        return (
                                                            <Link
                                                                key={`${group.id}-${i}`}
                                                                href={credit.entity ? getEntityUrl(credit.entity) : '#'}
                                                                className={cn(
                                                                    "flex items-center gap-3 p-2.5 bg-zinc-900/30 border border-zinc-800/80 rounded-lg transition-all group/item relative overflow-hidden",
                                                                    credit.entity && "hover:border-violet-500/30 hover:bg-zinc-900/50",
                                                                    isPrimary && "bg-zinc-900 border-zinc-700/50 shadow-lg",
                                                                    isOriginal && "border-rose-900/30 bg-rose-900/5"
                                                                )}
                                                            >
                                                                {isPrimary && (
                                                                    <div className="absolute top-0 left-0 w-0.5 h-full bg-violet-600 shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                                                                )}
                                                                {isOriginal && (
                                                                    <div className="absolute top-0 right-0 p-1 opacity-20">
                                                                        <Icon icon="lucide:star" width={8} className="text-rose-500" />
                                                                    </div>
                                                                )}

                                                                <div className="w-8 h-8 shrink-0 bg-zinc-950 border border-zinc-800 rounded transition-all flex items-center justify-center relative overflow-hidden">
                                                                    {credit.entity?.avatar?.url ? (
                                                                        <img src={credit.entity.avatar.url} className="w-full h-full object-cover rounded-sm grayscale group-hover/item:grayscale-0" />
                                                                    ) : (
                                                                        <Icon icon={isEncrypted ? "lucide:lock" : "lucide:user"} width={14} className="text-zinc-700" />
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <div className={cn(
                                                                            "text-[11px] font-bold text-zinc-400 group-hover/item:text-zinc-100 truncate uppercase italic leading-none transition-colors",
                                                                            isPrimary && "text-white text-xs font-black"
                                                                        )}>
                                                                            {name}
                                                                        </div>
                                                                        {isOriginal && (
                                                                            <span className="text-[7px] font-mono text-rose-500 border border-rose-500/20 px-1 rounded-sm uppercase tracking-tighter">SOURCE_AUTHORITY</span>
                                                                        )}
                                                                        {isEncrypted && (
                                                                            <Icon icon="lucide:lock" width={8} className="text-rose-500/50" />
                                                                        )}
                                                                    </div>
                                                                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1 truncate">
                                                                        {credit.displayRole || credit.role.replace(/_/g, ' ')}
                                                                        {isPrimary && " // PRIMARY"}
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Gateway Links */}
                            {artifact.resources && artifact.resources.length > 0 && (
                                <div className="flex flex-col gap-2 pt-2">
                                    <div className="flex items-center justify-between px-1 mb-1">
                                        <span className="text-[10px] font-mono text-zinc-500 font-black uppercase tracking-[0.4em]">Gateway_Links</span>
                                        <span className="text-[9px] font-mono text-zinc-700 animate-pulse">UPLINK_STABLE</span>
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
                                                        <Icon icon={res.platform === 'r2_hosted' ? 'lucide:box' : `simple-icons:${res.platform.toLowerCase()}`} className="text-zinc-500 group-hover/gate:text-violet-400" width={14} />
                                                    </div>
                                                    <span className="text-[11px] font-black text-zinc-400 group-hover/gate:text-white uppercase tracking-tighter transition-colors">{res.platform.replace(/_/g, ' ')}</span>
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
