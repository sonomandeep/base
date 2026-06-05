import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { BottomNavigation } from "#/components/layout/bottom-navigation";
import { getSessionFn } from "#/features/auth/functions";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: async ({ location }) => {
    const session = await getSessionFn();

    if (!session) {
      throw redirect({
        to: "/auth/sign-in",
        search: { redirect: location.href },
      });
    }

    return { user: session.user };
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <>
      <Outlet />
      <BottomNavigation />
    </>
  );
}
