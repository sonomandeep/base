import { Elysia, sse } from "elysia";
import { ContainerModel } from "./model";
import { getContainers, streamContainerSnapshots } from "./service";

const CONTAINERS_ERROR_MESSAGE = "Unable to read containers.";

export const containers = new Elysia({
  prefix: "/containers",
  tags: ["Containers"],
})
  .model({
    "container.error": ContainerModel.error,
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
  })
  .get(
    "/stream",
    async ({ request, status }) => {
      try {
        const initialContainers = await getContainers();

        return (async function* () {
          try {
            for await (const containers of streamContainerSnapshots(
              initialContainers,
              request.signal
            )) {
              yield sse({ event: "containers", data: containers });
            }
          } catch {
            yield sse({
              data: { message: CONTAINERS_ERROR_MESSAGE },
              event: "containers.error",
            });
          }
        })();
      } catch {
        return status(500, { message: CONTAINERS_ERROR_MESSAGE });
      }
    },
    {
      detail: {
        description:
          "Streams container snapshots as Server-Sent Events. Each containers event contains a payload compatible with container.list. If polling fails after the stream opens, a containers.error event is emitted before closing the stream.",
        operationId: "streamContainers",
        responses: {
          200: {
            content: {
              "text/event-stream": {
                schema: {
                  example:
                    'event: containers\\ndata: [{"id":"...","name":"...","image":"...","state":"HEALTHY","cpu":null,"ram":null}]\\n\\n',
                  type: "string",
                },
              },
            },
            description:
              "Server-Sent Events stream. Emits containers and containers.error events.",
          },
          500: {
            description:
              "The initial container snapshot could not be loaded before opening the stream.",
          },
        },
        summary: "Stream containers",
      },
      response: {
        500: "container.error",
      },
    }
  );
