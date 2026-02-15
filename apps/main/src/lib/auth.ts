
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'shkn2026';
const COOKIE_NAME = 'shimokitan_admin_session';

export async function login(password: string) {
    if (password === ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });
        return true;
    }
    return false;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(req?: NextRequest) {
    if (req) {
        return req.cookies.get(COOKIE_NAME)?.value === 'authenticated';
    }
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value === 'authenticated';
}
