import { pgTable, text, timestamp, integer, boolean, jsonb, primaryKey, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ------------------------------------------------------------------
// 1.5. Media Registry
// ------------------------------------------------------------------
export const media = pgTable("media", {
    id: text("id").primaryKey(), // e.g. MED_xxxx
    type: text("type", { enum: ['image', 'video', 'audio', 'document'] }).notNull(),
    url: text("url").notNull(),     // The public R2 URL
    r2Key: text("r2_key").notNull().unique(), // The internal object key for easy deletion

    // Aesthetic & Technical Metadata
    blurhash: text("blurhash"),     // The blurry placeholder string
    width: integer("width"),
    height: integer("height"),
    sizeBytes: integer("size_bytes"),
    mimeType: text("mime_type").notNull(),

    // Lifecycle Management
    uploaderId: text("uploader_id").notNull(), // will reference users.id below, but users is defined later. We can just keep it as text for now, or use a string to refer to it. Wait, due to circular deps/ordering, I'll just use text(). references(() => users.id)
    isOrphan: boolean("is_orphan").default(true), // True until linked to an Entity/Artifact
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ------------------------------------------------------------------
// 1.8. Tags (Genres, Moods, etc)
// ------------------------------------------------------------------
export const tags = pgTable("tags", {
    id: text("id").primaryKey(),
    category: text("category", { enum: ['genre', 'mood', 'style', 'theme', 'other'] }).default('genre'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const tagsI18n = pgTable("tags_i18n", {
    tagId: text("tag_id").references(() => tags.id, { onDelete: 'cascade' }).notNull(),
    locale: text("locale", { enum: ['en', 'id', 'ja'] }).notNull(),
    name: text("name").notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.tagId, table.locale] }),
    nameIdx: index("idx_tags_i18n_name").on(table.name),
}));

// ------------------------------------------------------------------
// 2. Entities (Creators, Agencies, Studios)
// ------------------------------------------------------------------
export const entities = pgTable("entities", {
    id: text("id").primaryKey(),
    type: text("type", { enum: ['individual', 'organization', 'agency', 'circle'] }).notNull(),
    slug: text("slug").notNull().unique(),
    uid: text("uid").unique(), // e.g. UID_SIG_001
    circuit: text("circuit", { enum: ['major', 'underground', 'archived'] }).default('underground'),
    socialLinks: jsonb("social_links").default([]),
    isVerified: boolean("is_verified").default(false), // Public verification badge
    avatarId: text("avatar_id").references(() => media.id, { onDelete: 'set null' }),
    headerId: text("header_id").references(() => media.id, { onDelete: 'set null' }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// ------------------------------------------------------------------
// 2.5. Users (The People behind the Signal Chain)
// ------------------------------------------------------------------
export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    bio: text("bio"),
    status: text("status"),
    role: text("role", { enum: ['founder', 'architect', 'resident', 'ghost'] }).default('resident').notNull(),
    resonanceMultiplier: integer("resonance_multiplier").default(100), // Dilution factor for Zines
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ------------------------------------------------------------------
// 2.6. Professional Management (The Link between User and Entity)
// ------------------------------------------------------------------
export const entityManagers = pgTable("entity_managers", {
    userId: text("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    entityId: text("entity_id").references(() => entities.id, { onDelete: 'cascade' }).notNull(),
    role: text("role", { enum: ['owner', 'admin', 'editor'] }).default('editor').notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.entityId] }),
}));

export const entitiesI18n = pgTable("entities_i18n", {
    entityId: text("entity_id").references(() => entities.id, { onDelete: 'cascade' }).notNull(),
    locale: text("locale", { enum: ['en', 'id', 'ja'] }).notNull(),
    name: text("name").notNull(),
    status: text("status"),
    bio: text("bio"),
}, (table) => ({
    pk: primaryKey({ columns: [table.entityId, table.locale] }),
    nameIdx: index("idx_entities_i18n_name").on(table.name),
}));

// ------------------------------------------------------------------
// 3. Artifacts (The Content)
// ------------------------------------------------------------------
export const artifacts = pgTable("artifacts", {
    id: text("id").primaryKey(),
    category: text("category", { enum: ['anime', 'music'] }).notNull(),
    slug: text("slug").notNull().unique(),
    status: text("status", { enum: ['the_pit', 'back_alley', 'archived'] }).default('back_alley'),
    score: integer("score").default(0),
    specs: jsonb("specs").default({}),
    isVerified: boolean("is_verified").default(false), // Public verification badge
    coverId: text("cover_id").references(() => media.id, { onDelete: 'set null' }),
    posterId: text("poster_id").references(() => media.id, { onDelete: 'set null' }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
    categoryIdx: index("idx_artifacts_category").on(table.category),
    statusIdx: index("idx_artifacts_status").on(table.status),
}));

export const artifactTags = pgTable("artifact_tags", {
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }).notNull(),
    tagId: text("tag_id").references(() => tags.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.artifactId, table.tagId] }),
}));

export const artifactsI18n = pgTable("artifacts_i18n", {
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }).notNull(),
    locale: text("locale", { enum: ['en', 'id', 'ja'] }).notNull(),
    title: text("title").notNull(),
    description: text("description"),
}, (table) => ({
    pk: primaryKey({ columns: [table.artifactId, table.locale] }),
    titleIdx: index("idx_artifacts_i18n_title").on(table.title),
}));

// ------------------------------------------------------------------
// 4. Collections
// ------------------------------------------------------------------
export const collections = pgTable("collections", {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(), // Added slug
    resonance: integer("resonance").default(0), // Added
    coverId: text("cover_id").references(() => media.id, { onDelete: 'set null' }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const collectionsI18n = pgTable("collections_i18n", {
    collectionId: text("collection_id").references(() => collections.id, { onDelete: 'cascade' }).notNull(),
    locale: text("locale", { enum: ['en', 'id', 'ja'] }).notNull(),
    title: text("title").notNull(),
    thesis: text("thesis"),
}, (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.locale] }),
    titleIdx: index("idx_collections_i18n_title").on(table.title),
}));

export const collectionArtifacts = pgTable("collection_artifacts", {
    collectionId: text("collection_id").references(() => collections.id, { onDelete: 'cascade' }).notNull(),
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }).notNull(),
    position: integer("position").notNull(),
    curatorNote: text("curator_note"), // Keep this simple for now, or move to i18n if needed
}, (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.artifactId] }),
}));

// ------------------------------------------------------------------
// 5. Credits & Resources
// ------------------------------------------------------------------
export const artifactCredits = pgTable("artifact_credits", {
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }).notNull(),
    entityId: text("entity_id").references(() => entities.id, { onDelete: 'cascade' }).notNull(),
    role: text("role").notNull(),
    displayRole: text("display_role"),
    contributorClass: text("contributor_class", {
        enum: ['author', 'collaborator', 'staff']
    }).default('staff').notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    position: integer("position").default(0).notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.artifactId, table.entityId, table.role] }),
}));

export const unitMembers = pgTable("unit_members", {
    unitId: text("unit_id").references(() => entities.id, { onDelete: 'cascade' }).notNull(),
    memberId: text("member_id").references(() => entities.id, { onDelete: 'cascade' }).notNull(),
    memberRole: text("member_role"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
    pk: primaryKey({ columns: [table.unitId, table.memberId] }),
}));
export const artifactResources = pgTable("artifact_resources", {
    id: text("id").primaryKey(),
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }),
    type: text("type").notNull(),
    platform: text("platform").notNull(),
    value: text("value").notNull(), // formerly 'url' & 'external_id' hybrid
    embedData: jsonb("embed_data").default({}),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// --- Artifact Media Junction (Enterprise Bridge) ---
export const artifactMedia = pgTable("artifact_media", {
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }).notNull(),
    mediaId: text("media_id").references(() => media.id, { onDelete: 'cascade' }).notNull(),
    role: text("role").notNull(), // cover, poster, background, logo, gallery
    position: integer("position").default(0).notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    metadata: jsonb("metadata").default({}), // Focal points, CSS coordinates
}, (table) => ({
    pk: primaryKey({ columns: [table.artifactId, table.mediaId, table.role] }),
    artifactRoleIdx: index("idx_artifact_media_role").on(table.artifactId, table.role),
}));

export const artifactMediaRelations = relations(artifactMedia, ({ one }) => ({
    artifact: one(artifacts, {
        fields: [artifactMedia.artifactId],
        references: [artifacts.id],
    }),
    media: one(media, {
        fields: [artifactMedia.mediaId],
        references: [media.id],
    }),
}));

// ------------------------------------------------------------------
// 6. Zines
// ------------------------------------------------------------------
export const zines = pgTable("zines", {

    id: text("id").primaryKey(),
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }),
    authorId: text("author_id").references(() => users.id).notNull(),
    resonance: integer("resonance").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const zinesI18n = pgTable("zines_i18n", {
    zineId: text("zine_id").references(() => zines.id, { onDelete: 'cascade' }).notNull(),
    locale: text("locale", { enum: ['en', 'id', 'ja'] }).notNull(),
    content: text("content").notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.zineId, table.locale] }),
}));

// ------------------------------------------------------------------
// 7. Verification Registry (Internal Audit Trail)
// ------------------------------------------------------------------
export const verificationRegistry = pgTable("verification_registry", {
    id: text("id").primaryKey(),
    targetId: text("target_id").notNull(), // Links to either artifactId or entityId
    targetType: text("target_type", { enum: ['artifact', 'entity', 'role_upgrade'] }).notNull(),
    status: text("status", { enum: ['pending', 'approved', 'rejected'] }).default('pending'),

    // R2 Coordinates
    r2Key: text("r2_key"), // Optional for role upgrades, required for assets

    // Internal Metadata
    issuer: text("issuer"), // User who requested or entity claiming verification
    grantedBy: text("granted_by"), // "Artist Name" or "Company Rep"
    grantedAt: timestamp("granted_at", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }), // For temporary licenses
    internalNotes: text("internal_notes"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
    targetIdx: index("idx_verification_target").on(table.targetType, table.targetId),
}));


// ------------------------------------------------------------------
// RELATIONS
// ------------------------------------------------------------------

// Artifacts
export const artifactsRelations = relations(artifacts, ({ one, many }) => ({
    translations: many(artifactsI18n),
    credits: many(artifactCredits),
    resources: many(artifactResources),
    zines: many(zines),
    collections: many(collectionArtifacts),
    verifications: many(verificationRegistry, {
        relationName: "artifact_verifications"
    }),
    tags: many(artifactTags),
    cover: one(media, {
        fields: [artifacts.coverId],
        references: [media.id],
    }),
    poster: one(media, {
        fields: [artifacts.posterId],
        references: [media.id],
    }),
}));

export const artifactsI18nRelations = relations(artifactsI18n, ({ one }) => ({
    artifact: one(artifacts, {
        fields: [artifactsI18n.artifactId],
        references: [artifacts.id],
    }),
}));

// Entities
export const entitiesRelations = relations(entities, ({ one, many }) => ({
    translations: many(entitiesI18n),
    credits: many(artifactCredits),
    verifications: many(verificationRegistry, {
        relationName: "entity_verifications"
    }),
    managers: many(entityManagers),
    members: many(unitMembers, { relationName: "unit_members" }),
    units: many(unitMembers, { relationName: "member_units" }),
    avatar: one(media, {
        fields: [entities.avatarId],
        references: [media.id],
    }),
    header: one(media, {
        fields: [entities.headerId],
        references: [media.id],
    }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
    uploader: one(users, {
        fields: [media.uploaderId],
        references: [users.id],
    }),
}));

export const unitMembersRelations = relations(unitMembers, ({ one }) => ({
    unit: one(entities, {
        fields: [unitMembers.unitId],
        references: [entities.id],
        relationName: "unit_members",
    }),
    member: one(entities, {
        fields: [unitMembers.memberId],
        references: [entities.id],
        relationName: "member_units",
    }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    managedEntities: many(entityManagers),
}));

export const entitiesI18nRelations = relations(entitiesI18n, ({ one }) => ({
    entity: one(entities, {
        fields: [entitiesI18n.entityId],
        references: [entities.id],
    }),
}));

export const entityManagersRelations = relations(entityManagers, ({ one }) => ({
    user: one(users, {
        fields: [entityManagers.userId],
        references: [users.id],
    }),
    entity: one(entities, {
        fields: [entityManagers.entityId],
        references: [entities.id],
    }),
}));

// Collections
export const collectionsRelations = relations(collections, ({ one, many }) => ({
    translations: many(collectionsI18n),
    artifacts: many(collectionArtifacts),
    cover: one(media, {
        fields: [collections.coverId],
        references: [media.id],
    }),
}));

export const collectionsI18nRelations = relations(collectionsI18n, ({ one }) => ({
    collection: one(collections, {
        fields: [collectionsI18n.collectionId],
        references: [collections.id],
    }),
}));

export const collectionArtifactsRelations = relations(collectionArtifacts, ({ one }) => ({
    collection: one(collections, {
        fields: [collectionArtifacts.collectionId],
        references: [collections.id],
    }),
    artifact: one(artifacts, {
        fields: [collectionArtifacts.artifactId],
        references: [artifacts.id],
    }),
}));

// Zines
export const zinesRelations = relations(zines, ({ one, many }) => ({
    translations: many(zinesI18n),
    artifact: one(artifacts, {
        fields: [zines.artifactId],
        references: [artifacts.id],
    }),
    author: one(users, {
        fields: [zines.authorId],
        references: [users.id],
    }),
}));

export const zinesI18nRelations = relations(zinesI18n, ({ one }) => ({
    zine: one(zines, {
        fields: [zinesI18n.zineId],
        references: [zines.id],
    }),
}));

// Credits & Resources
export const artifactCreditsRelations = relations(artifactCredits, ({ one }) => ({
    artifact: one(artifacts, {
        fields: [artifactCredits.artifactId],
        references: [artifacts.id],
    }),
    entity: one(entities, {
        fields: [artifactCredits.entityId],
        references: [entities.id],
    }),
}));

export const artifactResourcesRelations = relations(artifactResources, ({ one }) => ({
    artifact: one(artifacts, {
        fields: [artifactResources.artifactId],
        references: [artifacts.id],
    }),
}));

// Verification Registry
export const verificationRegistryRelations = relations(verificationRegistry, ({ one }) => ({
    artifact: one(artifacts, {
        fields: [verificationRegistry.targetId],
        references: [artifacts.id],
        relationName: "artifact_verifications"
    }),
    entity: one(entities, {
        fields: [verificationRegistry.targetId],
        references: [entities.id],
        relationName: "entity_verifications"
    }),
}));

// ------------------------------------------------------------------
// 9. Relations for Tags
// ------------------------------------------------------------------
export const tagsRelations = relations(tags, ({ many }) => ({
    translations: many(tagsI18n),
    artifacts: many(artifactTags),
}));

export const tagsI18nRelations = relations(tagsI18n, ({ one }) => ({
    tag: one(tags, {
        fields: [tagsI18n.tagId],
        references: [tags.id],
    }),
}));

export const artifactTagsRelations = relations(artifactTags, ({ one }) => ({
    artifact: one(artifacts, {
        fields: [artifactTags.artifactId],
        references: [artifacts.id],
    }),
    tag: one(tags, {
        fields: [artifactTags.tagId],
        references: [tags.id],
    }),
}));
