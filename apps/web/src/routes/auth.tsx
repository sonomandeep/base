import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSessionFn } from "#/features/auth/functions";

export const Route = createFileRoute("/auth")({
  beforeLoad: async () => {
    const session = await getSessionFn();

    if (session) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
