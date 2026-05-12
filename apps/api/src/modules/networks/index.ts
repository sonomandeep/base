import { Elysia } from "elysia";
import { NetworkModel } from "./model";
import { getNetworkSummary } from "./service";

const NETWORK_SUMMARY_ERROR_MESSAGE = "Unable to read network summary.";

export const networks = new Elysia({
  prefix: "/networks",
  tags: ["Networks"],
})
  .model({
    "network.error": NetworkModel.error,
    "network.summary": NetworkModel.summary,
  })
  .get(
    "/summary",
    async ({ status }) => {
      const { data, error } = await getNetworkSummary();

      if (data === null) {
        console.error(error);
        return status(500, { message: NETWORK_SUMMARY_ERROR_MESSAGE });
      }

      return data;
    },
    {
      detail: {
        description:
          "Returns Docker network count and connected network count.",
        operationId: "getNetworkSummary",
        summary: "Get network summary",
      },
      response: {
        200: "network.summary",
        500: "network.error",
      },
    }
  );
