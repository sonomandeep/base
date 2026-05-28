import "dotenv/config";
import { getSchemaValidator, t, type UnwrapSchema } from "elysia";

const envSchema = t.Object({
  BETTER_AUTH_SECRET: t.String({ minLength: 32 }),
  BETTER_AUTH_URL: t.String({ format: "uri" }),
  DATABASE_URL: t.String({ format: "uri" }),
  DOCKER_SOCKET_PATH: t.Optional(t.String()),
  WEB_ORIGIN: t.String({ format: "uri" }),
});

const envValidator = getSchemaValidator(envSchema);

const result = envValidator.safeParse({
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  DOCKER_SOCKET_PATH: process.env.DOCKER_SOCKET_PATH,
  WEB_ORIGIN: process.env.WEB_ORIGIN,
});

if (!result.success) {
  throw new Error(
    `Invalid environment variables:\n${result.errors
      .map((error) => `- ${error?.summary ?? "Unknown validation error"}`)
      .join("\n")}`
  );
}

type Env = UnwrapSchema<typeof envSchema>;

export const env = {
  ...result.data,
  DOCKER_SOCKET_PATH: result.data.DOCKER_SOCKET_PATH ?? "/var/run/docker.sock",
} satisfies Env;
