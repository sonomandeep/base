import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.DB_FILE_NAME;

if (!url) {
  throw new Error("Missing DB_FILE_NAME environment variable");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url,
  },
});
