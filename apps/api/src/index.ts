import openapi from "@elysia/openapi";
import { Elysia } from "elysia";
import { containers } from "./modules/containers";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          description: "API for Docker and Podman resource management.",
          title: "Base API",
          version: "1.0.0",
        },
        tags: [
          {
            description: "Container discovery and state endpoints.",
            name: "Containers",
          },
        ],
      },
    })
  )
  .use(containers)
  .get("/", () => "Hello Elysia")
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
