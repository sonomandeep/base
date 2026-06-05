import { createApiClient } from "@base/api-client";
import { env } from "../env";

export const api = createApiClient(`${env.VITE_API_URL}/api`, {
  fetch: {
    credentials: "include",
  },
});
