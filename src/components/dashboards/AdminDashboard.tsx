"use client";

import { useState } from "react";
import {
  BedDouble,
  ChartColumn,
  CircleCheck,
  CircleCheckBig,
  ClipboardCheck,
  FilePen,
  FileText,
  HandCoins,
  HandHeart,
  IndianRupee,
  Layers,
  MapPin,
  ShieldCheck,
  SquarePen,
  Store,
  Target,
  TriangleAlert,
  Truck,
  UserPlus,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import { DashboardCanvas } from "@/components/dashboards/canvas";
import PageHeader from "@/components/dashboards/PageHeader";
import {
  At,
  Bar,
  Card,
  CardTitle,
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
  type Tone,
} from "@/components/dashboards/ui";

/* TODO: replace the static figures below with live data from the API. */

const centres = ["Ghaziabad Centre", "Delhi Centre", "Noida Centre", "Gurugram Centre", "All Centres"] as const;
const periods = ["This Month", "Last Month", "This Quarter", "This Year"] as const;

const statusLegend = [
  { label: "Completed", value: "112", pct: "(79%)", color: "#1f9a1f" },
  { label: "In Progress", value: "12", pct: "(8%)", color: "#1f87e8" },
  { label: "Pending", value: "08", pct: "(6%)", color: "#f7b500" },
  { label: "On Hold", value: "10", pct: "(7%)", color: "#c4cad6" },
];

const teamPerformance = [
  { icon: UsersRound, color: "#2f7fe0", label: "Task Completion", value: 83 },
  { icon: UserRound, color: "#f0a020", label: "On-time Delivery", value: 88 },
  { icon: ClipboardCheck, color: "#f0a020", label: "Case Closure Rate", value: 81 },
  { icon: UsersRound, color: "#2f7fe0", label: "Team Productivity", value: 86 },
];

const serviceTypes = [
  { icon: Layers, color: "#f0a020", label: "Cremation Support", requests: 58, completed: 49 },
  { icon: Layers, color: "#e02424", label: "Post-Cremation Rituals", requests: 32, completed: 27 },
  { icon: FileText, color: "#2f7fe0", label: "Document Assistance", requests: 18, completed: 14 },
  { icon: Users, color: "#2f7fe0", label: "Counselling & Support", requests: 12, completed: 10 },
  { icon: Layers, color: "#1d2340", label: "Other Services", requests: 22, completed: 12 },
];

const centreOps = [
  { icon: Truck, label: "Vehicles Available", value: "02 / 03", color: "#169a2b" },
  { icon: BedDouble, label: "Mortuary / Freezer Units", value: "02", color: "#2f7fe0" },
  { icon: Layers, label: "Material Stock", value: "92%", color: "#169a2b" },
  { icon: Store, label: "Partner Facilities", value: "06", color: "#169a2b" },
  { icon: MapPin, label: "Service Coverage", value: "Ghaziabad (Active)", color: "#169a2b" },
];

const team = [
  ["Operations", "16", "15", "08"],
  ["Helpline & Communication", "08", "08", "05"],
  ["Verification & Documentation", "06", "06", "03"],
  ["Fleet & Logistics", "06", "06", "04"],
  ["Support & Others", "12", "11", "06"],
];

const approvals: { icon: typeof Users; color: string; text: string; tone: Tone; tag: string }[] = [
  { icon: UsersRound, color: "#e02424", text: "Sewa Request – SR-02684", tone: "peach", tag: "Case Approval" },
  { icon: FileText, color: "#7a2fe0", text: "Expense – EXP-0142 (₹ 28,500)", tone: "green", tag: "Finance" },
  { icon: FileText, color: "#f0a020", text: "Material Request – MR-0089", tone: "purple", tag: "Inventory" },
  { icon: Layers, color: "#169a2b", text: "Volunteer Onboarding – VOL-0034", tone: "pink", tag: "Volunteer" },
  { icon: FileText, color: "#2f7fe0", text: "Document Verification – DOC-0176", tone: "amber", tag: "Verification" },
];

const schedule = [
  ["10:30 AM", "Team Review Meeting"],
  ["12:00 PM", "Case Update – SR-02671"],
  ["02:00 PM", "Vendor Coordination – Fleet"],
  ["04:00 PM", "CSR Partner Call"],
  ["05:30 PM", "Daily Centre Review & Reporting"],
];

const activities = [
  { icon: UserRound, bg: "#16a34a", text: "Case SR-02671 updated to Completed", time: "10:24 AM" },
  { icon: FileText, bg: "#7a2fe0", text: "Expenne EXP-0140 approved", time: "09:56 AM", outline: true },
  { icon: Truck, bg: "#2f7fe0", text: "Vehicle VH-02 dispatched", time: "09:30 AM", outline: true },
  { icon: UsersRound, bg: "#f0a020", text: "New volunteer VOL-0034 added", time: "08:58 AM", outline: true },
  { icon: CircleCheckBig, bg: "#1f6fe0", text: "Team task completed – Operations", time: "08:40 AM" },
];

const keyActions: { icon: typeof Users; color: string; label: string; to?: string }[] = [
  { icon: UserPlus, color: "#2f6fe0", label: "Assign Task" },
  { icon: FilePen, color: "#2f6fe0", label: "Create Request" },
  { icon: ShieldCheck, color: "#169a2b", label: "Approve", to: "Approvals & Workflow" },
  { icon: UsersRound, color: "#169a2b", label: "Add Team Member" },
  { icon: SquarePen, color: "#2f6fe0", label: "Update Case" },
  { icon: ChartColumn, color: "#7a2fe0", label: "Generate Report" },
];

const targets = [
  { icon: Target, color: "#f0a020", name: "Sewa Requests", target: "150", achieved: "142 (95%)", value: 95 },
  { icon: UsersRound, color: "#2f6fe0", name: "Case Completion", target: "120", achieved: "112 (93%)", value: 93 },
  { icon: IndianRupee, color: "#f0a020", name: "Donation Collection", target: "₹10.00 L", achieved: "₹ 8.76 L (88%)", value: 88 },
];

const cell = "absolute whitespace-nowrap leading-none tracking-[-0.3px]";

export default function AdminDashboard() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("This Month");
  const [targetPeriod, setTargetPeriod] = useState<(typeof periods)[number]>("This Month");

  return (
    <DashboardCanvas role="admin">
      <PageHeader
        spec={{
          title: "Admin Dashboard",
          x: 247,
          titleY: 67,
          titleSize: 28.3,
          linksY: 99,
          linksSize: 15.6,
          links: [
            { label: "Department & Team Operations" },
            { label: "My Work", to: "My Workspace" },
            { label: "Team Control", to: "Team Management" },
            { label: "Approvals", to: "Approvals & Workflow" },
            { label: "Performance", to: "Reports & Analytics" },
          ],
          date: [961, 221],
          centre: [1206, 221],
          refresh: [1449, 132],
          controlsY: 75,
          controlsH: 39,
          controlSize: 16.8,
          centres,
          defaultCentre: "Ghaziabad Centre",
        }}
      />

      {/* KPIs */}
      <Kpi at={[236, 138, 168, 80]} theme="blue" bubble={{ cx: 40, cy: 37, d: 52 }} icon={<Ico icon={Users} color="#1f6fe0" size={36} stroke={2} />} center textX={64} textW={80} value="48" valueSize={22} label="Total Team" labelSize={13.8} lines={<Trend>+6%</Trend>} />
      <Kpi at={[413, 138, 161, 80]} theme="orange" bubble={{ cx: 39, cy: 37, d: 52 }} icon={<Ico icon={ClipboardCheck} color="#f0a020" size={34} stroke={2} />} center textX={68} textW={70} value="124" valueSize={22} label="My Tasks" labelSize={13.8} lines={<Trend>+12%</Trend>} />
      <Kpi at={[584, 138, 162, 80]} theme="purple" bubble={{ cx: 37, cy: 37, d: 52 }} icon={<Ico icon={Layers} color="#7a2fe0" size={34} stroke={2} />} center textX={72} textW={70} value="42" valueSize={22} label="Team Tasks" labelSize={13.8} lines={<Trend>+18%</Trend>} />
      <Kpi at={[755, 138, 162, 80]} theme="green" bubble={{ cx: 38, cy: 37, d: 52 }} icon={<Ico icon={HandHeart} color="#169a2b" size={36} stroke={2} />} center textX={70} textW={78} value="26" valueSize={22} label="Active Cases" labelSize={13.8} lines={<Trend>+11%</Trend>} />
      <Kpi at={[926, 138, 152, 80]} theme="mint" bubble={{ cx: 37, cy: 37, d: 52 }} icon={<Ico icon={CircleCheck} color="#14913a" size={38} stroke={2} />} center textX={66} textW={70} value="112" valueSize={22} label="Completed" labelSize={13.8} lines={<p className="mt-[3px] text-[15px] font-semibold leading-none">(83%)</p>} />
      <Kpi at={[1088, 138, 149, 80]} theme="red" bubble={{ cx: 38, cy: 37, d: 52 }} icon={<Ico icon={TriangleAlert} color="#e02020" size={38} stroke={2} />} center textX={66} textW={70} value="08" valueSize={22} label="Overdue" labelSize={13.8} lines={<p className="mt-[3px] text-[15px] font-semibold leading-none">(6%)</p>} />
      <Kpi at={[1246, 138, 170, 80]} theme="gold" bubble={{ cx: 37, cy: 37, d: 52 }} icon={<Ico icon={IndianRupee} color="#f39a18" size={34} stroke={2} />} center textX={64} textW={94} value="₹ 4.86 L" valueSize={22} label={<>Centre Expenses<br />This Month</>} labelSize={13} />
      <Kpi at={[1424, 138, 165, 80]} theme="sky" bubble={{ cx: 36, cy: 37, d: 52 }} icon={<Ico icon={HandCoins} color="#1f63d8" size={36} stroke={2} />} center textX={64} textW={98} value="18" valueSize={22} label="Active Volunteers" labelSize={12.6} lines={<Trend>+20%</Trend>} />

      {/* Sewa Requests */}
      <Card at={[237, 234, 371, 196]} label="Sewa Requests">
        <CardTitle x={11} y={9} size={18} note="(This Month)">Sewa Requests</CardTitle>
        <At x={257} y={5} w={104} h={24}>
          <Select label="Period" value={period} options={periods} onChange={setPeriod} size={12.6} className="h-full" />
        </At>
        <At x={18} y={39}>
          <Donut size={144} thickness={21} segments={[{ value: 79, color: "#1f9a1f" }, { value: 8, color: "#1f87e8" }, { value: 6, color: "#f7b500" }, { value: 7, color: "#c4cad6" }]}>
            <span className="text-[28px] font-bold leading-none tracking-[-0.5px]">142</span>
            <span className="mt-[2px] text-[16px] font-semibold leading-tight">Requests</span>
          </Donut>
        </At>
        {statusLegend.map((s, i) => {
          const cy = 67 + i * 29;
          return (
            <div key={s.label}>
              {i > 0 && <At x={200} y={cy - 14.5} w={160} h={1} className="bg-[#e8ebf1]" />}
              <At x={179} y={cy - 7}><Dot color={s.color} size={14} /></At>
              <At x={206} y={cy - 7} className={`${cell} text-[13px] font-semibold`}>{s.label}</At>
              <At x={268} y={cy - 7} w={44} className={`${cell} text-right text-[14px] font-bold`}>{s.value}</At>
              <At x={314} y={cy - 7} w={45} className={`${cell} text-right text-[14px] font-semibold`}>{s.pct}</At>
            </div>
          );
        })}
      </Card>

      {/* Team Performance */}
      <Card at={[621, 234, 301, 196]} label="Team Performance">
        <CardTitle x={13} y={9} size={18}>Team Performance</CardTitle>
        {teamPerformance.map((t, i) => {
          const y = 41 + i * 37;
          return (
            <div key={t.label}>
              <At x={17} y={y}><Ico icon={t.icon} color={t.color} size={26} stroke={1.9} /></At>
              <At x={61} y={y + 3} className={`${cell} text-[12.6px] font-semibold`}>{t.label}</At>
              <At x={232} y={y + 3} w={53} className={`${cell} text-right text-[14.5px] font-bold`}>{t.value}%</At>
              <At x={61} y={y + 21}><Bar value={t.value} w={171} h={6} color="#1d8f1d" track="#d8dee8" /></At>
            </div>
          );
        })}
      </Card>

      {/* Service Type Overview */}
      <Card at={[937, 234, 322, 196]} label="Service Type Overview">
        <CardTitle x={18} y={9} size={18}>Service Type Overview</CardTitle>
        <At x={16} y={31} w={294} h={20} className="rounded-[5px] bg-[#e9edf4]" />
        <At x={21} y={36} className={`${cell} text-[12.8px] font-bold`}>Service Type</At>
        <At x={155} y={36} w={70} className={`${cell} text-center text-[12.8px] font-bold`}>Requests</At>
        <At x={240} y={36} w={70} className={`${cell} text-center text-[12.8px] font-bold`}>Completed</At>
        {serviceTypes.map((r, i) => {
          const cy = 62 + i * 22.4;
          return (
            <div key={r.label}>
              <At x={21} y={cy - 9}><Ico icon={r.icon} color={r.color} size={18} stroke={2} /></At>
              <At x={57} y={cy - 6} className={`${cell} text-[11px] font-semibold`}>{r.label}</At>
              <At x={155} y={cy - 7} w={70} className={`${cell} text-center text-[14.5px] font-bold`}>{r.requests}</At>
              <At x={240} y={cy - 7} w={70} className={`${cell} text-center text-[14.5px] font-semibold`}>{r.completed}</At>
              <At x={52} y={cy + 11} w={252} h={1} className="bg-[#edf0f5]" />
            </div>
          );
        })}
        <At x={16} y={162} w={294} h={24} className="rounded-[5px] bg-[#ecf2fa]" />
        <At x={52} y={168} className={`${cell} text-[15px] font-bold`}>Total</At>
        <At x={155} y={168} w={70} className={`${cell} text-center text-[15px] font-bold`}>142</At>
        <At x={240} y={168} w={70} className={`${cell} text-center text-[15px] font-bold`}>112</At>
      </Card>

      {/* Centre Operations */}
      <Card at={[1275, 234, 313, 196]} label="Centre Operations">
        <CardTitle x={16} y={9} size={18}>Centre Operations</CardTitle>
        <At x={218} y={7}><Pill tone="green" w={82} h={19} size={13}>Operational</Pill></At>
        {centreOps.map((r, i) => {
          const cy = 50 + i * 30.8;
          return (
            <div key={r.label}>
              <At x={21} y={cy - 12}>{r.icon === MapPin ? <Ico icon={MapPin} color={r.color} size={23} stroke={2} /> : <Ico icon={r.icon} color={r.color} size={24} stroke={1.9} />}</At>
              <At x={67} y={cy - 7} className={`${cell} text-[13px] font-semibold`}>{r.label}</At>
              <At x={150} y={cy - 7} w={146} className={`${cell} text-right ${i === 4 ? "text-[13.5px] font-semibold" : "text-[15px] font-bold"}`}>{r.value}</At>
              {i < 4 && <At x={64} y={cy + 15} w={233} h={1} className="bg-[#edf0f5]" />}
            </div>
          );
        })}
      </Card>

      {/* My Team */}
      <Card at={[238, 445, 430, 171]} label="My Team">
        <CardTitle x={14} y={9} size={18}>My Team (48)</CardTitle>
        <ViewAll right={13} y={9} size={13.5} to="Team Management" />
        <At x={12} y={31} w={406} h={19} className="rounded-[4px] bg-[#e7ebf3]" />
        <At x={26} y={35} className={`${cell} text-[13px] font-bold`}>Department</At>
        {["Team", "Active", "On Duty"].map((h, i) => (
          <At key={h} x={[203, 275, 346][i]} y={35} w={60} className={`${cell} text-center text-[13px] font-bold`}>{h}</At>
        ))}
        {team.map((r, i) => {
          const cy = 64 + i * 21.8;
          return (
            <div key={r[0]}>
              <At x={26} y={cy - 6} className={`${cell} text-[13px] font-semibold`}>{r[0]}</At>
              {r.slice(1).map((v, j) => (
                <At key={j} x={[203, 275, 346][j]} y={cy - 6} w={60} className={`${cell} text-center text-[13.5px] font-semibold`}>{v}</At>
              ))}
              {i < 4 && <At x={14} y={cy + 10} w={402} h={1} className="bg-[#edf0f5]" />}
            </div>
          );
        })}
      </Card>

      {/* My Pending Approvals */}
      <Card at={[687, 445, 433, 171]} label="My Pending Approvals">
        <CardTitle x={19} y={9} size={18}>My Pending Approvals (5)</CardTitle>
        <ViewAll right={18} y={9} size={13.5} to="Approvals & Workflow" />
        {approvals.map((a, i) => {
          const cy = 47 + i * 25.8;
          return (
            <div key={a.text}>
              <At x={29} y={cy - 10}><Ico icon={a.icon} color={a.color} size={20} stroke={1.9} /></At>
              <At x={70} y={cy - 6} className={`${cell} text-[13.5px] font-semibold`}>{a.text}</At>
              <At x={315} y={cy - 9.5}><Pill tone={a.tone} w={102} h={19} size={13}>{a.tag}</Pill></At>
              {i < 4 && <At x={20} y={cy + 12.5} w={398} h={1} className="bg-[#edf0f5]" />}
            </div>
          );
        })}
      </Card>

      {/* Today's Schedule */}
      <Card at={[1141, 445, 447, 171]} label="Today's Schedule">
        <CardTitle x={19} y={8} size={18.5}>Today&apos;s Schedule</CardTitle>
        <ViewAll right={20} y={9} size={14} to="Calendar">View Calendar</ViewAll>
        <At x={29.5} y={46} w={1.4} h={104} className="bg-[#9db3ea]" />
        {schedule.map(([time, text], i) => {
          const cy = 46 + i * 26;
          return (
            <div key={time}>
              <At x={25} y={cy - 5.5} w={11} h={11} className="rounded-full border-[1.8px] border-[#3d74e0] bg-white" />
              <At x={50} y={cy - 6} className={`${cell} text-[13.5px] font-semibold`}>{time}</At>
              <At x={117} y={cy - 9} w={1} h={17} className="bg-[#c9cfdb]" />
              <At x={131} y={cy - 6} className={`${cell} text-[13.5px] font-semibold`}>{text}</At>
              {i < 4 && <At x={45} y={cy + 13} w={386} h={1} className="bg-[#edf0f5]" />}
            </div>
          );
        })}
      </Card>

      {/* Recent Activities */}
      <Card at={[238, 631, 457, 185]} label="Recent Activities">
        <CardTitle x={14} y={8} size={18}>Recent Activities</CardTitle>
        <ViewAll right={15} y={9} size={13.5} to="Activity Log" />
        {activities.map((a, i) => {
          const cy = 48 + i * 29.2;
          return (
            <div key={a.text}>
              <At x={19} y={cy - 12} w={26} h={26} className="flex items-center justify-center rounded-full" style={{ background: a.outline ? "transparent" : a.bg }}>
                <Ico icon={a.icon} color={a.outline ? a.bg : "#fff"} size={a.outline ? 24 : 16} stroke={a.outline ? 1.9 : 2.6} />
              </At>
              <At x={64} y={cy - 6} className={`${cell} text-[13.4px] font-semibold`}>{a.text}</At>
              <At x={360} y={cy - 6} w={81} className={`${cell} text-right text-[14.8px] font-semibold`}>{a.time}</At>
              {i < 4 && <At x={14} y={cy + 14} w={428} h={1} className="bg-[#edf0f5]" />}
            </div>
          );
        })}
      </Card>

      {/* Key Actions */}
      <Card at={[712, 631, 391, 185]} label="Key Actions">
        <CardTitle x={15} y={8} size={18}>Key Actions</CardTitle>
        {keyActions.map((a, i) => (
          <TileLink
            key={a.label}
            to={a.to ?? a.label}
            style={{ left: [12, 139, 266][i % 3], top: i < 3 ? 31 : 106, width: 118 }}
            className="h-[67px] rounded-[10px] border border-[#e1e5ee] bg-white shadow-[0_2px_6px_rgba(30,50,110,0.08)]"
          >
            <span className="absolute left-1/2 top-[9px] -translate-x-1/2"><Ico icon={a.icon} color={a.color} size={26} stroke={1.9} /></span>
            <span className="absolute inset-x-0 top-[43px] whitespace-nowrap text-center text-[13.2px] font-semibold leading-none tracking-[-0.3px]">{a.label}</span>
          </TileLink>
        ))}
      </Card>

      {/* Monthly Targets */}
      <Card at={[1120, 631, 467, 185]} label="Monthly Targets – Progress">
        <CardTitle x={19} y={8} size={18}>Monthly Targets – Progress</CardTitle>
        <At x={360} y={3} w={96} h={22}>
          <Select label="Target period" value={targetPeriod} options={periods} onChange={setTargetPeriod} size={11.8} className="h-full" />
        </At>
        {targets.map((t, i) => (
          <At key={t.name} x={[10, 161, 311][i]} y={31} w={i === 2 ? 146 : 141} h={143} className="rounded-[10px] border border-[#e1e5ee] bg-white shadow-[0_2px_6px_rgba(30,50,110,0.08)]">
            <span className="absolute left-1/2 top-[13px] -translate-x-1/2">
              <Ico icon={t.icon} color={t.color} size={30} stroke={2} />
            </span>
            <p className="absolute inset-x-0 top-[52px] whitespace-nowrap text-center text-[13.5px] font-bold leading-none tracking-[-0.3px]">{t.name}</p>
            <p className="absolute inset-x-0 top-[74px] whitespace-nowrap text-center text-[12.6px] font-semibold leading-none tracking-[-0.3px]">Target: {t.target}</p>
            <p className="absolute inset-x-0 top-[96px] whitespace-nowrap text-center text-[12.4px] font-semibold leading-none tracking-[-0.3px]">
              Achieved: <span className="text-[#137a1a]">{t.achieved}</span>
            </p>
            <span className="absolute left-[10px] right-[10px] top-[118px]"><Bar value={t.value} w={i === 2 ? 126 : 121} h={11} color="#1d8f1d" track="#d8dee8" /></span>
          </At>
        ))}
      </Card>

      <Footer y={862} leftX={241} logoRight={1585} />
    </DashboardCanvas>
  );
}
