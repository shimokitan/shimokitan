"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import { MainLayout } from '../../components/layout/MainLayout';
import { MOCK_USER, MOCK_ARTIFACTS, MOCK_ZINES, Zine, Artifact } from '../../lib/mock-data';
import { BentoCard, Badge, Avatar, AvatarImage, AvatarFallback, cn } from '@shimokitan/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PedalboardPage() {
    const user = MOCK_USER;
    const collection = user.collectionSlugs.map((slug: string) => MOCK_ARTIFACTS[slug]);
    const userZines = MOCK_ZINES.filter((z: Zine) => z.authorHandle === user.handle);

    return (
        <MainLayout>
            <div className="flex h-full gap-8 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                {/* --- THE REAL SIDEBAR --- */}
                <aside className="hidden lg:flex flex-col w-64 gap-8 shrink-0">
                    {/* User Identity Module */}
                    <div className="flex flex-col gap-4 p-6 bg-zinc-950 border border-zinc-900 rounded-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-rose-600/5 opacity-50" />
                        <div className="flex items-center gap-4 relative z-10">
                            <Avatar className="w-12 h-12 border-2 border-violet-600/50">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-black text-xs uppercase tracking-tighter truncate">{user.name}</span>
                                <span className="font-mono text-[9px] text-zinc-600 truncate">{user.handle}</span>
                            </div>
                        </div>
                        <div className="h-px bg-zinc-900 w-full" />
                        <nav className="flex flex-col gap-1 relative z-10">
                            <DashboardNavLink icon="lucide:layout-grid" label="OVERVIEW" active />
                            <DashboardNavLink icon="lucide:disc" label="COLLECTION" />
                            <DashboardNavLink icon="lucide:message-square-quote" label="PERZINES" />
                            <DashboardNavLink icon="lucide:settings-2" label="CONFIG" />
                        </nav>
                    </div>

                    {/* Stats HUD */}
                    <BentoCard title="SYSTEM_STATS" icon="lucide:activity" className="flex-1">
                        <div className="space-y-6 pt-2 h-full flex flex-col">
                            <StatItem label="SHARDS" value={user.stats.shards} color="text-zinc-400" />
                            <StatItem label="ECHOES" value={user.stats.echoes} color="text-rose-500" />
                            <StatItem label="RESONANCE" value={user.stats.resonance} color="text-violet-500" />
                            <div className="pt-4 mt-auto">
                                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                    <div className="h-full w-[70%] bg-gradient-to-r from-violet-600 to-rose-600" />
                                </div>
                                <span className="text-[8px] font-mono text-zinc-700 uppercase mt-2 block">SIGNAL_STRENGTH // 70%</span>
                            </div>
                        </div>
                    </BentoCard>
                </aside>

                {/* --- BENTO BOX GRID --- */}
                <main className="flex-1 overflow-y-auto hide-scroll">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[160px] gap-4">

                        {/* 1. Identity Box (Spans 2x2) */}
                        <BentoCard
                            title="RESIDENT_IDENTITY"
                            icon="lucide:fingerprint"
                            className="md:col-span-2 md:row-span-2"
                        >
                            <div className="flex flex-col h-full justify-between py-2">
                                <div className="space-y-4">
                                    <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                                        PEDAL_<span className="text-violet-600">STATE</span>
                                    </h1>
                                    <p className="text-zinc-500 font-mono text-[11px] leading-relaxed uppercase">
                                        &ldquo;{user.bio}&rdquo;
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <Badge variant="distortion">SECTOR_TYO</Badge>
                                    <Badge variant="clean">LVL_12_RESIDENT</Badge>
                                </div>
                            </div>
                        </BentoCard>

                        {/* 2. Collection Quick View (Spans 2x2) */}
                        <BentoCard
                            title="ACTIVE_SIGNAL_CHAIN"
                            icon="lucide:disc"
                            className="md:col-span-2 md:row-span-2"
                            action={<button className="text-[8px] font-black uppercase hover:text-white transition-colors">[ BROWSE ]</button>}
                        >
                            <div className="grid grid-cols-2 gap-3 h-full pt-1">
                                {collection.slice(0, 2).map((artifact: Artifact) => (
                                    <Link key={artifact.id} href={`/artifacts/${artifact.slug}`} className="group relative rounded-xl overflow-hidden border border-zinc-800/50 bg-black">
                                        <img src={artifact.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                                            <span className="text-[9px] font-black uppercase italic text-zinc-200 line-clamp-1">{artifact.title}</span>
                                        </div>
                                    </Link>
                                ))}
                                <button className="border-2 border-dashed border-zinc-900 rounded-xl flex items-center justify-center text-zinc-800 hover:text-violet-600 hover:border-violet-900/40 transition-all">
                                    <Icon icon="lucide:plus" width={20} height={20} />
                                </button>
                                <div className="flex flex-col justify-center items-center text-zinc-900">
                                    <span className="text-[8px] font-black uppercase tracking-widest">PATCH_SLOT</span>
                                    <span className="text-[7px] font-mono uppercase mt-1">EMPTY</span>
                                </div>
                            </div>
                        </BentoCard>

                        {/* 3. Echoes Tracker (Stack 2 small boxes) */}
                        <BentoCard title="ECHO_PULSE" icon="lucide:flame" className="md:col-span-1">
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <span className="text-3xl font-black text-rose-500 italic leading-none">{user.stats.echoes}</span>
                                    <span className="block text-[8px] font-mono text-zinc-600 uppercase mt-1">Cast_Memoirs</span>
                                </div>
                            </div>
                        </BentoCard>

                        <BentoCard title="SIGNAL_RES" icon="lucide:zap" className="md:col-span-1">
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <span className="text-3xl font-black text-violet-500 italic leading-none">{user.stats.resonance}</span>
                                    <span className="block text-[8px] font-mono text-zinc-600 uppercase mt-1">Agg_Power</span>
                                </div>
                            </div>
                        </BentoCard>

                        {/* 4. Perzine Feed (Spans 4x2) */}
                        <BentoCard
                            title="LATEST_MEMOIRS"
                            icon="lucide:message-square-quote"
                            className="md:col-span-2 lg:col-span-4 md:row-span-2 overflow-hidden"
                        >
                            <div className="space-y-3 h-full py-1">
                                {userZines.slice(0, 2).map((zine: Zine) => {
                                    const artifact = MOCK_ARTIFACTS[zine.artifactSlug];
                                    return (
                                        <div key={zine.id} className="p-4 bg-black/40 border border-zinc-900/50 rounded-xl relative group/item hover:border-rose-900/30 transition-all">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[9px] font-black uppercase text-rose-600">{artifact?.title}</span>
                                                <span className="text-[8px] font-mono text-zinc-700">{new Date(zine.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-zinc-400 italic line-clamp-1 font-serif">&ldquo;{zine.content}&rdquo;</p>
                                        </div>
                                    )
                                })}
                                <Link
                                    href="/zines"
                                    className="w-full h-10 flex items-center justify-center bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-[9px] font-black uppercase text-zinc-500 hover:text-white transition-all hover:bg-zinc-800"
                                >
                                    OPEN_ARCHIVE_INTERFACE
                                </Link>
                            </div>
                        </BentoCard>

                        {/* 5. Modulators (Spans 1x2) */}
                        <BentoCard title="MOD_RACK" icon="lucide:sliders" className="md:row-span-2">
                            <div className="space-y-4 pt-1 h-full flex flex-col">
                                <ModButton label="IDENTITY" />
                                <ModButton label="SECURITY" />
                                <ModButton label="SYSTEM" />
                                <div className="mt-auto pt-4 border-t border-zinc-900">
                                    <button className="text-[8px] font-black text-rose-500 uppercase hover:text-rose-400 transition-colors w-full text-center">
                                        TERMINATE_SIGNAL
                                    </button>
                                </div>
                            </div>
                        </BentoCard>

                    </div>
                </main>

            </div>
        </MainLayout>
    );
}

function DashboardNavLink({ icon, label, active = false }: { icon: string, label: string, active?: boolean }) {
    return (
        <button className={cn(
            "flex items-center gap-3 w-full p-3 rounded-xl transition-all group",
            active ? "bg-violet-600/10 text-violet-500 border border-violet-600/20" : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/50"
        )}>
            <Icon icon={icon} width={14} height={14} className={cn(active ? "opacity-100" : "opacity-50 group-hover:opacity-100")} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </button>
    );
}

function StatItem({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{label}</span>
            <span className={cn("text-lg font-black italic", color)}>{value}</span>
        </div>
    );
}

function ModButton({ label }: { label: string }) {
    return (
        <button className="w-full p-3 bg-black border border-zinc-900 rounded-xl flex items-center justify-between group hover:border-violet-500/50 transition-all">
            <span className="text-[9px] font-black uppercase text-zinc-400 group-hover:text-zinc-100 transition-colors">{label}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-violet-500 opacity-50 group-hover:opacity-100 transition-all shadow-[0_0_8px_transparent] group-hover:shadow-violet-600" />
        </button>
    );
}
