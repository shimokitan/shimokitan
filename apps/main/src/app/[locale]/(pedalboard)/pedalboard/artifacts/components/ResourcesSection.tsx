
"use client"

import React from 'react';
import { Icon } from '@iconify/react';

interface Resource {
    type: string;
    platform: string;
    url: string;
    isPrimary: boolean;
}

interface ResourcesSectionProps {
    resources: Resource[];
    setResources: (resources: Resource[]) => void;
    updateResource: (idx: number, field: keyof Resource, value: any) => void;
    addResource: () => void;
    removeResource: (idx: number) => void;
}

export default function ResourcesSection({
    resources,
    setResources,
    updateResource,
    addResource,
    removeResource
}: ResourcesSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">02 // Network_Gateways</span>
                <button
                    type="button"
                    onClick={addResource}
                    className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                    <Icon icon="lucide:plus" width={12} /> Add_Network
                </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {resources.map((res, i) => (
                    <div key={i} className="flex gap-2 items-center bg-zinc-950/50 p-2 rounded border border-zinc-900">
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
                            className="bg-black border border-zinc-800 p-2 text-[10px] font-mono uppercase text-zinc-400 w-24 outline-none"
                        >
                            <option value="mv">VIDEO</option>
                            <option value="stream">STREAM</option>
                            <option value="social">SOCIAL</option>
                            <option value="gallery">GALLERY</option>
                            <option value="store">STORE</option>
                            <option value="other">OTHER</option>
                        </select>

                        <select
                            value={res.platform}
                            onChange={(e) => updateResource(i, 'platform', e.target.value)}
                            className="bg-black border border-zinc-800 p-2 text-[10px] font-mono uppercase text-zinc-400 w-32 outline-none"
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
                                </>
                            )}
                            {res.type === 'social' && (
                                <>
                                    <option value="twitter">X_Twitter</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="threads">Threads</option>
                                </>
                            )}
                            {res.type === 'store' && (
                                <>
                                    <option value="booth">Booth</option>
                                    <option value="bandcamp">Bandcamp</option>
                                    <option value="steam">Steam</option>
                                </>
                            )}
                            {!['mv', 'stream', 'social', 'store'].includes(res.type) && (
                                <option value="other">General</option>
                            )}
                        </select>

                        <input
                            value={res.url}
                            onChange={(e) => updateResource(i, 'url', e.target.value)}
                            placeholder="Source URL..."
                            className="bg-black border border-zinc-800 p-2 text-xs text-white flex-1 outline-none focus:border-zinc-700 transition-colors"
                        />

                        <button
                            type="button"
                            onClick={() => updateResource(i, 'isPrimary', !res.isPrimary)}
                            className={`p-2 border transition-colors ${res.isPrimary ? 'bg-amber-500 border-amber-500 text-black' : 'bg-transparent border-zinc-800 text-zinc-600 hover:text-zinc-400'}`}
                            title="Set as Primary Source"
                        >
                            <Icon icon="lucide:star" width={12} />
                        </button>
                        <button
                            type="button"
                            onClick={() => removeResource(i)}
                            className="p-2 text-zinc-600 hover:text-rose-500 transition-colors"
                        >
                            <Icon icon="lucide:x" width={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
