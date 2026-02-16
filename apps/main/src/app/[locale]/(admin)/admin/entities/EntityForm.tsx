"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { createFullEntity, updateFullEntity } from '../actions';
import { useRouter } from 'next/navigation';
import { _ } from '@shimokitan/utils';

type SocialLink = {
    platform: string;
    url: string;
};

export default function EntityForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || '');
    const [isMajor, setIsMajor] = useState(initialData?.isMajor || false);
    const [isVerified, setIsVerified] = useState(initialData?.isVerified || false);
    const [allowMirroring, setAllowMirroring] = useState(initialData?.allowMirroring || false);

    // Dynamic List
    const [socials, setSocials] = useState<SocialLink[]>(
        initialData?.socialLinks
            ? (Array.isArray(initialData.socialLinks)
                ? initialData.socialLinks
                : Object.entries(initialData.socialLinks).map(([platform, url]) => ({ platform, url: url as string })))
            : [{ platform: 'twitter', url: '' }]
    );

    const addSocial = () => setSocials([...socials, { platform: 'twitter', url: '' }]);
    const removeSocial = (idx: number) => setSocials(socials.filter((_, i) => i !== idx));
    const updateSocial = (idx: number, field: keyof SocialLink, value: string) => {
        const newSocials = [...socials];
        newSocials[idx] = { ...newSocials[idx], [field]: value };
        setSocials(newSocials);
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            // Convert dynamic list to JSON object
            const cleanSocials = socials.filter(s => s.platform.trim() && s.url.trim());

            const payload = {
                name: formData.get('name') as string,
                type: formData.get('type') as string,
                bio: formData.get('bio') as string,
                avatarUrl: avatarUrl,
                isMajor: isMajor,
                isVerified: isVerified,
                allowMirroring: allowMirroring,
                socialLinks: cleanSocials
            };

            if (initialData?.id) {
                await updateFullEntity(initialData.id, payload);
                alert('Entity Updated!');
            } else {
                await createFullEntity(payload);
                alert('Entity Created!');
            }

            router.refresh();
            if (initialData?.id) router.push('/admin/entities');
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
                            /* Vinyl Styled Fallback */
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
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/5 pointer-events-none" />
                        <div className="absolute inset-0 scanline pointer-events-none opacity-10" />
                        {isVerified && (
                            <div className="absolute top-0 right-0 bg-violet-600 text-black p-1 rounded-bl">
                                <Icon icon="lucide:shield-check" width={16} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-8 space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Name</label>
                            <input
                                name="name"
                                defaultValue={initialData?.translations?.[0]?.name || initialData?.name}
                                required
                                className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors"
                                placeholder="Entity Name"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-4 space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Type</label>
                            <select name="type" defaultValue={initialData?.type} required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors">
                                <option value="individual">INDIVIDUAL</option>
                                <option value="organization">ORGANIZATION</option>
                                <option value="agency">AGENCY</option>
                                <option value="circle">CIRCLE</option>
                                <option value="staff">STAFF</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Bio</label>
                            <textarea
                                name="bio"
                                defaultValue={initialData?.translations?.[0]?.bio || initialData?.bio}
                                rows={2}
                                className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none resize-none transition-colors"
                                placeholder="About this entity..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-zinc-400">Bio</label>
                            <textarea
                                name="bio"
                                defaultValue={initialData?.translations?.[0]?.bio || initialData?.bio}
                                rows={2}
                                className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none resize-none transition-colors"
                                placeholder="About this entity..."
                            />
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
                <div className="md:col-span-2 grid grid-cols-3 gap-2 h-[46px]">
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
                    <div
                        className={`flex items-center gap-3 border px-4 h-full group transition-all ${isMajor ? 'bg-zinc-900 border-zinc-800 cursor-not-allowed opacity-50' : 'bg-zinc-950 border-zinc-800 cursor-pointer'}`}
                        onClick={() => !isMajor && setAllowMirroring(!allowMirroring)}
                    >
                        <div className={`w-3 h-3 border ${allowMirroring && !isMajor ? 'bg-violet-600 border-violet-500' : 'bg-transparent border-zinc-700'} transition-colors`} />
                        <span className={`text-[10px] font-mono uppercase ${allowMirroring && !isMajor ? 'text-white' : 'text-zinc-500'}`}>Mirror_Clearance</span>
                    </div>
                </div>
            </div>

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

            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-violet-600 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4 disabled:opacity-50">
                {isSubmitting ? 'INITIALIZING_CORE...' : initialData?.id ? 'UPDATE_ENTITY_CORE' : 'REGISTER_ENTITY_LINK'}
            </button>
        </form>
    );
}
