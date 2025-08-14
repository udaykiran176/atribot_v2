CREATE TYPE "public"."challenge_type" AS ENUM('video', 'slide', 'game', 'build', 'mcq');--> statement-breakpoint
CREATE TABLE "mcq_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"sort_order" integer
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"free_trial" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"challenge_id" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "challenge_options" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "challenge_progress" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lessons" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "units" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_progress" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_subscription" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "challenge_options" CASCADE;--> statement-breakpoint
DROP TABLE "challenge_progress" CASCADE;--> statement-breakpoint
DROP TABLE "lessons" CASCADE;--> statement-breakpoint
DROP TABLE "units" CASCADE;--> statement-breakpoint
DROP TABLE "user_progress" CASCADE;--> statement-breakpoint
DROP TABLE "user_subscription" CASCADE;--> statement-breakpoint
ALTER TABLE "challenges" DROP CONSTRAINT "challenges_lesson_id_lessons_id_fk";
--> statement-breakpoint
ALTER TABLE "challenges" ALTER COLUMN "type" SET DATA TYPE "public"."challenge_type" USING "type"::text::"public"."challenge_type";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "topic_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "content_url" text;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "is_loop_animation" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "xp" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "google_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "xp" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "kit_unlocked" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "mcq_options" ADD CONSTRAINT "mcq_options_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" DROP COLUMN "lesson_id";--> statement-breakpoint
ALTER TABLE "challenges" DROP COLUMN "question";--> statement-breakpoint
ALTER TABLE "challenges" DROP COLUMN "order";--> statement-breakpoint
DROP TYPE "public"."type";