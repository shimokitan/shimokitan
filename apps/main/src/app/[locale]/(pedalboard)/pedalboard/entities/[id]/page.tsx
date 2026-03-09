
import React from 'react';
import { getDb, schema, eq } from '@shimokitan/db';
import EntityForm from '../EntityForm';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';

export default async function EditEntityPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const db = getDb();

    const entity = db ? await db.query.entities.findFirst({
        where: eq(schema.entities.id, params.id),
        with: {
            translations: true,
            members: true,
            avatar: true,
            thumbnail: true,
            tags: {
                with: {
                    tag: {
                        with: {
                            translations: true
                        }
                    }
                }
            }
        }
    }) : null;

    const allEntities = db ? await db.query.entities.findMany({
        where: (e, { isNull }) => isNull(e.deletedAt),
        with: { translations: true, avatar: true }
    }) : [];

    const entitySelectData = allEntities.map(e => ({
        id: e.id,
        name: e.translations?.[0]?.name || "Untitled",
        type: e.type,
        avatarUrl: e.avatar?.url
    }));

    if (!entity) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between border-b border-zinc-900 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/pedalboard/entities" className="text-zinc-500 hover:text-white transition-colors">
                            <Icon icon="lucide:arrow-left" width={14} />
                        </Link>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">System_Registry / Update</span>
                    </div>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">
                        Edit <span className="text-violet-600">Entity.</span>
                    </h1>
                </div>
            </header>

            <section className="relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Icon icon="lucide:fingerprint" width={160} />
                </div>
                <EntityForm initialData={entity} entities={entitySelectData} />
            </section>
        </div>
    );
}
