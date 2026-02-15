
"use server"

import { getDb, schema } from '@shimokitan/db';
import { sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function seedArtifact(formData: FormData) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const title = formData.get('title') as string;
    const category = formData.get('category') as any;
    const description = formData.get('description') as string;
    const coverImage = formData.get('coverImage') as string;
    const status = formData.get('status') as any;
    const score = parseInt(formData.get('score') as string || '0');

    await db.insert(schema.artifacts).values({
        id: sql`nanoid()`,
        title,
        category,
        description,
        coverImage,
        status,
        score,
    });

    revalidatePath('/artifacts');
    revalidatePath('/admin');
}

export async function seedEntity(formData: FormData) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const name = formData.get('name') as string;
    const type = formData.get('type') as any;
    const bio = formData.get('bio') as string;
    const avatarUrl = formData.get('avatarUrl') as string;

    await db.insert(schema.entities).values({
        id: sql`nanoid()`,
        name,
        type,
        bio,
        avatarUrl,
    });

    revalidatePath('/admin');
}

export async function seedCollection(formData: FormData) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const title = formData.get('title') as string;
    const thesis = formData.get('thesis') as string;
    const coverImage = formData.get('coverImage') as string;

    await db.insert(schema.collections).values({
        id: sql`nanoid()`,
        title,
        thesis,
        coverImage,
    });

    revalidatePath('/admin');
}

export async function seedZine(formData: FormData) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const artifactId = formData.get('artifactId') as string;
    const author = formData.get('author') as string;
    const content = formData.get('content') as string;
    const resonance = parseInt(formData.get('resonance') as string || '0');

    await db.insert(schema.zines).values({
        id: sql`nanoid()`,
        artifactId,
        author,
        content,
        resonance,
    });


    revalidatePath('/admin');
}

// Complex Actions
export async function createFullArtifact(data: {
    title: string;
    category: string;
    description: string;
    coverImage: string;
    status: string;
    score: number;
    resources: any[];
    credits: any[];
    specs: Record<string, string>;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    // 1. Create Artifact
    const [inserted] = await db.insert(schema.artifacts).values({
        id: sql`nanoid()`,
        title: data.title,
        category: data.category as any,
        description: data.description,
        coverImage: data.coverImage,
        status: data.status as any,
        score: data.score,
        specs: data.specs
    }).returning({ id: schema.artifacts.id });

    const artifactId = inserted.id;

    // 2. Add Resources
    if (data.resources.length > 0) {
        for (const res of data.resources) {
            await db.insert(schema.artifactResources).values({
                id: sql`nanoid()`,
                artifactId: artifactId,
                type: res.type,
                platform: res.platform,
                url: res.url,
                isPrimary: res.isPrimary
            });
        }
    }

    // 3. Add Credits
    if (data.credits.length > 0) {
        for (const cred of data.credits) {
            await db.insert(schema.artifactCredits).values({
                artifactId: artifactId,
                entityId: cred.entityId,
                role: cred.role
            });
        }
    }

    revalidatePath('/artifacts');
    revalidatePath('/admin/artifacts');
    revalidatePath('/admin');
}

export async function createFullEntity(data: {
    name: string;
    type: string;
    bio: string;
    avatarUrl: string;
    socialLinks: Record<string, string>;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    await db.insert(schema.entities).values({
        id: sql`nanoid()`,
        name: data.name,
        type: data.type as any,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        socialLinks: data.socialLinks
    });

    revalidatePath('/entities');
    revalidatePath('/admin/entities');
    revalidatePath('/admin');
}
