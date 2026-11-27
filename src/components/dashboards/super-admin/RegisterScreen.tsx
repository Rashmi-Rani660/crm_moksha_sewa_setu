"use client";

/**
 * Shared layout of the SA-041 … SA-050 screens (Sewa Setu-SA041-050 design
 * book): page heading with the screen picker, six KPI tiles, five tabs, the
 * register table, a controls panel, a lower detail panel and the
 * "Priority exceptions & safeguards" panel.
 *
 * Sizes are design pixels (reference images × 1.17) on the Super Admin
 * canvas; below `lg` the blocks stack and wide tables scroll sideways.
 * All figures are demo data; the action buttons get wired once the APIs exist.
 */

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Bell, ChevronDown, CircleCheck, Network, Radio, Users, type LucideIcon } from "lucide-react";
import { SuperAdminFrame } from "@/components/dashboards/super-admin/kit";
import { screenPicker, type ScreenCode } from "@/components/dashboards/super-admin/routes";

/* ---------------------------------- types ---------------------------------- */

export type KpiTone = "blue" | "green" | "orange" | "purple" | "red";
export type Kpi = { value: string; label: string; tone?: KpiTone };

/** Table column: `w` = width in the design (px of the reference image). */
export type Column = { label: string; w: number; align?: "right"; pill?: boolean };

export type KVRow = readonly [string, string];
export type Bar = { label: string; value: string; pct: number };

export type Lower =
  | { kind: "list"; rows: KVRow[]; note?: string; actions: string[] }
  | { kind: "bars"; bars: Bar[]; actions: string[] }
  | { kind: "bars2"; bars: Bar[]; actions: string[] }
  | {
      kind: "flow";
      from: string;
      to: string;
      yes: [string, string];
      no: [string, string];
      actions: string[];
    };

export type ScreenSpec = {
  code: ScreenCode;
  title: string;
  /** Sidebar row to highlight (slug). */
  active: string;
  /** Six KPI tiles; icons follow the design order. */
  kpis: [Kpi, Kpi, Kpi, Kpi, Kpi, Kpi];
  tabs: [string, string, string, string, string];
  register: { title: string; columns: Column[]; rows: string[][]; actions: string[] };
  side: { title: string; rows: KVRow[]; button?: string; budget?: Bar };
  lower: { title: string } & Lower;
  safeguards: KVRow[];
};

/* ---------------------------------- tokens --------------------------------- */

const kpiIcons: LucideIcon[] = [Radio, Bell, CircleCheck, Users, Network, Radio];
const defaultTones: KpiTone[] = ["blue", "green", "orange", "purple", "blue", "green"];

const kpiTone: Record<KpiTone, { bg: string; border: string; fg: string }> = {
  blue: { bg: "linear-gradient(180deg,#ecf5fe 0%,#e3effc 100%)", border: "#c6d9ef", fg: "#1f6fd6" },
  green: { bg: "linear-gradient(180deg,#ecfaee 0%,#e2f5e6 100%)", border: "#c4e4cb", fg: "#1f8a34" },
  orange: { bg: "linear-gradient(180deg,#fff7e7 0%,#fff1d9 100%)", border: "#f3dcaf", fg: "#e59410" },
  purple: { bg: "linear-gradient(180deg,#f4f0fd 0%,#eee8fb 100%)", border: "#dacff4", fg: "#7a4fe0" },
  red: { bg: "linear-gradient(180deg,#fff0ef 0%,#ffe7e7 100%)", border: "#f2c6c6", fg: "#d92c2c" },
};

const ink = "text-[#1a1d36]";
const primaryBtn =
  "flex h-[28px] shrink-0 items-center whitespace-nowrap rounded-[6px] bg-[linear-gradient(90deg,#086eed_0%,#093cdd_100%)] px-[11px] pt-px text-[13.8px] font-normal text-white shadow-[0_1px_3px_rgba(9,60,221,0.3)] hover:brightness-110";
const outlineBtn =
  "flex h-[28px] shrink-0 items-center whitespace-nowrap rounded-[6px] border border-[#a9bddf] bg-white px-[10px] pt-px text-[13.8px] font-normal text-[#1e43a8] hover:bg-[#f1f5fd]";

/** Pill colour by word: green done states, blue people / transfers, amber the rest. */
function pillClass(text: string) {
  const t = text.toLowerCase();
  if (/^(issued|approved|active|passed|matched|resolved)$/.test(t)) return "bg-[#d5f3d7] text-[#247537]";
  if (/^admin \d+$|human transfer/.test(t)) return "bg-[#e0efff] text-[#2b5fb0]";
  return "bg-[#ffeabd] text-[#8a5b00]";
}

const Pill = ({ children }: { children: string }) => (
  <span className={`inline-flex h-[19px] items-center whitespace-nowrap rounded-full px-[9px] pt-px text-[12.6px] font-normal leading-none ${pillClass(children)}`}>
    {children}
  </span>
);

/* ---------------------------------- pieces --------------------------------- */

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section
      aria-label={title}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[7px] border border-[#d6deea] bg-[#f8fbff] shadow-[0_1px_4px_rgba(20,45,90,0.08)] ${className}`}
    >
      <h2 className={`flex h-[34px] shrink-0 items-center border-b border-[#e0e8f2] bg-[#fbfcfe] px-[12px] pt-px text-[15.6px] font-semibold ${ink}`}>{title}</h2>
      {/* never clip: content taller than the panel scrolls inside it */}
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain px-[12px] pb-[10px] pt-[6px] [scrollbar-width:thin]">{children}</div>
    </section>
  );
}

function KVList({ rows }: { rows: readonly KVRow[] }) {
  return (
    <dl>
      {rows.map(([k, v]) => (
        <div key={k} className={`flex h-[26px] items-center gap-[12px] border-b border-[#e1e7f0] text-[14.2px] ${ink}`}>
          <dt className="min-w-0 flex-1 truncate pt-px">{k}</dt>
          <dd className="shrink-0 whitespace-nowrap pt-px">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function BarRow({ bar }: { bar: Bar }) {
  return (
    <div>
      <div className={`flex items-center justify-between gap-[10px] text-[14.2px] leading-[18px] ${ink}`}>
        <span className="truncate">{bar.label}</span>
        <span className="shrink-0 whitespace-nowrap">{bar.value}</span>
      </div>
      <div
        role="meter"
        aria-label={bar.label}
        aria-valuenow={bar.pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-[2px] h-[10px] overflow-hidden rounded-[2px] bg-[#e0e7ef]"
      >
        <div style={{ width: `${bar.pct}%` }} className="h-full bg-[linear-gradient(90deg,#1a5bb1_0%,#429feb_100%)]" />
      </div>
    </div>
  );
}

function Actions({ items, onAct, primary = true }: { items: string[]; onAct: (a: string) => void; primary?: boolean }) {
  return (
    <div className="mt-[7px] flex flex-wrap gap-[7px]">
      {items.map((a, i) => (
        <button key={a} type="button" onClick={() => onAct(a)} className={primary && i === 0 ? primaryBtn : outlineBtn}>
          {a}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------- screen --------------------------------- */

export default function RegisterScreen({ spec }: { spec: ScreenSpec }) {
  const router = useRouter();
  const [tab, setTab] = useState(spec.tabs[0]);
  const [q, setQ] = useState("");

  // TODO: wire each action to its API; until then the buttons do nothing.
  const act = (what: string) => void what;
  const { register, side, lower } = spec;
  const total = register.columns.reduce((a, c) => a + c.w, 0);
  const query = q.trim().toLowerCase();
  const group = screenPicker.find((s) => s.code === spec.code)?.group;
  const siblings = screenPicker.filter((s) => s.group === group);
  const rows = query ? register.rows.filter((r) => r.some((c) => c.toLowerCase().includes(query))) : register.rows;

  return (
    <SuperAdminFrame active={spec.active} demoNote>
      <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-0">
        {/* heading */}
        <div className="flex flex-col gap-3 lg:h-[48px] lg:flex-row lg:items-start lg:gap-[12px]">
          <div className="flex min-w-0 items-start gap-[8px]">
            <Radio strokeWidth={2.2} className="mt-[6px] h-[24px] w-[24px] shrink-0 text-[#1f4fd0]" aria-hidden />
            <div className="min-w-0">
              <h1 className={`text-[19px] font-medium leading-tight tracking-[-0.2px] lg:whitespace-nowrap lg:text-[21.5px] ${ink}`}>
                {spec.title}
              </h1>
              <p className={`mt-[2px] text-[13.8px] ${ink}`}>Super Admin / FY 2026–27 / Ghaziabad</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-[10px] lg:ml-auto lg:mt-[4px] lg:flex-nowrap">
            <span className="flex h-[25px] items-center rounded-[4px] border border-[#ecd8a0] bg-[#fff1c9] px-[9px] pt-px text-[12.6px] font-normal text-[#6b5200]">
              DEMO DATA
            </span>
            <label className="relative block h-[30px] w-full sm:w-[328px]">
              <span className="sr-only">Open screen</span>
              <select
                value={spec.code}
                onChange={(e) => {
                  const next = siblings.find((s) => s.code === e.target.value);
                  if (next) router.push(next.href);
                }}
                className={`h-full w-full cursor-pointer appearance-none truncate rounded-[6px] border border-[#c9d2e0] bg-white pl-[12px] pr-[30px] pt-px text-[14px] shadow-[0_1px_2px_rgba(20,45,90,0.06)] outline-none focus:border-[#5b7fe0] ${ink}`}
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

        {/* KPI tiles */}
        <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:mt-[6px] lg:h-[79px] lg:grid-cols-6 lg:gap-[11px]">
          {spec.kpis.map((k, i) => {
            const t = kpiTone[k.tone ?? defaultTones[i]];
            const Icon = kpiIcons[i];
            return (
              <div key={k.label} style={{ background: t.bg, borderColor: t.border }} className="flex min-h-[72px] min-w-0 items-center gap-[10px] rounded-[8px] border px-[12px] shadow-[0_1px_3px_rgba(20,45,90,0.06)]">
                <Icon strokeWidth={2} style={{ color: t.fg }} className="h-[30px] w-[30px] shrink-0" aria-hidden />
                <div className="min-w-0">
                  <p className={`whitespace-nowrap text-[24px] font-medium leading-none tracking-[-0.3px] ${ink}`}>{k.value}</p>
                  <p className={`mt-[3px] truncate text-[14px] leading-[16px] ${ink}`}>{k.label}</p>
                  <p className="truncate text-[12.2px] leading-[14px] text-[#4a5468]">Demo snapshot</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* tabs */}
        <div role="tablist" aria-label={`${spec.title} views`} className="flex overflow-x-auto rounded-[6px] border border-[#d9e1eb] bg-white lg:mt-[11px] lg:h-[36px] lg:shrink-0">
          {spec.tabs.map((t, i) => {
            const on = t === tab;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setTab(t);
                }}
                className={`h-[34px] min-w-[150px] flex-1 whitespace-nowrap px-[10px] pt-px text-[14.2px] lg:h-full lg:min-w-0 ${i > 0 ? "border-l border-[#d9e1eb]" : ""} ${
                  on ? "border-l-0 bg-[linear-gradient(90deg,#086eed_0%,#093cdd_100%)] text-white" : `${ink} hover:bg-[#f3f6fc]`
                } ${i === 0 ? "rounded-l-[5px]" : ""} ${i === 4 ? "rounded-r-[5px]" : ""}`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* panels */}
        <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-columns:771fr_385fr] lg:[grid-template-rows:304fr_194fr] lg:gap-[12px]">
          <Panel title={register.title}>
            <div className="flex gap-[6px]">
              <label className="flex h-[31px] min-w-0 flex-1 items-center rounded-[6px] border border-[#c9d2e0] bg-white px-[9px] focus-within:border-[#5b7fe0]">
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search records..."
                  aria-label={`Search ${register.title}`}
                  className={`h-full min-w-0 flex-1 bg-transparent pt-px text-[14px] outline-none placeholder:text-[#6b7488] ${ink}`}
                />
              </label>
              <button type="button" onClick={() => act("Filter")} className={`${outlineBtn} !h-[31px]`}>Filter</button>
              <button type="button" onClick={() => act("Export")} className={`${outlineBtn} !h-[31px]`}>Export</button>
            </div>

            <div className="mt-[10px] overflow-x-auto">
              <table className="w-full min-w-[640px] table-fixed border-collapse">
                <colgroup>
                  {register.columns.map((c) => (
                    <col key={c.label} style={{ width: `${(c.w / total) * 100}%` }} />
                  ))}
                </colgroup>
                <thead>
                  <tr className="h-[29px] bg-[#e2e9f4]">
                    {register.columns.map((c) => (
                      <th key={c.label} scope="col" className={`whitespace-nowrap px-[7px] pt-px text-[13.8px] font-medium ${ink} ${c.align === "right" ? "text-right" : "text-left"}`}>
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r[0]} className="h-[36px] border-b border-[#dce4ee]">
                      {r.map((cell, ci) => {
                        const c = register.columns[ci];
                        return (
                          <td key={ci} className={`truncate whitespace-nowrap px-[7px] pt-px text-[14.2px] ${ink} ${c.align === "right" ? "text-right" : "text-left"}`}>
                            {c.pill && cell !== "—" ? <Pill>{cell}</Pill> : cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr className="h-[36px] border-b border-[#dce4ee]">
                      <td colSpan={register.columns.length} className="px-[7px] text-[13.3px] text-[#4a5468]">No records match “{q}”.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Actions items={register.actions} onAct={act} />
          </Panel>

          <Panel title={side.title}>
            <KVList rows={side.rows} />
            <Actions items={[side.button ?? "View details"]} onAct={act} />
            {side.budget && (
              <div className="mt-[6px]">
                <BarRow bar={side.budget} />
              </div>
            )}
          </Panel>

          <Panel title={lower.title}>
            {lower.kind === "list" && (
              <>
                <KVList rows={lower.rows} />
                {lower.note && <p className="mt-[3px] text-[13.4px] leading-[18px] text-[#253f93]">{lower.note}</p>}
                <Actions items={lower.actions} onAct={act} primary={false} />
              </>
            )}
            {lower.kind === "bars" && (
              <>
                <div className="flex flex-col gap-[6px] pt-[2px]">
                  {lower.bars.map((b) => <BarRow key={b.label} bar={b} />)}
                </div>
                <Actions items={lower.actions} onAct={act} primary={false} />
              </>
            )}
            {lower.kind === "bars2" && (
              <>
                <div className="grid grid-cols-1 gap-x-[16px] gap-y-[6px] pt-[2px] sm:grid-cols-2">
                  {lower.bars.map((b) => <BarRow key={b.label} bar={b} />)}
                </div>
                <Actions items={lower.actions} onAct={act} primary={false} />
              </>
            )}
            {lower.kind === "flow" && (
              <>
                <div className="flex items-center pt-[4px]">
                  <div className={`flex h-[46px] min-w-0 flex-1 items-center justify-center rounded-[6px] border border-[#c9d8ee] bg-[linear-gradient(180deg,#f4f9ff_0%,#e6f0fc_100%)] px-[8px] text-center text-[14.2px] ${ink}`}>{lower.from}</div>
                  <span aria-hidden className={`w-[13px] shrink-0 text-center text-[13px] ${ink}`}>→</span>
                  <div className={`flex h-[46px] min-w-0 flex-1 items-center justify-center rounded-[6px] border border-[#cfe4d6] bg-[linear-gradient(180deg,#f7fdf8_0%,#eaf6ee_100%)] px-[8px] text-center text-[14.2px] ${ink}`}>{lower.to}</div>
                </div>
                <div className="mt-[6px] grid grid-cols-2 gap-[10px] rounded-[6px] border border-dashed border-[#e2c071] bg-[#fff9ed] px-[6px] py-[5px] text-[13px] leading-[18px]">
                  {[lower.yes, lower.no].map(([head, line]) => (
                    <div key={head}>
                      <p className="text-[#8a5b00]">{head}</p>
                      <p className={ink}>{line}</p>
                    </div>
                  ))}
                </div>
                <Actions items={lower.actions} onAct={act} primary={false} />
              </>
            )}
          </Panel>

          <Panel title="Priority exceptions & safeguards">
            <KVList rows={spec.safeguards} />
            <Actions items={["View history"]} onAct={act} />
          </Panel>
        </div>
      </div>
    </SuperAdminFrame>
  );
}
