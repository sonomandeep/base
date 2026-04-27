import { createServerFn } from "@tanstack/react-start";
import { getMetrics } from "./service.server";

export type HostState = Awaited<ReturnType<typeof getMetrics>>["data"];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const streamHostStateFn = createServerFn().handler(async function* () {
  while (true) {
    const { data, error } = await getMetrics();

    if (error) {
      console.error(error);
      return;
    }

    yield data;

    await sleep(1000);
  }
});
