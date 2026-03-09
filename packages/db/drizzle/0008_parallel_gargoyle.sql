ALTER TYPE "public"."tag_category" ADD VALUE 'identity';--> statement-breakpoint
CREATE TABLE "entity_tags" (
	"entity_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "entity_tags_entity_id_tag_id_pk" PRIMARY KEY("entity_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "entity_tags" ADD CONSTRAINT "entity_tags_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_tags" ADD CONSTRAINT "entity_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;