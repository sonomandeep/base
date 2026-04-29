import { Link } from "@tanstack/react-router";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Item, ItemContent, ItemGroup, ItemTitle } from "#/components/ui/item";
import type { ContainerListItem } from "#/features/containers/schema";
import { api } from "#/lib/api/client";
import { cn } from "#/lib/utils";

interface ContainerListContextValue {
  containers: ContainerListItem[];
}

interface ContainerListProps {
  children: ReactNode;
  initialContainers: ContainerListItem[];
  limit?: number;
  stream?: boolean;
}

interface ContainerListHeaderProps {
  children: ReactNode;
}

interface ContainerListTitleProps {
  children: ReactNode;
}

const ContainerListContext = createContext<ContainerListContextValue | null>(
  null
);

function formatContainerMetric(value: number | null) {
  return value === null ? "--" : `${value.toFixed(1)}%`;
}

function useContainerList() {
  const context = useContext(ContainerListContext);

  if (!context) {
    throw new Error(
      "ContainerList components must be used within ContainerList"
    );
  }

  return context;
}

export function ContainerList({
  children,
  initialContainers,
  limit,
  stream = false,
}: ContainerListProps) {
  const [containers, setContainers] = useState(initialContainers);
  const visibleContainers = limit ? containers.slice(0, limit) : containers;

  useEffect(() => {
    if (!stream) {
      return;
    }

    const controller = new AbortController();

    async function readContainers() {
      const { data, error } = await api.containers.stream.get({
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

        if (event.event === "containers" && event.data) {
          setContainers(event.data);
        }

        if (event.event === "containers.error") {
          console.error(event.data);
        }
      }
    }

    readContainers().catch((error) => {
      if (!controller.signal.aborted) {
        console.error(error);
      }
    });

    return () => {
      controller.abort();
    };
  }, [stream]);

  return (
    <ContainerListContext value={{ containers: visibleContainers }}>
      <section className="grid w-full gap-4">{children}</section>
    </ContainerListContext>
  );
}

export function ContainerListHeader({ children }: ContainerListHeaderProps) {
  return (
    <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
      {children}
    </div>
  );
}

export function ContainerListTitle({ children }: ContainerListTitleProps) {
  return <h2 className="font-medium">{children}</h2>;
}

export function ContainerListItems() {
  const { containers } = useContainerList();

  return (
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
                    {formatContainerMetric(container.cpu)}
                  </p>
                </div>

                <div className="inline-flex items-baseline gap-1">
                  <p className="text-muted-foreground text-xs">RAM</p>
                  <p className="text-sm">
                    {formatContainerMetric(container.ram)}
                  </p>
                </div>
              </div>
            </Link>
          }
        />
      ))}
    </ItemGroup>
  );
}
