import { pgTable, text, timestamp, integer, boolean, jsonb, primaryKey, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// 1. Residents (Coming Soon Users)
export const residents = pgTable("residents", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 2. Entities (Creators, Agencies, Studios)
export const entities = pgTable("entities", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type", { enum: ['individual', 'organization', 'agency', 'circle', 'staff'] }).notNull(),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    socialLinks: jsonb("social_links").default({}),
    isMajor: boolean("is_major").default(false),
    allowMirroring: boolean("allow_mirroring").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// 3. Artifacts (The Content)
export const artifacts = pgTable("artifacts", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    category: text("category", { enum: ['anime', 'music', 'vtuber', 'asmr', 'zine', 'art', 'game'] }).notNull(),
    description: text("description"),
    coverImage: text("cover_image"),
    status: text("status", { enum: ['the_pit', 'back_alley', 'archived'] }).default('back_alley'),
    score: integer("score").default(0),
    specs: jsonb("specs").default({}),
    isMajor: boolean("is_major").default(false),
    allowMirroring: boolean("allow_mirroring").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
    categoryIdx: index("idx_artifacts_category").on(table.category),
    statusIdx: index("idx_artifacts_status").on(table.status),
}));

// 4. Collections
export const collections = pgTable("collections", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    thesis: text("thesis"),
    coverImage: text("cover_image"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const collectionArtifacts = pgTable("collection_artifacts", {
    collectionId: text("collection_id").references(() => collections.id, { onDelete: 'cascade' }),
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }),
    position: integer("position").notNull(),
    curatorNote: text("curator_note"),
}, (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.artifactId] }),
}));

// 5. Credits & Resources
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
    externalId: text("external_id"),
    url: text("url").notNull(),
    embedData: jsonb("embed_data").default({}),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 6. Zines
export const zines = pgTable("zines", {
    id: text("id").primaryKey(),
    artifactId: text("artifact_id").references(() => artifacts.id, { onDelete: 'cascade' }),
    author: text("author").notNull(),
    content: text("content").notNull(),
    resonance: integer("resonance").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// Schemas for validation
export const insertResidentSchema = createInsertSchema(residents).pick({ email: true }).extend({
    email: z.string().email("INVALID_ENDPOINT_FORMAT"),
});
export const selectResidentSchema = createSelectSchema(residents);

// --- RELATIONS ---
import { relations } from "drizzle-orm";

export const artifactsRelations = relations(artifacts, ({ many }) => ({
    credits: many(artifactCredits),
    resources: many(artifactResources),
    zines: many(zines),
    collections: many(collectionArtifacts),
}));

export const zinesRelations = relations(zines, ({ one }) => ({
    artifact: one(artifacts, {
        fields: [zines.artifactId],
        references: [artifacts.id],
    }),
}));

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

export const entitiesRelations = relations(entities, ({ many }) => ({
    credits: many(artifactCredits),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
    artifacts: many(collectionArtifacts),
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
