import React from 'react';
import { Icon } from '@iconify/react';
import { BentoCard, Badge, cn } from '@shimokitan/ui';
import { MainLayout } from '@/components/layout/MainLayout';
import { getArtifactById } from '@shimokitan/db';
import Link from 'next/link';
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

    return (
        <MainLayout>
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                {/* 1. Header: The Masking Tape Label */}
                <div className={cn(
                    "flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-950 border-y p-3 relative overflow-hidden group transition-all duration-700",
                    artifact.isMajor ? "border-rose-600/50 shadow-[0_0_30px_rgba(225,29,72,0.05)]" : "border-zinc-800"
                )}>
                    {artifact.isMajor && (
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/5 via-transparent to-rose-600/5 animate-pulse" />
                    )}
                    <div className="absolute inset-0 bg-white/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none" />

                    <div className="flex items-center gap-4 z-10">
                        <div className={cn(
                            "px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter transform -skew-x-12",
                            artifact.isMajor ? "bg-rose-600 text-white" : "bg-violet-600 text-black"
                        )}>
                            {artifact.isMajor ? "MAJOR_STATION_LINK" : `SHARD_${artifact.id}`}
                        </div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">{title}</h1>
                            {artifact.isVerified && (
                                <Icon icon="lucide:check-circle-2" className="text-rose-500" width={20} />
                            )}
                        </div>
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
                                {artifact.status?.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                        <div className="w-px h-6 bg-zinc-800" />
                        <div className="flex flex-col items-end">
                            <span className="text-zinc-600 uppercase">Resonance</span>
                            <span className="text-rose-500 font-black">+{artifact.score}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Side A: The Media Deck */}
                    <div className="md:col-span-8 space-y-6">
                        <BentoCard minimal className="aspect-video bg-black overflow-hidden relative border-violet-500/20">
                            {primaryResource?.platform === 'youtube' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${primaryResource.value.includes('v=') ? primaryResource.value.split('v=')[1].split('&')[0] : primaryResource.value.split('/').pop()}`}
                                    className="absolute inset-0 w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center group/player">
                                    <img src={artifact.coverImage ?? undefined} className="w-full h-full object-cover opacity-60 mix-blend-lighten" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                    <div className="absolute inset-0 cyber-grid opacity-20" />
                                </div>
                            )}
                            {/* Grain Overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        </BentoCard>

                        {/* Zone A: Lead Deck (Primary Contributors) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {artifact.credits?.filter((c: any) => c.isPrimary && (c.contributorClass === 'author' || c.contributorClass === 'collaborator'))
                                .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
                                .map((credit: any, i: number) => (
                                    <div key={`lead-${i}`} className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center gap-4 group/lead hover:border-violet-500/50 transition-all duration-500">
                                        <div className="w-14 h-14 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0 group-hover/lead:border-violet-500/30 transition-colors">
                                            {credit.entity.avatarUrl ? (
                                                <img src={credit.entity.avatarUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                                                    <Icon icon="lucide:user" width={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-violet-500 font-black uppercase tracking-[0.2em]">{credit.displayRole || credit.role}</span>
                                            <Link href={`/artists/${credit.entityId}`} className="text-lg font-black tracking-tight text-white group-hover/lead:text-rose-500 transition-colors">
                                                {credit.entity.translations?.find((t: any) => t.locale === locale)?.name || credit.entity.translations?.[0]?.name || "Anonymous"}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="p-6 bg-zinc-950/40 border border-zinc-800/80 rounded-xl backdrop-blur-md">
                            <h2 className="text-xs font-black text-violet-500 uppercase tracking-[0.3em] mb-4">Editorial // Notes</h2>
                            <p className="text-zinc-300 italic text-lg leading-relaxed font-serif">
                                &ldquo;{description}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Side B: The Controls */}
                    <div className="md:col-span-4 space-y-4">

                        {/* Zone B: Audit Trail (Staff & Secondary Credits) */}
                        <BentoCard title="Audit Trail" icon="lucide:clipboard-list">
                            <div className="space-y-2 font-mono">
                                {artifact.credits?.filter((c: any) => !c.isPrimary || c.contributorClass === 'staff')
                                    .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
                                    .map((credit: any, i: number) => (
                                        <div key={`audit-${i}`} className="flex justify-between items-baseline gap-4 border-b border-zinc-900/50 pb-1 group/audit">
                                            <span className="text-[9px] text-zinc-600 uppercase flex-shrink-0">{credit.displayRole || credit.role}</span>
                                            <div className="h-px bg-zinc-900/30 flex-1 mb-1" />
                                            <Link href={`/artists/${credit.entityId}`} className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors">
                                                {credit.entity.translations?.find((t: any) => t.locale === locale)?.name || credit.entity.translations?.[0]?.name || "Anon"}
                                            </Link>
                                        </div>
                                    ))}

                                <div className="pt-4">
                                    <div className="text-[9px] text-zinc-600 mb-2 uppercase tracking-widest">Metadata_Sig</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {artifact.tags?.map((at: any, i: number) => (
                                            <span key={`tag-${i}`} className="px-1.5 py-0.5 bg-zinc-900 text-[8px] font-black text-zinc-500 rounded-sm uppercase italic">
                                                #{at.tag.translations?.find((t: any) => t.locale === locale)?.name || at.tag.translations?.[0]?.name}
                                            </span>
                                        ))}
                                        {Object.entries(artifact.specs as any || {}).map(([key, val], i) => (
                                            <span key={`spec-${i}`} className="px-1.5 py-0.5 bg-zinc-900/50 text-[8px] text-zinc-600 rounded-sm uppercase">
                                                {key}:{String(val).toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </BentoCard>

                        {/* Gateway Pedal */}
                        <BentoCard title="Gateways" icon="lucide:external-link">
                            <div className="space-y-2">
                                {artifact.resources?.map((res: any, i: number) => (
                                    <a key={i} href={res.value} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-violet-600/10 hover:border-violet-500/40 transition-all group">
                                        <span className="text-xs font-black text-zinc-400 group-hover:text-violet-400 uppercase">{res.platform}</span>
                                        <Icon icon="lucide:arrow-up-right" width={14} height={14} className="text-zinc-600 group-hover:text-violet-500 transition-transform" />
                                    </a>
                                ))}
                            </div>
                        </BentoCard>

                        {/* Heat Index Pedal */}
                        <BentoCard title="Resonance" icon="lucide:flame">
                            <div className="flex items-center gap-6 py-4">
                                <div className="relative w-12 h-32 bg-zinc-950 border border-zinc-800 rounded-full flex items-end p-1 overflow-hidden">
                                    <div className="w-full bg-gradient-to-t from-violet-600 to-rose-600 rounded-full transition-all duration-1000" style={{ height: `${Math.min(100, (artifact.score || 0) / 50)}%`, boxShadow: '0 0 20px rgba(139,92,246,0.3)' }} />
                                    <div className="absolute inset-0 flex flex-col justify-between p-1 py-4 pointer-events-none">
                                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-1 h-px bg-zinc-700" />)}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="text-4xl font-black text-white italic tracking-tighter leading-none">+{artifact.score}</div>
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
                    </div>

                    {/* Zine Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {artifact.zines && artifact.zines.length > 0 ? (
                            artifact.zines.map((zine: any) => (
                                <div key={zine.id} className="p-6 bg-zinc-950/40 border border-zinc-900 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-500">
                                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <Icon icon="lucide:quote-right" className="text-zinc-800" width={24} height={24} />
                                    </div>

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                                            {zine.author?.avatarUrl ? (
                                                <img src={zine.author.avatarUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <Icon icon="lucide:user" className="text-zinc-600" width={14} height={14} />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-200 uppercase">{zine.author?.name || "Resident"}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-zinc-400 italic leading-relaxed mb-6 line-clamp-4">
                                        &ldquo;{zine.translations?.find((t: any) => t.locale === locale)?.content || zine.translations?.[0]?.content || "No translation available"}&rdquo;
                                    </p>

                                    <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest">
                                        <span className="text-zinc-700">{new Date(zine.createdAt).toLocaleDateString()}</span>
                                        <div className="flex items-center gap-1 text-rose-500">
                                            <Icon icon="lucide:flame" width={10} height={10} />
                                            {zine.resonance}
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
                </div>

            </div>
        </MainLayout>
    );
}
