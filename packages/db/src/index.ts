import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { eq, desc, sql } from 'drizzle-orm';

let sqlInstance: NeonQueryFunction<boolean, boolean>;
let dbInstance: NeonHttpDatabase<typeof schema>;

export function getDb() {
  if (!dbInstance) {
    const databaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;
    if (!databaseUrl) {
      console.warn('DATABASE_URL is not defined. Database operations will fail.');
      return null;
    }
    sqlInstance = neon(databaseUrl);
    dbInstance = drizzle(sqlInstance, { schema });
  }
  return dbInstance;
}

export { schema };
export * from 'drizzle-orm';

// --- UTILITIES ---

export async function getAllArtifacts() {
  const db = getDb();
  if (!db) return [];
  return await db.query.artifacts.findMany({
    orderBy: [desc(schema.artifacts.score)],
    with: {
      translations: true
    }
  });
}

export async function getArtifactById(id: string) {
  const db = getDb();
  if (!db) return null;

  return await db.query.artifacts.findFirst({
    where: eq(schema.artifacts.id, id),
    with: {
      credits: {
        with: {
          entity: {
            with: {
              translations: true
            }
          }
        }
      },
      translations: true,
      resources: true,
      zines: {
        with: {
          translations: true
        }
      }
    }
  });
}

export async function getZinesByArtifact(artifactId: string) {
  const db = getDb();
  if (!db) return [];
  return await db.query.zines.findMany({
    where: eq(schema.zines.artifactId, artifactId),
    orderBy: [desc(schema.zines.resonance)],
  });
}

export async function getAllEntities() {
  const db = getDb();
  if (!db) return [];
  return await db.query.entities.findMany({
    with: {
      translations: true,
      credits: {
        with: {
          artifact: {
            with: {
              translations: true
            }
          }
        }
      }
    }
  });
}

export async function getEntityById(id: string) {
  const db = getDb();
  if (!db) return null;

  return await db.query.entities.findFirst({
    where: eq(schema.entities.id, id),
    with: {
      translations: true,
      credits: {
        with: {
          artifact: {
            with: {
              translations: true,
              resources: true
            }
          }
        }
      }
    }
  });
}

/**
 * Register a new email for the coming soon list.
 */
export async function registerResident(email: string) {
  const db = getDb();
  if (!db) throw new Error('DATABASE_URL is not defined');

  return await db.insert(schema.residents)
    .values({
      id: sql`nanoid()`,
      email
    })
    .onConflictDoNothing({ target: schema.residents.email })
    .returning();
}
