import { createServerFn } from "@tanstack/react-start";
import { getMetrics } from "./service.server";

export const getHostStateFn = createServerFn().handler(async () => {
  const { data, error } = await getMetrics();
  if (error) {
    console.error(error);
  }

  return data;
});
