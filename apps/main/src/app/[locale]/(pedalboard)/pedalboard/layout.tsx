import React from 'react';
import { getSession } from './auth-helpers';
import { redirect } from 'next/navigation';
import PedalboardLayoutClient from './layout.client';

export const dynamic = 'force-dynamic';

export default async function PedalboardLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
    let session;
    try {
        const result = await getSession();
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
