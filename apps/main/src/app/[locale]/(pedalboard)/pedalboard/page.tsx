
import React from 'react';
export const dynamic = 'force-dynamic';
import { Icon } from '@iconify/react';
import { isNull, schema as dbSchema, getDb } from '@shimokitan/db';
import Link from 'next/link';
import { auth } from '@/lib/auth-neon/server';
import { RequestAccessButton } from './_components/RequestAccessButton';
import { ensureUserSync } from './actions';

interface PageProps {
    searchParams: Promise<{ mode?: string }>;
}

export default async function PedalboardPage({ searchParams }: PageProps) {
    const db = getDb();
    if (!db) return <div>DB Connection Failed</div>;

    const { mode = 'resident' } = await searchParams;

    // Real Auth Integration & User Provisioning
    const user = await ensureUserSync();
    const currentRole = (user?.role as string)?.toUpperCase() || 'GHOST';

    // Fetch Metrics for Registry Mode
    const [artifacts, entities, verifications] = await Promise.all([
        db.query.artifacts.findMany({ where: isNull(dbSchema.artifacts.deletedAt), columns: { id: true } }),
        db.query.entities.findMany({ where: isNull(dbSchema.entities.deletedAt), columns: { id: true } }),
        db.query.verificationRegistry.findMany({ columns: { id: true } }),
    ]);

    // --- MODE: REGISTRY (Founder/Mayor Tools) ---
    const isFounder = currentRole === 'FOUNDER';
    const isArchitect = currentRole === 'ARCHITECT' || isFounder;

    if (mode === 'registry') {
        if (!isFounder) {
            return (
                <div className="p-12 border border-rose-900 bg-rose-950/20 text-center space-y-4">
                    <Icon icon="lucide:shield-alert" width={48} className="mx-auto text-rose-600" />
                    <h2 className="text-2xl font-black text-white italic uppercase">Access_Denied</h2>
                    <p className="text-zinc-500 text-xs font-mono">Insufficient_Privileges // Sector_Founders_Only</p>
                    <Link href="/pedalboard" className="inline-block text-rose-500 underline underline-offset-4 text-xs font-black uppercase">Return_To_Resident_Feed</Link>
                </div>
            );
        }

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <header>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Registry_Console</h2>
                    <p className="text-zinc-500 text-[10px] font-mono tracking-[0.2em] uppercase mt-1">District Governance & Global Library</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black border border-zinc-900 p-6 space-y-4">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Global_Status</div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-zinc-900/30 p-3">
                                <span className="text-xs font-mono text-zinc-400">ARTIFACT_COUNT</span>
                                <span className="text-xl font-black text-white">{artifacts.length}</span>
                            </div>
                            <div className="flex justify-between items-center bg-zinc-900/30 p-3">
                                <span className="text-xs font-mono text-zinc-400">RESIDENTS</span>
                                <span className="text-xl font-black text-white">{entities.length}</span>
                            </div>
                        </div>
                    </div>

                    <Link href="/pedalboard/verifications" className="bg-blue-950/10 border border-blue-900/30 p-6 hover:border-blue-500/50 transition-all group lg:col-span-2">
                        <div className="flex justify-between items-start mb-12">
                            <Icon icon="lucide:shield-check" width={32} className="text-blue-900 group-hover:text-blue-500 transition-colors" />
                            <span className="text-[10px] font-mono text-blue-900 uppercase">Verification_Queue</span>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white uppercase italic tracking-tight">Access Control</div>
                            <div className="text-sm text-zinc-500 mt-2">Promote Residents to Architects or verify new District Entities.</div>
                            <div className="mt-4 inline-flex items-center gap-2 bg-blue-600 px-3 py-1 text-xs font-black text-white uppercase">
                                {verifications.length} Pending
                            </div>
                        </div>
                    </Link>

                    <Link href="/pedalboard/artifacts" className="bg-zinc-900/30 border border-zinc-800 p-6 hover:border-zinc-600 transition-all group lg:col-span-3">
                        <div className="flex justify-between items-start mb-8">
                            <Icon icon="lucide:database" width={24} className="text-zinc-700 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-mono text-zinc-700">LIBRARY_MANAGER</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="text-2xl font-black text-white uppercase italic">Artifact Pools</div>
                                <p className="text-xs text-zinc-500 mt-2">Manage the core digital objects. Signals originate here.</p>
                            </div>
                            <div className="flex justify-end">
                                <button className="bg-zinc-100 text-black px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
                                    Browse_Registry
                                </button>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }

    // --- MODE: WORKBENCH (Architect/Artist Tools) ---
    if (mode === 'workbench') {
        if (!isArchitect) {
            return (
                <div className="p-12 border border-rose-900 bg-rose-950/20 text-center space-y-4">
                    <Icon icon="lucide:lock" width={48} className="mx-auto text-rose-600" />
                    <h2 className="text-2xl font-black text-white italic uppercase">Workbench_Locked</h2>
                    <p className="text-zinc-500 text-xs font-mono">Signal_Extraction_Unauthorized // Architects_Only</p>
                    <Link href="/pedalboard" className="inline-block text-rose-500 underline underline-offset-4 text-xs font-black uppercase">Return_To_Resident_Feed</Link>
                </div>
            );
        }
        const myArtifacts = [
            { id: '1', title: 'District_Signal_01', type: 'EP', status: 'VERIFIED', zines: 3 },
            { id: '2', title: 'Echoes_of_Studio', type: 'Zine', status: 'PENDING', zines: 1 }
        ];

        return (
            <div className="space-y-10 animate-in fade-in duration-500">
                <header className="flex justify-between items-end border-b border-zinc-900 pb-8">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase italic tracking-tighter text-white">Artist_Workbench</h2>
                        <p className="text-zinc-500 text-[10px] font-mono tracking-[0.2em] uppercase mt-1">Creation & Deployment Monitor</p>
                    </div>
                    <Link href="/pedalboard/artifacts/new" className="bg-rose-600 text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center gap-2">
                        <Icon icon="lucide:plus" width={14} />
                        New_Artifact
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">My_Portfolio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {myArtifacts.map(art => (
                                <Link key={art.id} href={`/pedalboard/artifacts/${art.id}`} className="bg-zinc-900/30 border border-zinc-800 p-6 flex flex-col justify-between h-48 group hover:border-zinc-700 transition-all">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">{art.type}</span>
                                                <span className="text-[10px] font-mono text-rose-500 uppercase tracking-tighter">[{art.zines} Zines]</span>
                                            </div>
                                            <span className={`text-[8px] font-bold px-1.5 py-0.5 ${art.status === 'VERIFIED' ? 'bg-emerald-500 text-emerald-950' : 'bg-amber-500 text-amber-950'}`}>
                                                {art.status}
                                            </span>
                                        </div>
                                        <div className="text-xl font-black text-white uppercase group-hover:text-rose-500 transition-colors italic">{art.title}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="text-[10px] font-mono text-zinc-600 uppercase transition-colors underline underline-offset-4 group-hover:text-white">Edit_Artifact_&_Emit_Signals</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Artist_Meta</h3>
                        <div className="bg-black border border-zinc-900 p-6 space-y-6">
                            <div>
                                <div className="text-[10px] font-mono text-zinc-600 uppercase mb-1">Total_Impressions</div>
                                <div className="text-3xl font-black text-white tracking-tighter italic">24.5k</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono text-zinc-600 uppercase mb-1">Artist_Resonance</div>
                                <div className="text-3xl font-black text-emerald-500 tracking-tighter italic">+88%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- MODE: RESIDENT (Public Persona / Twitter Style) ---
    const zineFeed = [
        {
            id: '1',
            title: 'The Sound of Shimokitazawa',
            artifact: 'District_Signal_01',
            content: 'Exploring the hidden jazz cafes and underground shoegaze venues of the district. The resonance here is unlike anywhere else.',
            updatedAt: '2h ago', views: '1.2k', heat: '+45', tags: ['#jazz', '#shoegaze']
        },
        {
            id: '2',
            title: 'Resident Survival Guide: Version 4.2',
            artifact: 'Echoes_of_Studio',
            content: 'Updated guide for new residents. How to manage your weight dilution and increase your signal clarity within the first cycle.',
            updatedAt: '1d ago', views: '840', heat: '+12', tags: ['#guide', '#architecture']
        },
        {
            id: '3',
            title: 'Foundations of the District',
            artifact: 'District_Signal_01',
            content: 'How we built the initial signal protocols. Monospace for everything, minimal noise, high density data.',
            updatedAt: '3d ago', views: '2.1k', heat: '+128', tags: ['#dev', '#design']
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
            {/* Profile Header Block */}
            <section className="relative">
                <div className="h-48 md:h-64 bg-zinc-900 border border-zinc-800 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px]" />
                </div>

                <div className="px-6 md:px-10 -mt-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-black border-4 border-[#050505] relative shadow-2xl">
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                                <Icon icon="lucide:user" width={64} />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-rose-600 flex items-center justify-center text-white border-2 border-black">
                                <Icon icon="lucide:check-circle-2" width={16} />
                            </div>
                        </div>

                        <div className="mb-2">
                            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                                {user?.name || 'GHOST_SIGNAL'}
                            </h1>
                            <p className="text-zinc-500 font-mono text-xs mt-2 uppercase tracking-widest">
                                @{user?.email?.split('@')[0] || 'unknown'} // {currentRole}_SECTOR
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-2">
                        <button className="bg-zinc-100 text-black px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
                            Update_Bio
                        </button>
                        <button className="bg-black border border-zinc-800 text-zinc-400 p-2.5 hover:text-white transition-all">
                            <Icon icon="lucide:share-2" width={18} />
                        </button>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-6 md:px-10">
                {/* Main Feed Column */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex gap-8 border-b border-zinc-900">
                        <button className="pb-4 text-xs font-black uppercase tracking-widest border-b-2 border-rose-600 text-white">Signal_Feed</button>
                        <button className="pb-4 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors">Digital_Shelf</button>
                    </div>

                    <div className="space-y-0 -mx-6 md:-mx-0">
                        {zineFeed.map((zine) => (
                            <div key={zine.id} className="p-6 md:p-8 border-b border-zinc-900 hover:bg-zinc-900/10 transition-colors group relative">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-zinc-800 shrink-0 border border-zinc-700" />

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-white uppercase tracking-tight italic">{user?.name}</span>
                                                <span className="text-[10px] font-mono text-zinc-600 uppercase">@{user?.email?.split('@')[0]}</span>
                                                <span className="text-zinc-700">·</span>
                                                <span className="text-[10px] font-mono text-zinc-600">{zine.updatedAt}</span>
                                            </div>
                                            <div className="text-[8px] font-mono text-zinc-700 uppercase px-2 py-0.5 border border-zinc-900">
                                                Signal // {zine.artifact}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-rose-500 transition-colors">
                                                {zine.title}
                                            </h3>
                                            <p className="text-zinc-400 text-sm leading-relaxed">
                                                {zine.content}
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            {zine.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-mono text-rose-600/60 uppercase tracking-tighter">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-8 pt-4">
                                            <div className="flex items-center gap-2 text-zinc-700">
                                                <Icon icon="lucide:flame" width={14} />
                                                <span className="text-[10px] font-mono tracking-widest">{zine.heat}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-700">
                                                <Icon icon="lucide:bar-chart-2" width={14} />
                                                <span className="text-[10px] font-mono tracking-widest">{zine.views}</span>
                                            </div>
                                            <div className="text-[8px] font-mono text-zinc-800 uppercase italic ml-auto">Internal_Signal_Monitor_Only</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* CTA: Be an Architect (Locked for non-architects) */}
                    {!isArchitect && (
                        <div className="bg-rose-950/10 border border-rose-900/40 p-8 space-y-6 animate-in zoom-in-95 duration-700">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Be an Architect</h3>
                                <p className="text-xs text-rose-300/60 leading-relaxed font-medium">
                                    Unlock the professional <b>Workbench</b>. Submit your portfolio for verification and begin emitting signals through artifacts.
                                </p>
                            </div>
                            <RequestAccessButton />
                        </div>
                    )}

                    {/* Station Control Section */}
                    <div className="bg-black border border-zinc-900 p-8 space-y-8">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                            <div className="text-xs font-black uppercase tracking-widest text-white">Station_Control</div>
                            <Icon icon="lucide:terminal" width={14} className="text-zinc-600" />
                        </div>

                        {/* Founder-specific Block */}
                        {isFounder && (
                            <div className="space-y-4">
                                <Link href="?mode=registry" className="flex items-center justify-between group p-3 border border-zinc-800 bg-zinc-900/20 hover:border-rose-700 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Icon icon="lucide:database-zap" width={16} className="text-rose-600" />
                                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white">System_Registry</span>
                                    </div>
                                    <Icon icon="lucide:chevron-right" width={14} className="text-zinc-800" />
                                </Link>
                            </div>
                        )}

                        {/* Architect+ Block */}
                        {isArchitect && (
                            <div className="space-y-4">
                                <Link href="?mode=workbench" className="flex items-center justify-between group p-3 border border-zinc-800 bg-zinc-900/20 hover:border-blue-700 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Icon icon="lucide:layout-dashboard" width={16} className="text-blue-600" />
                                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white">Workbench_Terminal</span>
                                    </div>
                                    <Icon icon="lucide:chevron-right" width={14} className="text-zinc-800" />
                                </Link>
                            </div>
                        )}

                        <div className="space-y-1">
                            <div className="text-[10px] font-mono text-zinc-700 uppercase mb-4 px-1">Internal_Registry</div>
                            {[
                                { label: 'Artifact_Pool', icon: 'lucide:package', href: '/pedalboard/artifacts' },
                                { label: 'Residents', icon: 'lucide:users', href: '/pedalboard/entities' },
                                { label: 'Digital_Tags', icon: 'lucide:tags', href: '/pedalboard/tags' },
                            ].map((item) => (
                                <Link key={item.label} href={item.href} className="flex items-center gap-3 p-3 text-zinc-500 hover:text-white hover:bg-zinc-950 transition-all group">
                                    <Icon icon={item.icon} width={14} className="text-zinc-700 group-hover:text-rose-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
