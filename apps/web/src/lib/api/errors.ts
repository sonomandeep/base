export const UNAUTHORIZED_ERROR_MESSAGE = "Unauthorized";

function getStatus(error: unknown): number | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const errorObject = error as Record<string, unknown>;

  if (typeof errorObject.status === "number") {
    return errorObject.status;
  }

  if (typeof errorObject.statusCode === "number") {
    return errorObject.statusCode;
  }

  if ("value" in errorObject) {
    return getStatus(errorObject.value);
  }

  if ("response" in errorObject) {
    return getStatus(errorObject.response);
  }

  return null;
}

export function isUnauthorizedApiError(error: unknown) {
  return getStatus(error) === 401;
}

export function isUnauthorizedError(error: unknown) {
  if (error instanceof Error) {
    return error.message === UNAUTHORIZED_ERROR_MESSAGE;
  }

  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    error.message === UNAUTHORIZED_ERROR_MESSAGE
  );
}

export function throwIfUnauthorizedApiError(error: unknown) {
  if (isUnauthorizedApiError(error)) {
    throw new Error(UNAUTHORIZED_ERROR_MESSAGE);
  }
}
