
"use server"

import { getDb, schema } from '@shimokitan/db';
import { sql, eq, isNotNull, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { nanoid, extractMediaId, getThumbnailUrl, _, slugify } from '@shimokitan/utils';
import { uploadImageFromUrl } from '@/lib/r2';

async function processImageField(url: string, id: string, type: 'artifact' | 'zine' | 'profile' | 'collection', isMajor: boolean = false, allowMirroring: boolean = false) {
    if (!url) return '';

    // If it's already an R2 URL and we don't allow mirroring/not major, just return it
    if (url.includes('r2.shimokitan.com')) return url;

    // For major items or if specifically allowed, we mirror to R2
    if (isMajor || allowMirroring) {
        try {
            const fileName = `${type}/${id}/${nanoid()}`;
            const mirroredUrl = await uploadImageFromUrl(url, fileName);
            return mirroredUrl;
        } catch (e) {
            console.error("Mirroring failed:", e);
            return url; // Fallback to original
        }
    }

    return url;
}

// --- SYNC HELPERS ---

async function syncTags(artifactId: string, tags: { name: string }[], locale: string = 'en') {
    const db = getDb();
    if (!db || !tags || tags.length === 0) return;

    for (const tag of tags) {
        let tagId: string;
        const existingTagI18n = await db.query.tagsI18n.findFirst({
            where: and(eq(schema.tagsI18n.locale, locale as any), eq(schema.tagsI18n.name, tag.name))
        });

        if (existingTagI18n) {
            tagId = existingTagI18n.tagId;
        } else {
            tagId = nanoid();
            await db.insert(schema.tags).values({ id: tagId });
            await db.insert(schema.tagsI18n).values({ tagId, locale: locale as any, name: tag.name });
        }

        await db.insert(schema.artifactTags).values({ artifactId, tagId }).onConflictDoNothing();
    }
}

// --- SEEDERS (Simple, for quick UI tests) ---

export async function seedArtifact(formData: FormData) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const id = nanoid();
    const title = formData.get('title') as string;
    const category = formData.get('category') as any;
    const coverImage = formData.get('coverImage') as string;
    const status = formData.get('status') as any;
    const score = parseInt(formData.get('score') as string || '0');

    await db.insert(schema.artifacts).values({
        id,
        slug: slugify(title),
        category,
        coverImage,
        status,
        score,
    });

    await db.insert(schema.artifactsI18n).values({
        artifactId: id,
        locale: 'en',
        title,
        description: 'Generic description seeded via UI.'
    });

    revalidatePath('/admin');
}

export async function seedEntity(formData: FormData) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const id = nanoid();
    const name = formData.get('name') as string;
    const type = formData.get('type') as any;
    const avatarUrl = formData.get('avatarUrl') as string;

    await db.insert(schema.entities).values({
        id,
        slug: slugify(name),
        type,
        avatarUrl,
    });

    await db.insert(schema.entitiesI18n).values({
        entityId: id,
        locale: 'en',
        name,
        bio: 'Automated bio.'
    });

    revalidatePath('/admin');
}

// --- FULL CRUD ACTIONS (Multi-language Support) ---

export async function createFullArtifact(data: {
    category: string;
    coverImage: string;
    status: string;
    score: number;
    isMajor: boolean;
    isVerified: boolean;
    allowMirroring: boolean;
    resources: any[];
    credits: any[];
    specs: any;
    tags: any[];
    translations: { locale: 'en' | 'id' | 'jp', title: string, description: string }[];
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const artifactId = nanoid();
    const primaryTitle = data.translations.find(t => t.locale === 'en')?.title || data.translations[0]?.title || 'Untitled';
    const processedCover = await processImageField(data.coverImage, artifactId, 'artifact', data.isMajor, data.allowMirroring);

    await db.insert(schema.artifacts).values({
        id: artifactId,
        slug: slugify(primaryTitle),
        category: data.category as any,
        coverImage: processedCover,
        status: data.status as any,
        score: data.score,
        specs: data.specs,
        isMajor: data.isMajor,
        isVerified: data.isVerified,
        allowMirroring: data.allowMirroring
    });

    for (const trans of data.translations) {
        if (trans.title.trim()) {
            await db.insert(schema.artifactsI18n).values({
                artifactId,
                locale: trans.locale,
                title: trans.title,
                description: trans.description
            });
        }
    }

    if (data.resources?.length > 0) {
        await db.insert(schema.artifactResources).values(data.resources.map(r => ({
            id: nanoid(),
            artifactId,
            type: r.type,
            platform: r.platform,
            value: r.url,
            isPrimary: r.isPrimary
        })));
    }

    if (data.credits?.length > 0) {
        await db.insert(schema.artifactCredits).values(data.credits.map(c => ({
            artifactId,
            entityId: c.entityId,
            role: c.role
        })));
    }

    if (data.tags?.length > 0) {
        await syncTags(artifactId, data.tags);
    }

    revalidatePath('/admin/artifacts');
    revalidatePath('/admin');
}

export async function updateFullArtifact(id: string, data: {
    category: string;
    coverImage: string;
    status: string;
    score: number;
    isMajor: boolean;
    isVerified: boolean;
    allowMirroring: boolean;
    resources: any[];
    credits: any[];
    specs: any;
    tags: any[];
    translations: { locale: 'en' | 'id' | 'jp', title: string, description: string }[];
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const primaryTitle = data.translations.find(t => t.locale === 'en')?.title || data.translations[0]?.title || 'Untitled';
    const processedCover = await processImageField(data.coverImage, id, 'artifact', data.isMajor, data.allowMirroring);

    await db.update(schema.artifacts)
        .set({
            slug: slugify(primaryTitle),
            category: data.category as any,
            coverImage: processedCover,
            status: data.status as any,
            score: data.score,
            specs: data.specs,
            isMajor: data.isMajor,
            isVerified: data.isVerified,
            allowMirroring: data.allowMirroring,
            updatedAt: new Date()
        })
        .where(eq(schema.artifacts.id, id));

    await db.delete(schema.artifactsI18n).where(eq(schema.artifactsI18n.artifactId, id));
    for (const trans of data.translations) {
        if (trans.title.trim()) {
            await db.insert(schema.artifactsI18n).values({
                artifactId: id,
                locale: trans.locale,
                title: trans.title,
                description: trans.description
            });
        }
    }

    await db.delete(schema.artifactResources).where(eq(schema.artifactResources.artifactId, id));
    if (data.resources?.length > 0) {
        await db.insert(schema.artifactResources).values(data.resources.map(r => ({
            id: nanoid(),
            artifactId: id,
            type: r.type,
            platform: r.platform,
            value: r.url,
            isPrimary: r.isPrimary
        })));
    }

    await db.delete(schema.artifactCredits).where(eq(schema.artifactCredits.artifactId, id));
    if (data.credits?.length > 0) {
        await db.insert(schema.artifactCredits).values(data.credits.map(c => ({
            artifactId: id,
            entityId: c.entityId,
            role: c.role
        })));
    }

    await db.delete(schema.artifactTags).where(eq(schema.artifactTags.artifactId, id));
    if (data.tags?.length > 0) {
        await syncTags(id, data.tags);
    }

    revalidatePath('/admin/artifacts');
    revalidatePath('/admin');
}

export async function deleteArtifact(id: string) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const item = await db.query.artifacts.findFirst({
        where: eq(schema.artifacts.id, id)
    });

    if (!item) return;

    if (item.deletedAt) {
        // Permanently delete
        await db.delete(schema.artifacts).where(eq(schema.artifacts.id, id));
    } else {
        // Soft delete
        await db.update(schema.artifacts)
            .set({ deletedAt: new Date() })
            .where(eq(schema.artifacts.id, id));
    }

    revalidatePath('/admin/artifacts');
    revalidatePath('/admin');
}

// --- ENTITIES ---

export async function createFullEntity(data: {
    type: string;
    avatarUrl: string;
    isMajor: boolean;
    isVerified: boolean;
    allowMirroring: boolean;
    socialLinks: any;
    translations: { locale: 'en' | 'id' | 'jp', name: string, bio: string }[];
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const entityId = nanoid();
    const primaryName = data.translations.find(t => t.locale === 'en')?.name || data.translations[0]?.name || 'Untitled';
    const processedAvatar = await processImageField(data.avatarUrl, entityId, 'profile', data.isMajor, data.allowMirroring);

    await db.insert(schema.entities).values({
        id: entityId,
        slug: slugify(primaryName),
        type: data.type as any,
        avatarUrl: processedAvatar,
        isMajor: data.isMajor,
        isVerified: data.isVerified,
        allowMirroring: data.allowMirroring,
        socialLinks: data.socialLinks
    });

    for (const trans of data.translations) {
        if (trans.name.trim()) {
            await db.insert(schema.entitiesI18n).values({
                entityId,
                locale: trans.locale,
                name: trans.name,
                bio: trans.bio
            });
        }
    }

    revalidatePath('/admin/entities');
    revalidatePath('/admin');
}

export async function updateFullEntity(id: string, data: {
    type: string;
    avatarUrl: string;
    isMajor: boolean;
    isVerified: boolean;
    allowMirroring: boolean;
    socialLinks: any;
    translations: { locale: 'en' | 'id' | 'jp', name: string, bio: string }[];
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const primaryName = data.translations.find(t => t.locale === 'en')?.name || data.translations[0]?.name || 'Untitled';
    const processedAvatar = await processImageField(data.avatarUrl, id, 'profile', data.isMajor, data.allowMirroring);

    await db.update(schema.entities)
        .set({
            slug: slugify(primaryName),
            type: data.type as any,
            avatarUrl: processedAvatar,
            isMajor: data.isMajor,
            isVerified: data.isVerified,
            allowMirroring: data.allowMirroring,
            socialLinks: data.socialLinks,
            updatedAt: new Date()
        })
        .where(eq(schema.entities.id, id));

    await db.delete(schema.entitiesI18n).where(eq(schema.entitiesI18n.entityId, id));
    for (const trans of data.translations) {
        if (trans.name.trim()) {
            await db.insert(schema.entitiesI18n).values({
                entityId: id,
                locale: trans.locale,
                name: trans.name,
                bio: trans.bio
            });
        }
    }

    revalidatePath('/admin/entities');
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

    revalidatePath('/admin/entities');
    revalidatePath('/admin');
}

// --- COLLECTIONS ---

export async function createFullCollection(data: {
    coverImage: string;
    isMajor: boolean;
    allowMirroring: boolean;
    resonance: number;
    translations: { locale: 'en' | 'id' | 'jp', title: string, description: string }[];
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const id = nanoid();
    const primaryTitle = data.translations.find(t => t.locale === 'en')?.title || data.translations[0]?.title || 'Untitled';
    const processedCover = await processImageField(data.coverImage, id, 'collection', data.isMajor, data.allowMirroring);

    await db.insert(schema.collections).values({
        id,
        slug: slugify(primaryTitle),
        coverImage: processedCover,
        isMajor: data.isMajor,
        allowMirroring: data.allowMirroring,
        resonance: data.resonance
    });

    for (const trans of data.translations) {
        if (trans.title.trim()) {
            await db.insert(schema.collectionsI18n).values({
                collectionId: id,
                locale: trans.locale,
                title: trans.title,
                thesis: trans.description // note: schema uses 'thesis'
            });
        }
    }

    revalidatePath('/admin/collections');
    revalidatePath('/admin');
}

export async function updateFullCollection(id: string, data: {
    coverImage: string;
    isMajor: boolean;
    allowMirroring: boolean;
    resonance: number;
    translations: { locale: 'en' | 'id' | 'jp', title: string, description: string }[];
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const primaryTitle = data.translations.find(t => t.locale === 'en')?.title || data.translations[0]?.title || 'Untitled';
    const processedCover = await processImageField(data.coverImage, id, 'collection', data.isMajor, data.allowMirroring);

    await db.update(schema.collections)
        .set({
            slug: slugify(primaryTitle),
            coverImage: processedCover,
            isMajor: data.isMajor,
            allowMirroring: data.allowMirroring,
            resonance: data.resonance,
            updatedAt: new Date()
        })
        .where(eq(schema.collections.id, id));

    await db.delete(schema.collectionsI18n).where(eq(schema.collectionsI18n.collectionId, id));
    for (const trans of data.translations) {
        if (trans.title.trim()) {
            await db.insert(schema.collectionsI18n).values({
                collectionId: id,
                locale: trans.locale,
                title: trans.title,
                thesis: trans.description // note: schema uses 'thesis'
            });
        }
    }

    revalidatePath('/admin/collections');
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

    revalidatePath('/admin/collections');
    revalidatePath('/admin');
}

// --- ZINES ---

export async function createFullZine(data: {
    artifactId: string;
    author: string;
    resonance: number;
    translations: { locale: 'en' | 'id' | 'jp', content: string }[];
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const id = nanoid();

    await db.insert(schema.zines).values({
        id,
        artifactId: data.artifactId,
        author: data.author,
        resonance: data.resonance,
    });

    for (const trans of data.translations) {
        if (trans.content.trim()) {
            await db.insert(schema.zinesI18n).values({
                zineId: id,
                locale: trans.locale,
                content: trans.content,
            });
        }
    }

    revalidatePath('/admin/zines');
    revalidatePath('/admin');
}

export async function updateFullZine(id: string, data: {
    artifactId: string;
    author: string;
    resonance: number;
    translations: { locale: 'en' | 'id' | 'jp', content: string }[];
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    await db.update(schema.zines)
        .set({
            artifactId: data.artifactId,
            author: data.author,
            resonance: data.resonance,
            updatedAt: new Date()
        })
        .where(eq(schema.zines.id, id));

    await db.delete(schema.zinesI18n).where(eq(schema.zinesI18n.zineId, id));
    for (const trans of data.translations) {
        if (trans.content.trim()) {
            await db.insert(schema.zinesI18n).values({
                zineId: id,
                locale: trans.locale,
                content: trans.content,
            });
        }
    }

    revalidatePath('/admin/zines');
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

    revalidatePath('/admin/zines');
    revalidatePath('/admin');
}

// --- TAGS & VERIFICATIONS ---

export async function createFullTag(data: {
    category: string;
    translations: { locale: 'en' | 'id' | 'jp', name: string }[];
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const tagId = nanoid();

    await db.insert(schema.tags).values({
        id: tagId,
        category: data.category as any,
    });

    for (const trans of data.translations) {
        if (trans.name.trim()) {
            await db.insert(schema.tagsI18n).values({
                tagId,
                locale: trans.locale,
                name: trans.name
            });
        }
    }

    revalidatePath('/admin/tags');
    revalidatePath('/admin');
}

export async function updateFullTag(id: string, data: {
    category: string;
    translations: { locale: 'en' | 'id' | 'jp', name: string }[];
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    await db.update(schema.tags)
        .set({
            category: data.category as any,
            updatedAt: new Date()
        })
        .where(eq(schema.tags.id, id));

    await db.delete(schema.tagsI18n).where(eq(schema.tagsI18n.tagId, id));

    for (const trans of data.translations) {
        if (trans.name.trim()) {
            await db.insert(schema.tagsI18n).values({
                tagId: id,
                locale: trans.locale,
                name: trans.name
            });
        }
    }

    revalidatePath('/admin/tags');
    revalidatePath('/admin');
}

export async function deleteTag(id: string) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    await db.delete(schema.tags).where(eq(schema.tags.id, id));

    revalidatePath('/admin/tags');
    revalidatePath('/admin');
}

export async function createVerification(data: {
    targetId: string;
    targetType: 'artifact' | 'entity';
    r2Key: string;
    grantedBy: string;
    expiresAt?: Date;
    internalNotes: string;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const id = nanoid();

    await db.insert(schema.verificationRegistry).values({
        id,
        targetId: data.targetId,
        targetType: data.targetType,
        r2Key: data.r2Key,
        grantedBy: data.grantedBy,
        expiresAt: data.expiresAt,
        internalNotes: data.internalNotes
    });

    revalidatePath('/admin/verifications');
    revalidatePath('/admin');
}

export async function updateVerification(id: string, data: {
    targetId: string;
    targetType: 'artifact' | 'entity';
    r2Key: string;
    grantedBy: string;
    expiresAt?: Date;
    internalNotes: string;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    await db.update(schema.verificationRegistry)
        .set({
            targetId: data.targetId,
            targetType: data.targetType,
            r2Key: data.r2Key,
            grantedBy: data.grantedBy,
            expiresAt: data.expiresAt,
            internalNotes: data.internalNotes,
            updatedAt: new Date()
        })
        .where(eq(schema.verificationRegistry.id, id));

    revalidatePath('/admin/verifications');
    revalidatePath('/admin');
}

export async function deleteVerification(id: string) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    await db.delete(schema.verificationRegistry).where(eq(schema.verificationRegistry.id, id));

    revalidatePath('/admin/verifications');
    revalidatePath('/admin');
}
