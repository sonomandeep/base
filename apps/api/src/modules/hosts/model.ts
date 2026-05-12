import { t, type UnwrapSchema } from "elysia";
import { ContainerModel } from "../containers/model";
import { ImageModel } from "../images/model";

const usage = t.Object({
  free: t.Number({
    description: "Available bytes.",
    minimum: 0,
  }),
  total: t.Number({
    description: "Total bytes.",
    minimum: 0,
  }),
  usage: t.Number({
    description: "Used percentage.",
    minimum: 0,
  }),
  used: t.Number({
    description: "Used bytes.",
    minimum: 0,
  }),
});

export const HostModel = {
  error: t.Object({
    message: t.String({
      description: "Human-readable error message.",
    }),
  }),
  state: t.Object({
    containers: ContainerModel.summary,
    cpu: t.Object({
      cores: t.Number({
        description: "Number of CPU cores available to the API process.",
        minimum: 0,
      }),
      usage: t.Number({
        description: "Average CPU usage percentage.",
        minimum: 0,
      }),
    }),
    images: ImageModel.summary,
    memory: usage,
    storage: usage,
  }),
} as const;

export type HostModel = {
  [k in keyof typeof HostModel]: UnwrapSchema<(typeof HostModel)[k]>;
};
