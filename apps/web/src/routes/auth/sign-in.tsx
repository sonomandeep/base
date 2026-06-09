import { CornerDownLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Spinner } from "#/components/ui/spinner";
import { authClient } from "#/lib/auth-client";
import { normalizeFieldErrors } from "#/lib/utils";

export const Route = createFileRoute("/auth/sign-in")({
  head: () => ({
    meta: [{ title: "Base | Sign in" }],
  }),
  component: SignIn,
});

const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

function SignIn() {
  const navigate = Route.useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signInSchema,
      onSubmit: signInSchema,
      onSubmitAsync: async ({ value }) => {
        const { error } = await authClient.signIn.email(value);

        if (!error) {
          return null;
        }

        return {
          form: "Invalid email or password.",
        };
      },
    },
    onSubmit: async () => {
      await navigate({ to: "/" });
    },
  });

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <form
        className="flex w-2xs flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
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
            <h1 className="font-medium text-lg">Sign in</h1>
            <p className="text-balance text-center text-foreground/70 text-sm">
              Access your Base dashboard.
            </p>
          </div>
        </div>

        <FieldSet>
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isBlurred && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      autoComplete="email"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="mando@example.com"
                      type="email"
                      value={field.state.value}
                    />
                    {isInvalid && (
                      <FieldError
                        errors={normalizeFieldErrors(field.state.meta.errors)}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isBlurred && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between gap-4">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Link
                        className="text-muted-foreground text-xs underline-offset-4 hover:underline"
                        to="/auth/forgot-password"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      aria-invalid={isInvalid}
                      autoComplete="current-password"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="••••••••••••"
                      type="password"
                      value={field.state.value}
                    />
                    {isInvalid && (
                      <FieldError
                        errors={normalizeFieldErrors(field.state.meta.errors)}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </FieldSet>

        <form.Subscribe selector={(state) => state.errorMap}>
          {(errorMap) => {
            const message = errorMap.onSubmit?.form;

            return message ? <FieldError>{String(message)}</FieldError> : null;
          }}
        </form.Subscribe>

        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isSubmitting,
            state.isPristine,
          ]}
        >
          {([canSubmit, isSubmitting, isPristine]) => {
            const isDisabled = !canSubmit || isSubmitting || isPristine;

            return (
              <Button className="w-full" disabled={isDisabled} type="submit">
                Sign in
                {isSubmitting ? (
                  <Spinner />
                ) : (
                  <HugeiconsIcon
                    className="size-3.5"
                    icon={CornerDownLeftIcon}
                    strokeWidth={2}
                  />
                )}
              </Button>
            );
          }}
        </form.Subscribe>
      </form>

      <div className="inline-flex items-center">
        <p className="text-muted-foreground text-xs">No account yet?</p>

        <Link
          className="px-1.5 text-xs underline-offset-4 hover:underline"
          to="/auth/sign-up"
        >
          Sign up
        </Link>
      </div>
    </main>
  );
}
