import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SectionPage from "@/components/dashboards/SectionPage";
import { findSection, sectionsOf } from "@/components/dashboards/shells";

type Props = { params: Promise<{ section: string }> };

/** Sections with their own page folder (SA-002 … SA-008) are not generated here. */
const ownPages = new Set(["live-operations", "notification-alerts", "central-approvals", "organisation-setup", "city-zone-centres", "departments-centres", "users-access-control", "master-data", "sewa-operations", "case-workflow", "automation-ai"]);

export function generateStaticParams() {
  return sectionsOf("super-admin")
    .filter((s) => !ownPages.has(s.slug))
    .map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: `${findSection("super-admin", section)?.label ?? "Not found"} | Super Admin` };
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
  if (!findSection("super-admin", section)) notFound();
  return <SectionPage role="super-admin" slug={section} />;
}
