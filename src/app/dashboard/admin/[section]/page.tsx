import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SectionPage from "@/components/dashboards/SectionPage";
import { findSection, sectionsOf } from "@/components/dashboards/shells";

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return sectionsOf("admin").map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: `${findSection("admin", section)?.label ?? "Not found"} | Admin` };
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
  if (!findSection("admin", section)) notFound();
  return <SectionPage role="admin" slug={section} />;
}
