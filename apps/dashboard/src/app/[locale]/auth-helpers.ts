import { auth } from '@shimokitan/auth';
import { getDb } from '@shimokitan/db';

export async function getSession() {
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
            where: (u: any, { eq }: any) => eq(u.id, userId)
        });

        if (existingById) {
            return { ...session.user, email: userEmail, role: existingById.role, resonanceMultiplier: existingById.resonanceMultiplier };
        }

        const existingByEmail = await db.query.users.findFirst({
            where: (u: any, { eq }: any) => eq(u.email, userEmail)
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
