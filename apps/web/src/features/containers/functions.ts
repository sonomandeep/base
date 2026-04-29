import { createServerFn } from "@tanstack/react-start";
import { api } from "#/lib/api/client";

export const getContainersFn = createServerFn().handler(async () => {
  const { data, error } = await api.containers.get();
  if (error) {
    console.error(error.value);

    return [];
  }

  return data;
});
