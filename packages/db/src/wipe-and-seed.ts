
import { getDb, schema, sql } from './index';
import { nanoid } from 'nanoid';

/**
 * WIPES THE ENTIRE PUBLIC SCHEMA!
 * Use with caution.
 */
async function wipeDatabase() {
    const db = getDb();
    if (!db) return;

    console.log('--- SYSTEM_OVERRIDE: INITIATING_BLANK_SLATE ---');

    const tables = [
        'artifact_tags',
        'tags_i18n',
        'tags',
        'verification_registry',
        'zines_i18n',
        'zines',
        'artifact_resources',
        'unit_members',
        'artifact_credits',
        'collection_artifacts',
        'collections_i18n',
        'collections',
        'artifacts_i18n',
        'artifacts',
        'entity_managers',
        'entities_i18n',
        'entities',
        'users',
    ];

    for (const table of tables) {
        try {
            await db.execute(sql.raw(`DROP TABLE IF EXISTS "public"."${table}" CASCADE`));
            console.log(`[WIPE] Dropped ${table}`);
        } catch (e: any) {
            console.warn(`[WIPE_WARNING] Could not drop ${table}: ${e.message}`);
        }
    }

    console.log('--- SYSTEM_REBOOT: BLANK_SLATE_ESTABLISHED ---');
}

/**
 * SEEDS THE INITIAL FOUNDER ACCOUNT
 */
async function seedFounder() {
    const db = getDb();
    if (!db) return;

    console.log('--- SEEDING: ESTABLISHING_INITIAL_IDENTITY ---');

    const founderData = {
        id: nanoid(), // Local ID, but Auth will sync eventually
        email: 'founder@shimokitan.live',
        name: 'The Architect',
        role: 'founder' as const,
        bio: 'The architect of the District.',
        status: 'online',
    };

    try {
        await db.insert(schema.users).values(founderData);
        console.log(`[SEED] Created Founder: ${founderData.email}`);
        console.log(`[SEED] ID: ${founderData.id}`);
    } catch (e: any) {
        console.error(`[SEED_ERROR] Failed to seed founder: ${e.message}`);
    }

    console.log('--- SEEDING: IDENTITY_ESTABLISHED ---');
    console.log('NOTE: Please sign up with this email in the UI to link your Auth session.');
}

async function main() {
    await wipeDatabase();
    // After wiping, tables need to be re-created.
    // Usually run drizzle-kit push or similar.
    console.log('IMPORTANT: Run "bun x drizzle-kit push" BEFORE seeding to recreate tables.');
}

main().catch(console.error);
