import type { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";

type ShellMessage =
  | { data: string; type: "output" }
  | { message: string; type: "error" }
  | { type: "ready" }
  | { type: "closed" };

interface ContainerShellProps {
  clearSignal: number;
  containerId: string;
  disabled: boolean;
}

const apiUrl = import.meta.env.VITE_API_URL;
const TRAILING_SLASH = /\/$/;

function getContainerShellUrl(containerId: string) {
  if (!apiUrl) {
    throw new Error("VITE_API_URL is required");
  }

  const url = new URL(apiUrl);

  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `${url.pathname.replace(TRAILING_SLASH, "")}/containers/${encodeURIComponent(containerId)}/shell`;

  return url.toString();
}

function sendResize(socket: WebSocket, terminal: Terminal) {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }

  socket.send(
    JSON.stringify({
      cols: terminal.cols,
      rows: terminal.rows,
      type: "resize",
    })
  );
}

export function ContainerShell({
  clearSignal,
  containerId,
  disabled,
}: ContainerShellProps) {
  const terminalElementRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const previousClearSignalRef = useRef(clearSignal);

  useEffect(() => {
    if (previousClearSignalRef.current === clearSignal) {
      return;
    }

    previousClearSignalRef.current = clearSignal;
    terminalRef.current?.clear();
  });

  useEffect(() => {
    if (disabled || !terminalElementRef.current) {
      return;
    }

    let disposed = false;
    const terminalElement = terminalElementRef.current;

    async function connectShell() {
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit"),
      ]);

      if (disposed) {
        return;
      }

      const terminal = new Terminal({
        cursorBlink: true,
        fontFamily: '"Geist Mono Variable", monospace',
        fontSize: 12,
        theme: {
          background: "#0a0a0a",
          foreground: "#f5f5f5",
        },
      });
      const fitAddon = new FitAddon();
      const socket = new WebSocket(getContainerShellUrl(containerId));
      let ready = false;

      terminalRef.current = terminal;
      terminal.loadAddon(fitAddon);
      terminal.open(terminalElement);
      fitAddon.fit();

      const dataDisposable = terminal.onData((data) => {
        if (ready && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ data, type: "input" }));
        }
      });

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
        if (ready) {
          sendResize(socket, terminal);
        }
      });

      resizeObserver.observe(terminalElement);

      socket.addEventListener("open", () => {
        terminal.writeln("Connecting...");
      });

      socket.addEventListener("message", (event) => {
        let message: ShellMessage;

        try {
          message = JSON.parse(event.data) as ShellMessage;
        } catch {
          terminal.writeln("\r\nReceived an invalid shell message.");
          return;
        }

        if (message.type === "ready") {
          ready = true;
          terminal.clear();
          terminal.focus();
          fitAddon.fit();
          sendResize(socket, terminal);
          return;
        }

        if (message.type === "output") {
          terminal.write(message.data);
          return;
        }

        if (message.type === "error") {
          terminal.writeln(`\r\n${message.message}`);
          return;
        }

        terminal.writeln("\r\nShell closed.");
      });

      socket.addEventListener("close", () => {
        if (!disposed) {
          terminal.writeln("\r\nDisconnected.");
        }
      });

      return () => {
        disposed = true;
        resizeObserver.disconnect();
        dataDisposable.dispose();
        socket.close();
        terminalRef.current = null;
        terminal.dispose();
      };
    }

    let cleanup: (() => void) | undefined;

    connectShell()
      .then((connectCleanup) => {
        cleanup = connectCleanup;
      })
      .catch((error) => {
        if (!disposed) {
          console.error(error);
        }
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [containerId, disabled]);

  if (disabled) {
    return (
      <div className="rounded-xl bg-muted p-4">
        <h2 className="font-medium">Shell unavailable</h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Start the container to open an interactive shell.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-neutral-950 p-3">
      <div className="h-96 min-h-80 w-full" ref={terminalElementRef} />
    </div>
  );
}
