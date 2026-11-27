"use client";

/**
 * Shared layout for SA-021 … SA-030: heading, six KPI tiles, tabs, a main panel
 * with a side panel, and a full-width panel below. Demo data only.
 */

import { useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import {
  KpiTile,
  Panel,
  Pill,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  th,
  td,
  toneFor,
  useNotice,
  type PillTone,
} from "@/components/dashboards/super-admin/kit";
import { ScreenSwitch, sectionScreens } from "@/components/dashboards/super-admin/screen-switch";
import { screens } from "./data";
import type { Action, Bar, Pair, Screen, Tbl } from "./types";

/* ---------------------------------- helpers --------------------------------- */

const tone = (text: string): PillTone => {
  const t = text.toLowerCase();
  if (/^(available|verified|completed|active|connected|on duty|resolved|ready|enabled|synced|healthy|approved)$/.test(t)) return "green";
  if (/^(open|assigned|on field|en route|in service|new)$/.test(t)) return "blue";
  if (/^(pending|review|due soon|unassigned|delayed|coming soon)$/.test(t)) return "amber";
  if (/^(low stock|overdue|failed|expired)$/.test(t)) return "red";
  return toneFor(text);
};

const fill = (text: string, row?: string[]) =>
  text
    .replace(/\$@(\d)/g, (_, i) => (row?.[Number(i)] ?? "—").split(" · ")[0])
    .replace(/\$#(\d)/g, (_, i) => (row?.[Number(i)] ?? "").replace(/\D/g, "").slice(-2))
    .replace(/\$(\d)/g, (_, i) => row?.[Number(i)] ?? "—");

const btn = "flex h-[32px] shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] border-[1.5px] px-[12px] pt-px text-[12.5px] font-medium transition-colors";
const btnSolid = `${btn} border-[#1d4fe0] bg-[#1d4fe0] text-white hover:bg-[#1840c0]`;
const btnOutline = `${btn} border-[#2f4fe0] bg-white text-[#1d3fc4] hover:bg-[#f1f4ff]`;

function Value({ v }: { v: string }) {
  return v.startsWith("*") ? <Pill tone={tone(v.slice(1))} className="h-[19px] text-[11.5px] !font-medium">{v.slice(1)}</Pill> : <>{v}</>;
}

function Buttons({ actions, notice, className = "" }: { actions: Action[]; notice: (m: string) => void; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-[8px] ${className}`}>
      {actions.map((a, i) => (
        <button
          key={a.label}
          type="button"
          onClick={() => {
            if (a.confirm && !window.confirm(a.confirm)) return;
            notice(a.notice);
          }}
          className={i === 0 ? btnSolid : btnOutline}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

function Lines({ rows, row }: { rows: Pair[]; row?: string[] }) {
  return (
    <ul className="flex flex-col">
      {rows.map(([k, v]) => (
        <li key={k} className="flex min-h-[29px] items-center gap-[10px] border-b border-[#e6eaf2] py-[3px] text-[13px] font-normal text-[#1a1d36] last:border-b-0">
          <span className="min-w-0 shrink-0 whitespace-nowrap">{k}</span>
          <span className="min-w-0 flex-1 py-px text-right lg:truncate">
            <Value v={fill(v, row)} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Bars({ bars }: { bars: Bar[] }) {
  return (
    <ul className="flex flex-col gap-[7px] py-[3px]">
      {bars.map((b) => (
        <li key={b.label} className="flex items-center gap-[10px] text-[13px] font-normal text-[#1a1d36]">
          <span className="w-[112px] shrink-0 leading-[1.2]">{b.label}</span>
          <span className="h-[9px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#e4ebf5]" role="img" aria-label={`${b.label}: ${b.pct}%`}>
            <span style={{ width: `${b.pct}%` }} className="block h-full rounded-full bg-[#2f7bc8]" />
          </span>
          <span className="w-[36px] shrink-0 text-right">{b.pct}%</span>
        </li>
      ))}
    </ul>
  );
}

function DataTable({ t, selected, onSelect, compact = false }: { t: Tbl; selected?: number; onSelect?: (i: number) => void; compact?: boolean }) {
  const pad = compact ? "!py-[6px]" : "!py-[8px]";
  return (
    <TableWrap>
      <Thead>
        {t.cols.map((c) => (
          <th key={c} className={`${th} !font-medium`}>{c}</th>
        ))}
      </Thead>
      <tbody>
        {t.rows.map((r, i) => (
          <tr
            key={`${r[0]}-${i}`}
            tabIndex={onSelect ? 0 : undefined}
            aria-selected={onSelect ? selected === i : undefined}
            onClick={onSelect ? () => onSelect(i) : undefined}
            onKeyDown={onSelect ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(i)) : undefined}
            className={`border-b border-[#eef1f6] last:border-b-0 ${onSelect ? "cursor-pointer outline-none hover:bg-[#f6f8fe] focus-visible:bg-[#eef2ff]" : ""} ${onSelect && selected === i ? "bg-[#eef3ff]" : ""}`}
          >
            {r.map((c, j) => {
              const asPill = c.startsWith("*") || (t.pill?.includes(j) && c !== "—" && !!c);
              const text = c.startsWith("*") ? c.slice(1) : c;
              return (
                <td key={j} className={`${td} ${pad} !font-normal`}>
                  {asPill ? <Pill tone={tone(text)} className="h-[19px] text-[11.5px] !font-medium">{text}</Pill> : text}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}

function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="my-[4px] flex flex-wrap items-center gap-y-[8px] lg:flex-nowrap">
      {steps.map((s, i) => (
        <div key={s} className="flex min-w-0 flex-1 items-center basis-[140px] lg:basis-0">
          <span className="flex h-[40px] min-w-0 flex-1 items-center justify-center rounded-[8px] border border-[#d6e1f5] bg-gradient-to-b from-[#f8fbff] to-[#e6eefb] px-2 text-[13px] font-normal text-[#1a1d36] shadow-[0_2px_4px_rgba(30,50,110,0.06)]">{s}</span>
          {i < steps.length - 1 && <ArrowRight strokeWidth={2} className="mx-[6px] h-[15px] w-[15px] shrink-0 text-[#2f4fe0]" />}
        </div>
      ))}
    </div>
  );
}

function Readonly({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-[3px] text-[12.5px] font-normal text-[#1a1d36]">{label}</p>
      <p className="truncate rounded-[8px] border border-[#d6dbe6] bg-[#eef1f7] px-[10px] py-[7px] text-[13px] font-normal text-[#1a1d36]">{value}</p>
    </div>
  );
}

/* ----------------------------------- page ---------------------------------- */

export default function SaScreen2({ id }: { id: string }) {
  const s: Screen = screens[id];
  const notice = useNotice();
  const [tab, setTab] = useState(s.tabs[0]);
  const [selected, setSelected] = useState(s.main.selected ?? 0);
  const [reply, setReply] = useState("");
  const tabIndex = s.tabs.indexOf(tab);
  const view = tabIndex > 0 ? s.tabViews[tabIndex - 1] : undefined;
  const row = s.main.table.rows[selected];
  const Icon = s.icon;

  const side = s.side;
  const sideBody: ReactNode = (() => {
    switch (side.kind) {
      case "kv":
        return (
          <>
            {side.bars && side.barsFirst && <Bars bars={side.bars} />}
            <Lines rows={side.rows} row={row} />
            {side.bars && !side.barsFirst && <div className="mt-[4px]"><Bars bars={side.bars} /></div>}
          </>
        );
      case "kv-actions":
        return (
          <>
            <Lines rows={side.rows} row={row} />
            <Buttons actions={side.actions} notice={notice.show} className="mt-[10px]" />
          </>
        );
      case "fields":
        return (
          <>
            <div className="mb-[6px] grid grid-cols-2 gap-x-[10px] gap-y-[8px]">
              {side.fields.map(([k, v]) => (
                <Readonly key={k} label={k} value={fill(v, row)} />
              ))}
            </div>
            <Lines rows={side.rows} row={row} />
            {side.actions && <Buttons actions={side.actions} notice={notice.show} className="mt-[10px]" />}
          </>
        );
      case "thread":
        return (
          <>
            <Lines rows={side.rows} row={row} />
            <div className="mt-[8px] flex flex-col gap-[8px]">
              {side.bubbles.map(([dir, text]) => (
                <p
                  key={text}
                  className={`max-w-[92%] rounded-[8px] border px-[11px] py-[7px] text-[12.5px] font-normal leading-[1.35] text-[#1a1d36] ${
                    dir === "in" ? "self-start border-[#d6dbe6] bg-[#eef1f7]" : "self-end border-[#cfe9cd] bg-[#e3f5e1]"
                  }`}
                >
                  {text}
                </p>
              ))}
            </div>
            {side.input && (
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={side.input}
                aria-label={side.input}
                className="mt-[8px] h-[32px] w-full rounded-[8px] border border-[#cfd5e2] bg-white px-[10px] text-[13px] font-normal text-[#1a1d36] outline-none placeholder:text-[#6b7390] focus:border-[#5b6fe0]"
              />
            )}
            <Buttons actions={side.actions} notice={(m) => { notice.show(m); setReply(""); }} className="mt-[8px]" />
          </>
        );
      case "table":
        return (
          <>
            <DataTable t={side.table} compact />
            <div className="mt-[2px]"><Lines rows={side.rows} /></div>
            <Buttons actions={side.actions} notice={notice.show} className="mt-[8px]" />
          </>
        );
    }
  })();

  return (
    <SuperAdminFrame active={s.active}>
      {/* heading */}
      <div className="flex flex-col gap-3 lg:h-[50px] lg:flex-row lg:items-center lg:gap-[14px]">
        <div className="flex min-w-0 items-center gap-[12px]">
          <Icon strokeWidth={1.9} className="h-[26px] w-[26px] shrink-0 text-[#1d5bd6]" />
          <div className="min-w-0">
            <h1 className="text-[21px] font-medium leading-tight tracking-[-0.5px] text-[#0b0c36] lg:whitespace-nowrap lg:text-[24px] lg:leading-none">{s.title}</h1>
            <p className="mt-[6px] text-[13px] font-normal leading-none text-[#1a1d36] lg:text-[14px]">Super Admin / FY 2026–27 / Ghaziabad</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-[10px] lg:ml-auto lg:flex-nowrap">
          <span className="flex h-[30px] shrink-0 items-center rounded-[7px] border border-[#ecd48a] bg-[#fff4d1] px-[12px] pt-px text-[11.5px] font-medium tracking-[0.2px] text-[#8a5300]">DEMO DATA</span>
          <ScreenSwitch current={s.id} screens={sectionScreens(s.active)} />
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:h-[78px] lg:grid-cols-6 [&_div]:!font-normal [&_p]:!font-normal">
        {s.kpis.map((k) => (
          <KpiTile key={k.label} tone={k.tone} icon={k.icon} value={k.value} label={k.label} sub="Demo snapshot" />
        ))}
      </div>

      <Tabs tabs={s.tabs} value={tab} onChange={setTab} className="[&_button]:!font-medium" />

      <div className="grid gap-[10px] lg:h-[378px] lg:grid-cols-[945fr_400fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title={view ? view.title : s.main.title} className="[&_h2]:!font-medium" bodyClassName="pt-[4px]">
          {view ? (
            <DataTable t={view.table} />
          ) : (
            <div className="flex h-full flex-col gap-[10px]">
              <DataTable t={s.main.table} selected={selected} onSelect={setSelected} />
              <Buttons actions={s.main.actions} notice={notice.show} />
              {s.main.nested && (
                <section className="rounded-[10px] border border-[#e1e5ee] bg-white px-[10px] pb-[6px] pt-[8px]">
                  <h3 className="mb-[4px] text-[14px] font-medium text-[#0b0c36]">{s.main.nested.title}</h3>
                  <DataTable t={s.main.nested.table} compact />
                </section>
              )}
            </div>
          )}
        </Panel>
        <Panel title={fill(side.title, row)} className="[&_h2]:!font-medium" bodyClassName="pt-[4px]">
          {sideBody}
        </Panel>
      </div>

      <Panel title={s.bottom.title} className="lg:h-[202px] [&_h2]:!font-medium" bodyClassName="pt-[4px]">
        {s.bottom.steps && <Flow steps={s.bottom.steps} />}
        {s.bottom.rows && <Lines rows={s.bottom.rows} row={row} />}
        {s.bottom.table && <DataTable t={s.bottom.table} compact />}
      </Panel>
      {notice.node}
    </SuperAdminFrame>
  );
}
