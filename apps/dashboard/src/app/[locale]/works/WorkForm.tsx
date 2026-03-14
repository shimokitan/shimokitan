"use client";

import React, { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { createFullWork, updateFullWork } from '../actions/works';
import { useRouter } from 'next/navigation';
import { MediaUploader } from '@shimokitan/ui';
import { uploadMediaAction } from '../media-actions';
import { toast } from 'sonner';
import { extractMediaId, getThumbnailUrl } from '@shimokitan/utils';

export default function WorkForm({
    initialData
}: {
    initialData?: any
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'id' | 'ja'>('en');

    // Multi-Language State
    const [translations, setTranslations] = useState(
        ['en', 'id', 'ja'].map(lang => {
            const trans = initialData?.translations?.find((t: any) => t.locale === lang);
            return {
                locale: lang as 'en' | 'id' | 'ja',
                title: trans?.title || '',
                description: trans?.description || ''
            };
        })
    );

    const [category, setCategory] = useState(initialData?.category || 'music');
    const [slug, setSlug] = useState(initialData?.slug || '');
    
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initialData?.thumbnail?.url || null);
    const [thumbnailId, setThumbnailId] = useState<string | null>(initialData?.thumbnailId || null);
    const [pendingThumbnailUrl, setPendingThumbnailUrl] = useState<string | null>(null);

    // CTRL+S save handler
    const handleSave = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const t = toast.loading(`${initialData?.id ? 'UPDATING_IP_ANCHOR' : 'PUBLISHING_IP_ANCHOR'}...`);

        try {
            let finalThumbnailId = thumbnailId;

            if (pendingThumbnailUrl) {
                const formData = new FormData();
                formData.append('url', pendingThumbnailUrl);
                formData.append('context', 'artifact_asset');
                const res = await uploadMediaAction(formData);
                finalThumbnailId = res.mediaId;
            }

            const payload = {
                category,
                slug: slug || null,
                translations: translations.filter(t => t.title.trim() !== ''),
                thumbnailId: finalThumbnailId
            };

            if (initialData?.id) {
                await updateFullWork(initialData.id, payload as any);
                toast.success('IP Anchor Record Updated successfully', { id: t });
            } else {
                await createFullWork(payload as any);
                toast.success('New IP Anchor Record Published', { id: t });
            }

            router.refresh();
            router.push('/works');
        } catch (e: any) {
            console.error(e);
            toast.error(e.message || 'Transmission_Failure: Signal lost during commit', { id: t });
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, initialData?.id, category, slug, translations, thumbnailId, pendingThumbnailUrl, router]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

    const updateTrans = (locale: string, field: 'title' | 'description', value: string) => {
        setTranslations(translations.map(t => t.locale === locale ? { ...t, [field]: value } : t));
    };

    const handleThumbnailUrlSelect = (url: string) => {
        let targetUrl = url;
        if (url.includes('youtube.com/') || url.includes('youtu.be/')) {
            const id = extractMediaId(url, 'youtube');
            const thumb = getThumbnailUrl(id, 'youtube');
            if (thumb) targetUrl = thumb;
        }
        setThumbnailUrl(targetUrl);
        setPendingThumbnailUrl(targetUrl);
    };

    return (
        <div className="relative pb-24">
            <div className="space-y-6">
                <div className="space-y-8">
                    {/* 01. REGISTRY & VISUALS */}
                    <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">01 // REGISTRY_&_VISUALS</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500">System_Meta</h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-mono uppercase text-zinc-400 pl-1">Category_Sector</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value as any)}
                                            required
                                            className="w-full bg-zinc-950 border border-zinc-900 p-3 text-xs text-white focus:border-rose-600 outline-none transition-all rounded-lg appearance-none cursor-pointer"
                                        >
                                            <option value="music">MUSIC_TRACK</option>
                                            <option value="anime">ANIME_FEATURE</option>
                                            <option value="game">GAME_ENTITY</option>
                                            <option value="other">OTHER_SIGNAL</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-mono uppercase text-zinc-400 pl-1">Handle_Reference</label>
                                        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 focus-within:border-rose-600 outline-none transition-all rounded-lg pl-3 pr-1">
                                            <span className="text-[10px] font-mono text-zinc-600">/</span>
                                            <input
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                className="w-full bg-transparent border-none p-3 pl-0 text-xs text-white outline-none font-mono"
                                                placeholder="work-slug-here..."
                                            />
                                        </div>
                                        <p className="text-[8px] text-zinc-600 font-mono italic pl-2">System current: {initialData?.slug || 'PENDING'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Visual_Branding</h3>
                                <div className="p-6 bg-zinc-950/50 border border-zinc-900 rounded-xl relative overflow-hidden group">
                                    <div className="max-w-md space-y-2 mx-auto">
                                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">Cover_Identity (16:9)</label>
                                        <MediaUploader
                                            value={thumbnailUrl || ''}
                                            uploadAction={uploadMediaAction}
                                            onChange={(id, url) => { setThumbnailId(id); setThumbnailUrl(url); }}
                                            onUrlSelect={handleThumbnailUrlSelect}
                                            contextType="artifact_asset"
                                            className="w-full aspect-video"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 02. LOCALIZATION MATRIX */}
                    <div className="w-full pt-8 border-t border-zinc-900">
                        <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">02 // LOCALIZATION_MATRIX</span>
                        </div>
                        <div className="flex flex-col bg-zinc-950 p-6 border border-zinc-900 rounded-xl">
                            <div className="flex items-center justify-between mb-8 border-b border-zinc-900/50 pb-6">
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic">I18n_Localization_Matrix</h3>
                                    <p className="text-[9px] text-zinc-600 font-mono italic">MULTILINGUAL_METADATA_SYNCHRONIZATION.</p>
                                </div>
                                <div className="flex gap-1 bg-black p-1 rounded-lg border border-zinc-900">
                                    {translations.map(t => (
                                        <button
                                            key={t.locale}
                                            type="button"
                                            onClick={() => setActiveTab(t.locale)}
                                            className={`px-6 py-2 text-[10px] font-black uppercase transition-all rounded-md ${activeTab === t.locale ? 'bg-rose-600 text-black' : 'text-zinc-500 hover:text-white'}`}
                                        >
                                            {t.locale}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {translations.map(t => (
                                <div key={t.locale} className={activeTab === t.locale ? 'space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono uppercase text-zinc-400 pl-1">Public_Title ({t.locale})</label>
                                        <input
                                            value={t.title}
                                            onChange={(e) => updateTrans(t.locale, 'title', e.target.value)}
                                            className="w-full bg-black border border-zinc-800 p-4 text-sm text-white focus:border-rose-600 outline-none transition-all rounded-lg font-bold italic"
                                            placeholder={`Work Title in ${t.locale.toUpperCase()}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono uppercase text-zinc-400 pl-1">IP_Context ({t.locale})</label>
                                        <textarea
                                            value={t.description}
                                            onChange={(e) => updateTrans(t.locale, 'description', e.target.value)}
                                            rows={8}
                                            className="w-full bg-black border border-zinc-800 p-4 text-sm text-white focus:border-rose-600 outline-none transition-all rounded-lg resize-none leading-relaxed"
                                            placeholder="System description / IP background / chronological context..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Save Bar */}
            <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-black/80 backdrop-blur-xl border-t border-zinc-900 p-4 z-50 animate-in slide-in-from-bottom-full duration-500">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
                    <div className="hidden md:flex items-center gap-6 text-zinc-500">
                        <div className="flex items-center gap-2">
                            <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono">ESC</kbd>
                            <span className="text-[10px] uppercase font-bold">Discard</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono">^ S</kbd>
                            <span className="text-[10px] uppercase font-bold">Commit_Changes</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 md:flex-none px-8 py-3 bg-zinc-950 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:bg-zinc-900 hover:text-white transition-all rounded-lg"
                        >
                            CANCEL_SIGNAL
                        </button>
                        <button
                            onClick={() => handleSave()}
                            disabled={isSubmitting}
                            type="button"
                            className="flex-1 md:flex-none px-12 py-3 bg-rose-600 text-black font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all disabled:opacity-50 rounded-lg shadow-[0_0_30px_rgba(225,29,72,0.2)]"
                        >
                            {isSubmitting ? 'COMMITTING_IP_ANCHOR...' : initialData?.id ? 'UPGRADE_ANCHOR' : 'PUBLISH_ANCHOR'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
