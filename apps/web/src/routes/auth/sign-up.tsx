import { createFileRoute } from "@tanstack/react-router";
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
    <main className="flex h-screen w-full flex-row gap-12 p-12">
      <div className="flex flex-col justify-between">
        <img
          alt="Base"
          fetchPriority="high"
          height={24}
          loading="eager"
          src="/logo512.png"
          width={24}
        />

        <form className="flex w-2xs flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-medium text-lg">Sign up</h1>
            <p className="text-balance text-neutral-700 text-sm">
              Start managing your local infrastructure with Base.
            </p>
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

          <Button className="w-full" size="lg" type="submit">
            Create account
          </Button>
        </form>
      </div>

      <div className="inline-flex h-full w-full justify-center rounded-3xl bg-neutral-50 pt-16">
        <div className="w-[60%] overflow-hidden rounded-t-3xl bg-white p-8">
          <img
            alt="Base Dashboard"
            fetchPriority="high"
            height="full"
            loading="eager"
            src="/assets/dashboard.png"
            width="full"
          />
        </div>
      </div>
    </main>
  );
}
