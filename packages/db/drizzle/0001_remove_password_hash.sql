CREATE TABLE "artifact_tags" (
	"artifact_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "artifact_tags_artifact_id_tag_id_pk" PRIMARY KEY("artifact_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text DEFAULT 'genre',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tags_i18n" (
	"tag_id" text NOT NULL,
	"locale" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_i18n_tag_id_locale_pk" PRIMARY KEY("tag_id","locale")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'resident' NOT NULL,
	"entity_id" text,
	"resonance_multiplier" integer DEFAULT 100,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_registry" (
	"id" text PRIMARY KEY NOT NULL,
	"target_id" text NOT NULL,
	"target_type" text NOT NULL,
	"status" text DEFAULT 'pending',
	"r2_key" text,
	"issuer" text,
	"granted_by" text,
	"granted_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "residents" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "residents" CASCADE;--> statement-breakpoint
ALTER TABLE "entities" ALTER COLUMN "social_links" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "artifact_resources" ADD COLUMN "value" text NOT NULL;--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "is_major" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "allow_mirroring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "resonance" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "uid" text;--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "circuit" text DEFAULT 'underground';--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "artifact_tags" ADD CONSTRAINT "artifact_tags_artifact_id_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_tags" ADD CONSTRAINT "artifact_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags_i18n" ADD CONSTRAINT "tags_i18n_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_tags_i18n_name" ON "tags_i18n" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_verification_target" ON "verification_registry" USING btree ("target_type","target_id");--> statement-breakpoint
ALTER TABLE "artifact_resources" DROP COLUMN "external_id";--> statement-breakpoint
ALTER TABLE "artifact_resources" DROP COLUMN "url";--> statement-breakpoint
ALTER TABLE "entities" ADD CONSTRAINT "entities_uid_unique" UNIQUE("uid");