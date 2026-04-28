import { createServerFn } from "@tanstack/react-start";
import { sleep } from "#/lib/utils";
import { getContainers } from "./service.server";

export const getContainersFn = createServerFn().handler(async () => {
  const { data, error } = await getContainers();
  if (error) {
    console.error(error);
  }

  return data;
});

export const streamContainersFn = createServerFn().handler(async function* () {
  while (true) {
    const { data, error } = await getContainers({ withStats: true });
    if (error) {
      console.error(error);
    }

    yield data;

    await sleep(1000);
  }
});
