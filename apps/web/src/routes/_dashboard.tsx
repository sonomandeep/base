import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { BottomNavigation } from "#/components/layout/bottom-navigation";
import { DashboardHeader } from "#/components/layout/dashboard-header";
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
      <div className="mx-auto my-12 flex max-w-136 flex-col gap-8 pb-24">
        <DashboardHeader />
        <Outlet />
      </div>
      <BottomNavigation />
    </>
  );
}
