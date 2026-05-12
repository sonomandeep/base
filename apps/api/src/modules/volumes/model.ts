import { t, type UnwrapSchema } from "elysia";

export const VolumeModel = {
  error: t.Object({
    message: t.String({
      description: "Human-readable error message.",
    }),
  }),
  summary: t.Object({
    size: t.Number({
      description: "Total volume size in bytes.",
      minimum: 0,
    }),
    total: t.Number({
      description: "Total number of Docker volumes.",
      minimum: 0,
    }),
  }),
} as const;

export type VolumeModel = {
  [k in keyof typeof VolumeModel]: UnwrapSchema<(typeof VolumeModel)[k]>;
};
