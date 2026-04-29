import openapi from "@elysia/openapi";
import { Elysia } from "elysia";
import { z } from "zod";
import { containers } from "./modules/containers";

const app = new Elysia()
  .use(
    openapi({
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
    })
  )
  .use(containers)
  .get("/", () => "Hello Elysia")
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
