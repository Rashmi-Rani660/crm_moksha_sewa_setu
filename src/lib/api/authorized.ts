"use client";

import { authApi } from "@/lib/api/auth";
import { ApiError, request, type RequestOptions } from "@/lib/api/client";
import { endSession, readTokens, storeTokens } from "@/lib/auth/session";
import { invalidateCrmQueries } from "./invalidation";

/**
 * Signed-in calls to the CRM API. Refreshes the access token shortly before it expires (one
 * refresh at a time, shared by parallel calls) and ends the local session when the server says the
 * session is over — so screens only ever deal with data or a readable error.
 */

const REFRESH_EARLY_MS = 30_000;
const SESSION_OVER = new Set(["CRM_SESSION_REVOKED", "CRM_AUTH_ACCOUNT_INACTIVE", "CRM_UNAUTHENTICATED"]);

let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const tokens = readTokens();
  if (!tokens) throw new ApiError(401, "CRM_UNAUTHENTICATED", "Please sign in to continue");
  refreshing ??= authApi
    .refresh(tokens.refreshToken)
    .then((next) => {
      storeTokens(next);
      return next.accessToken;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function accessToken(): Promise<string> {
  const tokens = readTokens();
  if (!tokens) throw new ApiError(401, "CRM_UNAUTHENTICATED", "Please sign in to continue");
  const expiresIn = new Date(tokens.accessTokenExpiresAt).getTime() - Date.now();
  return expiresIn > REFRESH_EARLY_MS ? tokens.accessToken : refreshAccessToken();
}

export async function authorizedRequest<T>(path: string, options: Omit<RequestOptions, "token"> = {}) {
  const token = await accessToken().catch((err: unknown) => {
    if (err instanceof ApiError && (SESSION_OVER.has(err.code) || err.status === 401)) endSession("Your session has ended. Please sign in again.");
    throw err;
  });
  try {
    let result;
    try {
      result = await request<T>(path, { ...options, token });
    } catch (err) {
      // The token expired between the check and the call: refresh once and retry.
      if (err instanceof ApiError && err.code === "CRM_TOKEN_INVALID") {
        const current = readTokens()?.accessToken;
        result = await request<T>(path, { ...options, token: current && current !== token ? current : await refreshAccessToken() });
      } else {
        throw err;
      }
    }
    if ((options.method ?? (options.body === undefined ? "GET" : "POST")) !== "GET") invalidateCrmQueries();
    return result;
  } catch (err) {
    if (err instanceof ApiError && err.code === "CRM_STALE_VERSION") invalidateCrmQueries();
    if (err instanceof ApiError && (SESSION_OVER.has(err.code) || err.code === "CRM_TOKEN_INVALID")) {
      endSession("Your session has ended. Please sign in again.");
    }
    throw err;
  }
}
