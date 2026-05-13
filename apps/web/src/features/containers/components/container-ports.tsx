import { Item, ItemContent, ItemGroup, ItemTitle } from "#/components/ui/item";

interface ContainerPort {
  ip: string | null;
  privatePort: number;
  publicPort: number | null;
  type: string;
}

interface ContainerPortsProps {
  ports: ContainerPort[];
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

export function ContainerPorts({ ports }: ContainerPortsProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
        <h2 className="font-medium">Ports</h2>
      </div>

      {ports.length > 0 ? (
        <ItemGroup className="gap-1">
          {ports.map((port) => (
            <Item
              className="w-full flex-nowrap items-center justify-between rounded-lg border-transparent"
              key={`${port.privatePort}-${port.publicPort ?? "none"}-${port.type}`}
              render={
                <div>
                  <ItemContent className="flex-none flex-row items-baseline gap-2">
                    <ItemTitle className="font-normal text-sm">
                      {formatPortLabel(port)}
                    </ItemTitle>
                    <p className="text-muted-foreground text-xs">container</p>
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
        <p className="px-2 text-muted-foreground text-sm">No ports exposed</p>
      )}
    </section>
  );
}
