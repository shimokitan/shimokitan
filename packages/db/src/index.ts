import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let sqlInstance: any;
let dbInstance: any;

function getDb() {
  if (!dbInstance) {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL is not defined. Database operations will fail.');
      return null;
    }
    sqlInstance = neon(process.env.DATABASE_URL);
    dbInstance = drizzle(sqlInstance, { schema });
  }
  return dbInstance;
}

export { schema };

/**
 * Register a new email for the coming soon list using Drizzle.
 * @param email The email address to register.
 */
export async function registerResident(email: string) {
  const db = getDb();
  if (!db) throw new Error('DATABASE_URL is not defined');

  return await db.insert(schema.residents)
    .values({ email })
    .onConflictDoNothing({ target: schema.residents.email })
    .returning();
}
