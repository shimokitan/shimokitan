
import React from 'react';
import { Icon } from '@iconify/react';
import { getDb, schema, desc, isNull } from '@shimokitan/db';
import AdminTable from '../components/AdminTable';
import VerificationForm from './VerificationForm';
import { deleteVerification } from '../actions';

export default async function VerificationsPage() {
    const db = getDb();
    if (!db) return <div>DB Connection Failed</div>;

    const [verifications, artifacts, entities] = await Promise.all([
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
        })
    ]);

    const artifactOptions = artifacts.map(a => ({ id: a.id, name: a.translations?.[0]?.title || a.id }));
    const entityOptions = entities.map(e => ({ id: e.id, name: e.translations?.[0]?.name || e.id }));

    const tableData = verifications.map(v => {
        let targetName = 'Unknown';
        if (v.targetType === 'artifact') {
            targetName = artifactOptions.find(a => a.id === v.targetId)?.name || v.targetId;
        } else {
            targetName = entityOptions.find(e => e.id === v.targetId)?.name || v.targetId;
        }

        return {
            ...v,
            targetName,
        };
    });

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                    Verification <span className="text-blue-600">Registry.</span>
                </h1>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                    Internal audit trail for validated assets and creators.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Creation Form */}
                <section className="lg:col-span-1 bg-zinc-950/50 border border-zinc-900 p-6 space-y-6 relative overflow-hidden group h-fit">
                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                        <Icon icon="lucide:shield-check" width={120} />
                    </div>
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-4">
                        <Icon icon="lucide:plus" className="text-blue-600" width={18} />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Issue_Verification</h2>
                    </div>
                    <VerificationForm artifacts={artifactOptions} entities={entityOptions} />
                </section>

                {/* List View */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                        <Icon icon="lucide:list" className="text-zinc-500" width={18} />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Audit_Log</h2>
                    </div>

                    <AdminTable
                        data={tableData}
                        onDelete={deleteVerification}
                        editUrl={(row) => `/admin/verifications/${row.id}`}
                        columns={[
                            {
                                key: 'targetName', label: 'Target', render: (val, row) => (
                                    <div>
                                        <div className="font-bold text-white">{val}</div>
                                        <div className="text-[9px] font-mono text-zinc-500 uppercase">{row.targetType} // {row.targetId}</div>
                                    </div>
                                )
                            },
                            { key: 'grantedBy', label: 'Authorized_By', render: (val) => <span className="text-blue-400 font-mono text-[10px] uppercase">{val}</span> },
                            { key: 'createdAt', label: 'Date', render: (val) => <span className="text-[10px] font-mono text-zinc-500">{new Date(val).toLocaleDateString()}</span> },
                            { key: 'r2Key', label: 'Manifest_ID', render: (val) => <span className="text-[9px] font-mono text-zinc-600 truncate max-w-[100px] block">{val}</span> },
                        ]}
                    />
                </section>
            </div>
        </div>
    );
}
