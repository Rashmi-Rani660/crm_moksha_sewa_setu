"use client";

/**
 * Shared UI primitives for Super Admin screens SA-051 to SA-060.
 * Matches the Sewa Setu CRM design book (26 Nov 2026) visual specification.
 */

import { Fragment, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { KpiRow, KpiTile, Panel, type TileTone } from "@/components/dashboards/super-admin/kit";
import { saRoutes } from "@/components/dashboards/super-admin/routes";

export { KpiRow, KpiTile, Panel };

export const sa51Screens = [
  { id: "SA-051", label: "AI Cost & Usage Control", href: saRoutes.aiCostUsage },
  { id: "SA-052", label: "Notification & Communication Templates", href: saRoutes.communicationTemplates },
  { id: "SA-053", label: "AI Universal Smart Search", href: saRoutes.aiSmartSearch },
  { id: "SA-054", label: "AI Training Academy Dashboard", href: saRoutes.trainingAcademy },
  { id: "SA-055", label: "Course & Training Module Management", href: saRoutes.courseManagement },
  { id: "SA-056", label: "Role-wise Training Assignment", href: saRoutes.roleTraining },
  { id: "SA-057", label: "AI Virtual Trainer Configuration", href: saRoutes.virtualTrainer },
  { id: "SA-058", label: "Assessment & Certification", href: saRoutes.assessments },
  { id: "SA-059", label: "Admin & User Performance", href: saRoutes.performance },
  { id: "SA-060", label: "Sewa Excellence & Recognition", href: saRoutes.excellence },
] as const;

export function Sa51Header({
  code,
  title,
  subtitle = "Super Admin / FY 2026–27 / Ghaziabad",
}: {
  code: (typeof sa51Screens)[number]["id"];
  title: string;
  subtitle?: string;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2 lg:h-[46px] lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-[20px] font-bold leading-tight tracking-[-0.4px] text-[#0b0c36] lg:text-[21px] lg:leading-none">
          {title}
        </h1>
        <p className="mt-[4px] text-[12.5px] font-medium leading-none text-[#4a5070]">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-[8px] lg:flex-nowrap">
        <span className="inline-flex h-[26px] items-center rounded-[6px] border border-[#f5d08a] bg-[#fef3c7] px-[10px] text-[11px] font-bold tracking-[0.3px] text-[#92400e]">
          DEMO DATA
        </span>
        <div className="relative h-[30px] w-[280px] shrink-0">
          <select
            aria-label="Select Super Admin screen"
            value={code}
            onChange={(e) => {
              const target = sa51Screens.find((s) => s.id === e.target.value);
              if (target) router.push(target.href);
            }}
            className="h-full w-full cursor-pointer appearance-none rounded-[8px] border border-[#cfd5e2] bg-white pl-[10px] pr-[28px] text-[12.5px] font-semibold text-[#0b0c36] shadow-[0_1px_2px_rgba(30,50,110,0.05)] outline-none focus:border-[#1d4fe0]"
          >
            {sa51Screens.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown strokeWidth={2.2} className="pointer-events-none absolute right-[8px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#4a5070]" />
        </div>
      </div>
    </div>
  );
}

/** Pill tones tailored to SA-051…SA-060 status labels. */
const pillToneMap: Record<string, string> = {
  "within limit": "bg-[#d4f3d2] text-[#1c6b1f]",
  approved: "bg-[#d4f3d2] text-[#1c6b1f]",
  "on track": "bg-[#d4f3d2] text-[#1c6b1f]",
  published: "bg-[#d4f3d2] text-[#1c6b1f]",
  certified: "bg-[#d4f3d2] text-[#1c6b1f]",
  passed: "bg-[#d4f3d2] text-[#1c6b1f]",
  reviewed: "bg-[#d4f3d2] text-[#1c6b1f]",
  enabled: "bg-[#d4f3d2] text-[#1c6b1f]",
  review: "bg-[#fdf1c4] text-[#8a5300]",
  draft: "bg-[#fde9c4] text-[#8a5300]",
  required: "bg-[#fde9c4] text-[#8a5300]",
  retest: "bg-[#fde9c4] text-[#8a5300]",
  coaching: "bg-[#fde9c4] text-[#8a5300]",
  retired: "bg-[#dde9fd] text-[#1d4fb8]",
  existing: "bg-[#dde9fd] text-[#1d4fb8]",
  demo: "bg-[#dde9fd] text-[#1d4fb8]",
  scoped: "bg-[#dde9fd] text-[#1d4fb8]",
  versioned: "bg-[#dde9fd] text-[#1d4fb8]",
  sandbox: "bg-[#dde9fd] text-[#1d4fb8]",
  view: "bg-[#eef4ff] text-[#1d4fb8] border border-[#c9d8fb]",
};

export function Sa51Pill({ children, onClick }: { children: string; onClick?: () => void }) {
  const cls = pillToneMap[children.toLowerCase()] ?? "bg-[#e9ecf2] text-[#3b4256]";
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex h-[20px] items-center justify-center whitespace-nowrap rounded-full px-[10px] text-[11.5px] font-semibold leading-none hover:brightness-95 ${cls}`}
      >
        {children}
      </button>
    );
  }
  return (
    <span className={`inline-flex h-[20px] items-center justify-center whitespace-nowrap rounded-full px-[10px] text-[11.5px] font-semibold leading-none ${cls}`}>
      {children}
    </span>
  );
}

export function Sa51Btn({
  children,
  primary = false,
  onClick,
  className = "",
}: {
  children: ReactNode;
  primary?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-[28px] shrink-0 items-center justify-center whitespace-nowrap rounded-[7px] px-[12px] text-[12px] font-semibold transition-colors ${
        primary
          ? "bg-[#1d4fe0] text-white shadow-[0_2px_6px_rgba(29,79,224,0.28)] hover:bg-[#1741be]"
          : "border border-[#b9c8f0] bg-white text-[#1d4fe0] hover:bg-[#f2f6ff]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Sa51SearchRow({
  value,
  onChange,
  placeholder = "Search records...",
  onFilter,
  onExport,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onFilter?: () => void;
  onExport?: () => void;
}) {
  return (
    <div className="mb-[8px] flex items-center gap-[8px]">
      <label className="flex h-[32px] min-w-0 flex-1 items-center rounded-[8px] border border-[#cfd5e2] bg-white px-[10px] focus-within:border-[#1d4fe0]">
        <Search strokeWidth={2} className="h-[14px] w-[14px] shrink-0 text-[#5b6280]" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="ml-[8px] h-full min-w-0 flex-1 bg-transparent text-[12.5px] font-medium text-[#0b0c36] outline-none placeholder:text-[#6b7280]"
        />
      </label>
      {onFilter && (
        <button
          type="button"
          onClick={onFilter}
          className="h-[32px] shrink-0 rounded-[8px] border border-[#cfd5e2] bg-white px-[12px] text-[12.5px] font-semibold text-[#1a1d36] hover:bg-[#f4f6fb]"
        >
          Filter
        </button>
      )}
      {onExport && (
        <button
          type="button"
          onClick={onExport}
          className="h-[32px] shrink-0 rounded-[8px] border border-[#cfd5e2] bg-white px-[12px] text-[12.5px] font-semibold text-[#1a1d36] hover:bg-[#f4f6fb]"
        >
          Export
        </button>
      )}
    </div>
  );
}

export function Sa51KvList({ rows }: { rows: readonly [string, ReactNode][] }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-[10px] text-[12.5px] leading-snug">
          <span className="text-[#4a5070]">{k}</span>
          <span className="text-right font-semibold text-[#0b0c36]">{v}</span>
        </div>
      ))}
    </div>
  );
}

export function Sa51ProgressBar({ label, pct, rightText }: { label: string; pct: number; rightText?: string }) {
  return (
    <div>
      <div className="mb-[3px] flex items-center justify-between text-[12px] font-medium text-[#1a1d36]">
        <span>{label}</span>
        <span className="font-semibold text-[#0b0c36]">{rightText ?? `${pct}%`}</span>
      </div>
      <div className="h-[11px] w-full overflow-hidden rounded-[4px] bg-[#e9edf5]">
        <div
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          className="h-full rounded-[4px] bg-[linear-gradient(90deg,#1d6fd6_0%,#3b8fe8_100%)]"
        />
      </div>
    </div>
  );
}

export function Sa51Lifecycle({
  steps,
  meta,
}: {
  steps: readonly string[];
  meta: readonly [string, string][];
}) {
  return (
    <div className="flex h-full flex-col justify-between gap-[10px]">
      <div className="flex items-center gap-[4px] overflow-x-auto pt-[2px]">
        {steps.map((step, i) => (
          <Fragment key={step}>
            {i > 0 && <ArrowRight strokeWidth={2} className="h-[13px] w-[13px] shrink-0 text-[#4f74b8]" />}
            <div
              className={`flex h-[46px] min-w-[110px] flex-1 items-center justify-center rounded-[8px] border px-[8px] text-center text-[12px] font-semibold text-[#1a1d36] ${
                i % 2 === 1
                  ? "border-[#cde5cb] bg-[#f2fbf1]"
                  : "border-[#cddcf5] bg-[#f3f8ff]"
              }`}
            >
              {step}
            </div>
          </Fragment>
        ))}
      </div>
      <Sa51KvList rows={meta} />
    </div>
  );
}

export const sa51TableHead = "whitespace-nowrap border-b border-[#e3e7ef] bg-[#f3f6fb] px-[10px] py-[7px] text-left text-[12px] font-semibold text-[#4a5070]";
export const sa51TableCell = "whitespace-nowrap border-b border-[#eef1f6] px-[10px] py-[7px] text-[12.5px] font-medium text-[#1a1d36]";

export type KpiSpec = {
  tone: TileTone;
  value: string;
  label: string;
};
