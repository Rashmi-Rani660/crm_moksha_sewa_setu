/**
 * Display formatting for CRM data (all times in IST, as everywhere in Sewa Setu).
 */
import type { AccessLevel } from "@/lib/api/auth";

const IST = "Asia/Kolkata";

/** "24 Nov, 10:12 AM" */
export function shortDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-GB", { timeZone: IST, day: "2-digit", month: "short" });
  const time = d.toLocaleTimeString("en-US", { timeZone: IST, hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();
  return `${day}, ${time}`;
}

/** "24 Nov 2026" */
export function shortDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { timeZone: IST, day: "2-digit", month: "short", year: "numeric" });
}

/** "10:12" */
export function clock(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", { timeZone: IST, hour: "2-digit", minute: "2-digit", hour12: false });
}

/** Two-digit counts as in the designs ("03"), larger numbers unchanged. */
export const pad2 = (n: number | null | undefined) => (n === null || n === undefined ? "—" : n < 10 ? `0${n}` : String(n));

export const ACCESS_LEVEL_LABEL: Record<AccessLevel, "Super Admin" | "Admin" | "User"> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  USER: "User",
};

/** "PENDING_VERIFICATION" → "Pending verification" */
export function humanize(code?: string | null): string {
  if (!code) return "—";
  const s = code.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
