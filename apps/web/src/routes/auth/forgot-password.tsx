import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [{ title: "Base | Forgot password" }],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  return null;
}
