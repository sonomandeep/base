import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FieldError {
  message?: string;
}

export function normalizeFieldErrors(errors: unknown[]) {
  return errors.reduce<FieldError[]>((fieldErrors, error) => {
    if (typeof error === "string") {
      fieldErrors.push({ message: error });
      return fieldErrors;
    }

    if (error && typeof error === "object" && "message" in error) {
      const message = error.message;

      if (typeof message === "string") {
        fieldErrors.push({ message });
      }
    }

    return fieldErrors;
  }, []);
}
