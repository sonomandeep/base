import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { api } from "#/lib/api/client";
import { throwIfUnauthorizedApiError } from "#/lib/api/errors";
import { ensureSessionFn } from "../auth/functions";

export const getVolumeStateSummaryFn = createServerFn().handler(async () => {
  await ensureSessionFn();
  const headers = getRequestHeaders();
  const { data, error } = await api.volumes.summary.get({
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
