import { docker } from "#/lib/docker/client.server";
import { type NetworkStateSummary, networkStateSummarySchema } from "./schema";

export async function getNetworkStateSummary() {
  try {
    const networks = await docker.listNetworks();
    const summary: NetworkStateSummary = {
      connected: networks.filter(
        (network) => Object.keys(network.Containers ?? {}).length > 0
      ).length,
      total: networks.length,
    };

    return { data: networkStateSummarySchema.parse(summary), error: null };
  } catch (error) {
    return { data: null, error };
  }
}
