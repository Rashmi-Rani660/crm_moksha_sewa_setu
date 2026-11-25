"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut, useAuthSession } from "@/lib/auth/session";
import { siteConfig } from "@/lib/config/site";

/** Placeholder landing page after a successful login — the CRM starts here. */
export default function DashboardHome() {
  const router = useRouter();
  const { session, ready } = useAuthSession();

  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);

  if (!session) return <main className="min-h-dvh bg-[#e3f0fd]" />;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[linear-gradient(95deg,#dcedfd_0%,#cfe8fd_55%,#c9e5fd_100%)] p-6 text-center">
      <div className="w-full max-w-[520px] rounded-2xl bg-white p-8 shadow-[0_30px_80px_-20px_rgba(20,70,150,0.35)] sm:p-10">
        <Image
          src="/images/moksha-sewa-logo.png"
          alt={siteConfig.brand}
          width={1292}
          height={1021}
          className="mx-auto h-auto w-[150px]"
        />
        <h1 className="mt-6 text-[26px] font-bold text-navy-ink">
          Welcome to {siteConfig.name}
        </h1>
        <p className="mt-2 text-[15px] text-navy-ink">
          Signed in as +91 {session.mobile.slice(0, 2)}XXXXXX
          {session.mobile.slice(-2)}. The CRM dashboard will appear here.
        </p>
        <button
          type="button"
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
          className="mt-6 inline-flex h-[44px] items-center justify-center rounded-full border-[1.5px] border-navy-ink px-8 text-[15px] font-semibold text-navy-ink transition hover:bg-navy-ink hover:text-white"
        >
          Sign out
        </button>
      </div>
    </main>
  );
}
