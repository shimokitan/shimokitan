
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => {
    const { auth } = await import('@shimokitan/auth');
    return auth.handler().GET(req, { params });
};

export const POST = async (req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => {
    const { auth } = await import('@shimokitan/auth');
    return auth.handler().POST(req, { params });
};
