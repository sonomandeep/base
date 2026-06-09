import {
  ContainerIcon,
  CpuIcon,
  Layers01Icon,
  MemoryStickIcon,
  SaveIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import prettyBytes from "pretty-bytes";
import { useEffect, useState } from "react";
import { api } from "#/lib/api/client";

type HostStateValue = NonNullable<
  Awaited<ReturnType<typeof api.hosts.current.state.get>>["data"]
>;

function formatBytes(bytes: number) {
  return prettyBytes(bytes, { maximumFractionDigits: 0 });
}

function formatOptionalBytes(bytes?: number) {
  return bytes === undefined ? "--" : formatBytes(bytes);
}

function formatOptionalNumber(value?: number) {
  return value === undefined ? "--" : String(value);
}

export function HostState() {
  const [state, setState] = useState<HostStateValue | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function readHostState() {
      const { data, error } = await api.hosts.current.stream.get({
        fetch: { signal: controller.signal },
      });

      if (error) {
        console.error(error.value);
        return;
      }

      for await (const event of data) {
        if (controller.signal.aborted) {
          return;
        }

        if (event.event === "hosts.state" && event.data) {
          setState(event.data);
        }

        if (event.event === "hosts.error") {
          console.error(event.data);
        }
      }
    }

    readHostState().catch((error) => {
      if (!controller.signal.aborted) {
        console.error(error);
      }
    });

    return () => {
      controller.abort();
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
          <h2 className="font-medium text-foreground/70">Containers</h2>
          <HugeiconsIcon
            className="size-3.5"
            icon={ContainerIcon}
            strokeWidth={2}
          />
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
          <h2 className="font-medium text-foreground/70">Images</h2>
          <HugeiconsIcon
            className="size-3.5"
            icon={Layers01Icon}
            strokeWidth={2}
          />
        </div>

        <div className="inline-flex items-baseline gap-3 font-mono">
          <h1 className="font-medium text-lg">{imageCount}</h1>
          <span className="text-muted-foreground text-xs">{imageSize}</span>
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-6 rounded-xl bg-muted p-4">
        <div className="inline-flex w-full items-center justify-between text-foreground/70">
          <h3 className="font-medium text-sm tracking-wide">CPU</h3>
          <HugeiconsIcon className="size-3.5" icon={CpuIcon} strokeWidth={2} />
        </div>

        <div className="inline-flex items-baseline gap-3 font-mono">
          <h1 className="font-medium text-lg">{cpuUsage}</h1>
          <span className="text-muted-foreground text-xs">{cpuCores}</span>
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-6 rounded-xl bg-muted p-4">
        <div className="inline-flex w-full items-center justify-between text-foreground/70">
          <h3 className="font-medium text-sm tracking-wide">RAM</h3>
          <HugeiconsIcon
            className="size-3.5"
            icon={MemoryStickIcon}
            strokeWidth={2}
          />
        </div>

        <div className="inline-flex items-baseline gap-3 font-mono">
          <h1 className="font-medium text-lg">{memoryUsage}</h1>
          <span className="text-muted-foreground text-xs">{memoryTotal}</span>
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-6 rounded-xl bg-muted p-4">
        <div className="inline-flex w-full items-center justify-between text-foreground/70">
          <h3 className="font-medium text-sm tracking-wide">DISK</h3>

          <HugeiconsIcon className="size-3.5" icon={SaveIcon} strokeWidth={2} />
        </div>

        <div className="inline-flex items-baseline gap-3 font-mono">
          <h1 className="font-medium text-lg">{storageUsage}</h1>
          <span className="text-muted-foreground text-xs">{storageTotal}</span>
        </div>
      </div>
    </section>
  );
}
