import { cors } from "@elysia/cors";
import { Elysia } from "elysia";
import { api } from "./app";
import { env } from "./lib/env";

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      origin: env.WEB_ORIGIN,
    })
  )
  .use(api)
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
