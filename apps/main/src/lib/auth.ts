
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const COOKIE_NAME = 'shimokitan_pedalboard_session';

export async function login(password: string) {
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
        return false;
    }

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
