CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image_src" text NOT NULL,
	"thumbnail_src" text NOT NULL,
	"description" text NOT NULL,
	"price" text NOT NULL
);
