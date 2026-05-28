import { createFileRoute } from "@tanstack/react-router";
import {
  Cpu,
  EllipsisVertical,
  type LucideIcon,
  MemoryStick,
  RefreshCw,
  Save,
  Square,
} from "lucide-react";
import prettyBytes from "pretty-bytes";
import { DashboardHeader } from "#/components/layout/dashboard-header";
import { Button } from "#/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { ContainerEnvs } from "#/features/containers/components/container-envs";
import { ContainerNetworks } from "#/features/containers/components/container-networks";
import { ContainerPorts } from "#/features/containers/components/container-ports";
import { ContainerShellTab } from "#/features/containers/components/container-shell-tab";
import { ContainerVolumes } from "#/features/containers/components/container-volumes";
import { getContainerFn } from "#/features/containers/functions";

export const Route = createFileRoute("/_dashboard/containers/$containerId")({
  component: RouteComponent,
  loader: ({ params }) => getContainerFn({ data: { id: params.containerId } }),
});

const tabs = ["Shell", "Networks", "Envs", "Volumes", "Ports"];

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
            <Button size="icon-sm" variant="ghost">
              <Square />
            </Button>
            <Button size="icon-sm" variant="ghost">
              <RefreshCw />
            </Button>
            <Button size="icon-sm" variant="ghost">
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
          <div className="col-span-2 grid gap-1 px-4" key={item.label}>
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
          <ContainerShellTab
            containerId={container.id}
            disabled={container.status !== "running"}
          />
        </TabsContent>

        <TabsContent value="Networks">
          <ContainerNetworks networks={container.networks} />
        </TabsContent>

        <TabsContent value="Ports">
          <ContainerPorts ports={container.ports} />
        </TabsContent>

        <TabsContent value="Envs">
          <ContainerEnvs envs={container.envs} />
        </TabsContent>

        <TabsContent value="Volumes">
          <ContainerVolumes mounts={container.mounts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
