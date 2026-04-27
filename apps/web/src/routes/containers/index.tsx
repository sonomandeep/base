import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardHeader } from "#/components/layout/dashboard-header";
import { getContainersFn } from "#/features/containers/functions";
import { NodeState } from "#/features/nodes/components/node-state";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/containers/")({
  component: RouteComponent,
  loader: async () => {
    const containers = await getContainersFn();

    return { containers };
  },
});

function RouteComponent() {
  const loader = Route.useLoaderData();

  return (
    <div className="mx-auto my-12 flex max-w-136 flex-col gap-8">
      <DashboardHeader />
      <NodeState />

      <section className="grid w-full gap-4">
        <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
          <h2 className="font-medium">Containers</h2>
          <Button className="font-normal text-muted-foreground" variant="ghost">
            TODO
          </Button>
        </div>

        <ItemGroup className="gap-1">
          {loader.containers.map((container) => (
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
    </div>
  );
}
