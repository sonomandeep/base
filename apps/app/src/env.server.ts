import "@tanstack/react-start/server-only";
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).optional(),
});

// Read at runtime: Vite replaces direct process.env.NODE_ENV access during builds.
const { NODE_ENV, LOG_LEVEL } = process.env;

const result = envSchema.safeParse({
  NODE_ENV: NODE_ENV || undefined,
  LOG_LEVEL: LOG_LEVEL || undefined,
});

if (!result.success) {
  const errors = result.error.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid app environment:\n${errors.join("\n")}`);
}

export const env = {
  ...result.data,
  LOG_LEVEL: result.data.LOG_LEVEL ?? (result.data.NODE_ENV === "development" ? "debug" : "info"),
};
