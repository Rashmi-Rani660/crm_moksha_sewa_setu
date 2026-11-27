"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthSession } from "@/lib/auth/session";

export default function RoleRedirect() {
  const router = useRouter();
  const { session, ready } = useAuthSession();

  useEffect(() => {
    if (!ready) return;
    if (!session) return router.replace("/login");
    router.replace(`/dashboard/${session.role}`);
  }, [ready, session, router]);

  return <main className="min-h-dvh bg-[#f3f6fb]" />;
}
