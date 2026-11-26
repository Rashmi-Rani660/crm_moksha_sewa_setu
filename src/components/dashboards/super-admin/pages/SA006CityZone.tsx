"use client";

/**
 * SA-006 — City, Zone & Service Centre Management.
 * Notes (design brief 06): only Ghaziabad is active; Delhi and Noida are
 * coming soon. Centre and PIN counts are demo values, not verified coverage.
 * Activation needs readiness checks and approval; validate PINs, keep change
 * history, sync the website; archive instead of delete.
 */

import { useState } from "react";
import {
  ArrowDown,
  ArrowLeftRight,
  Building,
  Building2,
  ChartLine,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  Globe,
  Hourglass,
  Landmark,
  Layers,
  ListTree,
  MapPin,
  MapPinPlus,
  Monitor,
  MoreVertical,
  Pencil,
  RefreshCw,
  Settings,
  SquarePlus,
  Truck,
  UsersRound,
  Waypoints,
  Zap,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";
import {
  Checkbox,
  Dropdown,
  KpiRow,
  KpiTile,
  PageHead,
  Pager,
  Panel,
  SearchField,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Thead,
  td,
  th,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const tabs: { label: string; icon?: LucideIcon }[] = [
  { label: "State Management" },
  { label: "City Management" },
  { label: "Zone Management", icon: Layers },
  { label: "Service Centre Management", icon: Building2 },
  { label: "Coverage Areas & PIN Codes", icon: MapPin },
  { label: "Expansion Planning", icon: ChartLine },
];

const cities = [
  { code: "CT-001", name: "Ghaziabad", state: "Uttar Pradesh", zones: "03", centres: "01", pins: "12", status: "Active" },
  { code: "CT-002", name: "Noida", state: "Uttar Pradesh", zones: "02", centres: "00", pins: "08", status: "Coming Soon" },
  { code: "CT-003", name: "Delhi", state: "Delhi (NCT)", zones: "02", centres: "00", pins: "08", status: "Coming Soon" },
];

const states = ["All States / UTs", "Uttar Pradesh", "Delhi (NCT)"] as const;
const statusList = ["All Status", "Active", "Coming Soon"] as const;

const serviceStatus = [
  { label: "Active", sub: "Services live & available", bg: "#e4f6e2", dot: "#1f9a1f" },
  { label: "Coming Soon", sub: "Service begins shortly", bg: "#fff1d6", dot: "#f0a020" },
  { label: "Planned", sub: "In expansion pipeline", bg: "#e7f0ff", dot: "#6aa6ee" },
  { label: "Temporarily Suspended", sub: "Service paused", bg: "#fde4e4", dot: "#e02424" },
  { label: "Inactive", sub: "Not in operation", bg: "#eef0f4", dot: "#9aa1b5" },
];

const functions: { icon: LucideIcon; label: string[] }[] = [
  { icon: MapPin, label: ["PIN Code", "Mapping"] },
  { icon: Monitor, label: ["Website", "Coverage Sync"] },
  { icon: UsersRound, label: ["City / Centre", "Activation Control"] },
  { icon: UsersRound, label: ["Staff / Volunteer", "Mapping"] },
  { icon: Truck, label: ["Vehicle", "Allocation"] },
  { icon: Settings, label: ["Service", "Availability"] },
  { icon: ArrowLeftRight, label: ["Auto/Manual", "Request Routing"] },
  { icon: Clock3, label: ["Working", "Hours"] },
  { icon: ArrowLeftRight, label: ["Inter-Centre", "Transfer"] },
  { icon: FileText, label: ["Change", "History (Audit)"] },
];

const hierarchy: { icon: LucideIcon; color: string; bold: string; rest: string }[] = [
  { icon: Globe, color: "#2f6fe0", bold: "Country", rest: "India" },
  { icon: Landmark, color: "#2f6fe0", bold: "State / Union Territory", rest: "Uttar Pradesh, Delhi" },
  { icon: MapPin, color: "#d6336c", bold: "City", rest: "Ghaziabad, Noida, Delhi" },
  { icon: Layers, color: "#e02424", bold: "Zone", rest: "Operational zones within a city" },
  { icon: SquarePlus, color: "#f0a020", bold: "Service Centre", rest: "City/zone-wise service centre" },
  { icon: MapPin, color: "#1f9a2b", bold: "Coverage Area", rest: "Locality, Ward & PIN Code" },
];

const quick: { icon: LucideIcon; color: string; label: string }[] = [
  { icon: Landmark, color: "#2f6fe0", label: "Add New State" },
  { icon: MapPinPlus, color: "#2f6fe0", label: "Add New City" },
  { icon: Layers, color: "#1f9a2b", label: "Create / Manage Zone" },
  { icon: SquarePlus, color: "#2f6fe0", label: "Add / Manage Service Centre" },
  { icon: MapPin, color: "#f0a020", label: "Map Coverage Area / PIN Codes" },
  { icon: UsersRound, color: "#2f6fe0", label: "Assign Team & Resources" },
];

export default function SA006CityZone() {
  const notice = useNotice();
  const [tab, setTab] = useState(1);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<(typeof states)[number]>("All States / UTs");
  const [status, setStatus] = useState<(typeof statusList)[number]>("All Status");
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();
  const rows = cities.filter(
    (c) =>
      (state === "All States / UTs" || c.state === state) &&
      (status === "All Status" || c.status === status) &&
      (!q || `${c.code} ${c.name}`.toLowerCase().includes(q)),
  );

  return (
    <SuperAdminFrame active="city-zone-centres">
      <PageHead
        icon={MapPin}
        title="City, Zone & Service Centre Management"
        links={["Setup Service Geography", "City & Zone Management", "Service Centre Setup", "Coverage & PIN Code Mapping", "Expansion Planning"]}
      />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Building} value="02" label="Registered States / UTs" />
        <KpiTile tone="green" icon={MapPin} value="03" label="Registered Cities" />
        <KpiTile tone="green" icon={CircleCheck} value="01" label="Active Cities" />
        <KpiTile tone="orange" icon={Hourglass} value="02" label="Upcoming Cities" />
        <KpiTile tone="purple" icon={SquarePlus} value="01" label="Active Service Centre" />
        <KpiTile tone="sky" icon={Waypoints} value="28" label="mapped PINs (demo)" />
      </KpiRow>

      <div role="tablist" className="flex gap-[8px] overflow-x-auto lg:h-[38px]">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`flex h-[38px] shrink-0 items-center justify-center gap-[8px] whitespace-nowrap rounded-[9px] border px-[14px] pt-px text-[13.5px] font-semibold shadow-[0_2px_6px_rgba(30,50,110,0.06)] lg:flex-1 ${
              tab === i ? "border-[#1d4fe0] bg-[#1d4fe0] text-white" : i === 0 ? "border-[#1d4fe0] bg-white" : "border-[#e1e5ee] bg-white hover:bg-[#f4f6fc]"
            }`}
          >
            {t.icon && <t.icon strokeWidth={2} className="h-[17px] w-[17px]" />}
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-[12px] lg:h-[566px] lg:grid-cols-[855fr_307fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <div className="flex min-h-0 min-w-0 flex-col gap-[10px]">
          <Panel
            title={<span className="text-[18px]">City List (03)</span>}
            icon={Building2}
            className="lg:h-[300px]"
            action={
              <div className="hidden items-center gap-[8px] lg:flex">
                <SearchField value={query} onChange={setQuery} placeholder="Search by City Name or Code..." className="w-[230px]" />
                <Dropdown label="State / UT" value={state} options={states} onChange={setState} className="w-[140px]" />
                <Dropdown label="Status" value={status} options={statusList} onChange={setStatus} className="w-[120px]" />
                <button type="button" aria-label="Reset filters" onClick={() => { setQuery(""); setState("All States / UTs"); setStatus("All Status"); }} className="flex h-[34px] w-[38px] items-center justify-center rounded-[8px] border-[1.5px] border-[#6d7fe8] bg-[#f3f7ff] text-[#2320c4] hover:bg-[#e9f0ff]">
                  <RefreshCw strokeWidth={2.3} className="h-[16px] w-[16px]" />
                </button>
              </div>
            }
            bodyClassName="flex flex-col pt-[10px]"
          >
            <div className="mb-2 flex flex-wrap gap-2 lg:hidden">
              <SearchField value={query} onChange={setQuery} placeholder="Search by City Name or Code..." className="w-full" />
              <Dropdown label="State / UT" value={state} options={states} onChange={setState} className="w-[150px]" />
              <Dropdown label="Status" value={status} options={statusList} onChange={setStatus} className="w-[130px]" />
            </div>
            <TableWrap>
              <Thead>
                <th className={`${th} w-[30px]`} />
                {["City Code", "City Name", "State / UT", "Zones", "Service Centres", "Coverage Areas (PIN Codes)", "Service Status", "Action"].map((h) => (
                  <th key={h} className={`${th} text-center`}>{h === "Coverage Areas (PIN Codes)" ? <>Coverage Areas<br />(PIN Codes)</> : h}</th>
                ))}
              </Thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.code} className="border-b border-[#eef0f5]">
                    <td className={td}>
                      <Checkbox checked={picked.has(c.code)} label="" onChange={() => setPicked((p) => { const n = new Set(p); if (n.has(c.code)) n.delete(c.code); else n.add(c.code); return n; })} />
                    </td>
                    <td className={`${td} py-[11px] text-center font-semibold`}>{c.code}</td>
                    <td className={`${td} text-[14px] font-semibold`}>
                      <span className="flex items-center gap-[8px]"><Building strokeWidth={2} className="h-[17px] w-[17px] text-[#f0a020]" />{c.name}</span>
                    </td>
                    <td className={`${td} text-center`}>{c.state}</td>
                    <td className={`${td} text-center`}>{c.zones}</td>
                    <td className={`${td} text-center`}>{c.centres}</td>
                    <td className={`${td} text-center`}>{c.pins}</td>
                    <td className={`${td} text-center`}><StatusPill className="w-[100px] h-[22px]">{c.status}</StatusPill></td>
                    <td className={`${td} text-center`}>
                      <div className="flex items-center justify-center gap-[8px] text-[#1d4fe0]">
                        <button type="button" aria-label={`View ${c.name}`} onClick={() => notice.show(`${c.name}: zones, centres and PIN codes (demo).`)}><Eye strokeWidth={2.2} className="h-[17px] w-[17px]" /></button>
                        <button type="button" aria-label={`Edit ${c.name}`} onClick={() => notice.show(`${c.name}: changes are kept in change history (demo).`)}><Pencil strokeWidth={2.2} className="h-[16px] w-[16px]" /></button>
                        <button type="button" aria-label={`More for ${c.name}`} onClick={() => notice.show(`${c.name}: activate / archive needs approval — no delete (demo).`)} className="text-[#0b0c36]"><MoreVertical strokeWidth={2.2} className="h-[16px] w-[16px]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr><td colSpan={9} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">No cities match these filters.</td></tr>
                )}
              </tbody>
            </TableWrap>
            <div className="mt-auto flex items-center justify-between pt-[8px]">
              <p className="text-[12px] font-medium text-[#3b4256]">Showing 1–{rows.length} of {rows.length} cities • PIN mapping is illustrative</p>
              <Pager page={page} pages={1} onChange={setPage} />
            </div>
          </Panel>

          <Panel title={<>Service Status <span className="text-[13px] font-medium">(Coverage Display on Website)</span></>} icon={MapPin} label="Service Status" className="lg:h-[104px]" bodyClassName="grid grid-cols-2 gap-[8px] sm:grid-cols-5">
            {serviceStatus.map((s) => (
              <div key={s.label} style={{ background: s.bg }} className="flex items-center gap-[8px] rounded-[8px] px-[10px] py-[6px]">
                <span style={{ background: s.dot }} className="h-[13px] w-[13px] shrink-0 rounded-full" />
                <span className="leading-tight">
                  <b className="block text-[13px]">{s.label}</b>
                  <span className="text-[11px] font-medium">{s.sub}</span>
                </span>
              </div>
            ))}
          </Panel>

          <Panel title="Key Functionalities" icon={ChartLine} className="min-h-0 lg:flex-1" bodyClassName="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10">
            {functions.map((f, i) => (
              <button
                key={f.label.join()}
                type="button"
                onClick={() => notice.show(`${f.label.join(" ")} (demo).`)}
                className={`flex min-h-[64px] flex-col items-center justify-center gap-[3px] px-[2px] text-center hover:bg-[#f4f6fc] ${i ? "lg:border-l lg:border-[#e3e7ef]" : ""}`}
              >
                <f.icon strokeWidth={2} className="h-[22px] w-[22px] text-[#2f6fe0]" />
                {f.label.map((l) => (
                  <span key={l} className="whitespace-nowrap text-[11px] font-semibold leading-tight">{l}</span>
                ))}
              </button>
            ))}
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[12px]">
          <Panel title="Geographical Hierarchy" icon={ListTree} titleSize={16.5} bodyClassName="flex flex-col items-stretch gap-0 pt-[6px]">
            {hierarchy.map((h, i) => (
              <div key={h.bold} className="flex flex-col items-center">
                {i > 0 && <ArrowDown strokeWidth={2.4} className="h-[12px] w-[12px] text-[#3b4256]" />}
                <div className="flex w-full items-center gap-[10px] rounded-[8px] border border-[#dfe5f3] bg-[#f6f8fd] px-[10px] py-[5px]">
                  <h.icon strokeWidth={2} style={{ color: h.color }} className="h-[17px] w-[17px] shrink-0" />
                  <span className="text-[12px] font-medium leading-tight"><b className="font-bold">{h.bold}</b> – {h.rest}</span>
                </div>
              </div>
            ))}
          </Panel>

          <Panel title="Quick Actions" icon={Zap} titleSize={16.5} bodyClassName="flex flex-col pt-[4px]">
            {quick.map((a) => (
              <button key={a.label} type="button" onClick={() => notice.show(`${a.label}: needs readiness check and approval (demo).`)} className="flex min-h-[32px] flex-1 items-center gap-[10px] border-b border-[#eef0f5] px-[4px] text-left last:border-0 hover:bg-[#f6f8fd]">
                <a.icon strokeWidth={2} style={{ color: a.color }} className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1 text-[12.8px] font-semibold">{a.label}</span>
                <ChevronRight strokeWidth={2.4} className="h-[15px] w-[15px]" />
              </button>
            ))}
          </Panel>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}
