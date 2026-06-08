import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="px-4">
      <div className="rounded-xl bg-muted p-4">
        <h1 className="font-medium">Settings</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          App settings will be available here.
        </p>
      </div>
    </section>
  );
}
