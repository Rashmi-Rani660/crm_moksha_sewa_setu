"use client";

/** SA-017 — Task Management (list, Kanban preview, calendar). Demo data. */

import Link from "next/link";
import { useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CirclePlus,
  ClipboardCheck,
  Clock3,
  Columns3,
  Download,
  Eye,
  Layers,
  List,
  MoreVertical,
  Pencil,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  Briefcase,
  UserRound,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Dropdown,
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  QuickList,
  SearchField,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  tdS,
  thS,
  useNotice,
} from "@/components/dashboards/super-admin/kit";
import { saRoutes } from "@/components/dashboards/super-admin/routes";

const tabs = ["List View", "Kanban View", "Calendar View"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { "List View": List, "Kanban View": Columns3, "Calendar View": CalendarDays };

type Prio = "High" | "Medium" | "Low";
const tasks: { id: string; name: string; caseId: string; who: string; due: string; prio: Prio; status: string }[] = [
  { id: "TM-02486", name: "Verify beneficiary documents", caseId: "CS-118734", who: "Anil Sharma", due: "25 Nov 2026", prio: "High", status: "Completed" },
  { id: "TM-02487", name: "Field verification & report", caseId: "CS-118790", who: "Priya Verma", due: "26 Nov 2026", prio: "Medium", status: "In Progress" },
  { id: "TM-02488", name: "Approve financial assistance", caseId: "CS-118807", who: "Rajesh Kumar", due: "27 Nov 2026", prio: "High", status: "Pending Approval" },
  { id: "TM-02489", name: "Update case status in CRM", caseId: "CS-118812", who: "Neha Singh", due: "24 Nov 2026", prio: "Medium", status: "Overdue" },
  { id: "TM-02490", name: "Coordinate with centre team", caseId: "CS-118821", who: "Vikram Patel", due: "28 Nov 2026", prio: "Low", status: "In Progress" },
  { id: "TM-02491", name: "Collect additional information", caseId: "CS-118826", who: "Kavita Joshi", due: "24 Nov 2026", prio: "High", status: "Overdue" },
  { id: "TM-02492", name: "Close case & update records", caseId: "CS-118833", who: "Suresh Yadav", due: "29 Nov 2026", prio: "Medium", status: "To Do" },
  { id: "TM-02493", name: "Prepare monthly operations report", caseId: "CS-118840", who: "Alok Mishra", due: "30 Nov 2026", prio: "Low", status: "To Do" },
];
const prioDot: Record<Prio, string> = { High: "#e02424", Medium: "#f0a020", Low: "#1f87e8" };
const prioCls: Record<Prio, string> = { High: "bg-[#fde4e4] text-[#b42318]", Medium: "bg-[#fdebd2] text-[#8a5300]", Low: "bg-[#e3ecfd] text-[#1d4fb8]" };

const workload = [
  ["Anil Sharma", "96", "32", "48", "16"],
  ["Priya Verma", "84", "28", "40", "16"],
  ["Rajesh Kumar", "78", "26", "38", "14"],
  ["Neha Singh", "72", "24", "36", "12"],
  ["Vikram Patel", "66", "22", "34", "10"],
];
const overdue = [
  ["TM-02489", "Update case status in CRM", "2 Days"],
  ["TM-02491", "Collect additional information", "2 Days"],
  ["TM-02473", "Field visit & verification", "3 Days"],
  ["TM-02465", "Submit approval documents", "4 Days"],
  ["TM-02460", "Upload beneficiary proof", "4 Days"],
];
const kanban: { title: string; count: string; icon: LucideIcon; head: string; cards: { id: string; t: string; due: string; prio?: Prio; done?: boolean }[] }[] = [
  { title: "To Do", count: "184", icon: Clock3, head: "bg-[#f1f3f8]", cards: [{ id: "TM-02492", t: "Close case & update records", due: "29 Nov 2026", prio: "High" }, { id: "TM-02493", t: "Prepare monthly report", due: "30 Nov 2026", prio: "Low" }] },
  { title: "In Progress", count: "432", icon: RefreshCw, head: "bg-[#e7efff]", cards: [{ id: "TM-02487", t: "Field verification & report", due: "26 Nov 2026", prio: "Medium" }, { id: "TM-02490", t: "Coordinate with centre team", due: "28 Nov 2026", prio: "Low" }] },
  { title: "Completed", count: "286", icon: CircleCheck, head: "bg-[#e6f6e3]", cards: [{ id: "TM-02486", t: "Verify beneficiary documents", due: "25 Nov 2026", done: true }, { id: "TM-02475", t: "Update beneficiary details", due: "24 Nov 2026", done: true }] },
];
/** Calendar marks (Nov 2026 only in the demo data). */
const marks: Record<number, string> = { 18: "#e02424", 20: "#e02424", 24: "#1d4fe0", 26: "#f0a020", 27: "#f0a020" };
const dayTasks: Record<number, [string, string, string][]> = {
  24: [["TM-02489", "Update case status", "Overdue"], ["TM-02491", "Collect information", "Overdue"], ["TM-02475", "Update beneficiary", "Completed"]],
  25: [["TM-02486", "Verify beneficiary documents", "Completed"]],
  26: [["TM-02487", "Field verification & report", "In Progress"]],
  27: [["TM-02488", "Approve financial assistance", "Pending Approval"]],
};

const typeOpts = ["All Tasks", "My Tasks", "Team Tasks"] as const;
const prioOpts = ["All Priorities", "High", "Medium", "Low"] as const;
const statusOpts = ["All Status", "To Do", "In Progress", "Pending Approval", "Overdue", "Completed"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SA017Tasks() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("List View");
  const [type, setType] = useState<string>("All Tasks");
  const [prio, setPrio] = useState<string>("All Priorities");
  const [status, setStatus] = useState<string>("All Status");
  const [q, setQ] = useState("");
  const [month, setMonth] = useState({ y: 2026, m: 10 });
  const [day, setDay] = useState(24);
  const kanbanRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  const rows = tasks.filter(
    (t) =>
      (prio === "All Priorities" || t.prio === prio) &&
      (status === "All Status" || t.status === status) &&
      (!q.trim() || `${t.id} ${t.name} ${t.caseId} ${t.who}`.toLowerCase().includes(q.trim().toLowerCase())),
  );
  const isNov = month.y === 2026 && month.m === 10;
  const first = new Date(month.y, month.m, 1).getDay();
  const days = new Date(month.y, month.m + 1, 0).getDate();
  const shift = (d: number) => setMonth(({ y, m }) => ({ y: m + d < 0 ? y - 1 : m + d > 11 ? y + 1 : y, m: (m + d + 12) % 12 }));
  const selected = isNov ? dayTasks[day] ?? [] : [];

  return (
    <SuperAdminFrame active="case-workflow">
      <PageHead icon={ClipboardCheck} title="Task Management" links={["Task List", "Kanban View", "Calendar View", "Assignment Tracking"]} />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Briefcase} value="1,248" label="Total Tasks" />
        <KpiTile tone="red" icon={TriangleAlert} value="67" label="Overdue Tasks" />
        <KpiTile tone="green" icon={CircleCheck} value="286" label="Completed Today" />
        <KpiTile tone="sky" icon={RefreshCw} value="432" label="In Progress" />
        <KpiTile tone="purple" icon={UsersRound} value="18" label="Assigned Users" />
        <KpiTile tone="orange" icon={ShieldCheck} value="41" label="Pending Approvals" />
      </KpiRow>

      <Tabs
        tabs={tabs}
        value={tab}
        icons={tabIcons}
        onChange={(t) => {
          setTab(t);
          (t === "Kanban View" ? kanbanRef : t === "Calendar View" ? calRef : null)?.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }}
      />

      <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[985fr_360fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <div className="flex min-h-0 min-w-0 flex-col gap-[10px]">
          <Panel
            title="Task List"
            note="(1,248 Tasks)"
            icon={Layers}
            titleSize={16}
            className="lg:h-[318px]"
            action={
              <div className="hidden items-center gap-[8px] lg:flex">
                <Dropdown label="Task scope" value={type} options={typeOpts} onChange={setType} className="w-[118px]" size={12.5} />
                <Dropdown label="Priority" value={prio} options={prioOpts} onChange={setPrio} className="w-[118px]" size={12.5} />
                <Dropdown label="Status" value={status} options={statusOpts} onChange={setStatus} className="w-[118px]" size={12.5} />
                <SearchField value={q} onChange={setQ} placeholder="Search tasks..." className="w-[180px]" />
              </div>
            }
            bodyClassName="pt-[4px]"
          >
            <div className="mb-2 flex flex-wrap gap-2 lg:hidden">
              <Dropdown label="Priority" value={prio} options={prioOpts} onChange={setPrio} className="w-[130px]" />
              <Dropdown label="Status" value={status} options={statusOpts} onChange={setStatus} className="w-[130px]" />
              <SearchField value={q} onChange={setQ} placeholder="Search tasks..." className="w-full" />
            </div>
            <TableWrap>
              <Thead>
                {["#", "Task ID", "Task Name", "Linked Case", "Assigned To", "Due Date", "Priority", "Status", "Action"].map((h) => (
                  <th key={h} className={`${thS} ${h === "Action" ? "text-center" : ""}`}>{h}</th>
                ))}
              </Thead>
              <tbody>
                {rows.map((t, i) => (
                  <tr key={t.id} className="border-b border-[#eef0f5] last:border-0">
                    <td className={`${tdS}`}>{String(i + 1).padStart(2, "0")}</td>
                    <td className={tdS}>{t.id}</td>
                    <td className={tdS}>{t.name}</td>
                    <td className={tdS}><Link href={saRoutes.caseDetails} className="rounded-[5px] bg-[#e3ecfd] px-[7px] py-px text-[11px] font-semibold text-[#1d4fb8] hover:underline">{t.caseId}</Link></td>
                    <td className={tdS}><span className="flex items-center gap-[5px]"><UserRound strokeWidth={2} className="h-[13px] w-[13px]" />{t.who}</span></td>
                    <td className={tdS}>{t.due}</td>
                    <td className={tdS}><span className={`inline-flex h-[18px] w-[70px] items-center gap-[5px] rounded-full px-[7px] text-[11px] font-semibold ${prioCls[t.prio]}`}><span style={{ background: prioDot[t.prio] }} className="h-[6px] w-[6px] rounded-full" />{t.prio}</span></td>
                    <td className={tdS}><StatusPill className="h-[18px] w-[112px] rounded-[5px] text-[11px]">{t.status}</StatusPill></td>
                    <td className={`${tdS} text-center`}>
                      <div className="flex items-center justify-center gap-[7px]">
                        <button type="button" aria-label={`View ${t.id}`} onClick={() => notice.show(`${t.id}: task details (demo).`)}><Eye strokeWidth={2.2} className="h-[15px] w-[15px]" /></button>
                        <button type="button" aria-label={`Edit ${t.id}`} onClick={() => notice.show(`${t.id}: edit / reassign (demo).`)}><Pencil strokeWidth={2.2} className="h-[14px] w-[14px]" /></button>
                        <button type="button" aria-label={`More for ${t.id}`} onClick={() => notice.show(`${t.id}: mark complete / escalate (demo).`)}><MoreVertical strokeWidth={2.2} className="h-[15px] w-[15px]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan={9} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">No tasks match these filters.</td></tr>}
              </tbody>
            </TableWrap>
          </Panel>

          <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[490fr_485fr] lg:[grid-template-rows:minmax(0,1fr)]">
            <div ref={kanbanRef} className="flex min-h-0">
              <Panel title="Kanban View" note="(Task Preview)" icon={Columns3} titleSize={15} className="min-h-0 flex-1" action={<ViewLinkBtn onClick={() => notice.show("Full Kanban board (demo).")}>View Full Kanban</ViewLinkBtn>} bodyClassName="grid grid-cols-3 gap-[8px] pt-[4px]">
                {kanban.map((col) => (
                  <div key={col.title} className="flex min-w-0 flex-col gap-[6px]">
                    <p className={`flex items-center gap-[5px] rounded-[7px] px-[7px] py-[5px] text-[12px] font-bold ${col.head}`}>
                      <col.icon strokeWidth={2.2} className="h-[13px] w-[13px]" />
                      {col.title} ({col.count})
                    </p>
                    {col.cards.map((c) => (
                      <div key={c.id} className="flex flex-1 flex-col justify-between rounded-[8px] border border-[#e1e5ee] bg-white px-[7px] py-[5px] shadow-[0_1px_3px_rgba(30,50,110,0.06)]">
                        <b className="text-[11.4px]">{c.id}</b>
                        <span className="text-[10.6px] font-medium leading-tight">{c.t}</span>
                        <span className="flex items-center justify-between text-[10px] font-medium">
                          <span className="flex items-center gap-[3px]"><Clock3 strokeWidth={2} className="h-[11px] w-[11px]" />{c.due}</span>
                          {c.done ? <CircleCheck strokeWidth={2.4} className="h-[13px] w-[13px] fill-[#1f9a2b] text-white" /> : c.prio && <span className="flex items-center gap-[3px] font-semibold" style={{ color: prioDot[c.prio] }}><span style={{ background: prioDot[c.prio] }} className="h-[6px] w-[6px] rounded-full" />{c.prio}</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </Panel>
            </div>

            <div ref={calRef} className="flex min-h-0">
              <Panel title="Calendar View" note="(Task Schedule)" icon={CalendarDays} titleSize={15} className="min-h-0 flex-1" action={<ViewLinkBtn onClick={() => notice.show("Full calendar (demo).")}>View Full Calendar</ViewLinkBtn>} bodyClassName="grid grid-cols-[1fr_160px] gap-[8px] pt-[2px]">
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center justify-center gap-[18px] pb-[3px] text-[13px] font-bold">
                    <button type="button" aria-label="Previous month" onClick={() => shift(-1)}><ChevronLeft strokeWidth={2.4} className="h-[15px] w-[15px]" /></button>
                    <span className="w-[72px] text-center">{MONTHS[month.m]} {month.y}</span>
                    <button type="button" aria-label="Next month" onClick={() => shift(1)}><ChevronRight strokeWidth={2.4} className="h-[15px] w-[15px]" /></button>
                  </div>
                  <div className="grid flex-1 grid-cols-7 content-between text-center text-[11px] font-semibold">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <span key={d} className="text-[10.4px] font-bold">{d}</span>)}
                    {Array.from({ length: first }, (_, i) => <span key={`b${i}`} />)}
                    {Array.from({ length: days }, (_, i) => {
                      const d = i + 1;
                      const on = isNov && d === day;
                      return (
                        <button key={d} type="button" onClick={() => setDay(d)} className={`relative mx-auto flex h-[20px] w-[24px] items-center justify-center rounded-[5px] ${on ? "bg-[#1d4fe0] text-white" : "hover:bg-[#eef2fc]"}`}>
                          {d}
                          {isNov && marks[d] && !on && <span style={{ background: marks[d] }} className="absolute -bottom-[2px] h-[4px] w-[4px] rounded-full" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex min-h-0 flex-col gap-[5px] rounded-[8px] bg-[#f1f5ff] p-[6px]">
                  <p className="text-[11.4px] font-bold text-[#1d3fc4]">{day} {MONTHS[month.m]} {month.y} ({selected.length} Tasks)</p>
                  {selected.length ? (
                    selected.map(([id, t, s]) => (
                      <div key={id} className="rounded-[6px] bg-white px-[6px] py-[4px] leading-tight shadow-[0_1px_3px_rgba(30,50,110,0.06)]">
                        <span className="flex items-center justify-between gap-[4px]">
                          <b className="text-[11px]">{id}</b>
                          <StatusPill className="h-[15px] shrink-0 px-[5px] text-[9.4px]">{s}</StatusPill>
                        </span>
                        <span className="block text-[10.4px] font-medium">{t}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] font-medium text-[#5b6280]">No tasks scheduled.</p>
                  )}
                </div>
              </Panel>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Workload Summary" icon={UsersRound} titleSize={15.5} className="lg:h-[180px]" action={<ViewLinkBtn onClick={() => notice.show("Workload by user (demo).")}>View Details</ViewLinkBtn>} bodyClassName="pt-[2px]">
            <TableWrap>
              <Thead>
                {["User", "Assigned", "In Progress", "Completed", "Pending"].map((h) => <th key={h} className={`${thS} text-[11px]`}>{h}</th>)}
              </Thead>
              <tbody>
                {workload.map((w) => (
                  <tr key={w[0]}>
                    <td className={`${tdS} text-[11.4px]`}><span className="flex items-center gap-[4px]"><UserRound strokeWidth={2} className="h-[12px] w-[12px] text-[#2f6fe0]" />{w[0]}</span></td>
                    <td className={`${tdS} text-center text-[11.4px]`}>{w[1]}</td>
                    <td className={`${tdS} text-center text-[11.4px]`}>{w[2]}</td>
                    <td className={`${tdS} text-center text-[11.4px]`}>{w[3]}</td>
                    <td className={`${tdS} text-center`}><span className="rounded-[4px] bg-[#fde9c4] px-[6px] text-[11px] font-semibold text-[#8a5300]">{w[4]}</span></td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>

          <Panel title="Overdue Alerts (67)" icon={TriangleAlert} titleSize={15.5} className="lg:h-[160px]" action={<Link href={saRoutes.sla} className="flex items-center gap-[4px] text-[12.5px] font-semibold text-[#2320c4] hover:underline">View All <ChevronRight strokeWidth={2.4} className="h-[13px] w-[13px]" /></Link>} bodyClassName="flex flex-col justify-between pt-[2px]">
            {overdue.map(([id, t, d]) => (
              <div key={id} className="flex items-center gap-[6px] text-[11.6px] font-medium">
                <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#e02424]" />
                <span className="min-w-0 flex-1 truncate"><b>{id}</b> – {t}</span>
                <span className="shrink-0 rounded-[4px] bg-[#fde4e4] px-[6px] text-[10.6px] font-semibold text-[#b42318]">{d}</span>
              </div>
            ))}
          </Panel>

          <Panel title="Quick Actions" icon={Zap} titleSize={15.5} className="min-h-0 lg:flex-1" bodyClassName="pt-[4px]">
            <QuickList
              items={[
                { icon: CirclePlus, label: "Create Task", href: saRoutes.createTask },
                { icon: UsersRound, label: "Bulk Assign", onClick: () => notice.show("Bulk assign selected tasks (demo).") },
                { icon: Bell, label: "Set Reminder", onClick: () => notice.show("Reminder set for selected tasks (demo).") },
                { icon: Download, label: "Export Tasks", onClick: () => notice.show("Task list exported (demo).") },
              ]}
            />
          </Panel>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function ViewLinkBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 items-center gap-[4px] whitespace-nowrap text-[12px] font-semibold text-[#2320c4] hover:underline">
      {children}
      <ChevronRight strokeWidth={2.4} className="h-[13px] w-[13px]" />
    </button>
  );
}
