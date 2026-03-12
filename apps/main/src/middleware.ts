
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
    '/faq',
    '/registry'
];

/**
 * Next.js Middleware.
 * This function handles routing, locales, and authentication checks.
 */
export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 0. Skip system paths
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname === '/robots.txt'
    ) {
        return NextResponse.next();
    }

    // 1. Determine Locale and SubPathname (Unify)
    const currentLocaleMatch = locales.find(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    const pathnameHasLocale = !!currentLocaleMatch;

    let locale: string;
    let subPathname: string;

    if (pathnameHasLocale && currentLocaleMatch) {
         locale = currentLocaleMatch;
         subPathname = pathname.replace(new RegExp(`^/${locale}/?`), '/') || '/';
    } else {
         locale = getLocale(request);
         subPathname = pathname;
    }

    const cleanSubPathname = subPathname.replace(/\/$/, '') || '/';

    // 2. Gatekeeper (Coming Soon Mode)
    const isDev = process.env.NODE_ENV === 'development';
    const isComingSoon = cleanSubPathname === '/coming-soon';
    const isAuth = cleanSubPathname.startsWith('/auth');
    const isPedalboard = cleanSubPathname.startsWith('/pedalboard');
    
    // Check if it's an allowed subpath (Legal, About, and explicit redirections)
    const isAllowed = ALLOWED_SUBPATHS.some(path => {
        if (path === '/') return cleanSubPathname === '/';
        return cleanSubPathname === path || cleanSubPathname.startsWith(`${path}/`);
    });

    // Check for active admin/user session
    const sessionTokenActive = AUTH_COOKIE_NAMES.some(name => request.cookies.get(name)?.value);

    // 2.1 Entity Slug Exception (Allow /@slug or /slug)
    const segments = cleanSubPathname.split('/').filter(Boolean);
    const rootSegment = segments[0];
    
    // Explicitly protected platform roots
    const PROTECTED_ROOTS = [
        'artifacts',
        'artists',
        'back-alley',
        'zines',
        'contact',
        'pedalboard',
        'auth',
        'coming-soon'
    ];

    // It's an artist slug if:
    // - It's a single segment path (e.g., /en/rou)
    // - The segment is NOT a protected platform root
    const isEntitySlug = segments.length === 1 && !PROTECTED_ROOTS.includes(rootSegment);

    // Gate logic: Redirect to coming-soon if it's NOT (dev OR coming-soon OR allowed OR auth OR session-active OR isEntitySlug)
    if (!isDev && !isComingSoon && !isAllowed && !isAuth && !sessionTokenActive && !isEntitySlug) {
        return NextResponse.redirect(new URL(`/${locale}/coming-soon`, request.url));
    }

    // 3. Vision/Roadmap Aliases (Redirects)
    if (cleanSubPathname === '/roadmap' || cleanSubPathname === '/vision') {
        return NextResponse.redirect(new URL(`/${locale}/about/vision`, request.url));
    }

    // 4. Authenticated Area Enforcement (for pedalboard)
    if (isPedalboard && !sessionTokenActive) {
        const callbackUrl = encodeURIComponent(pathname);
        return NextResponse.redirect(new URL(`/${locale}/auth/signin?callbackUrl=${callbackUrl}`, request.url));
    }

    // 5. Handle Locale Prefixing (if not already there)
    if (!pathnameHasLocale) {
        request.nextUrl.pathname = `/${locale}${pathname}`;
        return NextResponse.rewrite(request.nextUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|icon.svg).*)',
    ],
};
