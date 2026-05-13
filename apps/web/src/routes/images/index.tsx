import { createFileRoute } from "@tanstack/react-router";

import { DashboardHeader } from "#/components/layout/dashboard-header";

export const Route = createFileRoute("/images/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto my-12 flex max-w-136 flex-col gap-8">
      <DashboardHeader />

      <section className="px-4">
        <div className="rounded-xl bg-muted p-4">
          <h1 className="font-medium">Images</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Image management will be available here.
          </p>
        </div>
      </section>
    </div>
  );
}
