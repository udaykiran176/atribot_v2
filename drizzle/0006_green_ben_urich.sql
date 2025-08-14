ALTER TABLE "challenges" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "mcq_options" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "topics" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_challenges" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "challenges" CASCADE;--> statement-breakpoint
DROP TABLE "mcq_options" CASCADE;--> statement-breakpoint
DROP TABLE "topics" CASCADE;--> statement-breakpoint
DROP TABLE "user_challenges" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "google_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "xp";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "kit_unlocked";--> statement-breakpoint
DROP TYPE "public"."challenge_type";