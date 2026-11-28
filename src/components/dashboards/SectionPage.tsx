"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Box, DashboardCanvas, DESIGN_W } from "@/components/dashboards/canvas";
import { findSection, homeHref, shells, slugify } from "@/components/dashboards/shells";
import { Footer } from "@/components/dashboards/ui";
import type { Role } from "@/lib/auth/session";

/**
 * A section opened from the dashboard (menu row, "View All", quick action…),
 * shown inside the same sidebar + top bar.
 * TODO: replace the placeholder panel with the section's real screen once its
 * module and API exist.
 */
export default function SectionPage({ role, slug }: { role: Role; slug: string }) {
  const section = findSection(role, slug);
  const { sidebar } = shells[role];
  const sb = sidebar.width;
  const Icon = sidebar.items.find((i) => slugify(i.label) === slug)?.icon ?? LayoutGrid;
  const label = section?.label ?? "Section";
  const x = sb + 18;
  const w = DESIGN_W - sb - 36;

  return (
    <DashboardCanvas role={role} active={slug}>
      <Box at={[x, 70, w, 60]} as="div" fit="fluid">
        <nav aria-label="Breadcrumb" className="flex items-center text-[16px] font-semibold text-[#5b6280]">
          <Link href={homeHref(role)} className="hover:text-[#2320c4] hover:underline">Dashboard</Link>
          <ChevronRight className="mx-[6px] h-[14px] w-[14px]" aria-hidden />
          <span aria-current="page" className="text-[#0b0c36]">{label}</span>
        </nav>
        <h1 className="mt-[6px] text-[28px] font-bold leading-none tracking-[-0.6px]">{label}</h1>
      </Box>

      <Box at={[x, 140, w, 680]} fit="fluid" className="flex min-h-[420px] flex-col items-center justify-center rounded-[12px] py-12 lg:min-h-0 lg:py-0 border border-[#e1e5ee] bg-white px-6 text-center shadow-[0_3px_10px_rgba(30,50,110,0.07)]">
        <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#eef2ff] text-[#2f4fe0]">
          <Icon strokeWidth={1.9} className="h-[36px] w-[36px]" />
        </span>
        <h2 className="mt-[18px] text-[22px] font-bold tracking-[-0.4px]">{label}</h2>
        <p className="mt-[8px] max-w-[520px] text-[16px] font-medium leading-[1.5] text-[#4a5070]">
          This section isn&apos;t connected yet. Its records and actions will appear here once the {label} module is ready.
        </p>
        <Link
          href={homeHref(role)}
          className="mt-[22px] inline-flex h-[42px] items-center gap-[8px] rounded-[10px] bg-[#2320c4] px-[18px] text-[15px] font-semibold text-white hover:bg-[#1b18a3]"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
          <span className="pt-[2px]">Back to Dashboard</span>
        </Link>
      </Box>

      <Footer y={862} leftX={x + 2} logoRight={x + w - 2} />
    </DashboardCanvas>
  );
}
