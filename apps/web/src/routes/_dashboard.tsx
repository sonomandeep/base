import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNavigation } from "#/components/layout/bottom-navigation";

export const Route = createFileRoute("/_dashboard")({
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
