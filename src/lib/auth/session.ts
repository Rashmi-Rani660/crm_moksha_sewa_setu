"use client";

import { useSyncExternalStore } from "react";
import type { AccessLevel, AuthTokens, DashboardSlug, DeviceChallenge, SignedIn } from "@/lib/api/auth";
import { authApi } from "@/lib/api/auth";

/**
 * Client-side auth state for the CRM screens.
 *
 *   tokens + session   localStorage when "Remember me" is ticked, otherwise sessionStorage
 *   pending sign-in    sessionStorage (the verify-device step of one sign-in attempt)
 *   flash message      sessionStorage (one-off notice on the login screen)
 *
 * The server decides the access level; `role` is only which dashboard is open. A user can open
 * their own dashboard or a lower one (a Super Admin may open the User panel), never a higher one —
 * and every API call is authorised on the server regardless.
 */

const PENDING_KEY = "sewa-setu:pending-verification";
const SESSION_KEY = "sewa-setu:session";
const TOKENS_KEY = "sewa-setu:tokens";
const FLASH_KEY = "sewa-setu:flash";
/** Per-session UI state (e.g. notifications read) — cleared on sign out. */
const STATE_PREFIX = "sewa-setu:notifications-read:";

export type Role = DashboardSlug;
export const roles: Role[] = ["user", "admin", "super-admin"];
export const isRole = (value: unknown): value is Role => roles.includes(value as Role);

const ROLE_RANK: Record<Role, number> = { user: 1, admin: 2, "super-admin": 3 };

export type PendingVerification = {
  mobile: string;
  remember: boolean;
  challengeId: string;
  channel: DeviceChallenge["channel"];
  /** Masked e-mail (or mobile) the code was sent to. */
  sentTo: string;
  device: string;
  browser: string;
  location: string;
  time: string;
  resendAfterSeconds: number;
};

export type AuthSession = {
  mobile: string;
  name: string;
  crmId: string;
  accessLevel: AccessLevel;
  /** The dashboard of the user's own access level. */
  homeRole: Role;
  /** The dashboard currently open. */
  role: Role;
  signedInAt: number;
};

/* ------------------------------ tiny store ------------------------------ */

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
if (typeof window !== "undefined") {
  // A page restored from the back/forward cache keeps its old render; re-read storage.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) emit();
  });
  // Sign-in / sign-out in another tab (localStorage sessions).
  window.addEventListener("storage", (e) => {
    if (e.key === null || e.key.startsWith("sewa-setu:")) emit();
  });
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

type Area = "session" | "local";

function area(which: Area): Storage {
  return which === "local" ? window.localStorage : window.sessionStorage;
}

const read = (key: string): string | null => {
  try {
    return window.sessionStorage.getItem(key) ?? window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

/** Writes to one area and removes the key from the other, so a value only ever lives once. */
const write = (key: string, value: string | null, where: Area = "session") => {
  try {
    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(key);
    if (value !== null) area(where).setItem(key, value);
  } catch {
    /* storage unavailable (private mode) — the flow simply restarts */
  }
  emit();
};

/** Which area the current session lives in. */
const sessionArea = (): Area => {
  try {
    return window.localStorage.getItem(SESSION_KEY) ? "local" : "session";
  } catch {
    return "session";
  }
};

function useStored(key: string) {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => undefined, // server snapshot: "not hydrated yet"
  );
  return { raw: raw ?? null, ready: raw !== undefined };
}

function parse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/* ------------------------------ device info ------------------------------ */

/** "24 Nov 2026, 10:24 AM" */
export function formatDeviceTime(date = new Date()) {
  const d = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const t = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
  return `${d}, ${t}`;
}

/* ---------------------------- pending verification ---------------------------- */

/** Keeps the new-device challenge returned by the sign-in API for the verify-device screen. */
export function startVerification(mobile: string, remember: boolean, challenge: DeviceChallenge) {
  const pending: PendingVerification = {
    mobile,
    remember,
    challengeId: challenge.challengeId,
    channel: challenge.channel,
    sentTo: challenge.sentTo,
    device: challenge.device,
    browser: challenge.browser,
    // No geo-IP lookup on the server yet: show the sign-in IP address.
    location: challenge.ip ? `IP ${challenge.ip}` : "Unknown",
    time: formatDeviceTime(new Date(challenge.requestedAt)),
    resendAfterSeconds: challenge.resendAfterSeconds,
  };
  write(PENDING_KEY, JSON.stringify(pending));
}

export const clearVerification = () => write(PENDING_KEY, null);

export function usePendingVerification() {
  const { raw, ready } = useStored(PENDING_KEY);
  return { pending: parse<PendingVerification>(raw), ready };
}

/* --------------------------------- session --------------------------------- */

/** Stores the session returned by sign-in / device verification. */
export function signIn(result: SignedIn, remember: boolean) {
  const where: Area = remember ? "local" : "session";
  const session: AuthSession = {
    mobile: result.profile.mobile,
    name: result.profile.name,
    crmId: result.profile.crmId,
    accessLevel: result.profile.accessLevel,
    homeRole: result.profile.dashboard,
    role: result.profile.dashboard,
    signedInAt: Date.now(),
  };
  write(TOKENS_KEY, JSON.stringify(result.tokens), where);
  write(SESSION_KEY, JSON.stringify(session), where);
}

export function canViewDashboard(session: AuthSession | null, role: Role): boolean {
  return Boolean(session && ROLE_RANK[role] <= ROLE_RANK[session.homeRole]);
}

/** Opens another dashboard (own level or lower). Returns false when not allowed. */
export function viewDashboard(role: Role): boolean {
  const session = parse<AuthSession>(read(SESSION_KEY));
  if (!session || !canViewDashboard(session, role)) return false;
  write(SESSION_KEY, JSON.stringify({ ...session, role }), sessionArea());
  return true;
}

/** True while a sign-out is moving to /login (guards should not redirect too). */
let signingOut = false;
export const isSigningOut = () => signingOut;

function clearLocalState() {
  try {
    for (const store of [window.sessionStorage, window.localStorage]) {
      for (const key of Object.keys(store)) {
        if (key.startsWith(STATE_PREFIX)) store.removeItem(key);
      }
    }
  } catch {
    /* storage unavailable */
  }
  write(PENDING_KEY, null);
  write(TOKENS_KEY, null);
  write(SESSION_KEY, null);
}

/** Ends the session here at once and tells the server (best effort) to revoke it. */
export function signOut() {
  signingOut = true;
  const tokens = readTokens();
  clearLocalState();
  if (tokens) authApi.logout(tokens.refreshToken).catch(() => undefined);
}

/** Local sign-out after the server ended the session (expired, revoked, account suspended). */
export function endSession(message?: string) {
  clearLocalState();
  if (message) setFlash(message);
}

export function useAuthSession() {
  const { raw, ready } = useStored(SESSION_KEY);
  const session = parse<AuthSession>(raw);
  // A session from an older build (no access level) is not usable.
  const valid = session && isRole(session.role) && isRole(session.homeRole) && canViewDashboard(session, session.role);
  return { session: valid ? session : null, ready };
}

/* ---------------------------------- tokens ---------------------------------- */

export function readTokens(): AuthTokens | null {
  return parse<AuthTokens>(read(TOKENS_KEY));
}

export function storeTokens(tokens: AuthTokens) {
  write(TOKENS_KEY, JSON.stringify(tokens), sessionArea());
}

/* ------------------------------ flash message ------------------------------ */

export const setFlash = (message: string) => write(FLASH_KEY, message);
export const clearFlash = () => write(FLASH_KEY, null);
export function useFlash() {
  return useStored(FLASH_KEY).raw;
}
