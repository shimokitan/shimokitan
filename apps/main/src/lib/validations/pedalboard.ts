
import { z } from 'zod';

// --- Shared Constants (Matching DB Schema) ---
export const LOCALES = ['en', 'id', 'ja'] as const;
export const ENTITY_TYPES = ['individual', 'organization', 'agency', 'circle'] as const;
export const CONTRIBUTOR_CLASSES = ['author', 'collaborator', 'staff'] as const;

export const ARTIFACT_CATEGORIES = ['anime', 'music'] as const;
export const ARTIFACT_STATUSES = ['the_pit', 'back_alley', 'archived'] as const;
export const TAG_CATEGORIES = ['genre', 'mood', 'style', 'theme', 'other'] as const;
export const VERIFICATION_TARGET_TYPES = ['artifact', 'entity', 'role_upgrade'] as const;
export const VERIFICATION_STATUSES = ['pending', 'approved', 'rejected'] as const;
export const CIRCUITS = ['major', 'underground', 'archived'] as const;

// --- Shared Helpers ---

const translationSchema = z.object({
    locale: z.enum(LOCALES),
    name: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    bio: z.string().optional(),
    content: z.string().optional(),
    thesis: z.string().optional(),
}).passthrough();

const resourceSchema = z.object({
    type: z.string().min(1),
    platform: z.string().min(1),
    url: z.string().url(),
    isPrimary: z.boolean().default(false),
});

const creditSchema = z.object({
    entityId: z.string().min(1),
    role: z.string().min(1),
    displayRole: z.string().optional().nullable(),
    contributorClass: z.enum(CONTRIBUTOR_CLASSES).default('staff'),
    isPrimary: z.boolean().default(false),
    position: z.number().default(0),
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
    circuit: z.enum(CIRCUITS).default('underground'),
    isVerified: z.boolean().default(false),
    avatarId: z.string().optional().nullable(),
    headerId: z.string().optional().nullable(),
    socialLinks: z.any().optional(), // JSON
    translations: z.array(translationSchema).optional(),
    members: z.array(unitMemberSchema).optional(),
});

export const artifactSchema = z.object({
    id: z.string().optional(),
    category: z.enum(ARTIFACT_CATEGORIES),

    status: z.enum(ARTIFACT_STATUSES).default('back_alley'),
    score: z.number().optional(),
    specs: z.any().optional(), // JSON
    isVerified: z.boolean().default(false),
    verificationId: z.string().optional(), // Link to pending proof
    coverId: z.string().optional().nullable(),
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
