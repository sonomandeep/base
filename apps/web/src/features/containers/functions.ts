import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { api } from "#/lib/api/client";

const getContainerInputSchema = z.object({
  id: z.string().min(1),
});

export const getContainersFn = createServerFn().handler(async () => {
  const { data, error } = await api.containers.get();
  if (error) {
    console.error(error.value);

    return [];
  }

  return data;
});

export const getContainerFn = createServerFn({ method: "GET" })
  .inputValidator(zodValidator(getContainerInputSchema))
  .handler(async ({ data: input }) => {
    const { data, error } = await api.containers({ id: input.id }).get();

    if (error) {
      console.error(error.value);
      return null;
    }

    return data;
  });
