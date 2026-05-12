import { t, type UnwrapSchema } from "elysia";

export const NetworkModel = {
  error: t.Object({
    message: t.String({
      description: "Human-readable error message.",
    }),
  }),
  summary: t.Object({
    connected: t.Number({
      description: "Number of networks with at least one attached container.",
      minimum: 0,
    }),
    total: t.Number({
      description: "Total number of Docker networks.",
      minimum: 0,
    }),
  }),
} as const;

export type NetworkModel = {
  [k in keyof typeof NetworkModel]: UnwrapSchema<(typeof NetworkModel)[k]>;
};
