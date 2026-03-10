ALTER TABLE "artifact_credits" ALTER COLUMN "entity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_credits" DROP COLUMN "manual_name";--> statement-breakpoint
ALTER TABLE "artifacts" DROP COLUMN "score";--> statement-breakpoint
ALTER TABLE "public"."artifact_resources" ALTER COLUMN "platform" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."external_originals" ALTER COLUMN "platform" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."resource_platform";--> statement-breakpoint
CREATE TYPE "public"."resource_platform" AS ENUM('youtube', 'spotify', 'soundcloud', 'apple_music', 'bilibili', 'niconico', 'x', 'instagram', 'tiktok', 'ko_fi', 'booth', 'vgen', 'patreon', 'buymeacoffee', 'fanbox', 'fiverr', 'gumroad', 'etsy', 'society6', 'redbubble', 'artstation', 'behance', 'bandcamp', 'skeb', 'pixiv', 'r2', 'other');--> statement-breakpoint
ALTER TABLE "public"."artifact_resources" ALTER COLUMN "platform" SET DATA TYPE "public"."resource_platform" USING "platform"::"public"."resource_platform";--> statement-breakpoint
ALTER TABLE "public"."external_originals" ALTER COLUMN "platform" SET DATA TYPE "public"."resource_platform" USING "platform"::"public"."resource_platform";