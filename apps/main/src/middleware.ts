
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@shimokitan/utils';

export const runtime = 'experimental-edge';

const LEGAL_ROUTES = ['/terms', '/privacy', '/community-guidelines', '/copyright', '/cookies', '/contact'];

function getLocale(request: NextRequest): string {
    // Check cookie first
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && (locales as any).includes(cookieLocale)) {
        return cookieLocale;
    }

    // Then check accept-language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        if (acceptLanguage.includes('id')) return 'id';
        if (acceptLanguage.includes('ja') || acceptLanguage.includes('jp')) return 'jp';
    }

    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Handle Locale Prefixing
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        // Skip for static assets, api, etc.
        if (
            pathname.startsWith('/_next') ||
            pathname.startsWith('/api') ||
            pathname.includes('.') || // e.g. favicon.ico
            pathname === '/robots.txt'
        ) {
            return NextResponse.next();
        }

        const locale = getLocale(request);
        request.nextUrl.pathname = `/${locale}${pathname}`;
        return NextResponse.redirect(request.nextUrl);
    }

    // Extract locale and sub-pathname for further checks
    const segments = pathname.split('/');
    const locale = segments[1];
    const subPathname = '/' + segments.slice(2).join('/');

    // 2. Admin Authentication Check
    if (subPathname.startsWith('/admin') && subPathname !== '/admin/login') {
        const token = request.cookies.get('shimokitan_admin_session')?.value;
        if (token !== 'authenticated') {
            return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
        }
    }

    // 3. Maintenance mode check
    const IS_MAINTENANCE = process.env.NODE_ENV === 'production';
    if (IS_MAINTENANCE) {
        const isLegalRoute = LEGAL_ROUTES.some(route =>
            subPathname.toLowerCase() === route.toLowerCase() ||
            subPathname.toLowerCase().startsWith(route.toLowerCase() + '/')
        );

        if (
            subPathname.startsWith('/_next') ||
            subPathname.startsWith('/api') ||
            subPathname === '/favicon.ico' ||
            subPathname === '/robots.txt' ||
            isLegalRoute ||
            subPathname === '/maintenance'
        ) {
            return NextResponse.next();
        }

        return NextResponse.rewrite(new URL(`/${locale}/maintenance`, request.url));
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
