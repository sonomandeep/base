import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

app.get("/", async () => "Hello Fastify");

try {
  await app.listen({
    port: 3000,
    host: "0.0.0.0",
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
