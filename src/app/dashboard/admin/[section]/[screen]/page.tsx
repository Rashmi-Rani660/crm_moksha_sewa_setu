import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AdScreen from "@/components/dashboards/admin/AdScreen";
import { adScreens, screenAt } from "@/components/dashboards/admin/registry";

/** Further screens of a sidebar section, e.g. /dashboard/admin/requests-cases/verification (AD-013). */
export function generateStaticParams() {
  return adScreens.filter((s) => s.sub).map((s) => ({ section: s.sectionSlug, screen: s.sub! }));
}

export async function generateMetadata({ params }: PageProps<"/dashboard/admin/[section]/[screen]">): Promise<Metadata> {
  const { section, screen } = await params;
  const s = screenAt(section, screen);
  return { title: s ? `${s.title} | Admin` : "Not found | Admin" };
}

export default function Page({ params }: PageProps<"/dashboard/admin/[section]/[screen]">) {
  return (
    <Suspense fallback={<main className="min-h-dvh bg-[#f3f6fb]" />}>
      <ScreenPage params={params} />
    </Suspense>
  );
}

async function ScreenPage({ params }: { params: PageProps<"/dashboard/admin/[section]/[screen]">["params"] }) {
  const { section, screen } = await params;
  const s = screenAt(section, screen);
  if (!s) notFound();
  return <AdScreen code={s.code} />;
}
