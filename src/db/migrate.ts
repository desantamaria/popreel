import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { env } from "@/config/env";
import { Logger } from "@/utils/logger";

const logger = new Logger("DB:Operations");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function dropAllTables(db: any) {
  logger.info("Dropping all existing tables...");

  const tables = ["users, videos, views, likes, comments, shares, bookmarks"];

  for (const table of tables) {
    try {
      await db.execute(
        sql`DROP TABLE IF EXISTS ${sql.identifier(table)} CASCADE;`
      );
      logger.info(`Dropped table ${table}`);
    } catch (error) {
      logger.error(`Failed to drop table ${table}:`, error);
    }
  }

  logger.info("All tables dropped successfully");
}

async function runMigrations() {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  const shouldDrop = process.argv.includes("--drop-tables");

  try {
    if (shouldDrop) {
      await dropAllTables(db);
    }

    logger.info("Running migrations...");
    await migrate(db, {
      migrationsFolder: "src/db/migrations",
    });
    logger.info("Migrations completed successfully");
  } catch (error) {
    logger.error("Operation failed:", error);
    process.exit(1);
  }
}

runMigrations();
