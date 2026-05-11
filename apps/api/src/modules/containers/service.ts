import type Dockerode from "dockerode";
import { client } from "../../lib/client";
import type { ContainerModel, ContainerState } from "./model";

const CONTAINER_NAME_PREFIX = /^\//;
const STREAM_INTERVAL_MS = 2500;

interface GetContainersOptions {
  withStats?: boolean;
}

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

function getContainerCpu(stats: Dockerode.ContainerStats) {
  const cpuDelta =
    stats.cpu_stats.cpu_usage.total_usage -
    stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta =
    stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const onlineCpus =
    stats.cpu_stats.online_cpus ||
    stats.cpu_stats.cpu_usage.percpu_usage?.length ||
    1;

  if (systemDelta <= 0) {
    return null;
  }

  return Number(((cpuDelta / systemDelta) * onlineCpus * 100 || 0).toFixed(1));
}

function getContainerRam(stats: Dockerode.ContainerStats) {
  const cache = stats.memory_stats.stats?.cache ?? 0;
  const usage = Math.max(stats.memory_stats.usage - cache, 0);
  const limit = stats.memory_stats.limit;

  return limit > 0 ? Number(((usage / limit) * 100).toFixed(1)) : null;
}

async function getContainerStats(id: string, state: ContainerState) {
  if (state === "STOPPED") {
    return { cpu: null, ram: null };
  }

  try {
    const stats = await client.getContainer(id).stats({ stream: false });

    return {
      cpu: getContainerCpu(stats),
      ram: getContainerRam(stats),
    };
  } catch {
    return { cpu: null, ram: null };
  }
}

export async function getContainers({
  withStats = false,
}: GetContainersOptions = {}): Promise<ContainerModel["list"]> {
  const containers = await client.listContainers({ all: true });

  return Promise.all(
    containers.map(async (container) => {
      const state = getContainerState(container.State, container.Status);
      const stats = withStats
        ? await getContainerStats(container.Id, state)
        : { cpu: null, ram: null };

      return {
        cpu: stats.cpu,
        id: container.Id,
        image: container.Image,
        name: getContainerName(container.Id, container.Names),
        ram: stats.ram,
        state,
      };
    })
  );
}

export async function getContainerSummary(): Promise<
  | { data: ContainerModel["summary"]; error: null }
  | { data: null; error: unknown }
> {
  try {
    const containers = await client.listContainers({ all: true });
    const summary: ContainerModel["summary"] = {
      degraded: 0,
      healthy: 0,
      stopped: 0,
      total: containers.length,
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

export async function* streamContainerSnapshots(
  initialContainers: ContainerModel["list"],
  signal: AbortSignal,
  options?: GetContainersOptions
) {
  yield initialContainers;

  while (!signal.aborted) {
    await sleep(STREAM_INTERVAL_MS, signal);

    if (signal.aborted) {
      break;
    }

    yield await getContainers(options);
  }
}
