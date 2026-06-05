import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "#/lib/auth-client";

export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await authClient.getSession({
      fetchOptions: {
        headers,
      },
    });

    if (session.error) {
      console.error("error fetching session", session.error);
      return null;
    }
    console.log(session.data);

    return session.data;
  }
);

export const ensureSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await authClient.getSession({
      fetchOptions: {
        headers,
      },
    });

    if (session.error) {
      console.error("error fetching session", session.error);
      throw new Error("Error fetching session");
    }

    if (!session) {
      throw new Error("Unauthorized");
    }

    return session.data;
  }
);
