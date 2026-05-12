import { Elysia, sse } from "elysia";
import { HostModel } from "./model";
import { getHostState, streamHostStates } from "./service";

const HOST_STATE_ERROR_MESSAGE = "Unable to read host state.";

export const hosts = new Elysia({
  prefix: "/hosts",
  tags: ["Hosts"],
})
  .model({
    "host.error": HostModel.error,
    "host.state": HostModel.state,
  })
  .get(
    "/current/state",
    async ({ status }) => {
      const { data, error } = await getHostState();

      if (data === null) {
        console.error(error);
        return status(500, { message: HOST_STATE_ERROR_MESSAGE });
      }

      return data;
    },
    {
      detail: {
        description:
          "Returns CPU, memory, storage, container, and image state for the host observed by this API instance.",
        operationId: "getCurrentHostState",
        summary: "Get current host state",
      },
      response: {
        200: "host.state",
        500: "host.error",
      },
    }
  )
  .get(
    "/current/stream",
    async ({ request, status }) => {
      const { data, error } = await getHostState();

      if (data === null) {
        console.error(error);
        return status(500, { message: HOST_STATE_ERROR_MESSAGE });
      }

      return (async function* () {
        for await (const state of streamHostStates(data, request.signal)) {
          if (state.data === null) {
            console.error(state.error);
            yield sse({
              data: { message: HOST_STATE_ERROR_MESSAGE },
              event: "hosts.error",
            });
            break;
          }

          yield sse({ event: "hosts.state", data: state.data });
        }
      })();
    },
    {
      detail: {
        description:
          "Streams current host state snapshots as Server-Sent Events. Each hosts.state event contains a payload compatible with host.state. If polling fails after the stream opens, a hosts.error event is emitted before closing the stream.",
        operationId: "streamCurrentHostState",
        responses: {
          200: {
            content: {
              "text/event-stream": {
                schema: {
                  example:
                    'event: hosts.state\ndata: {"cpu":{"cores":8,"usage":12.4},"memory":{"total":16777216,"free":8388608,"used":8388608,"usage":50},"storage":{"total":1000000000,"free":600000000,"used":400000000,"usage":40},"containers":{"total":3,"healthy":2,"degraded":0,"stopped":1},"images":{"total":12,"size":123456789}}\n\n',
                  type: "string",
                },
              },
            },
            description:
              "Server-Sent Events stream. Emits hosts.state and hosts.error events.",
          },
          500: {
            description:
              "The initial host state could not be loaded before opening the stream.",
          },
        },
        summary: "Stream current host state",
      },
      response: {
        500: "host.error",
      },
    }
  );
