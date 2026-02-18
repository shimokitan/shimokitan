
"use client"

import React from 'react';
import { Icon } from '@iconify/react';

import CategoryPresets from './CategoryPresets';

interface Spec {
    key: string;
    value: string;
}

interface Tag {
    id?: string;
    name: string;
}

interface MetadataSectionProps {
    category: string;
    specs: Spec[];
    updateSpec: (idx: number, field: keyof Spec, value: string) => void;
    upsertSpec: (key: string, value: string) => void;
    addSpec: () => void;
    removeSpec: (idx: number) => void;
    tags: Tag[];
    updateTag: (idx: number, field: 'name', value: string) => void;
    addTag: () => void;
    removeTag: (idx: number) => void;
}

export default function MetadataSection({
    category,
    specs,
    updateSpec,
    upsertSpec,
    addSpec,
    removeSpec,
    tags,
    updateTag,
    addTag,
    removeTag
}: MetadataSectionProps) {
    return (
        <div className="space-y-8">
            <CategoryPresets
                category={category}
                specs={specs}
                updateSpec={updateSpec}
                upsertSpec={upsertSpec}
                addSpec={addSpec}
                removeSpec={removeSpec}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Specs / Attributes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">03A // Core_Attributes</span>
                        <button
                            type="button"
                            onClick={addSpec}
                            className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <Icon icon="lucide:plus" width={12} /> Add_Spec
                        </button>
                    </div>

                    <div className="space-y-2">
                        {specs.map((spec, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input
                                    value={spec.key}
                                    onChange={(e) => updateSpec(i, 'key', e.target.value)}
                                    placeholder="Key..."
                                    className="bg-black border border-zinc-800 p-2 text-[10px] font-mono uppercase text-zinc-500 w-28 text-right outline-none focus:border-zinc-700"
                                />
                                <div className="text-zinc-800">:</div>
                                <input
                                    value={spec.value}
                                    onChange={(e) => updateSpec(i, 'value', e.target.value)}
                                    placeholder="Value..."
                                    className="bg-black border border-zinc-800 p-2 text-xs text-zinc-300 flex-1 outline-none focus:border-zinc-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSpec(i)}
                                    className="text-zinc-700 hover:text-rose-500 transition-colors"
                                >
                                    <Icon icon="lucide:x" width={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags / Taxonomy */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">03B // Global_Taxonomy</span>
                        <button
                            type="button"
                            onClick={addTag}
                            className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <Icon icon="lucide:plus" width={12} /> Add_Tag
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {tags.map((tag, i) => (
                            <div key={i} className="flex gap-2 items-center bg-zinc-950/30 border border-zinc-900 p-1 rounded">
                                <input
                                    value={tag.name}
                                    onChange={(e) => updateTag(i, 'name', e.target.value)}
                                    placeholder="Tag name..."
                                    className="bg-transparent p-1.5 text-[10px] font-mono text-zinc-300 flex-1 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeTag(i)}
                                    className="text-zinc-700 hover:text-rose-500 transition-colors pr-1"
                                >
                                    <Icon icon="lucide:x" width={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
