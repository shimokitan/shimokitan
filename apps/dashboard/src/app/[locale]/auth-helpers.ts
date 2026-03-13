import { getDb, schema, eq } from '@shimokitan/db';

async function getAuth() {
    if (process.env.NEXT_PHASE === 'phase-production-build' || !process.env.NEON_AUTH_BASE_URL) {
        return {
            getSession: async () => ({ data: null }),
            handler: () => { throw new Error("Auth_Handler_Disabled_During_Build"); }
        } as any;
    }

    const { createNeonAuth } = await import('@neondatabase/auth/next/server');
    return createNeonAuth({
        baseUrl: process.env.NEON_AUTH_BASE_URL!,
        cookies: {
            secret: process.env.NEON_AUTH_COOKIE_SECRET!,
        },
    });
}

export async function getSession() {
    const auth = await getAuth();
    return auth.getSession();
}

export async function requireUser() {
    const user = await ensureUserSync();
    if (!user) throw new Error('Unauthorized_Signal: Identity_Lost');
    return user;
}

export async function ensureUserSync() {
    let session;
    try {
        const auth = await getAuth();
        const result = await auth.getSession();
        session = result.data;
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.error("Auth Session Error in ensureUserSync:", e);
        return null;
    }

    if (!session?.user) return null;

    const db = getDb();
    if (!db) throw new Error('DB_Terminal_Offline');

    const userId = session.user.id;
    const userEmail = session.user.email;
    const userName = session.user.name;

    try {
        const existingById = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, userId)
        });

        if (existingById) {
            return { ...session.user, email: userEmail, role: existingById.role, resonanceMultiplier: existingById.resonanceMultiplier };
        }

        const existingByEmail = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, userEmail)
        });

        if (existingByEmail) {
            return { ...session.user, email: userEmail, role: existingByEmail.role, resonanceMultiplier: existingByEmail.resonanceMultiplier };
        }

        return null; // For dashboard, we might not want to auto-create and grant access if they are not in DB.
    } catch (error: any) {
        console.error('User_Sync_Error:', error);
        return null;
    }
}

export async function requireArchitect() {
    const user = await requireUser();
    if (user.role !== 'founder' && user.role !== 'architect') throw new Error('Insufficient_Privileges // Sector_Architects_Only');
    return user;
}

export async function requireFounder() {
    const user = await requireUser();
    if (user.role !== 'founder') throw new Error('Insufficient_Privileges // Sector_Founders_Only');
    return user;
}
