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
  detail: t.Object({
    cpu: t.Object({
      limitCores: t.Nullable(
        t.Number({
          description: "CPU limit configured for the container in vCPU units.",
          minimum: 0,
        })
      ),
      usage: t.Nullable(
        t.Number({
          description:
            "CPU usage percentage, or null when stats are unavailable.",
        })
      ),
    }),
    createdAt: t.Nullable(
      t.String({ description: "Container creation timestamp." })
    ),
    disk: t.Object({
      size: t.Nullable(
        t.Number({
          description: "Container root filesystem size in bytes.",
          minimum: 0,
        })
      ),
      usage: t.Nullable(
        t.Number({
          description:
            "Writable layer usage percentage relative to root filesystem size.",
          minimum: 0,
        })
      ),
    }),
    finishedAt: t.Nullable(
      t.String({ description: "Container last finished timestamp." })
    ),
    id: t.String({ description: "Docker container ID." }),
    image: t.String({ description: "Container image name." }),
    memory: t.Object({
      limit: t.Nullable(
        t.Number({
          description: "Container memory limit in bytes.",
          minimum: 0,
        })
      ),
      usage: t.Nullable(
        t.Number({
          description:
            "Memory usage percentage, or null when stats are unavailable.",
          minimum: 0,
        })
      ),
    }),
    mounts: t.Array(
      t.Object({
        destination: t.String({ description: "Mount destination path." }),
        name: t.Nullable(t.String({ description: "Docker volume name." })),
        rw: t.Boolean({ description: "Whether the mount is writable." }),
        source: t.String({ description: "Mount source path." }),
        type: t.String({ description: "Mount type." }),
      })
    ),
    name: t.String({ description: "Display name without the leading slash." }),
    networks: t.Array(
      t.Object({
        driver: t.String({ description: "Docker network driver." }),
        id: t.String({ description: "Network ID." }),
        ipAddress: t.String({ description: "Container IP address." }),
        macAddress: t.String({ description: "Container MAC address." }),
        name: t.String({ description: "Network name." }),
      })
    ),
    ports: t.Array(
      t.Object({
        ip: t.Nullable(t.String({ description: "Host binding IP address." })),
        privatePort: t.Number({
          description: "Container private port.",
          minimum: 0,
        }),
        publicPort: t.Nullable(
          t.Number({ description: "Host public port.", minimum: 0 })
        ),
        type: t.String({ description: "Port protocol." }),
      })
    ),
    restartCount: t.Number({
      description: "Number of container restarts.",
      minimum: 0,
    }),
    shortId: t.String({ description: "Short Docker container ID." }),
    startedAt: t.Nullable(
      t.String({ description: "Container last started timestamp." })
    ),
    state: containerState,
    status: t.String({ description: "Raw Docker container status." }),
    uptimeSeconds: t.Nullable(
      t.Number({ description: "Container uptime in seconds.", minimum: 0 })
    ),
  }),
  summary: t.Object({
    degraded: t.Number({
      description: "Number of degraded containers.",
      minimum: 0,
    }),
    healthy: t.Number({
      description: "Number of healthy containers.",
      minimum: 0,
    }),
    stopped: t.Number({
      description: "Number of stopped containers.",
      minimum: 0,
    }),
    total: t.Number({
      description: "Total number of Docker containers.",
      minimum: 0,
    }),
  }),
} as const;

export type ContainerState = UnwrapSchema<typeof ContainerModel.state>;

export type ContainerModel = {
  [k in keyof typeof ContainerModel]: UnwrapSchema<(typeof ContainerModel)[k]>;
};
