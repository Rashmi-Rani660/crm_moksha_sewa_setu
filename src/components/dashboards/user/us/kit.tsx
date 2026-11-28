"use client";

/**
 * Shared pieces for the User screens US-001 … US-010 (design book "US-001 to US-010").
 * Uses the existing user sidebar, top bar and footer unchanged; only the page body is drawn here.
 * All values are demo data.
 */

import type { ReactNode } from "react";
import { ArrowRight, Check, ChevronDown, Search } from "lucide-react";
import { Box, DashboardCanvas } from "@/components/dashboards/canvas";
import EncodencyBadge from "@/components/ui/EncodencyBadge";
import { siteConfig } from "@/lib/config/site";
import { Panel, Pill, TableWrap, Thead, th, td, tiles, toneFor, type PillTone, type TileTone } from "@/components/dashboards/super-admin/kit";
import { ScreenSwitch } from "@/components/dashboards/super-admin/screen-switch";
import { userScreens } from "./routes";

const SB = 210;

/* ---------------------------------- frame ---------------------------------- */

export function UserFrame({ code, active, title, children }: { code: string; active?: string; title: string; children: ReactNode }) {
  const own = userScreens.find((s) => s.code === code);
  const siblings = userScreens.filter((s) => s.group === own?.group);
  return (
    <DashboardCanvas role="user" active={active}>
      <Box at={[SB, 60, 1600 - SB, 841]} as="div" fit="fluid" className="flex flex-col lg:px-[18px] lg:pb-[6px] lg:pt-[10px]">
        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-[10px]">
          <div className="flex flex-col gap-3 lg:h-[50px] lg:shrink-0 lg:flex-row lg:items-start lg:gap-[14px]">
            <div className="min-w-0">
              <h1 className="text-[21px] font-medium leading-tight tracking-[-0.5px] text-[#0b0c36] lg:whitespace-nowrap lg:text-[24px] lg:leading-none">{title}</h1>
              <p className="mt-[5px] text-[15px] font-normal leading-none text-[#141a4a] lg:text-[16px]">User 07 / FY 2026–27 / Ghaziabad • My authorised work</p>
            </div>
            <div className="flex flex-wrap items-center gap-[10px] lg:ml-auto lg:flex-nowrap">
              <span className="flex h-[32px] shrink-0 items-center rounded-[7px] border border-[#ecd48a] bg-[#fff4d1] px-[12px] pt-px text-[13px] font-semibold tracking-[0.2px] text-[#8a5300]">DEMO DATA</span>
              <ScreenSwitch current={code} screens={siblings} />
            </div>
          </div>
          {children}
        </div>
        <PageFooter />
      </Box>
    </DashboardCanvas>
  );
}

/** Footer as in the design: copyright + version left, enCodency right. */
function PageFooter() {
  return (
    <footer className="relative z-10 mt-4 flex flex-col items-center gap-2 border-t border-[#e3e7ef] bg-white px-2 pt-3 text-[15px] font-semibold text-[#1d1f33] sm:flex-row sm:justify-between lg:mt-[8px] lg:h-[40px] lg:shrink-0 lg:gap-0 lg:pt-0 lg:text-[16px]">
      <p className="whitespace-nowrap">
        © {siteConfig.copyrightYear} {siteConfig.trust}
        <span className="mx-[12px] inline-block h-[16px] w-[1.5px] translate-y-[3px] bg-[#3a3d55]" />
        <b className="font-bold text-[#0b0c36]">{siteConfig.name} CRM v1.0</b>
      </p>
      <p className="flex flex-wrap items-center justify-center gap-y-1 sm:whitespace-nowrap">
        Designed, Developed &amp; Maintained by
        <EncodencyBadge className="ml-[12px] h-[28px] min-w-[132px] px-2.5" nameClassName="text-[16px]" legalClassName="text-[11px]" sloganClassName="text-[9.5px]" />
      </p>
    </footer>
  );
}

/* ---------------------------------- tiles ---------------------------------- */

export type Tile = { value: string; label: string; tone: TileTone };

export function Tiles({ items }: { items: Tile[] }) {
  return (
    <div
      className={`grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:h-[76px] lg:shrink-0 lg:gap-[12px] ${
        items.length === 4 ? "lg:grid-cols-4" : items.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-6"
      }`}
    >
      {items.map((t) => {
        const c = tiles[t.tone];
        return (
          <div key={t.label} style={{ background: c.bg, borderColor: c.border }} className="flex min-h-[68px] min-w-0 flex-col justify-center rounded-[11px] border px-[14px] py-[8px] shadow-[0_3px_9px_rgba(30,50,110,0.08)]">
            <p className="truncate text-[22px] font-bold leading-none tracking-[-0.4px] text-[#0b0c36]">{t.value}</p>
            <p className="mt-[4px] truncate text-[15.4px] font-semibold leading-[1.15] tracking-[-0.25px] text-[#1a1d36]">{t.label}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------- panel ---------------------------------- */

export function Card({ title, children, className = "", bodyClassName = "" }: { title: string; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <Panel title={title} className={className} bodyClassName={bodyClassName}>
      {children}
    </Panel>
  );
}

/* --------------------------------- buttons --------------------------------- */

const btnBase = "inline-flex h-[32px] shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] border-[1.5px] px-[12px] pt-px text-[14.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";
export const btnSolid = `${btnBase} border-[#1d4fe0] bg-[#1d4fe0] text-white hover:bg-[#1840c0]`;
export const btnOutline = `${btnBase} border-[#2f4fe0] bg-white text-[#1d3fc4] hover:bg-[#f1f4ff]`;

export function Btn({ children, onClick, solid = false, disabled = false, className = "" }: { children: ReactNode; onClick?: () => void; solid?: boolean; disabled?: boolean; className?: string }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={`${solid ? btnSolid : btnOutline} ${className}`}>
      {children}
    </button>
  );
}

export function Btns({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-wrap gap-[8px] ${className}`}>{children}</div>;
}

/* ---------------------------------- pills ---------------------------------- */

export const tone = (text: string): PillTone => {
  const t = text.toLowerCase();
  if (/^(verified|active|uploaded|present|connected|completed)$/.test(t)) return "green";
  if (/^(new|scheduled|meeting|in service)$/.test(t)) return "blue";
  if (/^(due|ack due|review|pending|accept pending|clearance pending|unread|missing|draft)$/.test(t)) return "amber";
  if (/^(overdue|critical|urgent|emergency|blocked|yes)$/.test(t)) return "red";
  if (/^(high)$/.test(t)) return "red";
  return toneFor(text);
};

export function P({ children }: { children: string }) {
  return <Pill tone={tone(children)} className="h-[20px] text-[14px] font-semibold">{children}</Pill>;
}

/** A cell / value: text starting with `*` is drawn as a pill. */
export function V({ v }: { v: ReactNode }) {
  return typeof v === "string" && v.startsWith("*") ? <P>{v.slice(1)}</P> : <>{v}</>;
}

/* ---------------------------------- lists ---------------------------------- */

export function Lines({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <ul className="flex flex-col">
      {rows.map(([k, v]) => (
        <li key={k} className="flex min-h-[28px] items-center gap-[10px] border-b border-[#eef0f5] py-[3px] text-[15px] text-[#1a1d36] last:border-b-0">
          <span className="min-w-0 flex-1 truncate font-medium">{k}</span>
          <span className="shrink-0 whitespace-nowrap text-right font-bold text-[#0b0c36]">
            <V v={v} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Note({ children, boxed = false, className = "" }: { children: ReactNode; boxed?: boolean; className?: string }) {
  return (
    <p
      className={`text-[14.5px] font-medium leading-[1.55] text-[#1a1d36] ${
        boxed ? "rounded-[8px] border border-[#d6dbe6] bg-[#f8faff] px-[14px] py-[12px]" : "rounded-[6px] bg-[#eef3fb] px-[10px] py-[5px] text-[14px]"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/* ---------------------------------- table ---------------------------------- */

export function Table({
  cols,
  rows,
  selected,
  onSelect,
}: {
  cols: string[];
  rows: ReactNode[][];
  selected?: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <TableWrap>
      <Thead>
        {cols.map((c) => (
          <th key={c} className={th}>{c}</th>
        ))}
      </Thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={cols.length} className={`${td} py-[14px] text-center text-[#5b6a8a]`}>No records match.</td>
          </tr>
        )}
        {rows.map((r, i) => (
          <tr
            key={i}
            tabIndex={onSelect ? 0 : undefined}
            aria-selected={onSelect ? selected === i : undefined}
            onClick={onSelect ? () => onSelect(i) : undefined}
            onKeyDown={onSelect ? (e) => e.target === e.currentTarget && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(i)) : undefined}
            className={`border-b border-[#e6eaf2] ${onSelect ? "cursor-pointer outline-none hover:bg-[#f6f8fe] focus-visible:bg-[#eef2ff]" : ""} ${onSelect && selected === i ? "bg-[#eef3ff]" : ""}`}
          >
            {r.map((c, j) => (
              <td key={j} className={`${td} !py-[7px]`}>
                <V v={c} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}

/* ---------------------------------- flow ----------------------------------- */

/** Step boxes joined by arrows; `green` marks alternate (done / authority) steps as in the design. */
export function Flow({ steps, green = [] }: { steps: string[]; green?: number[] }) {
  return (
    <div className="flex flex-wrap items-center gap-y-[8px] lg:flex-nowrap">
      {steps.map((s, i) => (
        <div key={s} className="flex min-w-0 flex-1 basis-[140px] items-center lg:basis-0">
          <span
            className={`flex h-[40px] min-w-0 flex-1 items-center justify-center rounded-[8px] border px-2 text-center text-[14.5px] font-medium text-[#1a1d36] shadow-[0_2px_4px_rgba(30,50,110,0.06)] ${
              green.includes(i) ? "border-[#cfe9cd] bg-gradient-to-b from-[#f5fcf4] to-[#e3f5e1]" : "border-[#d6e1f5] bg-gradient-to-b from-[#f8fbff] to-[#e6eefb]"
            }`}
          >
            {s}
          </span>
          {i < steps.length - 1 && <ArrowRight strokeWidth={1.8} className="mx-[4px] h-[14px] w-[14px] shrink-0 text-[#2f4fe0]" />}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- form ----------------------------------- */

const fieldCls = "h-[34px] w-full rounded-[7px] border border-[#cfd5e2] px-[10px] text-[15px] font-medium text-[#1a1d36] outline-none placeholder:text-[#6b7390] focus:border-[#5b6fe0]";

export function Field({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
}: {
  label?: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  const input = (
    <input
      value={value}
      readOnly={readOnly || !onChange}
      placeholder={placeholder}
      aria-label={label ?? placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className={`${fieldCls} ${readOnly || !onChange ? "bg-[#eef1f7]" : "bg-white"}`}
    />
  );
  return label ? (
    <label className="flex min-w-0 flex-col gap-[4px] text-[14.5px] font-semibold text-[#0b0c36]">
      {label}
      {input}
    </label>
  ) : (
    input
  );
}

export function SelectBox<T extends string>({ label, value, options, onChange, hideLabel = false }: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void; hideLabel?: boolean }) {
  const box = (
    <span className="relative block min-w-0 flex-1">
      <select value={value} aria-label={label} onChange={(e) => onChange(e.target.value as T)} className={`${fieldCls} cursor-pointer appearance-none bg-white pr-[30px]`}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown strokeWidth={2.2} className="pointer-events-none absolute right-[10px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#1a1d36]" />
    </span>
  );
  return hideLabel ? (
    box
  ) : (
    <label className="flex min-w-0 flex-col gap-[4px] text-[14.5px] font-semibold text-[#0b0c36]">
      {label}
      {box}
    </label>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex h-[34px] w-full items-center rounded-[7px] border border-[#cfd5e2] bg-white px-[8px] focus-within:border-[#5b6fe0] lg:w-[150px] lg:shrink-0">
      <Search strokeWidth={2} className="h-[15px] w-[15px] shrink-0 text-[#5b6280]" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="ml-[6px] h-full min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-[#6b7390]" />
    </label>
  );
}

export function TextArea({ value, onChange, label, rows = 2 }: { value: string; onChange: (v: string) => void; label: string; rows?: number }) {
  return (
    <label className="flex flex-col gap-[4px] text-[14.5px] font-semibold text-[#0b0c36]">
      {label}
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="w-full resize-none rounded-[7px] border border-[#cfd5e2] bg-white px-[10px] py-[7px] text-[15px] font-medium text-[#1a1d36] outline-none focus:border-[#5b6fe0]" />
    </label>
  );
}

/** Centred checkbox with its label underneath (as drawn in the design). */
export function CheckItem({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={`flex flex-col items-center gap-[4px] py-[3px] text-center text-[14.5px] font-medium text-[#1a1d36] ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <span className="relative inline-flex h-[15px] w-[15px]">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className={`peer h-[15px] w-[15px] appearance-none rounded-[3px] border-[1.5px] ${disabled ? "border-[#c4cad6] bg-[#eef1f7] checked:bg-[#c4cad6]" : "border-[#5b6280] bg-white checked:border-[#1d4fe0] checked:bg-[#1d4fe0]"}`}
        />
        <Check strokeWidth={3.4} className="pointer-events-none absolute inset-[2px] hidden h-[11px] w-[11px] text-white peer-checked:block" />
      </span>
      {label}
    </label>
  );
}

export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="mb-[4px] text-[14.5px] font-medium text-[#1a1d36]">{label}</p>
      <div className="h-[8px] overflow-hidden rounded-full bg-[#e1e8f3]" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div style={{ width: `${value}%` }} className="h-full rounded-full bg-[#3a7bd5] transition-[width]" />
      </div>
    </div>
  );
}

export function DropZone({ text, onFiles }: { text: string; onFiles: (names: string[]) => void }) {
  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFiles(Array.from(e.dataTransfer.files).map((f) => f.name));
      }}
      className="flex h-[36px] cursor-pointer items-center justify-center rounded-[8px] border border-dashed border-[#8aa0c8] bg-[#f6f9fe] px-2 text-center text-[14.5px] font-medium text-[#1a1d36] hover:bg-[#eef3fb]"
    >
      {text}
      <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(e) => onFiles(Array.from(e.target.files ?? []).map((f) => f.name))} />
    </label>
  );
}
