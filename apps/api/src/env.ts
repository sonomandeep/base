import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DB_FILE_NAME: z.string().trim().min(1, "Required non-empty string"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).optional(),
});

const result = envSchema.safeParse({
  DB_FILE_NAME: process.env.DB_FILE_NAME,
  NODE_ENV: process.env.NODE_ENV || undefined,
  LOG_LEVEL: process.env.LOG_LEVEL || undefined,
});

if (!result.success) {
  const errors = result.error.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid API environment:\n${errors.join("\n")}`);
}

export const env = {
  ...result.data,
  LOG_LEVEL: result.data.LOG_LEVEL ?? (result.data.NODE_ENV === "development" ? "debug" : "info"),
};
