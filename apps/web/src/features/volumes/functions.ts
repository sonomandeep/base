import { createServerFn } from "@tanstack/react-start";
import { getVolumeStateSummary } from "./service.server";

export const getVolumeStateSummaryFn = createServerFn().handler(async () => {
  const { data, error } = await getVolumeStateSummary();
  if (error) {
    console.error(error);
  }

  return data;
});
