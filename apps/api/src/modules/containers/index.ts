import { Elysia } from "elysia";
import { ContainerModel } from "./model";
import { getContainers } from "./service";

export const containers = new Elysia({
  detail: { tags: ["containers"] },
  prefix: "/containers",
}).get("/", () => getContainers(), {
  response: {
    200: ContainerModel.containersResponse,
  },
});
