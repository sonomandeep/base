import { createServerFn } from "@tanstack/react-start";
import { api } from "#/lib/api/client";

export const getImagesFn = createServerFn().handler(async () => {
  const { data, error } = await api.images.get();

  if (error) {
    console.error(error.value);
    return [];
  }

  return data;
});
