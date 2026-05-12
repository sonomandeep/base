import { Elysia, sse, t } from "elysia";
import { ContainerModel } from "./model";
import {
  getContainer,
  getContainerSummary,
  getContainers,
  streamContainerSnapshots,
} from "./service";

const CONTAINERS_ERROR_MESSAGE = "Unable to read containers.";
const CONTAINER_NOT_FOUND_MESSAGE = "Container not found.";
const CONTAINER_SUMMARY_ERROR_MESSAGE = "Unable to read container summary.";

function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    error.statusCode === 404
  );
}

export const containers = new Elysia({
  prefix: "/containers",
  tags: ["Containers"],
})
  .model({
    "container.detail": ContainerModel.detail,
    "container.error": ContainerModel.error,
    "container.list": ContainerModel.list,
    "container.summary": ContainerModel.summary,
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
    "/summary",
    async ({ status }) => {
      const { data, error } = await getContainerSummary();

      if (data === null) {
        console.error(error);
        return status(500, { message: CONTAINER_SUMMARY_ERROR_MESSAGE });
      }

      return data;
    },
    {
      detail: {
        description:
          "Returns container counts grouped by normalized health state.",
        operationId: "getContainerSummary",
        summary: "Get container summary",
      },
      response: {
        200: "container.summary",
        500: "container.error",
      },
    }
  )
  .get(
    "/stream",
    async ({ request, status }) => {
      try {
        const initialContainers = await getContainers({ withStats: true });

        return (async function* () {
          try {
            for await (const containers of streamContainerSnapshots(
              initialContainers,
              request.signal,
              { withStats: true }
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
                    'event: containers\\ndata: [{"id":"...","name":"...","image":"...","state":"HEALTHY","cpu":2.1,"ram":14.8}]\\n\\n',
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
  )
  .get(
    "/:id",
    async ({ params, status }) => {
      const { data, error } = await getContainer(params.id);

      if (data === null) {
        console.error(error);

        if (isNotFoundError(error)) {
          return status(404, { message: CONTAINER_NOT_FOUND_MESSAGE });
        }

        return status(500, { message: CONTAINERS_ERROR_MESSAGE });
      }

      return data;
    },
    {
      detail: {
        description:
          "Returns Docker container details for the given container ID.",
        operationId: "getContainer",
        summary: "Get container",
      },
      params: t.Object({
        id: t.String({ description: "Docker container ID or name." }),
      }),
      response: {
        200: "container.detail",
        404: "container.error",
        500: "container.error",
      },
    }
  );
