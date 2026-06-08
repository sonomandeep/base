import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ContainerList,
  ContainerListHeader,
  ContainerListItems,
  ContainerListTitle,
} from "#/features/containers/components/container-list";
import { getContainersFn } from "#/features/containers/functions";
import { HostState } from "#/features/hosts/components/host-state";
import { isUnauthorizedError } from "#/lib/api/errors";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_dashboard/containers/")({
  component: RouteComponent,
  loader: async ({ location }) => {
    try {
      const containers = await getContainersFn();

      return { containers };
    } catch (error) {
      if (isUnauthorizedError(error)) {
        throw redirect({
          search: { redirect: location.href },
          to: "/auth/sign-in",
        });
      }

      throw error;
    }
  },
});

function RouteComponent() {
  const loader = Route.useLoaderData();

  return (
    <>
      <HostState />

      <ContainerList initialContainers={loader.containers}>
        <ContainerListHeader>
          <ContainerListTitle>Containers</ContainerListTitle>
          <Button className="font-normal text-muted-foreground" variant="ghost">
            TODO
          </Button>
        </ContainerListHeader>

        <ContainerListItems />
      </ContainerList>
    </>
  );
}
