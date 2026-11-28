import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AdScreen from "@/components/dashboards/admin/AdScreen";
import { adScreens, screenAt } from "@/components/dashboards/admin/registry";

/** First screen of each sidebar section (AD-002 … AD-050), plus My Profile / Notifications. */
export function generateStaticParams() {
  const sections = adScreens.filter((s) => s.code !== "AD-001" && !s.sub).map((s) => s.sectionSlug);
  return [...sections, "my-profile", "notifications"].map((section) => ({ section }));
}

export async function generateMetadata({ params }: PageProps<"/dashboard/admin/[section]">): Promise<Metadata> {
  const { section } = await params;
  const s = screenAt(section);
  return { title: s ? `${s.title} | Admin` : "Not found | Admin" };
}

export default function Page({ params }: PageProps<"/dashboard/admin/[section]">) {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-[#f3f6fb]" />}>
      <Section params={params} />
    </Suspense>
  );
}

async function Section({ params }: { params: PageProps<"/dashboard/admin/[section]">["params"] }) {
  const { section } = await params;
  const s = screenAt(section);
  if (!s) notFound();
  return <AdScreen code={s.code} />;
}
