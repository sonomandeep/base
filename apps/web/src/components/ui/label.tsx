import type * as React from "react";

import { cn } from "#/lib/utils.ts";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: consumers pass htmlFor or wrap controls where this component is used.
    <label
      className={cn(
        "flex select-none items-center gap-2 font-medium text-xs/relaxed leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      data-slot="label"
      {...props}
    />
  );
}

export { Label };
