import { pgTable, text, timestamp, integer, boolean, jsonb, primaryKey, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";


// ------------------------------------------------------------------
// 2. Entities (Creators, Agencies, Studios)
// ------------------------------------------------------------------
export const entities = pgTable("entities", {
    id: text("id").primaryKey(),
    type: text("type", { enum: ['individual', 'organization', 'agency', 'circle', 'staff'] }).notNull(),
    slug: text("slug").notNull().unique(),
    uid: text("uid").unique(), // e.g. UID_SIG_001
    circuit: text("circuit", { enum: ['major', 'underground', 'ghost'] }).default('underground'),
    avatarUrl: text("avatar_url"),
    socialLinks: jsonb("social_links").default([]),
    isMajor: boolean("is_major").default(false), // Legacy, kept for compatibility
    isVerified: boolean("is_verified").default(false), // Public verification badge
    allowMirroring: boolean("allow_mirroring").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const entitiesI18n = pgTable("entities_i18n", {
    entityId: text("entity_id").references(() => entities.id, { onDelete: 'cascade' }).notNull(),
    locale: text("locale", { enum: ['en', 'id', 'jp'] }).notNull(),
    name: text("name").notNull(),
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
    coverImage: text("cover_image"),
    status: text("status", { enum: ['the_pit', 'back_alley', 'archived'] }).default('back_alley'),
    score: integer("score").default(0),
    specs: jsonb("specs").default({}),
    isMajor: boolean("is_major").default(false),
    isVerified: boolean("is_verified").default(false), // Public verification badge
    allowMirroring: boolean("allow_mirroring").default(false), // e.g. for centralized databases
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
    categoryIdx: index("idx_artifacts_category").on(table.category),
    statusIdx: index("idx_artifacts_status").on(table.status),
}));

export const artifactsI18n = pgTable("artifacts_i18n", {
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }).notNull(),
    locale: text("locale", { enum: ['en', 'id', 'jp'] }).notNull(),
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
    coverImage: text("cover_image"),
    isMajor: boolean("is_major").default(false), // Added
    allowMirroring: boolean("allow_mirroring").default(false), // Added
    resonance: integer("resonance").default(0), // Added
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const collectionsI18n = pgTable("collections_i18n", {
    collectionId: text("collection_id").references(() => collections.id, { onDelete: 'cascade' }).notNull(),
    locale: text("locale", { enum: ['en', 'id', 'jp'] }).notNull(),
    title: text("title").notNull(),
    thesis: text("thesis"),
}, (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.locale] }),
    titleIdx: index("idx_collections_i18n_title").on(table.title),
}));

export const collectionArtifacts = pgTable("collection_artifacts", {
    collectionId: text("collection_id").references(() => collections.id, { onDelete: 'cascade' }),
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }),
    position: integer("position").notNull(),
    curatorNote: text("curator_note"), // Keep this simple for now, or move to i18n if needed
}, (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.artifactId] }),
}));

// ------------------------------------------------------------------
// 5. Credits & Resources
// ------------------------------------------------------------------
export const artifactCredits = pgTable("artifact_credits", {
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }),
    entityId: text("entity_id").references(() => entities.id, { onDelete: 'cascade' }),
    role: text("role").notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.artifactId, table.entityId, table.role] }),
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

// ------------------------------------------------------------------
// 6. Zines
// ------------------------------------------------------------------
export const zines = pgTable("zines", {
    id: text("id").primaryKey(),
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }),
    author: text("author").notNull(),
    resonance: integer("resonance").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const zinesI18n = pgTable("zines_i18n", {
    zineId: text("zine_id").references(() => zines.id, { onDelete: 'cascade' }).notNull(),
    locale: text("locale", { enum: ['en', 'id', 'jp'] }).notNull(),
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
    targetType: text("target_type", { enum: ['artifact', 'entity'] }).notNull(),

    // R2 Coordinates
    r2Key: text("r2_key").notNull(), // The filename/path in your private R2 bucket

    // Internal Metadata
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
export const artifactsRelations = relations(artifacts, ({ many }) => ({
    translations: many(artifactsI18n),
    credits: many(artifactCredits),
    resources: many(artifactResources),
    zines: many(zines),
    collections: many(collectionArtifacts),
    verifications: many(verificationRegistry, {
        relationName: "artifact_verifications"
    }),
    tags: many(artifactTags),
}));

export const artifactsI18nRelations = relations(artifactsI18n, ({ one }) => ({
    artifact: one(artifacts, {
        fields: [artifactsI18n.artifactId],
        references: [artifacts.id],
    }),
}));

// Entities
export const entitiesRelations = relations(entities, ({ many }) => ({
    translations: many(entitiesI18n),
    credits: many(artifactCredits),
    verifications: many(verificationRegistry, {
        relationName: "entity_verifications"
    }),
}));

export const entitiesI18nRelations = relations(entitiesI18n, ({ one }) => ({
    entity: one(entities, {
        fields: [entitiesI18n.entityId],
        references: [entities.id],
    }),
}));

// Collections
export const collectionsRelations = relations(collections, ({ many }) => ({
    translations: many(collectionsI18n),
    artifacts: many(collectionArtifacts),
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
    }),
    entity: one(entities, {
        fields: [verificationRegistry.targetId],
        references: [entities.id],
    }),
}));

// ------------------------------------------------------------------
// 8. Tags (Genres, Moods, etc)
// ------------------------------------------------------------------
export const tags = pgTable("tags", {
    id: text("id").primaryKey(),
    category: text("category", { enum: ['genre', 'mood', 'style', 'theme', 'other'] }).default('genre'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const tagsI18n = pgTable("tags_i18n", {
    tagId: text("tag_id").references(() => tags.id, { onDelete: 'cascade' }).notNull(),
    locale: text("locale", { enum: ['en', 'id', 'jp'] }).notNull(),
    name: text("name").notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.tagId, table.locale] }),
    nameIdx: index("idx_tags_i18n_name").on(table.name),
}));

export const artifactTags = pgTable("artifact_tags", {
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }).notNull(),
    tagId: text("tag_id").references(() => tags.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.artifactId, table.tagId] }),
}));

// 9. Relations for Tags
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
