"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { createFullEntity } from '../actions';
import { useRouter } from 'next/navigation';

type SocialLink = {
    platform: string;
    url: string;
};

export default function EntityForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic List
    const [socials, setSocials] = useState<SocialLink[]>([{ platform: 'twitter', url: '' }]);

    const addSocial = () => setSocials([...socials, { platform: '', url: '' }]);
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
            const cleanSocials = socials.reduce((acc, curr) => {
                if (curr.platform.trim() && curr.url.trim()) {
                    acc[curr.platform] = curr.url;
                }
                return acc;
            }, {} as Record<string, string>);

            await createFullEntity({
                name: formData.get('name') as string,
                type: formData.get('type') as string,
                bio: formData.get('bio') as string,
                avatarUrl: formData.get('avatarUrl') as string,
                socialLinks: cleanSocials
            });

            router.refresh();
            alert('Entity Created!');
            // Reset form...
        } catch (e) {
            console.error(e);
            alert('Failed to create entity');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Name</label>
                    <input name="name" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors" placeholder="Entity Name" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Type</label>
                    <select name="type" required className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors">
                        <option value="individual">INDIVIDUAL</option>
                        <option value="organization">ORGANIZATION</option>
                        <option value="agency">AGENCY</option>
                        <option value="circle">CIRCLE</option>
                        <option value="staff">STAFF</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Bio</label>
                <textarea name="bio" rows={3} className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none resize-none transition-colors" placeholder="About this entity..." />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Avatar URL</label>
                <input name="avatarUrl" className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:border-violet-600 outline-none transition-colors" placeholder="https://..." />
            </div>

            {/* Social Links */}
            <div className="space-y-4 pt-4 border-t border-zinc-900">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase text-violet-500">SOCIAL_LINKS</span>
                    <button type="button" onClick={addSocial} className="text-[10px] uppercase font-bold text-violet-500 hover:text-white flex items-center gap-1">
                        <Icon icon="lucide:plus" width={12} /> ADD_LINK
                    </button>
                </div>

                {socials.map((link, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <input
                            value={link.platform}
                            onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                            placeholder="Platform (twitter...)"
                            className="bg-black border border-zinc-800 p-2 text-xs text-white w-32"
                        />
                        <div className="text-zinc-700">:</div>
                        <input
                            value={link.url}
                            onChange={(e) => updateSocial(i, 'url', e.target.value)}
                            placeholder="URL..."
                            className="bg-black border border-zinc-800 p-2 text-xs text-white flex-1"
                        />
                        <button type="button" onClick={() => removeSocial(i)} className="text-rose-500 hover:text-rose-400">
                            <Icon icon="lucide:x" width={12} />
                        </button>
                    </div>
                ))}
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-violet-600 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all mt-4 disabled:opacity-50">
                {isSubmitting ? 'REGISTERING...' : 'REGISTER_ENTITY'}
            </button>
        </form>
    );
}
