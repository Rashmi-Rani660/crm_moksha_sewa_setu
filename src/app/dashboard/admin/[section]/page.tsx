import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SectionPage from "@/components/dashboards/SectionPage";
import { findSection, sectionsOf } from "@/components/dashboards/shells";

export function generateStaticParams() {
  return sectionsOf("admin").map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/dashboard/admin/[section]">): Promise<Metadata> {
  const { section } = await params;
  return { title: `${findSection("admin", section)?.label ?? "Not found"} | Admin` };
}

export default function Page({ params }: PageProps<"/dashboard/admin/[section]">) {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-[#f7f8fd]" />}>
      <Section params={params} />
    </Suspense>
  );
}

async function Section({ params }: { params: PageProps<"/dashboard/admin/[section]">["params"] }) {
  const { section } = await params;
  if (!findSection("admin", section)) notFound();
  return <SectionPage role="admin" slug={section} />;
}
