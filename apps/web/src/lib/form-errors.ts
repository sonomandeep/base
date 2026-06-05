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

export function getFormErrorMessage(error: unknown) {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "form" in error) {
    const formError = error.form;

    if (typeof formError === "string") {
      return formError;
    }
  }

  return null;
}
