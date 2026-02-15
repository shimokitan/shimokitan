
"use server"

import { getDb, schema } from '@shimokitan/db';
import { sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { nanoid } from '@shimokitan/utils';
import { uploadImageFromUrl } from '@/lib/r2';

async function processImageField(url: string, id: string, type: 'artifact' | 'zine' | 'profile' | 'collection') {
    if (!url || !url.startsWith('http')) return url;
    // Avoid re-processing R2 URLs
    const r2Domain = process.env.NEXT_PUBLIC_R2_DOMAIN || 'assets.shimokitan.com';
    if (url.includes(r2Domain)) return url;

    try {
        return await uploadImageFromUrl(url, id, type);
    } catch (e) {
        console.error("Failed to upload image to R2, falling back to original URL", e);
        return url;
    }
}

export async function seedArtifact(formData: FormData) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const id = nanoid();
    const title = formData.get('title') as string;
    const category = formData.get('category') as any;
    const description = formData.get('description') as string;
    let coverImage = formData.get('coverImage') as string;
    const status = formData.get('status') as any;
    const score = parseInt(formData.get('score') as string || '0');

    coverImage = await processImageField(coverImage, id, 'artifact');

    await db.insert(schema.artifacts).values({
        id,
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

    const id = nanoid();
    const name = formData.get('name') as string;
    const type = formData.get('type') as any;
    const bio = formData.get('bio') as string;
    let avatarUrl = formData.get('avatarUrl') as string;

    avatarUrl = await processImageField(avatarUrl, id, 'profile');

    await db.insert(schema.entities).values({
        id,
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

    const id = nanoid();
    const title = formData.get('title') as string;
    const thesis = formData.get('thesis') as string;
    let coverImage = formData.get('coverImage') as string;

    coverImage = await processImageField(coverImage, id, 'collection');

    await db.insert(schema.collections).values({
        id,
        title,
        thesis,
        coverImage,
    });

    revalidatePath('/admin');
}

export async function seedZine(formData: FormData) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const id = nanoid();
    const artifactId = formData.get('artifactId') as string;
    const author = formData.get('author') as string;
    const content = formData.get('content') as string;
    const resonance = parseInt(formData.get('resonance') as string || '0');

    await db.insert(schema.zines).values({
        id,
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

    // 1. Generate ID and Process Image
    const artifactId = nanoid();
    const processedCover = await processImageField(data.coverImage, artifactId, 'artifact');

    // 2. Create Artifact
    await db.insert(schema.artifacts).values({
        id: artifactId,
        title: data.title,
        category: data.category as any,
        description: data.description,
        coverImage: processedCover,
        status: data.status as any,
        score: data.score,
        specs: data.specs
    });

    // 3. Add Resources
    if (data.resources.length > 0) {
        for (const res of data.resources) {
            await db.insert(schema.artifactResources).values({
                id: nanoid(),
                artifactId: artifactId,
                type: res.type,
                platform: res.platform,
                url: res.url,
                isPrimary: res.isPrimary
            });
        }
    }

    // 4. Add Credits
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

    const entityId = nanoid();
    const processedAvatar = await processImageField(data.avatarUrl, entityId, 'profile');

    await db.insert(schema.entities).values({
        id: entityId,
        name: data.name,
        type: data.type as any,
        bio: data.bio,
        avatarUrl: processedAvatar,
        socialLinks: data.socialLinks
    });

    revalidatePath('/entities');
    revalidatePath('/admin/entities');
    revalidatePath('/entities');
    revalidatePath('/admin/entities');
    revalidatePath('/admin');
}

import { eq, isNotNull } from 'drizzle-orm';

export async function deleteArtifact(id: string) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const item = await db.query.artifacts.findFirst({
        where: eq(schema.artifacts.id, id)
    });

    if (!item) return;

    if (item.deletedAt) {
        // Permanent Delete
        await db.delete(schema.artifactResources).where(eq(schema.artifactResources.artifactId, id));
        await db.delete(schema.artifactCredits).where(eq(schema.artifactCredits.artifactId, id));
        await db.delete(schema.artifacts).where(eq(schema.artifacts.id, id));
    } else {
        // Soft Delete
        await db.update(schema.artifacts)
            .set({ deletedAt: new Date() })
            .where(eq(schema.artifacts.id, id));
    }

    revalidatePath('/artifacts');
    revalidatePath('/admin/artifacts');
    revalidatePath('/admin');
}

export async function deleteEntity(id: string) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const item = await db.query.entities.findFirst({
        where: eq(schema.entities.id, id)
    });

    if (!item) return;

    if (item.deletedAt) {
        await db.delete(schema.entities).where(eq(schema.entities.id, id));
    } else {
        await db.update(schema.entities)
            .set({ deletedAt: new Date() })
            .where(eq(schema.entities.id, id));
    }

    revalidatePath('/entities');
    revalidatePath('/admin/entities');
    revalidatePath('/admin');
}

export async function deleteCollection(id: string) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const item = await db.query.collections.findFirst({
        where: eq(schema.collections.id, id)
    });

    if (!item) return;

    if (item.deletedAt) {
        await db.delete(schema.collections).where(eq(schema.collections.id, id));
    } else {
        await db.update(schema.collections)
            .set({ deletedAt: new Date() })
            .where(eq(schema.collections.id, id));
    }

    revalidatePath('/admin');
}

export async function deleteZine(id: string) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const item = await db.query.zines.findFirst({
        where: eq(schema.zines.id, id)
    });

    if (!item) return;

    if (item.deletedAt) {
        await db.delete(schema.zines).where(eq(schema.zines.id, id));
    } else {
        await db.update(schema.zines)
            .set({ deletedAt: new Date() })
            .where(eq(schema.zines.id, id));
    }

    revalidatePath('/admin');
}
