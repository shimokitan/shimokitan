
import React from 'react';
import { getDb, schema, eq } from '@shimokitan/db';
import CollectionForm from '../CollectionForm';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditCollectionPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const db = getDb();

    const collection = db ? await db.query.collections.findFirst({
        where: eq(schema.collections.id, params.id)
    }) : null;

    if (!collection) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between border-b border-zinc-900 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/collections" className="text-zinc-500 hover:text-white transition-colors">
                            <Icon icon="lucide:arrow-left" width={14} />
                        </Link>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Library / Curate / Update</span>
                    </div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">
                        Edit <span className="text-amber-500">Collection.</span>
                    </h1>
                </div>
            </header>

            <div className="max-w-2xl">
                <section className="bg-zinc-950/50 border border-zinc-900 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Icon icon="lucide:disc" width={160} />
                    </div>
                    <CollectionForm initialData={collection} />
                </section>
            </div>
        </div>
    );
}
