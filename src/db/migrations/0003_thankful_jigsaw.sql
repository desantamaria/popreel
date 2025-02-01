ALTER TABLE "comments" ALTER COLUMN "created_at" SET DEFAULT '2025-02-01 06:47:25.511';--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-01 06:47:25.511';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_seen_at" SET DEFAULT '2025-02-01 06:47:25.510';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-02-01 06:47:25.510';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-01 06:47:25.510';--> statement-breakpoint
ALTER TABLE "video_analytics" ALTER COLUMN "created_at" SET DEFAULT '2025-02-01 06:47:25.511';--> statement-breakpoint
ALTER TABLE "video_analytics" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-01 06:47:25.511';--> statement-breakpoint
ALTER TABLE "video_interactions" ALTER COLUMN "created_at" SET DEFAULT '2025-02-01 06:47:25.511';--> statement-breakpoint
ALTER TABLE "video_interactions" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-01 06:47:25.511';--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "created_at" SET DEFAULT '2025-02-01 06:47:25.511';--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-01 06:47:25.511';--> statement-breakpoint
ALTER TABLE "video_analytics" ADD COLUMN "audience_demographic" jsonb;--> statement-breakpoint
ALTER TABLE "video_analytics" ADD COLUMN "hourly_views" jsonb;--> statement-breakpoint
ALTER TABLE "video_analytics" ADD COLUMN "daily_views" jsonb;--> statement-breakpoint
ALTER TABLE "video_analytics" ADD COLUMN "popularity_score" jsonb;--> statement-breakpoint
ALTER TABLE "video_interactions" DROP COLUMN "audience_demographic";--> statement-breakpoint
ALTER TABLE "video_interactions" DROP COLUMN "hourly_views";--> statement-breakpoint
ALTER TABLE "video_interactions" DROP COLUMN "daily_views";--> statement-breakpoint
ALTER TABLE "video_interactions" DROP COLUMN "popularity_score";