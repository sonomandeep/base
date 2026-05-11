import openapi from "@elysia/openapi";
import { Elysia } from "elysia";
import { containers } from "./modules/containers";
import { images } from "./modules/images";

export const api = new Elysia()
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
          {
            description: "Image discovery and disk usage endpoints.",
            name: "Images",
          },
        ],
      },
    })
  )
  .use(containers)
  .use(images)
  .get("/", () => "Hello Elysia");

export type Api = typeof api;
