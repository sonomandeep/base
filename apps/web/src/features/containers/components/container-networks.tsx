import { Link } from "@tanstack/react-router";
import { Item, ItemContent, ItemGroup, ItemTitle } from "#/components/ui/item";

interface ContainerNetwork {
  driver: string;
  id: string;
  ipAddress: string;
  name: string;
}

interface ContainerNetworksProps {
  networks: ContainerNetwork[];
}

export function ContainerNetworks({ networks }: ContainerNetworksProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
        <h2 className="font-medium">Networks</h2>
      </div>

      {networks.length > 0 ? (
        <ItemGroup className="gap-1">
          {networks.map((network) => (
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
                    <span className="text-muted-foreground text-xs">IP</span>
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
  );
}
