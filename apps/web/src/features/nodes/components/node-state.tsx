import { Box, Cpu, Layers, MemoryStick, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { type HostState, streamHostStateFn } from "#/features/nodes/functions";

function formatGigabytes(bytes: number) {
  return `${(bytes / 1024 ** 3).toFixed(0)} GB`;
}

export function NodeStateCards() {
  const [state, setState] = useState<HostState | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function readHostState() {
      for await (const nextState of await streamHostStateFn()) {
        if (cancelled) {
          break;
        }

        setState(nextState);
      }
    }

    readHostState().catch((error) => {
      if (!cancelled) {
        console.error(error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const cpuUsage = state ? `${state.cpu.usage.toFixed(1)}%` : "--";
  const cpuCores = state ? `${state.cpu.cores} vCPU` : "--";
  const memoryUsage = state ? `${state.memory.usage.toFixed(0)}%` : "--";
  const memoryTotal = state ? formatGigabytes(state.memory.total) : "--";
  const storageUsage = state ? `${state.storage.usage.toFixed(0)}%` : "--";
  const storageTotal = state ? formatGigabytes(state.storage.total) : "--";

  return (
    <section className="grid w-full grid-cols-6 grid-rows-[auto_auto] gap-4 px-4">
      <div className="col-span-4 flex flex-col gap-6 rounded-xl bg-muted p-4">
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

          <div className="flex w-full gap-1 font-mono">
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

      <div className="col-span-2 flex flex-col justify-between rounded-xl bg-muted p-4">
        <div className="inline-flex w-full items-center justify-between">
          <h2 className="font-medium">Images</h2>
          <Layers className="size-3.5" />
        </div>

        <div className="inline-flex items-baseline gap-3 font-mono">
          <h1 className="font-medium text-lg">37</h1>
          <span className="text-muted-foreground text-xs">195 GB</span>
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-6 rounded-xl bg-muted p-4">
        <div className="inline-flex w-full items-center justify-between text-neutral-700">
          <h3 className="font-medium text-sm">CPU</h3>
          <Cpu className="size-3.5" />
        </div>

        <div className="inline-flex items-baseline gap-3 font-mono">
          <h1 className="font-medium text-lg">{cpuUsage}</h1>
          <span className="text-muted-foreground text-xs">{cpuCores}</span>
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-6 rounded-xl bg-muted p-4">
        <div className="inline-flex w-full items-center justify-between text-neutral-700">
          <h3 className="font-medium text-sm">RAM</h3>
          <MemoryStick className="size-3.5" />
        </div>

        <div className="inline-flex items-baseline gap-3 font-mono">
          <h1 className="font-medium text-lg">{memoryUsage}</h1>
          <span className="text-muted-foreground text-xs">{memoryTotal}</span>
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-6 rounded-xl bg-muted p-4">
        <div className="inline-flex w-full items-center justify-between text-neutral-700">
          <h3 className="font-medium text-sm">DISK</h3>
          <Save className="size-3.5" />
        </div>

        <div className="inline-flex items-baseline gap-3 font-mono">
          <h1 className="font-medium text-lg">{storageUsage}</h1>
          <span className="text-muted-foreground text-xs">{storageTotal}</span>
        </div>
      </div>
    </section>
  );
}
