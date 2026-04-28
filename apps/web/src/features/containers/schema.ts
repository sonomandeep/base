import { z } from "zod";

export const containerStateSchema = z.enum(["DEGRADED", "HEALTHY", "STOPPED"]);

export const containerListItemSchema = z.object({
  cpu: z.number().nullable(),
  id: z.string(),
  image: z.string(),
  name: z.string(),
  ram: z.number().nullable(),
  state: containerStateSchema,
});

export const containerListSchema = z.array(containerListItemSchema);

export const containerStateSummarySchema = z.object({
  degraded: z.number().int().nonnegative(),
  healthy: z.number().int().nonnegative(),
  stopped: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

export type ContainerListItem = z.infer<typeof containerListItemSchema>;
export type ContainerState = z.infer<typeof containerStateSchema>;
export type ContainerStateSummary = z.infer<typeof containerStateSummarySchema>;
