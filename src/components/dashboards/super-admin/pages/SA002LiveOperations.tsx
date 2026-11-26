"use client";

/**
 * SA-002 — Live Operations & Emergency Control.
 * Notes (design brief 02): the emergency queue shows owner, priority, SLA and
 * escalation; GPS is tracked only during authorised duty, with consent and a
 * stale-data indicator; no deployment outside approved coverage without
 * authorisation; manual overrides record a reason and keep legal verification.
 * The map is a schematic, not a real map.
 */

import { useEffect, useState } from "react";
import {
  Ambulance,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CircleCheck,
  ClipboardList,
  Cog,
  FileText,
  Flame,
  Headset,
  HeartHandshake,
  Hourglass,
  LayoutGrid,
  Map,
  MapPin,
  Maximize2,
  Phone,
  Plus,
  RefreshCw,
  Route,
  Siren,
  TriangleAlert,
  Truck,
  Users,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { sectionHref } from "@/components/dashboards/shells";
import { Donut, Dot } from "@/components/dashboards/ui";
import {
  CentreDropdown,
  DateChip,
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  Pill,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  Trend,
  ViewLink,
  td,
  th,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const tabs = ["Overview", "Requests & Cases", "Service Operations", "Resources (People & Vehicles)", "Service Centres", "Coverage & Zones", "Reports & Analytics"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = {
  Overview: LayoutGrid,
  "Requests & Cases": ClipboardList,
  "Service Operations": Cog,
  "Resources (People & Vehicles)": UsersRound,
  "Service Centres": Building2,
  "Coverage & Zones": Map,
  "Reports & Analytics": BarChart3,
};

type Case = { id: string; type: string; location: string; status: string; priority: string };
const cases: Case[] = [
  { id: "MS-26-1101", type: "Cremation Support", location: "Ghaziabad", status: "In Service", priority: "High" },
  { id: "MS-26-1100", type: "Body Transportation", location: "Ghaziabad", status: "In Progress", priority: "High" },
  { id: "MS-26-1099", type: "Documentation Support", location: "Ghaziabad", status: "On the Way", priority: "Medium" },
  { id: "MS-26-1098", type: "Cremation Support", location: "Ghaziabad", status: "Scheduled", priority: "Normal" },
  { id: "MS-26-1097", type: "EWS Case (Free Service)", location: "Ghaziabad", status: "In Service", priority: "High" },
];

/** Tab → which rows of the live table it shows. */
const tabFilter: Partial<Record<Tab, (c: Case) => boolean>> = {
  "Requests & Cases": (c) => c.status !== "Scheduled",
  "Service Operations": (c) => c.status === "In Service" || c.status === "In Progress",
};

const fieldTeam = [
  { label: "On Field", value: "04", pct: "(67%)", n: 4, color: "#1f9a1f" },
  { label: "En Route", value: "01", pct: "(17%)", n: 1, color: "#1f87e8" },
  { label: "On Standby", value: "01", pct: "(17%)", n: 1, color: "#f7b500" },
  { label: "Off Duty", value: "00", pct: "(0%)", n: 0, color: "#c4cad6" },
];

const summary: { icon: LucideIcon; color: string; value: string; label: string[] }[] = [
  { icon: Flame, color: "#ef7a12", value: "08", label: ["Cremation", "(Including EWS)"] },
  { icon: FileText, color: "#2f6fe0", value: "04", label: ["Documentation", "& Approvals"] },
  { icon: Truck, color: "#1f9a2b", value: "06", label: ["Body", "Transportation"] },
  { icon: UsersRound, color: "#7a3fe0", value: "05", label: ["Family", "Assistance"] },
  { icon: HeartHandshake, color: "#ef7a12", value: "02", label: ["EWS Cases", "(Free Service)"] },
];

const milestones: { icon: LucideIcon; value: string; label: string[]; bg: string; fg: string }[] = [
  { icon: FileText, value: "24", label: ["Requests", "Received"], bg: "#eaf2ff", fg: "#2f6fe0" },
  { icon: CircleCheck, value: "22", label: ["Verified"], bg: "#e8f7e6", fg: "#1f9a2b" },
  { icon: UsersRound, value: "18", label: ["Assigned"], bg: "#fff1d6", fg: "#ef9a12" },
  { icon: Truck, value: "18", label: ["In Service"], bg: "#e8f7e6", fg: "#1f9a2b" },
  { icon: CircleCheck, value: "16", label: ["Completed"], bg: "#e8f7e6", fg: "#1f9a2b" },
];

const feed = [
  { text: "Team dispatched for MS-26-1101 (Ghaziabad)", time: "10:24 AM", color: "#1f9a1f" },
  { text: "Vehicle MV-02 started for MS-26-1100", time: "09:56 AM", color: "#1f9a1f" },
  { text: "Documents verified for MS-26-1099", time: "09:30 AM", color: "#1f87e8" },
  { text: "EWS case MS-26-1097 completed (Cremation)", time: "08:58 AM", color: "#1f9a1f" },
];

const actions: { icon: LucideIcon; label: string; bg: string; fg: string; border: string; confirm?: string; to?: string }[] = [
  { icon: Phone, label: "Emergency Response", bg: "#fdecec", fg: "#e02424", border: "#f6caca", confirm: "Start emergency response? The action and its owner are recorded in the audit log." },
  { icon: UsersRound, label: "Assign Field Team", bg: "#e8f7e6", fg: "#1f9a2b", border: "#cfe9cd" },
  { icon: Truck, label: "Deploy Vehicle", bg: "#e7f0ff", fg: "#1d5bd6", border: "#d5e3fb", confirm: "Deploy a vehicle? Deployment outside approved coverage needs authorisation." },
  { icon: Route, label: "Optimize Route", bg: "#fff5e2", fg: "#ef9a12", border: "#f6e0b5" },
  { icon: Zap, label: "Manual Override / Escalate", bg: "#f1ebff", fg: "#7a3fe0", border: "#ddd2fa", confirm: "Manual override / escalation needs a recorded reason. Continue?" },
  { icon: Plus, label: "Create Service Request", bg: "#eef4ff", fg: "#1d4fe0", border: "#d5e3fb", to: "Sewa Operations" },
];

export default function SA002LiveOperations() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [auto, setAuto] = useState(true);
  const [tick, setTick] = useState(30);
  const notice = useNotice();
  const href = (label: string) => sectionHref("super-admin", label);

  // Auto refresh countdown (data is static demo data; this only shows the timer).
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setTick((t) => (t <= 1 ? 30 : t - 1)), 1000);
    return () => window.clearInterval(id);
  }, [auto]);

  const rows = cases.filter(tabFilter[tab] ?? (() => true));

  return (
    <SuperAdminFrame active="live-operations">
      <PageHead
        icon={Headset}
        title="Live Operations & Emergency Control"
        links={["Real-time Service Monitoring", "Case Response", "Team & Vehicle Tracking", "Emergency Support"]}
      >
        <DateChip className="w-[190px]" />
        <CentreDropdown className="w-[165px]" />
        <button
          type="button"
          aria-pressed={auto}
          onClick={() => setAuto((a) => !a)}
          className={`flex h-[34px] items-center gap-[7px] whitespace-nowrap rounded-[8px] border-[1.5px] px-[14px] text-[13.5px] font-semibold ${
            auto ? "border-[#6d7fe8] bg-[#f3f7ff] text-[#2320c4]" : "border-[#c4cad6] bg-white text-[#5b6280]"
          }`}
        >
          <RefreshCw strokeWidth={2.3} className={`h-[16px] w-[16px] ${auto ? "animate-[spin_3s_linear_infinite]" : ""}`} />
          {auto ? `Auto Refresh (${tick}s)` : "Auto Refresh Off"}
        </button>
      </PageHead>

      <KpiRow cols={7}>
        <KpiTile tone="blue" icon={Users} value="24" label="Total Requests" sub={<Trend value="+12%" suffix="vs last week" />} />
        <KpiTile tone="green" icon={CircleCheck} value="12" label="In Service" sub={<Trend value="+20%" suffix="vs last week" />} />
        <KpiTile tone="orange" icon={Hourglass} value="04" label="In Progress" sub={<Trend value="-10%" down suffix="vs last week" />} />
        <KpiTile tone="red" icon={Siren} value="03" label="Emergency Cases" badge={{ text: "Immediate Action", tone: "solidRed" }} />
        <KpiTile tone="blue" icon={Ambulance} value="02" label="Vehicles Deployed" badge={{ text: "Live Tracking", tone: "blue" }} />
        <KpiTile tone="purple" icon={UsersRound} value="06" label="Field Team Members" badge={{ text: "On Duty", tone: "purple" }} />
        <KpiTile tone="sky" icon={MapPin} value="01" label="Service Centre" sub="(Ghaziabad – Active)" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} icons={tabIcons} />

      {/* Row 1 */}
      <div className="grid gap-[10px] lg:h-[226px] lg:grid-cols-[410fr_430fr_320fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title={`Active Cases — Live Status (${tab === "Overview" ? 18 : rows.length})`} icon={ClipboardList} action={<ViewLink to="Case & Workflow" />}>
          <TableWrap>
            <Thead>
              {["Case ID", "Service Type", "Location", "Status", "Priority"].map((h) => (
                <th key={h} className={`${th} px-[5px] py-[5px] text-[12px]`}>{h}</th>
              ))}
            </Thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-[#eef0f5] last:border-0 [&>td]:px-[5px] [&>td]:py-[4px] [&>td]:text-[12px]">
                  <td className={`${td} font-semibold`}>{c.id}</td>
                  <td className={td}>{c.type}</td>
                  <td className={td}>{c.location}</td>
                  <td className={td}><StatusPill className="h-[18px] w-[78px] text-[11px]">{c.status}</StatusPill></td>
                  <td className={td}><StatusPill className="h-[18px] w-[58px] text-[11px]">{c.priority}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>

        <Panel title="Live Tracking — Teams & Vehicles" icon={MapPin} bodyClassName="pb-[10px]">
          <SchematicMap onExpand={() => notice.show("Full-screen tracking opens in the detail view (demo).")} />
        </Panel>

        <Panel title="Emergency Alerts (03)" icon={Bell} action={<ViewLink to="Notification & Alerts" />} bodyClassName="flex flex-col gap-[8px]">
          {[
            { id: "MS-26-1100", tag: "Immediate Support", line: "Body at Hospital – Ghaziabad", ago: "5 min ago", color: "#e02424" },
            { id: "MS-26-1097", tag: "EWS Case", line: "Cremation Support (Free Service) (Ghaziabad)", ago: "12 min ago", color: "#f0a020" },
          ].map((a) => (
            <div key={a.id} className="flex gap-[10px] rounded-[9px] border border-[#eceff5] px-[10px] py-[7px]">
              <TriangleAlert strokeWidth={2} style={{ color: a.color }} className="mt-[2px] h-[26px] w-[26px] shrink-0" />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-[13px] font-bold">
                  {a.id} – <span className="text-[#e02424]">{a.tag}</span>
                </p>
                <p className="text-[12.5px] font-medium">{a.line}</p>
              </div>
              <span className="shrink-0 text-[11.5px] font-semibold text-[#5b6280]">{a.ago}</span>
            </div>
          ))}
          <p className="text-[11.5px] font-medium text-[#3b4256]">MS-26-1096 • Awaiting team assignment</p>
        </Panel>
      </div>

      {/* Row 2 */}
      <div className="grid gap-[10px] lg:h-[150px] lg:grid-cols-[360fr_410fr_390fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Field Team Status (06)" icon={UsersRound} action={<ViewLink to="Users & Access Control" />} bodyClassName="flex items-center gap-[16px]">
          <Donut size={96} thickness={15} segments={fieldTeam.filter((f) => f.n).map((f) => ({ value: f.n, color: f.color }))}>
            <b className="text-[22px] leading-none">06</b>
            <span className="text-[12px] font-semibold">Total</span>
          </Donut>
          <ul className="flex-1 space-y-[5px]">
            {fieldTeam.map((f) => (
              <li key={f.label} className="flex items-center gap-[7px] text-[13px] font-semibold">
                <Dot color={f.color} size={10} />
                <span className="flex-1">{f.label}</span>
                <b className="w-[24px] text-right">{f.value}</b>
                <span className="w-[44px] text-right">{f.pct}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Vehicle Status (02)" icon={Truck} action={<ViewLink to="Sewa Operations" />} bodyClassName="grid grid-cols-2 gap-[10px]">
          {[
            { id: "MV-02", model: "Maruti EECO", kind: "(Mortuary / Freezer)", status: "In Service", tone: "green" as const, dot: "#1f9a1f" },
            { id: "MV-01", model: "Force Traveller", kind: "(Mortuary)", status: "En Route", tone: "blue" as const, dot: "#1f5fc4" },
          ].map((v) => (
            <div key={v.id} className="flex flex-col justify-between rounded-[10px] border border-[#e1e5ee] bg-[#f8faff] p-[9px]">
              <div className="flex items-center gap-[10px]">
                <span className="flex h-[44px] w-[60px] shrink-0 items-center justify-center rounded-[8px] bg-white shadow-[0_1px_4px_rgba(30,50,110,0.1)]">
                  {v.id === "MV-01" ? <Ambulance strokeWidth={1.7} className="h-[32px] w-[32px] text-[#e02424]" /> : <Truck strokeWidth={1.7} className="h-[32px] w-[32px] text-[#3b4256]" />}
                </span>
                <span className="min-w-0 leading-tight">
                  <b className="block text-[14px]">{v.id}</b>
                  <span className="block text-[12px] font-semibold">{v.model}</span>
                  <span className="block text-[11px] font-medium">{v.kind}</span>
                </span>
              </div>
              <Pill tone={v.tone} className="mt-[6px] h-[22px] w-full gap-[6px] text-[12.5px]">
                <Dot color={v.dot} size={8} />
                {v.status}
              </Pill>
            </div>
          ))}
        </Panel>

        <Panel title="Service Coverage" icon={MapPin} bodyClassName="grid grid-cols-3 gap-[8px]">
          {[
            { city: "Ghaziabad", lines: ["Service Available", "(Active)"], icon: CircleCheck, bg: "#e6f6e3", fg: "#1f9a2b" },
            { city: "Noida", lines: ["Coming Soon"], icon: Hourglass, bg: "#fff1d6", fg: "#ef9a12" },
            { city: "Delhi", lines: ["Coming Soon"], icon: Hourglass, bg: "#fff1d6", fg: "#ef9a12" },
          ].map((c) => (
            <div key={c.city} style={{ background: c.bg }} className="flex flex-col items-center justify-center rounded-[10px] px-[4px] text-center">
              <c.icon strokeWidth={2} style={{ color: c.fg }} className="h-[28px] w-[28px]" />
              <b className="mt-[4px] text-[14px] leading-tight">{c.city}</b>
              {c.lines.map((l) => (
                <span key={l} className="text-[11.5px] font-semibold leading-tight">{l}</span>
              ))}
            </div>
          ))}
        </Panel>
      </div>

      {/* Row 3 */}
      <div className="grid gap-[10px] lg:h-[140px] lg:grid-cols-[405fr_407fr_350fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Today's Operations Summary" icon={BarChart3} bodyClassName="grid grid-cols-3 gap-y-3 sm:grid-cols-5 lg:divide-x lg:divide-[#e3e7ef] lg:gap-y-0">
          {summary.map((s) => (
            <div key={s.label[0]} className="flex flex-col items-center justify-center text-center">
              <s.icon strokeWidth={2} style={{ color: s.color }} className="h-[22px] w-[22px]" />
              <b className="mt-[3px] text-[17px] leading-none">{s.value}</b>
              {s.label.map((l) => (
                <span key={l} className="text-[10.8px] font-semibold leading-tight">{l}</span>
              ))}
            </div>
          ))}
        </Panel>

        <Panel title="Request milestones" note="(today, cumulative)" icon={Zap} bodyClassName="flex items-center justify-between gap-[2px] overflow-x-auto">
          {milestones.map((m, i) => (
            <div key={m.label[0]} className="flex items-center">
              {i > 0 && <ArrowRight strokeWidth={2.4} className="mx-[2px] h-[13px] w-[13px] shrink-0 text-[#1d4fe0]" />}
              <div style={{ background: m.bg }} className="flex h-[78px] w-[62px] flex-col items-center justify-center rounded-[10px] text-center">
                <m.icon strokeWidth={2} style={{ color: m.fg }} className="h-[20px] w-[20px]" />
                <b className="mt-[2px] text-[16px] leading-none">{m.value}</b>
                {m.label.map((l) => (
                  <span key={l} className="text-[10.5px] font-semibold leading-tight">{l}</span>
                ))}
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Live Activity Feed" icon={Bell} action={<ViewLink to="Audit Logs" />} bodyClassName="flex flex-col justify-between">
          {feed.map((f) => (
            <div key={f.text} className="flex items-center gap-[8px] text-[12.2px] font-semibold">
              <Dot color={f.color} size={8} />
              <span className="min-w-0 flex-1 truncate">{f.text}</span>
              <span className="shrink-0">{f.time}</span>
            </div>
          ))}
          <p className="text-[10.8px] font-medium text-[#5b6280]">GPS freshness, driver and SLA in detail view</p>
        </Panel>
      </div>

      {/* Quick actions */}
      <Panel title="Quick Actions — Emergency Control" icon={Zap} className="lg:h-[80px]" bodyClassName="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-6 lg:pt-[4px]">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => {
              if (a.to) return window.location.assign(href(a.to));
              if (a.confirm && !window.confirm(a.confirm)) return;
              notice.show(`${a.label}: request recorded (demo).`);
            }}
            style={{ background: a.bg, borderColor: a.border }}
            className="flex min-h-[34px] min-w-0 items-center justify-center gap-[8px] rounded-[9px] border px-[8px] py-[4px] text-center text-[12.8px] font-semibold hover:brightness-95 lg:h-[34px] lg:py-0"
          >
            <a.icon strokeWidth={2} style={{ color: a.fg }} className="h-[17px] w-[17px] shrink-0" />
            <span className="pt-px leading-tight lg:truncate">{a.label}</span>
          </button>
        ))}
      </Panel>
      {notice.node}
    </SuperAdminFrame>
  );
}

/** Schematic (not geographic) view of teams and vehicles around the centre. */
function SchematicMap({ onExpand }: { onExpand: () => void }) {
  return (
    <div className="relative h-[150px] overflow-hidden rounded-[10px] border border-[#e1e5ee] bg-[#eef3ea] lg:h-full">
      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <rect width="400" height="160" fill="#eef2ec" />
        <path d="M0 40 C80 60 120 30 210 50 S330 90 400 70" stroke="#ffffff" strokeWidth="7" fill="none" />
        <path d="M20 160 C70 110 110 100 160 70 S240 20 260 0" stroke="#ffffff" strokeWidth="6" fill="none" />
        <path d="M120 160 C160 120 220 120 300 100 S380 110 400 120" stroke="#ffffff" strokeWidth="5" fill="none" />
        <path d="M0 100 C60 95 120 115 200 110" stroke="#f6e7b8" strokeWidth="4" fill="none" />
        <path d="M60 0 C90 40 100 80 90 160" stroke="#d8e6f3" strokeWidth="6" fill="none" />
        <path d="M150 70 C190 60 230 75 262 95" stroke="#1f9a2b" strokeWidth="2.5" fill="none" />
        <path d="M262 95 C290 110 300 125 320 140" stroke="#f0a020" strokeWidth="2.5" strokeDasharray="5 4" fill="none" />
      </svg>
      {[
        ["Delhi", "left-[16%] top-[30%]"],
        ["Ghaziabad", "left-[44%] top-[12%]"],
        ["Noida", "left-[50%] top-[80%]"],
      ].map(([n, pos]) => (
        <span key={n} className={`absolute ${pos} text-[13px] font-bold text-[#0b0c36]`}>{n}</span>
      ))}
      {["left-[34%] top-[18%]", "left-[12%] top-[58%]", "left-[30%] top-[66%]"].map((p) => (
        <MapPin key={p} strokeWidth={2.2} className={`absolute ${p} h-[20px] w-[20px] fill-[#dbe7ff] text-[#1d5bd6]`} />
      ))}
      {["left-[26%] top-[6%]", "left-[38%] top-[62%]"].map((p) => (
        <Truck key={p} strokeWidth={2.2} className={`absolute ${p} h-[20px] w-[20px] text-[#1f9a2b]`} />
      ))}
      <div className="absolute left-[45%] top-[38%] flex items-center gap-[5px] rounded-[8px] border-[1.5px] border-[#1f9a2b] bg-white px-[6px] py-[3px] shadow">
        <Building2 strokeWidth={2} className="h-[18px] w-[18px] text-[#1f9a2b]" />
        <span className="text-[10px] font-bold leading-tight">Ghaziabad<br /><span className="font-semibold">Service Centre</span><br /><span className="font-semibold">(Active)</span></span>
      </div>
      <ul className="absolute right-[8px] top-[26px] space-y-[2px] rounded-[8px] bg-white/95 px-[8px] py-[5px] text-[10.5px] font-semibold shadow">
        <li className="flex items-center gap-[5px]"><Truck strokeWidth={2.2} className="h-[12px] w-[12px] text-[#1f9a2b]" />Vehicle (02)</li>
        <li className="flex items-center gap-[5px]"><Users strokeWidth={2.2} className="h-[12px] w-[12px] text-[#1d5bd6]" />Field Team (06)</li>
        <li className="flex items-center gap-[5px]"><span className="h-[2px] w-[12px] bg-[#1f9a2b]" />On Route</li>
        <li className="flex items-center gap-[5px]"><span className="h-0 w-[12px] border-t-2 border-dashed border-[#f0a020]" />In Service</li>
        <li className="flex items-center gap-[5px]"><span className="h-0 w-[12px] border-t-2 border-dashed border-[#9aa1b5]" />Standby</li>
      </ul>
      <button type="button" onClick={onExpand} aria-label="Expand map" className="absolute right-[8px] top-[4px] flex h-[20px] w-[20px] items-center justify-center rounded-[4px] bg-white shadow">
        <Maximize2 strokeWidth={2.2} className="h-[12px] w-[12px]" />
      </button>
    </div>
  );
}

