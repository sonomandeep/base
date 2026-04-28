import { docker } from "#/lib/docker/client.server";
import { type VolumeStateSummary, volumeStateSummarySchema } from "./schema";

interface DockerVolumeUsage {
  UsageData?: {
    Size?: number;
  } | null;
}

export async function getVolumeStateSummary() {
  try {
    const usage = await docker.df();
    const volumes: DockerVolumeUsage[] = usage.Volumes ?? [];
    const summary: VolumeStateSummary = {
      size: volumes.reduce(
        (total, volume) => total + (volume.UsageData?.Size ?? 0),
        0
      ),
      total: volumes.length,
    };

    return { data: volumeStateSummarySchema.parse(summary), error: null };
  } catch (error) {
    return { data: null, error };
  }
}
