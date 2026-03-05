
import { getDb, schema, eq } from '@shimokitan/db';

/**
 * Radically lazy and build-safe Auth getter.
 * During Next.js build phase, we return a mock to avoid crashing the Page Data Collection
 * which often trips over internal auth library metadata extraction / SSR logic.
 */
async function getAuth() {
    // Check if we are in the Next.js build data collection phase
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

// --- AUTH HELPERS ---

export async function getSession() {
    const auth = await getAuth();
    return auth.getSession();
}

export async function requireUser() {
    const user = await ensureUserSync();
    if (!user) throw new Error('Unauthorized_Signal: Identity_Lost');
    return user;
}

export async function requireArchitect() {
    const user = await requireUser();
    if (user.role !== 'architect' && user.role !== 'founder') {
        throw new Error('Forbidden_Signal: Architects_Only');
    }
    return user;
}

export async function requireFounder() {
    const user = await requireUser();
    if (user.role !== 'founder') {
        throw new Error('Forbidden_Signal: Founders_Only');
    }
    return user;
}

// --- AUTH & RBAC ---

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
    const userImage = session.user.image;

    try {
        // 1. Try to find the user by ID first (Fast Path)
        const existingById = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, userId)
        });

        if (existingById) {
            const updateObj: any = {};
            if (existingById.email !== userEmail) updateObj.email = userEmail;
            if (!existingById.name && userName) updateObj.name = userName;

            if (Object.keys(updateObj).length > 0) {
                updateObj.updatedAt = new Date();
                await db.update(schema.users)
                    .set(updateObj)
                    .where(eq(schema.users.id, userId));
            }

            return { ...session.user, email: userEmail, role: existingById.role };
        }

        // 2. If not found by ID, try to find by Email
        const existingByEmail = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, userEmail)
        });

        if (existingByEmail) {
            await db.update(schema.users)
                .set({
                    id: userId,
                    name: existingByEmail.name || userName,
                    updatedAt: new Date()
                })
                .where(eq(schema.users.email, userEmail));

            return { ...session.user, email: userEmail, role: existingByEmail.role };
        }

        // 3. Create new user
        const newUser = {
            id: userId,
            email: userEmail,
            name: userName,
            role: 'resident' as const,
        };
        await db.insert(schema.users).values(newUser);

        return { ...session.user, email: userEmail, role: 'resident' };

    } catch (error: any) {
        if (error.code === '23505') {
            const racingUser = await db.query.users.findFirst({
                where: (u, { or, eq }) => or(eq(u.id, userId), eq(u.email, userEmail))
            });
            if (racingUser) return { ...session.user, email: userEmail, role: racingUser.role };
        }
        if (process.env.NODE_ENV !== 'production') console.error('User_Sync_Critical_Failure:', error);
        throw new Error('Identity_Establishment_Failed');
    }
}
