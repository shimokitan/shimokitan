import React from 'react';
import { Icon } from '@iconify/react';
import { BrandIcon } from '@/components/BrandIcon';
import { Badge, cn } from '@shimokitan/ui';
import { MainLayout } from '@/components/layout/MainLayout';
import { getArtifactById } from '@shimokitan/db';
import Link from '@/components/Link';
import { getEntityUrl } from '@shimokitan/utils';
import { notFound } from 'next/navigation';
import { PlayButton } from './PlayButton';
import { StationTrack } from '@/lib/store/station-store';

export default async function ArtifactPage(props: { params: Promise<{ locale: string, id: string }> }) {
    const { locale, id } = await props.params;

    const artifact = await getArtifactById(id);
    if (!artifact) notFound();

    const translation = artifact.translations?.find((t: any) => t.locale === locale) || artifact.translations?.[0];
    const title = translation?.title || "Untitled";
    const description = translation?.description || "";

    const originalArtistCredits = artifact.credits?.filter((c: any) => c.isOriginalArtist) || [];
    const primaryResource = artifact.resources?.find((r: any) => r.isPrimary) || artifact.resources?.[0];

    const primaryCredit =
        artifact.credits?.find((c: any) => c.isPrimary && c.contributorClass === 'author') ||
        artifact.credits?.find((c: any) => c.isPrimary) ||
        artifact.credits?.[0];
    const primaryEntity = primaryCredit?.entity;
    const primaryArtistName =
        primaryEntity?.translations?.find((t: any) => t.locale === locale)?.name ||
        primaryEntity?.translations?.[0]?.name ||
        "ANONYMOUS_SOURCE";

    const specs = (artifact.specs as Record<string, any>) || {};
    const hasSpecs = Object.keys(specs).length > 0;

    const authorCredits = artifact.credits?.filter(
        (c: any) => c.contributorClass === 'author' && !c.isOriginalArtist
    ) || [];
    const collaboratorCredits = artifact.credits?.filter(
        (c: any) => c.contributorClass === 'collaborator' && !c.isOriginalArtist
    ) || [];
    const staffCredits = artifact.credits?.filter(
        (c: any) => c.contributorClass === 'staff' && !c.isOriginalArtist
    ) || [];

    const hasProvenance = artifact.sourceArtifact || artifact.externalOriginal || originalArtistCredits.length > 0;

    const hostedAudio = artifact.resources?.find((r: any) => r.role === 'hosted_audio');
    
    // Construct track data for AudioWidget
    const trackData: StationTrack | null = hostedAudio ? {
        title,
        artist: primaryArtistName,
        album: artifact.category || "Single",
        cover: artifact.vinyl?.url || artifact.thumbnail?.url || "",
        bitrate: (specs.bitrate as string) || "1411 KBPS",
        format: (specs.format as string) || "LOSSLESS",
        src: hostedAudio.value
    } : null;

    return (
        <MainLayout>
            <div className="h-[calc(100vh-var(--header-height,48px))] w-full flex flex-col overflow-hidden text-white font-mono bg-black">

                {/* ═══════════════════════════════════════════════════════
                    A. STATUS RIBBON
                ══════════════════════════════════════════════════════════ */}
                <div className="shrink-0 border-b border-zinc-800 bg-zinc-950">
                    <div className="grid grid-cols-4 divide-x divide-zinc-900">

                        {/* Nature */}
                        <div className="px-4 py-3 flex flex-col justify-center gap-1">
                            <span className="text-[9px] text-zinc-600 uppercase tracking-[0.3em]">Nature</span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-0.5 h-3.5 bg-violet-600 shrink-0" />
                                <span className="text-xs font-black italic text-violet-400 uppercase truncate">
                                    {artifact.nature || 'original'}
                                </span>
                            </div>
                        </div>

                        {/* Classification */}
                        <div className="px-4 py-3 flex flex-col justify-center gap-1">
                            <span className="text-[9px] text-zinc-600 uppercase tracking-[0.3em]">Classification</span>
                            <span className="text-xs font-black italic text-white uppercase truncate">
                                {artifact.category || 'music'}
                                {artifact.animeType && ` // ${artifact.animeType}`}
                            </span>
                        </div>

                        {/* Signal status */}
                        <div className="px-4 py-3 flex flex-col justify-center gap-1">
                            <span className="text-[9px] text-zinc-600 uppercase tracking-[0.3em]">Signal_Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                <span className="text-xs font-black italic text-emerald-400 uppercase truncate">
                                    {(artifact.status || 'the_pit').replace(/_/g, ' ')}
                                </span>
                            </div>
                        </div>

                        {/* Resonance bar */}
                        <div className="px-4 py-3 flex items-center gap-3">
                            <div className="flex flex-col gap-0.5 shrink-0">
                                <span className="text-[9px] text-rose-500 uppercase tracking-[0.3em]">Resonance</span>
                                <span className="text-lg font-black italic text-white leading-none">
                                    {artifact.resonance || 0}
                                </span>
                            </div>
                            <div className="flex-1 h-2 bg-zinc-900 border border-zinc-800 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-rose-900 to-rose-500 shadow-[0_0_6px_rgba(225,29,72,0.4)]"
                                    style={{ width: `${Math.min(100, (artifact.resonance || 0) * 1.33)}%` }}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════
                    MAIN CONSOLE — flex-1, no overflow
                    B(3) | C+D(5) | E(4)
                ══════════════════════════════════════════════════════════ */}
                <div className="flex-1 grid grid-cols-12 divide-x divide-zinc-900 overflow-hidden min-h-0">

                    {/* ── B. RECORD PANEL (3 cols) ──────────────────────── */}
                    <div className="col-span-3 flex flex-col overflow-hidden">

                        <PanelHeader label="Record_Panel" dot />

                        <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-zinc-900 scrollbar-none min-h-0">

                            {/* Primary source */}
                            <div className="px-4 py-3 flex flex-col gap-1 shrink-0">
                                <span className="text-[9px] text-zinc-600 uppercase tracking-[0.35em]">Primary_Source</span>
                                <span className="text-sm font-black italic text-white uppercase leading-tight">{primaryArtistName}</span>
                            </div>

                            {/* Specs */}
                            {hasSpecs && (
                                <div className="px-4 py-3 flex flex-col gap-2.5 shrink-0">
                                    <div className="flex items-center gap-1.5">
                                        <Icon icon="lucide:sliders-horizontal" width={11} className="text-zinc-600 shrink-0" />
                                        <span className="text-[9px] text-zinc-500 uppercase tracking-[0.35em] font-black">Specifications</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                                        {Object.entries(specs).map(([key, value]) => {
                                            let displayValue =
                                                typeof value === 'boolean' ? (value ? 'YES' : 'NO') : String(value);
                                            if (key === 'durationMs' && typeof value === 'number') {
                                                const mins = Math.floor(value / 60000);
                                                const secs = Math.floor((value % 60000) / 1000);
                                                displayValue = `${mins}:${secs.toString().padStart(2, '0')}`;
                                            }
                                            return (
                                                <div key={key} className="flex flex-col gap-0.5 border-l border-zinc-800 pl-2.5">
                                                    <span className="text-[8px] text-zinc-700 uppercase tracking-[0.15em] truncate">
                                                        {key.replace(/([A-Z])/g, '_$1')}
                                                    </span>
                                                    <span className="text-[11px] font-black uppercase text-zinc-300 truncate">
                                                        {displayValue}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {artifact.tags && artifact.tags.length > 0 && (
                                <div className="px-4 py-3 flex flex-col gap-2.5 shrink-0">
                                    <div className="flex items-center gap-1.5">
                                        <Icon icon="lucide:tag" width={11} className="text-zinc-600 shrink-0" />
                                        <span className="text-[9px] text-zinc-500 uppercase tracking-[0.35em] font-black">Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {artifact.tags.map((at: any, i: number) => (
                                            <span
                                                key={`tag-${i}`}
                                                className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[9px] font-black text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider"
                                            >
                                                #{at.tag.translations?.find((t: any) => t.locale === locale)?.name || at.tag.translations?.[0]?.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Gateway links */}
                            {artifact.resources && artifact.resources.length > 0 && (
                                <div className="px-4 py-3 flex flex-col gap-2.5 shrink-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Icon icon="lucide:link" width={11} className="text-zinc-600 shrink-0" />
                                            <span className="text-[9px] text-zinc-500 uppercase tracking-[0.35em] font-black">Gateway_Links</span>
                                        </div>
                                        <span className="text-[9px] text-zinc-700 animate-pulse">UPLINK_STABLE</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        {artifact.resources.map((res: any, i: number) => (
                                            <a
                                                key={i}
                                                href={res.value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between px-3 py-2 bg-zinc-900/40 border border-zinc-800 hover:border-violet-500/40 hover:bg-zinc-900 transition-all group/gate"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <BrandIcon
                                                        platform={res.platform}
                                                        className="text-zinc-600 group-hover/gate:text-violet-400 shrink-0"
                                                        width={12}
                                                        height={12}
                                                        fallbackIcon={res.platform === 'r2_hosted' ? 'lucide:box' : undefined}
                                                    />
                                                    <span className="text-[11px] font-black text-zinc-400 group-hover/gate:text-white uppercase tracking-tight transition-colors truncate">
                                                        {res.platform.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                                <Icon icon="lucide:external-link" width={11} className="text-zinc-800 group-hover/gate:text-violet-500 shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── C+D. MEDIA HUB + ANALYSIS + ECHO FLUX (5 cols) ── */}
                    <div className="col-span-5 flex flex-col overflow-hidden">

                        <PanelHeader
                            label="Media_Hub"
                            right={
                                <div className="flex items-center gap-4">
                                    {trackData && (
                                        <PlayButton 
                                            track={trackData} 
                                            className="flex items-center gap-2 text-[9px] font-black text-rose-500 hover:text-white transition-all px-2 py-1 border border-rose-500/40 uppercase tracking-widest bg-rose-500/5"
                                        />
                                    )}
                                    <span className="text-[7px] text-zinc-700 uppercase tracking-widest">SIGNAL_LOCK // {(artifact as any).isHosted ? 'HOSTED' : 'OFFLINE'}</span>
                                </div>
                            }
                        />

                        {/* ── Title strip — sits just above the video ── */}
                        <div className="shrink-0 px-4 py-2 border-b border-zinc-900 bg-zinc-950/60 overflow-hidden">
                            <h1 className="text-sm font-black uppercase italic leading-tight text-white truncate tracking-tight">
                                {title}
                            </h1>
                        </div>

                        {/* Media — aspect-video, width-driven height */}
                        <div className="shrink-0 relative w-full aspect-video bg-black overflow-hidden">
                            <div className="absolute inset-0 opacity-20 filter blur-3xl saturate-200 pointer-events-none scale-110 z-0">
                                <img src={artifact.thumbnail?.url || undefined} className="w-full h-full object-cover" />
                            </div>

                            {primaryResource?.platform === 'youtube' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${primaryResource.value.includes('v=')
                                        ? primaryResource.value.split('v=')[1].split('&')[0]
                                        : primaryResource.value.split('/').pop()
                                        }`}
                                    className="absolute inset-0 w-full h-full border-0 z-10"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <img src={artifact.thumbnail?.url || undefined} className="w-full h-full object-cover opacity-60 mix-blend-screen" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                </div>
                            )}

                            {/* HUD cage corners */}
                            <div className="absolute inset-0 z-20 pointer-events-none">
                                <div className="absolute top-2 left-2 border-t border-l border-violet-500/40 w-4 h-4" />
                                <div className="absolute top-2 right-2 border-t border-r border-violet-500/40 w-4 h-4" />
                                <div className="absolute bottom-2 left-2 border-b border-l border-violet-500/30 w-4 h-4" />
                                <div className="absolute bottom-2 right-2 border-b border-r border-violet-500/30 w-4 h-4" />
                                <span className="absolute bottom-2 right-7 text-[7px] font-mono text-zinc-700 uppercase tracking-widest">X:1920 Y:1080</span>
                            </div>
                        </div>

                        {/* Analysis */}
                        <div className="shrink-0 border-t border-zinc-900 px-4 pt-3 pb-3 flex flex-col gap-2 max-h-36 overflow-y-auto scrollbar-none">
                            <div className="flex items-center gap-1.5 shrink-0">
                                <div className="w-0.5 h-3.5 bg-violet-600 shrink-0" />
                                <span className="text-[10px] text-violet-500 uppercase tracking-[0.35em] font-black">Editorial_Analysis</span>
                            </div>
                            {description ? (
                                <p className="text-xs text-zinc-300 italic leading-relaxed tracking-tight whitespace-pre-wrap">
                                    {description}
                                </p>
                            ) : (
                                <span className="text-[9px] text-zinc-700 uppercase tracking-widest italic">
                                    ANALYSIS_PENDING // VACUUM_STATE
                                </span>
                            )}
                        </div>

                        {/* Echo Flux — fills remaining height */}
                        <div className="flex-1 flex flex-col overflow-hidden border-t border-zinc-900 min-h-0">
                            <div className="shrink-0 px-3 py-2 bg-zinc-950/60 border-b border-zinc-900 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                                    <Icon icon="lucide:message-square-quote" width={12} className="text-rose-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Echo_Flux</span>
                                    <Badge variant="clean" className="text-[9px] bg-rose-500/10 text-rose-500 border-rose-500/20">
                                        {artifact.zines?.length || 0}
                                    </Badge>
                                </div>
                                <Link
                                    href={`/artifacts/${id}/zines/post`}
                                    className="flex items-center gap-1 text-[9px] font-black text-rose-500 hover:text-white hover:bg-rose-600 transition-all px-2.5 py-1 border border-rose-600/30 uppercase tracking-widest"
                                >
                                    <Icon icon="lucide:plus" width={10} />
                                    INIT
                                </Link>
                            </div>

                            <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-zinc-900/60 scrollbar-none min-h-0">
                                {artifact.zines?.length ? artifact.zines.map((zine: any, idx: number) => (
                                    <div key={zine.id} className="flex gap-3 px-3 py-2.5 hover:bg-zinc-900/20 transition-colors group/zine shrink-0">
                                        <div className="flex flex-col items-center gap-0.5 shrink-0 pt-1">
                                            <div className="w-px h-2 bg-rose-600/40 group-hover/zine:bg-rose-600 transition-colors" />
                                            <span className="text-[8px] text-zinc-700 tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-amber-50/80 font-serif italic leading-snug line-clamp-2">
                                                &ldquo;{zine.translations?.find((t: any) => t.locale === locale)?.content || zine.translations?.[0]?.content}&rdquo;
                                            </p>
                                            <div className="flex items-center justify-between mt-1 text-[8px] text-zinc-700 uppercase tracking-widest">
                                                <span className="flex items-center gap-1">
                                                    <Icon icon="lucide:user" width={9} />
                                                    {zine.author?.name || 'Resident'}
                                                </span>
                                                <span className="italic">LOG_{new Date(zine.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="px-4 py-5 text-[9px] text-zinc-700 uppercase tracking-widest italic">
                                        NO_ECHOES_DETECTED // VACUUM_STATE
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── E. PROVENANCE TREE (4 cols) — THE ANCHOR ─────── */}
                    <div className="col-span-4 flex flex-col overflow-hidden">

                        <PanelHeader
                            label="Provenance_Tree"
                            icon="lucide:cpu"
                        />

                        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5 scrollbar-none min-h-0 relative">

                            {/* Spine line */}
                            <div className="absolute left-[18px] top-4 bottom-4 w-px bg-zinc-800/60 z-0" />

                            {/* ROOT_AUTHORITY */}
                            {hasProvenance && (
                                <div className="flex flex-col gap-2 relative z-10">
                                    <div className="absolute -left-[6px] top-[7px] w-2 h-2 rounded-full bg-rose-950 border border-rose-500 z-10 shadow-[0_0_6px_rgba(225,29,72,0.4)]" />
                                    <div className="flex items-center gap-2 pl-3 mb-0.5">
                                        <Icon icon="lucide:anchor" width={11} className="text-rose-500 shrink-0" />
                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.35em]">Root_Authority</span>
                                    </div>
                                    <div className="flex flex-col gap-2 pl-2">
                                        {artifact.sourceArtifact && (
                                            <Link href={`/artifacts/${artifact.sourceArtifact.id}`} className="flex items-center gap-3 p-2.5 bg-rose-950/20 border border-rose-900/30 hover:bg-rose-900/10 transition-all group/root relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-0.5 h-full bg-rose-600 shadow-[0_0_6px_rgba(225,29,72,0.5)]" />
                                                <div className="w-8 h-8 shrink-0 bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
                                                    {artifact.sourceArtifact.thumbnail?.url
                                                        ? <img src={artifact.sourceArtifact.thumbnail.url} className="w-full h-full object-cover grayscale opacity-50 group-hover/root:grayscale-0 group-hover/root:opacity-100 transition-all" />
                                                        : <Icon icon="lucide:database" width={13} className="text-zinc-700" />
                                                    }
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs font-black text-rose-100 uppercase italic truncate leading-tight">
                                                        {artifact.sourceArtifact.translations?.find((t: any) => t.locale === locale)?.title || artifact.sourceArtifact.translations?.[0]?.title}
                                                    </div>
                                                    <div className="text-[9px] text-rose-500/50 uppercase tracking-widest mt-0.5">LINKED_REGISTRY</div>
                                                </div>
                                            </Link>
                                        )}
                                        {artifact.externalOriginal && (
                                            <div className="flex items-center gap-3 p-2.5 bg-rose-950/10 border border-rose-900/20 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-0.5 h-full bg-rose-900/50" />
                                                <div className="w-8 h-8 shrink-0 bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                                                    <Icon icon="lucide:external-link" width={13} className="text-rose-900" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs font-black text-rose-200 uppercase italic truncate leading-tight">{artifact.externalOriginal.title}</div>
                                                    <div className="text-[9px] text-rose-800 uppercase tracking-widest mt-0.5">EXTERNAL_ORIGIN</div>
                                                </div>
                                            </div>
                                        )}
                                        {originalArtistCredits.length > 0 && !artifact.sourceArtifact && !artifact.externalOriginal &&
                                            originalArtistCredits.map((credit: any, i: number) => {
                                                const name = credit.entity?.translations?.find((t: any) => t.locale === locale)?.name || credit.entity?.translations?.[0]?.name || "ANON";
                                                return (
                                                    <Link key={i} href={credit.entity ? getEntityUrl(credit.entity) : '#'} className="flex items-center gap-3 p-2.5 bg-rose-950/20 border border-rose-900/30 hover:bg-rose-900/10 transition-all group/root relative overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-0.5 h-full bg-rose-600 shadow-[0_0_6px_rgba(225,29,72,0.5)]" />
                                                        <div className="w-8 h-8 shrink-0 bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
                                                            {credit.entity?.avatar?.url
                                                                ? <img src={credit.entity.avatar.url} className="w-full h-full object-cover grayscale opacity-50 group-hover/root:grayscale-0 group-hover/root:opacity-100 transition-all" />
                                                                : <Icon icon="lucide:feather" width={13} className="text-rose-900" />
                                                            }
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-xs font-black text-rose-100 uppercase italic truncate leading-tight">{name}</div>
                                                            <div className="text-[9px] text-rose-500/50 uppercase tracking-widest mt-0.5">CITATIONAL_ANCESTRY</div>
                                                        </div>
                                                    </Link>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            )}

                            {authorCredits.length > 0 && (
                                <TreeGroup label="Core_Authority" icon="lucide:pen-tool" color="violet" credits={authorCredits} locale={locale} />
                            )}
                            {collaboratorCredits.length > 0 && (
                                <TreeGroup label="Collaborative_Flux" icon="lucide:users" color="zinc" credits={collaboratorCredits} locale={locale} />
                            )}
                            {staffCredits.length > 0 && (
                                <TreeGroup label="Support_Grid" icon="lucide:user-cog" color="zinc" credits={staffCredits} locale={locale} />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}

// ── PanelHeader ───────────────────────────────────────────────────────────────
function PanelHeader({ label, icon, dot, right }: {
    label: string;
    icon?: string;
    dot?: boolean;
    right?: React.ReactNode;
}) {
    return (
        <div className="shrink-0 px-3 py-2 bg-zinc-950/80 border-b border-zinc-900 flex items-center gap-2">
            {dot && <div className="w-1.5 h-1.5 bg-zinc-600 shrink-0" />}
            {icon && <Icon icon={icon} width={12} className="text-zinc-500 shrink-0" />}
            <span className="text-[10px] text-zinc-400 uppercase tracking-[0.35em] font-black">{label}</span>
            {right && <div className="ml-auto">{right}</div>}
        </div>
    );
}

// ── TreeGroup ─────────────────────────────────────────────────────────────────
function TreeGroup({ label, icon, color, credits, locale }: {
    label: string;
    icon: string;
    color: 'violet' | 'zinc';
    credits: any[];
    locale: string;
}) {
    const labelColor = color === 'violet' ? 'text-violet-500' : 'text-zinc-600';
    const dotBorder = color === 'violet' ? 'border-violet-700' : 'border-zinc-700';

    return (
        <div className="flex flex-col gap-2 relative z-10">
            <div className={cn("absolute -left-[6px] top-[7px] w-2.5 h-2.5 rounded-full bg-zinc-950 border z-10", dotBorder)} />
            <div className="flex items-center gap-2 pl-3 mb-0.5">
                <Icon icon={icon} width={11} className={cn("shrink-0", labelColor)} />
                <span className={cn("text-[10px] font-black uppercase tracking-[0.35em]", labelColor)}>{label}</span>
            </div>
            <div className="flex flex-col gap-2 pl-2">
                {credits.sort((a: any, b: any) => a.isPrimary ? -1 : 1).map((credit: any, i: number) => (
                    <CreditRow key={i} credit={credit} locale={locale} isPrimary={credit.isPrimary} />
                ))}
            </div>
        </div>
    );
}

// ── CreditRow ─────────────────────────────────────────────────────────────────
function CreditRow({ credit, locale, isPrimary }: { credit: any; locale: string; isPrimary: boolean }) {
    const name =
        credit.entity?.translations?.find((t: any) => t.locale === locale)?.name ||
        credit.entity?.translations?.[0]?.name ||
        "Anon";
    const isEncrypted = credit.entity?.isEncrypted;
    const isOriginal = credit.isOriginalArtist;

    return (
        <Link
            href={credit.entity ? getEntityUrl(credit.entity) : '#'}
            className={cn(
                "flex items-center gap-3 p-2.5 border transition-all group/item relative overflow-hidden",
                isPrimary
                    ? "bg-zinc-900 border-zinc-700/50 hover:border-violet-500/30"
                    : "bg-zinc-900/30 border-zinc-800/60 hover:border-violet-500/20 hover:bg-zinc-900/50",
                isOriginal && "border-rose-900/30 bg-rose-900/5"
            )}
        >
            {isPrimary && (
                <div className="absolute top-0 left-0 w-0.5 h-full bg-violet-600 shadow-[0_0_6px_rgba(124,58,237,0.4)]" />
            )}
            <div className="w-8 h-8 shrink-0 bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden">
                {credit.entity?.avatar?.url ? (
                    <img src={credit.entity.avatar.url} className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all" />
                ) : (
                    <Icon
                        icon={isEncrypted ? "lucide:lock" : isPrimary ? "lucide:star" : "lucide:user"}
                        width={13}
                        className={cn("text-zinc-700", isPrimary && "text-violet-500")}
                    />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className={cn(
                    "text-xs font-bold uppercase italic truncate leading-tight transition-colors",
                    isPrimary ? "text-white font-black" : "text-zinc-400 group-hover/item:text-zinc-100"
                )}>
                    {name}
                    {isOriginal && (
                        <span className="ml-1 text-[8px] text-rose-500 border border-rose-500/20 px-0.5 not-italic">SRC</span>
                    )}
                </div>
                <div className="text-[9px] text-zinc-600 uppercase tracking-widest mt-0.5 truncate">
                    {credit.displayRole || credit.role.replace(/_/g, ' ')}
                    {isPrimary && " // PRIMARY"}
                </div>
            </div>
        </Link>
    );
}