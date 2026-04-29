import type { UnwrapSchema } from "elysia";
import { z } from "zod";

export const ContainerModel = {
  containersResponse: z.object({
    id: z.string(),
  }),
};

export type ContainerModel = {
  [k in keyof typeof ContainerModel]: UnwrapSchema<(typeof ContainerModel)[k]>;
};
