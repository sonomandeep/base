import { createServerFn } from "@tanstack/react-start";
import { api } from "#/lib/api/client";

export const getNetworkStateSummaryFn = createServerFn().handler(async () => {
  const { data, error } = await api.networks.summary.get();

  if (error) {
    console.error(error.value);
    return null;
  }

  return data;
});
