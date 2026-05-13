import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Cpu,
  EllipsisVertical,
  Eraser,
  type LucideIcon,
  MemoryStick,
  RefreshCw,
  Save,
  Square,
} from "lucide-react";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import { DashboardHeader } from "#/components/layout/dashboard-header";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "#/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { ContainerShell } from "#/features/containers/components/container-shell";
import { getContainerFn } from "#/features/containers/functions";

export const Route = createFileRoute("/containers/$containerId")({
  component: RouteComponent,
  loader: ({ params }) => getContainerFn({ data: { id: params.containerId } }),
});

const tabs = ["Logs", "Shell", "Networks", "Envs", "Volumes", "Ports"];

function formatPercent(value: number | null) {
  return value === null ? "--" : `${value.toFixed(0)}%`;
}

function formatBytes(bytes: number | null, options?: { binary?: boolean }) {
  return bytes === null
    ? "--"
    : prettyBytes(bytes, {
        binary: options?.binary,
        maximumFractionDigits: 0,
      });
}

function formatCpuLimit(limitCores: number | null) {
  return limitCores === null ? "--" : `${limitCores.toFixed(1)} vCPU`;
}

function formatRestarts(restartCount: number) {
  if (restartCount === 0) {
    return "No restarts";
  }

  return restartCount === 1 ? "1 restart" : `${restartCount} restarts`;
}

function formatUptime(seconds: number | null) {
  if (seconds === null) {
    return "--";
  }

  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60);

  if (days > 0) {
    return days === 1 ? "1 day" : `${days} days`;
  }

  if (hours > 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }

  if (minutes > 0) {
    return minutes === 1 ? "1 minute" : `${minutes} minutes`;
  }

  return "Less than a minute";
}

function formatNetworks(count: number) {
  if (count === 0) {
    return "No networks";
  }

  return count === 1 ? "1 attached" : `${count} attached`;
}

function formatVolumes(count: number) {
  if (count === 0) {
    return "No volumes";
  }

  return count === 1 ? "1 volume" : `${count} volumes`;
}

function formatMountName(mount: { destination: string; name: string | null }) {
  if (mount.name) {
    return mount.name;
  }

  return (
    mount.destination.split("/").filter(Boolean).at(-1) || mount.destination
  );
}

function formatMountMode(rw: boolean) {
  return rw ? "RW" : "RO";
}

function formatPortLabel(port: { privatePort: number; type: string }) {
  return `${port.privatePort}/${port.type}`;
}

function formatPortBinding(port: {
  ip: string | null;
  publicPort: number | null;
}) {
  if (port.publicPort === null) {
    return "--";
  }

  return port.ip ? `${port.ip}:${port.publicPort}` : String(port.publicPort);
}

function formatPortBindingLabel(ip: string | null) {
  if (!ip) {
    return "IP";
  }

  return ip.includes(":") ? "IPv6" : "IPv4";
}

function MetricCard({
  icon: Icon,
  label,
  secondary,
  value,
}: {
  icon: LucideIcon;
  label: string;
  secondary: string;
  value: string;
}) {
  return (
    <div className="col-span-2 flex flex-col gap-6 rounded-xl bg-muted p-4">
      <div className="inline-flex w-full items-center justify-between text-neutral-700">
        <h3 className="font-medium text-sm">{label}</h3>
        <Icon className="size-3.5" />
      </div>

      <div className="inline-flex items-baseline gap-3 font-mono">
        <h1 className="font-medium text-lg">{value}</h1>
        <span className="text-muted-foreground text-xs">{secondary}</span>
      </div>
    </div>
  );
}

function RouteComponent() {
  const container = Route.useLoaderData();
  const [shellClearSignal, setShellClearSignal] = useState(0);
  const [shellSessionKey, setShellSessionKey] = useState(0);

  if (!container) {
    return (
      <div className="mx-auto my-12 flex max-w-136 flex-col gap-8">
        <DashboardHeader />
        <section className="px-4">
          <div className="rounded-xl bg-muted p-4">
            <h1 className="font-medium">Container not found</h1>
          </div>
        </section>
      </div>
    );
  }

  const info = [
    { label: "ID", value: container.shortId },
    { label: "Image", value: container.image },
    { label: "Restarts", value: formatRestarts(container.restartCount) },
    { label: "Uptime", value: formatUptime(container.uptimeSeconds) },
    { label: "Networks", value: formatNetworks(container.networks.length) },
    { label: "Volumes", value: formatVolumes(container.mounts.length) },
  ];

  return (
    <div className="mx-auto my-12 flex max-w-136 flex-col gap-8">
      <DashboardHeader />

      <section className="flex flex-col gap-6 px-4">
        <div className="inline-flex items-center justify-between">
          <h1 className="font-medium">{container.name}</h1>

          <div className="inline-flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Square />
            </Button>
            <Button size="icon" variant="ghost">
              <RefreshCw />
            </Button>
            <Button size="icon" variant="ghost">
              <EllipsisVertical />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-6">
          <MetricCard
            icon={Cpu}
            label="CPU"
            secondary={formatCpuLimit(container.cpu.limitCores)}
            value={formatPercent(container.cpu.usage)}
          />
          <MetricCard
            icon={MemoryStick}
            label="RAM"
            secondary={formatBytes(container.memory.limit, { binary: true })}
            value={formatPercent(container.memory.usage)}
          />
          <MetricCard
            icon={Save}
            label="DISK"
            secondary={formatBytes(container.disk.size)}
            value={formatPercent(container.disk.usage)}
          />
        </div>
      </section>

      <section className="grid gap-4 px-4 md:grid-cols-6">
        {info.map((item) => (
          <div className="col-span-2 grid gap-1" key={item.label}>
            <p className="text-muted-foreground text-xs">{item.label}</p>
            <p className="text-sm">{item.value}</p>
          </div>
        ))}
      </section>

      <Tabs className="flex flex-col gap-y-6" defaultValue="Shell">
        <div className="px-4">
          <TabsList className="w-full">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent keepMounted value="Shell">
          <section className="flex flex-col gap-3">
            <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
              <h2 className="font-medium">Shell</h2>

              <div className="inline-flex items-center gap-1">
                <Button
                  aria-label="Reconnect shell"
                  disabled={container.status !== "running"}
                  onClick={() => setShellSessionKey((key) => key + 1)}
                  size="icon-sm"
                  variant="ghost"
                >
                  <RefreshCw />
                </Button>
                <Button
                  aria-label="Clear shell"
                  disabled={container.status !== "running"}
                  onClick={() => setShellClearSignal((signal) => signal + 1)}
                  size="icon-sm"
                  variant="ghost"
                >
                  <Eraser />
                </Button>
              </div>
            </div>

            <div className="px-4">
              <ContainerShell
                clearSignal={shellClearSignal}
                containerId={container.id}
                disabled={container.status !== "running"}
                key={shellSessionKey}
              />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="Networks">
          <section className="flex flex-col gap-3">
            <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
              <h2 className="font-medium">Networks</h2>
            </div>

            {container.networks.length > 0 ? (
              <ItemGroup className="gap-1">
                {container.networks.map((network) => (
                  <Item
                    className="w-full flex-nowrap items-center justify-between rounded-lg border-transparent"
                    key={network.id || network.name}
                    render={
                      <Link to="/">
                        <ItemContent className="flex-none flex-row items-baseline gap-2">
                          <ItemTitle className="font-normal text-sm">
                            {network.name}
                          </ItemTitle>
                          <p className="text-muted-foreground text-xs">
                            {network.driver}
                          </p>
                        </ItemContent>

                        <div className="inline-flex items-baseline gap-2 font-mono text-sm">
                          <span className="text-muted-foreground text-xs">
                            IP
                          </span>
                          {network.ipAddress || "--"}
                        </div>
                      </Link>
                    }
                  />
                ))}
              </ItemGroup>
            ) : (
              <p className="px-2 text-muted-foreground text-sm">
                No networks attached
              </p>
            )}
          </section>
        </TabsContent>

        <TabsContent value="Ports">
          <section className="flex flex-col gap-3">
            <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
              <h2 className="font-medium">Ports</h2>
            </div>

            {container.ports.length > 0 ? (
              <ItemGroup className="gap-1">
                {container.ports.map((port) => (
                  <Item
                    className="w-full flex-nowrap items-center justify-between rounded-lg border-transparent"
                    key={`${port.privatePort}-${port.publicPort ?? "none"}-${port.type}`}
                    render={
                      <div>
                        <ItemContent className="flex-none flex-row items-baseline gap-2">
                          <ItemTitle className="font-normal text-sm">
                            {formatPortLabel(port)}
                          </ItemTitle>
                          <p className="text-muted-foreground text-xs">
                            container
                          </p>
                        </ItemContent>

                        <div className="inline-flex items-baseline gap-2 font-mono text-sm">
                          <span className="text-muted-foreground text-xs">
                            {formatPortBindingLabel(port.ip)}
                          </span>
                          {formatPortBinding(port)}
                        </div>
                      </div>
                    }
                  />
                ))}
              </ItemGroup>
            ) : (
              <p className="px-2 text-muted-foreground text-sm">
                No ports exposed
              </p>
            )}
          </section>
        </TabsContent>

        <TabsContent value="Volumes">
          <section className="flex flex-col gap-3">
            <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
              <h2 className="font-medium">Volumes</h2>
            </div>

            {container.mounts.length > 0 ? (
              <ItemGroup className="gap-1">
                {container.mounts.map((mount) => (
                  <Item
                    className="w-full flex-nowrap items-center justify-between rounded-lg border-transparent"
                    key={`${mount.type}-${mount.name ?? mount.destination}`}
                    render={
                      <div>
                        <ItemContent className="flex-none flex-row items-baseline gap-2">
                          <ItemTitle className="font-normal text-sm">
                            {formatMountName(mount)}
                          </ItemTitle>
                          <p className="text-muted-foreground text-xs">
                            {mount.type}
                          </p>
                        </ItemContent>

                        <div className="inline-flex items-center gap-3">
                          <div className="inline-flex items-baseline gap-2 font-mono text-sm">
                            <span className="text-muted-foreground text-xs">
                              {formatMountMode(mount.rw)}
                            </span>
                            {formatBytes(mount.size, { binary: true })}
                          </div>

                          <ItemActions>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button size="icon" variant="ghost">
                                    <EllipsisVertical />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>
                                    Mount paths
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    Destination: {mount.destination}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Source: {mount.source}
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </ItemActions>
                        </div>
                      </div>
                    }
                  />
                ))}
              </ItemGroup>
            ) : (
              <p className="px-2 text-muted-foreground text-sm">
                No volumes attached
              </p>
            )}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
