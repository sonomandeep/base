import "@tanstack/react-start/server-only";
import "dotenv/config";
import pino, { type LoggerOptions } from "pino";

const environment = process.env.NODE_ENV ?? "development";
const logLevel = process.env.LOG_LEVEL;

const loggerOptions: LoggerOptions = {
  level: logLevel || "info",
  base: { service: "app" },
  redact: ["req.headers.authorization", "req.headers.cookie", 'res.headers["set-cookie"]'],
};

const envToLogger: Record<string, LoggerOptions> = {
  development: {
    ...loggerOptions,
    level: logLevel || "debug",
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

export const logger = pino(envToLogger[environment] ?? loggerOptions);
