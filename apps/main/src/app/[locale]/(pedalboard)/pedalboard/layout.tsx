import React from 'react';
import { auth } from '@/lib/auth-neon/server';
import { redirect } from 'next/navigation';
import PedalboardLayoutClient from './layout.client';

export default async function PedalboardLayout({ children }: { children: React.ReactNode }) {
    let session;
    try {
        const result = await auth.getSession();
        session = result.data;
    } catch (e: any) {
        // If it's a redirect error (from Next.js), we MUST re-throw it
        if (e.digest?.startsWith('NEXT_REDIRECT')) throw e;

        // If it's the cookie modification error or other auth errors, force signin
        console.error("Auth Session Error in Layout:", e);
        redirect('/auth/signin');
    }

    if (!session) {
        redirect('/auth/signin');
    }

    return (
        <PedalboardLayoutClient user={session.user}>
            {children}
        </PedalboardLayoutClient>
    );
}
