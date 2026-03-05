
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
    };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialData.name);
    const [status, setStatus] = useState(initialData.status);
    const [bio, setBio] = useState(initialData.bio);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUserProfile({ name, status, bio });
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
                    disabled={isSaving}
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
