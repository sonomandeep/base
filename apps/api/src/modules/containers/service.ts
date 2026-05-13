import type Dockerode from "dockerode";
import { client } from "../../lib/client";
import { sleep } from "../../lib/timing";
import type { ContainerModel, ContainerState } from "./model";

const CONTAINER_NAME_PREFIX = /^\//;
const CONTAINER_SHELL_COMMAND =
  "if command -v bash >/dev/null 2>&1; then exec bash; else exec sh; fi";
const STREAM_INTERVAL_MS = 2500;

interface GetContainersOptions {
  withStats?: boolean;
}

type ContainerDetailResult =
  | { data: ContainerModel["detail"]; error: null }
  | { data: null; error: unknown };

export interface ContainerShellSize {
  cols: number;
  rows: number;
}

export interface ContainerShellSession {
  close: () => void;
  resize: (size: ContainerShellSize) => void;
  write: (data: string) => void;
}

interface CreateContainerShellSessionOptions extends ContainerShellSize {
  onClose: () => void;
  onData: (data: string) => void;
  onError: (error: unknown) => void;
}

interface BunTerminal {
  close: () => void;
  readonly closed: boolean;
  resize: (cols: number, rows: number) => void;
  write: (data: string) => number;
}

interface BunSubprocess {
  readonly exited: Promise<number>;
  kill: () => void;
  readonly terminal: BunTerminal | undefined;
}

type BunSpawn = (
  command: string[],
  options: {
    terminal: {
      cols: number;
      data: (terminal: BunTerminal, data: Uint8Array<ArrayBuffer>) => void;
      exit: () => void;
      rows: number;
    };
  }
) => BunSubprocess;

const bunRuntime = globalThis as typeof globalThis & {
  Bun: {
    spawn: BunSpawn;
  };
};

export class ContainerShellError extends Error {
  readonly code: "NOT_RUNNING" | "START_FAILED";

  constructor(code: "NOT_RUNNING" | "START_FAILED", message: string) {
    super(message);
    this.code = code;
    this.name = "ContainerShellError";
  }
}

function createSpawnShellSession(
  containerId: string,
  options: CreateContainerShellSessionOptions
): ContainerShellSession {
  let closed = false;
  const closeOnce = () => {
    if (closed) {
      return;
    }

    closed = true;
    options.onClose();
  };
  const process = bunRuntime.Bun.spawn(
    [
      "docker",
      "exec",
      "-it",
      containerId,
      "sh",
      "-lc",
      CONTAINER_SHELL_COMMAND,
    ],
    {
      terminal: {
        cols: options.cols,
        data: (_, data) => {
          options.onData(new TextDecoder().decode(data));
        },
        exit: closeOnce,
        rows: options.rows,
      },
    }
  );
  const terminal = process.terminal;

  if (!terminal) {
    process.kill();
    throw new Error("Unable to open terminal.");
  }

  process.exited.then(closeOnce).catch(options.onError);

  return {
    close: () => {
      if (!terminal.closed) {
        terminal.close();
      }

      process.kill();
    },
    resize: ({ cols, rows }) => {
      if (!(terminal.closed || cols <= 0 || rows <= 0)) {
        terminal.resize(cols, rows);
      }
    },
    write: (data) => {
      if (!terminal.closed) {
        terminal.write(data.replaceAll("\r", "\n"));
      }
    },
  };
}

interface DockerVolumeUsage {
  Name?: string;
  UsageData?: {
    Size?: number;
  } | null;
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
    return { cpu: null, memoryLimit: null, ram: null };
  }

  try {
    const stats = await client.getContainer(id).stats({ stream: false });

    return {
      cpu: getContainerCpu(stats),
      memoryLimit: stats.memory_stats.limit || null,
      ram: getContainerRam(stats),
    };
  } catch {
    return { cpu: null, memoryLimit: null, ram: null };
  }
}

function getContainerCpuLimit(inspect: Dockerode.ContainerInspectInfo) {
  const hostConfig =
    inspect.HostConfig as Dockerode.ContainerInspectInfo["HostConfig"] & {
      CpuPeriod?: number;
      CpuQuota?: number;
      NanoCpus?: number;
    };

  if (hostConfig.NanoCpus && hostConfig.NanoCpus > 0) {
    return hostConfig.NanoCpus / 1_000_000_000;
  }

  if (
    hostConfig.CpuQuota &&
    hostConfig.CpuQuota > 0 &&
    hostConfig.CpuPeriod &&
    hostConfig.CpuPeriod > 0
  ) {
    return hostConfig.CpuQuota / hostConfig.CpuPeriod;
  }

  return null;
}

function getContainerUptimeSeconds(startedAt?: string, running?: boolean) {
  if (!(running && startedAt) || startedAt.startsWith("0001-")) {
    return null;
  }

  const startedAtTime = new Date(startedAt).getTime();

  if (Number.isNaN(startedAtTime)) {
    return null;
  }

  return Math.max(Math.floor((Date.now() - startedAtTime) / 1000), 0);
}

function getContainerDisk(inspect: Dockerode.ContainerInspectInfo) {
  const sizes = inspect as Dockerode.ContainerInspectInfo & {
    SizeRootFs?: number;
    SizeRw?: number;
  };
  const size = sizes.SizeRootFs ?? sizes.SizeRw ?? null;
  const writableSize = sizes.SizeRw ?? null;

  return {
    size,
    usage:
      size && writableSize !== null
        ? Number(((writableSize / size) * 100).toFixed(1))
        : null,
  };
}

function getContainerPorts(inspect: Dockerode.ContainerInspectInfo) {
  return Object.entries(inspect.NetworkSettings.Ports ?? {}).flatMap(
    ([port, bindings]) => {
      const [privatePort, type = "tcp"] = port.split("/");
      const parsedPrivatePort = Number(privatePort);

      if (!bindings || bindings.length === 0) {
        return [
          {
            ip: null,
            privatePort: parsedPrivatePort,
            publicPort: null,
            type,
          },
        ];
      }

      return bindings.map((binding) => ({
        ip: binding.HostIp || null,
        privatePort: parsedPrivatePort,
        publicPort: binding.HostPort ? Number(binding.HostPort) : null,
        type,
      }));
    }
  );
}

function getContainerEnvs(inspect: Dockerode.ContainerInspectInfo) {
  return (inspect.Config.Env ?? []).map((env) => {
    const separatorIndex = env.indexOf("=");

    if (separatorIndex === -1) {
      return { key: env, value: "" };
    }

    return {
      key: env.slice(0, separatorIndex),
      value: env.slice(separatorIndex + 1),
    };
  });
}

async function getNetworkDriverMap() {
  try {
    const networks = await client.listNetworks();
    const drivers = new Map<string, string>();

    for (const network of networks) {
      const driver = network.Driver ?? "unknown";

      if (network.Id) {
        drivers.set(network.Id, driver);
      }

      if (network.Name) {
        drivers.set(network.Name, driver);
      }
    }

    return drivers;
  } catch {
    return new Map<string, string>();
  }
}

function getContainerNetworks(
  inspect: Dockerode.ContainerInspectInfo,
  drivers: Map<string, string>
) {
  return Object.entries(inspect.NetworkSettings.Networks ?? {}).map(
    ([name, network]) => ({
      driver:
        drivers.get(network.NetworkID ?? "") ?? drivers.get(name) ?? "unknown",
      id: network.NetworkID ?? "",
      ipAddress: network.IPAddress ?? "",
      macAddress: network.MacAddress ?? "",
      name,
    })
  );
}

async function getVolumeSizeMap() {
  try {
    const usage = await client.df();
    const sizes = new Map<string, number>();
    const volumes: DockerVolumeUsage[] = usage.Volumes ?? [];

    for (const volume of volumes) {
      if (volume.Name && volume.UsageData?.Size !== undefined) {
        sizes.set(volume.Name, volume.UsageData.Size);
      }
    }

    return sizes;
  } catch {
    return new Map<string, number>();
  }
}

function getContainerMounts(
  inspect: Dockerode.ContainerInspectInfo,
  volumeSizes: Map<string, number>
) {
  return (inspect.Mounts ?? []).map((mount) => ({
    destination: mount.Destination ?? "",
    name: mount.Name ?? null,
    rw: mount.RW ?? false,
    size: mount.Name ? (volumeSizes.get(mount.Name) ?? null) : null,
    source: mount.Source ?? "",
    type: mount.Type ?? "",
  }));
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

export async function getContainer(id: string): Promise<ContainerDetailResult> {
  try {
    const container = client.getContainer(id);
    const inspect = await (
      container.inspect as unknown as (options: {
        size: boolean;
      }) => Promise<Dockerode.ContainerInspectInfo>
    )({ size: true });
    const status = inspect.State.Status ?? "unknown";
    const health = inspect.State.Health?.Status;
    const state = getContainerState(
      status,
      health ? `${status} (${health})` : status
    );
    const [networkDrivers, stats, volumeSizes] = await Promise.all([
      getNetworkDriverMap(),
      getContainerStats(inspect.Id, state),
      getVolumeSizeMap(),
    ]);

    return {
      data: {
        cpu: {
          limitCores: getContainerCpuLimit(inspect),
          usage: stats.cpu,
        },
        createdAt: inspect.Created ?? null,
        disk: getContainerDisk(inspect),
        envs: getContainerEnvs(inspect),
        finishedAt: inspect.State.FinishedAt ?? null,
        id: inspect.Id,
        image: inspect.Config.Image ?? inspect.Image,
        memory: {
          limit: stats.memoryLimit,
          usage: stats.ram,
        },
        mounts: getContainerMounts(inspect, volumeSizes),
        name:
          inspect.Name?.replace(CONTAINER_NAME_PREFIX, "") ||
          inspect.Id.slice(0, 12),
        networks: getContainerNetworks(inspect, networkDrivers),
        ports: getContainerPorts(inspect),
        restartCount: inspect.RestartCount ?? 0,
        shortId: inspect.Id.slice(0, 12),
        startedAt: inspect.State.StartedAt ?? null,
        state,
        status,
        uptimeSeconds: getContainerUptimeSeconds(
          inspect.State.StartedAt,
          inspect.State.Running
        ),
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createContainerShellSession(
  id: string,
  options: CreateContainerShellSessionOptions
): Promise<ContainerShellSession> {
  const container = client.getContainer(id);
  const inspect = await container.inspect();

  if (!inspect.State.Running) {
    throw new ContainerShellError("NOT_RUNNING", "Container is not running.");
  }

  try {
    return createSpawnShellSession(inspect.Id, options);
  } catch (error) {
    if (error instanceof ContainerShellError) {
      throw error;
    }

    throw new ContainerShellError("START_FAILED", "Unable to start shell.");
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
