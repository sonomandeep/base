import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Box, Home, Layers, ScrollText, Settings } from "lucide-react";

import { cn } from "#/lib/utils";

const items = [
  { icon: Home, label: "Home", match: "/", to: "/" },
  { icon: Box, label: "Containers", match: "/containers", to: "/containers" },
  { icon: Layers, label: "Images", match: "/images", to: "/images" },
  { icon: ScrollText, label: "Logs", match: "/logs", to: "/logs" },
  { icon: Settings, label: "Settings", match: "/settings", to: "/settings" },
] satisfies Array<{
  icon: LucideIcon;
  label: string;
  match: string;
  to: string;
}>;

function isActive(pathname: string, match: string) {
  if (match === "/") {
    return pathname === "/";
  }

  return pathname === match || pathname.startsWith(`${match}/`);
}

export function BottomNavigation() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black p-2 shadow-2xl shadow-black/20"
    >
      <ul className="flex items-center gap-3">
        {items.map((item) => {
          const active = isActive(pathname, item.match);
          const Icon = item.icon;

          return (
            <li key={item.to}>
              <Link
                aria-label={item.label}
                className={cn(
                  "flex items-center justify-center rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                  active &&
                    "bg-white text-black hover:bg-white hover:text-black"
                )}
                to={item.to}
              >
                <Icon className="size-3.5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
