import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/images/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="px-4">
      <div className="rounded-xl bg-muted p-4">
        <h1 className="font-medium">Images</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Image management will be available here.
        </p>
      </div>
    </section>
  );
}
