ALTER TABLE "entities" RENAME COLUMN "header_id" TO "thumbnail_id";
ALTER TABLE "entities" RENAME CONSTRAINT "entities_header_id_media_id_fk" TO "entities_thumbnail_id_media_id_fk";