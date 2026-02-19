
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createFullCollection, updateFullCollection } from '../actions';
import { Icon } from '@iconify/react';

export default function CollectionForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'id' | 'jp'>('en');

    // Multi-Language State
    const [translations, setTranslations] = useState(
        ['en', 'id', 'jp'].map(lang => {
            const trans = initialData?.translations?.find((t: any) => t.locale === lang);
            return {
                locale: lang as 'en' | 'id' | 'jp',
                title: trans?.title || '',
                description: trans?.thesis || '' // mapped to description in form, thesis in DB
            };
        })
    );

    const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
    const [isMajor, setIsMajor] = useState(initialData?.isMajor || false);
    const [resonance, setResonance] = useState(initialData?.resonance || 0);

    const updateTrans = (locale: string, field: 'title' | 'description', value: string) => {
        setTranslations(translations.map(t => t.locale === locale ? { ...t, [field]: value } : t));
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            const payload = {
                coverImage,
                isMajor,
                resonance,
                translations: translations.filter(t => t.title.trim() !== '')
            };

            if (initialData?.id) {
                await updateFullCollection(initialData.id, payload as any);
                alert('Collection Updated!');
                router.push('/pedalboard/collections');
            } else {
                await createFullCollection(payload as any);
                alert('Collection Created!');
            }
            router.refresh();
        } catch (e) {
            console.error(e);
            alert(`Failed to ${initialData?.id ? 'update' : 'create'} collection`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {/* Tabs for Languages */}
            <div className="flex gap-1 bg-zinc-950 p-1 rounded border border-zinc-900 w-fit">
                {translations.map(t => (
                    <button
                        key={t.locale}
                        type="button"
                        onClick={() => setActiveTab(t.locale)}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase transition-all ${activeTab === t.locale ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        {t.locale}
                    </button>
                ))}
            </div>

            {translations.map(t => (
                <div key={t.locale} className={activeTab === t.locale ? 'space-y-4' : 'hidden'}>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Title ({t.locale})</label>
                        <input
                            value={t.title}
                            onChange={(e) => updateTrans(t.locale, 'title', e.target.value)}
                            className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none transition-colors"
                            placeholder={`Collection Title in ${t.locale.toUpperCase()}`}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Thesis ({t.locale})</label>
                        <textarea
                            value={t.description}
                            onChange={(e) => updateTrans(t.locale, 'description', e.target.value)}
                            rows={3}
                            className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none resize-none transition-colors"
                            placeholder={`Collection Thesis in ${t.locale.toUpperCase()}...`}
                        />
                    </div>
                </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Cover URL</label>
                    <input
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none transition-colors"
                        placeholder="https://..."
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Heat_Index</label>
                    <input
                        type="number"
                        value={resonance}
                        onChange={(e) => setResonance(parseInt(e.target.value) || 0)}
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-4 h-[46px] group cursor-pointer" onClick={() => setIsMajor(!isMajor)}>
                <div className={`w-3 h-3 border ${isMajor ? 'bg-amber-600 border-amber-500' : 'bg-transparent border-zinc-700'} transition-colors`} />
                <span className={`text-[10px] font-mono uppercase ${isMajor ? 'text-white' : 'text-zinc-500'}`}>Major_Label</span>
            </div>

            <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4 disabled:opacity-50"
            >
                {isSubmitting ? 'PROCESSING_REQUEST...' : initialData?.id ? 'COMMIT_COLLECTION_UPDATES' : 'PUBLISH_NEW_COLLECTION'}
            </button>
        </form>
    );
}
