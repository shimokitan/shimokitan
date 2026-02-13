import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // Check if we are in maintenance mode (you could use an env var here)
    const IS_MAINTENANCE = true;

    if (IS_MAINTENANCE) {
        const { pathname } = request.nextUrl;

        // Allow static files, robots.txt, favicon.ico, and the root path
        if (
            pathname.startsWith('/_next') ||
            pathname.startsWith('/api') ||
            pathname === '/favicon.ico' ||
            pathname === '/robots.txt' ||
            pathname === '/'
        ) {
            return NextResponse.next();
        }

        // Redirect everything else to root
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
