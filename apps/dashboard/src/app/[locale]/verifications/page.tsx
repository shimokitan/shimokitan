
import React from 'react';
export const dynamic = 'force-dynamic';
import { Icon } from '@iconify/react';
import { getDb, schema, desc, isNull } from '@shimokitan/db';
import Link from '@/components/Link';
import VerificationRegistry from './components/VerificationRegistry';
import { deleteVerification } from '../actions';
import { ensureUserSync } from '../auth-helpers';
import { redirect } from 'next/navigation';

export default async function VerificationsPage(props: { params: Promise<{ locale: string }> }) {
    const { locale } = await props.params;
    const user = await ensureUserSync();
    if (!user || (user.role !== 'founder' && user.role !== 'architect')) {
        redirect('/');
    }

    const db = getDb();
    if (!db) return <div>DB Connection Failed</div>;

    const [verifications, artifacts, entities, users] = await Promise.all([
        db.query.verificationRegistry.findMany({
            orderBy: [desc(schema.verificationRegistry.createdAt)],
        }),
        db.query.artifacts.findMany({
            where: isNull(schema.artifacts.deletedAt),
            with: { translations: true }
        }),
        db.query.entities.findMany({
            where: isNull(schema.entities.deletedAt),
            with: { translations: true }
        }),
        db.query.users.findMany()
    ]);

    const artifactOptions = artifacts.map(a => ({ id: a.id, name: a.translations?.[0]?.title || a.id }));
    const entityOptions = entities.map(e => ({ id: e.id, name: e.translations?.[0]?.name || e.id }));
    const userOptions = users.map(u => ({ id: u.id, name: u.email }));

    const tableData = verifications.map(v => {
        let targetName = 'Unknown';
        if (v.targetType === 'artifact') {
            targetName = artifactOptions.find(a => a.id === v.targetId)?.name || v.targetId;
        } else if (v.targetType === 'entity') {
            targetName = entityOptions.find(e => e.id === v.targetId)?.name || v.targetId;
        } else if (v.targetType === 'role_upgrade') {
            targetName = userOptions.find(u => u.id === v.targetId)?.name || v.targetId;
        }

        return {
            ...v,
            targetName,
        };
    });

    return (
        <div className="space-y-6">
            <header>
                <Link 
                    href="/console" 
                    className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all mb-6"
                >
                    <Icon icon="lucide:arrow-left" width={14} />
                    Exit_to_Console
                </Link>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                    Verification <span className="text-blue-600">Registry.</span>
                </h1>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                    Internal audit trail for validated assets and creators.
                </p>
                <div className="flex gap-2">
                    <Link
                        href="/verifications/new"
                        className="flex items-center gap-2 bg-white text-black text-[10px] font-black uppercase px-4 py-2 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                    >
                        <Icon icon="lucide:shield-plus" width={14} />
                        ISSUE_VERIFICATION
                    </Link>
                    <Link
                        href="/verifications/registry"
                        className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase px-4 py-2 hover:bg-violet-600 hover:text-white transition-all shadow-lg"
                    >
                        <Icon icon="lucide:radio" width={14} />
                        ARTIST_SIGNALS
                    </Link>
                </div>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon="lucide:list" className="text-zinc-500" width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Audit_Log</h2>
                </div>

                <div className="bg-zinc-950/20 rounded-lg p-1 border border-zinc-900">
                    <VerificationRegistry data={tableData} />
                </div>
            </section>
        </div>
    );
}
