import Fastify from "fastify";
import { loggerConfig } from "./lib/logger.js";

const app = Fastify({
  logger: loggerConfig,
});

app.get("/", async () => "Hello Fastify");

try {
  await app.listen({
    port: 3000,
    host: "0.0.0.0",
  });
} catch (error) {
  app.log.error({ err: error }, "Failed to start API");
  process.exit(1);
}
