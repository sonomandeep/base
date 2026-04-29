import { client } from "../../lib/client";
import type { ContainerModel, ContainerState } from "./model";

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

export async function getContainers(): Promise<ContainerModel["list"]> {
  const containers = await client.listContainers({ all: true });

  return containers.map((container) => ({
    cpu: null,
    id: container.Id,
    image: container.Image,
    name: getContainerName(container.Id, container.Names),
    ram: null,
    state: getContainerState(container.State, container.Status),
  }));
}
