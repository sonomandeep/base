import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";

export function DashboardHeader() {
  return (
    <header className="inline-flex w-full items-center justify-between px-4">
      <Select
        defaultValue="all_nodes"
        items={[
          { label: "Select", value: null },
          { label: "All nodes", value: "all_nodes" },
        ]}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all_nodes">All Nodes</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="inline-flex items-center gap-3">
        <p className="text-sm">Mando</p>

        <Avatar size="sm">
          <AvatarImage src="https://github.com/sonomandeep.png" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
