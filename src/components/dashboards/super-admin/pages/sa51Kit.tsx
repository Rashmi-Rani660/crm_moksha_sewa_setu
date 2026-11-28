"use client";

/**
 * Shared UI primitives for Super Admin screens SA-051 to SA-060.
 * Matches the Sewa Setu CRM design book (26 Nov 2026) and RegisterScreen visual theme.
 */

import { Fragment, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Radio, Search, type LucideIcon } from "lucide-react";
import { type TileTone } from "@/components/dashboards/super-admin/kit";
import { screenPicker } from "@/components/dashboards/super-admin/routes";

export function Sa51Header({
  code,
  title,
  subtitle = "Super Admin / FY 2026–27 / Ghaziabad",
}: {
  code: string;
  title: string;
  subtitle?: string;
}) {
  const router = useRouter();
  const matchedGroup = screenPicker.find((s) => s.code === code)?.group;
  const siblings = matchedGroup ? screenPicker.filter((s) => s.group === matchedGroup) : screenPicker;
  return (
    <div className="flex flex-col gap-3 lg:h-[44px] lg:flex-row lg:items-start lg:gap-[12px]">
      <div className="flex min-w-0 items-start gap-[8px]">
        {/* <Radio strokeWidth={2.2} className="mt-[4px] h-[24px] w-[24px] shrink-0 text-[#1f4fd0]" aria-hidden /> */}
        <div className="min-w-0">
          <h1 className="text-[19px] font-medium leading-tight tracking-[-0.2px] text-[#1a1d36] lg:whitespace-nowrap lg:text-[21.5px]">
            {title}
          </h1>
          <p className="mt-[2px] text-[15.8px] text-[#1a1d36]">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-[10px] lg:ml-auto lg:mt-[4px] lg:flex-nowrap">
        <span className="flex h-[25px] items-center rounded-[4px] border border-[#ecd8a0] bg-[#fff1c9] px-[9px] pt-px text-[14.6px] font-normal text-[#6b5200]">
          DEMO DATA
        </span>
        <label className="relative block h-[30px] w-full sm:w-[328px]">
          <span className="sr-only">Open screen</span>
          <select
            aria-label="Select Super Admin screen"
            value={code}
            onChange={(e) => {
              const target = siblings.find((s) => s.code === e.target.value);
              if (target) router.push(target.href);
            }}
            className="h-full w-full cursor-pointer appearance-none truncate rounded-[6px] border border-[#c9d2e0] bg-white pl-[12px] pr-[30px] pt-px text-[16px] text-[#1a1d36] shadow-[0_1px_2px_rgba(20,45,90,0.06)] outline-none focus:border-[#5b7fe0]"
          >
            {siblings.map((s) => (
              <option key={s.code} value={s.code}>
                {s.title}
              </option>
            ))}
          </select>
          <ChevronDown strokeWidth={2.6} className="pointer-events-none absolute right-[9px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#1a1d36]" aria-hidden />
        </label>
      </div>
    </div>
  );
}

const kpiToneStyles: Record<TileTone, { bg: string; border: string; fg: string }> = {
  blue: { bg: "linear-gradient(180deg,#ecf5fe 0%,#e3effc 100%)", border: "#c6d9ef", fg: "#1f6fd6" },
  green: { bg: "linear-gradient(180deg,#ecfaee 0%,#e2f5e6 100%)", border: "#c4e4cb", fg: "#1f8a34" },
  orange: { bg: "linear-gradient(180deg,#fff7e7 0%,#fff1d9 100%)", border: "#f3dcaf", fg: "#e59410" },
  purple: { bg: "linear-gradient(180deg,#f4f0fd 0%,#eee8fb 100%)", border: "#dacff4", fg: "#7a4fe0" },
  sky: { bg: "linear-gradient(180deg,#ecf5fe 0%,#e3effc 100%)", border: "#c6d9ef", fg: "#1f6fd6" },
  red: { bg: "linear-gradient(180deg,#fff0ef 0%,#ffe7e7 100%)", border: "#f2c6c6", fg: "#d92c2c" },
  pink: { bg: "linear-gradient(180deg,#fff6fa 0%,#fde3ee 100%)", border: "#f5d0df", fg: "#d6336c" },
};

export function KpiRow({ children }: { cols?: number; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 md:grid-cols-3 lg:h-[70px] lg:grid-cols-6 lg:gap-[10px]">
      {children}
    </div>
  );
}

export function KpiTile({
  tone,
  icon: Icon,
  value,
  label,
  sub,
}: {
  tone: TileTone;
  icon: LucideIcon;
  value: ReactNode;
  label: ReactNode;
  sub?: ReactNode;
}) {
  const t = kpiToneStyles[tone];
  return (
    <div
      style={{ background: t.bg, borderColor: t.border }}
      className="flex min-h-[66px] min-w-0 items-center gap-[10px] rounded-[8px] border px-[11px] shadow-[0_1px_3px_rgba(20,45,90,0.06)]"
    >
      <Icon strokeWidth={2} style={{ color: t.fg }} className="h-[30px] w-[30px] shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="whitespace-nowrap text-[22px] font-medium leading-none tracking-[-0.2px] text-[#1a1d36]">{value}</p>
        <p className="mt-[3px] truncate text-[15px] font-normal leading-tight text-[#1a1d36]">{label}</p>
        {sub && <p className="mt-[1px] truncate text-[15px] font-normal leading-none text-[#4a5070]">{sub}</p>}
      </div>
    </div>
  );
}

export function Panel({
  title,
  className = "",
  bodyClassName = "",
  children,
}: {
  title?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={typeof title === "string" ? title : undefined}
      className={`flex min-w-0 flex-col overflow-hidden rounded-[8px] border border-[#d6deec] bg-white shadow-[0_1px_3px_rgba(20,45,90,0.05)] ${className}`}
    >
      {title && (
        <header className="flex items-center border-b border-[#e4e9f2] bg-[#f4f7fc] px-[14px] py-[7px]">
          <h2 className="min-w-0 flex-1 text-[15px] font-medium leading-tight tracking-[-0.1px] text-[#1a1d36] lg:truncate">
            {title}
          </h2>
        </header>
      )}
      <div className={`min-h-0 flex-1 px-[14px] pb-[9px] pt-[7px] ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}

export function Sa51Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly T[];
  value: T;
  onChange: (t: T) => void;
}) {
  return (
    <div role="tablist" className="flex gap-[6px] overflow-x-auto rounded-[8px] border border-[#d6deec] bg-white p-[3px] shadow-[0_1px_2px_rgba(20,45,90,0.05)]">
      {tabs.map((t) => {
        const on = t === value;
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t)}
            className={`flex h-[28px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] px-[12px] text-[15.5px] font-medium transition-colors lg:flex-1 lg:px-[8px] ${on ? "bg-[#1d4fe0] text-white" : "text-[#1a1d36] hover:bg-[#f1f4fb]"
              }`}
          >
            <span className="pt-px">{t}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Pill tones tailored to SA-051…SA-060 status labels. */
const pillToneMap: Record<string, string> = {
  "within limit": "bg-[#d5f3d7] text-[#247537]",
  approved: "bg-[#d5f3d7] text-[#247537]",
  "on track": "bg-[#d5f3d7] text-[#247537]",
  published: "bg-[#d5f3d7] text-[#247537]",
  certified: "bg-[#d5f3d7] text-[#247537]",
  passed: "bg-[#d5f3d7] text-[#247537]",
  reviewed: "bg-[#d5f3d7] text-[#247537]",
  enabled: "bg-[#d5f3d7] text-[#247537]",
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
        className={`inline-flex h-[20px] items-center justify-center whitespace-nowrap rounded-full px-[10px] text-[14px] font-medium leading-none hover:brightness-95 ${cls}`}
      >
        {children}
      </button>
    );
  }
  return (
    <span className={`inline-flex h-[20px] items-center justify-center whitespace-nowrap rounded-full px-[10px] text-[14px] font-medium leading-none ${cls}`}>
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
      className={`inline-flex h-[28px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] px-[11px] pt-px text-[15px] font-normal transition-colors ${primary
        ? "bg-[linear-gradient(90deg,#086eed_0%,#093cdd_100%)] text-white shadow-[0_1px_3px_rgba(9,60,221,0.3)] hover:brightness-110"
        : "border border-[#a9bddf] bg-white text-[#1e43a8] hover:bg-[#f1f5fd]"
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
    <div className="mb-[6px] flex items-center gap-[8px]">
      <label className="flex h-[29px] min-w-0 flex-1 items-center rounded-[6px] border border-[#c9d2e0] bg-white px-[10px] focus-within:border-[#1d4fe0]">
        <Search strokeWidth={2} className="h-[14px] w-[14px] shrink-0 text-[#5b6280]" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="ml-[8px] h-full min-w-0 flex-1 bg-transparent text-[15px] font-normal text-[#1a1d36] outline-none placeholder:text-[#6b7280]"
        />
      </label>
      {onFilter && (
        <button
          type="button"
          onClick={onFilter}
          className="h-[29px] shrink-0 rounded-[6px] border border-[#c9d2e0] bg-white px-[12px] text-[15px] font-normal text-[#1a1d36] hover:bg-[#f4f6fb]"
        >
          Filter
        </button>
      )}
      {onExport && (
        <button
          type="button"
          onClick={onExport}
          className="h-[29px] shrink-0 rounded-[6px] border border-[#c9d2e0] bg-white px-[12px] text-[15px] font-normal text-[#1a1d36] hover:bg-[#f4f6fb]"
        >
          Export
        </button>
      )}
    </div>
  );
}

export function Sa51KvList({ rows }: { rows: readonly [string, ReactNode][] }) {
  return (
    <div className="flex flex-col">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-[10px] border-b border-[#e5eaf3] py-[6px] text-[15px] leading-snug text-[#1a1d36]">
          <span className="font-normal text-[#3b4256]">{k}</span>
          <span className="text-right font-normal text-[#1a1d36]">{v}</span>
        </div>
      ))}
    </div>
  );
}

export function Sa51ProgressBar({ label, pct, rightText }: { label: string; pct: number; rightText?: string }) {
  return (
    <div>
      <div className="mb-[3px] flex items-center justify-between text-[15px] font-normal text-[#1a1d36]">
        <span>{label}</span>
        <span>{rightText ?? `${pct}%`}</span>
      </div>
      <div className="h-[10px] w-full overflow-hidden rounded-[3px] bg-[#e0e7ef]">
        <div
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          className="h-full rounded-[3px] bg-[linear-gradient(90deg,#1a5bb1_0%,#429feb_100%)]"
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
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-[4px] overflow-x-auto pt-[2px]">
        {steps.map((step, i) => (
          <Fragment key={step}>
            {i > 0 && <ArrowRight strokeWidth={2} className="h-[13px] w-[13px] shrink-0 text-[#4f74b8]" />}
            <div
              className={`flex h-[46px] min-w-[110px] flex-1 items-center justify-center rounded-[7px] border px-[8px] text-center text-[15px] font-normal text-[#1a1d36] ${i % 2 === 1
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

export const sa51TableHead = "whitespace-nowrap border-b border-[#e3e7ef] bg-[#eff3fa] px-[10px] py-[5px] text-left text-[14.5px] font-medium text-[#4a5070]";
export const sa51TableRow = "even:bg-[#f8fafd] last:[&>td]:border-b-0 hover:bg-[#eef4ff]";
export const sa51TableCell = "whitespace-nowrap border-b border-[#eef1f6] px-[10px] py-[5px] text-[15px] font-normal text-[#1a1d36]";
