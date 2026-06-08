import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, HardDrive, Network } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { Button } from "#/components/ui/button";
import { Item, ItemContent, ItemGroup, ItemTitle } from "#/components/ui/item";
import {
  ContainerList,
  ContainerListHeader,
  ContainerListItems,
  ContainerListTitle,
} from "#/features/containers/components/container-list";
import { getContainersFn } from "#/features/containers/functions";
import { HostState } from "#/features/hosts/components/host-state";
import { getImagesFn } from "#/features/images/functions";
import { getNetworkStateSummaryFn } from "#/features/networks/functions";
import { getVolumeStateSummaryFn } from "#/features/volumes/functions";
import { isUnauthorizedError } from "#/lib/api/errors";

export const Route = createFileRoute("/_dashboard/")({
  head: () => ({
    meta: [{ title: "Base | Dashboard" }],
  }),
  component: Home,
  loader: async ({ location }) => {
    try {
      const [containers, images, networks, volumes] = await Promise.all([
        getContainersFn(),
        getImagesFn(),
        getNetworkStateSummaryFn(),
        getVolumeStateSummaryFn(),
      ]);

      return { containers, images, networks, volumes };
    } catch (error) {
      if (isUnauthorizedError(error)) {
        throw redirect({
          search: { redirect: location.href },
          to: "/auth/sign-in",
        });
      }

      throw error;
    }
  },
});

function formatBytes(bytes: number) {
  return prettyBytes(bytes, { maximumFractionDigits: 0 });
}

function Home() {
  const loader = Route.useLoaderData();
  const images = loader.images.slice(0, 5);

  return (
    <>
      <HostState />

      <ContainerList initialContainers={loader.containers} limit={5} stream>
        <ContainerListHeader>
          <ContainerListTitle>Containers</ContainerListTitle>
          <Button
            className="font-normal text-muted-foreground"
            nativeButton={false}
            render={
              <Link to="/containers">
                View all <ArrowRight className="size-3" />
              </Link>
            }
            variant="ghost"
          />
        </ContainerListHeader>

        <ContainerListItems />
      </ContainerList>

      <section className="grid w-full grid-cols-6 gap-4 px-4">
        <div className="col-span-3 flex flex-col gap-6 rounded-xl bg-muted p-4">
          <div className="inline-flex w-full items-center justify-between text-neutral-700">
            <h3 className="font-medium text-sm">Networks</h3>
            <Network className="size-3.5" />
          </div>

          <div className="inline-flex items-baseline gap-3 font-mono">
            <h1 className="font-medium text-lg">
              {loader.networks ? loader.networks.total : "--"}
            </h1>
            <span className="text-muted-foreground text-xs">
              {loader.networks
                ? `${loader.networks.connected} connected`
                : "--"}
            </span>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-6 rounded-xl bg-muted p-4">
          <div className="inline-flex w-full items-center justify-between text-neutral-700">
            <h3 className="font-medium text-sm">Volumes</h3>
            <HardDrive className="size-3.5" />
          </div>

          <div className="inline-flex items-baseline gap-3 font-mono">
            <h1 className="font-medium text-lg">
              {loader.volumes ? loader.volumes.total : "--"}
            </h1>
            <span className="text-muted-foreground text-xs">
              {loader.volumes ? formatBytes(loader.volumes.size) : "--"}
            </span>
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-3">
        <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
          <h2 className="font-medium">Images</h2>
          <Button
            className="font-normal text-muted-foreground"
            nativeButton={false}
            render={
              <Link to="/images">
                View all <ArrowRight className="size-3" />
              </Link>
            }
            variant="ghost"
          />
        </div>

        <ItemGroup className="gap-1">
          {images.map((image) => (
            <Item
              className="w-full flex-nowrap items-center justify-between rounded-lg border-transparent"
              key={image.id}
              render={
                <Link params={{ imageId: image.id }} to="/images/$imageId">
                  <ItemContent className="flex-none flex-row items-baseline gap-2">
                    <ItemTitle className="font-normal text-sm">
                      {image.name}
                    </ItemTitle>
                    <p className="text-muted-foreground text-xs">{image.tag}</p>
                  </ItemContent>

                  <div className="font-mono text-sm">
                    {formatBytes(image.size)}
                  </div>
                </Link>
              }
            />
          ))}
        </ItemGroup>
      </section>
    </>
  );
}
