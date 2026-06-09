import { EllipsisVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import prettyBytes from "pretty-bytes";
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

interface ContainerMount {
  destination: string;
  name: string | null;
  rw: boolean;
  size: number | null;
  source: string;
  type: string;
}

interface ContainerVolumesProps {
  mounts: ContainerMount[];
}

function formatBytes(bytes: number | null, options?: { binary?: boolean }) {
  return bytes === null
    ? "--"
    : prettyBytes(bytes, {
        binary: options?.binary,
        maximumFractionDigits: 0,
      });
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

export function ContainerVolumes({ mounts }: ContainerVolumesProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
        <h2 className="font-medium text-sm">Volumes</h2>
      </div>

      {mounts.length > 0 ? (
        <ItemGroup className="gap-1">
          {mounts.map((mount) => (
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
                              <HugeiconsIcon
                                className="size-3.5"
                                icon={EllipsisVerticalIcon}
                                strokeWidth={2}
                              />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Mount paths</DropdownMenuLabel>
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
  );
}
