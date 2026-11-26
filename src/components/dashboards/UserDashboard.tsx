"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChartColumn,
  Check,
  CircleCheck,
  Clock,
  FilePlus2,
  FileText,
    Folder,
  Mail,
  Megaphone,
  Phone,
  SquarePen,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import { Box, DashboardCanvas } from "@/components/dashboards/canvas";
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
  LotusIcon,
  PinSolid,
  Pill,
  TileLink,
  ViewAll,
  WhatsAppIcon,
  Today,
  type Tone,
} from "@/components/dashboards/ui";

/* TODO: replace the static figures below with the user's data from the API. */

const tasks: { text: string; tone: Tone; priority: string; due: string }[] = [
  { text: "Verify Sewa Request – SR-02684", tone: "red", priority: "High", due: "Today" },
  { text: "Coordinate vehicle – VH-0217", tone: "amber", priority: "Medium", due: "Today" },
  { text: "Collect documents – DOC-0176", tone: "amber", priority: "Medium", due: "25 Nov" },
  { text: "Follow-up with family – SR-02671", tone: "green", priority: "Normal", due: "25 Nov" },
  { text: "Update case status – CS-0098", tone: "green", priority: "Normal", due: "26 Nov" },
];

const requestStatus = [
  { label: "In Progress", value: "04", color: "#1f9a1f" },
  { label: "Verification", value: "02", color: "#1f87e8" },
  { label: "Pending Info", value: "01", color: "#f7b500" },
  { label: "Completed", value: "01", color: "#c4cad6" },
];

const cases = [
  { icon: Users, color: "#2f7fe0", text: "CS-0098 – Last Rites Support", tone: "green" as Tone, status: "In Progress" },
  { icon: "lotus", color: "#f0a020", text: "CS-0099 – Ritual Support (Day 10)", tone: "yellow" as Tone, status: "Scheduled" },
  { icon: FileText, color: "#2f7fe0", text: "CS-0100 – Barsi Coordination", tone: "blue" as Tone, status: "Planning" },
];

const schedule = [
  { time: "10:30 AM", text: "Case Follow-up – SR-02684", y: 534 },
  { time: "12:00 PM", text: "Team Coordination – Vehicle", y: 573 },
  { time: "02:00 PM", text: "Document Verification – CS-0099", y: 608 },
  { time: "04:00 PM", text: "Family Update Call – SR-02671", y: 645 },
  { time: "05:30 PM", text: "Daily Report & Next Day Plan", y: 687 },
];

const quickActions = [
  { icon: FilePlus2, color: "#5b3de0", lines: ["Create", "Sewa Request"] },
  { icon: Upload, color: "#1f9a3a", lines: ["Upload", "Documents"] },
  { icon: UserPlus, color: "#f0a020", lines: ["Add", "Follow-up"] },
  { icon: SquarePen, color: "#f0a020", lines: ["Update", "Case Status"] },
];

const updates = [
  { text: "New SOP on Case Verification released", x: 497 },
  { text: "Fleet schedule updated for this week", x: 798 },
  { text: "Training – Grief Support & Family Communication on 27 Nov", x: 1100 },
];

export default function UserDashboard() {
  // TODO: save task completion through the tasks API.
  const [done, setDone] = useState<ReadonlySet<string>>(new Set());
  const toggleTask = (text: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(text)) next.delete(text);
      else next.add(text);
      return next;
    });

  return (
    <DashboardCanvas role="user">
      {/* Welcome banner */}
      <Box at={[240, 68, 1082, 86]} fit="clip" className="overflow-hidden rounded-[12px] bg-[linear-gradient(90deg,#efdfd1_0%,#f6e7da_25%,#fbe9d4_45%,#f9e1c4_60%)] shadow-[0_2px_8px_rgba(60,40,20,0.12)]">
        <Image
          src="/images/welcome-ghat.png"
          alt="Sunrise over the ghats"
          width={1334}
          height={170}
          priority
          sizes="667px"
          className="absolute right-0 top-0 h-full w-[667px] [mask-image:linear-gradient(90deg,transparent_0,#000_70px)]"
        />
        <h1 className="absolute left-[30px] top-[12px] whitespace-nowrap text-[29px] font-bold leading-none tracking-[-0.8px] text-[#08083a]">
          Welcome, Amit Sharma Ji
        </h1>
        <p className="absolute left-[30px] top-[45px] whitespace-nowrap text-[20px] font-semibold leading-none tracking-[-0.5px] text-[#141436]">
          Your Workspace for Sewa, Service &amp; Support
        </p>
      </Box>

      {/* Date + centre */}
      <Card at={[1350, 72, 240, 75]} span={[6, 12]}>
        <At x={27} y={11}>
          <Ico icon={CalendarDays} color="#0b0c36" size={22} stroke={2.2} />
        </At>
        <At x={62} y={11} className="whitespace-nowrap text-[16.5px] font-semibold leading-none tracking-[-0.2px]">
          <span className="block"><Today /></span>
        </At>
        <At x={23} y={37} w={202} h={1} className="bg-[#e3e6ee]" />
        <At x={28} y={45}>
          <PinSolid size={21} />
        </At>
        <At x={62} y={48} className="whitespace-nowrap text-[14.6px] font-semibold leading-none tracking-[-0.2px]">
          <span className="block">Ghaziabad Centre</span>
        </At>
      </Card>

      {/* KPIs */}
      <Kpi at={[240, 169, 212, 79]} span={[3, 4]} theme="blue" bubble={{ cx: 43, cy: 39, d: 50, none: true }} icon={<Ico icon={FileText} color="#1f6fe0" size={42} stroke={1.8} />} textX={87} value="12" valueSize={28} label="Assigned Tasks" labelSize={16} />
      <Kpi at={[463, 169, 210, 79]} span={[3, 4]} theme="orange" bubble={{ cx: 46, cy: 39, d: 50, none: true }} icon={<Ico icon={Users} color="#f0a020" size={44} stroke={1.8} />} textX={90} value="08" valueSize={28} label="Sewa Requests" labelSize={14.8} />
      <Kpi at={[683, 169, 208, 79]} span={[3, 4]} theme="purple" bubble={{ cx: 45, cy: 39, d: 50, none: true }} icon={<Ico icon={Folder} color="#8a2fe0" size={44} stroke={1.8} />} textX={90} value="03" valueSize={28} label="Active Cases" labelSize={15.5} />
      <Kpi at={[902, 169, 228, 79]} span={[3, 4]} theme="green" bubble={{ cx: 43, cy: 39, d: 50, none: true }} icon={<Ico icon={CircleCheck} color="#1f9a2b" size={44} stroke={2} />} textX={87} value="06" valueSize={28} label={<>Completed<span className="ml-[4px] text-[11.5px]">(This Month)</span></>} labelSize={14} />
      <Kpi at={[1141, 169, 217, 79]} span={[3, 4]} theme="red" bubble={{ cx: 48, cy: 39, d: 50, none: true }} icon={<Ico icon={Clock} color="#e02020" size={42} stroke={2.2} />} textX={95} value="02" valueSize={28} label="Due Today" labelSize={15.5} />
      <Kpi at={[1368, 169, 223, 79]} span={[3, 4]} theme="sky" bubble={{ cx: 44, cy: 39, d: 50, none: true }} icon={<Ico icon={ChartColumn} color="#1f63d8" size={44} stroke={2.2} />} textX={91} value="92%" valueSize={28} label="My Performance" labelSize={16} />

      {/* My Tasks */}
      <Card at={[240, 267, 454, 194]} label="My Tasks">
        <CardTitle x={17} y={12} size={20}>My Tasks (12)</CardTitle>
        <ViewAll right={19} y={12} to="My Tasks" />
        <ul>
          {tasks.map((t, i) => {
            const cy = 54 + i * 29.3;
            return (
              <li key={t.text} style={{ top: cy - 14.5 }} className="absolute inset-x-0 h-[29px]">
                {i > 0 && <span className="absolute left-[50px] right-[14px] top-0 h-px bg-[#e6e9f0]" />}
                <input
                  type="checkbox"
                  checked={done.has(t.text)}
                  onChange={() => toggleTask(t.text)}
                  aria-label={`Mark "${t.text}" as done`}
                  className="peer absolute left-[25px] top-[7px] h-[16px] w-[16px] cursor-pointer appearance-none rounded-[3px] border-[1.6px] border-[#3a3d55] bg-white checked:border-[#1f9a1f] checked:bg-[#1f9a1f] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2320c4]"
                />
                <Check aria-hidden strokeWidth={3.2} className="pointer-events-none absolute left-[27px] top-[9px] hidden h-[12px] w-[12px] text-white peer-checked:block" />
                <span className={`absolute left-[57px] top-[8px] whitespace-nowrap text-[14.6px] font-semibold leading-none tracking-[-0.3px] ${done.has(t.text) ? "text-[#8a90a6] line-through" : ""}`}>
                  <span className="block">{t.text}</span>
                </span>
                <span className="absolute left-[299px] top-[5px]">
                  <Pill tone={t.tone} w={70} h={19} size={13}>{t.priority}</Pill>
                </span>
                <span className="absolute right-[18px] top-[8px] whitespace-nowrap text-[14.4px] font-semibold leading-none tracking-[-0.3px]">
                  <span className="block">{t.due}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* My Sewa Requests */}
      <Card at={[707, 267, 418, 194]} label="My Sewa Requests">
        <CardTitle x={16} y={12} size={20}>My Sewa Requests (08)</CardTitle>
        <ViewAll right={18} y={12} to="Sewa Requests" />
        <At x={29} y={40}>
          <Donut
            size={148}
            thickness={22}
            segments={[
              { value: 2, color: "#c4cad6" },
              { value: 77, color: "#1f9a1f" },
              { value: 11, color: "#2f8ae8" },
              { value: 10, color: "#f7b500" },
            ]}
          >
            <span className="pt-[6px] text-[31px] font-bold leading-none tracking-[-0.5px]">08</span>
            <span className="text-[17px] font-semibold leading-tight">Total</span>
          </Donut>
        </At>
        <ul>
          {requestStatus.map((s, i) => {
            const cy = 62 + i * 31;
            return (
              <li key={s.label} style={{ top: cy - 15 }} className="absolute left-[216px] right-[26px] h-[30px]">
                {i < 3 && <span className="absolute bottom-0 left-[26px] right-[-4px] h-px bg-[#e6e9f0]" />}
                <span className="absolute left-0 top-[8px]"><Dot color={s.color} size={15} /></span>
                <span className="absolute left-[34px] top-[8px] text-[15.3px] font-semibold leading-none tracking-[-0.3px]">
                  <span className="block">{s.label}</span>
                </span>
                <span className="absolute right-0 top-[8px] text-[16px] font-bold leading-none">
                  <span className="block">{s.value}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* My Cases */}
      <Card at={[1139, 267, 451, 194]} label="My Cases">
        <CardTitle x={18} y={12} size={20}>My Cases (03)</CardTitle>
        <ViewAll right={19} y={12} to="My Cases" />
        <At x={16} y={39} w={427} h={1} className="bg-[#e6e9f0]" />
        <ul>
          {cases.map((c, i) => (
            <li key={c.text} style={{ top: 43 + i * 47 }} className="absolute left-[16px] right-[9px] h-[40px] rounded-[8px] border border-[#eceff5] bg-white shadow-[0_1px_3px_rgba(30,50,110,0.05)]">
              <span className="absolute left-[17px] top-[7px]">{c.icon === "lotus" ? <LotusIcon size={30} /> : typeof c.icon !== "string" && <Ico icon={c.icon} color={c.color} size={25} stroke={1.8} />}</span>
              <span className="absolute left-[65px] top-[12px] whitespace-nowrap text-[14.6px] font-semibold leading-none tracking-[-0.3px]">
                <span className="block">{c.text}</span>
              </span>
              <span className="absolute right-[6px] top-[8px]">
                <Pill tone={c.tone} w={108} h={23} size={14}>{c.status}</Pill>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Today's Schedule */}
      <Card at={[239, 474, 428, 270]} label="Today's Schedule">
        <At x={19} y={10}><Ico icon={CalendarDays} color="#0b0c36" size={23} stroke={2} /></At>
        <CardTitle x={55} y={12} size={20}>Today&apos;s Schedule</CardTitle>
        <ViewAll right={17} y={14} size={15} to="My Calendar">View Calendar</ViewAll>
        <At x={19} y={38} w={392} h={1} className="bg-[#e6e9f0]" />
        {/* timeline */}
        <At x={33} y={schedule[0].y - 474} w={1.6} h={schedule[4].y - schedule[0].y} className="bg-[#3d74e0]" />
        <ul>
          {schedule.map((s, i) => {
            const cy = s.y - 474;
            return (
              <li key={s.time}>
                {i > 0 && <At x={52} y={(cy + schedule[i - 1].y - 474) / 2} w={360} h={1} className="bg-[#e6e9f0]" />}
                <At x={27.5} y={cy - 6.5} w={13} h={13} className="rounded-full border-[2px] border-[#3d74e0] bg-white" />
                <At x={59} y={cy - 7} className="whitespace-nowrap text-[14.6px] font-semibold leading-none tracking-[-0.3px]">
                  <span className="block">{s.time}</span>
                </At>
                <At x={147} y={cy - 8} className="whitespace-nowrap text-[14.6px] font-semibold leading-none tracking-[-0.3px]">
                  <span className="block">{s.text}</span>
                </At>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* My Communications */}
      <Card at={[683, 474, 438, 146]} label="My Communications">
        <CardTitle x={16} y={10} size={20}>My Communications</CardTitle>
        <ViewAll right={18} y={11} to="Communication Hub" />
        {[
          { x: 11, w: 130, icon: <Ico icon={Mail} color="#1f7fe0" size={30} stroke={1.8} />, label: "Emails", count: <span className="text-[#137a1a]">05 New</span> },
          { x: 151, w: 132, icon: <WhatsAppIcon size={30} color="#16a34a" />, label: "WhatsApp", count: <span className="text-[#137a1a]">09 New</span> },
          { x: 293, w: 133, icon: <Ico icon={Phone} color="#16a34a" size={27} stroke={0} className="fill-[#16a34a]" />, label: "Calls", count: <><span className="text-[#137a1a]">03</span> <span className="font-semibold text-[#1a1d36]">Follow-ups</span></> },
        ].map((t) => (
          <TileLink key={t.label} to={t.label} style={{ left: t.x, top: 42, width: t.w, height: 90 }} className="rounded-[10px] border border-[#e3e7ef] bg-white shadow-[0_2px_6px_rgba(30,50,110,0.08)]">
            <span className="absolute left-1/2 top-[10px] -translate-x-1/2">{t.icon}</span>
            <span className="absolute inset-x-0 top-[46px] text-center text-[14.6px] font-semibold leading-none tracking-[-0.3px]">{t.label}</span>
            <span className="absolute inset-x-0 top-[65px] whitespace-nowrap text-center text-[17px] font-bold leading-none tracking-[-0.3px]">{t.count}</span>
          </TileLink>
        ))}
      </Card>

      {/* Quick Actions */}
      <Card at={[1137, 474, 455, 146]} label="Quick Actions">
        <CardTitle x={18} y={9} size={20}>Quick Actions</CardTitle>
        <At x={10} y={36} w={437} h={1} className="bg-[#e6e9f0]" />
        {quickActions.map((a, i) => (
          <TileLink
            key={a.lines[1]}
            to={a.lines.join(" ")}
            style={{ left: [10, 123, 236, 347][i], width: i === 3 ? 102 : 104 }}
            className="top-[47px] h-[92px] rounded-[10px] border border-[#e3e7ef] bg-white shadow-[0_2px_6px_rgba(30,50,110,0.08)]"
          >
            <span className="absolute left-1/2 top-[8px] -translate-x-1/2"><Ico icon={a.icon} color={a.color} size={29} stroke={1.9} /></span>
            <span className="absolute inset-x-0 top-[45px] text-center text-[13.8px] font-semibold leading-[16px] tracking-[-0.3px]">
              {a.lines[0]}
              <br />
              {a.lines[1]}
            </span>
          </TileLink>
        ))}
      </Card>

      {/* Training & Knowledge */}
      <Card at={[683, 632, 438, 113]} label="Training & Knowledge">
        <CardTitle x={18} y={9} size={20}>Training &amp; Knowledge</CardTitle>
        <ViewAll right={18} y={10} to="Training & Knowledge" />
        <At x={17} y={40} w={80} h={63} className="flex items-center justify-center rounded-[10px] border border-[#e3e7ef] bg-[#f6f9ff]">
          <Ico icon={BookOpen} color="#1f6fe0" size={46} stroke={1.6} />
        </At>
        <At x={114} y={46} className="whitespace-nowrap text-[14.4px] font-semibold leading-none tracking-[-0.3px]">
          <span className="block">My Training Progress</span>
        </At>
        <At x={114} y={65} className="whitespace-nowrap text-[14.4px] font-semibold leading-none tracking-[-0.3px]">
          <span className="block">3 of 5 Modules Completed</span>
        </At>
        <At x={340} y={62} w={76} className="text-right text-[19px] font-bold leading-none">
          <span className="block">60%</span>
        </At>
        <At x={114} y={86}>
          <Bar value={60} w={302} h={8} color="#16880f" track="#d5dbe5" />
        </At>
      </Card>

      {/* My Performance */}
      <Card at={[1137, 632, 455, 113]} label="My Performance">
        <CardTitle x={19} y={9} size={20} note="(This Month)">My Performance</CardTitle>
        <ViewAll right={15} y={10} size={14} to="My Performance">View Details</ViewAll>
        <At x={16} y={42}>
          <Donut size={58} thickness={7} segments={[{ value: 92, color: "#2aa52a" }, { value: 8, color: "#d5dbe5" }]}>
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#2aa52a]">
              <Check strokeWidth={3.4} className="h-[22px] w-[22px] text-white" />
            </span>
          </Donut>
        </At>
        <At x={84} y={44} className="text-[29px] font-bold leading-none tracking-[-0.5px]">
          <span className="block pt-[4px]">92%</span>
        </At>
        <At x={84} y={75} className="whitespace-nowrap text-[17px] font-semibold leading-none">
          <span className="block">My Score</span>
        </At>
        <At x={173} y={36} w={1} h={70} className="bg-[#dfe3ec]" />
        {[
          ["Tasks Completed", "28 / 30"],
          ["On-time Completion", "93%"],
          ["Case Updates", "100%"],
        ].map(([k, v], i) => (
          <div key={k}>
            {i > 0 && <At x={190} y={30 + i * 27} w={246} h={1} className="bg-[#e6e9f0]" />}
            <At x={194} y={37 + i * 27} className="whitespace-nowrap text-[13.8px] font-semibold leading-none tracking-[-0.3px]">
              <span className="block">{k}</span>
            </At>
            <At x={330} y={37 + i * 27} w={96} className="text-right text-[15px] font-bold leading-none">
              <span className="block">{v}</span>
            </At>
          </div>
        ))}
      </Card>

      {/* Important Updates */}
      <Card at={[239, 764, 1352, 57]} label="Important Updates">
        <At x={15} y={13}><Ico icon={Megaphone} color="#1f6fe0" size={32} stroke={2} /></At>
        <At x={56} y={16} className="whitespace-nowrap text-[21px] font-bold leading-none tracking-[-0.4px]">
          <span className="block pt-[3px]">Important Updates</span>
        </At>
        <At x={238} y={12} w={1.5} h={33} className="bg-[#3a3d55]" />
        {updates.map((u) => (
          <At key={u.text} x={u.x - 239} y={19} className="flex items-center whitespace-nowrap text-[15.3px] font-semibold leading-none tracking-[-0.3px]">
            <span className="mr-[12px] h-[5px] w-[5px] rounded-full bg-[#1a1d36]" />
            <span className="pt-[2px]">{u.text}</span>
          </At>
        ))}
      </Card>

      <Footer y={862} leftX={244} logoRight={1586} />
    </DashboardCanvas>
  );
}
