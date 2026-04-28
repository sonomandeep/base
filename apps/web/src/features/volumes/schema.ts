import { z } from "zod";

export const volumeStateSummarySchema = z.object({
  size: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

export type VolumeStateSummary = z.infer<typeof volumeStateSummarySchema>;
