import "dotenv/config";
import type { FastifyServerOptions } from "fastify";

const environment = process.env.NODE_ENV ?? "development";
const logLevel = process.env.LOG_LEVEL;

const loggerOptions = {
  level: logLevel || "info",
  base: { service: "api" },
  redact: ["req.headers.authorization", "req.headers.cookie", 'res.headers["set-cookie"]'],
};

const envToLogger: Record<string, NonNullable<FastifyServerOptions["logger"]>> = {
  development: {
    ...loggerOptions,
    level: logLevel || "debug",
    transport: {
      target: "pino-pretty",
    },
  },
  production: loggerOptions,
  test: false,
};

export const loggerConfig = envToLogger[environment] ?? loggerOptions;
