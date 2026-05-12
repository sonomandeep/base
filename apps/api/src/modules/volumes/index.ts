import { Elysia } from "elysia";
import { VolumeModel } from "./model";
import { getVolumeSummary } from "./service";

const VOLUME_SUMMARY_ERROR_MESSAGE = "Unable to read volume summary.";

export const volumes = new Elysia({
  prefix: "/volumes",
  tags: ["Volumes"],
})
  .model({
    "volume.error": VolumeModel.error,
    "volume.summary": VolumeModel.summary,
  })
  .get(
    "/summary",
    async ({ status }) => {
      const { data, error } = await getVolumeSummary();

      if (data === null) {
        console.error(error);
        return status(500, { message: VOLUME_SUMMARY_ERROR_MESSAGE });
      }

      return data;
    },
    {
      detail: {
        description:
          "Returns Docker volume count and total size from Docker disk usage.",
        operationId: "getVolumeSummary",
        summary: "Get volume summary",
      },
      response: {
        200: "volume.summary",
        500: "volume.error",
      },
    }
  );
