import { createServerFn } from "@tanstack/react-start";
import { getContainers } from "./service.server";

export const getContainersFn = createServerFn().handler(async () => {
  const { data, error } = await getContainers();
  if (error) {
    console.error(error);
  }

  return data;
});
