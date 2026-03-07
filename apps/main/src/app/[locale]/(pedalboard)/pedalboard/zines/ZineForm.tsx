
"use client"

import React, { useState } from 'react';
import { createFullZine, updateFullZine } from '../actions';
import { useRouter } from 'next/navigation';

export default function ZineForm({ artifacts, initialData }: { artifacts: any[], initialData?: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'id' | 'ja'>('en');

    // Multi-Language State
    const [translations, setTranslations] = useState(
        ['en', 'id', 'ja'].map(lang => {
            const trans = initialData?.translations?.find((t: any) => t.locale === lang);
            return {
                locale: lang as 'en' | 'id' | 'ja',
                content: trans?.content || ''
            };
        })
    );

    const [artifactId, setArtifactId] = useState(initialData?.artifactId || '');
    const [author, setAuthor] = useState(initialData?.author || '');
    const [resonance, setResonance] = useState(initialData?.resonance || 0);

    const updateTrans = (locale: string, value: string) => {
        setTranslations(translations.map(t => t.locale === locale ? { ...t, content: value } : t));
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            const payload = {
                artifactId,
                author,
                resonance,
                translations: translations.filter(t => t.content.trim() !== '')
            };

            if (initialData?.id) {
                await updateFullZine(initialData.id, payload as any);
                alert('Zine Updated!');
                router.push('/pedalboard/zines');
            } else {
                await createFullZine(payload as any);
                alert('Zine Created!');
            }
            router.refresh();
        } catch (e) {
            console.error(e);
            alert(`Failed to ${initialData?.id ? 'update' : 'create'} zine`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Related Artifact</label>
                    <select
                        value={artifactId}
                        onChange={(e) => setArtifactId(e.target.value)}
                        required
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                    >
                        <option value="">Select Artifact</option>
                        {artifacts.map((a: any) => (
                            <option key={a.id} value={a.id}>{a.title}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Author</label>
                    <input
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                        placeholder="Author Name"
                    />
                </div>
            </div>

            {/* Tabs for Languages */}
            <div className="flex gap-1 bg-zinc-950 p-1 rounded border border-zinc-900 w-fit">
                {translations.map(t => (
                    <button
                        key={t.locale}
                        type="button"
                        onClick={() => setActiveTab(t.locale)}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase transition-all ${activeTab === t.locale ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        {t.locale}
                    </button>
                ))}
            </div>

            {translations.map(t => (
                <div key={t.locale} className={activeTab === t.locale ? 'space-y-1' : 'hidden'}>
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Content ({t.locale})</label>
                    <textarea
                        value={t.content}
                        onChange={(e) => updateTrans(t.locale, e.target.value)}
                        rows={6}
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none resize-none transition-colors"
                        placeholder={`Write content in ${t.locale.toUpperCase()}...`}
                    />
                </div>
            ))}

            <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Resonance Score</label>
                <input
                    type="number"
                    value={resonance}
                    onChange={(e) => setResonance(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                />
            </div>

            <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4 disabled:opacity-50"
            >
                {isSubmitting ? 'PROCESSING_CORE...' : initialData?.id ? 'UPDATE_ZINE_DATA' : 'PUBLISH_ZINE_CORE'}
            </button>
        </form>
    );
}
