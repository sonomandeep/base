import os from "node:os";

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

export async function getMetrics() {
  const memory = { total: os.totalmem(), free: os.freemem() };
  const cpu = {
    cores: os.cpus().length,
    usage: await getCpuUsage(),
  };

  return { data: { memory, cpu }, error: null };
}
