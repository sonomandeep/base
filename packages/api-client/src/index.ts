import { treaty } from "@elysia/eden";
import type { Api } from "api";

export function createApiClient(url: string) {
  return treaty<Api>(url);
}

export type ApiClient = ReturnType<typeof createApiClient>;
