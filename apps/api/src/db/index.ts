import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

const url = process.env.DB_FILE_NAME;

if (!url) {
  throw new Error("Missing DB_FILE_NAME environment variable");
}

export const db = drizzle(url);
