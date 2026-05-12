import { client } from "../../lib/client";
import type { NetworkModel } from "./model";

export async function getNetworkSummary(): Promise<
  | { data: NetworkModel["summary"]; error: null }
  | { data: null; error: unknown }
> {
  try {
    const networks = await client.listNetworks();

    return {
      data: {
        connected: networks.filter(
          (network) => Object.keys(network.Containers ?? {}).length > 0
        ).length,
        total: networks.length,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}
