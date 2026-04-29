import { Elysia } from "elysia";
import { ContainerModel } from "./model";
import { getContainers } from "./service";

export const containers = new Elysia({
  prefix: "/containers",
  tags: ["Containers"],
})
  .model({
    "container.list": ContainerModel.list,
  })
  .get("/", () => getContainers(), {
    detail: {
      description:
        "Returns Docker containers visible from the configured Docker socket.",
      operationId: "listContainers",
      summary: "List containers",
    },
    response: {
      200: "container.list",
    },
  });
