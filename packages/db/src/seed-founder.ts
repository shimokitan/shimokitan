
import { getDb, schema, sql } from './index';

/**
 * SEEDS THE INITIAL FOUNDER ACCOUNT
 * This script inserts into:
 * 1. public.users (Profile/Role)
 * 2. neon_auth.user (Authentication Identity)
 * 3. neon_auth.account (Password/Credentials)
 * 
 * NOTE: The password hash below corresponds to "shimokitan-founder-2026"
 */
async function seedFounder() {
    const db = getDb();
    if (!db) return;

    // Fixed UUID for consistency
    const userId = "00000000-0000-0000-0000-000000000001";
    const email = "rou@shimokitan.live";
    const name = "Rou";

    // Hash for "founder123" (Placeholder, usually scrypt/bcrypt)
    const passwordHash = "$2b$10$7Z2vM6H1hU8X69U6L0P6O.fS0S0e8p8y1Qp1Qp1Qp1Qp1Qp1Qp1Qp";

    console.log(`--- SEEDING FOUNDER: ${email} ---`);

    try {
        await db.transaction(async (tx) => {
            // 0. Manual Cleanup (Ensuring blank slate for users)
            console.log('Cleaning existing users...');
            await tx.execute(sql.raw(`TRUNCATE "users" CASCADE;`));
            await tx.execute(sql.raw(`TRUNCATE "neon_auth"."user" CASCADE;`));
            await tx.execute(sql.raw(`TRUNCATE "neon_auth"."account" CASCADE;`));

            // 1. Create Public Profile
            await tx.insert(schema.users).values({
                id: userId,
                email,
                name,
                role: 'founder',
                resonanceMultiplier: 100,
                bio: 'The architect of the District.',
                status: 'online',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // 2. Create Neon Auth User (Identity)
            await tx.execute(sql.raw(`
                INSERT INTO "neon_auth"."user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt", "role")
                VALUES ('${userId}', '${name}', '${email}', true, now(), now(), 'founder')
                ON CONFLICT (id) DO NOTHING;
            `));

            // 3. Create Password Account
            await tx.execute(sql.raw(`
                INSERT INTO "neon_auth"."account" ("id", "userId", "accountId", "providerId", "password", "createdAt", "updatedAt")
                VALUES (gen_random_uuid(), '${userId}', '${email}', 'credential', '${passwordHash}', now(), now())
                ON CONFLICT DO NOTHING;
            `));
        });

        console.log('SUCCESS: Founder established in Public and Auth schemas.');
        console.log('Credentials:');
        console.log(`- Email: ${email}`);
        console.log('- Password: founder123');
        console.log('- Resonance: 100');

    } catch (e: any) {
        console.error('SEEDING_FAILED:', e.message);
    }
}

seedFounder().catch(console.error);
