import { createServerFn } from "@tanstack/react-start";
import { getImages } from "./service.server";

export const getImagesFn = createServerFn().handler(async () => {
  const { data, error } = await getImages();
  if (error) {
    console.error(error);
  }

  return data;
});
