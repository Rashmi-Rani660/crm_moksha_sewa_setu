"use client";

/**
 * SA-001 — Super Admin Dashboard.
 * Rebuild matched to the SA-001 reference design: 8 KPI tiles, 5 tabs and a
 * 3-column panel grid. Demo data only.
 */

import { useState } from "react";
import {
  Bell,
  CircleCheck,
  Clock3,
  Database,
  Layers,
  MessageSquareText,
  Radio,
  ShieldAlert,
  TriangleAlert,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Donut } from "@/components/dashboards/ui";
import {
  KpiRow,
  KpiTile,
  ModuleDropdown,
  PageHead,
  KV,
  Panel,
  Pill,
  SuperAdminFrame,
  Tabs,
  useNotice,
  type PillTone,
} from "@/components/dashboards/super-admin/kit";

const tabs = [
  "Overview",
  "Requests & cases",
  "Users & resources",
  "AI & automation",
  "Security & finance",
] as const;
type Tab = (typeof tabs)[number];

type Fy = "FY 2026–27" | "FY 2025–26" | "FY 2024–25";

const trend = [
  { m: "Jun", v: 78 },
  { m: "Jul", v: 96 },
  { m: "Aug", v: 118 },
  { m: "Sep", v: 146 },
  { m: "Oct", v: 178 },
  { m: "Nov", v: 324 },
] as const;

const alerts: { icon: LucideIcon; color: string; label: string; count: string; tone: PillTone }[] = [
  { icon: TriangleAlert, color: "#e02424", label: "Emergency requests", count: "03 · Review", tone: "red" },
  { icon: UsersRound, color: "#2f6fe0", label: "Unassigned requests", count: "04", tone: "amber" },
  { icon: Clock3, color: "#e08a00", label: "Overdue tasks", count: "05", tone: "amber" },
  { icon: ShieldAlert, color: "#e08a00", label: "Critical approvals", count: "07", tone: "gray" },
  { icon: MessageSquareText, color: "#e08a00", label: "Unanswered calls", count: "03", tone: "amber" },
  { icon: Database, color: "#e08a00", label: "Inventory shortage", count: "01", tone: "amber" },
];

const statusRows: readonly (readonly [string, string])[] = [
  ["Completed / In progress", "276 / 18"],
  ["Pending / On hold", "14 / 16"],
  ["Unclaimed bodies (completed)", "52"],
  ["EWS families (completed)", "156"],
  ["Unsupported persons (completed)", "68"],
] as const;

const adminRows: readonly (readonly [string, string])[] = [
  ["Super Admin / Admin / User", "1 / 12 / 173"],
  ["Online / Inactive accounts", "48 / 24"],
  ["Staff on duty", "8 / 10"],
  ["Volunteers available", "12 / 18"],
  ["Vehicles available", "1 / 2"],
  ["Open complaints", "02"],
] as const;

const commStats: readonly (readonly [string, string])[] = [
  ["Pending email / WhatsApp", "4 / 6"],
  ["Connected / Delayed / Failed", "12 / 1 / 1"],
] as const;

const commIntegrations: { label: string; status: string; tone: PillTone }[] = [
  { label: "WhatsApp", status: "Delayed", tone: "amber" },
  { label: "Accounting", status: "Failed", tone: "red" },
  { label: "HRMS / Staff / Volunteer apps", status: "Connected", tone: "green" },
];

const aiRows: readonly (readonly [string, string])[] = [
  ["Auto / Approval / Manual", "22 / 7 / 3"],
  ["Failed workflows / Interventions", "3 / 8"],
  ["AI cost / Budget", "₹8,450 / ₹15,000"],
  ["AI handling rate", "72%"],
  ["Emergency pause", "Approval required"],
] as const;

const securityRows: readonly (readonly [string, string])[] = [
  ["Security alerts / Failed logins", "2 / 8"],
  ["Last backup", "26 Nov · 02:00"],
  ["Last restore test", "22 Nov · Passed"],
  ["Actual RPO / Target", "8 min / 15 min"],
  ["Uptime (30 days)", "99.9% · demo"],
] as const;

const financeRows: readonly (readonly [string, string])[] = [
  ["Income less expenses", "₹6.36 L"],
  ["Pending expense approvals", "₹45,000"],
  ["Reconciliation pending", "04"],
] as const;

const coverage: { city: string; status: string; tone: PillTone }[] = [
  { city: "Ghaziabad", status: "Active", tone: "green" },
  { city: "Delhi / Noida", status: "Coming soon", tone: "amber" },
];

const trainingRows: readonly (readonly [string, string])[] = [
  ["Staff / Volunteer training", "92% / 80%"],
] as const;

const insights = [
  "Review 3 emergency requests and 4 unassigned requests.",
  "Resolve WhatsApp delay and accounting failure.",
  "Review overdue tasks with responsible admins.",
];

function StatRows({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <div className="flex flex-col gap-[6px]">
      {rows.map(([k, v]) => (
        <KV key={k} k={k} v={v} />
      ))}
    </div>
  );
}

function MonthBar() {
  return (
    <div className="flex min-w-0 flex-1 items-end gap-[6px]">
      {trend.map((t) => (
        <div key={t.m} className="flex min-w-0 flex-1 flex-col items-center gap-[2px]">
          <span className="text-[9.5px] font-semibold text-[#0b0c36]">{t.v}</span>
          <span className="w-full rounded-[2px] bg-[#8fc6f5]" style={{ height: `${(t.v / 324) * 48}px` }} />
          <span className="text-[9px] font-semibold text-[#3b4256]">{t.m}</span>
        </div>
      ))}
    </div>
  );
}

function Bar({ pct, className = "" }: { pct: number; className?: string }) {
  return (
    <span className={`block h-[7px] w-full shrink-0 overflow-hidden rounded-full bg-[#e3e7ef] ${className}`}>
      <span className="block h-full rounded-full bg-[#2f6fe0]" style={{ width: `${pct}%` }} />
    </span>
  );
}

export default function SA001Dashboard() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [fy] = useState<Fy>("FY 2026–27");
  const notice = useNotice();

  return (
    <SuperAdminFrame>
      <PageHead light icon={Radio} iconTone="blue" title="Super Admin Dashboard" links={["Super Admin", fy, "Ghaziabad"]}>
        <ModuleDropdown current="SA-001" className="w-[250px] [&_button]:!font-normal" />
      </PageHead>

      <KpiRow cols={8}>
        <KpiTile tone="blue" icon={Radio} value="186" label="CRM accounts" sub="162 active" />
        <KpiTile tone="green" icon={Bell} value="12" label="Active admins" sub="3 access levels" />
        <KpiTile tone="orange" icon={CircleCheck} value="324" label="Requests" sub="This month" />
        <KpiTile tone="purple" icon={Users} value="18" label="Active cases" sub="Live" />
        <KpiTile tone="sky" icon={Layers} value="276" label="Completed" sub="This month" />
        <KpiTile tone="red" icon={Radio} value="03" label="Emergency" sub="Immediate attention" />
        <KpiTile tone="orange" icon={Bell} value="₹18.76 L" label="Donations" sub="FY 26 – 27" />
        <KpiTile tone="purple" icon={CircleCheck} value="₹12.40 L" label="Expenses" sub="FY 26 – 27" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
      {/* Row 1 */}
      <div className="grid gap-[10px] sm:grid-cols-2 lg:min-h-0 lg:flex-[225_1_0] lg:[grid-template-rows:minmax(0,1fr)] lg:grid-cols-[275fr_345fr_260fr]">
        <Panel title="Critical alerts & priority actions" bodyClassName="flex flex-col gap-[5px] pt-[3px]">
          {alerts.map((a) => (
            <div key={a.label} className="flex items-center gap-[8px] border-b border-[#eef0f5] pb-[4px] text-[12.4px] font-semibold leading-none last:border-b-0 last:pb-0">
              <span className="min-w-0 flex-1 truncate">{a.label}</span>
              <Pill tone={a.tone} className="h-[18px] min-w-[28px] text-[11px] font-bold">{a.count}</Pill>
            </div>
          ))}
        </Panel>
        <Panel title="Request status & monthly trend" bodyClassName="flex flex-col gap-[8px] pt-[3px]">
          <StatRows rows={statusRows} />
          <div className="mt-auto flex items-end gap-[10px]">
            <Donut size={72} thickness={11} segments={[{ value: 276, color: "#2f6fe0" }, { value: 18, color: "#7cc1f5" }, { value: 14, color: "#f7b500" }, { value: 16, color: "#c4cad6" }]}>
              <b className="text-[15px] leading-none">324</b>
              <span className="text-[8.8px] font-semibold">Total</span>
            </Donut>
            <div className="min-w-0 flex-1"><MonthBar /></div>
          </div>
        </Panel>
        <Panel title="Admin & resources" bodyClassName="flex flex-col gap-[5px] pt-[3px]">
          <StatRows rows={adminRows} />
        </Panel>
      </div>

      {/* Row 2 */}
      <div className="grid gap-[10px] sm:grid-cols-2 lg:min-h-0 lg:flex-[185_1_0] lg:[grid-template-rows:minmax(0,1fr)] lg:grid-cols-[275fr_345fr_260fr]">
        <Panel title="Communication & integrations" bodyClassName="flex flex-col gap-[7px] pt-[3px]">
          <StatRows rows={commStats} />
          <div className="flex flex-col gap-[5px] border-t border-[#eef0f5] pt-[5px]">
            {commIntegrations.map((i) => (
              <div key={i.label} className="flex items-center gap-[8px] border-b border-[#eef0f5] pb-[4px] text-[12.4px] font-semibold leading-none last:border-b-0 last:pb-0">
                <span className="min-w-0 flex-1 truncate">{i.label}</span>
                <Pill tone={i.tone} className="h-[17px] text-[10.5px]">{i.status}</Pill>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="AI & automation" bodyClassName="flex flex-col gap-[5px] pt-[3px]">
          <StatRows rows={aiRows} />
          <div className="mt-auto flex flex-col gap-[4px] pt-[2px]">
            <div className="flex items-center justify-between text-[11.5px] font-semibold">
              <span>AI budget used</span>
              <b>56%</b>
            </div>
            <Bar pct={56} />
          </div>
        </Panel>
        <Panel title="Security & backup" bodyClassName="flex flex-col gap-[5px] pt-[3px]">
          <StatRows rows={securityRows} />
        </Panel>
      </div>

      {/* Row 3 */}
      <div className="grid gap-[10px] sm:grid-cols-2 lg:min-h-0 lg:flex-[175_1_0] lg:[grid-template-rows:minmax(0,1fr)] lg:grid-cols-[275fr_345fr_260fr]">
        <Panel title="Financial control · FY" bodyClassName="flex flex-col gap-[5px] pt-[3px]">
          <StatRows rows={financeRows} />
          <div className="mt-auto flex flex-col gap-[4px] pt-[2px]">
            <div className="flex items-center justify-between text-[11.5px] font-semibold">
              <span>Expenses / donations</span>
              <b>66.1%</b>
            </div>
            <Bar pct={66.1} />
          </div>
        </Panel>
        <Panel title="Coverage & training" bodyClassName="flex flex-col gap-[5px] pt-[3px] text-[12.4px] font-semibold">
          <div className="flex items-center gap-[8px] border-b border-[#eef0f5] pb-[4px]">
            <span className="min-w-0 flex-1 truncate">{coverage[0].city}</span>
            <Pill tone={coverage[0].tone} className="h-[17px] text-[10.5px]">{coverage[0].status}</Pill>
          </div>
          <div className="flex items-center gap-[8px] border-b border-[#eef0f5] pb-[4px]">
            <span className="min-w-0 flex-1 truncate">{coverage[1].city}</span>
            <Pill tone={coverage[1].tone} className="h-[17px] text-[10.5px]">{coverage[1].status}</Pill>
          </div>
          <div className="flex items-center justify-between gap-[8px]">
            <span>{trainingRows[0][0]}</span>
            <b className="shrink-0 whitespace-nowrap">{trainingRows[0][1]}</b>
          </div>
          <div className="mt-auto flex flex-col gap-[4px] pt-[2px]">
            <div className="flex items-center justify-between text-[11.5px] font-semibold">
              <span>Staff training</span>
              <b>92%</b>
            </div>
            <Bar pct={92} />
            <div className="flex items-center justify-between text-[11.5px] font-semibold">
              <span>Volunteer training</span>
              <b>80%</b>
            </div>
            <Bar pct={80} />
          </div>
        </Panel>
        <Panel title="AI management insights" bodyClassName="flex flex-col gap-[7px] pt-[6px]">
          <p className="text-[12px] font-medium leading-tight text-[#1a1d36]">{insights[0]}</p>
          <p className="text-[12px] font-medium leading-tight text-[#1a1d36]">{insights[1]}</p>
          <div className="flex flex-wrap gap-[8px]">
            <button type="button" onClick={() => notice.show("Opening the alert queue (demo).")} className="flex h-[28px] items-center rounded-[7px] bg-[#1d4fe0] px-[12px] text-[12px] font-semibold text-white shadow-[0_2px_6px_rgba(29,79,224,0.28)] hover:bg-[#1840c0]">Review alerts</button>
            <button type="button" onClick={() => notice.show("Automation pause requested (demo).")} className="flex h-[28px] items-center rounded-[7px] border border-[#cfd5e2] bg-white px-[12px] text-[12px] font-semibold text-[#1d4fe0] hover:bg-[#f1f4ff]">Pause automation</button>
          </div>
          <p className="mt-auto rounded-[7px] border border-[#e1e5ee] bg-[#f8fafc] px-[10px] py-[6px] text-[12px] font-medium leading-tight text-[#1a1d36]">{insights[2]}</p>
        </Panel>
      </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}
