import { Eraser, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { ContainerShell } from "./container-shell";

interface ContainerShellTabProps {
  containerId: string;
  disabled: boolean;
}

export function ContainerShellTab({
  containerId,
  disabled,
}: ContainerShellTabProps) {
  const [shellClearSignal, setShellClearSignal] = useState(0);
  const [shellSessionKey, setShellSessionKey] = useState(0);

  return (
    <section className="flex flex-col gap-3">
      <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
        <h2 className="font-medium">Shell</h2>

        <div className="inline-flex items-center gap-1">
          <Button
            aria-label="Reconnect shell"
            disabled={disabled}
            onClick={() => setShellSessionKey((key) => key + 1)}
            size="icon-sm"
            variant="ghost"
          >
            <RefreshCw />
          </Button>
          <Button
            aria-label="Clear shell"
            disabled={disabled}
            onClick={() => setShellClearSignal((signal) => signal + 1)}
            size="icon-sm"
            variant="ghost"
          >
            <Eraser />
          </Button>
        </div>
      </div>

      <div className="px-4">
        <ContainerShell
          clearSignal={shellClearSignal}
          containerId={containerId}
          disabled={disabled}
          key={shellSessionKey}
        />
      </div>
    </section>
  );
}
