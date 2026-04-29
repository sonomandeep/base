import { t, type UnwrapSchema } from "elysia";

export const ContainerModel = {
  containersResponse: t.Object({
    id: t.String(),
  }),
};

export type ContainerModel = {
  [k in keyof typeof ContainerModel]: UnwrapSchema<(typeof ContainerModel)[k]>;
};
