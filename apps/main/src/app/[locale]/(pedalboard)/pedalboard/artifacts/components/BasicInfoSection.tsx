"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import { MediaUploader } from '@shimokitan/ui';
import { uploadMediaAction } from '../../media-actions';
import ArtifactSearchPicker from './ArtifactSearchPicker';

interface Translation {
    locale: 'en' | 'id' | 'ja';
    title: string;
    description: string;
}

interface BasicInfoSectionProps {
    activeTab: string;
    setActiveTab: (tab: 'en' | 'id' | 'ja') => void;
    translations: Translation[];
    updateTrans: (locale: string, field: 'title' | 'description', value: string) => void;
    thumbnailId: string | null;
    setThumbnailId: (id: string | null) => void;
    thumbnailUrl: string;
    setThumbnailUrl: (url: string) => void;
    onThumbnailFileSelect?: (file: File, objectUrl: string) => void;
    onThumbnailUrlSelect?: (url: string) => void;

    posterId: string | null;
    setPosterId: (id: string | null) => void;
    posterUrl: string;
    setPosterUrl: (url: string) => void;
    onPosterFileSelect?: (file: File, objectUrl: string) => void;
    onPosterUrlSelect?: (url: string) => void;

    category: string;
    setCategory: (val: string) => void;

    nature: string;
    setNature: (val: string) => void;
    sourceArtifactId: string | null;
    setSourceArtifactId: (val: string | null) => void;
    animeType: string | null;
    setAnimeType: (val: string | null) => void;
    hostingStatus: string;
    setHostingStatus: (val: string) => void;
    sourceArtifactTitle?: string | null;

    entities: any[];
    userRole?: string;
    status: string;
    setStatus: (val: string) => void;
    score: number;
    setScore: (val: number) => void;
    resonance: number;
    setResonance: (val: number) => void;
    isVerified: boolean;
    setIsVerified: (val: boolean) => void;

    lockFlags?: boolean;
}

export default function BasicInfoSection({
    activeTab,
    setActiveTab,
    translations,
    updateTrans,
    thumbnailId,
    setThumbnailId,
    thumbnailUrl,
    setThumbnailUrl,
    onThumbnailFileSelect,
    onThumbnailUrlSelect,
    posterId,
    setPosterId,
    posterUrl,
    setPosterUrl,
    onPosterFileSelect,
    onPosterUrlSelect,
    category,
    setCategory,

    nature,
    setNature,
    sourceArtifactId,
    setSourceArtifactId,
    animeType,
    setAnimeType,
    hostingStatus,
    setHostingStatus,
    sourceArtifactTitle,

    entities,
    userRole,
    status,
    setStatus,
    score,
    setScore,
    resonance,
    setResonance,
    isVerified,
    setIsVerified,

    lockFlags = false
}: BasicInfoSectionProps) {

    return (
        <div className="space-y-12">
            {/* 01. REGISTRY & VISUALS */}
            <div className="space-y-8">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">01 // REGISTRY_&_VISUALS</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Column 1: System Meta */}
                    <div className="space-y-4 bg-zinc-950/50 p-6 border border-zinc-900 rounded-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4 italic">System_Meta</h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-500">Category_Signal</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:border-rose-600 outline-none rounded-lg"
                                >
                                    <option value="music">MUSIC_TRACK</option>
                                    <option value="anime">ANIME_FEATURE</option>
                                    <option value="software">SOFTWARE_UNIT</option>
                                    <option value="zine">ZINE_RECORD</option>
                                    <option value="event">EVENT_LOG</option>
                                    <option value="other">OTHER_SIGNAL</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-500">Artifact_Nature</label>
                                <select
                                    value={nature}
                                    onChange={(e) => setNature(e.target.value)}
                                    className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:border-rose-600 outline-none rounded-lg"
                                >
                                    <option value="original">ORIGINAL_SOURCE</option>
                                    <option value="cover">COVER_VERSION</option>
                                    <option value="remix">REMIX_VARIANT</option>
                                    <option value="live">LIVE_CAPTURE</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-500">Visibility_State</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:border-rose-600 outline-none rounded-lg"
                                >
                                    <option value="the_pit">PIT (HIDDEN)</option>
                                    <option value="back_alley">LIVE (PUBLIC)</option>
                                    <option value="archived">VOID_SPACE</option>
                                </select>
                            </div>

                            {category === 'music' && (
                                <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                                    <label className="text-[10px] font-mono uppercase text-zinc-500 text-violet-400">Hosting_Status</label>
                                    <select
                                        value={hostingStatus}
                                        onChange={(e) => setHostingStatus(e.target.value)}
                                        className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:border-violet-600 outline-none rounded-lg"
                                    >
                                        <option value="unhosted">UNHOSTED (EXTERNAL)</option>
                                        <option value="hosted">HOSTED (INTERNAL)</option>
                                    </select>
                                </div>
                            )}

                            {category === 'anime' && (
                                <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                                    <label className="text-[10px] font-mono uppercase text-zinc-500 text-amber-500">Visual_Context</label>
                                    <select
                                        value={animeType ?? ''}
                                        onChange={(e) => setAnimeType(e.target.value || null)}
                                        className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:border-amber-600 outline-none rounded-lg"
                                    >
                                        <option value="">UNCATEGORIZED</option>
                                        <option value="pv">PROMOTIONAL_VIDEO</option>
                                        <option value="mv">MUSIC_VIDEO</option>
                                        <option value="trailer">TRAILER</option>
                                        <option value="op">OPENING</option>
                                        <option value="ed">ENDING</option>
                                        <option value="special">SPECIAL_STMT</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Integrity Metrics */}
                    <div className="space-y-4 bg-zinc-950/50 p-6 border border-zinc-900 rounded-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-4 italic">Integrity_Metrics</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-zinc-500">
                                    <span>Sync_Quality</span>
                                    <span className="text-rose-500">{score}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={score}
                                    onChange={(e) => setScore(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-900 appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-zinc-500">
                                    <span>Lore_Resonance</span>
                                    <span className="text-emerald-500">{resonance} RP</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    step="10"
                                    value={resonance}
                                    onChange={(e) => setResonance(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-zinc-900 appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => !lockFlags && setIsVerified(!isVerified)}
                                    className={`w-full h-12 flex items-center justify-center gap-3 border transition-all rounded-xl ${isVerified ? 'bg-rose-600 border-rose-500 text-black shadow-[0_0_20px_rgba(225,29,72,0.2)]' : 'bg-black border-zinc-800 text-zinc-500 hover:border-rose-900'}`}
                                >
                                    <Icon icon={isVerified ? "lucide:shield-check" : "lucide:shield"} width={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol_Verify</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Column 3-4: Visual Branding */}
                    <div className="lg:col-span-2 bg-zinc-950/50 p-6 border border-zinc-900 rounded-xl space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic mb-4">Visual_Branding</h3>
                        <div className="grid grid-cols-12 gap-6 h-full min-h-[160px]">
                            <div className="col-span-4 space-y-2">
                                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">Poster_KV (2:3)</label>
                                <MediaUploader
                                    value={posterUrl}
                                    contextType="artifact_asset"
                                    onFileSelect={onPosterFileSelect}
                                    onUrlSelect={onPosterUrlSelect}
                                    className="aspect-[2/3] rounded-lg border border-zinc-900 overflow-hidden shadow-inner w-full"
                                />
                            </div>
                            <div className="col-span-8 space-y-2">
                                <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">Editorial_Thumb (16:9)</label>
                                <MediaUploader
                                    value={thumbnailUrl}
                                    contextType="artifact_asset"
                                    onFileSelect={onThumbnailFileSelect}
                                    onUrlSelect={onThumbnailUrlSelect}
                                    className="aspect-[16/9] rounded-lg border border-zinc-900 overflow-hidden shadow-inner w-full"
                                />
                                <p className="text-[8px] text-zinc-700 font-mono italic mt-2 uppercase tracking-tighter">Aesthetic_Synchronization_Required.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 02. LOCALIZATION MATRIX */}
            <div className="w-full pt-8 border-t border-zinc-900">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">02 // LOCALIZATION_MATRIX</span>
                </div>
                <div className="flex flex-col bg-zinc-950 p-6 border border-zinc-900 rounded-xl">
                    <div className="flex items-center justify-between mb-8 border-b border-zinc-900/50 pb-6">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500 italic">I18n_Signal_Localization</h3>
                            <p className="text-[9px] text-zinc-600 font-mono italic">DATA_REPLICATION_ACROSS_LOCATIONS.</p>
                        </div>
                        <div className="flex gap-1 bg-black p-1 rounded-lg border border-zinc-900">
                            {translations.map(t => (
                                <button
                                    key={t.locale}
                                    type="button"
                                    onClick={() => setActiveTab(t.locale)}
                                    className={`px-6 py-2 text-[10px] font-black uppercase transition-all rounded-md ${activeTab === t.locale ? 'bg-rose-600 text-black' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    {t.locale}
                                </button>
                            ))}
                        </div>
                    </div>

                    {translations.map(t => (
                        <div key={t.locale} className={activeTab === t.locale ? 'space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500' : 'hidden'}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase text-zinc-400 pl-1">Primary_Identifier ({t.locale})</label>
                                <input
                                    value={t.title}
                                    onChange={(e) => updateTrans(t.locale, 'title', e.target.value)}
                                    className="w-full bg-black border border-zinc-800 p-4 text-sm text-white focus:border-rose-600 outline-none transition-all rounded-lg font-bold"
                                    placeholder={`Artifact title in ${t.locale.toUpperCase()}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase text-zinc-400 pl-1">Detailed_Context ({t.locale})</label>
                                <textarea
                                    value={t.description}
                                    onChange={(e) => updateTrans(t.locale, 'description', e.target.value)}
                                    rows={6}
                                    className="w-full bg-black border border-zinc-800 p-4 text-sm text-white focus:border-rose-600 outline-none transition-all rounded-lg resize-none leading-relaxed"
                                    placeholder="Manifesto details / artifact historical context..."
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* derivation picker if not original */}
            {nature !== 'original' && (
                <div className="bg-rose-950/5 border border-rose-900/20 p-6 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <ArtifactSearchPicker
                        label="DERIVATION_SOURCE"
                        value={sourceArtifactId}
                        initialTitle={sourceArtifactTitle}
                        onSelect={(art) => setSourceArtifactId(art?.id || null)}
                        placeholder="Link this entry to its original source record..."
                    />
                </div>
            )}
        </div>
    );
}
