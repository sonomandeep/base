import { z } from "zod";

const envSchema = z.object({
  ALLOWED_HOSTS: z.string().optional(),
  VITE_API_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(source: Record<string, unknown>): Env {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${result.error.issues
        .map((issue) => {
          const name = issue.path.join(".") || "env";

          return `- ${name}: ${issue.message}`;
        })
        .join("\n")}`
    );
  }

  return result.data;
}
