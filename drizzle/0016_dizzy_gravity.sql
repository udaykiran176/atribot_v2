CREATE TABLE "build_it_thought" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"video_url" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "swipe_cards" ALTER COLUMN "image" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "build_it_thought" ADD CONSTRAINT "build_it_thought_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;