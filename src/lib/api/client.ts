/**
 * HTTP client for the Sewa Setu CRM API (moksha-backend, /api/v1/crm).
 *
 * Every response has one of two shapes:
 *   success → { success: true,  message, data, meta? }
 *   error   → { success: false, code, message, details? }
 * so callers get `data` back or an `ApiError` they can branch on by `code`.
 */

const DEFAULT_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://api.mokshasewa.org/api/v1/crm" : "http://localhost:5003/api/v1/crm";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_CRM_API_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");

export type FieldIssue = { field: string; message: string };

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** Field-level problems sent with a validation error, if any. */
  get fieldIssues(): FieldIssue[] {
    return Array.isArray(this.details) ? (this.details as FieldIssue[]) : [];
  }
}

export type PageMeta = { page: number; limit: number; total: number; totalPages: number };

type Envelope<T> =
  | { success: true; message: string; data: T; meta?: PageMeta }
  | { success: false; code: string; message: string; details?: unknown };

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Bearer token; omit for the public sign-in endpoints. */
  token?: string;
  signal?: AbortSignal;
};

const NETWORK_ERROR = "Cannot reach the server. Check your connection and try again.";

/** One call to the CRM API. Resolves with `{ data, meta }` or throws `ApiError`. */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<{ data: T; meta?: PageMeta; message: string }> {
  let response: Response;
  const multipart = typeof FormData !== "undefined" && options.body instanceof FormData;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? (options.body === undefined ? "GET" : "POST"),
      headers: {
        Accept: "application/json",
        ...(options.body !== undefined && !multipart && { "Content-Type": "application/json" }),
        ...(options.token && { Authorization: `Bearer ${options.token}` }),
      },
      body: options.body === undefined ? undefined : multipart ? options.body as FormData : JSON.stringify(options.body),
      signal: options.signal,
      cache: "no-store",
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError(0, "NETWORK_ERROR", NETWORK_ERROR);
  }

  let payload: Envelope<T> | null = null;
  try {
    payload = (await response.json()) as Envelope<T>;
  } catch {
    /* non-JSON body (proxy error page, empty 502…) */
  }

  if (!payload) throw new ApiError(response.status, "BAD_RESPONSE", "The server sent an unexpected response. Please try again.");
  if (!payload.success) throw new ApiError(response.status, payload.code, payload.message, payload.details);
  return { data: payload.data, meta: payload.meta, message: payload.message };
}

/** Message to show for any error thrown by `request` (or anything else). */
export function errorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (err instanceof ApiError) return err.fieldIssues.length ? `${err.message} ${err.fieldIssues.map(issue => `${issue.field}: ${issue.message}`).join(" · ")}` : err.message;
  return fallback;
}
