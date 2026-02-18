import React from 'react';
import { auth } from '@/lib/auth-neon/server';
import { redirect } from 'next/navigation';
import PedalboardLayoutClient from './layout.client';

export default async function PedalboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = await auth.getSession();

    if (!session) {
        redirect('/auth/signin');
    }

    return (
        <PedalboardLayoutClient user={session.user}>
            {children}
        </PedalboardLayoutClient>
    );
}
