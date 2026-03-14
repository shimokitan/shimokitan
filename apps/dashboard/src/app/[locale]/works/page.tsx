import React from 'react';
export const dynamic = 'force-dynamic';
import { Icon } from '@iconify/react';
import { getDb, schema, desc } from '@shimokitan/db';
import WorkRegistry from './components/WorkRegistry';
import { isNull, isNotNull } from 'drizzle-orm';
import Link from '@/components/Link';
import { ensureUserSync } from '../auth-helpers';
import { redirect } from 'next/navigation';

export default async function WorksPage(props: { params: Promise<{ locale: string }>, searchParams: Promise<{ trash?: string }> }) {
    const { locale } = await props.params;
    const user = await ensureUserSync();
    if (!user || (user.role !== 'founder' && user.role !== 'architect')) {
        redirect('/');
    }

    const searchParams = await props.searchParams;
    const isTrash = searchParams.trash === 'true';

    const db = getDb();
    const rawWorks = db ? await db.query.works.findMany({
        where: isTrash ? isNotNull(schema.works.deletedAt) : isNull(schema.works.deletedAt),
        orderBy: [desc(schema.works.createdAt)],
        with: {
            translations: true
        }
    }) : [];

    const allWorks = rawWorks.map(w => ({
        ...w,
        title: w.translations?.[0]?.title || "Untitled"
    }));

    return (
        <div className="space-y-6">
            <header className="flex items-end justify-between">
                <div>
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all mb-6"
                    >
                        <Icon icon="lucide:arrow-left" width={14} />
                        Exit_to_Console
                    </Link>
                    <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Works <span className="text-rose-600">Registry.</span>
                    </h1>
                    <p className="text-zinc-400 text-xs font-mono uppercase tracking-[0.2em]">
                        {isTrash ? 'Recover or permanently purge IP anchors.' : 'Anchor point management for Intellectual Properties.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {!isTrash && (
                        <Link
                            href="/works/new"
                            className="flex items-center gap-2 bg-white text-black text-[10px] font-black uppercase px-4 py-2 hover:bg-rose-600 hover:text-white transition-all shadow-lg"
                        >
                            <Icon icon="lucide:plus" width={14} />
                            REGISTER_WORK_ANCHOR
                        </Link>
                    )}
                    <Link
                        href={isTrash ? '/works' : '/works?trash=true'}
                        className={`text-[10px] font-black uppercase px-4 py-2 border transition-colors ${isTrash ? 'bg-rose-600 border-rose-600 text-white hover:bg-white hover:text-black' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'}`}
                    >
                        {isTrash ? 'VIEW_ACTIVE' : 'VIEW_TRASH'}
                    </Link>
                </div>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
                    <Icon icon={isTrash ? "lucide:trash-2" : "lucide:anchor"} className={isTrash ? "text-rose-500" : "text-rose-500"} width={18} />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">
                        {isTrash ? 'TRASH_PURGE' : 'Active_Works'}
                    </h2>
                </div>

                <div className="bg-zinc-950/20 rounded-lg p-1 border border-zinc-900">
                    <WorkRegistry data={allWorks} isTrash={isTrash} />
                </div>
            </section>
        </div>
    );
}
