import { docker } from "#/lib/docker/client.server";

export interface ImageStateSummary {
  size: number;
  total: number;
}

export async function getImageStateSummary() {
  try {
    const usage = await docker.df();
    const summary: ImageStateSummary = {
      size: usage.LayersSize ?? 0,
      total: usage.Images?.length ?? 0,
    };

    return { data: summary, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
