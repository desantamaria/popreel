CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"video_id" uuid,
	"content" text,
	"total_likes" bigint,
	"created_at" timestamp DEFAULT '2025-01-29 04:39:21.025' NOT NULL,
	"updated_at" timestamp DEFAULT '2025-01-29 04:39:21.025' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"clerk_id" text PRIMARY KEY NOT NULL,
	"username" varchar(30) NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"bio" text,
	"avatar_url" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_verified" boolean DEFAULT false,
	"is_private" boolean DEFAULT false,
	"last_seen_at" timestamp DEFAULT '2025-01-29 04:39:21.024' NOT NULL,
	"created_at" timestamp DEFAULT '2025-01-29 04:39:21.024' NOT NULL,
	"updated_at" timestamp DEFAULT '2025-01-29 04:39:21.024' NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "video_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" uuid,
	"total_views" bigint,
	"total_likes" bigint,
	"total_comments" bigint,
	"total_shares" bigint,
	"created_at" timestamp DEFAULT '2025-01-29 04:39:21.025' NOT NULL,
	"updated_at" timestamp DEFAULT '2025-01-29 04:39:21.025' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"video_id" uuid,
	"interaction_type" varchar(30),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"view_Duration" bigint,
	"watch_percentage" bigint,
	"interaction_strength" bigint,
	"audience_demographic" jsonb DEFAULT '{}'::jsonb,
	"hourly_views" jsonb DEFAULT '{}'::jsonb,
	"daily_views" jsonb DEFAULT '{}'::jsonb,
	"popularity_score" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT '2025-01-29 04:39:21.025' NOT NULL,
	"updated_at" timestamp DEFAULT '2025-01-29 04:39:21.025' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"caption" text,
	"video_url" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"embedding" vector(1536),
	"created_at" timestamp DEFAULT '2025-01-29 04:39:21.025' NOT NULL,
	"updated_at" timestamp DEFAULT '2025-01-29 04:39:21.025' NOT NULL,
	CONSTRAINT "videos_video_url_unique" UNIQUE("video_url")
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("clerk_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_analytics" ADD CONSTRAINT "video_analytics_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_interactions" ADD CONSTRAINT "video_interactions_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("clerk_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_interactions" ADD CONSTRAINT "video_interactions_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_user_id_users_clerk_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("clerk_id") ON DELETE no action ON UPDATE no action;