"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { createFullArtifact } from '../actions';
import { useRouter } from 'next/navigation';

type Entity = {
    id: string;
    name: string;
    type: string;
};

type Resource = {
    type: string;
    platform: string;
    url: string;
    isPrimary: boolean;
};

type Credit = {
    entityId: string;
    role: string;
};

type Spec = {
    key: string;
    value: string;
};

export default function ArtifactForm({ entities }: { entities: Entity[] }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic Lists
    const [resources, setResources] = useState<Resource[]>([{ type: 'other', platform: 'other', url: '', isPrimary: false }]);
    const [credits, setCredits] = useState<Credit[]>([]);
    const [specs, setSpecs] = useState<Spec[]>([{ key: 'genre', value: '' }]);

    const addResource = () => setResources([...resources, { type: 'other', platform: 'other', url: '', isPrimary: false }]);
    const removeResource = (idx: number) => setResources(resources.filter((_, i) => i !== idx));
    const updateResource = (idx: number, field: keyof Resource, value: any) => {
        const newResources = [...resources];
        if (field === 'isPrimary' && value === true) {
            // Uncheck others
            newResources.forEach(r => r.isPrimary = false);
        }
        newResources[idx] = { ...newResources[idx], [field]: value };
        setResources(newResources);
    };

    const addCredit = () => setCredits([...credits, { entityId: entities[0]?.id || '', role: 'Artist' }]);
    const removeCredit = (idx: number) => setCredits(credits.filter((_, i) => i !== idx));
    const updateCredit = (idx: number, field: keyof Credit, value: string) => {
        const newCredits = [...credits];
        newCredits[idx] = { ...newCredits[idx], [field]: value };
        setCredits(newCredits);
    };

    const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
    const removeSpec = (idx: number) => setSpecs(specs.filter((_, i) => i !== idx));
    const updateSpec = (idx: number, field: keyof Spec, value: string) => {
        const newSpecs = [...specs];
        newSpecs[idx] = { ...newSpecs[idx], [field]: value };
        setSpecs(newSpecs);
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            // Convert dynamic lists to JSON strings for server action
            const cleanResources = resources.filter(r => r.url.trim() !== '');
            const cleanCredits = credits.filter(c => c.entityId.trim() !== '');
            const cleanSpecs = specs.reduce((acc, curr) => {
                if (curr.key.trim()) acc[curr.key] = curr.value;
                return acc;
            }, {} as Record<string, string>);

            await createFullArtifact({
                title: formData.get('title') as string,
                category: formData.get('category') as string,
                description: formData.get('description') as string,
                coverImage: formData.get('coverImage') as string,
                status: formData.get('status') as string,
                score: parseInt(formData.get('score') as string) || 0,
                resources: cleanResources,
                credits: cleanCredits,
                specs: cleanSpecs
            });

            // Reset or redirect
            router.refresh();
            // Optional: reset form types here if needed, but for now we rely on action completing

            alert('Artifact Created with Relations!');
        } catch (e) {
            console.error(e);
            alert('Failed to create artifact');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8">
            {/* 1. Basic Info */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-4">
                    <span className="text-xs font-black uppercase text-rose-500">01 // CORE_DATA</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Title</label>
                        <input name="title" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none transition-colors" placeholder="Artifact Title" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Category</label>
                        <select name="category" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none transition-colors">
                            <option value="anime">ANIME</option>
                            <option value="music">MUSIC</option>
                            <option value="vtuber">VTUBER</option>
                            <option value="asmr">ASMR</option>
                            <option value="zine">ZINE</option>
                            <option value="art">ART</option>
                            <option value="game">GAME</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Description</label>
                    <textarea name="description" rows={3} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none resize-none transition-colors" placeholder="Brief description..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Cover URL</label>
                        <input name="coverImage" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none transition-colors" placeholder="https://..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Status</label>
                            <select name="status" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none">
                                <option value="back_alley">BACK_ALLEY</option>
                                <option value="the_pit">THE_PIT</option>
                                <option value="archived">ARCHIVED</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Score</label>
                            <input name="score" type="number" defaultValue="0" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Resources */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
                    <span className="text-xs font-black uppercase text-violet-500">02 // GATEWAYS (Resources)</span>
                    <button type="button" onClick={addResource} className="text-[10px] uppercase font-bold text-violet-500 hover:text-white flex items-center gap-1">
                        <Icon icon="lucide:plus" width={12} /> ADD_GATEWAY
                    </button>
                </div>

                {resources.map((res, i) => (
                    <div key={i} className="flex gap-2 items-start bg-zinc-900/30 p-2 rounded border border-zinc-800/50">
                        <select
                            value={res.type}
                            onChange={(e) => {
                                const newType = e.target.value;
                                let defaultPlatform = 'other';
                                if (newType === 'mv') defaultPlatform = 'youtube';
                                if (newType === 'stream') defaultPlatform = 'spotify';
                                if (newType === 'social') defaultPlatform = 'twitter';

                                const newResources = [...resources];
                                newResources[i] = { ...newResources[i], type: newType, platform: defaultPlatform };
                                setResources(newResources);
                            }}
                            className="bg-black border border-zinc-800 p-2 text-xs text-white w-24"
                        >
                            <option value="mv">MV (Video)</option>
                            <option value="stream">Stream (Audio)</option>
                            <option value="social">Social</option>
                            <option value="gallery">Gallery</option>
                            <option value="store">Store</option>
                            <option value="other">Other</option>
                        </select>
                        <select
                            value={res.platform}
                            onChange={(e) => updateResource(i, 'platform', e.target.value)}
                            className="bg-black border border-zinc-800 p-2 text-xs text-white w-32"
                        >
                            {res.type === 'mv' && (
                                <>
                                    <option value="youtube">YouTube</option>
                                    <option value="bilibili">Bilibili</option>
                                    <option value="niconico">Niconico</option>
                                </>
                            )}
                            {res.type === 'stream' && (
                                <>
                                    <option value="spotify">Spotify</option>
                                    <option value="soundcloud">SoundCloud</option>
                                    <option value="apple_music">Apple Music</option>
                                    <option value="youtube">YouTube Music</option>
                                </>
                            )}
                            {res.type === 'social' && (
                                <>
                                    <option value="twitter">X / Twitter</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="threads">Threads</option>
                                </>
                            )}
                            {res.type === 'store' && (
                                <>
                                    <option value="booth">Booth</option>
                                    <option value="bandcamp">Bandcamp</option>
                                    <option value="gumroad">Gumroad</option>
                                    <option value="steam">Steam</option>
                                </>
                            )}
                            {['gallery', 'other'].includes(res.type) && (
                                <>
                                    <option value="pixiv">Pixiv</option>
                                    <option value="artstation">ArtStation</option>
                                    <option value="other">Other</option>
                                </>
                            )}
                        </select>
                        <input
                            value={res.url}
                            onChange={(e) => updateResource(i, 'url', e.target.value)}
                            placeholder="URL..."
                            className="bg-black border border-zinc-800 p-2 text-xs text-white flex-1"
                        />
                        <button
                            type="button"
                            onClick={() => updateResource(i, 'isPrimary', !res.isPrimary)}
                            className={`p-2 border ${res.isPrimary ? 'bg-violet-600 border-violet-500 text-black' : 'bg-black border-zinc-800 text-zinc-600'} transition-colors`}
                            title="Set as Primary"
                        >
                            <Icon icon="lucide:star" width={12} height={12} />
                        </button>
                        <button type="button" onClick={() => removeResource(i)} className="p-2 text-rose-500">
                            <Icon icon="lucide:x" width={12} />
                        </button>
                    </div>
                ))}
            </div>

            {/* 3. Specs */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
                    <span className="text-xs font-black uppercase text-amber-500">03 // VIBE_SIGNATURE (Specs)</span>
                    <button type="button" onClick={addSpec} className="text-[10px] uppercase font-bold text-amber-500 hover:text-white flex items-center gap-1">
                        <Icon icon="lucide:plus" width={12} /> ADD_TAG
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {specs.map((spec, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input
                                value={spec.key}
                                onChange={(e) => updateSpec(i, 'key', e.target.value)}
                                placeholder="Key (e.g. genre)"
                                className="bg-black border border-zinc-800 p-2 text-xs text-white w-24 text-right font-mono text-[10px] uppercase text-zinc-500"
                            />
                            <div className="text-zinc-700">:</div>
                            <input
                                value={spec.value}
                                onChange={(e) => updateSpec(i, 'value', e.target.value)}
                                placeholder="Value..."
                                className="bg-black border border-zinc-800 p-2 text-xs text-white flex-1"
                            />
                            <button type="button" onClick={() => removeSpec(i)} className="text-rose-500 hover:text-rose-400">
                                <Icon icon="lucide:x" width={10} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Credits */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
                    <span className="text-xs font-black uppercase text-emerald-500">04 // CREDITS</span>
                    <button type="button" onClick={addCredit} className="text-[10px] uppercase font-bold text-emerald-500 hover:text-white flex items-center gap-1">
                        <Icon icon="lucide:plus" width={12} /> ADD_CREDIT
                    </button>
                </div>

                {credits.map((credit, i) => (
                    <div key={i} className="flex gap-2 items-center bg-zinc-900/30 p-2 rounded border border-zinc-800/50">
                        <select
                            value={credit.entityId}
                            onChange={(e) => updateCredit(i, 'entityId', e.target.value)}
                            className="bg-black border border-zinc-800 p-2 text-xs text-white flex-1"
                        >
                            <option value="">Select Entity...</option>
                            {entities.map(e => (
                                <option key={e.id} value={e.id}>{e.name} ({e.type})</option>
                            ))}
                        </select>
                        <input
                            value={credit.role}
                            onChange={(e) => updateCredit(i, 'role', e.target.value)}
                            placeholder="Role (e.g. Illustrator)"
                            className="bg-black border border-zinc-800 p-2 text-xs text-white w-1/3"
                        />
                        <button type="button" onClick={() => removeCredit(i)} className="p-2 text-rose-500">
                            <Icon icon="lucide:x" width={12} />
                        </button>
                    </div>
                ))}
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-rose-600 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-8 disabled:opacity-50">
                {isSubmitting ? 'INITIALIZING...' : 'REGISTER_FULL_ARTIFACT'}
            </button>
        </form>
    );
}
