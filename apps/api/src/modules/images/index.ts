import { Elysia } from "elysia";
import { ImageModel } from "./model";
import { getImageSummary, getImages } from "./service";

const IMAGES_ERROR_MESSAGE = "Unable to read images.";
const IMAGE_SUMMARY_ERROR_MESSAGE = "Unable to read image summary.";

export const images = new Elysia({
  prefix: "/images",
  tags: ["Images"],
})
  .model({
    "image.error": ImageModel.error,
    "image.list": ImageModel.list,
    "image.summary": ImageModel.summary,
  })
  .get(
    "/",
    async ({ status }) => {
      try {
        return await getImages();
      } catch {
        return status(500, { message: IMAGES_ERROR_MESSAGE });
      }
    },
    {
      detail: {
        description:
          "Returns Docker images visible from the configured Docker socket.",
        operationId: "listImages",
        summary: "List images",
      },
      response: {
        200: "image.list",
        500: "image.error",
      },
    }
  )
  .get(
    "/summary",
    async ({ status }) => {
      const { data, error } = await getImageSummary();

      if (data === null) {
        console.error(error);
        return status(500, { message: IMAGE_SUMMARY_ERROR_MESSAGE });
      }

      return data;
    },
    {
      detail: {
        description:
          "Returns image count and total layer size from Docker disk usage.",
        operationId: "getImageSummary",
        summary: "Get image summary",
      },
      response: {
        200: "image.summary",
        500: "image.error",
      },
    }
  );
