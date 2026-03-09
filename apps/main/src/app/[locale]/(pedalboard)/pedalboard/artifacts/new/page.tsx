
import React, { Suspense } from 'react';
import { getDb, schema } from '@shimokitan/db';
import ArtifactForm from '../ArtifactForm';
import { isNull } from 'drizzle-orm';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';
import { ensureUserSync } from '../../auth-helpers';
import { redirect } from 'next/navigation';

export default async function NewArtifactPage() {
    const user = await ensureUserSync();
    if (!user || (user.role !== 'founder' && user.role !== 'architect')) {
        redirect('/pedalboard');
    }

    const db = getDb();
    if (!db) return <div>DB OFF</div>;

    const rawEntities = db ? await db.query.entities.findMany({
        where: isNull(schema.entities.deletedAt),
        with: {
            avatar: true,
            translations: true
        }
    }) : [];

    const entities = rawEntities.map(e => ({
        id: e.id,
        name: e.translations?.[0]?.name || "Untitled",
        type: e.type,
        avatarUrl: e.avatar?.url || null
    }));

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between border-b border-zinc-900 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/pedalboard/artifacts" className="text-zinc-500 hover:text-white transition-colors">
                            <Icon icon="lucide:arrow-left" width={14} />
                        </Link>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Artifact_Registry / Initialize</span>
                    </div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">
                        Register <span className="text-rose-600">Artifact.</span>
                    </h1>
                </div>
            </header>

            <section className="relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-zinc-500">
                    <Icon icon="lucide:database" width={160} />
                </div>
                <Suspense fallback={
                    <div className="text-white font-mono text-xs animate-pulse p-12 text-center uppercase tracking-widest bg-zinc-950/20 border border-zinc-900">
                        Configuring_Interface...
                    </div>
                }>
                    <ArtifactForm
                        entities={entities as any}
                        userRole={user?.role}
                    />
                </Suspense>
            </section>
        </div>
    );
}
