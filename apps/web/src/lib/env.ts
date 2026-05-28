import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
});

const result = envSchema.safeParse(import.meta.env);

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

export const env = result.data;
