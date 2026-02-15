
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    (await cookies()).delete('shimokitan_admin_session');
    return NextResponse.json({ success: true });
}
