"use client";

/**
 * Shared layout of the Admin screens AD-001 … AD-050 (Admin Master Developer
 * Design Book, 1366 × 768 reference). Heading with scope and
 * screen switchers, pastel KPI tiles, tab bar and rows of light panels, then
 * the standard footer. Sizes are design px on the 1600 × 901 dashboard canvas
 * (reference × 1.17); below `lg` everything stacks and tables scroll sideways.
 *
 * All values are demo; actions show what would be recorded (no backend yet).
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  CircleCheck,
  FileText,
  House,
  Layers,
  MapPin,
  Network,
  Radio,
  Search,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Box, DashboardCanvas } from "@/components/dashboards/canvas";
import { tiles, useNotice, type TileTone } from "@/components/dashboards/super-admin/kit";
import EncodencyBadge from "@/components/ui/EncodencyBadge";
import { siteConfig } from "@/lib/config/site";
import { adScreens, actionTargets, screenByCode } from "./registry";
import type { BarColor, Block, Cell, Field, Panel, Screen } from "./types";
import { useDslData } from "@/lib/crm/useDslData";
import { useScreenActions } from "@/lib/crm/useScreenActions";
import { bindAdminScreen } from "@/lib/crm/bindScreens";
import { useEntityTab } from "@/lib/crm/useResource";
import { fieldName } from "@/lib/crm/formFields";

const ink = "text-[#1a1d36]";

/* ---------------------------------- frame ---------------------------------- */

const SB = 210;

export function AdminFrame({ active, children }: { active?: string; children: ReactNode }) {
  return (
    <DashboardCanvas role="admin" active={active}>
      <Box at={[SB, 60, 1600 - SB, 841]} as="div" fit="fluid" className="flex flex-col lg:px-[18px] lg:pb-[6px] lg:pt-[8px]">
        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-[7px]">{children}</div>
        <AdminFooter />
      </Box>
    </DashboardCanvas>
  );
}

function AdminFooter() {
  return (
    <footer className="relative z-10 mt-4 flex flex-col items-center gap-2 border-t border-[#e3e7ef] bg-white px-2 pt-3 text-[15px] font-semibold text-[#1d1f33] sm:flex-row sm:justify-between lg:mt-0 lg:h-[40px] lg:shrink-0 lg:gap-0 lg:pt-0 lg:text-[16px]">
      <p className="whitespace-nowrap">
        © {siteConfig.copyrightYear} {siteConfig.trust}
        <span className="mx-[12px] inline-block h-[16px] w-[1.5px] translate-y-[3px] bg-[#3a3d55]" />
        <b className="font-bold text-[#0b0c36]">{siteConfig.name} CRM v1.0</b>
      </p>
      <p className="flex items-center whitespace-nowrap">
        Designed, Developed &amp; Maintained by
        <EncodencyBadge className="ml-[12px] h-[28px] min-w-[132px] px-2.5" nameClassName="text-[16px]" legalClassName="text-[11px]" sloganClassName="text-[9.5px]" />
      </p>
    </footer>
  );
}

/* ---------------------------------- pills ---------------------------------- */

const pillTone: Record<string, string> = {
  r: "bg-[#fde0e0] text-[#c0302b]",
  a: "bg-[#fdebc4] text-[#8a5300]",
  g: "bg-[#d6f3d6] text-[#1d7a2a]",
  b: "bg-[#e0ecfd] text-[#2456b8]",
  p: "bg-[#ece4fd] text-[#5b34c2]",
  x: "bg-[#e9edf3] text-[#3b4256]",
};

/** "r:Emergency" → red pill; plain text stays text. */
function CellText({ c, bold = false, small = false }: { c: Cell; bold?: boolean; small?: boolean }) {
  const m = /^([ragbpx]):(.*)$/.exec(c);
  if (!m) return <span className={bold ? "font-semibold" : undefined}>{c}</span>;
  return (
    <span
      className={`inline-flex max-w-full items-center whitespace-nowrap rounded-full pt-px font-semibold leading-none ${small ? "h-[18px] px-[7px] text-[13.5px]" : "h-[20px] px-[9px] text-[14px]"} ${pillTone[m[1]]}`}
    >
      {m[2]}
    </span>
  );
}

const plain = (c: Cell) => c.replace(/^[ragbpx]:/, "");

const barFill: Record<BarColor, string> = {
  blue: "bg-[linear-gradient(90deg,#2a64c9,#3d8be0)]",
  amber: "bg-[#d39a3f]",
  red: "bg-[#cf5b57]",
  green: "bg-[#3f9562]",
};

/* --------------------------------- controls -------------------------------- */

const btnBase = "inline-flex h-[30px] shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] border px-[12px] pt-px text-[14.5px] font-semibold leading-none transition-colors";
const btnSolid = `${btnBase} border-[#0a5ce8] bg-[linear-gradient(90deg,#086eed_0%,#093cdd_100%)] text-white hover:brightness-110`;
const btnOutline = `${btnBase} border-[#7d9be0] bg-white text-[#1e43a8] hover:bg-[#f1f5fd]`;

function NativeSelect({
  label,
  value,
  options,
  onChange,
  className = "",
  size = 14,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  className?: string;
  size?: number;
}) {
  return (
    <span className={`relative block h-[32px] shrink-0 ${className}`}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontSize: size }}
        className={`h-full w-full cursor-pointer appearance-none truncate rounded-[7px] border border-[#cfd6e3] bg-white pl-[10px] pr-[28px] pt-px ${ink} outline-none focus:border-[#4a6fe0]`}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown strokeWidth={2.4} className="pointer-events-none absolute right-[8px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#1a1d36]" />
    </span>
  );
}

/* ---------------------------------- blocks --------------------------------- */

type Ctx = {
  /** Main table: rows after search / status filter (index into the full row list). */
  visible: number[];
  selected: number;
  onSelect: (i: number) => void;
  query: string;
  setQuery: (q: string) => void;
  status: string;
  setStatus: (s: string) => void;
  statusOptions: string[];
  act: (label: string) => void;
  isMain: boolean;
  canAct?: (label: string) => boolean;
  setField?: (label: string, value: string) => void;
  empty?: string;
  recordId?: string;
};

function KvRows({ rows, dense }: { rows: [string, Cell][]; bold?: boolean; dense?: boolean }) {
  return (
    <ul className="flex flex-col">
      {rows.map(([k, v], i) => (
        <li key={`${k}-${i}`} className={`flex items-center gap-[8px] border-b border-[#eef0f5] ${dense ? "min-h-[24px] py-[2px] text-[14.5px]" : "min-h-[26px] py-[3px] text-[15px]"} ${ink} last:border-b-0`}>
          <span className="min-w-0 flex-1 truncate font-medium text-[#1a1d36]">{k}</span>
          <span className="shrink-0 whitespace-nowrap text-right font-bold text-[#0b0c36]" title={plain(v)}>
            <CellText c={v} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function FormGrid({ fields, onField }: { fields: Field[]; onField?: (label: string, value: string) => void }) {
  const [values, setValues] = useState(() => fields.map((f) => f.value));
  const set = (i: number, v: string) => { if (onField) onField(fields[i].label, v); else setValues((vs) => vs.map((x,k) => k === i ? v : x)); };
  const box = `h-[34px] w-full rounded-[7px] border border-[#cfd6e3] bg-white px-[10px] pt-px text-[15px] font-medium ${ink} outline-none focus:border-[#4a6fe0]`;
  return (
    <div className="grid gap-x-[10px] gap-y-[6px] sm:grid-cols-2">
      {fields.map((f, i) => (
        <label key={f.label} className={`flex min-w-0 flex-col gap-[3px] text-[14.5px] font-semibold text-[#0b0c36] ${f.wide || f.kind === "textarea" ? "sm:col-span-2" : ""}`}>
          {f.label}
          {f.kind === "select" ? (
            <span className="relative block">
              <select name={onField ? fieldName(f.label) : undefined} value={onField ? f.value : values[i]} onChange={(e) => set(i, e.target.value)} className={`${box} cursor-pointer appearance-none pr-[28px]`}>
                {Array.from(new Set([f.value, ...(f.options ?? [])])).map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown strokeWidth={2.4} className="pointer-events-none absolute right-[8px] top-1/2 h-[15px] w-[15px] -translate-y-1/2" />
            </span>
          ) : f.kind === "textarea" ? (
            <textarea
              name={onField ? fieldName(f.label) : undefined}
              value={onField ? f.value : values[i]}
              onChange={(e) => set(i, e.target.value)}
              placeholder={f.value ? undefined : "Enter authorised notes"}
              rows={2}
              className={`${box} h-[42px] resize-none py-[5px]`}
            />
          ) : (
            <input
              name={onField ? fieldName(f.label) : undefined}
              value={onField ? f.value : values[i]}
              readOnly={f.kind === "readonly"}
              onChange={(e) => set(i, e.target.value)}
              className={`${box} ${f.kind === "readonly" ? "bg-[#eef1f6] text-[#3b4256]" : ""}`}
            />
          )}
        </label>
      ))}
    </div>
  );
}

function FolderList({ items, onPick }: { items: string[]; onPick: (f: string) => void }) {
  const [on, setOn] = useState(0);
  return (
    <ul className="flex flex-col gap-[2px]">
      {items.map((f, i) => (
        <li key={f}>
          <button
            type="button"
            aria-current={on === i ? "true" : undefined}
            onClick={() => {
              setOn(i);
              onPick(f);
            }}
            className={`flex h-[28px] w-full items-center rounded-[5px] px-[8px] pt-px text-left text-[15px] font-medium ${ink} ${on === i ? "bg-[#e3ebf8] font-semibold" : "hover:bg-[#f1f4fa]"}`}
          >
            {f}
          </button>
        </li>
      ))}
    </ul>
  );
}

function ReplyBox({ placeholder }: { placeholder: string }) {
  const [v, setV] = useState("");
  return (
    <input
      value={v}
      onChange={(e) => setV(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`h-[34px] w-full rounded-[7px] border border-[#cfd6e3] bg-white px-[10px] pt-px text-[15px] font-medium ${ink} outline-none placeholder:text-[#4a5070] focus:border-[#4a6fe0]`}
    />
  );
}

function Textarea({ label, placeholder, onField }: { label: string; placeholder: string; onField?: (label: string, value: string) => void }) {
  const [v, setV] = useState("");
  return (
    <label className="flex flex-col gap-[3px] text-[14.5px] font-semibold text-[#0b0c36]">
      {label}
      <textarea
        value={v}
        onChange={(e) => { setV(e.target.value); onField?.(label,e.target.value); }}
        placeholder={placeholder}
        rows={2}
        className={`h-[42px] w-full resize-none rounded-[7px] border border-[#cfd6e3] bg-white px-[10px] py-[5px] text-[15px] font-medium ${ink} outline-none focus:border-[#4a6fe0]`}
      />
    </label>
  );
}

function Calendar({ firstDay, days, marks = [] }: { firstDay: number; days: number; marks?: number[] }) {
  const cells: (number | null)[] = [...Array.from({ length: firstDay }, () => null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  return (
    <div className={`text-[14.5px] ${ink}`}>
      <div className="grid grid-cols-7 rounded-[4px] bg-[#e9eef6] px-[4px] py-[3px] font-medium">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="px-[6px]">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 px-[4px]">
        {cells.map((d, i) => (
          <span key={i} className={`px-[6px] py-[3px] ${d && marks.includes(d) ? "font-semibold text-[#1d4fe0]" : ""}`}>{d ?? ""}</span>
        ))}
      </div>
    </div>
  );
}

function BlockView({ b, ctx }: { b: Block; ctx: Ctx }) {
  switch (b.t) {
    case "filter":
      return (
        <div className="flex flex-wrap items-center gap-[7px] lg:flex-nowrap">
          {b.search ? (
            <label className="flex h-[32px] min-w-0 flex-1 items-center rounded-[7px] border border-[#cfd6e3] bg-white px-[10px] focus-within:border-[#4a6fe0]">
              <Search strokeWidth={2.2} className="h-[14px] w-[14px] shrink-0 text-[#5b6a8a]" aria-hidden />
              <input
                type="search"
                value={ctx.query}
                onChange={(e) => ctx.setQuery(e.target.value)}
                placeholder={b.placeholder ?? "Search records..."}
                aria-label="Search records"
                className={`ml-[7px] h-full min-w-0 flex-1 bg-transparent pt-px text-[15px] font-medium ${ink} outline-none placeholder:text-[#4a5070]`}
              />
            </label>
          ) : (
            <label className="flex h-[34px] w-[22px] shrink-0 items-center justify-center rounded-[7px] border border-[#cfd6e3] bg-white focus-within:w-[160px] focus-within:border-[#4a6fe0] lg:w-[22px]">
              <input
                type="search"
                value={ctx.query}
                onChange={(e) => ctx.setQuery(e.target.value)}
                aria-label="Search records"
                className="h-full w-full min-w-0 bg-transparent px-[6px] text-[15px] font-medium outline-none"
              />
            </label>
          )}
          <NativeSelect
            label="Status filter"
            value={ctx.status}
            options={ctx.statusOptions}
            onChange={ctx.setStatus}
            size={14.5}
            className={b.search ? (b.narrow ? "w-[140px]" : b.all ? "w-[205px]" : "w-[205px]") : "min-w-0 flex-1"}
          />
          {!b.all && (
            <button type="button" onClick={() => ctx.act("Filter")} className={`${btnOutline} !h-[34px] !px-[12px] !text-[14.5px]`}>
              Filter
            </button>
          )}
        </div>
      );
    case "table": {
      const main = ctx.isMain;
      const order = main ? ctx.visible : b.rows.map((_, i) => i);
      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-left">
            <thead>
              <tr className="bg-[#f4f7fc]">
                {b.cols.map((c) => (
                  <th key={c} scope="col" className="whitespace-nowrap px-[8px] py-[6px] text-[14.5px] font-bold text-[#0b0c36]">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.length === 0 && (
                <tr>
                  <td colSpan={b.cols.length} className="px-[8px] py-[12px] text-center text-[15px] text-[#5b6a8a]">{ctx.empty ?? "No records match the filter."}</td>
                </tr>
              )}
              {order.map((ri) => {
                const r = b.rows[ri];
                const on = main && ri === ctx.selected;
                return (
                  <tr
                    key={`${r[0]}-${ri}`}
                    tabIndex={main ? 0 : undefined}
                    aria-selected={main ? on : undefined}
                    onClick={main ? () => ctx.onSelect(ri) : undefined}
                    onKeyDown={main ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), ctx.onSelect(ri)) : undefined}
                    className={`border-b border-[#eef0f5] last:border-b-0 ${main ? "cursor-pointer outline-none hover:bg-[#f3f6fd] focus-visible:bg-[#eaf0ff]" : ""} ${on ? "bg-[#eef3ff]" : ""}`}
                  >
                    {r.map((c, j) => (
                      <td key={j} className={`whitespace-nowrap px-[8px] font-medium ${b.compact ? "py-[3px] text-[14px]" : "py-[6px] text-[14.8px]"} ${ink}`}>
                        <CellText c={c} small={b.compact} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }
    case "kv":
      return <KvRows rows={b.rows} bold={b.bold} dense={b.dense} />;
    case "list":
      return <FolderList items={b.items} onPick={(f) => ctx.act(`Open ${f}`)} />;
    case "chat":
      return (
        <div className="flex flex-col gap-[6px] py-[3px]">
          {b.msgs.map(([dir, text], i) => (
            <p
              key={i}
              className={`max-w-[92%] rounded-[6px] border px-[9px] py-[6px] text-[14.5px] leading-snug ${ink} ${
                dir === "in" ? "self-start border-[#d6deea] bg-[#e9eff8]" : "self-end border-[#cfe5d2] bg-[#e5f3e7]"
              }`}
            >
              {text}
            </p>
          ))}
        </div>
      );
    case "input":
      return <ReplyBox placeholder={b.placeholder} />;
    case "meters":
      return (
        <ul className="flex flex-col gap-[4px] py-[3px]">
          {b.items.map(([label, v, right]) => (
            <li key={label} className={`grid grid-cols-[minmax(0,145px)_minmax(0,1fr)_52px] items-center gap-[10px] text-[14.5px] font-medium ${ink}`}>
              <span className="truncate">{label}</span>
              <span className="block h-[7px] overflow-hidden rounded-full bg-[#e1e7f0]" role="img" aria-label={`${label}: ${right}`}>
                <span style={{ width: `${Math.min(100, v)}%` }} className="block h-full rounded-full bg-[#6aa3df]" />
              </span>
              <span className="text-right font-bold text-[#0b0c36]">{right}</span>
            </li>
          ))}
        </ul>
      );
    case "stack":
      return (
        <div className="py-[3px]">
          <p className={`rounded-[4px] border border-[#d9dfe8] bg-[#f1f4f8] px-[8px] py-[5px] text-[14.5px] ${ink}`}>{b.caption}</p>
          <span className="mt-[8px] flex h-[11px] overflow-hidden rounded-full bg-[#e1e7f0]" role="img" aria-label={b.caption}>
            {b.parts.map(([v, c], i) => (
              <span key={i} style={{ width: `${v}%` }} className={`block h-full ${c === "grey" ? "bg-[#e1e7f0]" : barFill[c]} !rounded-none`} />
            ))}
          </span>
        </div>
      );
    case "btns":
      return (
        <div className="flex flex-wrap gap-[6px] py-[2px]">
          {b.items.map((l, i) => {
            const target = actionTargets[l];
            const href = target ? screenByCode(target)?.href : undefined;
            const cls = i === 0 && !b.outlineAll ? btnSolid : btnOutline;
            return href ? (
              <Link key={l} href={ctx.recordId && ["Open case","View profile","View work history","Review closure"].includes(l) ? `${href}?id=${ctx.recordId}` : href} className={cls}>{l}</Link>
            ) : (
              <button key={l} type="button" disabled={ctx.canAct ? !ctx.canAct(l) : false} onClick={() => ctx.act(l)} className={cls}>{l}</button>
            );
          })}
        </div>
      );
    case "progress":
      return (
        <div className={`py-[2px] text-[15px] font-medium ${ink}`}>
          <div className={`flex items-center justify-between gap-[8px] ${!b.label && !b.right ? "hidden" : ""}`}>
            <span className="truncate">{b.label}</span>
            <span className="shrink-0 font-bold text-[#0b0c36]">{b.right ?? `${b.value}%`}</span>
          </div>
          <span className="mt-[3px] block h-[9px] w-full overflow-hidden rounded-full bg-[#e1e7f0]" role="img" aria-label={`${b.label}: ${b.right ?? `${b.value}%`}`}>
            <span style={{ width: `${Math.min(100, b.value)}%` }} className={`block h-full rounded-full ${barFill[b.color ?? "blue"]}`} />
          </span>
        </div>
      );
    case "flow":
      return (
        <div className="flex items-center gap-[4px] overflow-x-auto py-[4px]">
          {b.steps.map((s, i) => {
            const [top, bottom] = Array.isArray(s) ? s : [s, undefined];
            return (
              <Fragment key={`${top}-${i}`}>
                {i > 0 && <ArrowRight strokeWidth={2} className="h-[14px] w-[14px] shrink-0 text-[#1a3a8a]" aria-hidden />}
                <span
                  className={`flex min-h-[48px] min-w-[64px] flex-1 flex-col items-center justify-center rounded-[6px] border px-[6px] text-center text-[14.5px] font-medium leading-tight ${ink} ${
                    i % 2 ? "border-[#c9e3cc] bg-[linear-gradient(180deg,#f3fbf3,#e4f4e6)]" : "border-[#c8d8ee] bg-[linear-gradient(180deg,#f4f8fe,#e3edf9)]"
                  }`}
                >
                  {top}
                  {bottom && <span className="mt-[2px] text-[13px] text-[#3b4256]">{bottom}</span>}
                </span>
              </Fragment>
            );
          })}
        </div>
      );
    case "chips":
      return (
        <div style={{ "--n": b.items.length } as CSSProperties} className="grid grid-cols-2 gap-[5px] py-[3px] sm:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]">
          {b.items.map((c) => (
            <button key={c} type="button" onClick={() => ctx.act(c)} className={`h-[29px] truncate rounded-[5px] border border-[#cfd6e3] bg-[#eef2f7] px-[6px] pt-px text-[14px] font-medium ${ink} hover:bg-[#e3e9f3]`}>
              {c}
            </button>
          ))}
        </div>
      );
    case "kanban":
      return (
        <div style={{ "--n": b.cols.length } as CSSProperties} className="grid gap-[6px] sm:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]">
          {b.cols.map((c) => (
            <div key={c.title} className="rounded-[5px] bg-[#eef2f7] p-[5px]">
              <p className={`px-[2px] pb-[3px] text-[14.5px] font-semibold ${ink}`}>{c.title}</p>
              <div className="flex flex-col gap-[4px]">
                {c.cards.map(([id, text]) => (
                  <button key={id} type="button" onClick={() => ctx.act(`Open ${id}`)} className={`rounded-[4px] border border-[#d6deea] bg-white px-[6px] py-[4px] text-left text-[13.5px] leading-[1.25] ${ink} hover:border-[#7d9be0]`}>
                    {id}
                    <br />
                    {text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "callout":
      return <p className={`my-[3px] rounded-[4px] border border-[#d9dfe8] bg-[#f1f4f8] px-[8px] py-[5px] text-[14.5px] leading-snug ${ink}`}>{b.text}</p>;
    case "days":
      return (
        <div className="flex gap-[6px] overflow-x-auto py-[3px]">
          {b.items.map(([d, hl]) => {
            const [top, bottom] = d.split("|");
            return (
              <span
                key={d}
                className={`flex min-w-[38px] flex-1 flex-col items-center justify-center rounded-[5px] border text-[14.5px] leading-tight ${ink} ${bottom ? "h-[40px]" : "h-[32px]"} ${
                  hl ? "border-[#e8c98c] bg-[#fbe7c2]" : "border-[#cfd6e3] bg-[#eef2f7]"
                }`}
              >
                {top}
                {bottom && <span>{bottom}</span>}
              </span>
            );
          })}
        </div>
      );
    case "note":
      return <p className={`py-[3px] text-[15px] leading-snug ${b.muted ? "text-[#4a5468]" : ink}`}>{b.text}</p>;
    case "info":
      return <p className={`my-[3px] rounded-[4px] bg-[#e8eff9] px-[8px] py-[5px] text-[14.5px] leading-snug ${ink}`}>{b.text}</p>;
    case "alert":
      return <p className="my-[3px] rounded-[4px] border border-[#f3c9c6] bg-[#fdeceb] px-[8px] py-[5px] text-[14.5px] leading-snug text-[#c0302b]">{b.text}</p>;
    case "doc":
      return (
        <div className={`my-[3px] rounded-[6px] border border-[#d6deea] bg-white px-[10px] py-[7px] text-[14.5px] leading-[1.35] ${ink}`}>
          <p className="font-semibold">{b.title}</p>
          {b.lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
          {b.badge && (
            <p className="mt-[3px]">
              <CellText c={b.badge} />
            </p>
          )}
        </div>
      );
    case "form":
      return <FormGrid fields={b.fields} onField={ctx.setField} />;
    case "bars": {
      const max = Math.max(1, ...b.items.map(([, v]) => Number.isFinite(v) ? v : 0));
      return (
        <div className="flex h-full min-h-[96px] flex-col">
          <div className="flex min-h-0 flex-1 items-end gap-[6px] px-[2px]">
            {b.items.map(([label, v]) => (
              <div key={label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                <span className="text-[13.5px] font-semibold leading-none text-[#0b0c36]">{Number.isFinite(v) ? v : "—"}</span>
                <span style={{ height: `${Number.isFinite(v) && v > 0 ? Math.max(10, (v / max) * 72) : 0}%` }} className="mt-[3px] w-full rounded-t-[3px] bg-[linear-gradient(180deg,#78a9ee,#5a8fe0)]" />
                <span className="mt-[2px] whitespace-nowrap text-[13px] font-semibold leading-none text-[#3b4256]">{label}</span>
              </div>
            ))}
          </div>
          {b.note && <p className="mt-[5px] text-[13.5px] text-[#4a5468]">{b.note}</p>}
        </div>
      );
    }
    case "hbars":
      return (
        <ul className="flex flex-col gap-[4px] py-[2px]">
          {b.items.map(([label, v, right]) => (
            <li key={label} className={`text-[14.8px] ${ink}`}>
              <div className="flex justify-between gap-[8px]">
                <span className="truncate font-medium">{label}</span>
                <span className="shrink-0 font-bold text-[#0b0c36]">{right ?? `${v}%`}</span>
              </div>
              <span className="mt-[2px] block h-[8px] overflow-hidden rounded-full bg-[#e1e7f0]">
                <span style={{ width: `${Math.min(100, v)}%` }} className="block h-full rounded-full bg-[linear-gradient(90deg,#2a64c9,#3d8be0)]" />
              </span>
            </li>
          ))}
        </ul>
      );
    case "donut": {
      const r = 26;
      const c = 2 * Math.PI * r;
      return (
        <div className="flex items-center gap-[12px] pt-[2px]">
          <svg viewBox="0 0 70 70" className="h-[54px] w-[54px] shrink-0" role="img" aria-label={`${b.value} ${b.unit}`}>
            <circle cx="35" cy="35" r={r} fill="none" stroke="#6fa9e6" strokeWidth="9" />
            <circle cx="35" cy="35" r={r} fill="none" stroke="#3a7a55" strokeWidth="9" strokeDasharray={`${(b.pct / 100) * c} ${c}`} transform="rotate(-90 35 35)" />
            <text x="35" y="35" textAnchor="middle" className="fill-[#0b0c36] text-[15px] font-semibold">{b.value}</text>
            <text x="35" y="47" textAnchor="middle" className="fill-[#3b4256] text-[8.5px]">{b.unit}</text>
          </svg>
          <div className={`text-[14.8px] font-medium leading-snug ${ink}`}>
            {b.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>
      );
    }
    case "map":
      if (b.gps)
        return (
          <svg viewBox="0 0 360 66" preserveAspectRatio="none" className="my-[3px] block h-[66px] w-full rounded-[4px] border border-[#d6dfd0] bg-[#eef3e6]" role="img" aria-label={b.gps}>
            <path d="M0 40 L360 22" stroke="#fff" strokeWidth="3" />
            <path d="M40 0 L150 66" stroke="#fff" strokeWidth="3" />
            <path d="M200 0 L240 66" stroke="#fff" strokeWidth="2.5" />
            <path d="M138 30 L172 36 L208 37" stroke="#6b8fd6" strokeWidth="1" fill="none" />
            <circle cx="138" cy="30" r="3.5" fill="#2a64c9" />
            <circle cx="172" cy="36" r="3.5" fill="#2f9a55" />
            <circle cx="208" cy="37" r="3.5" fill="#2a64c9" />
            <text x="150" y="13" fontSize="6.5" fill="#3b4256">{b.gps}</text>
          </svg>
        );
      return (
        <div className="relative my-[3px] h-[54px] overflow-hidden rounded-[4px] border border-[#d6dfd0] bg-[repeating-linear-gradient(135deg,#eef3e7_0px,#eef3e7_14px,#f9f3dc_14px,#f9f3dc_18px)]">
          <div className="absolute left-[8px] top-[8px] flex flex-wrap gap-[5px]">
            {b.chips.map((c) => (
              <span key={c} className={`rounded-[3px] border border-[#d6dbe6] bg-white px-[5px] py-[2px] text-[12px] ${ink}`}>{c}</span>
            ))}
          </div>
        </div>
      );
    case "textarea":
      return <Textarea label={b.label} placeholder={b.placeholder} onField={ctx.setField} />;
    case "calendar":
      return <Calendar firstDay={b.firstDay} days={b.days} marks={b.marks} />;
  }
}

/* ---------------------------------- panel ---------------------------------- */

function PanelView({ p, ctx, title, order }: { p: Panel; ctx: Ctx; title: string; order: number }) {
  return (
    <section aria-label={title} style={{ order }} className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[12px] border border-[#e1e5ee] bg-white shadow-[0_3px_10px_rgba(30,50,110,0.07)] lg:h-full">
      <h2 className="flex h-[35px] shrink-0 items-center border-b border-[#e1e5ee] bg-[#f4f7fc] px-[12px] pt-px text-[15px] font-bold tracking-[-0.3px] text-[#0b0c36]">
        <span className="truncate">{title}</span>
      </h2>
      {/* never clip: content taller than the panel scrolls inside it */}
      <div className="flex min-h-0 flex-1 flex-col gap-[4px] overflow-auto overscroll-contain px-[12px] pb-[10px] pt-[8px] [scrollbar-width:thin]">
        {p.blocks.map((b, i) => (
          <div key={i} className={b.t === "bars" ? "min-h-0 flex-1" : "shrink-0"}>
            <BlockView b={b} ctx={ctx} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- page ----------------------------------- */

const kpiIcons: LucideIcon[] = [House, Radio, Bell, CircleCheck, UsersRound, Network, MapPin, Layers, Layers, FileText];
const kpiTones: TileTone[] = ["blue", "green", "orange", "purple", "sky", "green", "orange", "purple", "sky", "green"];

const departments = ["Assigned departments", "Sewa operations", "Communication", "Field support", "Documentation"] as const;

const screenOptions = adScreens.map((s) => s.title);

/** Message for an action button (placeholder until the module's API exists). */
function actionMessage(label: string, id: string | undefined) {
  const ref = id ? ` · ${id}` : "";
  const l = label.toLowerCase();
  if (l === "filter") return "Filter applied to assigned records .";
  if (l.startsWith("escalate")) return `Escalated to Super Admin${ref} — audit event recorded .`;
  if (/^(approve|reject|return)/.test(l)) return `${label}${ref}: independent checker and delegated limit verified server-side .`;
  if (l.includes("dispatch") && l.includes("release")) return "Dispatch stays blocked until all applicable mandatory legal gates pass .";
  if (/^(export|download)/.test(l)) return `${label}: masked export logged with purpose and approval .`;
  return `${label}${ref} — recorded in the audit trail .`;
}

/** Admin screen by code (AD-001 … AD-050); pages pass only the code (data holds icon components). */
export default function AdScreen({ code }: { code: string }) {
  const s = screenByCode(code);
  if (!s) return null;
  return <ScreenView key={s.code} s={s} active={s.code === "AD-001" ? undefined : s.sectionSlug} />;
}

function ScreenView({ s: original, active }: { s: Screen; active?: string }) {
  const router = useRouter();
  const notice = useNotice();
  const [tab, setTab] = useEntityTab(original.tabs);
  const [dept, setDept] = useState<string>(departments[0]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(original.selected ?? 0);
  const live = useDslData(original.code, tab, query, selected, notice.show);
  const actions = useScreenActions(live, notice.show);
  const s = bindAdminScreen(original, live, actions);
  const filterBlock = s.rows[0].panels[0].blocks.find((b) => b.t === "filter");
  const allLabel = (filterBlock?.t === "filter" && filterBlock.all) || "All assigned records";
  const [status, setStatus] = useState(allLabel);

  // main table = first table of the first panel
  const mainPanel = s.rows[0].panels[0];
  const mainTable = mainPanel.blocks.find((b) => b.t === "table");
  const rows = mainTable?.t === "table" ? mainTable.rows : [];
  const pillCol = (() => {
    if (mainTable?.t === "table" && mainTable.status !== undefined) return mainTable.status;
    // status filter uses the last column that carries pills
    for (let j = (rows[0]?.length ?? 0) - 1; j >= 0; j--) if (rows.some((r) => /^[ragbpx]:/.test(r[j] ?? ""))) return j;
    return -1;
  })();
  const statusOptions = [allLabel, ...Array.from(new Set(pillCol < 0 ? [] : rows.map((r) => plain(r[pillCol]))))];
  const visible = rows
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => (status === allLabel || plain(r[pillCol]) === status) && (!query.trim() || r.join(" ").toLowerCase().includes(query.trim().toLowerCase())))
    .map(({ i }) => i);
  const selId = rows[selected] ? plain(rows[selected][0]) : undefined;

  const tabIndex = s.tabs.indexOf(tab);
  const ctxFor = (isMain: boolean): Ctx => ({
    visible,
    selected,
    onSelect: (index) => { setSelected(index);if (live.enabled) live.chooseIndex(index); },
    query,
    setQuery,
    status,
    setStatus,
    statusOptions,
    act: (label) => live.enabled ? void actions.act(label) : notice.show(actionMessage(label, selId)),
    canAct: live.enabled ? actions.canAct : undefined,
    setField: live.enabled ? actions.setField : undefined,
    empty: live.enabled ? live.empty : undefined,
    recordId: live.enabled ? String(live.selectedRecord?.id ?? "") : undefined,
    isMain,
  });

  return (
    <AdminFrame active={active}>
      {/* heading */}
      <div className="flex flex-col gap-3 lg:h-[50px] lg:shrink-0 lg:flex-row lg:items-center lg:gap-[14px]">
        <div className="min-w-0">
          <h1 className="text-[21px] font-medium leading-tight tracking-[-0.5px] text-[#0b0c36] lg:whitespace-nowrap lg:text-[24px] lg:leading-none">
            {s.title}
          </h1>
          <p className="mt-[5px] text-[15px] font-normal leading-none text-[#141a4a] lg:text-[16px]">Admin / FY 2026–27 / Ghaziabad {s.scope ?? "· Assigned scope"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-[10px] lg:ml-auto lg:flex-nowrap">
          {!s.snapshot && !s.plain && <NativeSelect label="Department scope" value={dept} options={departments} onChange={setDept} className="w-[198px]" />}
          <NativeSelect
            label="Switch screen"
            value={s.title}
            options={screenOptions}
            onChange={(v) => {
              const next = adScreens.find((x) => x.title === v);
              if (next && next.code !== s.code) router.push(next.href);
            }}
            className={`w-full ${s.snapshot || s.plain ? "sm:w-[425px]" : "sm:w-[285px]"}`}
          />
        </div>
      </div>

      {/* KPI tiles */}
      <div
        style={{ "--n": s.kpis.length } as CSSProperties}
        className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:h-[70px] lg:shrink-0 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
      >
        {s.kpis.map((k, i) => {
          const tone = tiles[k.tone ?? kpiTones[i % kpiTones.length]];
          const Icon = k.icon ?? kpiIcons[i % kpiIcons.length];
          return (
            <div
              key={`${k.l}-${i}`}
              style={{ background: tone.bg, borderColor: tone.border }}
              className="flex min-h-[66px] min-w-0 items-center gap-[8px] rounded-[11px] border px-[9px] py-[6px] shadow-[0_3px_9px_rgba(30,50,110,0.08)]"
            >
              <Icon strokeWidth={1.9} style={{ color: tone.fg }} className={`${s.kpis.length > 8 ? "h-[24px] w-[24px]" : "h-[30px] w-[30px]"} shrink-0`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="whitespace-nowrap text-[22px] font-bold leading-none tracking-[-0.4px] text-[#0b0c36]">{k.v}</p>
                <p className={`mt-[3px] font-semibold leading-[1.15] tracking-[-0.25px] text-[#1a1d36] ${s.kpis.length > 8 ? "text-[14.2px]" : "text-[15.4px] lg:truncate"}`}>{k.l}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* tabs */}
      <div role="tablist" aria-label={`${s.title} views`} className="flex overflow-x-auto rounded-[6px] border border-[#d9e1eb] bg-white lg:h-[36px] lg:shrink-0">
        {s.tabs.map((t, i) => {
          const on = t === tab;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => {
                const link = s.tabLinks?.[t];
                const target = link ? screenByCode(link) : undefined;
                if (target) router.push(target.href);
                else setTab(t);
              }}
              className={`h-[34px] min-w-[130px] flex-1 whitespace-nowrap px-[10px] pt-px text-[14.2px] lg:h-full lg:min-w-0 ${i > 0 ? "border-l border-[#d9e1eb]" : ""} ${
                on ? "border-l-0 bg-[linear-gradient(90deg,#086eed_0%,#093cdd_100%)] text-white" : `${ink} hover:bg-[#f3f6fc]`
              } ${i === 0 ? "rounded-l-[5px]" : ""} ${i === s.tabs.length - 1 ? "rounded-r-[5px]" : ""}`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* panels */}
      <div className="flex min-h-0 flex-col gap-3 lg:flex-1 lg:gap-[10px]">
        {s.rows.map((row, ri) => {
          const widths = row.w ?? row.panels.map(() => 1);
          const pos = row.order ?? row.panels.map((_, i) => i);
          const display = row.panels.map((_, i) => i).sort((a, b) => pos[a] - pos[b]);
          return (
            <div
              key={ri}
              style={{ "--g": row.h, "--cols": display.map((i) => `minmax(0,${widths[i]}fr)`).join(" ") } as CSSProperties}
              className="grid min-h-0 grid-cols-1 gap-3 lg:[flex:var(--g)_1_0px] lg:gap-[10px] lg:[grid-template-columns:var(--cols)] lg:[grid-template-rows:minmax(0,1fr)]"
            >
              {row.panels.map((p, pi) => {
                const isMain = ri === 0 && pi === 0;
                let title = p.follow && selId ? `${p.title} · ${selId}` : p.title;
                let panel = p;
                if (isMain && tabIndex > 0) {
                  title = `${p.title} · ${tab}`;
                  panel = { ...p, blocks: [{ t: "info", text: `${tab} view · assigned scope only ` }, ...p.blocks] };
                }
                return <PanelView key={`${p.title}-${pi}`} p={panel} ctx={ctxFor(isMain)} title={title} order={pos[pi]} />;
              })}
            </div>
          );
        })}
      </div>
      {notice.node}
    </AdminFrame>
  );
}
