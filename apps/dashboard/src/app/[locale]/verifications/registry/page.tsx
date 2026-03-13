import React from 'react';
export const dynamic = 'force-dynamic';
import { Icon } from '@iconify/react';
import { getDb, schema, desc } from '@shimokitan/db';
import Link from '@/components/Link';
import { ensureUserSync } from '../../auth-helpers';
import { redirect } from 'next/navigation';
import ArtistRegistryReview from './components/ArtistRegistryReview';

/**
 * Artist Registry Review Page (Admin).
 * Allows Founders/Architects to review incoming artist residency signals.
 */
export default async function ArtistRegistryPage() {
    const user = await ensureUserSync();
    if (!user || (user.role !== 'founder' && user.role !== 'architect')) {
        redirect('/');
    }

    const db = getDb();
    if (!db) return <div>DB Connection Failed</div>;

    const applications = await db.query.registryApplications.findMany({
        orderBy: [desc(schema.registryApplications.createdAt)],
    });

    return (
        <div className="space-y-6">
            <header>
                <Link 
                    href="/verifications" 
                    className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all mb-6"
                >
                    <Icon icon="lucide:arrow-left" width={14} />
                    Exit_to_Verifications
                </Link>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                    Artist <span className="text-violet-600">Registry.</span>
                </h1>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                    Incoming Residency Signals // Manual Curation Queue
                </p>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon="lucide:radio" className="text-violet-500" width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Pending_Signals</h2>
                </div>

                <div className="bg-zinc-950/20 rounded-lg p-1 border border-zinc-900">
                    <ArtistRegistryReview data={applications} />
                </div>
            </section>
        </div>
    );
}
