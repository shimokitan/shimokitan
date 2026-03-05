'use client';

import { initPolyfill } from './polyfill';

// Force immediate polyfill execution globally
initPolyfill();

// Use dynamic initialization to prevent library hoisting
const createClient = () => {
    if (typeof window === 'undefined') {
        // Return a mock for SSR to prevent crashes
        return {
            useSession: () => ({ data: null, isPending: true }),
            signOut: async () => { },
            signIn: async () => { },
            signUp: async () => { }
        } as any;
    }

    try {
        const { createAuthClient } = require('@neondatabase/auth/next');
        return createAuthClient();
    } catch (err) {
        console.error('SHIMOKITAN: Failed to initialize auth client.', err);
        return {
            useSession: () => ({ data: null, isPending: true }),
            signOut: async () => { }
        } as any;
    }
};

export const authClient = createClient();
