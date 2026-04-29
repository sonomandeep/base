import { t, type UnwrapSchema } from "elysia";

const containerState = t.Union(
  [t.Literal("DEGRADED"), t.Literal("HEALTHY"), t.Literal("STOPPED")],
  {
    description:
      "Normalized container state derived from Docker state and health status.",
  }
);

export const ContainerModel = {
  state: containerState,
  error: t.Object({
    message: t.String({
      description: "Human-readable error message.",
    }),
  }),
  list: t.Array(
    t.Object({
      cpu: t.Nullable(
        t.Number({
          description:
            "CPU usage percentage, or null when stats are unavailable.",
        })
      ),
      id: t.String({ description: "Docker container ID." }),
      image: t.String({ description: "Container image name." }),
      name: t.String({
        description: "Display name without the leading slash.",
      }),
      ram: t.Nullable(
        t.Number({
          description:
            "Memory usage percentage, or null when stats are unavailable.",
        })
      ),
      state: containerState,
    }),
    {
      description: "Containers visible from the configured Docker socket.",
    }
  ),
} as const;

export type ContainerState = UnwrapSchema<typeof ContainerModel.state>;

export type ContainerModel = {
  [k in keyof typeof ContainerModel]: UnwrapSchema<(typeof ContainerModel)[k]>;
};
