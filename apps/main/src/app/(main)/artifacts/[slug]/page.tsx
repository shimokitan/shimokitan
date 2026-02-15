import React from 'react';
import { Icon } from '@iconify/react';
import { BentoCard, Badge } from '@shimokitan/ui';
import { MainLayout } from '../../../../components/layout/MainLayout';
import { getArtifactById } from '@shimokitan/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ArtifactPage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params; // Using the ID directly (slug stripped)

    // In our new schema, 'slug' is actually the NanoID
    const artifact = await getArtifactById(slug);

    if (!artifact) {
        notFound();
    }

    // Helper to get primary resource
    const primaryResource = artifact.resources?.find((r: any) => r.isPrimary) || artifact.resources?.[0];

    return (
        <MainLayout>
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                {/* 1. Header: The Masking Tape Label */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-950 border-y border-zinc-800 p-3 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none" />

                    <div className="flex items-center gap-4 z-10">
                        <div className="bg-violet-600 text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter transform -skew-x-12">
                            SHARD_{artifact.id}
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
                                {artifact.status?.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                        <div className="w-px h-6 bg-zinc-800" />
                        <div className="flex flex-col items-end">
                            <span className="text-zinc-600 uppercase">Resonance</span>
                            <span className="text-violet-500 font-black">+{artifact.score}</span>
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
                                    src={`https://www.youtube.com/embed/${primaryResource.url.split('v=')[1] || primaryResource.url.split('/').pop()}`}
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

                        <div className="p-6 bg-zinc-950/40 border border-zinc-800/80 rounded-xl backdrop-blur-md">
                            <h2 className="text-xs font-black text-violet-500 uppercase tracking-[0.3em] mb-4">Editorial // Notes</h2>
                            <p className="text-zinc-300 italic text-lg leading-relaxed font-serif">
                                &ldquo;{artifact.description}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Side B: The Controls */}
                    <div className="md:col-span-4 space-y-4">

                        {/* Credits Pedal */}
                        <BentoCard title="Credits" icon="lucide:book-user">
                            <div className="space-y-4 font-mono">
                                {artifact.credits?.map((credit: any, i: number) => (
                                    <div key={i} className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
                                        <span className="text-[10px] text-zinc-500 uppercase">{credit.role}</span>
                                        <Link href={`/entity/${credit.entityId}`} className="text-xs font-bold text-white hover:text-violet-400 transition-colors">
                                            {credit.entity.name}
                                        </Link>
                                    </div>
                                ))}

                                <div className="pt-2">
                                    <div className="text-[9px] text-zinc-600 mb-2 uppercase">Tags // Vibe_Signature</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {Object.entries(artifact.specs as any || {}).map(([key, val], i) => (
                                            <span key={i} className="px-2 py-0.5 bg-zinc-800/50 border border-zinc-700/50 text-[9px] text-zinc-400 rounded-sm">
                                                {String(val).toUpperCase()}
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
                                    <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-violet-600/10 hover:border-violet-500/40 transition-all group">
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
                                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                            <Icon icon="lucide:user" className="text-zinc-600" width={14} height={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-200 uppercase">{zine.author}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-zinc-400 italic leading-relaxed mb-6 line-clamp-4">
                                        &ldquo;{zine.content}&rdquo;
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
