import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/images/$imageId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/images/$imageId"!</div>;
}
