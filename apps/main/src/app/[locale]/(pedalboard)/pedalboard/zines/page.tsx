
import React from 'react';
export const dynamic = 'force-dynamic';
import { Icon } from '@iconify/react';
import { deleteZine } from '../actions';
import { getDb, desc, schema } from '@shimokitan/db';
import ZineRegistry from './components/ZineRegistry';
import ZineForm from './ZineForm';

import { isNull, isNotNull } from 'drizzle-orm';
import Link from '@/components/Link';
import { ensureUserSync } from '../actions';
import { redirect } from 'next/navigation';

export default async function ZinesPage(props: { searchParams: Promise<{ trash?: string }> }) {
    const user = await ensureUserSync();
    if (!user || (user.role !== 'founder' && user.role !== 'architect')) {
        redirect('/pedalboard');
    }

    const searchParams = await props.searchParams;
    const isTrash = searchParams.trash === 'true';

    const db = getDb();

    // Fetch Artifacts for the selection form
    const rawArtifacts = db ? await db.query.artifacts.findMany({
        where: isNull(schema.artifacts.deletedAt),
        with: {
            translations: true
        }
    }) : [];

    const artifacts = rawArtifacts.map(a => ({
        id: a.id,
        title: a.translations?.[0]?.title || "Untitled"
    }));

    const rawZines = db ? await db.query.zines.findMany({
        where: isTrash ? isNotNull(schema.zines.deletedAt) : isNull(schema.zines.deletedAt),
        orderBy: [desc(schema.zines.createdAt)],
        with: {
            artifact: {
                with: {
                    translations: true
                }
            }
        }
    }) : [];

    const allZines = rawZines.map(z => ({
        ...z,
        artifact: z.artifact ? {
            ...z.artifact,
            title: z.artifact.translations?.[0]?.title || "Untitled"
        } : null
    }));

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Underground <span className="text-emerald-500">Zines.</span>
                    </h1>
                    <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                        {isTrash ? 'Purge or recover zine articles.' : 'Publish zines and articles.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {!isTrash && (
                        <Link
                            href="/pedalboard/zines/new"
                            className="flex items-center gap-2 bg-white text-black text-[10px] font-black uppercase px-4 py-2 hover:bg-emerald-500 hover:text-black transition-all shadow-lg"
                        >
                            <Icon icon="lucide:plus" width={14} />
                            REGISTER_ZINE
                        </Link>
                    )}
                    <Link
                        href={isTrash ? '/pedalboard/zines' : '/pedalboard/zines?trash=true'}
                        className={`text-[10px] font-mono px-3 py-1 border transition-colors ${isTrash ? 'bg-emerald-500 border-emerald-500 text-black hover:bg-white' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                    >
                        {isTrash ? 'VIEW_ACTIVE' : 'VIEW_TRASH'}
                    </Link>
                </div>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon={isTrash ? "lucide:trash-2" : "lucide:list"} className={isTrash ? "text-rose-500" : "text-zinc-500"} width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                        {isTrash ? 'TRASH_PURGE' : 'Published_Zines'}
                    </h2>
                </div>

                <div className="bg-zinc-950/20 rounded-lg p-1 border border-zinc-900">
                    <ZineRegistry data={allZines as any} />
                </div>
            </section>
        </div>
    );
}
