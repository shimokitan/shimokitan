
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'experimental-edge';

const LEGAL_ROUTES = ['/terms', '/privacy', '/community-guidelines', '/copyright', '/cookies', '/contact'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // Check if we are in maintenance mode (you could use an env var here)
    const IS_MAINTENANCE = process.env.NODE_ENV === 'production';

    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const token = request.cookies.get('shimokitan_admin_session')?.value;
        if (token !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    if (IS_MAINTENANCE) {
        // Allow static files, robots.txt, favicon.ico, root path, and legal routes
        const isLegalRoute = LEGAL_ROUTES.some(route =>
            pathname.toLowerCase() === route.toLowerCase() ||
            pathname.toLowerCase().startsWith(route.toLowerCase() + '/')
        );

        // Rewrite to maintenance page for root and non-legal, non-static routes
        if (
            pathname.startsWith('/_next') ||
            pathname.startsWith('/api') ||
            pathname === '/favicon.ico' ||
            pathname === '/robots.txt' ||
            isLegalRoute ||
            pathname === '/maintenance' // Allow direct access to check it
        ) {
            return NextResponse.next();
        }

        // Rewrite all other traffic to the maintenance page
        return NextResponse.rewrite(new URL('/maintenance', request.url));
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
