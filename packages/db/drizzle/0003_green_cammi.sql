ALTER TABLE "artifacts" DROP COLUMN "cover_image";--> statement-breakpoint
ALTER TABLE "artifacts" DROP COLUMN "is_major";--> statement-breakpoint
ALTER TABLE "artifacts" DROP COLUMN "allow_mirroring";--> statement-breakpoint
ALTER TABLE "collections" DROP COLUMN "cover_image";--> statement-breakpoint
ALTER TABLE "collections" DROP COLUMN "is_major";--> statement-breakpoint
ALTER TABLE "collections" DROP COLUMN "allow_mirroring";--> statement-breakpoint
ALTER TABLE "entities" DROP COLUMN "avatar_url";--> statement-breakpoint
ALTER TABLE "entities" DROP COLUMN "header_url";--> statement-breakpoint
ALTER TABLE "entities" DROP COLUMN "is_major";--> statement-breakpoint
ALTER TABLE "entities" DROP COLUMN "allow_mirroring";--> statement-breakpoint
ALTER TABLE "entities" DROP COLUMN "profile_type";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "avatar_url";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "header_url";