CREATE TABLE "artifact_credits" (
	"artifact_id" text,
	"entity_id" text,
	"role" text NOT NULL,
	CONSTRAINT "artifact_credits_artifact_id_entity_id_role_pk" PRIMARY KEY("artifact_id","entity_id","role")
);
--> statement-breakpoint
CREATE TABLE "artifact_resources" (
	"id" text PRIMARY KEY NOT NULL,
	"artifact_id" text,
	"type" text NOT NULL,
	"platform" text NOT NULL,
	"external_id" text,
	"url" text NOT NULL,
	"embed_data" jsonb DEFAULT '{}'::jsonb,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "artifacts" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"cover_image" text,
	"status" text DEFAULT 'back_alley',
	"score" integer DEFAULT 0,
	"specs" jsonb DEFAULT '{}'::jsonb,
	"is_major" boolean DEFAULT false,
	"allow_mirroring" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "artifacts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "artifacts_i18n" (
	"artifact_id" text NOT NULL,
	"locale" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	CONSTRAINT "artifacts_i18n_artifact_id_locale_pk" PRIMARY KEY("artifact_id","locale")
);
--> statement-breakpoint
CREATE TABLE "collection_artifacts" (
	"collection_id" text,
	"artifact_id" text,
	"position" integer NOT NULL,
	"curator_note" text,
	CONSTRAINT "collection_artifacts_collection_id_artifact_id_pk" PRIMARY KEY("collection_id","artifact_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"cover_image" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "collections_i18n" (
	"collection_id" text NOT NULL,
	"locale" text NOT NULL,
	"title" text NOT NULL,
	"thesis" text,
	CONSTRAINT "collections_i18n_collection_id_locale_pk" PRIMARY KEY("collection_id","locale")
);
--> statement-breakpoint
CREATE TABLE "entities" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"type" text NOT NULL,
	"avatar_url" text,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"is_major" boolean DEFAULT false,
	"allow_mirroring" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "entities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "entities_i18n" (
	"entity_id" text NOT NULL,
	"locale" text NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	CONSTRAINT "entities_i18n_entity_id_locale_pk" PRIMARY KEY("entity_id","locale")
);
--> statement-breakpoint
CREATE TABLE "residents" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "residents_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "zines" (
	"id" text PRIMARY KEY NOT NULL,
	"artifact_id" text,
	"author" text NOT NULL,
	"resonance" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "zines_i18n" (
	"zine_id" text NOT NULL,
	"locale" text NOT NULL,
	"content" text NOT NULL,
	CONSTRAINT "zines_i18n_zine_id_locale_pk" PRIMARY KEY("zine_id","locale")
);
--> statement-breakpoint
ALTER TABLE "artifact_credits" ADD CONSTRAINT "artifact_credits_artifact_id_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_credits" ADD CONSTRAINT "artifact_credits_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_resources" ADD CONSTRAINT "artifact_resources_artifact_id_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifacts_i18n" ADD CONSTRAINT "artifacts_i18n_artifact_id_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_artifacts" ADD CONSTRAINT "collection_artifacts_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_artifacts" ADD CONSTRAINT "collection_artifacts_artifact_id_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections_i18n" ADD CONSTRAINT "collections_i18n_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entities_i18n" ADD CONSTRAINT "entities_i18n_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zines" ADD CONSTRAINT "zines_artifact_id_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zines_i18n" ADD CONSTRAINT "zines_i18n_zine_id_zines_id_fk" FOREIGN KEY ("zine_id") REFERENCES "public"."zines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_artifacts_category" ON "artifacts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_artifacts_status" ON "artifacts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_artifacts_i18n_title" ON "artifacts_i18n" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_collections_i18n_title" ON "collections_i18n" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_entities_i18n_name" ON "entities_i18n" USING btree ("name");