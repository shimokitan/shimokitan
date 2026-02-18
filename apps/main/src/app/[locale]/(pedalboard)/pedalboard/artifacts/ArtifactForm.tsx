
"use client"

import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { extractMediaId, getThumbnailUrl } from '@shimokitan/utils';
import { createFullArtifact, updateFullArtifact } from '../actions';
import { toast } from 'sonner';

import AnilistSync from './components/AnilistSync';
import BasicInfoSection from './components/BasicInfoSection';
import ResourcesSection from './components/ResourcesSection';
import MetadataSection from './components/MetadataSection';
import CreditsSection from './components/CreditsSection';

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

export default function ArtifactForm({ entities, initialData, onComplete }: { entities: Entity[], initialData?: any, onComplete?: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const anilistId = searchParams.get('anilist_id');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'id' | 'jp'>('en');

    // --- Keyboard Shortcuts ---
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- State Management ---
    const [translations, setTranslations] = useState(
        ['en', 'id', 'jp'].map(lang => {
            const trans = initialData?.translations?.find((t: any) => t.locale === lang);
            return {
                locale: lang as 'en' | 'id' | 'jp',
                title: trans?.title || '',
                description: trans?.description || ''
            };
        })
    );

    const [resources, setResources] = useState<Resource[]>(
        initialData?.resources
            ? initialData.resources.map((r: any) => ({ type: r.type, platform: r.platform, url: r.value, isPrimary: r.isPrimary }))
            : [{ type: 'mv', platform: 'youtube', url: '', isPrimary: false }]
    );
    const [credits, setCredits] = useState<Credit[]>(
        initialData?.credits
            ? initialData.credits.map((c: any) => ({ entityId: c.entityId, role: c.role }))
            : []
    );
    const [specs, setSpecs] = useState<Spec[]>(
        initialData?.specs
            ? Object.entries(initialData.specs).map(([key, value]) => ({ key, value: value as string }))
            : []
    );
    const [tags, setTags] = useState<{ id?: string, name: string }[]>(
        initialData?.tags
            ? initialData.tags.map((t: any) => ({ id: (t.tag as any).id, name: (t.tag as any).translations?.[0]?.name || 'Unknown' }))
            : []
    );

    const [coverUrl, setCoverUrl] = useState(initialData?.coverImage || '');
    const [category, setCategory] = useState(initialData?.category || (anilistId ? 'anime' : 'music'));
    const [status, setStatus] = useState(initialData?.status || 'the_pit');
    const [score, setScore] = useState(initialData?.score || 0);
    const [isMajor, setIsMajor] = useState(initialData?.isMajor || false);
    const [isVerified, setIsVerified] = useState(initialData?.isVerified || false);
    const [allowMirroring, setAllowMirroring] = useState(initialData?.allowMirroring || false);

    // --- Handlers ---
    const updateTrans = (locale: string, field: 'title' | 'description', value: string) => {
        setTranslations(translations.map(t => t.locale === locale ? { ...t, [field]: value } : t));
    };

    const handleAnilistSync = useCallback((data: any) => {
        if (!data) return;

        setCategory('anime');

        // Sync Titles
        setTranslations(prev => prev.map(t => {
            if (t.locale === 'en') return { ...t, title: data.title.english || data.title.romaji };
            if (t.locale === 'jp') return { ...t, title: data.title.native };
            return t;
        }));

        // Sync Metadata (Specs)
        const newSpecs: Spec[] = [
            { key: 'anilist_id', value: String(data.id) },
            { key: 'format', value: data.format },
            { key: 'season', value: `${data.season} ${data.seasonYear}` },
            { key: 'episodes', value: String(data.episodes) },
            { key: 'status', value: data.status }
        ];
        setSpecs(newSpecs);

        // Sync Tags (Genres)
        if (data.genres) {
            setTags(data.genres.map((g: string) => ({ name: g })));
        }

        // Sync Image
        if (data.coverImage?.extraLarge) {
            setCoverUrl(data.coverImage.extraLarge);
        }

        toast.success(`Synced metadata for: ${data.title.english || data.title.romaji}`);
    }, []);

    const addResource = () => setResources([...resources, { type: 'mv', platform: 'youtube', url: '', isPrimary: false }]);
    const removeResource = (idx: number) => setResources(resources.filter((_, i) => i !== idx));
    const updateResource = (idx: number, field: keyof Resource, value: any) => {
        const newResources = [...resources];
        if (field === 'isPrimary' && value === true) newResources.forEach(r => r.isPrimary = false);
        newResources[idx] = { ...newResources[idx], [field]: value };

        if (field === 'url' && (!coverUrl || coverUrl.includes('img.youtube.com'))) {
            const id = extractMediaId(value, newResources[idx].platform);
            const thumb = getThumbnailUrl(id, newResources[idx].platform);
            if (thumb) setCoverUrl(thumb);
        }
        setResources(newResources);
    };

    const addCredit = () => setCredits([...credits, { entityId: '', role: '' }]);
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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
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
                category,
                coverImage: coverUrl,
                status,
                score,
                isMajor,
                isVerified,
                allowMirroring,
                resources: cleanResources,
                credits: cleanCredits,
                specs: cleanSpecs,
                tags: cleanTags,
                translations: translations.filter(t => t.title.trim() !== '')
            };

            if (initialData?.id) {
                await updateFullArtifact(initialData.id, payload as any);
                toast.success('System: Artifact Registry Updated');
            } else {
                await createFullArtifact(payload as any);
                toast.success('System: New Artifact Registered');
            }

            if (onComplete) {
                onComplete();
            } else {
                router.refresh();
                if (initialData?.id) router.push('/pedalboard/artifacts');
            }
        } catch (e) {
            console.error(e);
            toast.error('System_Failure: Operation Terminated');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Context Awareness Section */}
            {category === 'anime' && !initialData?.id && (
                <AnilistSync onSync={handleAnilistSync} initialIdentifier={anilistId} />
            )}

            <BasicInfoSection
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                translations={translations}
                updateTrans={updateTrans}
                coverUrl={coverUrl}
                setCoverUrl={setCoverUrl}
                category={category}
                setCategory={setCategory}
                status={status}
                setStatus={setStatus}
                score={score}
                setScore={setScore}
                isVerified={isVerified}
                setIsVerified={setIsVerified}
                isMajor={isMajor}
                setIsMajor={setIsMajor}
                allowMirroring={allowMirroring}
                setAllowMirroring={setAllowMirroring}
            />

            <ResourcesSection
                resources={resources}
                setResources={setResources}
                updateResource={updateResource}
                addResource={addResource}
                removeResource={removeResource}
            />

            <MetadataSection
                category={category}
                specs={specs}
                updateSpec={updateSpec}
                addSpec={addSpec}
                removeSpec={removeSpec}
                tags={tags}
                updateTag={updateTag}
                addTag={addTag}
                removeTag={removeTag}
            />

            <CreditsSection
                entities={entities}
                credits={credits}
                updateCredit={updateCredit}
                addCredit={addCredit}
                removeCredit={removeCredit}
            />

            <div className="pt-8 border-t border-zinc-900 sticky bottom-0 bg-black/80 backdrop-blur-md pb-4 z-10">
                <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500">
                            <span className="bg-zinc-900 px-1 rounded text-zinc-400">CTRL</span>
                            <span className="bg-zinc-900 px-1 rounded text-zinc-400">S</span>
                            <span>COMMIT</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500">
                            <span className="bg-zinc-900 px-1 rounded text-zinc-400">ESC</span>
                            <span>CANCEL</span>
                        </div>
                    </div>
                </div>
                <button
                    disabled={isSubmitting}
                    className="w-full py-4 bg-white text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                    {isSubmitting ? 'PROCESSING_REQUEST...' : initialData?.id ? 'COMMIT_REGISTRY_CHANGES' : 'REGISTER_NEW_ARTIFACT'}
                </button>
            </div>
        </form>
    );
}
