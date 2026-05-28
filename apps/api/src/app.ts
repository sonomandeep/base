import openapi from "@elysia/openapi";
import { Elysia } from "elysia";
import { betterAuthPlugin } from "./lib/auth";
import { containers } from "./modules/containers";
import { hosts } from "./modules/hosts";
import { images } from "./modules/images";
import { networks } from "./modules/networks";
import { volumes } from "./modules/volumes";

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
          {
            description: "Host state and resource usage endpoints.",
            name: "Hosts",
          },
          {
            description: "Volume discovery and disk usage endpoints.",
            name: "Volumes",
          },
          {
            description: "Network discovery and connectivity endpoints.",
            name: "Networks",
          },
        ],
      },
    })
  )
  .use(betterAuthPlugin)
  .use(containers)
  .use(hosts)
  .use(images)
  .use(networks)
  .use(volumes)
  .get("/", () => "Hello Elysia");

export type Api = typeof api;
