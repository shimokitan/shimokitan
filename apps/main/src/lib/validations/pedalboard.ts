
import { z } from 'zod';

// --- Shared Constants (Matching DB Schema) ---
export const LOCALES = ['en', 'id', 'ja'] as const;
export const ENTITY_TYPES = ['individual', 'organization', 'agency', 'circle'] as const;
export const CONTRIBUTOR_CLASSES = ['author', 'collaborator', 'staff'] as const;

export const ARTIFACT_CATEGORIES = ['anime', 'music'] as const;
export const ARTIFACT_STATUSES = ['the_pit', 'back_alley', 'archived'] as const;
export const ARTIFACT_NATURES = ['original', 'cover', 'live', 'compilation'] as const;
export const ANIME_TYPES = ['pv', 'mv', 'trailer', 'op', 'ed', 'special'] as const;
export const HOSTING_STATUSES = ['unhosted', 'pending_rights', 'rights_granted', 'hosted', 'rights_revoked'] as const;

export const TAG_CATEGORIES = ['genre', 'mood', 'style', 'theme', 'other', 'identity'] as const;
export const VERIFICATION_TARGET_TYPES = ['artifact', 'entity', 'role_upgrade'] as const;
export const VERIFICATION_STATUSES = ['pending', 'approved', 'rejected'] as const;
 
 /**
  * Managed Credit Roles (Departments)
  * Centralized registry for consistent data and i18n.
  */
 export const CREDIT_ROLES = [
     { slug: 'vocal', labels: { en: 'Vocals', ja: 'ボーカル' } },
     { slug: 'illust', labels: { en: 'Art / Illustration', ja: 'イラスト' } },
     { slug: 'video', labels: { en: 'Video / Animation', ja: '映像' } },
     { slug: 'lyrics', labels: { en: 'Lyrics', ja: '作詞' } },
     { slug: 'compose', labels: { en: 'Composition', ja: '作曲' } },
     { slug: 'arrange', labels: { en: 'Arrangement', ja: '編曲' } },
     { slug: 'mix', labels: { en: 'Mixing / Mastering', ja: 'ミキシング' } },
     { slug: 'storyboard', labels: { en: 'Storyboard', ja: '絵コンテ' } },
     { slug: 'direction', labels: { en: 'Direction', ja: '演出 / 監督' } },
     { slug: 'label', labels: { en: 'Record Label', ja: 'レーベル' } },
     { slug: 'studio', labels: { en: 'Production Studio', ja: '制作スタジオ' } },
     { slug: 'original', labels: { en: 'Original / Source', ja: '原作者 / 本家' } },
     { slug: 'other', labels: { en: 'Other / Custom', ja: 'その他' } },
 ] as const;
 
 export type CreditRoleSlug = (typeof CREDIT_ROLES)[number]['slug'];


// --- Shared Helpers ---

const translationSchema = z.object({
    locale: z.enum(LOCALES),
    name: z.string().optional(),
    title: z.string().optional(),
    status: z.string().optional().nullable(),
    description: z.string().optional(),
    bio: z.string().optional(),
    content: z.string().optional(),
    thesis: z.string().optional(),
}).passthrough();

export const RESOURCE_PLATFORMS = ['youtube', 'spotify', 'soundcloud', 'apple_music', 'bilibili', 'niconico', 'twitter', 'instagram', 'tiktok', 'r2', 'other'] as const;
export const RESOURCE_ROLES = ['stream', 'embed_video', 'hosted_audio', 'download', 'social', 'reference'] as const;

const resourceSchema = z.object({
    platform: z.enum(RESOURCE_PLATFORMS),
    url: z.string().url(),
    role: z.enum(RESOURCE_ROLES).default('stream'),
    isPrimary: z.boolean().default(false),
});



export const creditSchema = z.object({
    entityId: z.string().optional().nullable(),
    manualName: z.string().optional().nullable(),
    role: z.string().min(1),
    displayRole: z.string().optional().nullable(),
    contributorClass: z.enum(CONTRIBUTOR_CLASSES).default('staff'),
    isPrimary: z.boolean().default(false),
    isOriginalArtist: z.boolean().default(false),
    position: z.number().default(0),
}).superRefine((data, ctx) => {
    if (!data.entityId && !data.manualName) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Credit must have either a Resident or an Encrypted Name.",
            path: ['manualName']
        });
    }
});

const tagRefSchema = z.object({
    name: z.string().min(1),
});

const unitMemberSchema = z.object({
    memberId: z.string().min(1),
    memberRole: z.string().optional(),
});

// --- Main Schemas ---

export const entitySchema = z.object({
    type: z.enum(ENTITY_TYPES),
    uid: z.string().optional().nullable(),
    isVerified: z.boolean().default(false),
    isEncrypted: z.boolean().default(false),
    avatarId: z.string().optional().nullable(),
    thumbnailId: z.string().optional().nullable(),
    socialLinks: z.any().optional(), // JSON
    translations: z.array(translationSchema).optional(),
    members: z.array(unitMemberSchema).optional(),
    tags: z.array(tagRefSchema).optional(),
});

export const artifactSchema = z.object({
    id: z.string().optional(),
    category: z.enum(ARTIFACT_CATEGORIES),
    nature: z.enum(ARTIFACT_NATURES).default('original'),
    sourceArtifactId: z.string().optional().nullable(),
    animeType: z.enum(ANIME_TYPES).optional().nullable(),
    hostingStatus: z.enum(HOSTING_STATUSES).default('unhosted'),

    status: z.enum(ARTIFACT_STATUSES).default('back_alley'),
    specs: z.any().optional(), // JSON
    verificationId: z.string().optional(), // Link to pending proof
    thumbnailId: z.string().optional().nullable(),
    posterId: z.string().optional().nullable(),
    translations: z.array(translationSchema).optional(),

    resources: z.array(resourceSchema).optional(),
    credits: z.array(creditSchema).optional(),
    tags: z.array(tagRefSchema).optional(),
});

export const collectionSchema = z.object({
    resonance: z.number().optional(),
    coverId: z.string().optional().nullable(),
    translations: z.array(translationSchema).optional(),
});

export const zineSchema = z.object({
    artifactId: z.string().min(1),
    authorId: z.string().min(1),
    resonance: z.number().optional(),
    translations: z.array(translationSchema).optional(),
});

export const tagSchema = z.object({
    category: z.enum(TAG_CATEGORIES),
    translations: z.array(translationSchema).optional(),
});

export const verificationSchema = z.object({
    targetId: z.string().min(1),
    targetType: z.enum(VERIFICATION_TARGET_TYPES),
    status: z.enum(VERIFICATION_STATUSES).default('pending'),
    issuer: z.string().min(1),
    r2Key: z.string().optional(),
    grantedBy: z.string().optional(),
    expiresAt: z.union([z.string(), z.date()]).optional(),
    internalNotes: z.string().optional(),
});

// --- Types ---
export type EntityInput = z.infer<typeof entitySchema>;
export type ArtifactInput = z.infer<typeof artifactSchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
export type ZineInput = z.infer<typeof zineSchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type VerificationInput = z.infer<typeof verificationSchema>;
