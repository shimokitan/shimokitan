
import React from 'react';
import { getDb, schema, eq } from '@shimokitan/db';
import CollectionForm from '../CollectionForm';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';

export default async function EditCollectionPage(props: { params: Promise<{ locale: string; id: string }> }) {
    const params = await props.params;
    const db = getDb();

    const collection = db ? await db.query.collections.findFirst({
        where: eq(schema.collections.id, params.id),
        with: {
            translations: true
        }
    }) : null;

    if (!collection) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between border-b border-zinc-900 pb-4">
                <div>
                    <Link 
                        href="/pedalboard/collections" 
                        className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all mb-4"
                    >
                        <Icon icon="lucide:arrow-left" width={14} />
                        Return_to_Registry
                    </Link>
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
