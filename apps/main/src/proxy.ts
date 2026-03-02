
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
        if (acceptLanguage.includes('id')) return 'id';
        if (acceptLanguage.includes('ja') || acceptLanguage.includes('jp')) return 'jp';
    }

    return defaultLocale;
}

/**
 * Next.js 16 "Proxy" (formerly Middleware).
 * This function handles routing, locales, and authentication checks.
 */
export default function proxy(request: NextRequest) {
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

    // 2. Authentication Check
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
