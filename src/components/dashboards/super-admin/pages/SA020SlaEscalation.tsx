"use client";

/** SA-020 — SLA & Escalation Management. Demo data. */

import { useState } from "react";
import {
  ArrowDown,
  BarChart3,
  Bell,
  CircleAlert,
  CircleCheck,
  Crown,
  Download,
  Gauge,
  Layers,
  LayoutGrid,
  Network,
  Pencil,
  Plus,
  Timer,
  Trash2,
  TrendingUp,
  TriangleAlert,
  UserRound,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Donut, Dot } from "@/components/dashboards/ui";
import {
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  QuickList,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  ViewLink,
  tdS,
  thS,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const tabs = ["Overview", "SLA Rules", "Escalation Queue", "Rule Builder / Response Policy", "Alert Acknowledgements", "Reports & Analytics"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { Overview: LayoutGrid, "SLA Rules": Layers, "Escalation Queue": UsersRound, "Rule Builder / Response Policy": Network, "Alert Acknowledgements": Bell, "Reports & Analytics": BarChart3 };

const initialRules = [
  ["Case Acknowledgement SLA", "All Services", "15 Minutes", "> 15 Minutes", "Super Admin"],
  ["Request Processing SLA", "Sewa Request", "4 Hours", "> 4 Hours", "Admin"],
  ["Field Verification SLA", "Verification", "24 Hours", "> 24 Hours", "Operations Admin"],
  ["Document Approval SLA", "Approvals", "8 Hours", "> 8 Hours", "Admin"],
  ["Donations Disbursement SLA", "Finance & Donations", "48 Hours", "> 48 Hours", "Finance Admin"],
];

type Q = { id: string; stage: string; risk: "High" | "Medium" | "Low"; level: string; admin: string; by: string; at: string; status: string };
const initialQueue: Q[] = [
  { id: "SR-2026-014582", stage: "Processing", risk: "High", level: "Level 2", admin: "Admin Anil 01", by: "—", at: "—", status: "Pending Escalation" },
  { id: "SR-2026-014471", stage: "Verification", risk: "High", level: "Level 3", admin: "Super Admin", by: "Super Admin", at: "24 Nov 2026, 10:24 AM", status: "Escalated" },
  { id: "SR-2026-014396", stage: "Approval", risk: "Medium", level: "Level 1", admin: "Admin Anita 02", by: "Admin Anita 02", at: "24 Nov 2026, 09:58 AM", status: "Acknowledged" },
  { id: "SR-2026-014388", stage: "Processing", risk: "Medium", level: "Level 2", admin: "Admin Ravi 01", by: "—", at: "—", status: "In Progress" },
  { id: "SR-2026-014370", stage: "Document Review", risk: "Low", level: "Level 1", admin: "Admin Meena 01", by: "Admin Meena 01", at: "24 Nov 2026, 09:12 AM", status: "Acknowledged" },
];
const riskCls = { High: "bg-[#fde4e4] text-[#b42318]", Medium: "bg-[#fdebd2] text-[#8a5300]", Low: "bg-[#e3f5e1] text-[#1c6b1f]" };

const acks = [
  ["SLA Breach: SR-2026-014471", "Admin Ravi 01", "Super Admin", "24 Nov 2026, 10:24 AM"],
  ["Escalation: SR-2026-014582", "Admin Anita 02", "—", "—"],
  ["SLA Breach: Verification Delay", "Admin Anil 01", "Admin Anil 01", "24 Nov 2026, 09:58 AM"],
  ["Escalation: Document Approval", "Admin Meena 01", "Admin Meena 01", "24 Nov 2026, 09:12 AM"],
  ["SLA Risk: Pending > 75% Target", "Admin Sunil 01", "—", "—"],
];

const trend = [["Jun", 87], ["Jul", 89], ["Aug", 91], ["Sep", 92], ["Oct", 94], ["Nov", 96]] as const;
const ladder = [
  ["1", "Level 1 – User", "Initial response & acknowledgement", "0 – 15 Minutes", "#2f6fe0", "#e7f0ff"],
  ["2", "Level 2 – Admin", "If no action within Level 1 target", "> 15 Minutes", "#2f6fe0", "#e7f0ff"],
  ["3", "Level 3 – Super Admin", "If no action within Level 2 target", "> 4 Hours", "#ef9a12", "#fff1d6"],
];

export default function SA020SlaEscalation() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Overview");
  const [rules, setRules] = useState(initialRules);
  const [queue, setQueue] = useState(initialQueue);

  const escalateNow = () => {
    const next = queue.find((q) => q.status === "Pending Escalation" || q.status === "In Progress");
    if (!next) return notice.show("Nothing waiting for escalation.");
    if (!window.confirm(`Escalate ${next.id} to the next level now?`)) return;
    setQueue(queue.map((q) => (q.id === next.id ? { ...q, level: q.level === "Level 1" ? "Level 2" : "Level 3", status: "Escalated" } : q)));
    notice.show(`${next.id} escalated — responsible admin notified (demo).`);
  };

  return (
    <SuperAdminFrame active="case-workflow">
      <PageHead icon={Timer} title="SLA & Escalation Management" links={["Response Timers", "Escalation Rules", "Responsible Admin", "Acknowledgement Tracking"]} />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Layers} value={String(18 - (initialRules.length - rules.length)).padStart(2, "0")} label="Active SLA Rules" />
        <KpiTile tone="red" icon={TriangleAlert} value="07" label="Breached Cases" />
        <KpiTile tone="orange" icon={Network} value={String(queue.filter((q) => q.status !== "Acknowledged").length + 21)} label="Pending Escalations" />
        <KpiTile tone="purple" icon={Timer} value="16m 42s" label="Avg Response Time" />
        <KpiTile tone="green" icon={CircleCheck} value="32" label="Acknowledged Alerts" />
        <KpiTile tone="sky" icon={TrendingUp} value="11" label="Auto Escalations" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} icons={tabIcons} />

      <div className="grid gap-[10px] lg:h-[180px] lg:grid-cols-[945fr_400fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title={`SLA Rules (${String(18 - (initialRules.length - rules.length)).padStart(2, "0")} Active)`} icon={Layers} titleSize={15.5} action={<ViewLink to="Case & Workflow" />} bodyClassName="pt-[2px]">
          <TableWrap>
            <Thead>
              {["#", "Rule Name", "Service Type", "Response Target", "Escalation Trigger", "Responsible Admin", "Status", "Action"].map((h) => <th key={h} className={`${thS} ${h === "Action" ? "text-center" : ""}`}>{h}</th>)}
            </Thead>
            <tbody>
              {rules.map((r, i) => (
                <tr key={r[0]} className="border-b border-[#eef0f5] last:border-0">
                  <td className={tdS}>{String(i + 1).padStart(2, "0")}</td>
                  <td className={tdS}>{r[0]}</td>
                  <td className={tdS}>{r[1]}</td>
                  <td className={tdS}>{r[2]}</td>
                  <td className={tdS}>{r[3]}</td>
                  <td className={tdS}><span className="flex items-center gap-[5px]">{r[4] === "Super Admin" ? <Crown strokeWidth={2} className="h-[13px] w-[13px] text-[#f0a020]" /> : <UserRound strokeWidth={2} className="h-[13px] w-[13px]" />}{r[4]}</span></td>
                  <td className={tdS}><StatusPill className="h-[17px] w-[68px] text-[11px]">Active</StatusPill></td>
                  <td className={`${tdS} text-center`}>
                    <div className="flex items-center justify-center gap-[8px]">
                      <button type="button" aria-label={`Edit ${r[0]}`} onClick={() => notice.show(`${r[0]}: change target / trigger (demo).`)}><Pencil strokeWidth={2.2} className="h-[14px] w-[14px] text-[#1d4fe0]" /></button>
                      <button type="button" aria-label={`Remove ${r[0]}`} onClick={() => { if (window.confirm(`Deactivate "${r[0]}"? The change is audited.`)) setRules(rules.filter((x) => x !== r)); }}><Trash2 strokeWidth={2.2} className="h-[14px] w-[14px] text-[#e02424]" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>

        <Panel title="SLA Compliance Trend" note="(Last 6 Months)" icon={Gauge} titleSize={15} action={<ViewLink to="Reports & Analytics">View Details</ViewLink>}>
          <TrendLine />
        </Panel>
      </div>

      <div className="grid gap-[10px] lg:h-[206px] lg:grid-cols-[945fr_400fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title={`Escalation Queue (${queue.filter((q) => q.status !== "Acknowledged").length + 21} Pending)`} icon={UsersRound} titleSize={15.5} action={<ViewLink to="Live Operations" />} bodyClassName="pt-[2px]">
          <TableWrap>
            <Thead>
              {["#", "Case ID", "Stage", "Breach Risk", "Escalation Level", "Responsible Admin", "Acknowledged By", "Acknowledgement Time", "Current Status"].map((h) => <th key={h} className={`${thS}`}>{h}</th>)}
            </Thead>
            <tbody>
              {queue.map((q, i) => (
                <tr key={q.id} className="border-b border-[#eef0f5] last:border-0">
                  <td className={`${tdS}`}>{String(i + 1).padStart(2, "0")}</td>
                  <td className={tdS}>{q.id}</td>
                  <td className={tdS}>{q.stage}</td>
                  <td className={tdS}><span className={`inline-flex h-[18px] w-[70px] items-center gap-[4px] rounded-[5px] px-[6px] text-[11px] font-semibold ${riskCls[q.risk]}`}>{q.risk === "Low" ? <CircleCheck strokeWidth={2.2} className="h-[11px] w-[11px]" /> : q.risk === "High" ? <CircleAlert strokeWidth={2.2} className="h-[11px] w-[11px]" /> : <TriangleAlert strokeWidth={2.2} className="h-[11px] w-[11px]" />}{q.risk}</span></td>
                  <td className={tdS}>{q.level}</td>
                  <td className={tdS}><span className="flex items-center gap-[5px]">{q.admin === "Super Admin" ? <Crown strokeWidth={2} className="h-[13px] w-[13px] text-[#f0a020]" /> : <UserRound strokeWidth={2} className="h-[13px] w-[13px]" />}{q.admin}</span></td>
                  <td className={tdS}>{q.by}</td>
                  <td className={tdS}>{q.at}</td>
                  <td className={tdS}><StatusPill className="h-[18px] w-[118px] rounded-[5px] text-[11px]">{q.status}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>

        <Panel title="Rule Builder / Response Policy" icon={Network} titleSize={15} bodyClassName="flex flex-col gap-[3px] pt-[2px]">
          <p className="text-[12.6px] font-bold">Escalation Ladder (Default Policy)</p>
          {ladder.map(([n, t, s, d, c, bg], i) => (
            <div key={n} className="flex flex-col">
              {i > 0 && <ArrowDown strokeWidth={2.2} className="ml-[10px] h-[11px] w-[11px]" />}
              <div className="flex items-center gap-[10px]">
                <span style={{ color: c, background: bg, borderColor: c }} className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[12.5px] font-bold">{n}</span>
                <span className="min-w-0 flex-1 leading-tight">
                  <b className="block text-[12.8px]">{t}</b>
                  <span className="text-[10.8px] font-medium">{s}</span>
                </span>
                <span className="shrink-0 rounded-[7px] border border-[#cfd5e2] px-[10px] py-[3px] text-[11.6px] font-semibold">{d}</span>
              </div>
            </div>
          ))}
        </Panel>
      </div>

      <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[615fr_380fr_350fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Alert Acknowledgements" note="(Critical Notifications)" icon={Bell} titleSize={15} action={<ViewLink to="Notification & Alerts" />} bodyClassName="pt-[2px]">
          <TableWrap>
            <Thead>
              {["#", "Notification / Alert", "Read By", "Acknowledged By", "Acknowledgement Time"].map((h) => <th key={h} className={`${thS}`}>{h}</th>)}
            </Thead>
            <tbody>
              {acks.map((a, i) => (
                <tr key={a[0]} className="border-b border-[#eef0f5] last:border-0">
                  <td className={`${tdS}`}>{String(i + 1).padStart(2, "0")}</td>
                  {a.map((c, j) => <td key={j} className={tdS}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>

        <Panel title="SLA Compliance Summary" icon={Gauge} titleSize={15} bodyClassName="flex items-center gap-[16px] pt-[2px]">
          <Donut size={118} thickness={13} segments={[{ value: 90, color: "#1f9a1f" }, { value: 5, color: "#f7b500" }, { value: 5, color: "#e02424" }]}>
            <b className="text-[22px] leading-none">96%</b>
            <span className="text-[12px] font-semibold">Compliant</span>
          </Donut>
          <ul className="flex flex-1 flex-col gap-[14px]">
            {[
              ["Compliant", "276", "(96%)", "#1f9a1f"],
              ["At Risk", "09", "(3%)", "#f7b500"],
              ["Breached", "07", "(1%)", "#e02424"],
            ].map(([l, v, p, c]) => (
              <li key={l} className="flex items-center gap-[8px] text-[12.8px] font-semibold">
                <Dot color={c} size={10} />
                <span className="flex-1">{l}</span>
                <b>{v}</b>
                <span className="w-[42px] text-right">{p}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Quick Actions" icon={Zap} titleSize={15} bodyClassName="pt-[4px]">
          <QuickList
            items={[
              { icon: Plus, label: "Add SLA Rule", onClick: () => notice.show("New SLA rule: target, trigger and responsible admin (demo).") },
              { icon: Download, label: "Escalate Now", onClick: escalateNow },
              { icon: UsersRound, label: "Reassign Responsible Admin", color: "#7a3fe0", onClick: () => notice.show("Reassign the responsible admin with a reason (demo).") },
              { icon: Download, label: "Export Breach Report", color: "#7a3fe0", onClick: () => notice.show("Breach report exported (demo).") },
            ]}
          />
        </Panel>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function TrendLine() {
  const W = 360;
  const H = 120;
  const x0 = 36;
  const y = (v: number) => 10 + ((100 - v) / 20) * (H - 34);
  const x = (i: number) => x0 + 14 + i * ((W - x0 - 28) / 5);
  const d = trend.map(([, v], i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none h-full w-full" role="img" aria-label="SLA compliance, last 6 months">
      {[100, 95, 90, 85, 80].map((v) => (
        <g key={v}>
          <line x1={x0} x2={W - 6} y1={y(v)} y2={y(v)} stroke="#edf0f5" />
          <text x={x0 - 4} y={y(v) + 3} textAnchor="end" className="fill-[#3b4256] text-[9px] font-semibold">{v}%</text>
        </g>
      ))}
      <path d={d} fill="none" stroke="#2f6fe0" strokeWidth={2} />
      {trend.map(([m, v], i) => (
        <g key={m}>
          <circle cx={x(i)} cy={y(v)} r={3.2} fill="#fff" stroke="#2f6fe0" strokeWidth={1.8} />
          <text x={x(i)} y={y(v) - 7} textAnchor="middle" className="fill-[#0b0c36] text-[9.5px] font-bold">{v}%</text>
          <text x={x(i)} y={H - 14} textAnchor="middle" className="fill-[#1a1d36] text-[9.5px] font-semibold">{m}</text>
        </g>
      ))}
      <rect x={W / 2 - 52} y={H - 8} width={8} height={7} fill="#7cc1f5" />
      <text x={W / 2 - 40} y={H - 2} className="fill-[#1a1d36] text-[9px] font-semibold">SLA Compliance (%)</text>
    </svg>
  );
}
