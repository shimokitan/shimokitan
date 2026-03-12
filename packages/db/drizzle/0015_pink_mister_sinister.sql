CREATE TYPE "public"."hosting_rights" AS ENUM('unhosted', 'pending', 'granted', 'hosted', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."signal_severity" AS ENUM('critical', 'high', 'monitoring', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."transmission_type" AS ENUM('issue', 'editorial', 'changelog', 'broadcast');--> statement-breakpoint
ALTER TYPE "public"."artifact_media_role" ADD VALUE 'vinyl';--> statement-breakpoint
CREATE TABLE "artifact_credits_i18n" (
	"credit_id" text NOT NULL,
	"locale" "locale" NOT NULL,
	"role" text,
	CONSTRAINT "artifact_credits_i18n_credit_id_locale_pk" PRIMARY KEY("credit_id","locale")
);
--> statement-breakpoint
CREATE TABLE "external_originals_i18n" (
	"external_id" text NOT NULL,
	"locale" "locale" NOT NULL,
	"title" text NOT NULL,
	"original_artist_name" text,
	CONSTRAINT "external_originals_i18n_external_id_locale_pk" PRIMARY KEY("external_id","locale")
);
--> statement-breakpoint
CREATE TABLE "signal_timeline" (
	"id" text PRIMARY KEY NOT NULL,
	"transmission_id" text NOT NULL,
	"state" text NOT NULL,
	"note" text,
	"actor_id" text,
	"timestamp" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transmissions" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "transmission_type" DEFAULT 'issue' NOT NULL,
	"topic" text,
	"author_id" text,
	"severity" "signal_severity",
	"affected_users" integer DEFAULT 0,
	"attachment_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"published_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "transmissions_i18n" (
	"transmission_id" text NOT NULL,
	"locale" "locale" NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	CONSTRAINT "transmissions_i18n_transmission_id_locale_pk" PRIMARY KEY("transmission_id","locale")
);
--> statement-breakpoint
DROP INDEX "idx_artifacts_hosting_status";--> statement-breakpoint
DROP INDEX "idx_artifacts_cat_nature_hosting";--> statement-breakpoint
ALTER TABLE "external_originals" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hosting_rights_log" ALTER COLUMN "from_status" SET DATA TYPE hosting_rights;--> statement-breakpoint
ALTER TABLE "hosting_rights_log" ALTER COLUMN "to_status" SET DATA TYPE hosting_rights;--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "is_hosted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "vinyl_id" text;--> statement-breakpoint
ALTER TABLE "artifact_credits_i18n" ADD CONSTRAINT "artifact_credits_i18n_credit_id_artifact_credits_id_fk" FOREIGN KEY ("credit_id") REFERENCES "public"."artifact_credits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_originals_i18n" ADD CONSTRAINT "external_originals_i18n_external_id_external_originals_id_fk" FOREIGN KEY ("external_id") REFERENCES "public"."external_originals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signal_timeline" ADD CONSTRAINT "signal_timeline_transmission_id_transmissions_id_fk" FOREIGN KEY ("transmission_id") REFERENCES "public"."transmissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "signal_timeline" ADD CONSTRAINT "signal_timeline_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transmissions" ADD CONSTRAINT "transmissions_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transmissions" ADD CONSTRAINT "transmissions_attachment_id_media_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transmissions_i18n" ADD CONSTRAINT "transmissions_i18n_transmission_id_transmissions_id_fk" FOREIGN KEY ("transmission_id") REFERENCES "public"."transmissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_signal_timeline_transmission" ON "signal_timeline" USING btree ("transmission_id");--> statement-breakpoint
CREATE INDEX "idx_transmissions_type" ON "transmissions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_transmissions_severity" ON "transmissions" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "idx_transmissions_published" ON "transmissions" USING btree ("published_at");--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_vinyl_id_media_id_fk" FOREIGN KEY ("vinyl_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_artifacts_is_hosted" ON "artifacts" USING btree ("is_hosted");--> statement-breakpoint
CREATE INDEX "idx_artifacts_cat_nature_hosted" ON "artifacts" USING btree ("category","nature","is_hosted");--> statement-breakpoint
ALTER TABLE "artifacts" DROP COLUMN "hosting_status";--> statement-breakpoint
ALTER TABLE "public"."entities" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."entity_type";--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('independent', 'organization', 'agency', 'circle');--> statement-breakpoint
ALTER TABLE "public"."entities" ALTER COLUMN "type" SET DATA TYPE "public"."entity_type" USING "type"::"public"."entity_type";--> statement-breakpoint
DROP TYPE "public"."hosting_status";