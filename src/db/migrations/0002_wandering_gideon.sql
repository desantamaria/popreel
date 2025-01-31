ALTER TABLE "comments" ALTER COLUMN "created_at" SET DEFAULT '2025-01-31 22:50:50.960';--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "updated_at" SET DEFAULT '2025-01-31 22:50:50.960';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "embedding" SET DATA TYPE vector(768);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_seen_at" SET DEFAULT '2025-01-31 22:50:50.958';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2025-01-31 22:50:50.958';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2025-01-31 22:50:50.958';--> statement-breakpoint
ALTER TABLE "video_analytics" ALTER COLUMN "created_at" SET DEFAULT '2025-01-31 22:50:50.959';--> statement-breakpoint
ALTER TABLE "video_analytics" ALTER COLUMN "updated_at" SET DEFAULT '2025-01-31 22:50:50.959';--> statement-breakpoint
ALTER TABLE "video_interactions" ALTER COLUMN "created_at" SET DEFAULT '2025-01-31 22:50:50.960';--> statement-breakpoint
ALTER TABLE "video_interactions" ALTER COLUMN "updated_at" SET DEFAULT '2025-01-31 22:50:50.960';--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "embedding" SET DATA TYPE vector(768);--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "created_at" SET DEFAULT '2025-01-31 22:50:50.959';--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "updated_at" SET DEFAULT '2025-01-31 22:50:50.959';