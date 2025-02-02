ALTER TABLE "comments" ALTER COLUMN "created_at" SET DEFAULT '2025-02-02 01:32:18.606';--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-02 01:32:18.606';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_seen_at" SET DEFAULT '2025-02-02 01:32:18.605';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-02-02 01:32:18.605';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-02 01:32:18.605';--> statement-breakpoint
ALTER TABLE "video_analytics" ALTER COLUMN "created_at" SET DEFAULT '2025-02-02 01:32:18.606';--> statement-breakpoint
ALTER TABLE "video_analytics" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-02 01:32:18.606';--> statement-breakpoint
ALTER TABLE "video_interactions" ALTER COLUMN "created_at" SET DEFAULT '2025-02-02 01:32:18.606';--> statement-breakpoint
ALTER TABLE "video_interactions" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-02 01:32:18.606';--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "created_at" SET DEFAULT '2025-02-02 01:32:18.606';--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "updated_at" SET DEFAULT '2025-02-02 01:32:18.606';--> statement-breakpoint
ALTER TABLE "video_analytics" ADD COLUMN "total_bookmarks" bigint;