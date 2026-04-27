import { createServerFn } from "@tanstack/react-start";
import { sleep } from "#/lib/utils";
import { getMetrics } from "./service.server";

export type HostState = Awaited<ReturnType<typeof getMetrics>>["data"];

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
