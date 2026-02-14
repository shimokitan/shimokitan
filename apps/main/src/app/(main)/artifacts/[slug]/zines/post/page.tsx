"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { MainLayout } from '../../../../../../components/layout/MainLayout';
import { MOCK_ARTIFACTS } from '../../../../../../lib/mock-data';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@shimokitan/ui';

export default function PostZinePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;
    const artifact = MOCK_ARTIFACTS[slug];
    const [content, setContent] = useState('');

    if (!artifact) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500 font-mono">
                    <h1 className="text-xl font-black uppercase tracking-widest">Shard Not Found</h1>
                </div>
            </MainLayout>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, logic to save would go here
        alert("Echo broadcasted into the void. (Mock functionality)");
        router.push(`/artifacts/${slug}`);
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-700">

                {/* Protocol Header */}
                <div className="flex flex-col gap-6 mb-20">
                    <div className="flex items-center justify-between">
                        <Link href={`/artifacts/${slug}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors group">
                            <Icon icon="lucide:arrow-left" width={14} height={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Fragment
                        </Link>
                        <div className="flex items-center gap-2 font-mono text-[9px] text-rose-600 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-rose-600" />
                            RESONANCE_STATION // LIVE
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 border-l-4 border-rose-600 pl-8">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.5em]">Transmitting_Memoir //</span>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                            CASTING_<span className="text-rose-600">ECHO</span>
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-16">
                    {/* The Artifact Card - Small Reference */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex items-center gap-6">
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-zinc-800 grayscale shrink-0">
                            <img src={artifact.coverImage} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono text-zinc-600 uppercase">Targeting Artifact //</span>
                            <h2 className="text-xl font-black uppercase italic text-zinc-100">{artifact.title}</h2>
                            <Badge variant="clean" className="w-fit">{artifact.category.toUpperCase()}</Badge>
                        </div>
                    </div>

                    {/* THE PROMPT - MANDATORY CALL */}
                    <div className="space-y-8">
                        <div className="bg-rose-950/20 border-y border-rose-900/40 p-12 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                            <Icon icon="lucide:message-square-quote" width={32} height={32} className="text-rose-600 mx-auto mb-6 opacity-30" />
                            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white leading-tight">
                                &ldquo;What state in your life were you in when you experienced this?&rdquo;
                            </h3>
                            <div className="mt-6 flex items-center justify-center gap-4 text-rose-800 font-mono text-[8px] uppercase tracking-widest">
                                <Icon icon="lucide:shield-check" width={10} height={10} />
                                Required Field // Truth Verification Required
                            </div>
                        </div>

                        <div className="relative">
                            <textarea
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-black border-2 border-zinc-900 rounded-3xl p-10 md:p-14 text-xl md:text-2xl font-serif italic text-zinc-300 outline-none focus:border-rose-600 transition-all min-h-[400px] shadow-[inset_0_0_20px_rgba(0,0,0,1)] placeholder:text-zinc-900 leading-relaxed"
                                placeholder="Write your echo here... no formatting, just resonance."
                            />

                            {/* HUD SPECS in Textarea */}
                            <div className="absolute bottom-10 right-10 flex flex-col items-end gap-1 pointer-events-none opacity-20">
                                <span className="text-[9px] font-mono uppercase text-zinc-500">RES_CHAR_IDX: {content.length}</span>
                                <span className="text-[9px] font-mono uppercase text-rose-600">INPUT_READY</span>
                            </div>
                        </div>
                    </div>

                    {/* Submission */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-8">
                        <div className="flex flex-col gap-2 max-w-sm">
                            <p className="text-[10px] font-mono text-zinc-600 uppercase italic leading-snug">
                                By broadcasting this zine, you archive this shard of your life in the collective memory floor. Shards cannot be edited after pulse.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full md:w-auto bg-rose-600 text-black font-black italic text-4xl px-20 py-8 shadow-[12px_12px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-tighter active:scale-95 disabled:bg-zinc-900 disabled:text-zinc-700 disabled:shadow-none"
                            disabled={!content.trim()}
                        >
                            PULSE_MEMOIR.
                        </button>
                    </div>
                </form>

                {/* Footer Decor */}
                <div className="mt-32 opacity-[0.05] pointer-events-none select-none">
                    <span className="text-[150px] font-black uppercase italic tracking-tighter leading-none">RESONANCE</span>
                </div>

            </div>
        </MainLayout>
    );
}
