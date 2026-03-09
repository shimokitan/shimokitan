
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@shimokitan/utils';
import { AUTH_COOKIE_NAMES } from '@/lib/auth-neon/constants';

function getLocale(request: NextRequest): string {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && (locales as any).includes(cookieLocale)) {
        return cookieLocale;
    }

    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        // Parse "en-US,en;q=0.9,id;q=0.8,ja;q=0.7" -> ["en", "id", "ja"]
        const preferredLocales = acceptLanguage
            .split(',')
            .map(lang => lang.split(';')[0].split('-')[0].trim())
            .filter(Boolean);

        // Find the first one we support
        const match = preferredLocales.find(lang => (locales as any).includes(lang));
        if (match) return match;
    }

    return defaultLocale;
}

const ALLOWED_SUBPATHS = [
    '/coming-soon',
    '/about',
    '/vision',
    '/roadmap',
    '/privacy',
    '/terms',
    '/cookies',
    '/copyright',
    '/affiliate-disclosure',
    '/community-guidelines',
    '/faq'
];

/**
 * Next.js Middleware.
 * This function handles routing, locales, and authentication checks.
 */
export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Handle Locale Prefixing
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        if (
            pathname.startsWith('/_next') ||
            pathname.startsWith('/api') ||
            pathname.includes('.') ||
            pathname === '/robots.txt'
        ) {
            return NextResponse.next();
        }

        const locale = getLocale(request);
        request.nextUrl.pathname = `/${locale}${pathname}`;
        return NextResponse.redirect(request.nextUrl);
    }

    const segments = pathname.split('/');
    const locale = segments[1];
    const subPathname = '/' + segments.slice(2).join('/');
    const cleanSubPathname = subPathname.replace(/\/$/, '') || '/';

    // 1.5 Gatekeeper (Coming Soon Mode)
    const isDev = process.env.NODE_ENV === 'development';
    const isComingSoon = cleanSubPathname === '/coming-soon';
    const isAllowed = ALLOWED_SUBPATHS.some(path => cleanSubPathname.startsWith(path));

    if (!isDev && !isComingSoon && !isAllowed) {
        return NextResponse.redirect(new URL(`/${locale}/coming-soon`, request.url));
    }

    // 1.6 Vision/Roadmap Aliases
    if (cleanSubPathname === '/roadmap' || cleanSubPathname === '/vision') {
        return NextResponse.redirect(new URL(`/${locale}/about/vision`, request.url));
    }

    // 2. Authentication Check (for pedalboard)
    if (subPathname.startsWith('/pedalboard')) {
        const sessionToken = AUTH_COOKIE_NAMES.find(name => request.cookies.get(name)?.value);

        if (!sessionToken) {
            return NextResponse.redirect(new URL(`/${locale}/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
