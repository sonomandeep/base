import type { ContainerModel } from "./model";

export async function getContainers(): Promise<
  ContainerModel["containersResponse"]
> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { id: "str" };
}
