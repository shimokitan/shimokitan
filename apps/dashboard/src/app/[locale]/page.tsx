import React from 'react';
export const dynamic = 'force-dynamic';
import { Icon } from '@iconify/react';
import { isNull, schema as dbSchema, getDb } from '@shimokitan/db';
import Link from '@/components/Link';
import { ensureUserSync } from './auth-helpers';
import { redirect } from 'next/navigation';
import { desc } from '@shimokitan/db';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function ConsolePage({ params }: PageProps) {
    const db = getDb();
    const { locale } = await params;

    if (!db) return <div>DB Connection Failed</div>;

    const user = await ensureUserSync();
    if (!user) {
        redirect('/auth/signin?callbackUrl=/');
    }
    const currentRole = (user.role as string)?.toUpperCase() || 'GHOST';
    const isFounder = currentRole === 'FOUNDER';

    if (!isFounder) {
        return (
            <div className="p-12 border border-rose-900 bg-rose-950/20 text-center space-y-4 m-10">
                <Icon icon="lucide:shield-alert" width={48} className="mx-auto text-rose-600" />
                <h2 className="text-2xl font-black text-white italic uppercase">Access_Denied</h2>
                <p className="text-zinc-500 text-xs font-mono">Insufficient_Privileges // Sector_Founders_Only</p>
                <Link href="/" className="inline-block text-rose-500 underline underline-offset-4 text-xs font-black uppercase">Return_To_Base</Link>
            </div>
        );
    }

    // Fetch All Data for Metrics
    const [allArtifacts, allWorks, entities, verifications] = await Promise.all([
        db.query.artifacts.findMany({
            columns: { id: true, status: true, deletedAt: true }
        }),
        db.query.works.findMany({
             columns: { id: true, deletedAt: true }
        }),
        db.query.entities.findMany({ where: isNull(dbSchema.entities.deletedAt), columns: { id: true } }),
        db.query.verificationRegistry.findMany({
            where: (v, { eq }) => eq(v.status, 'pending'),
            columns: { id: true }
        }),
    ]);

    // Process Metrics
    const activeArtifacts = allArtifacts.filter(a => !a.deletedAt);
    const activeWorks = allWorks.filter(w => !w.deletedAt);
    
    const statusCounts = activeArtifacts.reduce((acc, curr) => {
        const s = curr.status || 'unknown';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalActive = activeArtifacts.length;

    // Recent Global Activity
    const recentArtifacts = await db.query.artifacts.findMany({
        where: (art, { isNull }) => isNull(art.deletedAt),
        limit: 5,
        orderBy: [desc(dbSchema.artifacts.createdAt)],
        with: {
            translations: {
                where: (t, { eq }) => eq(t.locale, locale as any)
            },
        }
    });

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            <header className="flex justify-between items-end border-b border-zinc-900 pb-6">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">System_Console</h2>
                    <p className="text-zinc-500 text-[10px] font-mono tracking-[0.2em] uppercase mt-1">District Governance & IP Registry</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase">System_Mode</div>
                        <div className="text-xs font-black text-rose-500 uppercase">God_Mode</div>
                    </div>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/40 border border-zinc-800 p-4">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">IP_Works</div>
                    <div className="text-2xl font-black text-white">{activeWorks.length}</div>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800 p-4">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">Artifacts</div>
                    <div className="text-2xl font-black text-white">{totalActive}</div>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800 p-4">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">Entities</div>
                    <div className="text-2xl font-black text-white">{entities.length}</div>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800 p-4">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">Signals</div>
                    <div className="text-2xl font-black text-emerald-500">100%</div>
                </div>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/works" className="group bg-zinc-900/20 border border-zinc-800 p-6 hover:bg-rose-950/20 hover:border-rose-900 transition-all">
                    <Icon icon="lucide:library" width={32} className="text-rose-500 mb-4" />
                    <h3 className="font-black uppercase italic tracking-tight text-white group-hover:text-rose-500">Works_Registry</h3>
                    <p className="text-zinc-500 text-[10px] mt-1 uppercase">Anchor Point Management</p>
                </Link>

                <Link href="/artifacts" className="group bg-zinc-900/20 border border-zinc-800 p-6 hover:bg-zinc-900/40 transition-all">
                    <Icon icon="lucide:package" width={32} className="text-zinc-500 mb-4" />
                    <h3 className="font-black uppercase italic tracking-tight text-white">Artifacts</h3>
                    <p className="text-zinc-500 text-[10px] mt-1 uppercase">Global Media Ledger</p>
                </Link>

                <Link href="/entities" className="group bg-zinc-900/20 border border-zinc-800 p-6 hover:bg-zinc-900/40 transition-all">
                    <Icon icon="lucide:users" width={32} className="text-zinc-500 mb-4" />
                    <h3 className="font-black uppercase italic tracking-tight text-white">Entities</h3>
                    <p className="text-zinc-500 text-[10px] mt-1 uppercase">Resident Units & Identity</p>
                </Link>

                <Link href="/verifications" className="group bg-zinc-900/20 border border-zinc-800 p-6 hover:bg-blue-950/20 hover:border-blue-900 transition-all">
                    <div className="flex justify-between items-start">
                        <Icon icon="lucide:shield-check" width={32} className="text-blue-500 mb-4" />
                        {verifications.length > 0 && (
                            <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 font-black uppercase">{verifications.length}</span>
                        )}
                    </div>
                    <h3 className="font-black uppercase italic tracking-tight text-white group-hover:text-blue-500">Audit_Queue</h3>
                    <p className="text-zinc-500 text-[10px] mt-1 uppercase">Pending Verifications</p>
                </Link>
            </div>

            {/* Activity & Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 border border-zinc-900 bg-zinc-950/40 p-6">
                    <h4 className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-6">Recent_Transmission_Logs</h4>
                    <div className="space-y-4">
                        {recentArtifacts.map(art => (
                            <div key={art.id} className="flex items-center gap-4 text-xs font-mono border-b border-zinc-900 pb-2">
                                <span className="text-zinc-700">[{art.id.slice(0, 8)}]</span>
                                <span className="text-rose-500 uppercase">{art.status}</span>
                                <span className="text-white truncate">{art.translations?.[0]?.title || 'Untitled'}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border border-zinc-900 bg-zinc-950/40 p-6">
                    <h4 className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-6">System_Status</h4>
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[9px] uppercase font-black">
                                <span>R2_Latency</span>
                                <span className="text-emerald-500">Minimal</span>
                            </div>
                            <div className="h-0.5 w-full bg-zinc-900">
                                <div className="h-full bg-emerald-500 w-[12%]" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[9px] uppercase font-black">
                                <span>DB_Load</span>
                                <span className="text-zinc-500">Idle</span>
                            </div>
                            <div className="h-0.5 w-full bg-zinc-900">
                                <div className="h-full bg-zinc-700 w-[4%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
