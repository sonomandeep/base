import { z } from "zod";

export const containerStateSchema = z.enum(["DEGRADED", "HEALTHY", "STOPPED"]);

export type ContainerState = z.infer<typeof containerStateSchema>;

export const containerSchema = z.object({
  cpu: z.number().nullable(),
  id: z.string(),
  image: z.string(),
  name: z.string(),
  ram: z.number().nullable(),
  state: containerStateSchema,
});

export const ContainerModel = {
  containersResponse: z.array(containerSchema),
};

export type ContainerModel = {
  [k in keyof typeof ContainerModel]: z.infer<(typeof ContainerModel)[k]>;
};
