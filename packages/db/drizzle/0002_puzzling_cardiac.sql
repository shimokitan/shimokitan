CREATE TABLE "entity_managers" (
	"user_id" text NOT NULL,
	"entity_id" text NOT NULL,
	"role" text DEFAULT 'editor' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "entity_managers_user_id_entity_id_pk" PRIMARY KEY("user_id","entity_id")
);
--> statement-breakpoint
CREATE TABLE "unit_members" (
	"unit_id" text NOT NULL,
	"member_id" text NOT NULL,
	"member_role" text,
	"joined_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unit_members_unit_id_member_id_pk" PRIMARY KEY("unit_id","member_id")
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_entity_id_entities_id_fk";
--> statement-breakpoint
ALTER TABLE "artifact_credits" ALTER COLUMN "artifact_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_credits" ALTER COLUMN "entity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_credits" ADD COLUMN "display_role" text;--> statement-breakpoint
ALTER TABLE "artifact_credits" ADD COLUMN "contributor_class" text DEFAULT 'staff' NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_credits" ADD COLUMN "is_primary" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "artifact_credits" ADD COLUMN "position" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "header_url" text;--> statement-breakpoint
ALTER TABLE "entities" ADD COLUMN "profile_type" text DEFAULT 'professional' NOT NULL;--> statement-breakpoint
ALTER TABLE "entities_i18n" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "header_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "zines" ADD COLUMN "author_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "entity_managers" ADD CONSTRAINT "entity_managers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_managers" ADD CONSTRAINT "entity_managers_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_members" ADD CONSTRAINT "unit_members_unit_id_entities_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_members" ADD CONSTRAINT "unit_members_member_id_entities_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zines" ADD CONSTRAINT "zines_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "entity_id";--> statement-breakpoint
ALTER TABLE "zines" DROP COLUMN "author";