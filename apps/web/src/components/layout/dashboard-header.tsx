import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
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
            <Button className="h-8" variant="ghost">
              <p className="text-sm">{displayName}</p>

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
                <Avatar>
                  {user.image ? <AvatarImage src={user.image} /> : null}
                  <AvatarFallback className="rounded-lg">
                    {fallback}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-foreground">{user.name}</span>
                  <span className="truncate text-muted-foreground text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

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
