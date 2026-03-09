ALTER TABLE "artifact_credits" DROP CONSTRAINT "artifact_credits_artifact_id_entity_id_role_pk";--> statement-breakpoint
ALTER TABLE "artifact_credits" ALTER COLUMN "entity_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_credits" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_credits" ADD COLUMN "manual_name" text;--> statement-breakpoint
CREATE INDEX "idx_artifact_credits_artifact" ON "artifact_credits" USING btree ("artifact_id");