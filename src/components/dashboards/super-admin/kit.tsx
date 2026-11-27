"use client";

/**
 * Shared building blocks for the Super Admin module pages (SA-001 … SA-009).
 *
 * Layout: from `lg` up every page is drawn on the dashboard's design canvas
 * (1390 × 841 px content area right of the 210px sidebar, below the 60px top
 * bar) and the canvas zoom fits it to the window. Sizes in this file are
 * those design pixels (reference images × 1.15). Below `lg` the same blocks
 * stack in a normal responsive flow and wide tables scroll sideways.
 */

import Link from "next/link";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, CalendarDays, Check, ChevronDown, ChevronRight, Search, type LucideIcon } from "lucide-react";
import { Box, DashboardCanvas } from "@/components/dashboards/canvas";
import { PinSolid, Select, Today, formatDay, useSectionHref } from "@/components/dashboards/ui";
import EncodencyBadge from "@/components/ui/EncodencyBadge";
import { siteConfig } from "@/lib/config/site";

/* ---------------------------------- frame ---------------------------------- */

const SB = 210;

/** Super Admin page: sidebar + top bar + the page content and footer. */
export function SuperAdminFrame({ active, demoNote = false, children }: { active?: string; /** "DEMO DATA — Design reference only" in the footer centre. */ demoNote?: boolean; children: ReactNode }) {
  return (
    <DashboardCanvas role="super-admin" active={active}>
      <Box at={[SB, 60, 1600 - SB, 841]} as="div" fit="fluid" className="flex flex-col lg:px-[18px] lg:pt-[8px]">
        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-[7px]">{children}</div>
        <PageFooter demoNote={demoNote} />
      </Box>
    </DashboardCanvas>
  );
}

function PageFooter({ demoNote }: { demoNote: boolean }) {
  return (
    <footer className="relative z-10 mt-4 flex flex-col items-center gap-2 border-t border-[#e3e7ef] bg-white px-2 pt-3 text-[13px] font-semibold text-[#1d1f33] sm:flex-row sm:justify-between lg:mt-0 lg:h-[40px] lg:gap-0 lg:pt-0 lg:text-[14px]">
      <p className="whitespace-nowrap">
        © {siteConfig.copyrightYear} {siteConfig.trust}
        <span className="mx-[12px] inline-block h-[16px] w-[1.5px] translate-y-[3px] bg-[#3a3d55]" />
        <b className="font-bold text-[#0b0c36]">{siteConfig.name} CRM v1.0</b>
      </p>
      {demoNote && <p className="whitespace-nowrap text-[13px] font-medium text-[#3b4256]">DEMO DATA — Design reference only</p>}
      <p className="flex items-center whitespace-nowrap">
        Designed, Developed &amp; Maintained by
        <EncodencyBadge className="ml-[12px] h-[28px] min-w-[132px] px-2.5" nameClassName="text-[16px]" legalClassName="text-[7px]" sloganClassName="text-[5.5px]" />
      </p>
    </footer>
  );
}

/* ---------------------------------- tones ---------------------------------- */

export const tiles = {
  blue: { bg: "linear-gradient(180deg,#f6faff 0%,#deebff 100%)", border: "#d5e3fb", fg: "#1d5bd6" },
  green: { bg: "linear-gradient(180deg,#f5fcf4 0%,#dcf4d9 100%)", border: "#cfe9cd", fg: "#1f9a2b" },
  orange: { bg: "linear-gradient(180deg,#fffaf2 0%,#ffeccb 100%)", border: "#f6e0b5", fg: "#ef9a12" },
  red: { bg: "linear-gradient(180deg,#fff6f6 0%,#ffdfe0 100%)", border: "#f6caca", fg: "#e02424" },
  purple: { bg: "linear-gradient(180deg,#f9f6ff 0%,#e9e1ff 100%)", border: "#ddd2fa", fg: "#7a3fe0" },
  sky: { bg: "linear-gradient(180deg,#f4fafe 0%,#dbeefb 100%)", border: "#cde3f3", fg: "#1f7fd0" },
  pink: { bg: "linear-gradient(180deg,#fff6fa 0%,#fde3ee 100%)", border: "#f5d0df", fg: "#d6336c" },
} as const;
export type TileTone = keyof typeof tiles;

export const pills = {
  green: "bg-[#d4f3d2] text-[#1c6b1f]",
  red: "bg-[#fde0e0] text-[#b42318]",
  amber: "bg-[#fde9c4] text-[#8a5300]",
  yellow: "bg-[#fdf1c4] text-[#7a5b00]",
  blue: "bg-[#dde9fd] text-[#1d4fb8]",
  purple: "bg-[#e8e0fd] text-[#5b34c2]",
  pink: "bg-[#fde0ec] text-[#a3245a]",
  gray: "bg-[#e9ecf2] text-[#3b4256]",
  solidRed: "bg-[#e02424] text-white",
  solidAmber: "bg-[#f59e0b] text-white",
  solidBlue: "bg-[#1f5fc4] text-white",
} as const;
export type PillTone = keyof typeof pills;

/** Pill colour for the status / priority words used across the pages. */
export function toneFor(text: string): PillTone {
  const t = text.toLowerCase();
  if (/^(active|in service|connected|completed sewa|approved|operational|successful|ready)$/.test(t)) return "green";
  if (/^(high|open|failed|inactive|emergency|rejected)$/.test(t)) return "red";
  if (/^(medium|on the way|coming soon|delayed|to verify|pending)$/.test(t)) return "amber";
  if (/^(normal)$/.test(t)) return "green";
  if (/^(in progress|en route)$/.test(t)) return "blue";
  if (/^(scheduled)$/.test(t)) return "purple";
  if (/^(applied|verified|assigned|healthy|acknowledged|completed|verification complete|yes|enabled|on route|on track)$/.test(t)) return "green";
  if (/^(overdue|escalated|not received|no access)$/.test(t)) return "red";
  if (/^(under review|draft|pending approval|pending escalation|manual review|post-service follow-up|paused|restricted)$/.test(t)) return "amber";
  if (/^(new lead|low|view only)$/.test(t)) return "blue";
  if (/^(auto-assigned|team assigned|review|manage)$/.test(t)) return "purple";
  return "gray";
}

export function Pill({ tone, children, className = "" }: { tone: PillTone; children: ReactNode; className?: string }) {
  return (
    <span
      // default size only when the caller doesn't set one (two Tailwind height / size classes would conflict)
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-[9px] pt-px font-semibold leading-none ${/(^|\s)h-\[/.test(className) ? "" : "h-[20px]"} ${/(^|\s)text-\[\d/.test(className) ? "" : "text-[12px]"} ${pills[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Status / priority word in its pill colour. */
export const StatusPill = ({ children, className = "" }: { children: string; className?: string }) => (
  <Pill tone={toneFor(children)} className={className}>
    {children}
  </Pill>
);

/* ------------------------------- page heading ------------------------------ */

export function PageHead({
  icon: Icon,
  iconTone = "blue",
  title,
  links,
  children,
}: {
  icon?: LucideIcon;
  iconTone?: TileTone;
  title: string;
  links: string[];
  /** Controls on the right (date, centre, buttons). */
  children?: ReactNode;
}) {
  const t = tiles[iconTone];
  return (
    <div className="flex flex-col gap-3 lg:h-[50px] lg:flex-row lg:items-center lg:gap-[14px]">
      <div className="flex min-w-0 items-center gap-[12px]">
        {Icon && (
          <span style={{ background: t.bg, color: t.fg }} className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full">
            <Icon strokeWidth={1.9} className="h-[27px] w-[27px]" />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-[21px] font-bold leading-tight tracking-[-0.5px] text-[#0b0c36] lg:whitespace-nowrap lg:text-[24px] lg:leading-none">
            {title}
          </h1>
          <nav aria-label={`${title} sections`} className="mt-[5px] flex flex-wrap items-center gap-y-1 text-[13px] font-semibold leading-none text-[#141a4a] lg:flex-nowrap lg:text-[14px]">
            {links.map((l, i) => (
              <span key={l} className="flex items-center whitespace-nowrap">
                {i > 0 && <span className="mx-[10px] h-[13px] w-[1.3px] bg-[#2b2f4a]" />}
                {l}
              </span>
            ))}
          </nav>
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-[10px] lg:ml-auto lg:flex-nowrap">{children}</div>}
    </div>
  );
}

/* ------------------------------- KPI tiles -------------------------------- */

export function KpiRow({ cols, children }: { cols: number; children: ReactNode }) {
  return (
    <div style={{ "--cols": cols } as CSSProperties} className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:h-[70px] lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]">
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
  badge,
  caption,
}: {
  tone: TileTone;
  icon: LucideIcon;
  value: ReactNode;
  label: ReactNode;
  /** Small line under the label (e.g. "This Month ↑ +14%"). */
  sub?: ReactNode;
  /** Coloured status chip under the label. */
  badge?: { text: string; tone: PillTone };
  /** Small heading above the value (detail pages: "Case Stage" → "In Progress"). */
  caption?: ReactNode;
}) {
  const t = tiles[tone];
  return (
    <div style={{ background: t.bg, borderColor: t.border }} className="flex min-h-[66px] min-w-0 items-center gap-[8px] rounded-[11px] border px-[9px] py-[6px] shadow-[0_3px_9px_rgba(30,50,110,0.08)]">
      <Icon strokeWidth={1.9} style={{ color: t.fg }} className="h-[30px] w-[30px] shrink-0" />
      <div className="min-w-0 flex-1">
        {caption && <p className="mb-[3px] truncate text-[11.4px] font-semibold leading-none text-[#1a1d36]">{caption}</p>}
        <p className="whitespace-nowrap text-[22px] font-bold leading-none tracking-[-0.4px] text-[#0b0c36]">{value}</p>
        <p className="mt-[3px] text-[11.4px] font-semibold lg:truncate leading-[1.15] tracking-[-0.25px] text-[#1a1d36]">{label}</p>
        {sub && <div className="mt-[2px] text-[11px] lg:truncate font-semibold leading-none text-[#3b4256]">{sub}</div>}
        {badge && <Pill tone={badge.tone} className="mt-[4px] h-[17px] max-w-full px-[7px] text-[10px]">{badge.text}</Pill>}
      </div>
    </div>
  );
}

/** Green "↑ +14%" or red "↓ -10%" trend text. */
export function Trend({ value, down = false, suffix = "" }: { value: string; down?: boolean; suffix?: string }) {
  return (
    <span className={`whitespace-nowrap font-semibold ${down ? "text-[#d11f1f]" : "text-[#138a16]"}`}>
      {down ? "↓" : "↑"} {value}
      {suffix && <span className="font-medium text-[#3b4256]"> {suffix}</span>}
    </span>
  );
}

/* ---------------------------------- panel ---------------------------------- */

export function ViewLink({ to, children = "View All" }: { to: string; children?: ReactNode }) {
  const href = useSectionHref();
  return (
    <Link href={href(to)} className="flex shrink-0 items-center whitespace-nowrap text-[12.5px] font-semibold text-[#2320c4] hover:underline">
      <span className="pt-px">{children}</span>
      <ArrowRight strokeWidth={2.2} className="ml-[4px] h-[14px] w-[14px]" />
    </Link>
  );
}

export function Panel({
  title,
  note,
  icon: Icon,
  action,
  className = "",
  bodyClassName = "",
  children,
  label,
}: {
  title?: ReactNode;
  /** Lighter suffix after the title, e.g. "(This Month)". */
  note?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <section
      aria-label={label ?? (typeof title === "string" ? title : undefined)}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[12px] border border-[#e1e5ee] bg-white shadow-[0_3px_10px_rgba(30,50,110,0.07)] ${className}`}
    >
      {title && (
        <header className="flex items-center gap-[8px] px-[12px] pt-[9px]">
          {Icon && <Icon strokeWidth={2} className="h-[18px] w-[18px] shrink-0 text-[#0b0c36]" />}
          <h2 className="min-w-0 flex-1 text-[15.5px] font-bold leading-tight lg:truncate tracking-[-0.3px] text-[#0b0c36]">
            {title}
            {note && <span className="text-[13px] font-medium tracking-[-0.1px]"> {note}</span>}
          </h2>
          {action}
        </header>
      )}
      {/* Never clip: if content is ever taller/wider than the panel it scrolls inside it. */}
      <div className={`min-h-0 flex-1 overflow-auto overscroll-contain px-[12px] pb-[10px] pt-[6px] [scrollbar-width:thin] ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/* ----------------------------------- tabs ---------------------------------- */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  icons,
  className = "",
}: {
  tabs: readonly T[];
  value: T;
  onChange: (t: T) => void;
  icons?: Partial<Record<T, LucideIcon>>;
  className?: string;
}) {
  return (
    <div role="tablist" className={`flex gap-[6px] overflow-x-auto rounded-[10px] border border-[#e1e5ee] bg-white p-[3px] shadow-[0_2px_6px_rgba(30,50,110,0.06)] ${className}`}>
      {tabs.map((t) => {
        const Icon: LucideIcon | undefined = icons?.[t];
        const on = t === value;
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t)}
            className={`flex h-[28px] shrink-0 items-center justify-center gap-[7px] whitespace-nowrap rounded-[8px] px-[12px] text-[13px] font-semibold transition-colors lg:flex-1 lg:px-[8px] ${
              on ? "bg-[#1d4fe0] text-white" : "text-[#1a1d36] hover:bg-[#f1f4fb]"
            }`}
          >
            {Icon && <Icon strokeWidth={2} className="h-[16px] w-[16px] shrink-0" />}
            <span className="pt-px">{t}</span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- controls -------------------------------- */

export function SearchField({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder: string; className?: string }) {
  return (
    <label className={`flex h-[34px] items-center rounded-[9px] border border-[#cfd5e2] bg-white px-[10px] shadow-[0_1px_3px_rgba(30,50,110,0.06)] focus-within:border-[#5b6fe0] ${className}`}>
      <Search strokeWidth={2.3} className="h-[16px] w-[16px] shrink-0 text-[#0b0c36]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="ml-[8px] h-full min-w-0 flex-1 bg-transparent pt-[2px] text-[13px] font-medium outline-none placeholder:text-[#4a5070]"
      />
    </label>
  );
}

/** Small dropdown (working option list) with a fixed box size. */
export function Dropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  className = "w-[140px]",
  size = 13,
  icon,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  className?: string;
  size?: number;
  icon?: ReactNode;
}) {
  return (
    <div className={`h-[34px] shrink-0 ${className}`}>
      <Select label={label} value={value} options={options} onChange={onChange} size={size} icon={icon} className="h-full" />
    </div>
  );
}

/** Date chip with a working native date picker. */
export function DateChip({ className = "w-[190px]" }: { className?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState("");
  return (
    <div className={`relative h-[34px] shrink-0 ${className}`}>
      <button
        type="button"
        aria-label="Choose date"
        onClick={() => {
          try {
            input.current?.showPicker();
          } catch {
            input.current?.focus();
          }
        }}
        className="flex h-full w-full items-center gap-[9px] rounded-[8px] border border-[#d6dbe6] bg-white px-[11px] text-[13.5px] font-semibold text-[#0b0c36] shadow-[0_1px_3px_rgba(30,50,110,0.08)]"
      >
        <CalendarDays strokeWidth={2} className="h-[18px] w-[18px] shrink-0" />
        <span className="min-w-0 flex-1 truncate pt-px text-left">{picked ? formatDay(new Date(`${picked}T00:00`)) : <Today />}</span>
        <ChevronDown strokeWidth={2.4} className="h-[15px] w-[15px] shrink-0" />
      </button>
      <input ref={input} type="date" tabIndex={-1} aria-hidden value={picked} onChange={(e) => setPicked(e.target.value)} className="pointer-events-none absolute bottom-0 left-0 h-0 w-full opacity-0" />
    </div>
  );
}

export const centreOptions = ["All Centres", "Ghaziabad", "Delhi (Coming Soon)", "Noida (Coming Soon)"] as const;

export function CentreDropdown({ className = "w-[170px]" }: { className?: string }) {
  const [v, setV] = useState<(typeof centreOptions)[number]>("All Centres");
  return <Dropdown label="Centre" value={v} options={centreOptions} onChange={setV} className={className} icon={<span className="mr-[8px] shrink-0"><PinSolid size={17} /></span>} />;
}

export function PrimaryButton({ icon: Icon, children, onClick, outline = false, className = "" }: { icon?: LucideIcon; children: ReactNode; onClick?: () => void; outline?: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[34px] shrink-0 items-center justify-center gap-[7px] whitespace-nowrap rounded-[8px] px-[14px] text-[13.5px] font-semibold transition-colors ${
        outline
          ? "border-[1.5px] border-[#2f4fe0] bg-white text-[#1d3fc4] hover:bg-[#f1f4ff]"
          : "bg-[#1d4fe0] text-white shadow-[0_3px_8px_rgba(29,79,224,0.3)] hover:bg-[#1840c0]"
      } ${className}`}
    >
      {Icon && <Icon strokeWidth={2.3} className="h-[16px] w-[16px]" />}
      <span className="pt-px">{children}</span>
    </button>
  );
}

export function Checkbox({ checked, onChange, label, disabled = false, className = "" }: { checked: boolean; onChange?: (v: boolean) => void; label?: ReactNode; disabled?: boolean; className?: string }) {
  return (
    <label className={`flex items-center gap-[8px] ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${className}`}>
      <span className="relative inline-flex h-[15px] w-[15px] shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          aria-label={typeof label === "string" ? label : undefined}
          className="peer h-[15px] w-[15px] cursor-[inherit] appearance-none rounded-[3px] border-[1.5px] border-[#5b6280] bg-white checked:border-[#1d4fe0] checked:bg-[#1d4fe0]"
        />
        <Check strokeWidth={3.4} className="pointer-events-none absolute inset-[2px] hidden h-[11px] w-[11px] text-white peer-checked:block" />
      </span>
      {label && <span className="text-[13px] font-medium leading-tight">{label}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[18px] w-[32px] shrink-0 rounded-full transition-colors ${checked ? "bg-[#1f9a2b]" : "bg-[#c4cad6]"}`}
    >
      <span className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow transition-[left] ${checked ? "left-[16px]" : "left-[2px]"}`} />
    </button>
  );
}

/* ---------------------------------- tables --------------------------------- */

export const th = "whitespace-nowrap px-[8px] py-[7px] text-left text-[12.5px] font-bold text-[#0b0c36]";
export const td = "whitespace-nowrap px-[8px] py-[6px] text-[12.8px] font-medium text-[#1a1d36]";

/** Wide table wrapper: scrolls sideways on small screens. */
export function TableWrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-max border-collapse">{children}</table>
    </div>
  );
}

export const Thead = ({ children }: { children: ReactNode }) => (
  <thead>
    <tr className="bg-[#eef1f7] [&>th:first-child]:rounded-l-[6px] [&>th:last-child]:rounded-r-[6px]">{children}</tr>
  </thead>
);

/** Prev / page numbers / Next with a working current page. */
export function Pager({ page, pages, onChange, shown = 5 }: { page: number; pages: number; onChange: (p: number) => void; shown?: number }) {
  const nums = pages <= shown + 1 ? Array.from({ length: pages }, (_, i) => i + 1) : [...Array.from({ length: shown }, (_, i) => i + 1), -1, pages];
  const btn = "flex h-[28px] min-w-[28px] items-center justify-center rounded-[7px] border border-[#d6dbe6] bg-white px-[8px] pt-px text-[12.5px] font-semibold text-[#1a1d36] hover:bg-[#f1f4fb] disabled:cursor-not-allowed disabled:opacity-50";
  return (
    <nav aria-label="Pagination" className="flex items-center gap-[6px]">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} className={btn}>‹ Prev</button>
      {nums.map((n, i) =>
        n < 0 ? (
          <span key={`gap${i}`} className="px-[2px] text-[12.5px]">…</span>
        ) : (
          <button key={n} type="button" aria-current={n === page ? "page" : undefined} onClick={() => onChange(n)} className={`${btn} ${n === page ? "!border-[#1d4fe0] !bg-[#1d4fe0] !text-white" : ""}`}>
            {n}
          </button>
        ),
      )}
      <button type="button" disabled={page === pages} onClick={() => onChange(page + 1)} className={btn}>Next ›</button>
    </nav>
  );
}

/** Row in a "label … value" list. */
export function KV({ k, v, icon, className = "" }: { k: ReactNode; v: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-[8px] text-[13px] ${className}`}>
      {icon}
      <span className="min-w-0 flex-1 truncate font-medium text-[#1a1d36]">{k}</span>
      <span className="shrink-0 whitespace-nowrap font-bold text-[#0b0c36]">{v}</span>
    </div>
  );
}

/** Lightweight in-page notice (placeholder actions say what would happen). */
export function useNotice() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg((cur) => (cur === m ? null : cur)), 3500);
  };
  const node = msg ? (
    <div role="status" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-[10px] bg-[#0b0c36] px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      {msg}
    </div>
  ) : null;
  return { show, node };
}

/* ------------------------------- quick actions ------------------------------ */

export type QuickItem = { icon: LucideIcon; label: string; color?: string; href?: string; onClick?: () => void };

/** Bordered action rows with a chevron (right-hand "Quick Actions" panels). */
export function QuickList({ items, className = "" }: { items: QuickItem[]; className?: string }) {
  return (
    <div className={`flex h-full flex-col gap-[4px] ${className}`}>
      {items.map((a) => {
        const body = (
          <>
            <a.icon strokeWidth={2} style={{ color: a.color ?? "#2f6fe0" }} className="h-[18px] w-[18px] shrink-0" />
            <span className="min-w-0 flex-1 text-[13px] font-semibold leading-tight">{a.label}</span>
            <ChevronRight strokeWidth={2.4} className="h-[15px] w-[15px] shrink-0" />
          </>
        );
        const cls = "flex min-h-[28px] flex-1 items-center gap-[10px] rounded-[8px] border border-[#e3e7ef] bg-[#f8faff] px-[10px] text-left hover:bg-[#eef2fc]";
        return a.href ? (
          <Link key={a.label} href={a.href} className={cls}>{body}</Link>
        ) : (
          <button key={a.label} type="button" onClick={a.onClick} className={cls}>{body}</button>
        );
      })}
    </div>
  );
}

/** Compact table cell / header classes for dense lists. */
export const thS = "whitespace-nowrap px-[6px] py-[4px] text-left text-[11.8px] font-bold leading-[15px] text-[#0b0c36]";
export const tdS = "whitespace-nowrap px-[6px] py-[2px] text-[12px] font-medium leading-[16px] text-[#1a1d36]";
