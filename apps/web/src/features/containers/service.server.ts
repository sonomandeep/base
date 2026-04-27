import { docker } from "#/lib/docker/client.server";

export interface ContainerStateSummary {
  degraded: number;
  healthy: number;
  stopped: number;
  total: number;
}

const CONTAINERS = [
  {
    id: 1,
    name: "API Gateway",
    image: "nginx:latest",
    cpu: 24,
    ram: 47,
    state: "HEALTHY",
  },
  {
    id: 2,
    name: "User Authentication",
    image: "auth-service:v2",
    cpu: 18,
    ram: 35,
    state: "DEGRADED",
  },
  {
    id: 3,
    name: "Notification Service",
    image: "notification-service:4.0.1",
    cpu: 51,
    ram: 79,
    state: "HEALTHY",
  },
  {
    id: 4,
    name: "Cache",
    image: "redis:6-alpine",
    cpu: 8,
    ram: 15,
    state: "STOPPED",
  },
  {
    id: 5,
    name: "Database",
    image: "postgres:latest",
    cpu: 12,
    ram: 29,
    state: "HEALTHY",
  },
];

function getContainerState(state?: string, status?: string) {
  const normalizedState = state?.toLowerCase();
  const normalizedStatus = status?.toLowerCase() ?? "";

  if (normalizedState === "running") {
    return normalizedStatus.includes("unhealthy") ||
      normalizedStatus.includes("health: starting")
      ? "DEGRADED"
      : "HEALTHY";
  }

  return normalizedState === "paused" || normalizedState === "restarting"
    ? "DEGRADED"
    : "STOPPED";
}

export async function getContainerStateSummary() {
  try {
    const containers = await docker.listContainers({ all: true });
    const summary: ContainerStateSummary = {
      total: containers.length,
      healthy: 0,
      degraded: 0,
      stopped: 0,
    };

    for (const container of containers) {
      const state = getContainerState(container.State, container.Status);

      if (state === "HEALTHY") {
        summary.healthy += 1;
      } else if (state === "DEGRADED") {
        summary.degraded += 1;
      } else {
        summary.stopped += 1;
      }
    }

    return { data: summary, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getContainers() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { data: CONTAINERS, error: null };
}
