import { createFileRoute } from "@tanstack/react-router";
import { Box, Cpu, Layers, MemoryStick, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="mx-auto mt-12 flex max-w-136 flex-col gap-8">
      <header className="inline-flex w-full items-center justify-between px-4">
        <Select
          defaultValue="all_nodes"
          items={[
            { label: "Select", value: null },
            { label: "All nodes", value: "all_nodes" },
          ]}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all_nodes">All Nodes</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="inline-flex items-center gap-3">
          <p className="text-sm">Mando</p>

          <Avatar size="sm">
            <AvatarImage src="https://github.com/sonomandeep.png" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <section className="grid w-full grid-cols-6 grid-rows-[auto_auto] gap-4 px-4">
        <div className="col-span-4 flex flex-col gap-6 rounded-xl bg-neutral-50 p-4">
          <div className="inline-flex w-full items-center justify-between">
            <h2 className="font-medium">Containers</h2>
            <Box className="size-3.5" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="col-span-3 inline-flex items-center justify-between">
              <h4 className="font-medium text-sm">State</h4>

              <div className="inline-flex gap-3">
                <div className="inline-flex items-center gap-1">
                  <div className="size-2 rounded-xs bg-green-500" />
                  <span className="text-xs">Healthy</span>
                </div>

                <div className="inline-flex items-center gap-1">
                  <div className="size-2 rounded-xs bg-amber-500" />
                  <span className="text-xs">Degraded</span>
                </div>

                <div className="inline-flex items-center gap-1">
                  <div className="size-2 rounded-xs bg-red-500" />
                  <span className="text-xs">Stopped</span>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-1">
              <div className="flex flex-col gap-1" style={{ flex: 12 }}>
                <div className="h-2 w-full rounded-sm bg-green-500" />
                <span className="text-xs">12</span>
              </div>

              <div className="flex flex-col gap-1" style={{ flex: 3 }}>
                <div className="h-2 w-full rounded-sm bg-amber-500" />
                <span className="text-xs">3</span>
              </div>

              <div className="flex flex-col gap-1" style={{ flex: 5 }}>
                <div className="h-2 w-full rounded-sm bg-red-500" />
                <span className="text-xs">5</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex flex-col justify-between rounded-xl bg-neutral-50 p-4">
          <div className="inline-flex w-full items-center justify-between">
            <h2 className="font-medium">Images</h2>
            <Layers className="size-3.5" />
          </div>

          <div className="inline-flex items-baseline gap-3">
            <h1 className="font-medium text-lg">37</h1>
            <span className="text-muted-foreground text-xs">195 GB</span>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-6 rounded-xl bg-neutral-50 p-4">
          <div className="inline-flex w-full items-center justify-between text-neutral-700">
            <h3 className="font-medium text-sm">CPU</h3>
            <Cpu className="size-3.5" />
          </div>

          <div className="inline-flex items-baseline gap-3">
            <h1 className="font-medium text-lg">24%</h1>
            <span className="text-muted-foreground text-xs">12 vCPU</span>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-6 rounded-xl bg-neutral-50 p-4">
          <div className="inline-flex w-full items-center justify-between text-neutral-700">
            <h3 className="font-medium text-sm">RAM</h3>
            <MemoryStick className="size-3.5" />
          </div>

          <div className="inline-flex items-baseline gap-3">
            <h1 className="font-medium text-lg">73%</h1>
            <span className="text-muted-foreground text-xs">64 GB</span>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-6 rounded-xl bg-neutral-50 p-4">
          <div className="inline-flex w-full items-center justify-between text-neutral-700">
            <h3 className="font-medium text-sm">DISK</h3>
            <Save className="size-3.5" />
          </div>

          <div className="inline-flex items-baseline gap-3">
            <h1 className="font-medium text-lg">38%</h1>
            <span className="text-muted-foreground text-xs">512 GB</span>
          </div>
        </div>
      </section>
    </div>
  );
}
