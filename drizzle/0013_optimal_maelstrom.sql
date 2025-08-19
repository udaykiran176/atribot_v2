DROP TABLE "challenge_progress" CASCADE;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "is_completed" boolean DEFAULT false NOT NULL;