
import React from 'react';
import { Icon } from '@iconify/react';
import EntityForm from './EntityForm';

import { getDb, desc, schema } from '@shimokitan/db';
import AdminTable from '../components/AdminTable';
import { deleteEntity } from '../actions';

import { isNull, isNotNull } from 'drizzle-orm';
import Link from 'next/link';

export default async function EntitiesPage(props: { searchParams: Promise<{ trash?: string }> }) {
    const searchParams = await props.searchParams;
    const isTrash = searchParams.trash === 'true';

    const db = getDb();
    const allEntities = db ? await db.query.entities.findMany({
        where: isTrash ? isNotNull(schema.entities.deletedAt) : isNull(schema.entities.deletedAt),
        orderBy: [desc(schema.entities.createdAt)]
    }) : [];

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
                <Link
                    href={isTrash ? '/admin/entities' : '/admin/entities?trash=true'}
                    className={`text-[10px] font-mono px-3 py-1 border transition-colors ${isTrash ? 'bg-violet-600 border-violet-600 text-white hover:bg-white hover:text-black' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                >
                    {isTrash ? 'VIEW_ACTIVE' : 'VIEW_TRASH'}
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {!isTrash && (
                    <section className="bg-zinc-950/50 border border-zinc-900 p-6 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                            <Icon icon="lucide:user-plus" width={120} />
                        </div>
                        <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-4">
                            <Icon icon="lucide:user-plus" className="text-violet-600" width={18} />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">New_Entity</h2>
                        </div>

                        <EntityForm />
                    </section>
                )}

                <section className={`${isTrash ? 'md:col-span-2' : ''} space-y-6`}>
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                        <Icon icon={isTrash ? "lucide:trash-2" : "lucide:list"} className={isTrash ? "text-rose-500" : "text-zinc-500"} width={18} />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                            {isTrash ? 'TRASH_PURGE' : 'Known_Entities'}
                        </h2>
                    </div>

                    <AdminTable
                        data={allEntities}
                        onDelete={deleteEntity}
                        editUrl={(row) => `/admin/entities/${row.id}`}
                        columns={[
                            { key: 'name', label: 'Name', render: (val) => <span className="font-bold text-white">{val}</span> },
                            { key: 'type', label: 'Type', render: (val) => <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-800 rounded uppercase">{val}</span> },
                            { key: 'avatarUrl', label: 'Avatar', render: (val) => val ? <img src={val} className="w-6 h-6 rounded-full" /> : <div className="w-6 h-6 bg-zinc-800 rounded-full" /> }
                        ]}
                    />
                </section>
            </div>
        </div>
    );
}
