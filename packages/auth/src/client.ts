'use client';

import { initPolyfill } from './polyfill';

// Force immediate polyfill execution globally
initPolyfill();

// Standard initialization for Next.js 15/16
import { createAuthClient } from '@neondatabase/auth/next';

export const authClient = createAuthClient();
