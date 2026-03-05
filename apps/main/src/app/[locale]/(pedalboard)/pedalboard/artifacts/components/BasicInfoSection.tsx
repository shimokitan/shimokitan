
"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import { MediaUploader } from '@shimokitan/ui';
import { uploadMediaAction } from '../../media-actions';

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
    coverId: string | null;
    setCoverId: (id: string | null) => void;
    coverUrl: string;
    setCoverUrl: (url: string) => void;
    onCoverFileSelect?: (file: File, objectUrl: string) => void;
    onCoverUrlSelect?: (url: string) => void;

    posterId: string | null;
    setPosterId: (id: string | null) => void;
    posterUrl: string;
    setPosterUrl: (url: string) => void;
    onPosterFileSelect?: (file: File, objectUrl: string) => void;
    onPosterUrlSelect?: (url: string) => void;

    category: string;

    setCategory: (val: string) => void;
    userRole?: string;
    status: string;
    setStatus: (val: string) => void;
    score: number;
    setScore: (val: number) => void;
    isVerified: boolean;
    setIsVerified: (val: boolean) => void;
    isMajor: boolean;
    setIsMajor: (val: boolean) => void;
    lockFlags?: boolean;
}

export default function BasicInfoSection({
    activeTab,
    setActiveTab,
    translations,
    updateTrans,
    coverId,
    setCoverId,
    coverUrl,
    setCoverUrl,
    onCoverFileSelect,
    onCoverUrlSelect,
    posterId,
    setPosterId,
    posterUrl,
    setPosterUrl,
    onPosterFileSelect,
    onPosterUrlSelect,
    category,

    setCategory,
    userRole,
    status,
    setStatus,
    score,
    setScore,
    isVerified,
    setIsVerified,
    isMajor,
    setIsMajor,
    lockFlags = false
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

                <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">Artifact_Cover (Editorial)</label>
                        <div className="w-full aspect-square md:aspect-video flex">
                            <MediaUploader
                                value={coverUrl}
                                contextType="artifact_asset"
                                onFileSelect={onCoverFileSelect}
                                onUrlSelect={onCoverUrlSelect}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">Poster_Cover (Official KV)</label>
                        <div className="w-full aspect-[2/3] flex">
                            <MediaUploader
                                value={posterUrl}
                                contextType="artifact_asset"
                                onFileSelect={onPosterFileSelect}
                                onUrlSelect={onPosterUrlSelect}
                            />
                        </div>
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
                        {userRole === 'founder' && <option value="anime">ANIME_FEATURE</option>}
                        {/* Phase 1: Focused Launch (Anime & Music Only) */}
                        {/* <option value="manga">MANGA_PUBLICATION</option>
                        <option value="software">SOFTWARE_SUITE</option>
                        <option value="merch">PHYSICAL_GOODS</option> */}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Registry_Status</label>
                    <div className="flex gap-1 bg-black border border-zinc-800 p-1 rounded-sm h-[46px]">
                        {[
                            { id: 'the_pit', label: 'IN THE PIT (FEATURED)', color: 'bg-rose-600' },
                            { id: 'back_alley', label: 'LIVE', color: 'bg-emerald-600' },
                            { id: 'archived', label: 'VOID', color: 'bg-zinc-800' }
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
                            onClick={() => !lockFlags && setIsVerified(!isVerified)}
                            className={`flex-1 flex items-center justify-center gap-2 border transition-all ${isVerified ? 'bg-zinc-100 border-zinc-100 text-black' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'} ${lockFlags ? 'cursor-not-allowed opacity-80' : ''}`}
                            title={lockFlags ? "Verified via Protocol Proof" : "Mark as Verified Content"}
                            disabled={lockFlags}
                        >
                            <Icon icon={isVerified ? "lucide:shield-check" : "lucide:shield"} width={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => !lockFlags && setIsMajor(!isMajor)}
                            className={`flex-1 flex items-center justify-center gap-2 border transition-all ${isMajor ? 'bg-rose-600 border-rose-600 text-white' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700'} ${lockFlags ? 'cursor-not-allowed opacity-40' : ''}`}
                            title={lockFlags ? "Major Signal Restricted" : "Mark as Major Label"}
                            disabled={lockFlags}
                        >
                            <Icon icon="lucide:star" width={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
