"use client";

/**
 * Shared layout for SA-071 … SA-082 (design book: Super Admin | SA-071 to SA-082).
 * Page heading + demo chip + screen switcher, six KPI tiles, five tabs,
 * a 2 × 2 panel grid and the standard footer. Demo data only.
 */

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Dropdown,
  KpiTile,
  Panel,
  Pill,
  SearchField,
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
import { screens } from "./data";
import type { Action, Bar, Form, Pair, Register, Row, Screen, TableView } from "./types";

/* ------------------------------ small helpers ------------------------------ */

const tone = (text: string): PillTone => {
  const t = text.toLowerCase();
  if (/^(tested|ready|connected|verified|success|active|healthy|completed|sent|resolved|scheduled|approved|enforced|met|on track|excluded)$/.test(t)) return "green";
  if (/^(review|drill due|delayed|open|pending|paused|unassigned|restricted|pending approval|due|draft|watch|required|expiring)$/.test(t)) return "amber";
  if (/^(in progress|assigned|proposed|queued|new)$/.test(t)) return "blue";
  if (/^(failed|blocked|breached|overdue|rejected|critical)$/.test(t)) return "red";
  return toneFor(text);
};

const fill = (text: string, row: Row | undefined) => text.replace(/\$(\d)/g, (_, i) => row?.[Number(i)] ?? "—");

const btn = "flex h-[34px] shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] border-[1.5px] px-[13px] pt-px text-[13px] font-medium transition-colors";
const btnOutline = `${btn} border-[#2f4fe0] bg-white text-[#1d3fc4] hover:bg-[#f1f4ff]`;
const btnSolid = `${btn} border-[#1d4fe0] bg-[#1d4fe0] text-white shadow-[0_3px_8px_rgba(29,79,224,0.3)] hover:bg-[#1840c0]`;

/** "Label … value" rows separated by hairlines. */
function Lines({ rows, row }: { rows: Pair[]; row?: Row }) {
  return (
    <ul className="flex flex-col">
      {rows.map(([k, v]) => (
        <li key={k} className="flex min-h-[28px] items-center gap-[10px] border-b border-[#e6eaf2] py-[3px] text-[13px] font-normal text-[#1a1d36] last:border-b-0">
          <span className="min-w-0 shrink-0 whitespace-nowrap">{k}</span>
          <span className="min-w-0 flex-1 py-px text-right lg:truncate" title={fill(v, row)}>{fill(v, row)}</span>
        </li>
      ))}
    </ul>
  );
}

function Bars({ bars, caption }: { bars: Bar[]; caption?: string }) {
  return (
    <div className="mt-[6px]">
      {caption && <p className="mb-[2px] text-[11.5px] font-normal text-[#5b6a8a]">{caption}</p>}
      <ul className="flex flex-col gap-[5px]">
        {bars.map((b) => (
          <li key={b.label} className="flex items-center gap-[10px] text-[13px] font-normal text-[#1a1d36]">
            <span className="w-[124px] shrink-0 lg:truncate">{b.label}</span>
            <span className="h-[9px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#e4ebf5]" role="img" aria-label={`${b.label}: ${b.value} of ${b.max}`}>
              <span style={{ width: `${Math.min(100, (b.value / b.max) * 100)}%` }} className="block h-full rounded-full bg-[#2f7bc8]" />
            </span>
            <span className="w-[34px] shrink-0 text-right">{b.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chart({ points, note }: { points: [string, number][]; note: string }) {
  const max = Math.max(...points.map(([, v]) => v));
  return (
    <div className="flex h-full min-h-[150px] flex-col">
      <div className="flex min-h-0 flex-1 items-end justify-around gap-[14px] border-b border-[#d6dbe6] px-[10px] pt-[6px]">
        {points.map(([label, v]) => (
          <div key={label} className="flex h-full min-w-0 max-w-[90px] flex-1 flex-col items-center justify-end">
            <span className="mb-[3px] text-[12px] font-normal leading-none text-[#1a1d36]">{v}</span>
            <span style={{ height: `${Math.max(8, (v / max) * 78)}%` }} className="w-full rounded-t-[4px] bg-gradient-to-b from-[#4a8fd8] to-[#2d6cb5]" />
          </div>
        ))}
      </div>
      <div className="flex justify-around gap-[14px] px-[10px] pt-[3px] text-[12px] font-normal text-[#1a1d36]">
        {points.map(([label]) => (
          <span key={label} className="max-w-[90px] flex-1 text-center">{label}</span>
        ))}
      </div>
      <p className="mt-[5px] text-[11.5px] font-normal text-[#5b6a8a]">{note}</p>
    </div>
  );
}

/* ---------------------------------- tables --------------------------------- */

function DataTable({
  cols,
  rows,
  statusCol,
  selected,
  onSelect,
}: {
  cols: string[];
  rows: Row[];
  statusCol?: number;
  selected?: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <TableWrap>
      <Thead>
        {cols.map((c) => (
          <th key={c} className={`${th} !font-medium`}>{c}</th>
        ))}
      </Thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={cols.length} className={`${td} !font-normal py-[14px] text-center text-[#5b6a8a]`}>No records match.</td>
          </tr>
        )}
        {rows.map((r, i) => (
          <tr
            key={`${r[0]}-${i}`}
            tabIndex={onSelect ? 0 : undefined}
            aria-selected={onSelect ? selected === i : undefined}
            onClick={onSelect ? () => onSelect(i) : undefined}
            onKeyDown={onSelect ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(i)) : undefined}
            className={`border-b border-[#eef1f6] last:border-b-0 ${onSelect ? "cursor-pointer outline-none hover:bg-[#f6f8fe] focus-visible:bg-[#eef2ff]" : ""} ${onSelect && selected === i ? "bg-[#eef3ff]" : ""}`}
          >
            {r.map((c, j) => (
              <td key={j} className={`${td} !font-normal`}>
                {j === statusCol && c !== "—" ? <Pill tone={tone(c)} className="h-[19px] text-[11.5px] !font-medium">{c}</Pill> : c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}

/* ---------------------------- main panel contents --------------------------- */

function RegisterBody({
  reg,
  rows,
  setRows,
  selected,
  onSelect,
  notice,
}: {
  reg: Register;
  rows: Row[];
  setRows: (r: Row[]) => void;
  selected: number;
  onSelect: (i: number) => void;
  notice: (m: string) => void;
}) {
  const filter = reg.filter ?? { all: "All status", col: reg.statusCol };
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(!!filter.always);
  const [status, setStatus] = useState(filter.all);

  const options = useMemo(() => [filter.all, ...Array.from(new Set(rows.map((r) => r[filter.col]).filter((v) => v && v !== "—")))], [rows, filter.all, filter.col]);
  const visible = rows
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => (status === filter.all || r[filter.col] === status) && (!query.trim() || r.join(" ").toLowerCase().includes(query.trim().toLowerCase())));

  const run = (a: Action) => {
    if (a.confirm && !window.confirm(a.confirm)) return;
    if (a.setStatus) {
      setRows(rows.map((r, i) => (i === selected ? r.map((c, j) => (j === reg.statusCol ? a.setStatus! : c)) : r)));
    }
    notice(a.notice);
  };

  return (
    <div className="flex h-full flex-col gap-[8px]">
      <div className="flex flex-wrap items-center gap-[8px] lg:flex-nowrap">
        <SearchField value={query} onChange={setQuery} placeholder="Search records..." className="min-w-0 flex-1" />
        {!filter.always && (
          <button type="button" aria-pressed={showFilter} onClick={() => { setShowFilter(!showFilter); setStatus(filter.all); }} className={`${btnOutline} ${showFilter ? "!bg-[#eef2ff]" : ""}`}>
            Filter
          </button>
        )}
        <button type="button" onClick={() => notice("Export requested — masked columns, purpose and approval recorded in the audit trail (demo).")} className={btnOutline}>
          Export
        </button>
        {showFilter && <Dropdown label="Status filter" value={status} options={options} onChange={setStatus} className="w-[150px] [&_button]:!font-normal" />}
      </div>
      <DataTable cols={reg.cols} rows={visible.map((v) => v.r)} statusCol={reg.statusCol} selected={visible.findIndex((v) => v.i === selected)} onSelect={(k) => onSelect(visible[k].i)} />
      <div className="mt-auto flex flex-wrap gap-[8px] pt-[2px]">
        <button type="button" onClick={() => run(reg.actions[0])} className={btnSolid}>{reg.actions[0].label}</button>
        <button type="button" onClick={() => run(reg.actions[1])} className={btnOutline}>{reg.actions[1].label}</button>
      </div>
    </div>
  );
}

function FormBody({ form, notice }: { form: Form; notice: (m: string) => void }) {
  const [values, setValues] = useState(() => form.fields.map((f) => f.value));
  const run = (a: Action) => {
    if (a.confirm && !window.confirm(a.confirm)) return;
    notice(a.notice);
  };
  return (
    <div className="flex h-full flex-col gap-[10px]">
      <div className="grid gap-x-[14px] gap-y-[9px] sm:grid-cols-2">
        {form.fields.map((f, i) => (
          <label key={f.label} className="flex min-w-0 flex-col gap-[4px] text-[13px] font-normal text-[#1a1d36]">
            {f.label}
            {f.options ? (
              <span className="relative block">
                <select
                  value={values[i]}
                  onChange={(e) => setValues(values.map((v, k) => (k === i ? e.target.value : v)))}
                  className="h-[34px] w-full cursor-pointer appearance-none rounded-[8px] border border-[#cfd5e2] bg-white pl-[10px] pr-[30px] text-[13px] font-normal text-[#1a1d36] outline-none focus:border-[#5b6fe0]"
                >
                  {Array.from(new Set([f.value, ...f.options])).map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown strokeWidth={2.4} className="pointer-events-none absolute right-[10px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#1a1d36]" />
              </span>
            ) : (
              <input
                value={values[i]}
                onChange={(e) => setValues(values.map((v, k) => (k === i ? e.target.value : v)))}
                className="h-[34px] w-full rounded-[8px] border border-[#cfd5e2] bg-white px-[10px] text-[13px] font-normal text-[#1a1d36] outline-none focus:border-[#5b6fe0]"
              />
            )}
          </label>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap gap-[8px]">
        <button type="button" onClick={() => run(form.actions[0])} className={btnSolid}>{form.actions[0].label}</button>
        <button type="button" onClick={() => run(form.actions[1])} className={btnOutline}>{form.actions[1].label}</button>
      </div>
    </div>
  );
}

/* ----------------------------------- page ---------------------------------- */

export default function SaScreen({ id }: { id: string }) {
  const s: Screen = screens[id];
  const notice = useNotice();
  const [tab, setTab] = useState(s.tabs[0]);
  const tabIndex = s.tabs.indexOf(tab);
  const [rows, setRows] = useState<Row[]>(s.main.kind === "register" ? s.main.rows : []);
  const [selected, setSelected] = useState(0);

  const selRow = s.main.kind === "register" ? rows[selected] : undefined;

  const tabView: TableView | undefined = tabIndex > 0 ? s.tabViews[tabIndex - 1] : undefined;

  return (
    <SuperAdminFrame active={s.active}>
      {/* heading */}
      <div className="flex flex-col gap-3 lg:h-[50px] lg:flex-row lg:items-center lg:gap-[14px]">
        <div className="min-w-0">
          <h1 className="text-[21px] font-medium leading-tight tracking-[-0.5px] text-[#0b0c36] lg:whitespace-nowrap lg:text-[24px] lg:leading-none">
            {s.title}
          </h1>
          <p className="mt-[6px] text-[13px] font-normal leading-none text-[#1a1d36] lg:text-[14px]">Super Admin / FY 2026–27 / Ghaziabad</p>
        </div>
        <div className="flex flex-wrap items-center gap-[10px] lg:ml-auto lg:flex-nowrap">
          <span className="flex h-[30px] shrink-0 items-center rounded-[7px] border border-[#ecd48a] bg-[#fff4d1] px-[12px] pt-px text-[11.5px] font-medium tracking-[0.2px] text-[#8a5300]">DEMO DATA</span>
          <Dropdown
            label="Switch screen"
            value={s.title}
            options={[s.title]}
            onChange={() => {}}
            className="w-full sm:w-[330px] [&_button]:!font-normal"
            size={13.5}
          />
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:h-[78px] lg:grid-cols-6 [&_div]:!font-normal [&_p]:!font-normal">
        {s.kpis.map((k) => (
          <KpiTile key={k.label} tone={k.tone} icon={k.icon} value={k.value} label={k.label} sub="Demo snapshot" />
        ))}
      </div>

      <Tabs tabs={s.tabs} value={tab} onChange={setTab} className="[&_button]:!font-medium" />

      <div className="grid gap-[10px] lg:h-[352px] lg:grid-cols-[945fr_400fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title={tabView ? tabView.title : s.main.title} className="[&_h2]:!font-medium" bodyClassName="pt-[4px]">
          {tabView ? (
            <DataTable cols={tabView.cols} rows={tabView.rows} statusCol={tabView.statusCol} />
          ) : s.main.kind === "register" ? (
            <RegisterBody reg={s.main} rows={rows} setRows={setRows} selected={selected} onSelect={setSelected} notice={notice.show} />
          ) : (
            <FormBody form={s.main} notice={notice.show} />
          )}
        </Panel>
        <Panel title={fill(s.side.title, selRow)} className="[&_h2]:!font-medium" bodyClassName="pt-[4px]">
          <Lines rows={s.side.rows} row={selRow} />
          {s.side.bars && <Bars bars={s.side.bars} caption={s.side.barsCaption} />}
        </Panel>
      </div>

      <div className="grid gap-[10px] lg:h-[236px] lg:grid-cols-[945fr_400fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title={s.lowerLeft.title} className="[&_h2]:!font-medium" bodyClassName="pt-[4px]">
          {s.lowerLeft.chart ? (
            <Chart points={s.lowerLeft.chart.points} note={s.lowerLeft.chart.note} />
          ) : (
            <>
              {s.lowerLeft.caption && <p className="mb-[3px] text-[11.5px] font-normal text-[#5b6a8a]">{s.lowerLeft.caption}</p>}
              {s.lowerLeft.rows && <Lines rows={s.lowerLeft.rows} />}
              {s.lowerLeft.bars && <Bars bars={s.lowerLeft.bars} />}
            </>
          )}
        </Panel>
        <Panel title={s.lowerRight.title} className="[&_h2]:!font-medium" bodyClassName="pt-[4px]">
          <Lines rows={s.lowerRight.rows} />
        </Panel>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}
