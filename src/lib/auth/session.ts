"use client";

import { useSyncExternalStore } from "react";

/**
 * Client-side auth flow state, kept in sessionStorage until a real backend
 * exists. Replace the TODO'd values (email, location) with server data.
 */

const PENDING_KEY = "sewa-setu:pending-verification";
const SESSION_KEY = "sewa-setu:session";
const FLASH_KEY = "sewa-setu:flash";
/** Per-session UI state (e.g. notifications read) — cleared on sign out. */
const STATE_PREFIX = "sewa-setu:notifications-read:";

export type PendingVerification = {
  mobile: string;
  /** Role the sign-in is for (decided by the login OTP). */
  role: Role;
  /** Masked e-mail the OTP was sent to. TODO: comes from the sign-in API. */
  email: string;
  device: string;
  browser: string;
  /** TODO: comes from the sign-in API (IP geolocation). */
  location: string;
  time: string;
};

export type Role = "user" | "admin" | "super-admin";
export const roles: Role[] = ["user", "admin", "super-admin"];

/** `role` decides which dashboard opens. TODO: comes from the sign-in API. */
export type AuthSession = { mobile: string; signedInAt: number; role: Role };

export const isRole = (value: unknown): value is Role => roles.includes(value as Role);

/* ------------------------------ tiny store ------------------------------ */

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const read = (key: string) => {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string | null) => {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode) — flow simply restarts */
  }
  emit();
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

export function describeDevice() {
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
  const device = /iPhone|iPad/.test(ua)
    ? "iPhone / iPad"
    : /Android/.test(ua)
      ? "Android Phone"
      : /Mac OS X/.test(ua)
        ? "Mac"
        : /Windows/.test(ua)
          ? "Windows PC"
          : /Linux/.test(ua)
            ? "Linux PC"
            : "Unknown device";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Browser";
  return { device, browser };
}

/** "24 Nov 2026, 10:24 AM" */
export function formatDeviceTime(date = new Date()) {
  const d = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const t = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
  return `${d}, ${t}`;
}

/* ---------------------------- pending verification ---------------------------- */

export function startVerification(mobile: string, role: Role) {
  const pending: PendingVerification = {
    mobile,
    role,
    email: "v****@namogange.org", // TODO: from API
    ...describeDevice(),
    location: "New Delhi, India (Approx.)", // TODO: from API
    time: formatDeviceTime(),
  };
  write(PENDING_KEY, JSON.stringify(pending));
}

export const clearVerification = () => write(PENDING_KEY, null);

export function usePendingVerification() {
  const { raw, ready } = useStored(PENDING_KEY);
  return { pending: parse<PendingVerification>(raw), ready };
}

/* --------------------------------- session --------------------------------- */

export function signIn(mobile: string, role: Role) {
  write(SESSION_KEY, JSON.stringify({ mobile, signedInAt: Date.now(), role }));
}

/** Ends the session: removes the session, any pending sign-in and per-session UI state. */
export function signOut() {
  try {
    for (const key of Object.keys(window.sessionStorage)) {
      if (key.startsWith(STATE_PREFIX)) window.sessionStorage.removeItem(key);
    }
  } catch {
    /* storage unavailable */
  }
  write(PENDING_KEY, null);
  write(SESSION_KEY, null);
}

export function useAuthSession() {
  const { raw, ready } = useStored(SESSION_KEY);
  const session = parse<AuthSession>(raw);
  // A session without a valid role (e.g. from an older build) is not usable.
  return { session: session && isRole(session.role) ? session : null, ready };
}

/* ------------------------------ flash message ------------------------------ */

export const setFlash = (message: string) => write(FLASH_KEY, message);
export const clearFlash = () => write(FLASH_KEY, null);
export function useFlash() {
  return useStored(FLASH_KEY).raw;
}
