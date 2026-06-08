import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { api } from "#/lib/api/client";
import { throwIfUnauthorizedApiError } from "#/lib/api/errors";
import { ensureSessionFn } from "../auth/functions";

const getContainerInputSchema = z.object({
  id: z.string().min(1),
});

export const getContainersFn = createServerFn().handler(async () => {
  await ensureSessionFn();
  const headers = getRequestHeaders();
  const { data, error } = await api.containers.get({
    fetch: {
      headers,
    },
  });
  if (error) {
    throwIfUnauthorizedApiError(error);
    console.error(error.value);

    return [];
  }

  return data;
});

export const getContainerFn = createServerFn({ method: "GET" })
  .inputValidator(zodValidator(getContainerInputSchema))
  .handler(async ({ data: input }) => {
    await ensureSessionFn();
    const headers = getRequestHeaders();
    const { data, error } = await api.containers({ id: input.id }).get({
      fetch: {
        headers,
      },
    });

    if (error) {
      throwIfUnauthorizedApiError(error);
      console.error(error.value);
      return null;
    }

    return data;
  });
