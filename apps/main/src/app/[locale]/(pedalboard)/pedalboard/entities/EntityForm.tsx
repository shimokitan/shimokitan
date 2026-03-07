
"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { createFullEntity, updateFullEntity } from '../actions';
import { useRouter } from 'next/navigation';
import EntitySearchPicker from '../artifacts/components/EntitySearchPicker';
import { MediaUploader } from '@shimokitan/ui';
import { uploadMediaAction } from '../media-actions';

type SocialLink = {
    platform: string;
    url: string;
};

type Member = {
    memberId: string;
    memberRole: string;
};

export default function EntityForm({
    initialData,
    entities = []
}: {
    initialData?: any,
    entities?: { id: string, name: string, type: string }[]
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'id' | 'ja'>('en');

    // Multi-Language State
    const [translations, setTranslations] = useState(
        ['en', 'id', 'ja'].map(lang => {
            const trans = initialData?.translations?.find((t: any) => t.locale === lang);
            return {
                locale: lang as 'en' | 'id' | 'ja',
                name: trans?.name || '',
                bio: trans?.bio || ''
            };
        })
    );

    const [circuit, setCircuit] = useState(initialData?.circuit || 'underground');
    const [isVerified, setIsVerified] = useState(initialData?.isVerified || false);

    const [type, setType] = useState(initialData?.type || 'individual');
    const [members, setMembers] = useState<Member[]>(
        initialData?.members?.map((m: any) => ({ memberId: m.memberId, memberRole: m.memberRole })) || []
    );

    // Dynamic List
    const [socials, setSocials] = useState<SocialLink[]>(
        initialData?.socialLinks
            ? (Array.isArray(initialData.socialLinks)
                ? initialData.socialLinks
                : Object.entries(initialData.socialLinks).map(([platform, url]) => ({ platform, url: url as string })))
            : [{ platform: 'twitter', url: '' }]
    );

    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialData?.avatarUrl || null);
    const [avatarId, setAvatarId] = useState<string | null>(initialData?.avatarId || null);

    const updateTrans = (locale: string, field: 'name' | 'bio', value: string) => {
        setTranslations(translations.map(t => t.locale === locale ? { ...t, [field]: value } : t));
    };

    const addSocial = () => setSocials([...socials, { platform: 'twitter', url: '' }]);
    const removeSocial = (idx: number) => setSocials(socials.filter((_, i) => i !== idx));
    const updateSocial = (idx: number, field: keyof SocialLink, value: string) => {
        const newSocials = [...socials];
        newSocials[idx] = { ...newSocials[idx], [field]: value };
        setSocials(newSocials);
    };

    const addMember = () => setMembers([...members, { memberId: '', memberRole: '' }]);
    const removeMember = (idx: number) => setMembers(members.filter((_, i) => i !== idx));
    const updateMember = (idx: number, field: keyof Member, value: string) => {
        const newMembers = [...members];
        newMembers[idx] = { ...newMembers[idx], [field]: value };
        setMembers(newMembers);
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            const cleanSocials = socials.filter(s => s.platform.trim() && s.url.trim());

            const payload = {
                type: type,
                circuit: circuit,
                isVerified,
                socialLinks: cleanSocials,
                translations: translations.filter(t => t.name.trim() !== ''),
                members: type === 'circle' ? members.filter(m => m.memberId) : [],
                avatarId: avatarId
            };

            if (initialData?.id) {
                await updateFullEntity(initialData.id, payload as any);
                alert('Entity Updated!');
            } else {
                await createFullEntity(payload as any);
                alert('Entity Created!');
            }

            router.refresh();
            router.push('/pedalboard/entities');
        } catch (e) {
            console.error(e);
            alert(`Failed to ${initialData?.id ? 'update' : 'create'} entity`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    {/* Tabs for Languages */}
                    <div className="flex gap-1 bg-zinc-950 p-1 rounded border border-zinc-900 w-fit">
                        {translations.map(t => (
                            <button
                                key={t.locale}
                                type="button"
                                onClick={() => setActiveTab(t.locale)}
                                className={`px-4 py-1.5 text-[10px] font-black uppercase transition-all ${activeTab === t.locale ? 'bg-violet-600 text-black' : 'text-zinc-500 hover:text-white'}`}
                            >
                                {t.locale}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex gap-4 mb-4">
                                <MediaUploader
                                    value={avatarUrl}
                                    uploadAction={uploadMediaAction}
                                    onChange={(id, url) => { setAvatarId(id); setAvatarUrl(url); }}
                                    contextType="entity_avatar"
                                />
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-violet-500">Avatar_Upload</h3>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-1">Recommended: Square, JPG/PNG/WebP, Max 10MB.</p>
                                </div>
                            </div>

                            {translations.map(t => (
                                <div key={t.locale} className={activeTab === t.locale ? 'space-y-4' : 'hidden'}>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-mono uppercase text-zinc-400">Name ({t.locale})</label>
                                        <input
                                            value={t.name}
                                            onChange={(e) => updateTrans(t.locale, 'name', e.target.value)}
                                            className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors"
                                            placeholder={`Entity Name in ${t.locale.toUpperCase()}`}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-mono uppercase text-zinc-400">Bio ({t.locale})</label>
                                        <textarea
                                            value={t.bio}
                                            onChange={(e) => updateTrans(t.locale, 'bio', e.target.value)}
                                            rows={8}
                                            className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none resize-none transition-colors"
                                            placeholder={`About this entity in ${t.locale.toUpperCase()}...`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-400">Identity_Type</label>
                                <select
                                    name="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                    required
                                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors"
                                >
                                    <option value="individual">INDIVIDUAL</option>
                                    <option value="organization">ORGANIZATION</option>
                                    <option value="agency">AGENCY</option>
                                    <option value="circle">CIRCLE (UNIT)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-400">Operational_Circuit</label>
                                <select
                                    value={circuit}
                                    onChange={(e) => setCircuit(e.target.value as any)}
                                    className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors"
                                >
                                    <option value="underground">UNDERGROUND_ECHO</option>
                                    <option value="major">MAJOR_CIRCUIT</option>
                                    <option value="archived">ARCHIVED_SIGNAL</option>
                                </select>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div
                                    className={`flex items-center justify-center gap-2 border cursor-pointer transition-all h-[46px] ${isVerified ? 'bg-violet-600 border-violet-500 text-black' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-violet-900'}`}
                                    onClick={() => setIsVerified(!isVerified)}
                                >
                                    <Icon icon={isVerified ? "lucide:shield-check" : "lucide:shield"} width={14} />
                                    <span className="text-[10px] font-black uppercase">Verified_Status</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Unit Members Section */}
            {type === 'circle' && (
                <div className="space-y-4 pt-4 border-t border-zinc-900">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase text-violet-500">02 // UNIT_COMPOSITION_LEDGER</span>
                        <button type="button" onClick={addMember} className="text-[10px] uppercase font-bold text-violet-500 hover:text-white flex items-center gap-1">
                            <Icon icon="lucide:plus" width={12} /> ADD_MEMBER
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {members.map((member, i) => (
                            <div key={i} className="flex gap-2 items-center bg-zinc-950 p-3 border border-zinc-900 rounded-sm">
                                <EntitySearchPicker
                                    label=""
                                    type="individual"
                                    value={member.memberId}
                                    onSelect={(entity) => updateMember(i, 'memberId', entity?.id || '')}
                                    placeholder="Search Entity..."
                                    entities={entities}
                                />
                                <input
                                    value={member.memberRole || ''}
                                    onChange={(e) => updateMember(i, 'memberRole', e.target.value)}
                                    placeholder="Role (e.g. Vocalist)"
                                    className="bg-black border border-zinc-800 p-2 text-xs text-white flex-1 font-mono"
                                />
                                <button type="button" onClick={() => removeMember(i)} className="text-rose-500 hover:text-rose-400 p-1">
                                    <Icon icon="lucide:trash-2" width={14} />
                                </button>
                            </div>
                        ))}
                        {members.length === 0 && (
                            <div className="col-span-full border border-zinc-900 border-dashed p-8 text-center">
                                <span className="text-[10px] font-mono text-zinc-600 uppercase">NO_MEMBERS_ASSIGNED // Unit is an archived vessel.</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Social Links */}
            <div className="space-y-4 pt-4 border-t border-zinc-900">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-violet-500">01 // SOCIAL_NETWORK_NODES</span>
                    <button type="button" onClick={addSocial} className="text-[10px] uppercase font-bold text-violet-500 hover:text-white flex items-center gap-1">
                        <Icon icon="lucide:plus" width={12} /> ADD_LINK
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    {socials.map((link, i) => (
                        <div key={i} className="flex gap-2 items-center bg-zinc-900/30 p-2 border border-zinc-800/50">
                            <select
                                value={link.platform}
                                onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                                className="bg-black border border-zinc-800 p-2 text-xs text-white w-32"
                            >
                                <option value="twitter">X / Twitter</option>
                                <option value="instagram">Instagram</option>
                                <option value="pixiv">Pixiv</option>
                                <option value="github">GitHub</option>
                                <option value="youtube">YouTube</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="text-zinc-700">:</div>
                            <input
                                value={link.url}
                                onChange={(e) => updateSocial(i, 'url', e.target.value)}
                                placeholder="URL or Handle..."
                                className="bg-black border border-zinc-800 p-2 text-xs text-white flex-1"
                            />
                            <button type="button" onClick={() => removeSocial(i)} className="text-rose-500 hover:text-rose-400 p-1">
                                <Icon icon="lucide:x" width={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="py-4 bg-zinc-950 border border-zinc-800 text-zinc-500 font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-900 hover:text-white transition-all shadow-lg"
                >
                    EXIT_WITHOUT_COMMIT
                </button>
                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="py-4 bg-violet-600 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50 shadow-lg"
                >
                    {isSubmitting ? 'PROCESSING_REQUEST...' : initialData?.id ? 'COMMIT_UPDATES' : 'PUBLISH_ENTITY'}
                </button>
            </div>
        </form>
    );
}
