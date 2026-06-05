import { treaty } from "@elysia/eden";
import type { Api } from "api";

type TreatyOptions = Parameters<typeof treaty<Api>>[1];

export function createApiClient(url: string, options?: TreatyOptions) {
  return treaty<Api>(url, options);
}

export type ApiClient = ReturnType<typeof createApiClient>;
