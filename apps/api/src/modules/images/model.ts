import { t, type UnwrapSchema } from "elysia";

export const ImageModel = {
  error: t.Object({
    message: t.String({
      description: "Human-readable error message.",
    }),
  }),
  list: t.Array(
    t.Object({
      id: t.String({ description: "Docker image ID." }),
      name: t.String({ description: "Image repository name." }),
      size: t.Number({
        description: "Image size in bytes.",
        minimum: 0,
      }),
      tag: t.String({ description: "Image tag." }),
    }),
    {
      description: "Images visible from the configured Docker socket.",
    }
  ),
  summary: t.Object({
    size: t.Number({
      description: "Total image layer size in bytes.",
      minimum: 0,
    }),
    total: t.Number({
      description: "Total number of Docker images.",
      minimum: 0,
    }),
  }),
} as const;

export type ImageModel = {
  [k in keyof typeof ImageModel]: UnwrapSchema<(typeof ImageModel)[k]>;
};
