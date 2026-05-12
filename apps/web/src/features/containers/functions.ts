import { createServerFn } from "@tanstack/react-start";
import { api } from "#/lib/api/client";

interface GetContainerInput {
  id: string;
}

export const getContainersFn = createServerFn().handler(async () => {
  const { data, error } = await api.containers.get();
  if (error) {
    console.error(error.value);

    return [];
  }

  return data;
});

export const getContainerFn = createServerFn({ method: "GET" })
  .inputValidator((data: GetContainerInput) => data)
  .handler(async ({ data: input }) => {
    const { data, error } = await api.containers({ id: input.id }).get();

    if (error) {
      console.error(error.value);
      return null;
    }

    return data;
  });
