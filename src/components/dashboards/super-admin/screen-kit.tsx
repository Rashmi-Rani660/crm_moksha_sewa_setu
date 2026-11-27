"use client";

/**
 * Building blocks of the SA-011 … SA-020 screens (Sewa Setu-SA011-020 design
 * book). Same visual language as `RegisterScreen` (SA-041 … SA-050): heading
 * with the screen picker and DEMO DATA tag, pastel KPI tiles with
 * "Demo snapshot", a full-width tab bar and light panels.
 *
 * Sizes are design pixels on the Super Admin canvas (reference images × 0.8);
 * below `lg` the blocks stack and wide tables scroll sideways.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, Bell, ChevronDown, CircleCheck, MapPin, Network, Radio, Users, type LucideIcon } from "lucide-react";
import { SuperAdminFrame } from "@/components/dashboards/super-admin/kit";

export const ink = "text-[#1a1d36]";

/* ---------------------------------- shell ---------------------------------- */

export type Kpi = { value: string; label: string };
type Picker = readonly { code: string; title: string; href: string }[];

const kpiIcons: LucideIcon[] = [Radio, Bell, CircleCheck, Users, Network, MapPin];
const kpiTones = [
  { bg: "linear-gradient(180deg,#ecf5fe 0%,#e3effc 100%)", border: "#c6d9ef", fg: "#1f6fd6" },
  { bg: "linear-gradient(180deg,#ecfaee 0%,#e2f5e6 100%)", border: "#c4e4cb", fg: "#1f8a34" },
  { bg: "linear-gradient(180deg,#fff7e7 0%,#fff1d9 100%)", border: "#f3dcaf", fg: "#e59410" },
  { bg: "linear-gradient(180deg,#f4f0fd 0%,#eee8fb 100%)", border: "#dacff4", fg: "#7a4fe0" },
  { bg: "linear-gradient(180deg,#ecf5fe 0%,#e3effc 100%)", border: "#c6d9ef", fg: "#1f6fd6" },
  { bg: "linear-gradient(180deg,#ecfaee 0%,#e2f5e6 100%)", border: "#c4e4cb", fg: "#1f8a34" },
];

export function Screen({
  code,
  title,
  active,
  picker,
  kpis,
  tabs,
  tab,
  onTab,
  children,
}: {
  code: string;
  title: string;
  /** Sidebar row to highlight (slug). */
  active: string;
  picker: Picker;
  kpis: Kpi[];
  tabs: readonly string[];
  tab: string;
  onTab: (t: string) => void;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <SuperAdminFrame active={active}>
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-0">
        {/* heading */}
        <div className="flex flex-col gap-3 lg:h-[46px] lg:shrink-0 lg:flex-row lg:items-start lg:gap-[12px]">
          <div className="flex min-w-0 items-start gap-[8px]">
            <Radio strokeWidth={2.2} className="mt-[6px] h-[24px] w-[24px] shrink-0 text-[#1f4fd0]" aria-hidden />
            <div className="min-w-0">
              <h1 className={`text-[19px] font-medium leading-tight tracking-[-0.2px] lg:whitespace-nowrap lg:text-[20.5px] ${ink}`}>
                {title}
              </h1>
              <p className={`mt-[2px] text-[13px] ${ink}`}>Super Admin / FY 2026–27 / Ghaziabad</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-[10px] lg:ml-auto lg:mt-[4px] lg:flex-nowrap">
            <span className="flex h-[25px] items-center rounded-[4px] border border-[#ecd8a0] bg-[#fff1c9] px-[9px] pt-px text-[12px] font-medium text-[#6b5200]">
              DEMO DATA
            </span>
            <label className="relative block h-[30px] w-full sm:w-[304px]">
              <span className="sr-only">Open screen</span>
              <select
                value={code}
                onChange={(e) => {
                  const next = picker.find((s) => s.code === e.target.value);
                  if (next) router.push(next.href);
                }}
                className={`h-full w-full cursor-pointer appearance-none truncate rounded-[6px] border border-[#c9d2e0] bg-white pl-[12px] pr-[30px] pt-px text-[13.3px] shadow-[0_1px_2px_rgba(20,45,90,0.06)] outline-none focus:border-[#5b7fe0] ${ink}`}
              >
                {picker.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} · {s.title}
                  </option>
                ))}
              </select>
              <ChevronDown strokeWidth={2.6} className="pointer-events-none absolute right-[9px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#1a1d36]" aria-hidden />
            </label>
          </div>
        </div>

        {/* KPI tiles */}
        <div
          style={{ "--n": kpis.length } as CSSProperties}
          className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:mt-[4px] lg:h-[78px] lg:shrink-0 lg:gap-[11px] lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
        >
          {kpis.map((k, i) => {
            const t = kpiTones[i];
            const Icon = kpiIcons[i];
            return (
              <div key={k.label} style={{ background: t.bg, borderColor: t.border }} className="flex min-h-[72px] min-w-0 items-center gap-[10px] rounded-[8px] border px-[12px] shadow-[0_1px_3px_rgba(20,45,90,0.06)]">
                <Icon strokeWidth={2} style={{ color: t.fg }} className="h-[30px] w-[30px] shrink-0" aria-hidden />
                <div className="min-w-0">
                  <p className={`whitespace-nowrap text-[23px] font-medium leading-none tracking-[-0.3px] ${ink}`}>{k.value}</p>
                  <p className={`mt-[3px] truncate text-[13.3px] leading-[16px] ${ink}`}>{k.label}</p>
                  <p className="truncate text-[11.6px] leading-[14px] text-[#4a5468]">Demo snapshot</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* tabs */}
        <div role="tablist" aria-label={`${title} views`} className="flex overflow-x-auto rounded-[6px] border border-[#d9e1eb] bg-white lg:mt-[11px] lg:h-[36px] lg:shrink-0">
          {tabs.map((t, i) => {
            const on = t === tab;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => onTab(t)}
                className={`h-[34px] min-w-[130px] flex-1 whitespace-nowrap px-[10px] pt-px text-[13.4px] lg:h-full lg:min-w-0 ${i > 0 ? "border-l border-[#d9e1eb]" : ""} ${
                  on ? "border-l-0 bg-[linear-gradient(90deg,#086eed_0%,#093cdd_100%)] text-white" : `${ink} hover:bg-[#f3f6fc]`
                } ${i === 0 ? "rounded-l-[5px]" : ""} ${i === tabs.length - 1 ? "rounded-r-[5px]" : ""}`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="flex min-h-0 flex-col gap-3 lg:mt-[12px] lg:flex-1">{children}</div>
      </div>
    </SuperAdminFrame>
  );
}

/** Left (wide) and right column of the body; `rows` sets each column's split. */
export function Columns({ children }: { children: ReactNode }) {
  return <div className="grid min-h-0 grid-cols-1 gap-3 lg:flex-1 lg:[grid-template-columns:1125fr_560fr] lg:gap-[13px]">{children}</div>;
}

/** A column of panels; `top` fixes the first panel's height (design px), the rest share the space. */
export function Col({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex min-h-0 min-w-0 flex-col gap-3 lg:gap-[13px] ${className}`}>{children}</div>;
}

/* ---------------------------------- panel ---------------------------------- */

export function Panel({ title, children, h, className = "", bodyClassName = "" }: { title: ReactNode; children: ReactNode; h?: number; className?: string; bodyClassName?: string }) {
  return (
    <section
      aria-label={typeof title === "string" ? title : undefined}
      style={h ? ({ "--h": `${h}px` } as CSSProperties) : undefined}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[7px] border border-[#d6deea] bg-[#f8fbff] shadow-[0_1px_4px_rgba(20,45,90,0.08)] ${h ? "lg:h-[var(--h)] lg:shrink-0" : "lg:flex-1"} ${className}`}
    >
      <h2 className={`flex h-[34px] shrink-0 items-center border-b border-[#e0e8f2] bg-[#fbfcfe] px-[12px] pt-px text-[14.6px] font-medium ${ink}`}>{title}</h2>
      {/* never clip: content taller than the panel scrolls inside it */}
      <div className={`min-h-0 flex-1 overflow-auto overscroll-contain px-[12px] pb-[10px] pt-[8px] [scrollbar-width:thin] ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/* ---------------------------------- pills ---------------------------------- */

const pillTones = {
  green: "bg-[#d5f3d7] text-[#247537]",
  amber: "bg-[#ffeabd] text-[#8a5b00]",
  red: "bg-[#fde0de] text-[#c0302b]",
  blue: "bg-[#e0efff] text-[#2b5fb0]",
  grey: "bg-[#e9edf3] text-[#3b4256]",
} as const;
export type PillTone = keyof typeof pillTones;

/** Colour by word, as in the designs. */
export function toneOf(text: string): PillTone {
  const t = text.toLowerCase();
  if (/^(active|clear|verified|completed|connected|available|yes|within sla|published|synced)$/.test(t)) return "green";
  if (/^(critical)$/.test(t)) return "red";
  if (/^(high|normal|low|assigned|in progress|delayed|out of coverage|awaiting acceptance|review)$/.test(t)) return "blue";
  return "amber";
}

export function Pill({ children, tone }: { children: string; tone?: PillTone }) {
  return (
    <span className={`inline-flex h-[20px] items-center whitespace-nowrap rounded-full px-[9px] pt-px text-[12.4px] font-medium leading-none ${pillTones[tone ?? toneOf(children)]}`}>
      {children}
    </span>
  );
}

/* --------------------------------- buttons --------------------------------- */

const primaryBtn =
  "flex h-[29px] shrink-0 items-center whitespace-nowrap rounded-[6px] bg-[linear-gradient(90deg,#086eed_0%,#093cdd_100%)] px-[12px] pt-px text-[13.2px] font-medium text-white shadow-[0_1px_3px_rgba(9,60,221,0.3)] hover:brightness-110";
const outlineBtn =
  "flex h-[29px] shrink-0 items-center whitespace-nowrap rounded-[6px] border border-[#a9bddf] bg-white px-[11px] pt-px text-[13.2px] font-medium text-[#1e43a8] hover:bg-[#f1f5fd]";

export function Btn({ children, primary = false, onClick, href, className = "" }: { children: ReactNode; primary?: boolean; onClick?: () => void; href?: string; className?: string }) {
  const cls = `${primary ? primaryBtn : outlineBtn} ${className}`;
  return href ? (
    <Link href={href} className={cls}>{children}</Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{children}</button>
  );
}

export function Buttons({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mt-[10px] flex flex-wrap gap-[8px] ${className}`}>{children}</div>;
}

/* ---------------------------------- lists ---------------------------------- */

export type KVRow = readonly [ReactNode, ReactNode];

export function KVList({ rows, rowH = 28 }: { rows: readonly KVRow[]; rowH?: number }) {
  return (
    <dl>
      {rows.map(([k, v], i) => (
        <div key={i} style={{ height: rowH }} className={`flex items-center gap-[12px] border-b border-[#e1e7f0] text-[13.3px] ${ink}`}>
          <dt className="min-w-0 flex-1 truncate pt-px">{k}</dt>
          <dd className="shrink-0 whitespace-nowrap pt-px text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Small blue-grey sub-heading inside a panel ("Selected case stages", "Verification history"). */
export const SubLabel = ({ children }: { children: ReactNode }) => <p className="pt-[6px] text-[13px] text-[#3c55a0]">{children}</p>;

export function Meter({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className={`flex items-center justify-between gap-[10px] text-[13.3px] leading-[18px] ${ink}`}>
        <span className="truncate">{label}</span>
        <span className="shrink-0 whitespace-nowrap">{value}</span>
      </div>
      <div role="meter" aria-label={label} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="mt-[3px] h-[10px] overflow-hidden rounded-[2px] bg-[#e0e7ef]">
        <div style={{ width: `${pct}%` }} className="h-full bg-[linear-gradient(90deg,#1a5bb1_0%,#429feb_100%)]" />
      </div>
    </div>
  );
}

/* ---------------------------------- table ---------------------------------- */

export function DataTable({
  head,
  rows,
  rowH = 36,
  onRow,
  selected,
  empty = "No records match these filters.",
  pills = [],
}: {
  head: string[];
  rows: { key: string; cells: ReactNode[] }[];
  rowH?: number;
  onRow?: (key: string) => void;
  selected?: string;
  empty?: string;
  /** Column indexes whose text is shown as a coloured pill. */
  pills?: number[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max border-collapse">
        <thead>
          <tr className="h-[29px] bg-[#e2e9f4]">
            {head.map((h) => (
              <th key={h} scope="col" className={`whitespace-nowrap px-[8px] pt-px text-left text-[13px] font-medium ${ink}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.key}
              style={{ height: rowH }}
              onClick={onRow ? () => onRow(r.key) : undefined}
              className={`border-b border-[#dce4ee] ${onRow ? "cursor-pointer hover:bg-[#eef3fb]" : ""} ${selected === r.key ? "bg-[#e9f0fc]" : ""}`}
            >
              {r.cells.map((c, i) => (
                <td key={i} className={`whitespace-nowrap px-[8px] pt-px text-[13.3px] ${ink}`}>{typeof c === "string" && pills.includes(i) && c !== "–" ? <Pill>{c}</Pill> : c}</td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr style={{ height: rowH }} className="border-b border-[#dce4ee]">
              <td colSpan={head.length} className="px-[8px] text-[13.3px] text-[#4a5468]">{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------------- filters --------------------------------- */

export function SearchInput({ value, onChange, className = "" }: { value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search records..."
      aria-label="Search records"
      className={`h-[32px] min-w-0 rounded-[6px] border border-[#c9d2e0] bg-white px-[11px] pt-px text-[13.3px] outline-none placeholder:text-[#6b7488] focus:border-[#5b7fe0] ${ink} ${className}`}
    />
  );
}

export function NativeSelect<T extends string>({ value, options, onChange, label, className = "", disabled = false }: { value: T; options: readonly T[]; onChange: (v: T) => void; label: string; className?: string; disabled?: boolean }) {
  return (
    <label className={`relative block h-[32px] shrink-0 ${className}`}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as T)}
        className={`h-full w-full cursor-pointer appearance-none rounded-[6px] border border-[#c9d2e0] bg-white pl-[11px] pr-[28px] pt-px text-[13.3px] outline-none focus:border-[#5b7fe0] disabled:cursor-default disabled:bg-[#eef1f6] ${ink}`}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown strokeWidth={2.6} className="pointer-events-none absolute right-[8px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#1a1d36]" aria-hidden />
    </label>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="mb-[10px] flex flex-wrap items-center gap-[8px] lg:flex-nowrap">{children}</div>;
}

/** Search + dropdown filters with working state; `match` decides each row. */
export function useFilters<F extends Record<string, string>>(initial: F) {
  const [q, setQ] = useState("");
  const [f, setF] = useState(initial);
  const set = (k: keyof F) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const reset = () => {
    setQ("");
    setF(initial);
  };
  const text = (...parts: string[]) => !q.trim() || parts.join(" ").toLowerCase().includes(q.trim().toLowerCase());
  return { q, setQ, f, set, reset, text };
}

/* ---------------------------------- forms ---------------------------------- */

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className={`mb-[3px] text-[13.3px] leading-[16px] ${ink}`}>{label}</p>
      {children}
    </div>
  );
}

export function TextBox({ value, onChange, readOnly = false, label }: { value: string; onChange?: (v: string) => void; readOnly?: boolean; label: string }) {
  return (
    <input
      value={value}
      readOnly={readOnly}
      aria-label={label}
      onChange={(e) => onChange?.(e.target.value)}
      className={`h-[32px] w-full rounded-[6px] border px-[11px] pt-px text-[13.3px] outline-none ${ink} ${readOnly ? "border-[#d6dde8] bg-[#eef1f6]" : "border-[#c9d2e0] bg-white focus:border-[#5b7fe0]"}`}
    />
  );
}

export function Check({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={`flex h-[26px] items-center gap-[10px] text-[13.3px] ${ink} ${disabled ? "cursor-default" : "cursor-pointer"}`}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} className="h-[15px] w-[15px] shrink-0 accent-[#1561e8] disabled:opacity-60" />
      <span className="pt-px">{label}</span>
    </label>
  );
}

/* ---------------------------------- flow ----------------------------------- */

/** Numbered process boxes joined by arrows (alternating blue / green). */
export function Flow({ steps, h = 62 }: { steps: string[]; h?: number }) {
  return (
    <div className="flex items-center gap-[4px] overflow-x-auto pb-[2px]">
      {steps.map((s, i) => (
        <Fragment key={s}>
          {i > 0 && <ArrowRight strokeWidth={2} className="h-[14px] w-[14px] shrink-0 text-[#2b5fb0]" aria-hidden />}
          <div
            style={{ height: h }}
            className={`flex min-w-[92px] flex-1 flex-col items-center justify-center rounded-[6px] border text-center shadow-[0_1px_3px_rgba(20,45,90,0.06)] ${
              i % 2 ? "border-[#cfe4d6] bg-[linear-gradient(180deg,#f7fdf8_0%,#eaf6ee_100%)]" : "border-[#c9d8ee] bg-[linear-gradient(180deg,#f4f9ff_0%,#e6f0fc_100%)]"
            }`}
          >
            <span className="text-[11.4px] leading-none text-[#3c55a0]">{String(i + 1).padStart(2, "0")}</span>
            <span className={`mt-[5px] px-[4px] text-[13.3px] leading-[16px] ${ink}`}>{s}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
