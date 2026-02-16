
"use server"

import { getDb, schema } from '@shimokitan/db';
import { sql, eq, isNotNull, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { nanoid, extractMediaId, getThumbnailUrl, _ } from '@shimokitan/utils';
import { uploadImageFromUrl } from '@/lib/r2';

async function processImageField(url: string, id: string, type: 'artifact' | 'zine' | 'profile' | 'collection', isMajor: boolean = false, allowMirroring: boolean = false) {
    if (!url || !url.startsWith('http')) return url;

    // Safety check: Never upload if major OR if mirroring permission is denied
    if (isMajor || !allowMirroring) return url;

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
        category,
        coverImage,
        status,
        score,
    });

    await db.insert(schema.artifactsI18n).values({
        artifactId: id,
        locale: 'en',
        title,
        description,
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
        type,
        avatarUrl,
    });

    await db.insert(schema.entitiesI18n).values({
        entityId: id,
        locale: 'en',
        name,
        bio,
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
        coverImage,
    });

    await db.insert(schema.collectionsI18n).values({
        collectionId: id,
        locale: 'en',
        title,
        thesis,
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
        resonance,
    });

    await db.insert(schema.zinesI18n).values({
        zineId: id,
        locale: 'en',
        content,
    });

    revalidatePath('/admin');
}

async function syncTags(db: any, artifactId: string, tags: { name: string }[], locale: string) {
    if (!tags || tags.length === 0) return;

    for (const tag of tags) {
        let tagId: string;
        // Try to find a tag by name in the current locale
        const existingTagI18n = await db.query.tagsI18n.findFirst({
            where: and(eq(schema.tagsI18n.locale, locale as any), eq(schema.tagsI18n.name, tag.name))
        });

        if (existingTagI18n) {
            tagId = existingTagI18n.tagId;
        } else {
            tagId = nanoid();
            await db.insert(schema.tags).values({ id: tagId });
            await db.insert(schema.tagsI18n).values({ tagId, locale, name: tag.name });
        }

        await db.insert(schema.artifactTags).values({ artifactId, tagId }).onConflictDoNothing();
    }
}

// Complex Actions
export async function createFullArtifact(data: {
    title: string;

    category: string;
    description: string;
    coverImage: string;
    status: string;
    score: number;
    isMajor: boolean;
    isVerified: boolean;
    allowMirroring: boolean;
    resources: any[];
    credits: any[];
    specs: Record<string, string>;
    tags: { name: string }[];
    locale?: string;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const artifactId = nanoid();
    const locale = (data.locale as any) || 'en';
    let coverUrl = data.coverImage;

    if (!coverUrl) {
        const primaryRes = data.resources.find(r => r.isPrimary) || data.resources[0];
        if (primaryRes) {
            const extId = extractMediaId(primaryRes.url, primaryRes.platform);
            const thumb = getThumbnailUrl(extId, primaryRes.platform);
            if (thumb) coverUrl = thumb;
        }
    }

    const processedCover = await processImageField(coverUrl, artifactId, 'artifact', data.isMajor, data.allowMirroring);

    await db.insert(schema.artifacts).values({
        id: artifactId,
        category: data.category as any,
        coverImage: processedCover,
        status: data.status as any,
        score: data.score,
        specs: data.specs,
        isMajor: data.isMajor,
        isVerified: data.isVerified,
        allowMirroring: data.allowMirroring
    });

    await db.insert(schema.artifactsI18n).values({
        artifactId,
        locale,
        title: data.title,
        description: data.description,
    });

    await syncTags(db, artifactId, data.tags, locale);

    if (data.resources.length > 0) {
        for (const res of data.resources) {
            const externalId = extractMediaId(res.url, res.platform);
            await db.insert(schema.artifactResources).values({
                id: nanoid(),
                artifactId: artifactId,
                type: res.type,
                platform: res.platform,
                value: res.url,
                isPrimary: res.isPrimary
            });
        }
    }

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

export async function updateFullArtifact(id: string, data: {
    title: string;
    category: string;
    description: string;
    coverImage: string;
    status: string;
    score: number;
    isMajor: boolean;
    isVerified: boolean;
    allowMirroring: boolean;
    resources: any[];
    credits: any[];
    specs: Record<string, string>;
    tags: { name: string }[];
    locale?: string;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const locale = (data.locale as any) || 'en';
    const processedCover = await processImageField(data.coverImage, id, 'artifact', data.isMajor, data.allowMirroring);

    await db.update(schema.artifacts)
        .set({
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

    await db.insert(schema.artifactsI18n)
        .values({
            artifactId: id,
            locale,
            title: data.title,
            description: data.description,
        })
        .onConflictDoUpdate({
            target: [schema.artifactsI18n.artifactId, schema.artifactsI18n.locale],
            set: {
                title: data.title,
                description: data.description,
            }
        });

    await db.delete(schema.artifactTags).where(eq(schema.artifactTags.artifactId, id));
    await syncTags(db, id, data.tags, locale);

    await db.delete(schema.artifactResources).where(eq(schema.artifactResources.artifactId, id));
    if (data.resources.length > 0) {
        for (const res of data.resources) {
            const externalId = extractMediaId(res.url, res.platform);
            await db.insert(schema.artifactResources).values({
                id: nanoid(),
                artifactId: id,
                type: res.type,
                platform: res.platform,
                value: res.url,
                isPrimary: res.isPrimary
            });
        }
    }

    await db.delete(schema.artifactCredits).where(eq(schema.artifactCredits.artifactId, id));
    if (data.credits.length > 0) {
        for (const cred of data.credits) {
            await db.insert(schema.artifactCredits).values({
                artifactId: id,
                entityId: cred.entityId,
                role: cred.role
            });
        }
    }

    revalidatePath('/artifacts');
    revalidatePath(`/artifacts/${id}`);
    revalidatePath('/admin/artifacts');
    revalidatePath('/admin');
}

export async function updateFullEntity(id: string, data: {
    name: string;
    type: string;
    bio: string;
    avatarUrl: string;
    isMajor: boolean;
    isVerified: boolean;
    allowMirroring: boolean;
    socialLinks: any[];
    locale?: string;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const locale = (data.locale as any) || 'en';
    const processedAvatar = await processImageField(data.avatarUrl, id, 'profile', data.isMajor, data.allowMirroring);

    await db.update(schema.entities)
        .set({
            type: data.type as any,
            avatarUrl: processedAvatar,
            isMajor: data.isMajor,
            isVerified: data.isVerified,
            allowMirroring: data.allowMirroring,
            socialLinks: data.socialLinks,
            updatedAt: new Date()
        })
        .where(eq(schema.entities.id, id));

    await db.insert(schema.entitiesI18n)
        .values({
            entityId: id,
            locale,
            name: data.name,
            bio: data.bio,
        })
        .onConflictDoUpdate({
            target: [schema.entitiesI18n.entityId, schema.entitiesI18n.locale],
            set: {
                name: data.name,
                bio: data.bio,
            }
        });

    revalidatePath('/entities');
    revalidatePath(`/entities/${id}`);
    revalidatePath('/admin/entities');
    revalidatePath('/admin');
}

export async function createFullEntity(data: {
    name: string;
    type: string;
    bio: string;
    avatarUrl: string;
    isMajor: boolean;
    isVerified: boolean;
    allowMirroring: boolean;
    socialLinks: any[];
    locale?: string;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const entityId = nanoid();
    const locale = (data.locale as any) || 'en';
    const processedAvatar = await processImageField(data.avatarUrl, entityId, 'profile', data.isMajor, data.allowMirroring);

    await db.insert(schema.entities).values({
        id: entityId,
        type: data.type as any,
        avatarUrl: processedAvatar,
        isMajor: data.isMajor,
        isVerified: data.isVerified,
        allowMirroring: data.allowMirroring,
        socialLinks: data.socialLinks
    });

    await db.insert(schema.entitiesI18n).values({
        entityId,
        locale,
        name: data.name,
        bio: data.bio,
    });

    revalidatePath('/entities');
    revalidatePath('/admin/entities');
    revalidatePath('/admin');
}

export async function createFullCollection(data: {
    title: string;
    thesis: string;
    coverImage: string;
    locale?: string;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const collectionId = nanoid();
    const locale = (data.locale as any) || 'en';
    const processedCover = await processImageField(data.coverImage, collectionId, 'collection');

    await db.insert(schema.collections).values({
        id: collectionId,
        coverImage: processedCover,
    });

    await db.insert(schema.collectionsI18n).values({
        collectionId,
        locale,
        title: data.title,
        thesis: data.thesis,
    });

    revalidatePath('/collections');
    revalidatePath('/admin/collections');
    revalidatePath('/admin');
}

export async function updateFullCollection(id: string, data: {
    title: string;
    thesis: string;
    coverImage: string;
    locale?: string;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const locale = (data.locale as any) || 'en';
    const processedCover = await processImageField(data.coverImage, id, 'collection');

    await db.update(schema.collections)
        .set({
            coverImage: processedCover,
            updatedAt: new Date()
        })
        .where(eq(schema.collections.id, id));

    await db.insert(schema.collectionsI18n)
        .values({
            collectionId: id,
            locale,
            title: data.title,
            thesis: data.thesis,
        })
        .onConflictDoUpdate({
            target: [schema.collectionsI18n.collectionId, schema.collectionsI18n.locale],
            set: {
                title: data.title,
                thesis: data.thesis,
            }
        });

    revalidatePath('/collections');
    revalidatePath(`/collections/${id}`);
    revalidatePath('/admin/collections');
    revalidatePath('/admin');
}

export async function updateCollection(id: string, formData: FormData) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const locale = (formData.get('locale') as any) || 'en';
    const title = formData.get('title') as string;
    const thesis = formData.get('thesis') as string;
    let coverImage = formData.get('coverImage') as string;

    coverImage = await processImageField(coverImage, id, 'collection');

    await db.update(schema.collections)
        .set({
            coverImage,
            updatedAt: new Date()
        })
        .where(eq(schema.collections.id, id));

    await db.insert(schema.collectionsI18n)
        .values({
            collectionId: id,
            locale,
            title,
            thesis,
        })
        .onConflictDoUpdate({
            target: [schema.collectionsI18n.collectionId, schema.collectionsI18n.locale],
            set: {
                title,
                thesis,
            }
        });

    revalidatePath('/admin');
    revalidatePath(`/collections/${id}`);
}

export async function createFullZine(data: {
    artifactId: string;
    author: string;
    content: string;
    resonance: number;
    locale?: string;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const zineId = nanoid();
    const locale = (data.locale as any) || 'en';

    await db.insert(schema.zines).values({
        id: zineId,
        artifactId: data.artifactId,
        author: data.author,
        resonance: data.resonance,
    });

    await db.insert(schema.zinesI18n).values({
        zineId,
        locale,
        content: data.content,
    });

    revalidatePath('/zines');
    revalidatePath('/admin/zines');
    revalidatePath('/admin');
}

export async function updateFullZine(id: string, data: {
    artifactId: string;
    author: string;
    content: string;
    resonance: number;
    locale?: string;
}) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const locale = (data.locale as any) || 'en';

    await db.update(schema.zines)
        .set({
            artifactId: data.artifactId,
            author: data.author,
            resonance: data.resonance,
            updatedAt: new Date()
        })
        .where(eq(schema.zines.id, id));

    await db.insert(schema.zinesI18n)
        .values({
            zineId: id,
            locale,
            content: data.content,
        })
        .onConflictDoUpdate({
            target: [schema.zinesI18n.zineId, schema.zinesI18n.locale],
            set: { content: data.content }
        });

    revalidatePath('/zines');
    revalidatePath(`/zines/${id}`);
    revalidatePath('/admin/zines');
    revalidatePath('/admin');
}

export async function updateZine(id: string, formData: FormData) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const locale = (formData.get('locale') as any) || 'en';
    const artifactId = formData.get('artifactId') as string;
    const author = formData.get('author') as string;
    const content = formData.get('content') as string;
    const resonance = parseInt(formData.get('resonance') as string || '0');

    await db.update(schema.zines)
        .set({
            artifactId,
            author,
            resonance,
            updatedAt: new Date()
        })
        .where(eq(schema.zines.id, id));

    await db.insert(schema.zinesI18n)
        .values({
            zineId: id,
            locale,
            content,
        })
        .onConflictDoUpdate({
            target: [schema.zinesI18n.zineId, schema.zinesI18n.locale],
            set: { content }
        });

    revalidatePath('/admin');
    revalidatePath('/zines');
}

export async function deleteArtifact(id: string) {
    const db = getDb();
    if (!db) throw new Error("DB_NOT_INITIALIZED");

    const item = await db.query.artifacts.findFirst({
        where: eq(schema.artifacts.id, id)
    });

    if (!item) return;

    if (item.deletedAt) {
        // Permanent Delete - cascade will handle i18n
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
