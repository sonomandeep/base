import { useNavigate } from "@tanstack/react-router";
import { LogOut, Monitor, Moon, Sun, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { authClient } from "#/lib/auth-client";

interface DashboardHeaderProps {
  user: {
    email?: string | null;
    image?: string | null;
    name?: string | null;
  };
}

function getInitial(value: string) {
  return value.trim().charAt(0).toUpperCase() || "U";
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const displayName = user.name || user.email || "User";
  const fallback = getInitial(displayName);

  async function handleSignOut() {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("Unable to sign out", {
        description: error.message ?? "Please try again.",
      });
      return;
    }

    await navigate({ to: "/auth/sign-in" });
  }

  return (
    <header className="inline-flex w-full items-center justify-between px-4">
      <Select
        defaultValue="all_hosts"
        items={[
          { label: "Select", value: null },
          { label: "All hosts", value: "all_hosts" },
        ]}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all_hosts">All Hosts</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="-mr-2"
          render={
            <Button className="h-8 gap-4" variant="ghost">
              <p className="font-medium text-xs">{displayName}</p>

              <Avatar size="sm">
                {user.image ? <AvatarImage src={user.image} /> : null}
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
            </Button>
          }
        />

        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar size="sm">
                  {user.image ? <AvatarImage src={user.image} /> : null}
                  <AvatarFallback className="rounded-lg">
                    {fallback}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-medium text-foreground text-xs">
                    {displayName}
                  </span>
                  <span className="truncate text-muted-foreground text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <div className="my-1 rounded-lg bg-muted p-1">
              <ToggleGroup
                className="grid w-full grid-cols-3 rounded-md"
                size="sm"
                spacing={0}
              >
                <ToggleGroupItem
                  aria-label="Light theme"
                  className="aria-pressed:bg-background dark:aria-pressed:bg-input/30"
                  value="light"
                >
                  <Sun />
                </ToggleGroupItem>
                <ToggleGroupItem
                  aria-label="Dark theme"
                  className="aria-pressed:bg-background dark:aria-pressed:bg-input/30"
                  value="dark"
                >
                  <Moon />
                </ToggleGroupItem>
                <ToggleGroupItem
                  aria-label="System theme"
                  className="aria-pressed:bg-background dark:aria-pressed:bg-input/30"
                  value="system"
                >
                  <Monitor />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <DropdownMenuItem>
              <User />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
