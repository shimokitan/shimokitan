
import React from 'react';
import { getDb, schema, eq } from '@shimokitan/db';
import TagForm from '../TagForm';
import { notFound } from 'next/navigation';
import { Icon } from '@iconify/react';

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const db = getDb();
    if (!db) return <div>DB Connection Failed</div>;

    const tag = await db.query.tags.findFirst({
        where: eq(schema.tags.id, id),
        with: {
            translations: true
        }
    });

    if (!tag) notFound();

    return (
        <div className="space-y-6">
            <header className="flex items-center gap-4">
                <a href="/admin/tags" className="p-2 border border-zinc-900 bg-zinc-950 text-zinc-500 hover:text-white transition-colors">
                    <Icon icon="lucide:arrow-left" width={16} />
                </a>
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-1">
                        Edit <span className="text-pink-600">Tag.</span>
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">UID // {tag.id}</p>
                </div>
            </header>

            <div className="max-w-xl bg-zinc-950/50 border border-zinc-900 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Icon icon="lucide:tags" width={160} />
                </div>
                <TagForm initialData={tag} />
            </div>
        </div>
    );
}
