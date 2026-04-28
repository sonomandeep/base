import { docker } from "#/lib/docker/client.server";
import {
  type ContainerListItem,
  type ContainerState,
  type ContainerStateSummary,
  containerListSchema,
  containerStateSummarySchema,
} from "./schema";

const CONTAINER_NAME_PREFIX = /^\//;

function getContainerName(id: string, names: string[]) {
  return names[0]?.replace(CONTAINER_NAME_PREFIX, "") || id.slice(0, 12);
}

function getContainerState(state?: string, status?: string): ContainerState {
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

    return { data: containerStateSummarySchema.parse(summary), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getContainers() {
  try {
    const containers = await docker.listContainers({ all: true });
    const data: ContainerListItem[] = containers.map((container) => ({
      cpu: null,
      id: container.Id,
      image: container.Image,
      name: getContainerName(container.Id, container.Names),
      ram: null,
      state: getContainerState(container.State, container.Status),
    }));

    return { data: containerListSchema.parse(data), error: null };
  } catch (error) {
    return { data: [], error };
  }
}
