import type { FastifyServerOptions } from "fastify";
import { env } from "../env.js";

const loggerOptions = {
  level: env.LOG_LEVEL,
  base: { service: "api" },
  redact: ["req.headers.authorization", "req.headers.cookie", 'res.headers["set-cookie"]'],
};

const envToLogger: Record<typeof env.NODE_ENV, NonNullable<FastifyServerOptions["logger"]>> = {
  development: {
    ...loggerOptions,
    transport: {
      target: "pino-pretty",
    },
  },
  production: loggerOptions,
  test: false,
};

export const loggerConfig = envToLogger[env.NODE_ENV];
