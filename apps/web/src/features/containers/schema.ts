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

export type ContainerListItem = z.infer<typeof containerListItemSchema>;
