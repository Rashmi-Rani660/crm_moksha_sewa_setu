"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect } from "react";
import DashboardMain from "@/components/dashboard/DashboardMain";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAuthSession } from "@/lib/auth/session";

/**
 * The dashboard is laid out on the design's 1600px canvas. From `lg` up the
 * whole canvas is zoomed to the window width (`--vw` / `--vh` come from the
 * inline script in `app/layout.tsx`), so every screen shows the same layout.
 * Below `lg` it falls back to a normal responsive flow.
 */
const canvas = {
  "--z": "clamp(0.6, calc(var(--vw, 1600) / 1600), 1.6)",
} as CSSProperties;

export default function DashboardHome() {
  const router = useRouter();
  const { session, ready } = useAuthSession();

  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);

  if (!session) return <main className="min-h-dvh bg-[#f4f5fb]" />;

  return (
    <div
      style={canvas}
      className="flex min-h-dvh lg:[min-height:calc(var(--vh,898)*1px/var(--z))] lg:[width:calc(var(--vw,1600)*1px/var(--z))] lg:[zoom:var(--z)]"
    >
      <DashboardSidebar />
      <DashboardMain />
    </div>
  );
}
