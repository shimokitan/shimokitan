"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { _ } from '@shimokitan/utils';
import { createFullCollection, updateFullCollection } from '../actions';

export default function CollectionForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [slug, setSlug] = useState(initialData?.slug || '');

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            const payload = {
                title: formData.get('title') as string,
                thesis: formData.get('thesis') as string,
                coverImage: formData.get('coverImage') as string,
                slug: slug
            };

            if (initialData?.id) {
                await updateFullCollection(initialData.id, payload);
                alert('Collection Updated!');
                router.push('/admin/collections');
            } else {
                await createFullCollection(payload);
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
        <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Title</label>
                    <input
                        name="title"
                        defaultValue={initialData?.translations?.[0]?.title || initialData?.title}
                        required
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none transition-colors"
                        placeholder="Collection Title"
                        onChange={(e) => {
                            if (!slug || slug === initialData?.slug) {
                                setSlug(_.kebabCase(e.target.value));
                            }
                        }}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Slug (URL_HANDLE)</label>
                    <input
                        name="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-[10px] font-mono text-zinc-400 focus:border-amber-500 outline-none"
                        placeholder="unique-slug-id"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Thesis</label>
                <textarea
                    name="thesis"
                    defaultValue={initialData?.translations?.[0]?.thesis || initialData?.thesis}
                    rows={3}
                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none resize-none transition-colors"
                    placeholder="Collection Thesis / Description..."
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Cover URL</label>
                <input
                    name="coverImage"
                    defaultValue={initialData?.coverImage}
                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-amber-500 outline-none transition-colors"
                    placeholder="https://..."
                />
            </div>

            <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4 disabled:opacity-50"
            >
                {isSubmitting ? 'PROCESSING...' : initialData?.id ? 'UPDATE_COLLECTION' : 'CREATE_COLLECTION'}
            </button>
        </form>
    );
}
