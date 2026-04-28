import { Box, Cpu, Layers, MemoryStick, Save } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { useEffect, useState } from "react";
import { type HostState, streamHostStateFn } from "#/features/nodes/functions";

function formatBytes(bytes: number) {
  return prettyBytes(bytes, { maximumFractionDigits: 0 });
}

function formatOptionalBytes(bytes?: number) {
  return bytes === undefined ? "--" : formatBytes(bytes);
}

function formatOptionalNumber(value?: number) {
  return value === undefined ? "--" : String(value);
}

export function NodeState() {
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
  const memoryTotal = state ? formatBytes(state.memory.total) : "--";
  const storageUsage = state ? `${state.storage.usage.toFixed(0)}%` : "--";
  const storageTotal = state ? formatBytes(state.storage.total) : "--";
  const imageSummary = state?.images;
  const imageCount = formatOptionalNumber(imageSummary?.total);
  const imageSize = formatOptionalBytes(imageSummary?.size);
  const containerSummary = state?.containers;
  const healthyCount = containerSummary?.healthy ?? 0;
  const degradedCount = containerSummary?.degraded ?? 0;
  const stoppedCount = containerSummary?.stopped ?? 0;
  const showAllContainerStates =
    !containerSummary || containerSummary.total === 0;
  const healthyContainers = formatOptionalNumber(containerSummary?.healthy);
  const degradedContainers = formatOptionalNumber(containerSummary?.degraded);
  const stoppedContainers = formatOptionalNumber(containerSummary?.stopped);
  const getContainerStateFlex = (count: number) => count || 1;

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
            {(showAllContainerStates || healthyCount > 0) && (
              <div
                className="flex flex-col gap-1"
                style={{ flex: getContainerStateFlex(healthyCount) }}
              >
                <div className="h-2 w-full rounded-sm bg-green-500" />
                <span className="text-xs">{healthyContainers}</span>
              </div>
            )}

            {(showAllContainerStates || degradedCount > 0) && (
              <div
                className="flex flex-col gap-1"
                style={{ flex: getContainerStateFlex(degradedCount) }}
              >
                <div className="h-2 w-full rounded-sm bg-amber-500" />
                <span className="text-xs">{degradedContainers}</span>
              </div>
            )}

            {(showAllContainerStates || stoppedCount > 0) && (
              <div
                className="flex flex-col gap-1"
                style={{ flex: getContainerStateFlex(stoppedCount) }}
              >
                <div className="h-2 w-full rounded-sm bg-red-500" />
                <span className="text-xs">{stoppedContainers}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-2 flex flex-col justify-between rounded-xl bg-muted p-4">
        <div className="inline-flex w-full items-center justify-between">
          <h2 className="font-medium">Images</h2>
          <Layers className="size-3.5" />
        </div>

        <div className="inline-flex items-baseline gap-3 font-mono">
          <h1 className="font-medium text-lg">{imageCount}</h1>
          <span className="text-muted-foreground text-xs">{imageSize}</span>
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
