"use client";

import { useRouter } from "next/navigation";

/**
 * SA-001 — Super Admin Dashboard.
 * Rebuild matched to the SA-001 reference design: 8 KPI tiles, 5 tabs and a
 * 3-column panel grid. Demo data only.
 */

import { useState } from "react";
import { useDashboardData } from "@/lib/crm/useDashboardData";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { EMPTY, count, at, records, text, type CrmRecord } from "@/lib/crm/data";
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
  { m: "Jun", v: 0 },
  { m: "Jul", v: 0 },
  { m: "Aug", v: 0 },
  { m: "Sep", v: 0 },
  { m: "Oct", v: 0 },
  { m: "Nov", v: 0 },
] as const;

const alerts: { icon: LucideIcon; color: string; label: string; count: string; tone: PillTone }[] = [
  { icon: TriangleAlert, color: "#e02424", label: "Emergency requests", count: EMPTY, tone: "red" },
  { icon: UsersRound, color: "#2f6fe0", label: "Unassigned requests", count: EMPTY, tone: "amber" },
  { icon: Clock3, color: "#e08a00", label: "Overdue tasks", count: EMPTY, tone: "amber" },
  { icon: ShieldAlert, color: "#e08a00", label: "Critical approvals", count: EMPTY, tone: "gray" },
  { icon: MessageSquareText, color: "#e08a00", label: "Unanswered calls", count: EMPTY, tone: "amber" },
  { icon: Database, color: "#e08a00", label: "Inventory shortage", count: EMPTY, tone: "amber" },
];

const statusRows: readonly (readonly [string, string])[] = [
  ["Completed / In progress", EMPTY],
  ["Pending / On hold", EMPTY],
  ["Unclaimed bodies (completed)", EMPTY],
  ["EWS families (completed)", EMPTY],
  ["Unsupported persons (completed)", EMPTY],
] as const;

const adminRows: readonly (readonly [string, string])[] = [
  ["Super Admin / Admin / User", EMPTY],
  ["Online / Inactive accounts", EMPTY],
  ["Staff on duty", EMPTY],
  ["Volunteers available", EMPTY],
  ["Vehicles available", EMPTY],
  ["Open complaints", EMPTY],
] as const;

const commStats: readonly (readonly [string, string])[] = [
  ["Pending email / WhatsApp", EMPTY],
  ["Connected / Delayed / Failed", EMPTY],
] as const;

const commIntegrations: { label: string; status: string; tone: PillTone }[] = [
  { label: "WhatsApp", status: EMPTY, tone: "amber" },
  { label: "Accounting", status: EMPTY, tone: "red" },
  { label: "HRMS / Staff / Volunteer apps", status: EMPTY, tone: "green" },
];

const aiRows: readonly (readonly [string, string])[] = [
  ["Auto / Approval / Manual", EMPTY],
  ["Failed workflows / Interventions", EMPTY],
  ["AI cost / Budget", EMPTY],
  ["AI handling rate", EMPTY],
  ["Emergency pause", EMPTY],
] as const;

const securityRows: readonly (readonly [string, string])[] = [
  ["Security alerts / Failed logins", EMPTY],
  ["Last backup", EMPTY],
  ["Last restore test", EMPTY],
  ["Actual RPO / Target", EMPTY],
  ["Uptime (30 days)", EMPTY],
] as const;

const financeRows: readonly (readonly [string, string])[] = [
  ["Income less expenses", EMPTY],
  ["Pending expense approvals", EMPTY],
  ["Reconciliation pending", EMPTY],
] as const;

const coverage: { city: string; status: string; tone: PillTone }[] = [
  { city: EMPTY, status: EMPTY, tone: "green" },
  { city: EMPTY, status: EMPTY, tone: "amber" },
];

const trainingRows: readonly (readonly [string, string])[] = [
  ["Staff / Volunteer training", EMPTY],
] as const;

const insights = [EMPTY, EMPTY, EMPTY];

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
          <span className="text-[13.5px] font-semibold text-[#0b0c36]">{EMPTY}</span>
          <span className="w-full rounded-[2px] bg-[#8fc6f5]" style={{ height: `${(t.v / 324) * 48}px` }} />
          <span className="text-[13px] font-semibold text-[#3b4256]">{t.m}</span>
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
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Overview");
  const [fy] = useState<Fy>("FY 2026–27");
  const notice = useNotice();
  const live = useDashboardData();
  const cities = useCrmQuery<CrmRecord[]>(live.can("geography.view") ? "/geography/cities" : null);
  const liveAlerts = alerts.map(a => ({ ...a, count: live.value(a.label) }));

  return (
    <SuperAdminFrame>
      <PageHead light icon={Radio} iconTone="blue" title="Super Admin Dashboard" links={["Super Admin", fy, "Ghaziabad"]}>
        <ModuleDropdown current="SA-001" className="w-[250px] [&_button]:!font-normal" />
      </PageHead>

      <KpiRow cols={8}>
        <KpiTile tone="blue" icon={Radio} value={live.value("CRM accounts")} label="CRM accounts" sub={live.users.data ? `${live.users.data.active} active` : EMPTY} />
        <KpiTile tone="green" icon={Bell} value={live.value("Active admins")} label="Active admins" sub="3 access levels" />
        <KpiTile tone="orange" icon={CircleCheck} value={live.value("Requests")} label="Requests" sub="This month" />
        <KpiTile tone="purple" icon={Users} value={live.value("Active cases")} label="Active cases" sub="Live" />
        <KpiTile tone="sky" icon={Layers} value={live.value("Completed")} label="Completed" sub="This month" />
        <KpiTile tone="red" icon={Radio} value={live.value("Emergency")} label="Emergency" sub="Immediate attention" />
        <KpiTile tone="orange" icon={Bell} value={live.value("Donations")} label="Donations" sub="FY 26 – 27" />
        <KpiTile tone="purple" icon={CircleCheck} value={live.value("Expenses")} label="Expenses" sub="FY 26 – 27" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
      {/* Row 1 */}
      <div className="grid gap-[10px] sm:grid-cols-2 lg:min-h-0 lg:flex-[225_1_0] lg:[grid-template-rows:minmax(0,1fr)] lg:grid-cols-[275fr_345fr_260fr]">
        <Panel title="Critical alerts & priority actions" bodyClassName="flex flex-col gap-[5px] pt-[3px]">
          {liveAlerts.map((a) => (
            <div key={a.label} className="flex items-center gap-[8px] border-b border-[#eef0f5] pb-[4px] text-[14.4px] font-semibold leading-none last:border-b-0 last:pb-0">
              <span className="min-w-0 flex-1 truncate">{a.label}</span>
              <Pill tone={a.tone} className="h-[18px] min-w-[28px] text-[15px] font-bold">{a.count}</Pill>
            </div>
          ))}
        </Panel>
        <Panel title="Request status & monthly trend" bodyClassName="flex flex-col gap-[8px] pt-[3px]">
          <StatRows rows={statusRows.map(([label]) => [label, label === "Completed / In progress" ? `${live.metric("requests.byStatus.CONVERTED")} / ${live.metric("requests.byStatus.PENDING_VERIFICATION")}` : label === "Pending / On hold" ? `${live.metric("requests.byStatus.NEW")} / ${live.metric("requests.byStatus.ON_HOLD")}` : EMPTY])} />
          <div className="mt-auto flex items-end gap-[10px]">
            <Donut size={72} thickness={11} segments={[{ value: live.status("requests.byStatus.CONVERTED") ?? 0, color: "#2f6fe0" }, { value: live.status("requests.byStatus.PENDING_VERIFICATION") ?? 0, color: "#7cc1f5" }, { value: live.status("requests.byStatus.NEW") ?? 0, color: "#f7b500" }, { value: live.status("requests.byStatus.ON_HOLD") ?? 0, color: "#c4cad6" }]}>
              <b className="text-[15px] leading-none">{count(live.requestTotal)}</b>
              <span className="text-[12.8px] font-semibold">Total</span>
            </Donut>
            <div className="min-w-0 flex-1"><MonthBar /></div>
          </div>
        </Panel>
        <Panel title="Admin & resources" bodyClassName="flex flex-col gap-[5px] pt-[3px]">
          <StatRows rows={adminRows.map(([label]) => [label,label === "Super Admin / Admin / User" ? ["SUPER_ADMIN","ADMIN","USER"].map(level => count(at(live.users.data,'activeByAccessLevel.' + level))).join(" / ") : label === "Staff on duty" ? count(at(live.workforce.data,"summary.onDuty")) : label === "Volunteers available" ? count(live.volunteers.data?.availableNow) + ' / ' + count(live.volunteers.data?.total) : label === "Vehicles available" ? count(at(live.fleet.data,"vehicles.available")) + ' / ' + count(at(live.fleet.data,"vehicles.total")) : EMPTY])} />
        </Panel>
      </div>

      {/* Row 2 */}
      <div className="grid gap-[10px] sm:grid-cols-2 lg:min-h-0 lg:flex-[185_1_0] lg:[grid-template-rows:minmax(0,1fr)] lg:grid-cols-[275fr_345fr_260fr]">
        <Panel title="Communication & integrations" bodyClassName="flex flex-col gap-[7px] pt-[3px]">
          <StatRows rows={commStats} />
          <div className="flex flex-col gap-[5px] border-t border-[#eef0f5] pt-[5px]">
            {commIntegrations.map((i) => (
              <div key={i.label} className="flex items-center gap-[8px] border-b border-[#eef0f5] pb-[4px] text-[14.4px] font-semibold leading-none last:border-b-0 last:pb-0">
                <span className="min-w-0 flex-1 truncate">{i.label}</span>
                <Pill tone={i.tone} className="h-[17px] text-[14.5px]">{i.status}</Pill>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="AI & automation" bodyClassName="flex flex-col gap-[5px] pt-[3px]">
          <StatRows rows={aiRows} />
          <div className="mt-auto flex flex-col gap-[4px] pt-[2px]">
            <div className="flex items-center justify-between text-[15.5px] font-semibold">
              <span>AI budget used</span>
              <b>{EMPTY}</b>
            </div>
            <Bar pct={0} />
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
            <div className="flex items-center justify-between text-[15.5px] font-semibold">
              <span>Expenses / donations</span>
              <b>{EMPTY}</b>
            </div>
            <Bar pct={0} />
          </div>
        </Panel>
        <Panel title="Coverage & training" bodyClassName="flex flex-col gap-[5px] pt-[3px] text-[14.4px] font-semibold">
          <div className="flex items-center gap-[8px] border-b border-[#eef0f5] pb-[4px]">
            <span className="min-w-0 flex-1 truncate">{text(records(cities.data).find(city => city.status === "ACTIVE")?.name)}</span>
            <Pill tone={coverage[0].tone} className="h-[17px] text-[14.5px]">{cities.data ? records(cities.data).some(city => city.status === "ACTIVE") ? "Active" : EMPTY : EMPTY}</Pill>
          </div>
          <div className="flex items-center gap-[8px] border-b border-[#eef0f5] pb-[4px]">
            <span className="min-w-0 flex-1 truncate">{records(cities.data).filter(city => city.status === "COMING_SOON").map(city => text(city.name)).join(" / ") || EMPTY}</span>
            <Pill tone={coverage[1].tone} className="h-[17px] text-[14.5px]">{cities.data && records(cities.data).some(city => city.status === "COMING_SOON") ? "Coming soon" : EMPTY}</Pill>
          </div>
          <div className="flex items-center justify-between gap-[8px]">
            <span>{trainingRows[0][0]}</span>
            <b className="shrink-0 whitespace-nowrap">{trainingRows[0][1]}</b>
          </div>
          <div className="mt-auto flex flex-col gap-[4px] pt-[2px]">
            <div className="flex items-center justify-between text-[15.5px] font-semibold">
              <span>Staff training</span>
              <b>{EMPTY}</b>
            </div>
            <Bar pct={0} />
            <div className="flex items-center justify-between text-[15.5px] font-semibold">
              <span>Volunteer training</span>
              <b>{EMPTY}</b>
            </div>
            <Bar pct={0} />
          </div>
        </Panel>
        <Panel title="AI management insights" bodyClassName="flex flex-col gap-[7px] pt-[6px]">
          <p className="text-[14px] font-medium leading-tight text-[#1a1d36]">{insights[0]}</p>
          <p className="text-[14px] font-medium leading-tight text-[#1a1d36]">{insights[1]}</p>
          <div className="flex flex-wrap gap-[8px]">
            <button type="button" onClick={() => router.push("/dashboard/super-admin/notification-alerts")} className="flex h-[28px] items-center rounded-[7px] bg-[#1d4fe0] px-[12px] text-[14px] font-semibold text-white shadow-[0_2px_6px_rgba(29,79,224,0.28)] hover:bg-[#1840c0]">Review alerts</button>
            <button type="button" disabled onClick={() => notice.show(EMPTY)} className="flex h-[28px] items-center rounded-[7px] border border-[#cfd5e2] bg-white px-[12px] text-[14px] font-semibold text-[#1d4fe0] hover:bg-[#f1f4ff]">Pause automation</button>
          </div>
          <p className="mt-auto rounded-[7px] border border-[#e1e5ee] bg-[#f8fafc] px-[10px] py-[6px] text-[14px] font-medium leading-tight text-[#1a1d36]">{insights[2]}</p>
        </Panel>
      </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}
