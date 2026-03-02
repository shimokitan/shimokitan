
import React from 'react';
import { getDb, schema, eq } from '@shimokitan/db';
import { ensureUserSync } from '../../auth-helpers';
import ProfileForm from './ProfileForm';
import { redirect } from 'next/navigation';

export default async function ProfileEditPage() {
    const user = await ensureUserSync();

    if (!user) {
        redirect('/auth/signin?callbackUrl=/pedalboard/profile/edit');
    }

    const db = getDb();
    if (!db) return <div>DB OFF</div>;

    const userProfile = await db.query.users.findFirst({
        where: eq(schema.users.id, user.id),
    });

    if (!userProfile) {
        redirect('/pedalboard');
    }

    const initialData = {
        name: userProfile.name || '',
        status: userProfile.status || '',
        bio: userProfile.bio || '',
        avatarUrl: userProfile.avatarUrl || '',
        headerUrl: userProfile.headerUrl || ''
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <header className="mb-12">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none">Edit_Persona</h1>
                <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em]">Update your digital presence in the district.</p>
            </header>

            <ProfileForm initialData={initialData} />
        </div>
    );
}
