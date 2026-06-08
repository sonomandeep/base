import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CornerDownLeft } from "lucide-react";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Spinner } from "#/components/ui/spinner";
import { authClient } from "#/lib/auth-client";
import { normalizeFieldErrors } from "#/lib/utils";

export const Route = createFileRoute("/auth/sign-up")({
  head: () => ({
    meta: [{ title: "Base | Sign up" }],
  }),
  component: SignUp,
});

const signUpSchema = z.object({
  email: z.email("Enter a valid email address."),
  name: z.string().min(1, "Name is required."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(128, "Use at most 128 characters."),
});

function SignUp() {
  const navigate = Route.useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    validators: {
      onChange: signUpSchema,
      onSubmit: signUpSchema,
      onSubmitAsync: async ({ value }) => {
        const { error } = await authClient.signUp.email(value);

        if (!error) {
          return null;
        }

        if (error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
          return {
            fields: {
              email: "This email is already in use.",
            },
          };
        }

        return {
          form: error.message ?? "Something went wrong. Please try again.",
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
            <h1 className="font-medium text-lg">Create an account</h1>
            <p className="text-balance text-center text-foreground/70 text-sm">
              Start managing your local infrastructure with Base.
            </p>
          </div>
        </div>

        <FieldSet>
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isBlurred && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      autoComplete="name"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      placeholder="Mando"
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
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
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
                    <FieldDescription>
                      Use at least 8 characters.
                    </FieldDescription>
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
                Sign up
                {isSubmitting ? (
                  <Spinner />
                ) : (
                  <CornerDownLeft className="ml-1 size-3 opacity-60" />
                )}
              </Button>
            );
          }}
        </form.Subscribe>
      </form>

      <div className="inline-flex items-center">
        <p className="text-muted-foreground text-xs">
          Already have an account?
        </p>

        <Link
          className="px-1.5 text-xs underline-offset-4 hover:underline"
          to="/auth/sign-in"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
