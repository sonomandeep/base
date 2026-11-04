import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.local", ".env"] });

// TODO: Centralize and validate server environment variables with a typed schema.
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl?.trim()) {
  throw new Error("DATABASE_URL must be configured and non-empty");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
  },
});
