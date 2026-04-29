import { client } from "../../lib/client";
import type { ContainerModel, ContainerState } from "./model";

const CONTAINER_NAME_PREFIX = /^\//;
const STREAM_INTERVAL_MS = 1000;

function sleep(ms: number, signal: AbortSignal) {
  if (signal.aborted) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, ms);

    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout);
        resolve();
      },
      { once: true }
    );
  });
}

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

export async function* streamContainerSnapshots(
  initialContainers: ContainerModel["list"],
  signal: AbortSignal
) {
  yield initialContainers;

  while (!signal.aborted) {
    await sleep(STREAM_INTERVAL_MS, signal);

    if (signal.aborted) {
      break;
    }

    yield await getContainers();
  }
}
