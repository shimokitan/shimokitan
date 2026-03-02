
import React from 'react';
export const dynamic = 'force-dynamic';
import { Icon } from '@iconify/react';
import { deleteCollection } from '../actions';
import { getDb, desc, schema } from '@shimokitan/db';
import CollectionRegistry from './components/CollectionRegistry';
import CollectionForm from './CollectionForm';

import { isNull, isNotNull } from 'drizzle-orm';
import Link from '@/components/Link';
import { ensureUserSync } from '../auth-helpers';
import { redirect } from 'next/navigation';

export default async function CollectionsPage(props: { searchParams: Promise<{ trash?: string }> }) {
    const user = await ensureUserSync();
    if (!user || (user.role !== 'founder' && user.role !== 'architect')) {
        redirect('/pedalboard');
    }

    const searchParams = await props.searchParams;
    const isTrash = searchParams.trash === 'true';

    const db = getDb();
    const rawCollections = db ? await db.query.collections.findMany({
        where: isTrash ? isNotNull(schema.collections.deletedAt) : isNull(schema.collections.deletedAt),
        orderBy: [desc(schema.collections.createdAt)],
        with: {
            translations: true
        }
    }) : [];

    const allCollections = rawCollections.map(c => ({
        ...c,
        title: c.translations?.[0]?.title || "Untitled"
    }));

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Curated <span className="text-amber-500">Collections.</span>
                    </h1>
                    <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                        {isTrash ? 'Purge or recover curated collections.' : 'Manage mixtapes and curated collections.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {!isTrash && (
                        <Link
                            href="/pedalboard/collections/new"
                            className="flex items-center gap-2 bg-white text-black text-[10px] font-black uppercase px-4 py-2 hover:bg-amber-500 hover:text-black transition-all shadow-lg"
                        >
                            <Icon icon="lucide:plus" width={14} />
                            REGISTER_COLLECTION
                        </Link>
                    )}
                    <Link
                        href={isTrash ? '/pedalboard/collections' : '/pedalboard/collections?trash=true'}
                        className={`text-[10px] font-mono px-3 py-1 border transition-colors ${isTrash ? 'bg-amber-500 border-amber-500 text-black hover:bg-white' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                    >
                        {isTrash ? 'VIEW_ACTIVE' : 'VIEW_TRASH'}
                    </Link>
                </div>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon={isTrash ? "lucide:trash-2" : "lucide:list"} className={isTrash ? "text-rose-500" : "text-zinc-500"} width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                        {isTrash ? 'TRASH_PURGE' : 'All_Collections'}
                    </h2>
                </div>

                <div className="bg-zinc-950/20 rounded-lg p-1 border border-zinc-900">
                    <CollectionRegistry data={allCollections} isTrash={isTrash} />
                </div>
            </section>
        </div>
    );
}
