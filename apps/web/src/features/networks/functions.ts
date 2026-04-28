import { createServerFn } from "@tanstack/react-start";
import { getNetworkStateSummary } from "./service.server";

export const getNetworkStateSummaryFn = createServerFn().handler(async () => {
  const { data, error } = await getNetworkStateSummary();
  if (error) {
    console.error(error);
  }

  return data;
});
