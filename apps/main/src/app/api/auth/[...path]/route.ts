
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: { params: Promise<any> }) => {
    const { auth } = await import('@/lib/auth-neon/server');
    return auth.handler().GET(req, { params });
};

export const POST = async (req: NextRequest, { params }: { params: Promise<any> }) => {
    const { auth } = await import('@/lib/auth-neon/server');
    return auth.handler().POST(req, { params });
};
