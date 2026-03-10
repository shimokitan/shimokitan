
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@shimokitan/utils';

function getLocale(request: NextRequest): string {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && (locales as any).includes(cookieLocale)) {
        return cookieLocale;
    }

    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        const preferredLocales = acceptLanguage
            .split(',')
            .map(lang => lang.split(';')[0].split('-')[0].trim())
            .filter(Boolean);

        const match = preferredLocales.find(lang => (locales as any).includes(lang));
        if (match) return match;
    }

    return defaultLocale;
}

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        if (
            pathname.startsWith('/_next') ||
            pathname.startsWith('/api') ||
            pathname.includes('.') ||
            pathname === '/robots.txt' ||
            pathname === '/favicon.svg'
        ) {
            return NextResponse.next();
        }

        const locale = getLocale(request);
        request.nextUrl.pathname = `/${locale}${pathname}`;
        return NextResponse.rewrite(request.nextUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.svg).*)',
    ],
};
