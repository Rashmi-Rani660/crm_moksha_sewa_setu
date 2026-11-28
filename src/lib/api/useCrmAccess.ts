"use client";

import type { CrmProfile } from "./auth";
import { useAuthSession } from "@/lib/auth/session";
import { useCrmQuery } from "./useCrmQuery";

/** Grants always come from the current server profile, including when opening a lower dashboard. */
export function useCrmAccess(enabled = true) {
  const { session } = useAuthSession();
  const profile = useCrmQuery<CrmProfile>(enabled && session ? "/auth/me" : null);
  const can = (key: string) => profile.data?.permissions.some((p) => p.key === key) ?? false;
  return { ...profile, profile: profile.data, can };
}
