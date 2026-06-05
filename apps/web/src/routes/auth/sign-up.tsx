import { createFileRoute, Link } from "@tanstack/react-router";
import { CornerDownLeft } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";

export const Route = createFileRoute("/auth/sign-up")({
  head: () => ({
    meta: [{ title: "Base | Sign up" }],
  }),
  component: SignUp,
});

function SignUp() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <form className="flex w-2xs flex-col gap-4">
        <div className="flex flex-col items-center gap-4">
          <img
            alt="Base"
            fetchPriority="high"
            height={24}
            loading="eager"
            src="/logo512.png"
            width={24}
          />

          <div className="flex flex-col items-center gap-1">
            <h1 className="font-medium text-lg">Create an account</h1>
            <p className="text-balance text-center text-neutral-700 text-sm">
              Start managing your local infrastructure with Base.
            </p>
          </div>
        </div>

        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Firstname</FieldLabel>
              <Input
                autoComplete="name"
                id="name"
                name="name"
                placeholder="Mando"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                autoComplete="email"
                id="email"
                name="email"
                placeholder="mando@example.com"
                required
                type="email"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                autoComplete="new-password"
                id="password"
                minLength={8}
                name="password"
                placeholder="••••••••••••"
                required
                type="password"
              />
              <FieldDescription>Use at least 8 characters.</FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>

        <Button className="w-full" type="submit">
          Sign up <CornerDownLeft className="ml-1 size-3 opacity-60" />
        </Button>
      </form>

      <div className="inline-flex items-center">
        <p className="text-muted-foreground text-xs">
          Already have an account?
        </p>

        <Button
          render={<Link to="/auth/sign-in">Sign in</Link>}
          variant="link"
        />
      </div>
    </main>
  );
}
