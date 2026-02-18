
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea } from '@shimokitan/ui';
import { Icon } from '@iconify/react';
import { uploadToR2Action, updateUserProfile } from '../../actions';
import { toast } from 'sonner';
import { getOptimizedImageUrl } from '@shimokitan/utils';

interface ProfileFormProps {
    initialData: {
        name: string;
        status: string;
        bio: string;
        avatarUrl: string;
        headerUrl: string;
    };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialData.name);
    const [status, setStatus] = useState(initialData.status);
    const [bio, setBio] = useState(initialData.bio);
    const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);
    const [headerUrl, setHeaderUrl] = useState(initialData.headerUrl);
    const [isUploading, setIsUploading] = useState<'avatar' | 'header' | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'header') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(type);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('context', 'profiles');

            const { publicUrl } = await uploadToR2Action(formData);

            if (type === 'avatar') setAvatarUrl(publicUrl);
            else setHeaderUrl(publicUrl);

            toast.success(`System: ${type === 'avatar' ? 'Avatar' : 'Header'} Uploaded to R2`);
        } catch (err) {
            console.error(err);
            toast.error('System_Failure: Upload Interrupted');
        } finally {
            setIsUploading(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUserProfile({ name, status, bio, avatarUrl, headerUrl });
            toast.success('System: Persona Synchronized');
            router.push('/pedalboard');
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error('System_Failure: Update Protocol Failed');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-500">
            {/* Visual Identity Section (Avatar & Header) */}
            <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 px-1">Visual_Identity</div>

                {/* Header Upload Zone */}
                <div className="relative group h-40 bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center">
                    {headerUrl ? (
                        <img
                            src={getOptimizedImageUrl(headerUrl, { width: 1200, height: 400, fit: 'cover' })!}
                            alt="Header Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">NO_BANNER_SET</div>
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
                        <Icon icon="lucide:image" width={24} className="mb-2" />
                        {isUploading === 'header' ? 'Syncing...' : 'Change_Header_Banner'}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'header')} disabled={!!isUploading} />
                    </label>
                </div>

                <div className="flex items-center gap-8 -mt-12 px-6">
                    {/* Avatar Upload Zone */}
                    <div className="relative group">
                        <div className="w-24 h-24 bg-black border border-zinc-800 relative shadow-2xl overflow-hidden flex items-center justify-center">
                            {avatarUrl ? (
                                <img
                                    src={getOptimizedImageUrl(avatarUrl, { width: 192, height: 192, fit: 'cover' })!}
                                    alt="Avatar Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Icon icon="lucide:user" width={32} className="text-zinc-800" />
                            )}
                        </div>
                        <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-[8px] font-black uppercase tracking-widest text-white text-center p-2">
                            {isUploading === 'avatar' ? '...' : 'New_Avatar'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'avatar')} disabled={!!isUploading} />
                        </label>
                    </div>

                    <div className="flex-1 pt-8">
                        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">Central_Storage // R2</div>
                        <div className="text-[8px] font-mono text-zinc-700 mt-1 truncate max-w-[300px]">{headerUrl || 'PENDING_DEPLOYMENT'}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 px-1">Metadata_Protocol</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Persona_Alias</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-black border-zinc-900 focus:border-rose-700 h-10 text-white font-black uppercase tracking-tighter"
                            placeholder="NAME"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">System_Status</label>
                        <Input
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-black border-zinc-900 focus:border-rose-700 h-10 text-rose-500 font-mono text-xs italic"
                            placeholder="CURRENT_MOOD..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Transmission_Log [BIO]</label>
                    <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="bg-black border-zinc-900 focus:border-rose-700 min-h-[100px] text-zinc-400 text-sm leading-relaxed"
                        placeholder="ENTER_BIO_TRANSMISSION..."
                    />
                </div>
            </div>

            <div className="pt-8 border-t border-zinc-900 flex gap-4">
                <Button
                    type="submit"
                    disabled={isSaving || !!isUploading}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-[0.2em] py-6 shadow-lg shadow-rose-900/20"
                >
                    {isSaving ? 'Synchronizing...' : 'Commit_Changes'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-zinc-800 text-zinc-600 font-bold uppercase tracking-widest px-8"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
