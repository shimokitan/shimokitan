import { auth } from '@/lib/auth-neon/server';

export const dynamic = 'force-dynamic';

export const { GET, POST } = auth.handler();
