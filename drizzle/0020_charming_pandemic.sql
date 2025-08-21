CREATE TABLE "interactive_games" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"component_path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "interactive_games_challenge_id_unique" UNIQUE("challenge_id")
);
--> statement-breakpoint
ALTER TABLE "interactive_games" ADD CONSTRAINT "interactive_games_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;