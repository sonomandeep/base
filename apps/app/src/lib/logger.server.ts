import "@tanstack/react-start/server-only";
import pino, { type LoggerOptions } from "pino";
import { env } from "../env.server";

const loggerOptions: LoggerOptions = {
  level: env.LOG_LEVEL,
  base: { service: "app" },
  redact: ["req.headers.authorization", "req.headers.cookie", 'res.headers["set-cookie"]'],
};

const envToLogger: Record<typeof env.NODE_ENV, LoggerOptions> = {
  development: {
    ...loggerOptions,
    transport: {
      target: "pino-pretty",
    },
  },
  production: loggerOptions,
  test: {
    ...loggerOptions,
    enabled: false,
  },
};

export const logger = pino(envToLogger[env.NODE_ENV]);
