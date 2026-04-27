import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HardDrive, Network } from "lucide-react";
import { DashboardHeader } from "#/components/layout/dashboard-header";
import { Button } from "#/components/ui/button";
import { Item, ItemContent, ItemGroup, ItemTitle } from "#/components/ui/item";
import { getContainersFn } from "#/features/containers/functions";
import { NodeState } from "#/features/nodes/components/node-state";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Base | Dashboard" }],
  }),
  component: Home,
  loader: () => getContainersFn(),
});

const containers = [
  {
    id: 1,
    name: "API Gateway",
    image: "nginx:latest",
    cpu: 24,
    ram: 47,
    state: "HEALTHY",
  },
  {
    id: 2,
    name: "User Authentication",
    image: "auth-service:v2",
    cpu: 18,
    ram: 35,
    state: "DEGRADED",
  },
  {
    id: 3,
    name: "Notification Service",
    image: "notification-service:4.0.1",
    cpu: 51,
    ram: 79,
    state: "HEALTHY",
  },
  {
    id: 4,
    name: "Cache",
    image: "redis:6-alpine",
    cpu: 8,
    ram: 15,
    state: "STOPPED",
  },
  {
    id: 5,
    name: "Database",
    image: "postgres:latest",
    cpu: 12,
    ram: 29,
    state: "HEALTHY",
  },
];

const images = [
  {
    id: 1,
    name: "Nginx",
    tag: "latest",
    registry: "DOCKER HUB",
    disk: 37,
  },
  {
    id: 2,
    name: "Postgres",
    tag: "latest",
    registry: "DOCKER HUB",
    disk: 379,
  },
  {
    id: 3,
    name: "Redis",
    tag: "6-alpine",
    registry: "DOCKER HUB",
    disk: 32,
  },
  {
    id: 4,
    name: "Auth Service",
    tag: "v2",
    registry: "GHCR",
    disk: 128,
  },
  {
    id: 5,
    name: "Notification Service",
    tag: "4.0.1",
    registry: "AWS ECR",
    disk: 214,
  },
];

function Home() {
  return (
    <div className="mx-auto my-12 flex max-w-136 flex-col gap-8">
      <DashboardHeader />
      <NodeState />

      <section className="grid w-full gap-4">
        <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
          <h2 className="font-medium">Containers</h2>
          <Button
            className="font-normal text-muted-foreground"
            render={
              <Link to="/containers">
                View all <ArrowRight className="size-3" />
              </Link>
            }
            variant="ghost"
          />
        </div>

        <ItemGroup className="gap-1">
          {containers.map((container) => (
            <Item
              className="w-full flex-nowrap items-center justify-between rounded-lg border-transparent"
              key={container.id}
              render={
                <Link
                  params={{ containerId: String(container.id) }}
                  to="/containers/$containerId"
                >
                  <div className="inline-flex items-center gap-2">
                    <div
                      className={cn(
                        "h-3 w-0.5 rounded-sm",
                        container.state === "HEALTHY" && "bg-green-500",
                        container.state === "DEGRADED" && "bg-amber-500",
                        container.state === "STOPPED" && "bg-red-500"
                      )}
                    />

                    <ItemContent className="flex-none flex-row items-baseline gap-2">
                      <ItemTitle className="font-normal text-sm">
                        {container.name}
                      </ItemTitle>
                      <p className="text-muted-foreground text-xs">
                        {container.image}
                      </p>
                    </ItemContent>
                  </div>

                  <div className="inline-flex gap-4 font-mono">
                    <div className="inline-flex items-baseline gap-1">
                      <p className="text-muted-foreground text-xs">CPU</p>
                      <p className="text-sm">
                        {String(container.cpu).padStart(2, "0")}%
                      </p>
                    </div>

                    <div className="inline-flex items-baseline gap-1">
                      <p className="text-muted-foreground text-xs">RAM</p>
                      <p className="text-sm">
                        {String(container.ram).padStart(2, "0")}%
                      </p>
                    </div>
                  </div>
                </Link>
              }
            />
          ))}
        </ItemGroup>
      </section>

      <section className="grid w-full grid-cols-6 gap-4 px-4">
        <div className="col-span-3 flex flex-col gap-6 rounded-xl bg-muted p-4">
          <div className="inline-flex w-full items-center justify-between text-neutral-700">
            <h3 className="font-medium text-sm">Networks</h3>
            <Network className="size-3.5" />
          </div>

          <div className="inline-flex items-baseline gap-3 font-mono">
            <h1 className="font-medium text-lg">6</h1>
            <span className="text-muted-foreground text-xs">4 connected</span>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-6 rounded-xl bg-muted p-4">
          <div className="inline-flex w-full items-center justify-between text-neutral-700">
            <h3 className="font-medium text-sm">Volumes</h3>
            <HardDrive className="size-3.5" />
          </div>

          <div className="inline-flex items-baseline gap-3 font-mono">
            <h1 className="font-medium text-lg">9</h1>
            <span className="text-muted-foreground text-xs">16.2 GB</span>
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-3">
        <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
          <h2 className="font-medium">Images</h2>
          <Button className="font-normal text-muted-foreground" variant="ghost">
            View all <ArrowRight className="size-3" />
          </Button>
        </div>

        <ItemGroup className="gap-1">
          {images.map((image) => (
            <Item
              className="w-full flex-nowrap items-center justify-between rounded-lg border-transparent"
              key={image.id}
              render={
                <Link
                  params={{ imageId: String(image.id) }}
                  to="/images/$imageId"
                >
                  <ItemContent className="flex-none flex-row items-baseline gap-2">
                    <ItemTitle className="font-normal text-sm">
                      {image.name}
                    </ItemTitle>
                    <p className="text-muted-foreground text-xs">{image.tag}</p>
                  </ItemContent>

                  <div className="inline-flex gap-4 font-mono">
                    <div className="inline-flex items-baseline gap-1">
                      <p className="text-muted-foreground text-xs">REG</p>
                      <p className="text-sm">{image.registry}</p>
                    </div>

                    <div className="inline-flex items-baseline gap-1">
                      <p className="text-muted-foreground text-xs">DISK</p>
                      <p className="text-sm">{image.disk} MB</p>
                    </div>
                  </div>
                </Link>
              }
            />
          ))}
        </ItemGroup>
      </section>
    </div>
  );
}
