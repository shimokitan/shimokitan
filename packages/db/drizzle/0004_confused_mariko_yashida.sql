CREATE TABLE "media" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"url" text NOT NULL,
	"r2_key" text NOT NULL,
	"blurhash" text,
	"width" integer,
	"height" integer,
	"size_bytes" integer,
	"mime_type" text NOT NULL,
	"uploader_id" text NOT NULL,
	"is_orphan" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "media_r2_key_unique" UNIQUE("r2_key")
);
--> statement-breakpoint
ALTER TABLE "artifacts" ADD COLUMN "cover_id" text;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "cover_id" text;--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "avatar_id" text;--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "header_id" text;--> statement-breakpoint
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entities" ADD CONSTRAINT "entities_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entities" ADD CONSTRAINT "entities_header_id_media_id_fk" FOREIGN KEY ("header_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;