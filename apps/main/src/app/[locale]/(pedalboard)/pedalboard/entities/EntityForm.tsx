
"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { createFullEntity, updateFullEntity } from '../actions';
import { useRouter } from 'next/navigation';

import EntitySearchPicker from '../artifacts/components/EntitySearchPicker';

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
    entities?: { id: string, name: string, type: string, avatarUrl: string | null }[]
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'id' | 'jp'>('en');

    // Multi-Language State
    const [translations, setTranslations] = useState(
        ['en', 'id', 'jp'].map(lang => {
            const trans = initialData?.translations?.find((t: any) => t.locale === lang);
            return {
                locale: lang as 'en' | 'id' | 'jp',
                name: trans?.name || '',
                bio: trans?.bio || ''
            };
        })
    );

    const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || '');
    const [circuit, setCircuit] = useState(initialData?.circuit || 'underground');
    const [profileType, setProfileType] = useState(initialData?.profileType || 'professional');
    const [isMajor, setIsMajor] = useState(initialData?.isMajor || false);
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
                avatarUrl: avatarUrl,
                circuit: circuit,
                profileType: profileType,
                isMajor: circuit === 'major' || isMajor,
                isVerified,
                socialLinks: cleanSocials,
                translations: translations.filter(t => t.name.trim() !== ''),
                members: type === 'circle' ? members.filter(m => m.memberId) : []
            };

            if (initialData?.id) {
                await updateFullEntity(initialData.id, payload as any);
                alert('Entity Updated!');
            } else {
                await createFullEntity(payload as any);
                alert('Entity Created!');
            }

            router.refresh();
            if (initialData?.id) router.push('/pedalboard/entities');
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
                <div className="flex-shrink-0 space-y-2">
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block">Lifeform_ID</label>
                    <div className="w-32 h-32 bg-zinc-950 border border-zinc-900 rounded-full relative overflow-hidden group shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-950 rounded-full border-4 border-zinc-900 flex items-center justify-center relative">
                                <div className="absolute inset-2 border border-zinc-800 rounded-full" />
                                <div className="absolute inset-4 border border-zinc-800 rounded-full" />
                                <div className="absolute inset-6 border border-zinc-800 rounded-full" />
                                <div className="w-8 h-8 bg-zinc-900 rounded-full border border-zinc-700 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-zinc-950 rounded-full" />
                                </div>
                                <span className="absolute bottom-2 text-[6px] font-mono text-zinc-600 tracking-tighter uppercase">NO_SIGNAL</span>
                            </div>
                        )}
                        {isVerified && (
                            <div className="absolute top-0 right-0 bg-violet-600 text-black p-1 rounded-bl">
                                <Icon icon="lucide:shield-check" width={16} />
                            </div>
                        )}
                    </div>
                </div>

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

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-8 space-y-1">
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
                                            rows={2}
                                            className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none resize-none transition-colors"
                                            placeholder={`About this entity in ${t.locale.toUpperCase()}...`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-span-12 md:col-span-4 space-y-4">
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
                                    <option value="ghost">GHOST_SIGNAL</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-mono uppercase text-zinc-400">Profile_Context</label>
                                <div className="grid grid-cols-2 gap-2 h-[46px]">
                                    <button
                                        type="button"
                                        onClick={() => setProfileType('professional')}
                                        className={`text-[10px] font-black uppercase border transition-all ${profileType === 'professional' ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-zinc-800'}`}
                                    >
                                        Professional
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProfileType('social')}
                                        className={`text-[10px] font-black uppercase border transition-all ${profileType === 'social' ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-zinc-800'}`}
                                    >
                                        Social
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Avatar_URL (Upload/Hotlink)</label>
                    <input
                        name="avatarUrl"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors"
                        placeholder="https://..."
                    />
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-2 h-[46px]">
                    <div
                        className={`flex items-center justify-center gap-2 border cursor-pointer transition-all ${isVerified ? 'bg-violet-600 border-violet-500 text-black' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-violet-900'}`}
                        onClick={() => setIsVerified(!isVerified)}
                    >
                        <Icon icon={isVerified ? "lucide:shield-check" : "lucide:shield"} width={14} />
                        <span className="text-[10px] font-black uppercase">Verified</span>
                    </div>
                    <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-4 h-full group cursor-pointer" onClick={() => setIsMajor(!isMajor)}>
                        <div className={`w-3 h-3 border ${isMajor ? 'bg-rose-600 border-rose-500' : 'bg-transparent border-zinc-700'} transition-colors`} />
                        <span className={`text-[10px] font-mono uppercase ${isMajor ? 'text-white' : 'text-zinc-500'}`}>Major_Label</span>
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
                                <span className="text-[10px] font-mono text-zinc-600 uppercase">NO_MEMBERS_ASSIGNED // Unit is a ghost vessel.</span>
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
