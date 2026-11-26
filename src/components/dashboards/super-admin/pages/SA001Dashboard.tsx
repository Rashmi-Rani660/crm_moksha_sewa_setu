"use client";

/**
 * SA-001 — Super Admin Dashboard.
 * Notes (design brief 01): one reporting period and one database for every
 * figure; KPI drill-downs respect permissions; the financial difference is not
 * available cash; emergency lockdown needs confirmation + audit and manual
 * response stays available. All numbers are demonstration data.
 */

import Link from "next/link";
import { useState } from "react";
import {
  AlertOctagon,
  Bot,
  Building2,
  ChartColumn,
  ChevronRight,
  CircleCheck,
  CircleCheckBig,
  Clock3,
  CloudUpload,
  Cog,
  Database,
  FileCheck2,
  Globe,
  GraduationCap,
  HandHeart,
  Hand,
  History,
  IndianRupee,
  KeyRound,
  Layers,
  LayoutGrid,
  Link2,
  Lock,
  Mail,
  MapPin,
  Network,
  PhoneCall,
  Power,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  Truck,
  UserCog,
  UserRoundSearch,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { sectionHref } from "@/components/dashboards/shells";
import { Donut, Dot, Today, WhatsAppIcon } from "@/components/dashboards/ui";
import {
  CentreDropdown,
  Dropdown,
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  Pill,
  SuperAdminFrame,
  Tabs,
  Trend,
  ViewLink,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const fyOptions = ["FY 2026 – 27", "FY 2025 – 26", "FY 2024 – 25"] as const;

const tabs = [
  "Overview",
  "Sewa Requests & Cases",
  "Operations",
  "Users & Resources",
  "AI & Automation",
  "Integrations",
  "Security & Backup",
  "Finance & Donations",
  "Reports & Analytics",
] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = {
  Overview: LayoutGrid,
  "Sewa Requests & Cases": FileCheck2,
  Operations: Cog,
  "Users & Resources": UsersRound,
  "AI & Automation": Sparkles,
  Integrations: Link2,
  "Security & Backup": ShieldCheck,
  "Finance & Donations": Database,
  "Reports & Analytics": ChartColumn,
};
/** Tabs other than Overview open the matching module page. */
const tabSection: Partial<Record<Tab, string>> = {
  "Sewa Requests & Cases": "Case & Workflow",
  Operations: "Live Operations",
  "Users & Resources": "Users & Access Control",
  "AI & Automation": "Automation & AI",
  Integrations: "Integrations & API",
  "Security & Backup": "System Security",
  "Finance & Donations": "Finance & Donations",
  "Reports & Analytics": "Reports & Analytics",
};

const trend = [
  { m: "Jun", v: 78, c: 60 },
  { m: "Jul", v: 96, c: 72 },
  { m: "Aug", v: 118, c: 92 },
  { m: "Sep", v: 146, c: 118 },
  { m: "Oct", v: 178, c: 148 },
  { m: "Nov", v: 324, c: 276 },
];

const status = [
  { label: "Completed", value: "276", pct: "(85%)", color: "#1f9a1f" },
  { label: "In Progress", value: "18", pct: "(6%)", color: "#1f87e8" },
  { label: "Pending", value: "14", pct: "(4%)", color: "#f7b500" },
  { label: "On Hold", value: "16", pct: "(5%)", color: "#c4cad6" },
];

const sewaOps: { icon: LucideIcon; color: string; label: string; value: string }[] = [
  { icon: UsersRound, color: "#e02424", label: "Unclaimed Bodies", value: "52" },
  { icon: HandHeart, color: "#f0a020", label: "EWS / Needy Families", value: "156" },
  { icon: UserRoundSearch, color: "#f0a020", label: "Unsupported Persons", value: "68" },
  { icon: Truck, color: "#2f6fe0", label: "Active Field Cases", value: "18" },
  { icon: FileCheck2, color: "#2f6fe0", label: "Pending Verification", value: "14" },
];

const alerts: { icon: LucideIcon; color: string; title: string; sub?: string; count: string; tone: "red" | "amber" | "yellow"; to: string }[] = [
  { icon: TriangleAlert, color: "#e02424", title: "Emergency Sewa Requests", sub: "Immediate action required", count: "03", tone: "red", to: "Live Operations" },
  { icon: Clock3, color: "#f0a020", title: "Overdue Tasks", sub: "Beyond assigned SLA", count: "05", tone: "amber", to: "Case & Workflow" },
  { icon: FileCheck2, color: "#f0a020", title: "Pending Critical Approvals", sub: "Management review required", count: "07", tone: "amber", to: "Central Approvals" },
  { icon: Link2, color: "#f0a020", title: "Integration failure", sub: "Accounting sync failed", count: "01", tone: "amber", to: "Integrations & API" },
  { icon: ShieldAlert, color: "#e02424", title: "Suspicious Login Attempts", sub: "Security review required", count: "02", tone: "red", to: "System Security" },
  { icon: CircleCheck, color: "#1f9a2b", title: "Unassigned requests", count: "04", tone: "yellow", to: "Case & Workflow" },
];

const aiTiles: { icon: LucideIcon; label: string; value: string; foot?: string; red?: boolean }[] = [
  { icon: Bot, label: "AI Interactions", value: "2,846", foot: "+18%" },
  { icon: Network, label: "Auto Handling Rate", value: "72%" },
  { icon: Clock3, label: "Time Saved", value: "186 Hrs", foot: "+21%" },
  { icon: Layers, label: "Active Workflows", value: "32" },
  { icon: AlertOctagon, label: "Failed Automations", value: "03", red: true },
  { icon: Hand, label: "Manual Interventions", value: "08" },
];

const modes = [
  { label: "Automatic", value: 22, color: "#2f6fe0", dot: "#1f9a1f" },
  { label: "Approval-based", value: 7, color: "#f7b500", dot: "#f7b500" },
  { label: "Manual", value: 3, color: "#3b4256", dot: "#3b4256" },
];

const integrations: { icon: React.ReactNode; name: string; status: "Connected" | "Delayed" | "Failed" }[] = [
  { icon: <WhatsAppIcon size={13} />, name: "WhatsApp Business", status: "Connected" },
  { icon: <Mail strokeWidth={2} className="h-[13px] w-[13px] text-[#2f6fe0]" />, name: "Official Email", status: "Connected" },
  { icon: <Bot strokeWidth={2} className="h-[13px] w-[13px] text-[#7a3fe0]" />, name: "AI Inbound Calling", status: "Connected" },
  { icon: <PhoneCall strokeWidth={2} className="h-[13px] w-[13px] text-[#2f6fe0]" />, name: "AI Outbound Calling", status: "Connected" },
  { icon: <Globe strokeWidth={2} className="h-[13px] w-[13px] text-[#2f6fe0]" />, name: "Website", status: "Connected" },
  { icon: <Users strokeWidth={2} className="h-[13px] w-[13px] text-[#2f6fe0]" />, name: "HRMS", status: "Connected" },
  { icon: <IndianRupee strokeWidth={2} className="h-[13px] w-[13px] text-[#f0a020]" />, name: "Payment Gateway", status: "Delayed" },
  { icon: <Wallet strokeWidth={2} className="h-[13px] w-[13px] text-[#e02424]" />, name: "Accounting Software", status: "Failed" },
];

const security: { icon: LucideIcon; label: string; value: React.ReactNode; chip?: "solidRed" | "amber" | "green" | "plainGreen"; link?: boolean }[] = [
  { icon: ShieldCheck, label: "Active Security Alerts", value: "02", chip: "solidRed", link: true },
  { icon: KeyRound, label: "Failed Login Attempts (24 hrs)", value: "08", chip: "amber", link: true },
  { icon: UserCog, label: "Unauthorised Access Attempts", value: "01", chip: "amber", link: true },
  { icon: Users, label: "Active User Sessions", value: "48" },
  { icon: Database, label: "Last Successful Backup", value: "24 Nov, 02:00 AM", chip: "green" },
  { icon: CloudUpload, label: "Next Scheduled Backup", value: "25 Nov, 02:00 AM", chip: "green" },
  { icon: History, label: "Last Restoration Test", value: <>22 Nov, 04:15 PM <span className="ml-[3px] inline-flex h-[13px] items-center rounded-full bg-[#d4f3d2] px-[5px] text-[10.4px] text-[#1c6b1f]">(Successful)</span></> },
  { icon: Lock, label: "Immutable Backup Status", value: "Active", chip: "green" },
  { icon: Clock3, label: "Actual Recovery Point (RPO)", value: "8 Minutes" },
  { icon: Database, label: "Storage Utilisation", value: "412 GB / 1 TB (41%)" },
  { icon: Power, label: "Emergency System Lockdown", value: "Ready", chip: "green" },
];

const quickActions: { icon: LucideIcon; label: string; to: string; bg: string; fg: string }[] = [
  { icon: UsersRound, label: "Manage Access", to: "Users & Access Control", bg: "#eaf2ff", fg: "#1d5bd6" },
  { icon: CircleCheckBig, label: "Review Approvals", to: "Central Approvals", bg: "#fff4dc", fg: "#e08a00" },
  { icon: FileCheck2, label: "Assign Task", to: "Case & Workflow", bg: "#eaf7e8", fg: "#1f9a2b" },
  { icon: Sparkles, label: "Automation Control", to: "Automation & AI", bg: "#f1ebff", fg: "#7a3fe0" },
  { icon: Link2, label: "Integration Health", to: "Integrations & API", bg: "#fff4dc", fg: "#e08a00" },
  { icon: Database, label: "Backup & Restore", to: "Backup & Recovery", bg: "#eaf2ff", fg: "#1d5bd6" },
  { icon: ShieldCheck, label: "Security Control", to: "System Security", bg: "#eaf7e8", fg: "#1f9a2b" },
];

const insights = [
  "3 Emergency requests require immediate attention.",
  "5 Tasks are overdue. Review responsible admins.",
  "1 Integration requires technical intervention.",
  "8 Team members have training due.",
];

export default function SA001Dashboard() {
  const [fy, setFy] = useState<(typeof fyOptions)[number]>("FY 2026 – 27");
  const [tab, setTab] = useState<Tab>("Overview");
  // this component renders the frame, so the role is fixed here (no context yet)
  const href = (label: string) => sectionHref("super-admin", label);
  const notice = useNotice();
  const [updated, setUpdated] = useState("11:40 AM");

  return (
    <SuperAdminFrame>
      <PageHead title="Super Admin Dashboard" links={["Complete Organisation & System Control"]}>
        <Dropdown label="Financial year" value={fy} options={fyOptions} onChange={setFy} className="w-[150px]" />
        <CentreDropdown className="w-[150px]" />
        <div className="flex h-[38px] items-center gap-[8px] px-[4px] text-[13px] font-semibold">
          <Clock3 strokeWidth={2} className="h-[18px] w-[18px]" />
          <div className="leading-tight">
            <p className="whitespace-nowrap"><Today /> <span className="ml-[10px]">11:45 AM</span></p>
            <p className="text-[11px] font-medium text-[#2f4fe0]">Last Updated : {updated}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Refresh dashboard"
          onClick={() => {
            setUpdated(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
            notice.show("Dashboard refreshed (demo data).");
          }}
          className="flex h-[34px] w-[38px] items-center justify-center rounded-[8px] border-[1.5px] border-[#6d7fe8] bg-[#f3f7ff] text-[#2320c4] hover:bg-[#e9f0ff]"
        >
          <RefreshCw strokeWidth={2.3} className="h-[18px] w-[18px]" />
        </button>
      </PageHead>

      <KpiRow cols={8}>
        <KpiTile tone="blue" icon={Users} value="186" label="Total CRM Users" sub="3 Access Levels" />
        <KpiTile tone="orange" icon={Network} value="12" label="Active Admins" sub="Department-wise" />
        <KpiTile tone="green" icon={Layers} value="324" label="Sewa Requests" sub={<>This Month <Trend value="+14%" /></>} />
        <KpiTile tone="sky" icon={Building2} value="18" label="Active Cases" sub="Live Status" />
        <KpiTile tone="green" icon={CircleCheck} value="276" label="Completed Sewa" sub="This Month (85%)" />
        <KpiTile tone="red" icon={TriangleAlert} value="03" label="Emergency Requests" badge={{ text: "Immediate Attention", tone: "solidRed" }} />
        <KpiTile tone="purple" icon={IndianRupee} value="₹18.76 L" label="Donations Received" sub={<>This FY <Trend value="+22%" /></>} />
        <KpiTile tone="purple" icon={Database} value="₹12.40 L" label="Sewa Expenses" sub="This FY" />
      </KpiRow>

      <Tabs
        tabs={tabs}
        value={tab}
        icons={tabIcons}
        onChange={(t) => {
          setTab(t);
          const to = tabSection[t];
          if (to) window.location.assign(href(to));
        }}
      />

      {/* Row 1 */}
      <div className="grid gap-[10px] sm:grid-cols-2 lg:h-[154px] lg:[grid-template-rows:minmax(0,1fr)] lg:grid-cols-[285fr_288fr_250fr_340fr]">
        <Panel title="Sewa Requests Trend" note="(Last 6 Months)">
          <TrendChart />
        </Panel>
        <Panel title="Request Status" note="(This Month)" bodyClassName="flex items-center gap-[14px]">
          <Donut size={104} thickness={16} segments={status.map((s) => ({ value: parseInt(s.value), color: s.color }))}>
            <span className="text-[22px] font-bold leading-none">324</span>
            <span className="text-[13px] font-semibold">Total</span>
          </Donut>
          <ul className="flex-1 space-y-[5px]">
            {status.map((s) => (
              <li key={s.label} className="flex items-center gap-[6px] text-[12.5px] font-semibold">
                <Dot color={s.color} size={10} />
                <span className="flex-1">{s.label}</span>
                <b className="w-[28px] text-right">{s.value}</b>
                <span className="w-[40px] text-right">{s.pct}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Sewa Operations Overview" bodyClassName="flex flex-col justify-between pb-[7px] pt-[4px]">
          {sewaOps.map((r) => (
            <div key={r.label} className="flex items-center gap-[8px] text-[12.8px]">
              <r.icon strokeWidth={2} style={{ color: r.color }} className="h-[16px] w-[16px] shrink-0" />
              <span className="flex-1 font-semibold">{r.label}</span>
              <b>{r.value}</b>
            </div>
          ))}
        </Panel>
        <Panel title="Admin & User Overview" action={<ViewLink to="Users & Access Control" />} bodyClassName="pb-[3px] pt-[3px]">
          <div className="grid grid-cols-3 gap-[8px]">
            {[
              ["02", "Super Admin", "#7a3fe0"],
              ["12", "Admin", "#2f6fe0"],
              ["172", "User", "#2f6fe0"],
            ].map(([n, l, c]) => (
              <div key={l} className="flex h-[40px] items-center justify-center gap-[8px] rounded-[8px] border border-[#dfe5f3] bg-[#f4f7ff]">
                <UsersRound strokeWidth={1.9} style={{ color: c }} className="h-[22px] w-[22px]" />
                <span className="leading-none">
                  <b className="block text-[16px]">{n}</b>
                  <span className="text-[11.5px] font-semibold">{l}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-[7px] grid grid-cols-2 gap-x-[16px] gap-y-[3px] text-[12px] font-semibold">
            <MiniStat dot="#1f9a1f" label="Total Active Accounts" value="162" />
            <MiniStat dot="#f0a020" label="Pending Access Requests" value="03" />
            <MiniStat dot="#1f9a1f" label="Currently Online" value="48" />
            <MiniStat dot="#1f87e8" label="Training Pending" value="08" />
            <MiniStat dot="#1f9a1f" label="Inactive Accounts" value="24" />
          </div>
        </Panel>
      </div>

      {/* Row 2 */}
      <div className="grid gap-[10px] sm:grid-cols-2 lg:h-[268px] lg:[grid-template-rows:minmax(0,1fr)] lg:grid-cols-[290fr_303fr_267fr_297fr]">
        <Panel title="Critical Alerts & Priority Actions" action={<ViewLink to="Notification & Alerts" />} bodyClassName="flex flex-col justify-between gap-[3px] pb-[8px] pt-[2px]">
          {alerts.map((a) => (
            <Link key={a.title} href={href(a.to)} className="flex items-center gap-[8px] rounded-[6px] hover:bg-[#f6f8fd]">
              <a.icon strokeWidth={2} style={{ color: a.color }} className="h-[18px] w-[18px] shrink-0" />
              <span className="min-w-0 flex-1 leading-[1.1]">
                <b className="block truncate text-[12.2px] font-bold">{a.title}</b>
                {a.sub && <span className="block truncate text-[10.6px] font-medium text-[#3b4256]">{a.sub}</span>}
              </span>
              <Pill tone={a.tone} className="h-[18px] w-[36px] text-[12px] font-bold">{a.count}</Pill>
              <ChevronRight strokeWidth={2.4} className="h-[14px] w-[14px] shrink-0" />
            </Link>
          ))}
        </Panel>

        <Panel title="AI & Automation Control" action={<ViewLink to="Automation & AI">View Details</ViewLink>} bodyClassName="flex flex-col gap-[5px] pt-[3px]">
          <div className="grid grid-cols-3 gap-[5px]">
            {aiTiles.map((t) => (
              <div key={t.label} className="flex h-[42px] items-center gap-[5px] rounded-[8px] border border-[#e1e5ee] px-[5px] shadow-[0_1px_4px_rgba(30,50,110,0.06)]">
                <t.icon strokeWidth={2} className={`h-[19px] w-[19px] shrink-0 ${t.red ? "text-[#e02424]" : "text-[#7a3fe0]"}`} />
                <span className="min-w-0 leading-none">
                  <span className="block text-[9.2px] font-semibold leading-[1.05]">{t.label}</span>
                  <b className={`mt-[2px] block text-[14px] ${t.red ? "text-[#e02424]" : ""}`}>{t.value}</b>
                  {t.foot && <span className="text-[10.5px]"><Trend value={t.foot} /></span>}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11.6px] font-bold leading-none">Automation Mode <span className="font-medium">(Total Workflows : 32)</span></p>
          {modes.map((m) => (
            <div key={m.label} className="flex items-center gap-[7px] text-[11.4px] font-semibold leading-none">
              <Dot color={m.dot} size={8} />
              <span className="w-[92px]">{m.label}</span>
              <span className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#e3e7ef]">
                <span style={{ width: `${(m.value / 22) * 100}%`, background: m.color }} className="block h-full rounded-full" />
              </span>
              <b className="w-[18px] text-right">{String(m.value).padStart(2, "0")}</b>
            </div>
          ))}
          <div className="mt-auto grid grid-cols-2 gap-[6px]">
            <MoneyChip icon={IndianRupee} label="Monthly AI Cost" value="₹8,450" />
            <MoneyChip icon={Target} label="Monthly AI Budget" value="₹15,000 (56%)" />
          </div>
        </Panel>

        <Panel title="Integrations & Communication Status" titleSize={12.6} action={<ViewLink to="Integrations & API" />} bodyClassName="flex flex-col gap-[1px] pb-[3px] pt-0">
          <div className="flex items-center gap-[10px]">
            <Donut size={36} thickness={6} segments={[{ value: 12, color: "#1f9a1f" }, { value: 1, color: "#f7b500" }, { value: 1, color: "#e02424" }]}>
              <b className="text-[15px] leading-none">14</b>
              <span className="text-[9px] font-semibold leading-none">Total</span>
            </Donut>
            <ul className="flex-1 text-[10.6px] font-semibold leading-[12px]">
              {[
                ["Connected", "12", "(86%)", "#1f9a1f"],
                ["Delayed", "01", "(7%)", "#f7b500"],
                ["Failed", "01", "(7%)", "#e02424"],
              ].map(([l, v, p, c]) => (
                <li key={l} className="flex items-center gap-[6px]">
                  <Dot color={c} size={9} />
                  <span className="flex-1">{l}</span>
                  <b className="w-[20px] text-right">{v}</b>
                  <span className="w-[34px] text-right">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-[1px] text-[11.2px] font-bold leading-none">Key Integrations <span className="font-medium">(Status)</span></p>
          <ul className="flex flex-1 flex-col justify-between gap-[4px] pt-[2px]">
            {integrations.map((i) => (
              <li key={i.name} className="flex items-center gap-[6px] text-[10.4px] font-semibold leading-none">
                <span className="flex w-[14px] justify-center">{i.icon}</span>
                <span className="flex-1 truncate">{i.name}</span>
                <Pill tone={i.status === "Connected" ? "green" : i.status === "Delayed" ? "amber" : "red"} className="h-[16px] w-[72px] text-[10.4px]">{i.status}</Pill>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Security & Backup Overview" action={<ViewLink to="System Security">View Details</ViewLink>} bodyClassName="flex flex-col justify-between gap-[4px] pb-[6px] pt-[2px]">
          {security.map((s) => {
            const row = (
              <>
                <s.icon strokeWidth={2} className="h-[14px] w-[14px] shrink-0 text-[#1f9a2b]" />
                <span className="min-w-0 flex-1 truncate">{s.label}</span>
                {s.chip && s.chip !== "plainGreen" ? (
                  <Pill tone={s.chip === "solidRed" ? "red" : s.chip} className={`h-[14px] text-[10.4px] font-bold ${s.link ? "w-[34px]" : ""}`}>{s.value}</Pill>
                ) : (
                  <b className="flex items-center whitespace-nowrap text-[11.2px] leading-none">{s.value}</b>
                )}
                {s.link && <ChevronRight strokeWidth={2.4} className="h-[13px] w-[13px] shrink-0" />}
              </>
            );
            if (s.label === "Emergency System Lockdown")
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    if (window.confirm("Start an emergency system lockdown? This is recorded in the audit log, and manual emergency response stays available."))
                      notice.show("Lockdown request recorded for approval (demo).");
                  }}
                  className="flex items-center gap-[7px] text-left text-[11.4px] font-semibold leading-none hover:bg-[#f6f8fd]"
                >
                  {row}
                </button>
              );
            return s.link ? (
              <Link key={s.label} href={href("System Security")} className="flex items-center gap-[7px] text-[11.4px] font-semibold leading-none hover:bg-[#f6f8fd]">
                {row}
              </Link>
            ) : (
              <div key={s.label} className="flex items-center gap-[7px] text-[11.4px] font-semibold leading-none">
                {row}
              </div>
            );
          })}
        </Panel>
      </div>

      {/* Row 3 */}
      <div className="grid gap-[10px] sm:grid-cols-2 lg:h-[100px] lg:[grid-template-rows:minmax(0,1fr)] lg:grid-cols-[300fr_228fr_252fr_240fr_247fr] [&>section>header]:pt-[7px] [&>section>div]:pb-[7px] [&>section>div]:pt-[4px]">
        <Panel title="Service Coverage" bodyClassName="grid grid-cols-[1.25fr_1fr_1fr] gap-[6px]">
          {[
            ["Ghaziabad", "Active", "(Service Centre)", "bg-[#e4f6e2]", "text-[#1f9a2b]"],
            ["Delhi", "Coming Soon", "", "bg-[#fff1d6]", "text-[#ef9a12]"],
            ["Noida", "Coming Soon", "", "bg-[#fff1d6]", "text-[#ef9a12]"],
          ].map(([c, s, n, bg, fg]) => (
            <div key={c} className={`flex min-w-0 items-center gap-[4px] rounded-[8px] pl-[6px] pr-[5px] ${bg}`}>
              <MapPin strokeWidth={2.2} className={`h-[14px] w-[14px] shrink-0 ${fg}`} />
              <span className="min-w-0 leading-[1.1]">
                <b className="block whitespace-nowrap text-[11.2px]">{c}</b>
                <span className="block whitespace-nowrap text-[9.2px] font-semibold">{s}</span>
                {n && <span className="block whitespace-nowrap text-[8.4px] font-medium">{n}</span>}
              </span>
            </div>
          ))}
        </Panel>
        <Panel title="Resource Availability" bodyClassName="grid grid-cols-3 text-center">
          {[
            [Users, "Staff on Duty", "08 / 10"],
            [UsersRound, "Volunteers", "12 / 18"],
            [Truck, "Vehicles", "01 / 02"],
          ].map(([Icon, l, v]) => {
            const I = Icon as LucideIcon;
            return (
              <div key={l as string} className="flex flex-col items-center justify-center gap-[2px]">
                <I strokeWidth={2} className="h-[19px] w-[19px] text-[#2f6fe0]" />
                <span className="whitespace-nowrap text-[10.8px] font-semibold">{l as string}</span>
                <b className="text-[13.5px] leading-tight">{v as string}</b>
              </div>
            );
          })}
        </Panel>
        <Panel title="Financial Control" note="(This FY)" bodyClassName="grid min-w-0 grid-cols-[1.12fr_1fr] items-center gap-[6px]">
          <div className="flex h-full min-w-0 items-center gap-[4px] rounded-[8px] bg-[#e4f6e2] px-[6px]">
            <IndianRupee strokeWidth={2.2} className="h-[18px] w-[18px] shrink-0 text-[#1f9a2b]" />
            <span className="leading-tight">
              <b className="block text-[15px]">₹6.36 L</b>
              <span className="block whitespace-nowrap pr-[3px] text-[8.6px] font-semibold">Income Less Expenses</span>
            </span>
          </div>
          <div>
            <p className="whitespace-nowrap text-[8.8px] font-semibold">Expense against Donations</p>
            <b className="text-[15px]">66.1%</b>
            <span className="mt-[3px] block h-[6px] overflow-hidden rounded-full bg-[#e3e7ef]">
              <span className="block h-full w-[66.1%] rounded-full bg-[#2f6fe0]" />
            </span>
          </div>
        </Panel>
        <Panel title="Team Training Status" bodyClassName="grid grid-cols-3 text-center">
          {[
            [GraduationCap, "Staff Training", "92%", "text-[#1f9a2b]"],
            [UsersRound, "Volunteer Training", "80%", "text-[#1f9a2b]"],
            [FileCheck2, "Pending", "08", ""],
          ].map(([Icon, l, v, c]) => {
            const I = Icon as LucideIcon;
            return (
              <div key={l as string} className="flex flex-col items-center justify-center gap-[2px]">
                <I strokeWidth={2} className="h-[19px] w-[19px] text-[#2f6fe0]" />
                <span className="whitespace-nowrap text-[10px] font-semibold leading-tight">{l as string}</span>
                <b className={`text-[14px] leading-tight ${c as string}`}>{v as string}</b>
              </div>
            );
          })}
        </Panel>
        <Panel title={<span className="inline-flex items-center gap-[6px]"><ChartColumn strokeWidth={2} className="h-[16px] w-[16px]" />Key Performance</span>} note="(This Month)" bodyClassName="grid grid-cols-3 text-center">
          {[
            [ChartColumn, "82%", "Task Completion", "text-[#2f6fe0]"],
            [Target, "96%", "SLA Compliance", "text-[#7a3fe0]"],
            [TriangleAlert, "02", "Open Complaints", "text-[#e02424]"],
          ].map(([Icon, v, l, c]) => {
            const I = Icon as LucideIcon;
            return (
              <div key={l as string} className="flex flex-col items-center justify-center">
                <I strokeWidth={2} className={`h-[18px] w-[18px] ${c as string}`} />
                <b className="text-[15px] leading-tight">{v as string}</b>
                <span className="whitespace-nowrap text-[9.8px] font-semibold leading-tight">{l as string}</span>
              </div>
            );
          })}
        </Panel>
      </div>

      {/* AI insights */}
      <section aria-label="AI Management Insights" className="flex flex-col gap-2 rounded-[10px] border border-[#f1e2b8] bg-[#fffbef] px-[14px] py-[8px] lg:h-[31px] lg:flex-row lg:items-center lg:gap-0 lg:py-0">
        <p className="flex shrink-0 items-center gap-[8px] text-[14.5px] font-bold">
          <Sparkles strokeWidth={2} className="h-[18px] w-[18px]" /> AI Management Insights
        </p>
        <span className="mx-[16px] hidden h-[20px] w-[1.3px] bg-[#c9b88a] lg:block" />
        <ul className="flex min-w-0 flex-col gap-1 lg:flex-1 lg:flex-row lg:justify-between lg:gap-[10px]">
          {insights.map((t) => (
            <li key={t} className="flex min-w-0 items-center gap-[6px] text-[12px] font-semibold">
              <CircleCheck strokeWidth={2.2} className="h-[15px] w-[15px] shrink-0 text-[#1f9a2b]" />
              <span className="truncate">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Quick actions */}
      <section aria-label="Quick Actions" className="grid grid-cols-2 gap-[8px] sm:grid-cols-4 lg:flex lg:h-[31px] lg:items-center">
        <span className="col-span-2 flex h-[34px] shrink-0 lg:h-[31px] items-center rounded-r-[18px] rounded-l-[10px] sm:col-span-4 bg-[linear-gradient(90deg,#0d1f52,#14296a)] px-[20px] text-[14.5px] font-bold text-white">Quick Actions</span>
        {quickActions.map((a) => (
          <Link key={a.label} href={href(a.to)} style={{ background: a.bg }} className="flex h-[34px] min-w-0 flex-1 items-center justify-center gap-[7px] whitespace-nowrap rounded-[9px] lg:h-[31px] border border-black/5 px-[10px] text-[12.8px] font-semibold hover:brightness-95">
            <a.icon strokeWidth={2} style={{ color: a.fg }} className="h-[17px] w-[17px] shrink-0" />
            <span className="pt-px">{a.label}</span>
          </Link>
        ))}
      </section>
      {notice.node}
    </SuperAdminFrame>
  );
}

function MiniStat({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <span className="flex items-center gap-[6px]">
      <Dot color={dot} size={8} />
      <span className="min-w-0 flex-1 lg:truncate">{label}</span>
      <b>{value}</b>
    </span>
  );
}

function MoneyChip({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex h-[32px] items-center gap-[6px] rounded-[8px] border border-[#e1e5ee] px-[7px]">
      <Icon strokeWidth={2} className="h-[16px] w-[16px] shrink-0 text-[#7a3fe0]" />
      <span className="min-w-0 leading-none">
        <span className="block text-[10px] font-semibold">{label}</span>
        <b className="block text-[12.5px]">{value}</b>
      </span>
    </div>
  );
}

/** Bars = requests received, line = completed. */
function TrendChart() {
  const W = 300;
  const H = 108;
  const x0 = 30;
  const y0 = 86;
  const max = 400;
  const step = (W - x0 - 8) / trend.length;
  const cx = (i: number) => x0 + step * i + step / 2;
  const y = (v: number) => y0 - (v / max) * (y0 - 6);
  const line = trend.map((t, i) => `${i ? "L" : "M"}${cx(i)} ${y(t.c)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none h-[112px] w-full lg:h-full" role="img" aria-label="Sewa requests, last 6 months">
      {[0, 100, 200, 300, 400].map((v) => (
        <g key={v}>
          <line x1={x0} x2={W - 6} y1={y(v)} y2={y(v)} stroke="#edf0f5" strokeWidth={1} />
          <text x={x0 - 5} y={y(v) + 3} textAnchor="end" className="fill-[#3b4256] text-[8.5px] font-semibold">{v}</text>
        </g>
      ))}
      {trend.map((t, i) => (
        <g key={t.m}>
          <rect x={cx(i) - 11} y={y(t.v)} width={22} height={y0 - y(t.v)} rx={2} fill="#8fc6f5" />
          <text x={cx(i)} y={y(t.v) - 3} textAnchor="middle" className="fill-[#0b0c36] text-[8.5px] font-bold">{t.v}</text>
          <text x={cx(i)} y={y0 + 10} textAnchor="middle" className="fill-[#1a1d36] text-[8.5px] font-semibold">{t.m}</text>
        </g>
      ))}
      <path d={line} fill="none" stroke="#1d2d9a" strokeWidth={1.6} />
      {trend.map((t, i) => (
        <circle key={t.m} cx={cx(i)} cy={y(t.c)} r={2.4} fill="#fff" stroke="#1d2d9a" strokeWidth={1.4} />
      ))}
      <rect x={82} y={H - 8} width={8} height={7} fill="#8fc6f5" />
      <text x={94} y={H - 2} className="fill-[#1a1d36] text-[8.5px] font-semibold">Requests Received</text>
      <line x1={172} x2={190} y1={H - 4.5} y2={H - 4.5} stroke="#1d2d9a" strokeWidth={1.5} />
      <circle cx={181} cy={H - 4.5} r={2.2} fill="#fff" stroke="#1d2d9a" strokeWidth={1.3} />
      <text x={194} y={H - 2} className="fill-[#1a1d36] text-[8.5px] font-semibold">Completed</text>
    </svg>
  );
}

