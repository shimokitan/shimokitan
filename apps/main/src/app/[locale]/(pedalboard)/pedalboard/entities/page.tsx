
import React from 'react';
export const dynamic = 'force-dynamic';
import { Icon } from '@iconify/react';
import EntityForm from './EntityForm';

import { getDb, desc, schema } from '@shimokitan/db';
import EntityRegistry from './components/EntityRegistry';
import { deleteEntity } from '../actions';

import { isNull, isNotNull } from 'drizzle-orm';
import Link from 'next/link';
import { ensureUserSync } from '../actions';
import { redirect } from 'next/navigation';

export default async function EntitiesPage(props: { searchParams: Promise<{ trash?: string }> }) {
    const user = await ensureUserSync();
    if (!user || (user.role !== 'founder' && user.role !== 'architect')) {
        redirect('/pedalboard');
    }

    const searchParams = await props.searchParams;
    const isTrash = searchParams.trash === 'true';

    const db = getDb();
    const rawEntities = db ? await db.query.entities.findMany({
        where: isTrash ? isNotNull(schema.entities.deletedAt) : isNull(schema.entities.deletedAt),
        orderBy: [desc(schema.entities.createdAt)],
        with: {
            translations: true
        }
    }) : [];

    const allEntities = rawEntities.map(e => ({
        ...e,
        name: e.translations?.[0]?.name || "Untitled"
    }));

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Known <span className="text-violet-600">Entities.</span>
                    </h1>
                    <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                        {isTrash ? 'Purge or recover known identities.' : 'Manage known entities, organizations, and individuals.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {!isTrash && (
                        <Link
                            href="/pedalboard/entities/new"
                            className="flex items-center gap-2 bg-white text-black text-[10px] font-black uppercase px-4 py-2 hover:bg-violet-600 hover:text-white transition-all shadow-lg"
                        >
                            <Icon icon="lucide:user-plus" width={14} />
                            REGISTER_ENTITY
                        </Link>
                    )}
                    <Link
                        href={isTrash ? '/pedalboard/entities' : '/pedalboard/entities?trash=true'}
                        className={`text-[10px] font-mono px-3 py-1 border transition-colors ${isTrash ? 'bg-violet-600 border-violet-600 text-white hover:bg-white hover:text-black' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                    >
                        {isTrash ? 'VIEW_ACTIVE' : 'VIEW_TRASH'}
                    </Link>
                </div>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon={isTrash ? "lucide:trash-2" : "lucide:list"} className={isTrash ? "text-rose-500" : "text-zinc-500"} width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                        {isTrash ? 'TRASH_PURGE' : 'Known_Entities'}
                    </h2>
                </div>

                <div className="bg-zinc-950/20 rounded-lg p-1 border border-zinc-900">
                    <EntityRegistry data={allEntities} />
                </div>
            </section>
        </div>
    );
}
