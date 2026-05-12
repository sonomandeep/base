import { client } from "../../lib/client";
import type { VolumeModel } from "./model";

interface DockerVolumeUsage {
  UsageData?: {
    Size?: number;
  } | null;
}

export async function getVolumeSummary(): Promise<
  { data: VolumeModel["summary"]; error: null } | { data: null; error: unknown }
> {
  try {
    const usage = await client.df();
    const volumes: DockerVolumeUsage[] = usage.Volumes ?? [];

    return {
      data: {
        size: volumes.reduce(
          (total, volume) => total + (volume.UsageData?.Size ?? 0),
          0
        ),
        total: volumes.length,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}
