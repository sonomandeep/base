import { createApiClient } from "@base/api-client";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is required");
}

export const api = createApiClient(apiUrl);
