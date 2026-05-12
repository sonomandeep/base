import { statfs } from "node:fs/promises";
import os from "node:os";
import { sleep } from "../../lib/timing";
import { getContainerSummary } from "../containers/service";
import { getImageSummary } from "../images/service";
import type { HostModel } from "./model";

const HOST_STREAM_INTERVAL_MS = 1000;

type HostStateResult =
  | { data: HostModel["state"]; error: null }
  | { data: null; error: unknown };

async function getCpuUsage(): Promise<number> {
  const sample = () =>
    os.cpus().map(({ times }) => ({
      idle: times.idle,
      total: Object.values(times).reduce((a, b) => a + b, 0),
    }));

  const before = sample();
  await new Promise((resolve) => setTimeout(resolve, 500));
  const after = sample();

  if (before.length === 0) {
    return 0;
  }

  const avgUsage =
    before.reduce((sum, previous, index) => {
      const idleDiff = after[index].idle - previous.idle;
      const totalDiff = after[index].total - previous.total;

      return totalDiff > 0 ? sum + (1 - idleDiff / totalDiff) : sum;
    }, 0) / before.length;

  return avgUsage * 100;
}

async function getStorageUsage(path = "/") {
  const { bavail, blocks, bsize } = await statfs(path);
  const total = blocks * bsize;
  const free = bavail * bsize;
  const used = total - free;

  return {
    free,
    total,
    usage: total ? (used / total) * 100 : 0,
    used,
  };
}

function getMemoryUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;

  return {
    free,
    total,
    usage: total ? (used / total) * 100 : 0,
    used,
  };
}

export async function getHostState(): Promise<HostStateResult> {
  try {
    const [cpuUsage, storage, containerSummary, imageSummary] =
      await Promise.all([
        getCpuUsage(),
        getStorageUsage(),
        getContainerSummary(),
        getImageSummary(),
      ]);

    if (containerSummary.data === null) {
      return { data: null, error: containerSummary.error };
    }

    if (imageSummary.data === null) {
      return { data: null, error: imageSummary.error };
    }

    return {
      data: {
        containers: containerSummary.data,
        cpu: {
          cores: os.cpus().length,
          usage: cpuUsage,
        },
        images: imageSummary.data,
        memory: getMemoryUsage(),
        storage,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function* streamHostStates(
  initialState: HostModel["state"],
  signal: AbortSignal
) {
  yield { data: initialState, error: null } satisfies HostStateResult;

  while (!signal.aborted) {
    await sleep(HOST_STREAM_INTERVAL_MS, signal);

    if (signal.aborted) {
      break;
    }

    const state = await getHostState();

    yield state;

    if (state.data === null) {
      break;
    }
  }
}
