"use client";

import { useState } from "react";
import {
  Bot,
  ChartColumn,
  Check,
  CircleCheck,
  Clock3,
  CloudUpload,
  Cloud,
  Database,
  FileText,
  HandHeart,
  History,
  IndianRupee,
  LayoutGrid,
  Layers,
  Link2,
  Lock,
  Mail,
  MapPin,
  MessageSquareMore,
  MessageSquareText,
  MonitorCheck,
  Network,
  Settings,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserRoundCog,
  Users,
  UsersRound,
  Zap,
} from "lucide-react";
import { DashboardCanvas, Box } from "@/components/dashboards/canvas";
import PageHeader from "@/components/dashboards/PageHeader";
import {
  At,
  Bar,
  Card,
  CardTitle,
  CountBadge,
  Donut,
  Dot,
  Footer,
  Ico,
  Kpi,
  Pill,
  Select,
  Trend,
  TileLink,
  ViewAll,
  WhatsAppIcon,
} from "@/components/dashboards/ui";

/* TODO: replace the static figures below with live data from the API. */

const centres = ["All Centres", "Ghaziabad Centre", "Delhi Centre", "Noida Centre", "Gurugram Centre"] as const;
const trendRanges = ["Last 6 Months", "Last 12 Months", "This Year"] as const;
const periods = ["This Month", "Last Month", "This Quarter", "This Year"] as const;

const trend = [
  { m: "Jun", received: 78, completed: 89 },
  { m: "Jul", received: 96, completed: 116 },
  { m: "Aug", received: 118, completed: 149 },
  { m: "Sep", received: 146, completed: 178 },
  { m: "Oct", received: 178, completed: 217 },
  { m: "Nov", received: 224, completed: 252 },
];

const status = [
  { label: "Completed", value: "276", pct: "(85%)", color: "#1f9a1f" },
  { label: "In Progress", value: "18", pct: "(6%)", color: "#1f87e8" },
  { label: "Pending", value: "14", pct: "(4%)", color: "#f7b500" },
  { label: "On Hold", value: "16", pct: "(5%)", color: "#c4cad6" },
];

const services = [
  { color: "#f0a020", label: "Cremation Support", requests: "126", share: "38%" },
  { color: "#e02424", label: "Post-Cremation Rituals", requests: "68", share: "21%" },
  { color: "#2f4fe0", label: "Document Assistance", requests: "42", share: "13%" },
  { color: "#2f7fe0", label: "Counselling & Support", requests: "34", share: "10%", users: true },
  { color: "#3a4060", label: "Other Services", requests: "54", share: "16%" },
];

const centrePerformance = [
  ["Ghaziabad Centre", "102", "88", "86%"],
  ["Delhi Centre", "76", "64", "84%"],
  ["Noida Centre", "58", "50", "86%"],
  ["Gurugram Centre", "46", "40", "87%"],
  ["Other Centres (3)", "42", "34", "81%"],
];

const health = [
  { icon: MonitorCheck, color: "#169a2b", label: "CRM Application", pill: "Operational" },
  { icon: Zap, color: "#169a2b", label: "Automation Services", pill: "Operational" },
  { icon: Link2, color: "#169a2b", label: "Integrations (Email, WhatsApp, SMS)", pill: "Operational" },
  { icon: Database, color: "#169a2b", label: "Database & Storage", text: "412 GB / 1 TB (41%)" },
  { icon: CloudUpload, color: "#169a2b", label: "Data Backup", text: "Last Backup: 02:00 AM" },
  { icon: ShieldCheck, color: "#169a2b", label: "Security (Access & Firewall)", pill: "Protected" },
];

const activities = [
  { icon: CircleCheck, color: "#169a2b", solid: true, text: "New user created – USR-0042", time: "10:24 AM" },
  { icon: Settings, color: "#7a2fe0", text: "Automation rule updated – AUTO-015", time: "09:56 AM" },
  { icon: CloudUpload, color: "#2f6fe0", text: "System backup completed", time: "09:30 AM" },
  { icon: ShieldCheck, color: "#f0a020", solid: true, text: "Role permission modified – RP-008", time: "08:58 AM" },
  { icon: Link2, color: "#3a4fd0", text: "Integration sync successful – INT-001", time: "08:40 AM" },
];

const approvals = [
  { icon: FileText, color: "#f0a020", label: "Requests for Approval", count: "07", badge: "#e01414" },
  { icon: IndianRupee, color: "#f0a020", label: "Expense Approvals", count: "03", badge: "#f59e0b" },
  { icon: UserRoundCog, color: "#f0a020", label: "User / Role Requests", count: "02", badge: "#f59e0b" },
  { icon: Bot, color: "#7a2fe0", label: "Automation Changes", count: "01", badge: "#1f5fc4" },
  { icon: Bot, color: "#2f6fe0", label: "Integration Approvals", count: "01", badge: "#1f5fc4" },
];

const integrations = [
  { icon: <Ico icon={Mail} color="#2f6fe0" size={20} stroke={1.9} />, name: "Official Email (SMTP)", time: "10:20 AM" },
  { icon: <WhatsAppIcon size={20} />, name: "WhatsApp Business (API)", time: "10:18 AM" },
  { icon: <Ico icon={MessageSquareMore} color="#169a2b" size={20} stroke={1.9} />, name: "SMS Gateway (API)", time: "10:15 AM" },
  { icon: <Ico icon={Cloud} color="#2f6fe0" size={20} stroke={1.9} />, name: "Other APIs (3)", time: "10:12 AM" },
];

const ai = [
  { x: 9, w: 112, icon: Bot, label: "AI Interactions", value: "2,846", foot: <Trend size={13.5}>+18%</Trend> },
  { x: 128, w: 112, icon: Network, label: "Automations", value: "32", foot: <p className="mt-[2px] text-[14px] font-semibold leading-none text-[#138a16]">Active</p> },
  { x: 247, w: 112, icon: Clock3, label: "Time Saved", value: "186 Hours", foot: <Trend size={13.5}>+21%</Trend> },
  { x: 366, w: 112, icon: Layers, label: "Auto Rules", value: "14", foot: <p className="mt-[2px] text-[12.5px] font-semibold leading-none">Configured</p> },
];

const security = [
  { icon: ShieldCheck, label: "Security Score", value: <>98 <span className="text-[#137a1a]">/ 100</span></>, pill: "(Excellent)" },
  { icon: Database, label: "Last Backup", value: "24 Nov, 02:00 AM", pill: "(Successful)" },
  { icon: History, label: "Recovery Point", value: <span className="text-[#137a1a]">≤ 15 Minutes</span> },
  { icon: Lock, label: "Access Alerts", value: "0", pill: "(No Risk)" },
];

const modules = [
  { icon: Users, color: "#2f6fe0", lines: ["Users &", "Access"], to: "Users & Access" },
  { icon: Network, color: "#f0a020", lines: ["Departments", "& Centres"], to: "Departments" },
  { icon: HandHeart, color: "#f0a020", lines: ["Sewa", "Operations"], to: "Sewa Operations" },
  { icon: MessageSquareText, color: "#2f6fe0", lines: ["Communication", "Hub"], to: "Communication Hub" },
  { icon: Sparkles, color: "#7a2fe0", lines: ["Automation", "& AI"], to: "Automation & AI" },
  { icon: ChartColumn, color: "#7a2fe0", lines: ["Reports", "& Analytics"], to: "Reports & Analytics" },
  { icon: IndianRupee, color: "#f0a020", lines: ["Accounts &", "Donations"], to: "Accounts & Donations" },
  { icon: ShieldCheck, color: "#169a2b", lines: ["Security &", "Backup"], to: "System Security" },
  { icon: FileText, color: "#2f6fe0", lines: ["Audit", "Logs"], to: "Audit Logs" },
  { icon: Settings, color: "#f0a020", lines: ["System", "Settings"], to: "System Settings" },
];

const cell = "absolute whitespace-nowrap leading-none tracking-[-0.3px]";

export default function SuperAdminDashboard() {
  const [range, setRange] = useState<(typeof trendRanges)[number]>("Last 6 Months");
  const [workPeriod, setWorkPeriod] = useState<(typeof periods)[number]>("This Month");

  return (
    <DashboardCanvas role="super-admin">
      <PageHeader
        spec={{
          title: "Super Admin Dashboard",
          x: 236,
          titleY: 65,
          titleSize: 27,
          linksY: 95,
          linksSize: 16,
          links: [
            { label: "Complete Organisation & System Control" },
            { label: "Users", to: "Users & Access" },
            { label: "Operations", to: "Sewa Operations" },
            { label: "Automation", to: "Automation & AI" },
            { label: "Security", to: "System Security" },
          ],
          date: [998, 202],
          centre: [1222, 199],
          refresh: [1451, 132],
          controlsY: 73,
          controlsH: 38,
          controlSize: 15.6,
          centres,
          defaultCentre: "All Centres",
        }}
      />

      {/* KPIs */}
      <Kpi at={[230, 129, 171, 78]} theme="blue" bubble={{ cx: 40, cy: 38, d: 52 }} icon={<Ico icon={Users} color="#1f5fd8" size={38} stroke={2} />} textX={79} value="186" valueSize={24} label="Total Users" labelSize={13.6} lines={<Trend size={14}>+8%</Trend>} />
      <Kpi at={[413, 129, 167, 78]} theme="orange" bubble={{ cx: 38, cy: 38, d: 52 }} icon={<Ico icon={Network} color="#f0a020" size={34} stroke={2} />} textX={76} value="18" valueSize={24} label="Departments" labelSize={13.2} />
      <Kpi at={[592, 129, 168, 78]} theme="purple" bubble={{ cx: 36, cy: 38, d: 52 }} icon={<Ico icon={MapPin} color="#7a2fe0" size={34} stroke={2} />} textX={74} value="07" valueSize={24} label="Service Centres" labelSize={13.2} />
      <Kpi at={[772, 129, 163, 78]} theme="green" bubble={{ cx: 37, cy: 38, d: 52 }} icon={<Ico icon={Layers} color="#169a2b" size={36} stroke={2} />} textX={75} value="324" valueSize={24} label="Total Requests" labelSize={13} lines={<Trend size={14}>+14%</Trend>} />
      <Kpi at={[947, 129, 157, 78]} theme="mint" bubble={{ cx: 37, cy: 38, d: 52 }} icon={<Ico icon={Check} color="#14913a" size={38} stroke={2.6} />} textX={73} value="276" valueSize={24} label="Completed" labelSize={13.2} lines={<p className="mt-[2px] text-[13.2px] font-semibold leading-none">(85%)</p>} />
      <Kpi at={[1116, 129, 144, 78]} theme="red" bubble={{ cx: 36, cy: 38, d: 52 }} icon={<Ico icon={TriangleAlert} color="#e02020" size={36} stroke={2} />} textX={72} value="32" valueSize={24} label="Pending" labelSize={13.2} lines={<p className="mt-[2px] text-[13.2px] font-semibold leading-none">(10%)</p>} />
      <Kpi at={[1272, 129, 158, 78]} theme="gold" bubble={{ cx: 33, cy: 38, d: 52 }} icon={<Ico icon={IndianRupee} color="#f39a18" size={34} stroke={2} />} textX={69} value="₹18.76 L" valueSize={22.5} label="Total Donations" labelSize={12.8} lines={<Trend size={14}>+22%</Trend>} />
      <Kpi at={[1441, 129, 142, 78]} theme="sky" bubble={{ cx: 36, cy: 38, d: 52 }} icon={<Ico icon={ShieldCheck} color="#1f5fd8" size={38} stroke={1.9} />} textX={68} value="96%" valueSize={24} label={<>System<br />Uptime</>} labelSize={13.6} />

      {/* Sewa Requests Trend */}
      <Card at={[229, 224, 362, 192]} label="Sewa Requests Trend">
        <CardTitle x={11} y={9} size={16.2}>Sewa Requests Trend</CardTitle>
        <At x={248} y={6} w={104} h={23}>
          <Select label="Trend range" value={range} options={trendRanges} onChange={setRange} size={11.8} className="h-full" />
        </At>
        <TrendChart />
      </Card>

      {/* Request Status */}
      <Card at={[604, 224, 310, 192]} label="Request Status">
        <CardTitle x={11} y={9} size={16.2} note="(This Month)">Request Status</CardTitle>
        <At x={13} y={49}>
          <Donut size={128} thickness={19} segments={[{ value: 85, color: "#1f9a1f" }, { value: 6, color: "#1f87e8" }, { value: 4, color: "#f7b500" }, { value: 5, color: "#c4cad6" }]}>
            <span className="text-[27px] font-bold leading-none tracking-[-0.5px]">324</span>
            <span className="mt-[2px] text-[16px] font-semibold leading-tight">Total</span>
          </Donut>
        </At>
        {status.map((s, i) => {
          const cy = 64 + i * 26.3;
          return (
            <div key={s.label}>
              <At x={150} y={cy - 6.5}><Dot color={s.color} size={13} /></At>
              <At x={170} y={cy - 6} className={`${cell} text-[12.6px] font-semibold`}>{s.label}</At>
              <At x={226} y={cy - 6} w={34} className={`${cell} text-right text-[13px] font-bold`}>{s.value}</At>
              <At x={258} y={cy - 6} w={43} className={`${cell} text-right text-[13px] font-semibold`}>{s.pct}</At>
            </div>
          );
        })}
      </Card>

      {/* Requests by Service Type */}
      <Card at={[927, 224, 300, 192]} label="Requests by Service Type">
        <CardTitle x={12} y={9} size={16.2} note="(This Month)">Requests by Service Type</CardTitle>
        <At x={12} y={34} w={276} h={18} className="rounded-[4px] bg-[#e9edf4]" />
        <At x={18} y={38} className={`${cell} text-[12.4px] font-bold`}>Service Type</At>
        <At x={170} y={38} w={60} className={`${cell} text-center text-[12.4px] font-bold`}>Requests</At>
        <At x={238} y={38} w={46} className={`${cell} text-right text-[12.4px] font-bold`}>Share</At>
        {services.map((r, i) => {
          const cy = 65 + i * 21;
          return (
            <div key={r.label}>
              <At x={18} y={cy - 8}>{r.users ? <Ico icon={UsersRound} color={r.color} size={16} stroke={2} /> : <Ico icon={Layers} color={r.color} size={16} stroke={2} />}</At>
              <At x={48} y={cy - 5} className={`${cell} text-[11.2px] font-semibold`}>{r.label}</At>
              <At x={170} y={cy - 6} w={60} className={`${cell} text-center text-[12.8px] font-bold`}>{r.requests}</At>
              <At x={238} y={cy - 6} w={46} className={`${cell} text-right text-[12.8px] font-semibold`}>{r.share}</At>
              <At x={14} y={cy + 10} w={272} h={1} className="bg-[#edf0f5]" />
            </div>
          );
        })}
        <At x={48} y={165} className={`${cell} text-[13.5px] font-bold`}>Total</At>
        <At x={170} y={165} w={60} className={`${cell} text-center text-[13.5px] font-bold`}>324</At>
        <At x={238} y={165} w={46} className={`${cell} text-right text-[13.5px] font-bold`}>100%</At>
      </Card>

      {/* Centre Performance */}
      <Card at={[1241, 224, 342, 192]} label="Centre Performance">
        <CardTitle x={11} y={9} size={16.2} note="(This Month)">Centre Performance</CardTitle>
        <ViewAll right={14} y={10} size={13} to="Centre Performance" />
        <At x={10} y={36} w={322} h={18} className="rounded-[4px] bg-[#e9edf4]" />
        <At x={18} y={40} className={`${cell} text-[12.4px] font-bold`}>Service Centre</At>
        {["Requests", "Completed", "Rate"].map((h, i) => (
          <At key={h} x={[140, 212, 280][i]} y={40} w={[60, 64, 46][i]} className={`${cell} ${i === 2 ? "text-right" : "text-center"} text-[12.4px] font-bold`}>{h}</At>
        ))}
        {centrePerformance.map((r, i) => {
          const cy = 65 + i * 20.4;
          return (
            <div key={r[0]}>
              <At x={18} y={cy - 6} className={`${cell} text-[12.4px] font-semibold`}>{r[0]}</At>
              {r.slice(1).map((v, j) => (
                <At key={j} x={[140, 212, 280][j]} y={cy - 6} w={[60, 64, 46][j]} className={`${cell} ${j === 2 ? "text-right" : "text-center"} text-[12.6px] font-semibold`}>{v}</At>
              ))}
              {i < 4 && <At x={12} y={cy + 9} w={318} h={1} className="bg-[#edf0f5]" />}
            </div>
          );
        })}
        <At x={10} y={157} w={322} h={22} className="rounded-[4px] bg-[#e9effa]" />
        <At x={18} y={163} className={`${cell} text-[13.2px] font-bold`}>Total (7 Centres)</At>
        {["324", "276", "85%"].map((v, j) => (
          <At key={v} x={[140, 212, 280][j]} y={163} w={[60, 64, 46][j]} className={`${cell} ${j === 2 ? "text-right" : "text-center"} text-[13.4px] font-bold`}>{v}</At>
        ))}
      </Card>

      {/* System Health & Services */}
      <Card at={[230, 429, 325, 176]} label="System Health & Services">
        <CardTitle x={10} y={9} size={16.2}>System Health &amp; Services</CardTitle>
        {health.map((h, i) => {
          const cy = 45 + i * 23;
          return (
            <div key={h.label}>
              <At x={17} y={cy - 9}><Ico icon={h.icon} color={h.color} size={18} stroke={2} /></At>
              <At x={52} y={cy - 5.5} className={`${cell} ${i === 2 ? "text-[11.1px]" : "text-[11.8px]"} font-semibold`}>{h.label}</At>
              <At x={200} y={cy - 9} w={115} className="flex justify-end">
                {h.pill ? (
                  <Pill tone="green" w={84} h={18} size={12.4}>{h.pill}</Pill>
                ) : (
                  <span className="whitespace-nowrap pt-[3px] text-[12.4px] font-semibold leading-none tracking-[-0.3px]">{h.text}</span>
                )}
              </At>
            </div>
          );
        })}
      </Card>

      {/* Recent System Activities */}
      <Card at={[569, 429, 345, 176]} label="Recent System Activities">
        <CardTitle x={11} y={9} size={16.2}>Recent System Activities</CardTitle>
        <ViewAll right={13} y={10} size={13} to="Audit Logs" />
        <At x={10} y={33} w={326} h={21} className="rounded-[4px] bg-[#e9edf4]" />
        <At x={17} y={39} className={`${cell} text-[12.6px] font-bold`}>Activity</At>
        <At x={280} y={39} w={48} className={`${cell} text-right text-[12.6px] font-bold`}>Time</At>
        {activities.map((a, i) => {
          const cy = 66 + i * 23.5;
          return (
            <div key={a.text}>
              <At x={16} y={cy - 9}>
                {a.solid ? (
                  <span style={{ background: a.color }} className="flex h-[18px] w-[18px] items-center justify-center rounded-full">
                    <Check strokeWidth={3.4} className="h-[11px] w-[11px] text-white" />
                  </span>
                ) : (
                  <Ico icon={a.icon} color={a.color} size={18} stroke={2} />
                )}
              </At>
              <At x={51} y={cy - 5.5} className={`${cell} text-[12.4px] font-semibold`}>{a.text}</At>
              <At x={268} y={cy - 5.5} w={60} className={`${cell} text-right text-[12.6px] font-semibold`}>{a.time}</At>
            </div>
          );
        })}
      </Card>

      {/* Workload & Performance */}
      <Card at={[928, 429, 324, 176]} label="Workload & Performance">
        <CardTitle x={11} y={9} size={16.2}>Workload &amp; Performance</CardTitle>
        <At x={227} y={5} w={90} h={23}>
          <Select label="Workload period" value={workPeriod} options={periods} onChange={setWorkPeriod} size={11.8} className="h-full" />
        </At>
        {[
          { icon: UsersRound, color: "#2f6fe0", label: "Active Users", y: 49 },
          { icon: FileText, color: "#2f6fe0", label: "Tasks Completed", y: 83 },
          { icon: LayoutGrid, color: "#2f6fe0", label: "Avg. Resolution Time", y: 118 },
          { icon: Sparkles, color: "#f0a020", label: "Team Performance", y: 152 },
        ].map((r) => (
          <div key={r.label}>
            <At x={17} y={r.y - 10}><Ico icon={r.icon} color={r.color} size={20} stroke={2} /></At>
            <At x={55} y={r.y - 6} className={`${cell} text-[12.8px] font-semibold`}>{r.label}</At>
          </div>
        ))}
        <At x={130} y={43} w={182} className={`${cell} text-right text-[12.8px] font-bold`}>
          162 / 186 <span className="ml-[10px] font-semibold text-[#137a1a]">(87%)</span>
        </At>
        <At x={174} y={59}><Bar value={87} w={138} h={5} color="#1d8f1d" track="#d8dee8" /></At>
        <At x={130} y={77} w={182} className={`${cell} text-right text-[12.8px] font-semibold`}>
          1,248 / 1,520 <span className="ml-[8px]">(82%)</span>
        </At>
        <At x={174} y={93}><Bar value={82} w={138} h={5} color="#1d8f1d" track="#d8dee8" /></At>
        <At x={220} y={109} w={96} h={20} className="flex items-center justify-center rounded-full bg-[#cff0c9] pt-[2px] text-[12.8px] font-bold leading-none">4.6 Hours</At>
        <At x={220} y={142} w={96} h={20} className="flex items-center justify-center rounded-full bg-[#cff0c9] pt-[2px] text-[12.8px] font-bold leading-none">86%</At>
      </Card>

      {/* Approvals & Pending Actions */}
      <Card at={[1266, 429, 316, 176]} label="Approvals & Pending Actions">
        <CardTitle x={10} y={9} size={16.2}>Approvals &amp; Pending Actions</CardTitle>
        <ViewAll right={10} y={10} size={13} to="Approvals" />
        {approvals.map((a, i) => {
          const cy = 46 + i * 27.4;
          return (
            <div key={a.label}>
              <At x={20} y={cy - 10}><Ico icon={a.icon} color={a.color} size={20} stroke={1.9} /></At>
              <At x={58} y={cy - 6} className={`${cell} text-[13.2px] font-semibold`}>{a.label}</At>
              <At x={259} y={cy - 9}><CountBadge color={a.badge}>{a.count}</CountBadge></At>
            </div>
          );
        })}
      </Card>

      {/* Integrations & API Status */}
      <Card at={[230, 617, 393, 141]} label="Integrations & API Status">
        <CardTitle x={10} y={9} size={16.2}>Integrations &amp; API Status</CardTitle>
        <ViewAll right={10} y={10} size={13} to="Integrations & API" />
        <At x={10} y={30} w={375} h={20} className="rounded-[4px] bg-[#e9edf4]" />
        <At x={20} y={35} className={`${cell} text-[12.6px] font-bold`}>Integration</At>
        <At x={211} y={35} w={70} className={`${cell} text-center text-[12.6px] font-bold`}>Status</At>
        <At x={302} y={35} w={70} className={`${cell} text-right text-[12.6px] font-bold`}>Last Sync</At>
        {integrations.map((r, i) => {
          const cy = 61 + i * 22.8;
          return (
            <div key={r.name}>
              <At x={18} y={cy - 10}>{r.icon}</At>
              <At x={52} y={cy - 5.5} className={`${cell} text-[12.6px] font-semibold`}>{r.name}</At>
              <At x={204} y={cy - 9}><Pill tone="green" w={84} h={18} size={12.4}>Operational</Pill></At>
              <At x={302} y={cy - 6} w={70} className={`${cell} text-right text-[12.8px] font-semibold`}>{r.time}</At>
              {i < 3 && <At x={12} y={cy + 11} w={371} h={1} className="bg-[#edf0f5]" />}
            </div>
          );
        })}
      </Card>

      {/* AI & Automation */}
      <Card at={[637, 617, 487, 141]} label="AI & Automation">
        <CardTitle x={11} y={9} size={18}>AI &amp; Automation</CardTitle>
        {ai.map((t) => (
          <At key={t.label} x={t.x} y={28} w={t.w} h={76} className="rounded-[9px] border border-[#e1e5ee] bg-white shadow-[0_2px_6px_rgba(30,50,110,0.08)]">
            <span className="absolute left-[8px] top-[26px]"><Ico icon={t.icon} color="#7a2fe0" size={23} stroke={2} /></span>
            <div className="absolute inset-y-0 left-[36px] right-[5px] flex min-w-0 flex-col items-center justify-center text-center">
              <p className="whitespace-nowrap text-[10.6px] font-semibold leading-none tracking-[-0.3px]">{t.label}</p>
              <p className="mt-[4px] whitespace-nowrap text-[14.6px] font-bold leading-none tracking-[-0.4px]">{t.value}</p>
              {t.foot}
            </div>
          </At>
        ))}
        <At x={9} y={109} w={471} h={25} className="flex items-center justify-center whitespace-nowrap rounded-[6px] bg-[#e5eefb] pt-[2px] text-[12.6px] font-semibold leading-none tracking-[-0.3px]">
          Auto Assignments: <b className="ml-[4px]">268</b>
          <span className="mx-[16px] h-[14px] w-[1.3px] bg-[#2b2f4a]" />
          AI Handling Rate: <b className="ml-[4px]">72%</b>
          <span className="mx-[16px] h-[14px] w-[1.3px] bg-[#2b2f4a]" />
          Active Workflows: <b className="ml-[4px]">12</b>
        </At>
      </Card>

      {/* Security & Backup Overview */}
      <Card at={[1139, 617, 443, 141]} label="Security & Backup Overview">
        <CardTitle x={10} y={9} size={16.2}>Security &amp; Backup Overview</CardTitle>
        <ViewAll right={10} y={10} size={13} to="System Security">View Details</ViewAll>
        <At x={10} y={29} w={423} h={1} className="bg-[#e6e9f0]" />
        {security.map((c, i) => {
          const cx = [53, 167, 282, 388][i];
          return (
            <div key={c.label}>
              {i > 0 && <At x={[110, 224, 334][i - 1]} y={42} w={1} h={86} className="bg-[#cfd5e0]" />}
              <At x={cx - 12} y={38}><Ico icon={c.icon} color="#169a2b" size={24} stroke={2} /></At>
              <At x={cx - 60} y={73} w={120} className={`${cell} text-center text-[12.6px] font-semibold`}>{c.label}</At>
              <At x={cx - 60} y={90} w={120} className={`${cell} text-center text-[13.6px] font-bold`}>{c.value}</At>
              {c.pill && (
                <At x={cx - 45} y={109} w={90} className="flex justify-center">
                  <Pill tone="green" h={20} size={12.6}>{c.pill}</Pill>
                </At>
              )}
            </div>
          );
        })}
      </Card>

      {/* Key Modules */}
      <Box at={[230, 770, 1353, 75]} label="Key Modules" className="rounded-[10px] border border-[#e1e5ee] bg-white shadow-[0_3px_10px_rgba(30,50,110,0.07)]">
        <div className="absolute inset-y-[3px] left-0 flex w-[151px] items-center rounded-l-[9px] bg-[linear-gradient(90deg,#0d1f52,#14296a)] pl-[19px] text-[19px] font-bold tracking-[-0.3px] text-white [clip-path:polygon(0_0,88%_0,100%_50%,88%_100%,0_100%)]">
          <span className="pt-[2px]">Key Modules</span>
        </div>
        {modules.map((m, i) => {
          const cx = [208, 330, 451, 573, 695, 817, 938, 1058, 1176, 1294][i];
          return (
            <div key={m.lines.join(" ")}>
              {i > 0 && <At x={cx - 61} y={14} w={1} h={46} className="bg-[#9aa1b5]" />}
              <TileLink to={m.to} style={{ left: cx - 55 }} className="top-[8px] flex w-[110px] flex-col items-center rounded-[8px] py-[2px]">
                <Ico icon={m.icon} color={m.color} size={22} stroke={1.9} />
                <span className="mt-[4px] whitespace-nowrap text-center text-[12.4px] font-semibold leading-[15px] tracking-[-0.3px]">
                  {m.lines[0]}
                  <br />
                  {m.lines[1]}
                </span>
              </TileLink>
            </div>
          );
        })}
      </Box>

      <Footer y={876} leftX={232} logoRight={1583} />
    </DashboardCanvas>
  );
}

/** Bars = requests received, line = completed (design values). */
function TrendChart() {
  const x0 = 46; // plot left (card-relative)
  const yZero = 148; // y of the 0 grid line
  const scale = 101 / 300; // px per request
  const step = 49.6;
  const colX = (i: number) => x0 + 27 + i * step;
  const y = (v: number) => yZero - v * scale;
  const line = trend.map((t, i) => `${i ? "L" : "M"}${colX(i)} ${y(t.completed)}`).join(" ");

  return (
    <>
      <svg className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible" aria-label="Requests received and completed, last 6 months" role="img">
        {[0, 50, 100, 150, 200, 250, 300].map((v) => (
          <text key={v} x={x0 - 8} y={y(v) + 4} textAnchor="end" className="fill-[#1a1d36] text-[12px] font-semibold">
            {v}
          </text>
        ))}
        <line x1={x0} x2={x0} y1={y(300)} y2={yZero} stroke="#7c8296" strokeWidth={1} />
        <line x1={x0} x2={x0 + 300} y1={yZero} y2={yZero} stroke="#7c8296" strokeWidth={1} />
        {trend.map((t, i) => (
          <g key={t.m}>
            <rect x={colX(i) - 15} y={y(t.received)} width={30} height={t.received * scale} rx={2} fill="#7cc1f5" />
            <text x={colX(i)} y={y(t.received) + 16} textAnchor="middle" className="fill-[#0b0c36] text-[12px] font-bold">
              {t.received}
            </text>
            <text x={colX(i)} y={yZero + 16} textAnchor="middle" className="fill-[#1a1d36] text-[12px] font-semibold">
              {t.m}
            </text>
          </g>
        ))}
        <path d={line} fill="none" stroke="#1d2d9a" strokeWidth={2.2} />
        {trend.map((t, i) => (
          <circle key={t.m} cx={colX(i)} cy={y(t.completed)} r={4.4} fill="#fff" stroke="#1d2d9a" strokeWidth={2} />
        ))}
      </svg>
      <div className="absolute left-[83px] top-[172px] flex items-center whitespace-nowrap text-[12.4px] font-semibold leading-none tracking-[-0.3px]">
        <span className="mr-[6px] h-[11px] w-[13px] rounded-[2px] bg-[#7cc1f5]" />
        <span className="pt-[2px]">Requests Received</span>
        <svg viewBox="0 0 30 10" className="ml-[24px] mr-[6px] h-[10px] w-[30px]" aria-hidden>
          <line x1="0" x2="30" y1="5" y2="5" stroke="#1d2d9a" strokeWidth="2" />
          <circle cx="15" cy="5" r="3.6" fill="#fff" stroke="#1d2d9a" strokeWidth="1.8" />
        </svg>
        <span className="pt-[2px]">Completed</span>
      </div>
    </>
  );
}
