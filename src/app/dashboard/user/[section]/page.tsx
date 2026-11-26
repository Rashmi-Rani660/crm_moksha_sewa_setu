import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SectionPage from "@/components/dashboards/SectionPage";
import { findSection, sectionsOf } from "@/components/dashboards/shells";

export function generateStaticParams() {
  return sectionsOf("user").map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/dashboard/user/[section]">): Promise<Metadata> {
  const { section } = await params;
  return { title: `${findSection("user", section)?.label ?? "Not found"} | User` };
}

export default function Page({ params }: PageProps<"/dashboard/user/[section]">) {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-[#f7f8fd]" />}>
      <Section params={params} />
    </Suspense>
  );
}

async function Section({ params }: { params: PageProps<"/dashboard/user/[section]">["params"] }) {
  const { section } = await params;
  if (!findSection("user", section)) notFound();
  return <SectionPage role="user" slug={section} />;
}
