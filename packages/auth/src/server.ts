
/**
 * Next.js 16 / Turbopack compatibility wrapper for Neon Auth.
 * Avoids top-level initialization which can cause metadata extraction failures
 * during build-time page data collection.
 */
export const auth = {
    async getSession() {
        const { createNeonAuth } = await import('@neondatabase/auth/next/server');
        const _auth = createNeonAuth({
            baseUrl: process.env.NEON_AUTH_BASE_URL!,
            cookies: {
                secret: process.env.NEON_AUTH_COOKIE_SECRET!,
            },
        });
        return _auth.getSession();
    },
    handler() {
        // We use a getter here but for handler it must be synchronous for Next.js to use it as an export
        // However, middleware/routes are server-side only so top-level include is usually fine there.
        // For maximum safety we can use a dynamic import but handler() is called by Next.js at root level.
        try {
            const { createNeonAuth } = require('@neondatabase/auth/next/server');
            const _auth = createNeonAuth({
                baseUrl: process.env.NEON_AUTH_BASE_URL!,
                cookies: {
                    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
                },
            });
            return _auth.handler();
        } catch (e) {
            console.error("Auth_Handler_Init_Error", e);
            return {
                GET: () => new Response("Auth_Offline", { status: 500 }),
                POST: () => new Response("Auth_Offline", { status: 500 }),
            };
        }
    }
} as any;
