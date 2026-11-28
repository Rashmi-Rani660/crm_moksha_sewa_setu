import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SectionPage from "@/components/dashboards/SectionPage";
import { findSection, sectionsOf } from "@/components/dashboards/shells";
import { userOwnPages } from "@/components/dashboards/user/us/routes";

type Props = { params: Promise<{ section: string }> };

const ownPages = new Set(["my-tasks", "communication-hub", "ai-work-assistant", "resources-expenses"]);

export function generateStaticParams() {
  /** Sections with their own page folder (US-001 … US-020) are not generated here. */
  return sectionsOf("user")
    .filter((s) => !ownPages.has(s.slug) && !userOwnPages.includes(s.slug))
    .map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: `${findSection("user", section)?.label ?? "Not found"} | User` };
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-[#f3f6fb]" />}>
      <Section params={params} />
    </Suspense>
  );
}

async function Section({ params }: Props) {
  const { section } = await params;
  if (!findSection("user", section)) notFound();
  return <SectionPage role="user" slug={section} />;
}
