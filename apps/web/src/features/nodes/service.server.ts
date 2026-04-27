import { statfs } from "node:fs/promises";
import os from "node:os";
import { getContainerStateSummary } from "#/features/containers/service.server";

async function getCpuUsage(): Promise<number> {
  const sample = () =>
    os.cpus().map(({ times }) => ({
      idle: times.idle,
      total: Object.values(times).reduce((a, b) => a + b, 0),
    }));

  const before = sample();
  await new Promise((resolve) => setTimeout(resolve, 500));
  const after = sample();

  const avgUsage =
    before.reduce((sum, b, i) => {
      const idleDiff = after[i].idle - b.idle;
      const totalDiff = after[i].total - b.total;
      return sum + (1 - idleDiff / totalDiff);
    }, 0) / before.length;

  return avgUsage * 100;
}

async function getStorageUsage(path = "/") {
  const { bavail, blocks, bsize } = await statfs(path);

  const total = blocks * bsize;
  const free = bavail * bsize;
  const used = total - free;

  return {
    total,
    free,
    used,
    usage: total ? (used / total) * 100 : 0,
  };
}

function getMemoryUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;

  return {
    total,
    free,
    used,
    usage: total ? (used / total) * 100 : 0,
  };
}

export async function getMetrics() {
  const [cpuUsage, storage, containerStateSummary] = await Promise.all([
    getCpuUsage(),
    getStorageUsage(),
    getContainerStateSummary(),
  ]);
  const memory = getMemoryUsage();
  const cpu = {
    cores: os.cpus().length,
    usage: cpuUsage,
  };

  return {
    data: { memory, cpu, storage, containers: containerStateSummary.data },
    error: null,
  };
}
