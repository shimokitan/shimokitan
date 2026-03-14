
import React from 'react';
import { getDb, schema, eq } from '@shimokitan/db';
import TagForm from '../TagForm';
import { Icon } from '@iconify/react';
import Link from '@/components/Link';

export default async function EditTagPage(props: { params: Promise<{ locale: string; id: string }> }) {
    const { id } = await props.params;
    const db = getDb();

    const tag = db ? await db.query.tags.findFirst({
        where: eq(schema.tags.id, id),
        with: {
            translations: true
        }
    }) : null;

    if (!tag) return <div>Tag not found</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header className="flex items-center justify-between border-b border-zinc-900 pb-6">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">
                        Edit_Tag
                    </h1>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">
                        Ref // {id}
                    </p>
                </div>
                <Link href="/pedalboard/tags" className="text-[10px] font-black uppercase text-zinc-500 hover:text-white flex items-center gap-2">
                    <Icon icon="lucide:arrow-left" /> BACK_TO_TAGS
                </Link>
            </header>

            <div className="bg-zinc-950/50 border border-zinc-900 p-8 rounded-lg">
                <TagForm initialData={tag} />
            </div>
        </div>
    );
}
