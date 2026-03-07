"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { createFullTag, updateFullTag } from '../actions';
import { useRouter } from 'next/navigation';

export default function TagForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [translations, setTranslations] = useState<{ locale: 'en' | 'id' | 'ja', name: string }[]>(
        initialData?.translations
            ? initialData.translations.map((t: any) => ({ locale: t.locale, name: t.name }))
            : [
                { locale: 'en', name: '' },
                { locale: 'id', name: '' },
                { locale: 'ja', name: '' }
            ]
    );

    const updateName = (locale: string, name: string) => {
        setTranslations(translations.map(t => t.locale === locale ? { ...t, name } : t));
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            const payload = {
                category: formData.get('category') as string,
                translations: translations.filter(t => t.name.trim() !== '')
            };

            if (initialData?.id) {
                await updateFullTag(initialData.id, payload as any);
                alert('Tag Updated!');
            } else {
                await createFullTag(payload as any);
                alert('Tag Created!');
            }

            router.refresh();
            if (initialData?.id) router.push('/pedalboard/tags');
        } catch (e) {
            console.error(e);
            alert(`Failed to ${initialData?.id ? 'update' : 'create'} tag`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Category</label>
                    <select
                        name="category"
                        defaultValue={initialData?.category || 'genre'}
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-pink-600 outline-none"
                    >
                        <option value="genre">GENRE</option>
                        <option value="mood">MOOD</option>
                        <option value="style">STYLE</option>
                        <option value="theme">THEME</option>
                        <option value="other">OTHER</option>
                    </select>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-900">
                    <div className="flex items-center gap-2">
                        <Icon icon="lucide:languages" className="text-zinc-500" width={14} />
                        <span className="text-[10px] font-mono uppercase text-zinc-500">Translations</span>
                    </div>

                    {translations.map((t) => (
                        <div key={t.locale} className="space-y-1">
                            <label className="text-[9px] font-mono uppercase text-zinc-500">{t.locale === 'en' ? 'ENGLISH' : t.locale === 'id' ? 'BAHASA' : 'JAPANESE'}</label>
                            <input
                                value={t.name}
                                onChange={(e) => updateName(t.locale, e.target.value)}
                                className="w-full bg-black border border-zinc-800 p-2 text-sm text-white focus:border-pink-600 outline-none transition-colors"
                                placeholder="Tag Name..."
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-3 bg-pink-600 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50"
            >
                {isSubmitting ? 'PROCESSING...' : initialData?.id ? 'UPDATE_TAG' : 'REGISTER_TAG'}
            </button>
        </form>
    );
}
