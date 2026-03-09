DROP TABLE IF EXISTS "artifact_media";--> statement-breakpoint
DROP TABLE IF EXISTS "verification_registry";--> statement-breakpoint
CREATE TYPE "public"."anime_type" AS ENUM('pv', 'mv', 'trailer', 'op', 'ed', 'special');--> statement-breakpoint
CREATE TYPE "public"."artifact_category" AS ENUM('music', 'anime');--> statement-breakpoint
CREATE TYPE "public"."artifact_media_role" AS ENUM('cover', 'poster', 'background', 'logo', 'gallery');--> statement-breakpoint
CREATE TYPE "public"."artifact_nature" AS ENUM('original', 'cover', 'live', 'compilation');--> statement-breakpoint
CREATE TYPE "public"."artifact_status" AS ENUM('the_pit', 'back_alley', 'archived');--> statement-breakpoint
CREATE TYPE "public"."contributor_class" AS ENUM('author', 'collaborator', 'staff');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('individual', 'organization', 'agency', 'circle');--> statement-breakpoint
CREATE TYPE "public"."hosting_status" AS ENUM('unhosted', 'pending_rights', 'rights_granted', 'hosted', 'rights_revoked');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('en', 'id', 'ja');--> statement-breakpoint
CREATE TYPE "public"."manager_role" AS ENUM('owner', 'admin', 'editor');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video', 'audio', 'document');--> statement-breakpoint
CREATE TYPE "public"."resource_platform" AS ENUM('youtube', 'spotify', 'soundcloud', 'apple_music', 'bilibili', 'twitter', 'instagram', 'tiktok', 'r2', 'other');--> statement-breakpoint
CREATE TYPE "public"."resource_role" AS ENUM('stream', 'embed_video', 'hosted_audio', 'download', 'social', 'reference');--> statement-breakpoint
CREATE TYPE "public"."tag_category" AS ENUM('genre', 'mood', 'style', 'theme', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('founder', 'architect', 'resident', 'ghost');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."verification_target" AS ENUM('artifact', 'entity', 'role_upgrade');--> statement-breakpoint
CREATE TABLE "artifact_media" (
	"artifact_id" text NOT NULL,
	"media_id" text NOT NULL,
	"role" "artifact_media_role" NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "artifact_media_artifact_id_media_id_role_pk" PRIMARY KEY("artifact_id","media_id","role")
);
--> statement-breakpoint
CREATE TABLE "external_originals" (
	"id" text PRIMARY KEY NOT NULL,
	"artifact_id" text NOT NULL,
	"title" text NOT NULL,
	"original_artist_name" text,
	"platform" "resource_platform",
	"platform_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "external_originals_artifact_id_unique" UNIQUE("artifact_id")
);
--> statement-breakpoint
CREATE TABLE "hosting_rights_log" (
	"id" text PRIMARY KEY NOT NULL,
	"artifact_id" text NOT NULL,
	"from_status" "hosting_status" NOT NULL,
	"to_status" "hosting_status" NOT NULL,
	"actor_id" text NOT NULL,
	"r2_key" text,
	"notes" text,
	"valid_from" timestamp with time zone,
	"valid_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "artifacts" RENAME COLUMN "cover_id" TO "poster_id";--> statement-breakpoint
ALTER TABLE "artifacts" DROP CONSTRAINT "artifacts_cover_id_media_id_fk";
--> statement-breakpoint
ALTER TABLE "artifact_credits" ALTER COLUMN "contributor_class" SET DATA TYPE contributor_class;--> statement-breakpoint
ALTER TABLE "artifact_resources" ALTER COLUMN "artifact_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_resources" ALTER COLUMN "platform" SET DATA TYPE resource_platform;--> statement-breakpoint
ALTER TABLE "artifacts" ALTER COLUMN "category" SET DATA TYPE artifact_category;--> statement-breakpoint
ALTER TABLE "artifacts" ALTER COLUMN "status" SET DATA TYPE artifact_status;--> statement-breakpoint
ALTER TABLE "artifacts_i18n" ALTER COLUMN "locale" SET DATA TYPE locale;--> statement-breakpoint
ALTER TABLE "collections_i18n" ALTER COLUMN "locale" SET DATA TYPE locale;--> statement-breakpoint
ALTER TABLE "entities" ALTER COLUMN "type" SET DATA TYPE entity_type;--> statement-breakpoint
ALTER TABLE "entities_i18n" ALTER COLUMN "locale" SET DATA TYPE locale;--> statement-breakpoint
ALTER TABLE "entity_managers" ALTER COLUMN "role" SET DATA TYPE manager_role;--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "type" SET DATA TYPE media_type;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "category" SET DATA TYPE tag_category;--> statement-breakpoint
ALTER TABLE "tags_i18n" ALTER COLUMN "locale" SET DATA TYPE locale;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE user_role;--> statement-breakpoint
ALTER TABLE "verification_registry" ALTER COLUMN "target_type" SET DATA TYPE verification_target;--> statement-breakpoint
ALTER TABLE "verification_registry" ALTER COLUMN "status" SET DATA TYPE verification_status;--> statement-breakpoint
ALTER TABLE "zines_i18n" ALTER COLUMN "locale" SET DATA TYPE locale;--> statement-breakpoint
ALTER TABLE "artifact_credits" ADD COLUMN "is_original_artist" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_resources" ADD COLUMN "role" "resource_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_resources" ADD COLUMN "media_id" text;--> statement-breakpoint
ALTER TABLE "artifact_resources" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "artifact_resources" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "nature" "artifact_nature" NOT NULL;--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "source_artifact_id" text;--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "anime_type" "anime_type";--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "hosting_status" "hosting_status" DEFAULT 'unhosted';--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "resonance" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "thumbnail_id" text;--> statement-breakpoint
ALTER TABLE "artifacts_i18n" ADD COLUMN "source_credit" text;--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "duration_ms" integer;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "waveform_data" jsonb;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "audio_format" text;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "sample_rate" integer;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "bitrate" integer;--> statement-breakpoint
ALTER TABLE "unit_members" ADD COLUMN "left_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "artifact_media" ADD CONSTRAINT "artifact_media_artifact_id_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_media" ADD CONSTRAINT "artifact_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_originals" ADD CONSTRAINT "external_originals_artifact_id_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hosting_rights_log" ADD CONSTRAINT "hosting_rights_log_artifact_id_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hosting_rights_log" ADD CONSTRAINT "hosting_rights_log_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_artifact_media_role" ON "artifact_media" USING btree ("artifact_id","role");--> statement-breakpoint
CREATE INDEX "idx_hosting_rights_artifact" ON "hosting_rights_log" USING btree ("artifact_id");--> statement-breakpoint
ALTER TABLE "artifact_resources" ADD CONSTRAINT "artifact_resources_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_source_artifact_id_artifacts_id_fk" FOREIGN KEY ("source_artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_artifact_credits_primary" ON "artifact_credits" USING btree ("artifact_id","is_primary");--> statement-breakpoint
CREATE INDEX "idx_artifact_credits_entity" ON "artifact_credits" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "idx_artifact_resources_role" ON "artifact_resources" USING btree ("artifact_id","role");--> statement-breakpoint
CREATE INDEX "idx_artifact_resources_primary" ON "artifact_resources" USING btree ("artifact_id","is_primary");--> statement-breakpoint
CREATE INDEX "idx_artifacts_nature" ON "artifacts" USING btree ("nature");--> statement-breakpoint
CREATE INDEX "idx_artifacts_hosting_status" ON "artifacts" USING btree ("hosting_status");--> statement-breakpoint
CREATE INDEX "idx_artifacts_cat_nature_hosting" ON "artifacts" USING btree ("category","nature","hosting_status");--> statement-breakpoint
ALTER TABLE "artifact_resources" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "entities" DROP COLUMN "circuit";