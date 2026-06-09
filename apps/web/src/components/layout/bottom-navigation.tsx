import {
  ContainerIcon,
  DocumentCodeIcon,
  HomeIcon,
  Layers01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "#/lib/utils";

const items = [
  { icon: HomeIcon, label: "Home", match: "/", to: "/" },
  {
    icon: ContainerIcon,
    label: "Containers",
    match: "/containers",
    to: "/containers",
  },
  { icon: Layers01Icon, label: "Images", match: "/images", to: "/images" },
  { icon: DocumentCodeIcon, label: "Logs", match: "/logs", to: "/logs" },
  {
    icon: Settings02Icon,
    label: "Settings",
    match: "/settings",
    to: "/settings",
  },
] satisfies Array<{
  icon: IconSvgElement;
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
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black p-2 dark:bg-muted"
    >
      <ul className="flex items-center gap-3">
        {items.map((item) => {
          const active = isActive(pathname, item.match);

          return (
            <li key={item.to}>
              <Link
                aria-label={item.label}
                className={cn(
                  "flex items-center justify-center rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 dark:text-foreground/70 dark:focus-visible:ring-ring/50 dark:hover:bg-foreground/10 dark:hover:text-foreground",
                  active &&
                    "bg-white text-black hover:bg-white hover:text-black dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground"
                )}
                to={item.to}
              >
                <HugeiconsIcon
                  className="size-3.5"
                  icon={item.icon}
                  strokeWidth={2}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
