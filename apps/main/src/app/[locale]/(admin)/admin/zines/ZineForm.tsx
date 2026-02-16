"use client"

import React, { useState } from 'react';
import { seedZine, updateZine } from '../actions';
import { useRouter } from 'next/navigation';

export default function ZineForm({ artifacts, initialData }: { artifacts: any[], initialData?: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            if (initialData?.id) {
                await updateZine(initialData.id, formData);
                alert('Zine Updated!');
                router.push('/admin/zines');
            } else {
                await seedZine(formData);
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
                        name="artifactId"
                        defaultValue={initialData?.artifactId}
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
                        name="author"
                        defaultValue={initialData?.author}
                        required
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                        placeholder="Author Name"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Content</label>
                <textarea
                    name="content"
                    defaultValue={initialData?.content}
                    required
                    rows={6}
                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none resize-none transition-colors"
                    placeholder="Write content..."
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Resonance Score</label>
                <input
                    name="resonance"
                    type="number"
                    defaultValue={initialData?.resonance || 0}
                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
                />
            </div>

            <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-4 bg-emerald-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4 disabled:opacity-50"
            >
                {isSubmitting ? 'PROCESSING...' : initialData?.id ? 'UPDATE_ZINE' : 'PUBLISH_ZINE'}
            </button>
        </form>
    );
}
