CREATE TABLE "user_video_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"video_lesson_id" integer NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"xp_awarded" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"video_url" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "user_challenge_progress" CASCADE;--> statement-breakpoint
ALTER TABLE "user_video_progress" ADD CONSTRAINT "user_video_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_video_progress" ADD CONSTRAINT "user_video_progress_video_lesson_id_video_lessons_id_fk" FOREIGN KEY ("video_lesson_id") REFERENCES "public"."video_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_lessons" ADD CONSTRAINT "video_lessons_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;