"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { createFullArtifact, updateFullArtifact } from '../actions';
import { useRouter } from 'next/navigation';
import { extractMediaId, getThumbnailUrl, _ } from '@shimokitan/utils';

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

export default function ArtifactForm({ entities, initialData }: { entities: Entity[], initialData?: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic Lists
    const [resources, setResources] = useState<Resource[]>(
        initialData?.resources
            ? initialData.resources.map((r: any) => ({ type: r.type, platform: r.platform, url: r.url, isPrimary: r.isPrimary }))
            : [{ type: 'other', platform: 'other', url: '', isPrimary: false }]
    );
    const [credits, setCredits] = useState<Credit[]>(
        initialData?.credits
            ? initialData.credits.map((c: any) => ({ entityId: c.entityId, role: c.role }))
            : []
    );
    const [specs, setSpecs] = useState<Spec[]>(
        initialData?.specs
            ? Object.entries(initialData.specs).map(([key, value]) => ({ key, value: value as string }))
            : [{ key: 'genre', value: '' }]
    );
    const [tags, setTags] = useState<{ id?: string, name: string }[]>(
        initialData?.tags
            ? initialData.tags.map((t: any) => ({
                id: t.tag.id,
                name: t.tag.translations?.[0]?.name || 'Unknown'
            }))
            : []
    );
    const [coverUrl, setCoverUrl] = useState(initialData?.coverImage || '');
    const [isMajor, setIsMajor] = useState(initialData?.isMajor || false);
    const [isVerified, setIsVerified] = useState(initialData?.isVerified || false);
    const [allowMirroring, setAllowMirroring] = useState(initialData?.allowMirroring || false);


    const addResource = () => setResources([...resources, { type: 'other', platform: 'other', url: '', isPrimary: false }]);
    const removeResource = (idx: number) => setResources(resources.filter((_, i) => i !== idx));
    const updateResource = (idx: number, field: keyof Resource, value: any) => {
        const newResources = [...resources];
        if (field === 'isPrimary' && value === true) {
            newResources.forEach(r => r.isPrimary = false);
        }
        newResources[idx] = { ...newResources[idx], [field]: value };

        if (field === 'url' && (!coverUrl || coverUrl.includes('img.youtube.com'))) {
            const platform = newResources[idx].platform;
            const id = extractMediaId(value, platform);
            const thumb = getThumbnailUrl(id, platform);
            if (thumb) setCoverUrl(thumb);
        }

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

    const addTag = () => setTags([...tags, { name: '' }]);
    const removeTag = (idx: number) => setTags(tags.filter((_, i) => i !== idx));
    const updateTag = (idx: number, field: 'name', value: string) => {
        const newTags = [...tags];
        newTags[idx] = { ...newTags[idx], [field]: value };
        setTags(newTags);
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            const cleanResources = resources.filter(r => r.url.trim() !== '');
            const cleanCredits = credits.filter(c => c.entityId.trim() !== '');
            const cleanSpecs = specs.reduce((acc, curr) => {
                if (curr.key.trim()) acc[curr.key] = curr.value;
                return acc;
            }, {} as Record<string, string>);
            const cleanTags = tags.filter(t => t.name.trim() !== '');

            const payload = {
                title: formData.get('title') as string,
                category: formData.get('category') as string,
                description: formData.get('description') as string,
                coverImage: coverUrl,
                status: formData.get('status') as string,
                score: parseInt(formData.get('score') as string) || 0,
                isMajor: isMajor,
                isVerified: isVerified,
                allowMirroring: allowMirroring,
                resources: cleanResources,
                credits: cleanCredits,
                specs: cleanSpecs,
                tags: cleanTags
            };

            if (initialData?.id) {
                await updateFullArtifact(initialData.id, payload);
                alert('Artifact Updated!');
            } else {
                await createFullArtifact(payload);
                alert('Artifact Created!');
            }

            router.refresh();
            if (initialData?.id) router.push('/admin/artifacts');
        } catch (e) {
            console.error(e);
            alert(`Failed to ${initialData?.id ? 'update' : 'create'} artifact`);
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-400">Title</label>
                                <input
                                    name="title"
                                    defaultValue={initialData?.translations?.[0]?.title || initialData?.title}
                                    required
                                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none transition-colors"
                                    placeholder="Artifact Title"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Description</label>
                            <textarea
                                name="description"
                                defaultValue={initialData?.translations?.[0]?.description || initialData?.description}
                                rows={4}
                                className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none resize-none transition-colors"
                                placeholder="Brief description..."
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Visual_Manifest (Preview)</label>
                        <div className="aspect-video lg:aspect-square bg-zinc-950 border border-zinc-800 rounded relative overflow-hidden group">
                            {coverUrl ? (
                                <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-800">
                                    <Icon icon="lucide:image" width={32} />
                                    <span className="text-[8px] uppercase mt-2 font-mono">No_Data</span>
                                </div>
                            )}
                            <div className="absolute inset-0 scanline pointer-events-none opacity-20" />
                            <div className="absolute inset-0 noise pointer-events-none opacity-10" />

                            {/* Verified Badge Preview */}
                            {isVerified && (
                                <div className="absolute top-2 right-2 bg-rose-600 text-black p-1">
                                    <Icon icon="lucide:shield-check" width={16} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Category</label>
                        <select name="category" defaultValue={initialData?.category} required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none">
                            <option value="music">MUSIC</option>
                            <option value="anime">ANIME</option>
                            <option value="vtuber">VTUBER</option>
                            <option value="asmr">ASMR</option>
                            <option value="zine">ZINE</option>
                            <option value="art">ART</option>
                            <option value="game">GAME</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Verification & Identity</label>
                        <div className="grid grid-cols-3 gap-2 h-[46px]">
                            <div
                                className={`flex items-center justify-center gap-2 border cursor-pointer transition-all ${isVerified ? 'bg-rose-600 border-rose-500 text-black' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-rose-900'}`}
                                onClick={() => setIsVerified(!isVerified)}
                            >
                                <Icon icon={isVerified ? "lucide:shield-check" : "lucide:shield"} width={14} />
                                <span className="text-[10px] font-black uppercase">Verified</span>
                            </div>
                            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-4 h-full group cursor-pointer" onClick={() => setIsMajor(!isMajor)}>
                                <div className={`w-3 h-3 border ${isMajor ? 'bg-rose-600 border-rose-500' : 'bg-transparent border-zinc-700'} transition-colors`} />
                                <span className={`text-[10px] font-mono uppercase ${isMajor ? 'text-white' : 'text-zinc-500'}`}>Major_Label</span>
                            </div>
                            <div
                                className={`flex items-center gap-3 border px-4 h-full group transition-all ${isMajor ? 'bg-zinc-900 border-zinc-800 cursor-not-allowed opacity-50' : 'bg-zinc-950 border-zinc-800 cursor-pointer'}`}
                                onClick={() => !isMajor && setAllowMirroring(!allowMirroring)}
                            >
                                <div className={`w-3 h-3 border ${allowMirroring && !isMajor ? 'bg-rose-600 border-rose-500' : 'bg-transparent border-zinc-700'} transition-colors`} />
                                <span className={`text-[10px] font-mono uppercase ${allowMirroring && !isMajor ? 'text-white' : 'text-zinc-500'}`}>Mirror_Clearance</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Cover_URL</label>
                        <input
                            name="coverImage"
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            className="bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none w-full"
                            placeholder="https://..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Status</label>
                            <select name="status" defaultValue={initialData?.status} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none">
                                <option value="back_alley">BACK_ALLEY</option>
                                <option value="the_pit">THE_PIT</option>
                                <option value="archived">ARCHIVED</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Heat_Index</label>
                            <input name="score" type="number" defaultValue={initialData?.score || 0} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-rose-600 outline-none" />
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

            {/* 3. Specs & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Specs */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
                        <span className="text-xs font-black uppercase text-amber-500">03A // VIBE_SPECS</span>
                        <button type="button" onClick={addSpec} className="text-[10px] uppercase font-bold text-amber-500 hover:text-white flex items-center gap-1">
                            <Icon icon="lucide:plus" width={12} /> ADD_SPEC
                        </button>
                    </div>

                    <div className="space-y-2">
                        {specs.map((spec, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    value={spec.key}
                                    onChange={(e) => updateSpec(i, 'key', e.target.value)}
                                    placeholder="Key"
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

                {/* Tags */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-4">
                        <span className="text-xs font-black uppercase text-pink-500">03B // TAGS (Genres/Identity)</span>
                        <button type="button" onClick={addTag} className="text-[10px] uppercase font-bold text-pink-500 hover:text-white flex items-center gap-1">
                            <Icon icon="lucide:plus" width={12} /> ADD_TAG
                        </button>
                    </div>

                    <div className="space-y-2">
                        {tags.map((tag, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    value={tag.name}
                                    onChange={(e) => updateTag(i, 'name', e.target.value)}
                                    placeholder="Tag Name (e.g. Future Funk)"
                                    className="bg-black border border-zinc-800 p-2 text-xs text-white flex-1"
                                />
                                <button type="button" onClick={() => removeTag(i)} className="text-rose-500 hover:text-rose-400">
                                    <Icon icon="lucide:x" width={10} />
                                </button>
                            </div>
                        ))}
                    </div>
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
                    <div key={i} className="flex gap-2 items-center bg-zinc-950/30 p-2 rounded border border-zinc-800/50">
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
                {isSubmitting ? 'INITIALIZING...' : initialData?.id ? 'UPDATE_ARTIFACT_CORE' : 'REGISTER_FULL_ARTIFACT'}
            </button>
        </form>
    );
}
