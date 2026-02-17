
import React from 'react';
import { Icon } from '@iconify/react';
import { isNull, schema as dbSchema, getDb } from '@shimokitan/db';
import Link from 'next/link';

export default async function AdminDashboard() {
    const db = getDb();

    // Safety check just in case db is not initialized yet (though it should be)
    if (!db) return <div>DB Connection Failed</div>;

    const [artifacts, entities, collections, zines, verifications, tags] = await Promise.all([
        db.query.artifacts.findMany({ where: isNull(dbSchema.artifacts.deletedAt), columns: { id: true } }),
        db.query.entities.findMany({ where: isNull(dbSchema.entities.deletedAt), columns: { id: true } }),
        db.query.collections.findMany({ where: isNull(dbSchema.collections.deletedAt), columns: { id: true } }),
        db.query.zines.findMany({ where: isNull(dbSchema.zines.deletedAt), columns: { id: true } }),
        db.query.verificationRegistry.findMany({ columns: { id: true } }),
        db.query.tags.findMany({ columns: { id: true } }),
    ]);

    const stats = [
        { label: 'Artifacts', count: artifacts.length, icon: 'lucide:package', color: 'text-rose-600', href: '/admin/artifacts' },
        { label: 'Entities', count: entities.length, icon: 'lucide:users', color: 'text-violet-600', href: '/admin/entities' },
        { label: 'Collections', count: collections.length, icon: 'lucide:disc', color: 'text-amber-500', href: '/admin/collections' },
        { label: 'Zines', count: zines.length, icon: 'lucide:file-text', color: 'text-emerald-500', href: '/admin/zines' },
        { label: 'Verifications', count: verifications.length, icon: 'lucide:shield-check', color: 'text-blue-500', href: '/admin/verifications' },
        { label: 'Tags', count: tags.length, icon: 'lucide:tags', color: 'text-pink-500', href: '/admin/tags' },
    ];

    return (
        <div className="space-y-12">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-0.5 bg-rose-600" />
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-rose-600/70 italic">Restricted_Access</span>
                </div>
                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
                    Command <span className="text-rose-600">Center.</span>
                </h1>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em] mt-1">
                    System Overview & Database Statistics
                </p>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href} className="group block bg-zinc-950/50 border border-zinc-900 p-6 relative overflow-hidden transition-all hover:border-zinc-700">
                        <div className={`absolute top-0 right-0 p-2 opacity-5 transition-opacity group-hover:opacity-10 pointer-events-none ${stat.color}`}>
                            <Icon icon={stat.icon} width={80} />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900/50 ${stat.color}`}>
                                <Icon icon={stat.icon} width={16} />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-white tracking-tighter">{stat.count}</div>
                                <div className="text-xs uppercase tracking-widest text-zinc-400 font-mono mt-1 group-hover:text-zinc-300 transition-colors">{stat.label}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
