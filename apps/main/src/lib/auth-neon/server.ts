
import { createNeonAuth } from '@neondatabase/auth/next/server';

/**
 * Next.js 16 / Turbopack compatibility wrapper for Neon Auth.
 * Avoids top-level initialization which can cause metadata extraction failures
 * during build-time page data collection.
 */
export const auth = {
    async getSession() {
        const _auth = createNeonAuth({
            baseUrl: process.env.NEON_AUTH_BASE_URL!,
            cookies: {
                secret: process.env.NEON_AUTH_COOKIE_SECRET!,
            },
        });
        return _auth.getSession();
    },
    handler() {
        const _auth = createNeonAuth({
            baseUrl: process.env.NEON_AUTH_BASE_URL!,
            cookies: {
                secret: process.env.NEON_AUTH_COOKIE_SECRET!,
            },
        });
        return _auth.handler();
    }
} as any;
