
"use client"

import React from 'react';
import { Icon } from '@iconify/react';

interface Translation {
    locale: 'en' | 'id' | 'jp';
    title: string;
    description: string;
}

interface BasicInfoSectionProps {
    activeTab: string;
    setActiveTab: (tab: 'en' | 'id' | 'jp') => void;
    translations: Translation[];
    updateTrans: (locale: string, field: 'title' | 'description', value: string) => void;
    coverUrl: string;
    setCoverUrl: (url: string) => void;
    category: string;
    setCategory: (val: string) => void;
    status: string;
    setStatus: (val: string) => void;
    score: number;
    setScore: (val: number) => void;
    isVerified: boolean;
    setIsVerified: (val: boolean) => void;
    isMajor: boolean;
    setIsMajor: (val: boolean) => void;
    allowMirroring: boolean;
    setAllowMirroring: (val: boolean) => void;
}

export default function BasicInfoSection({
    activeTab,
    setActiveTab,
    translations,
    updateTrans,
    coverUrl,
    setCoverUrl,
    category,
    setCategory,
    status,
    setStatus,
    score,
    setScore,
    isVerified,
    setIsVerified,
    isMajor,
    setIsMajor,
    allowMirroring,
    setAllowMirroring
}: BasicInfoSectionProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">01 // Primary_Identification</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    {/* Language Tabs */}
                    <div className="flex gap-1 bg-zinc-950 p-1 rounded border border-zinc-900 w-fit">
                        {translations.map(t => (
                            <button
                                key={t.locale}
                                type="button"
                                onClick={() => setActiveTab(t.locale)}
                                className={`px-4 py-1.5 text-[10px] font-black uppercase transition-all ${activeTab === t.locale ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {t.locale}
                            </button>
                        ))}
                    </div>

                    {translations.map(t => (
                        <div key={t.locale} className={activeTab === t.locale ? 'space-y-6' : 'hidden'}>
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-500">Registry_Title</label>
                                <input
                                    value={t.title}
                                    onChange={(e) => updateTrans(t.locale, 'title', e.target.value)}
                                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-zinc-600 outline-none transition-colors"
                                    placeholder="Enter title..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-500">Detailed_Description</label>
                                <textarea
                                    value={t.description}
                                    onChange={(e) => updateTrans(t.locale, 'description', e.target.value)}
                                    rows={4}
                                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-zinc-600 outline-none resize-none transition-colors"
                                    placeholder="Enter description..."
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-4 space-y-4">
                    <div className="aspect-[3/4] bg-zinc-950 border border-zinc-900 rounded relative overflow-hidden group">
                        {coverUrl ? (
                            <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-800">
                                <Icon icon="lucide:image" width={32} />
                                <span className="text-[8px] uppercase mt-2 font-mono">No_Image_Asset</span>
                            </div>
                        )}
                        {isVerified && (
                            <div className="absolute top-2 right-2 bg-zinc-100 text-black p-1 rounded-sm shadow-lg">
                                <Icon icon="lucide:shield-check" width={14} />
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">Asset_URL (Cover)</label>
                        <input
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            className="w-full bg-black border border-zinc-800 p-2 text-[10px] text-zinc-300 focus:border-zinc-600 outline-none transition-colors font-mono"
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Lifecycle_Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-zinc-600 outline-none appearance-none"
                    >
                        <option value="music">MUSIC_TRACK</option>
                        <option value="anime">ANIME_FEATURE</option>
                        <option value="manga">MANGA_PUBLICATION</option>
                        <option value="software">SOFTWARE_SUITE</option>
                        <option value="merch">PHYSICAL_GOODS</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Registry_Status</label>
                    <div className="flex gap-1 bg-black border border-zinc-800 p-1 rounded-sm h-[46px]">
                        {[
                            { id: 'the_pit', label: 'DRAFT', color: 'bg-zinc-800' },
                            { id: 'back_alley', label: 'LIVE', color: 'bg-emerald-600' },
                            { id: 'archived', label: 'VOID', color: 'bg-rose-900' }
                        ].map(s => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => setStatus(s.id)}
                                className={`flex-1 text-[9px] font-black uppercase transition-all flex items-center justify-center ${status === s.id ? `${s.color} text-white shadow-inner` : 'text-zinc-600 hover:text-zinc-400'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Sort_Priority (Heat)</label>
                    <input
                        type="number"
                        value={score}
                        onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-zinc-600 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Flags_&_Attributes</label>
                    <div className="flex gap-2 h-[46px]">
                        <button
                            type="button"
                            onClick={() => setIsVerified(!isVerified)}
                            className={`flex-1 flex items-center justify-center gap-2 border transition-all ${isVerified ? 'bg-zinc-100 border-zinc-100 text-black' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                            title="Mark as Verified Content"
                        >
                            <Icon icon={isVerified ? "lucide:shield-check" : "lucide:shield"} width={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsMajor(!isMajor)}
                            className={`flex-1 flex items-center justify-center gap-2 border transition-all ${isMajor ? 'bg-rose-600 border-rose-600 text-white' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                            title="Mark as Major Label"
                        >
                            <Icon icon="lucide:star" width={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setAllowMirroring(!allowMirroring)}
                            className={`flex-1 flex items-center justify-center gap-2 border transition-all ${allowMirroring ? 'bg-violet-600 border-violet-600 text-white' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                            title="Allow R2 Proxy Mirroring"
                        >
                            <Icon icon="lucide:hard-drive-upload" width={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
