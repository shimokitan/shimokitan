import { NextResponse } from 'next/server';
import { registerResident, schema } from '@shimokitan/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = schema.insertResidentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const rows = await registerResident(result.data.email);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'ALREADY_REGISTERED' }, { status: 409 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
