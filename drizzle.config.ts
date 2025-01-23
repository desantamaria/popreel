import { env } from "@/config/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/migrations",
  dialect: "postgresql",
  breakpoints: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schema: "./src/db/schema.ts",
});
