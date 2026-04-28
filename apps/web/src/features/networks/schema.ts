import { z } from "zod";

export const networkStateSummarySchema = z.object({
  connected: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

export type NetworkStateSummary = z.infer<typeof networkStateSummarySchema>;
