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
import { DashboardHeader } from "#/components/layout/dashboard-header";
import { Button } from "#/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";

export const Route = createFileRoute("/containers/$containerId")({
  component: RouteComponent,
});

const container = {
  cpu: {
    cores: "12 vCPU",
    usage: "24%",
  },
  disk: {
    total: "512 GB",
    usage: "38%",
  },
  id: "a3f1c9e4b7d2",
  image: "nginx:latest",
  memory: {
    total: "64 GB",
    usage: "73%",
  },
  name: "API Gateway",
  networks: "2 attached",
  restarts: "No restarts",
  uptime: "14 days",
  volumes: "No volumes",
};

const info = [
  { label: "ID", value: container.id },
  { label: "Image", value: container.image },
  { label: "Restarts", value: container.restarts },
  { label: "Uptime", value: container.uptime },
  { label: "Networks", value: container.networks },
  { label: "Volumes", value: container.volumes },
];

const tabs = ["Logs", "Shell", "Networks", "Envs", "Volumes", "Ports"];

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
            secondary={container.cpu.cores}
            value={container.cpu.usage}
          />
          <MetricCard
            icon={MemoryStick}
            label="RAM"
            secondary={container.memory.total}
            value={container.memory.usage}
          />
          <MetricCard
            icon={Save}
            label="DISK"
            secondary={container.disk.total}
            value={container.disk.usage}
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

      <Tabs className="px-3.5" defaultValue="Logs">
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/*   <TabsContent className="px-2" value="Shell"> */}
        {/*     <div className="flex flex-col gap-5"> */}
        {/*       <div className="inline-flex items-center justify-between px-2"> */}
        {/*         <h2 className="font-medium text-xl">Shell</h2> */}
        {/**/}
        {/*         <div className="inline-flex items-center gap-2"> */}
        {/*           <Button size="icon" variant="ghost"> */}
        {/*             <RefreshCw className="size-4" /> */}
        {/*           </Button> */}
        {/*           <Button size="icon" variant="ghost"> */}
        {/*             <EllipsisVertical className="size-4" /> */}
        {/*           </Button> */}
        {/*         </div> */}
        {/*       </div> */}
        {/**/}
        {/*       <div className="min-h-120 rounded-xl bg-muted" /> */}
        {/*     </div> */}
        {/*   </TabsContent> */}
      </Tabs>
    </div>
  );
}
