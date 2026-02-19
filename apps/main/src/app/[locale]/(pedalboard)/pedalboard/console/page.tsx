
import React from 'react';
export const dynamic = 'force-dynamic';
import { Icon } from '@iconify/react';
import { isNull, isNotNull, schema as dbSchema, getDb } from '@shimokitan/db';
import Link from '@/components/Link';
import { ensureUserSync } from '../actions';
import { redirect } from 'next/navigation';
import { desc } from '@shimokitan/db';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function ConsolePage({ params }: PageProps) {
    const db = getDb();
    if (!db) return <div>DB Connection Failed</div>;

    const user = await ensureUserSync();
    if (!user) {
        redirect('/auth/signin?callbackUrl=/pedalboard/console');
    }
    const currentRole = (user.role as string)?.toUpperCase() || 'GHOST';
    const isFounder = currentRole === 'FOUNDER';

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

    // Fetch All Data for Metrics
    // Note: In a real large-scale app, we would use count() queries instead of fetching all IDs.
    const [allArtifacts, entities, verifications] = await Promise.all([
        db.query.artifacts.findMany({
            columns: { id: true, status: true, deletedAt: true }
        }),
        db.query.entities.findMany({ where: isNull(dbSchema.entities.deletedAt), columns: { id: true } }),
        db.query.verificationRegistry.findMany({
            where: (v, { eq }) => eq(v.status, 'pending'),
            columns: { id: true }
        }),
    ]);

    // Process Artifact Metrics
    const activeArtifacts = allArtifacts.filter(a => !a.deletedAt);
    const trashArtifacts = allArtifacts.filter(a => a.deletedAt);

    const statusCounts = activeArtifacts.reduce((acc, curr) => {
        const s = curr.status || 'unknown';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalActive = activeArtifacts.length;

    // Calculate Percentages for the Chart
    const getPercent = (count: number) => totalActive > 0 ? (count / totalActive) * 100 : 0;

    // Fetch Recent Global Artifacts (Activity Log)
    const recentArtifacts = await db.query.artifacts.findMany({
        where: (art, { isNull }) => isNull(art.deletedAt),
        limit: 5,
        orderBy: [desc(dbSchema.artifacts.createdAt)],
        with: {
            translations: {
                where: (t, { eq }) => eq(t.locale, 'en')
            },
            zines: true
        }
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            <header className="flex justify-between items-end border-b border-zinc-900 pb-6">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">System_Console</h2>
                    <p className="text-zinc-500 text-[10px] font-mono tracking-[0.2em] uppercase mt-1">District Governance & Global Library</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase">System_Status</div>
                        <div className="text-xs font-black text-emerald-500 uppercase">Operational</div>
                    </div>
                </div>
            </header>

            {/* Top Row: Navigation Cards (The "Big Buttons") */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Artifact Registry Card */}
                <Link href="/pedalboard/artifacts" className="group bg-zinc-900/20 border border-zinc-800 p-6 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Icon icon="lucide:package" width={64} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-10 h-10 bg-rose-600/10 flex items-center justify-center border border-rose-600/20 text-rose-500 rounded-sm">
                            <Icon icon="lucide:database" width={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-rose-500 transition-colors">Artifact_Registry</h3>
                            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                                Central database management. Add, edit, or remove system artifacts.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors pt-2">
                            Manage_ledger <Icon icon="lucide:arrow-right" width={12} />
                        </div>
                    </div>
                </Link>

                {/* Entity Management Card */}
                <Link href="/pedalboard/entities" className="group bg-zinc-900/20 border border-zinc-800 p-6 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Icon icon="lucide:users" width={64} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="w-10 h-10 bg-violet-600/10 flex items-center justify-center border border-violet-600/20 text-violet-500 rounded-sm">
                            <Icon icon="lucide:users" width={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-violet-500 transition-colors">Resident_Control</h3>
                            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                                Manage registered entities, artists, and unit assignments.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors pt-2">
                            Open_directory <Icon icon="lucide:arrow-right" width={12} />
                        </div>
                    </div>
                </Link>

                {/* Verification Queue (Critical Action) */}
                <Link href="/pedalboard/verifications" className="group bg-zinc-900/20 border border-zinc-800 p-6 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Icon icon="lucide:shield-check" width={64} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-blue-600/10 flex items-center justify-center border border-blue-600/20 text-blue-500 rounded-sm">
                                <Icon icon="lucide:shield" width={20} />
                            </div>
                            {verifications.length > 0 && (
                                <div className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 uppercase animate-pulse">
                                    {verifications.length} Pending
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-blue-500 transition-colors">Verifications</h3>
                            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">
                                Review pending access requests and role promotions.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors pt-2">
                            Review_queue <Icon icon="lucide:arrow-right" width={12} />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Middle Row: Charts & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats & Distribution Chart */}
                <div className="lg:col-span-2 bg-black border border-zinc-900 p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Global_Metrics</div>
                        <div className="text-[10px] font-mono text-zinc-600 uppercase">Total_Active: <span className="text-white">{totalActive}</span></div>
                    </div>

                    <div className="space-y-4">
                        {/* Status: Back Alley */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-emerald-500">Back_Alley (Live)</span>
                                <span className="text-zinc-400">{statusCounts['back_alley'] || 0}</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-600" style={{ width: `${getPercent(statusCounts['back_alley'] || 0)}%` }} />
                            </div>
                        </div>

                        {/* Status: The Pit */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-amber-500">The_Pit (Draft)</span>
                                <span className="text-zinc-400">{statusCounts['the_pit'] || 0}</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-600" style={{ width: `${getPercent(statusCounts['the_pit'] || 0)}%` }} />
                            </div>
                        </div>

                        {/* Status: Archived */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-zinc-500">Archived</span>
                                <span className="text-zinc-400">{statusCounts['archived'] || 0}</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-zinc-700" style={{ width: `${getPercent(statusCounts['archived'] || 0)}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 flex gap-4 text-[10px] font-mono text-zinc-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-900" />
                            <span>TRASH_BIN: {trashArtifacts.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-violet-900" />
                            <span>RESIDENTS: {entities.length}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Log (Compact) */}
                <div className="bg-black border border-zinc-900 p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Recent_Activity</div>
                        <Link href="/pedalboard/artifacts" className="text-[9px] font-black text-rose-500 uppercase hover:text-white">View_All</Link>
                    </div>
                    <div className="space-y-3">
                        {recentArtifacts.map(art => (
                            <div key={art.id} className="flex gap-3 items-center group">
                                <div className={`w-1 h-8 rounded-full shrink-0 ${art.status === 'back_alley' ? 'bg-emerald-500' : 'bg-amber-600'}`} />
                                <div className="min-w-0">
                                    <div className="text-xs font-black text-white uppercase truncate group-hover:text-rose-500 transition-colors">
                                        {art.translations?.[0]?.title || 'Untitled'}
                                    </div>
                                    <div className="text-[9px] font-mono text-zinc-600 uppercase flex gap-2">
                                        <span>{art.category}</span>
                                        <span className="text-zinc-800">|</span>
                                        <span>ID_{art.id.slice(0, 4)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/pedalboard/artifacts/new" className="col-span-2 bg-rose-600 text-white p-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-rose-500 transition-all">
                    <Icon icon="lucide:plus-circle" width={16} />
                    New_Artifact
                </Link>
                <div className="bg-zinc-900 border border-zinc-800 p-4 text-center">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">System_Load</div>
                    <div className="text-lg font-black text-white">0.0%</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 text-center">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">Resonance</div>
                    <div className="text-lg font-black text-emerald-500">+12%</div>
                </div>
            </div>
        </div>
    );
}
