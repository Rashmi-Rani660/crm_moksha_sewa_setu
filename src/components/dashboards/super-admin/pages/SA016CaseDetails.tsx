"use client";

/** SA-016 — Complete Case Details – 360° View. Demo data. */

import Link from "next/link";
import { useState } from "react";
import {
  Ambulance,
  CalendarDays,
  CircleCheck,
  CircleDot,
  Clock3,
  ClipboardCheck,
  ClipboardList,
  Download,
  FileText,
  FolderOpen,
  Images,
  MapPin,
  MessageSquareText,
  NotebookPen,
  PenLine,
  Phone,
  RefreshCw,
  Route,
  ShieldCheck,
  Target,
  TriangleAlert,
  Truck,
  Upload,
  UserRound,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/dashboards/ui";
import {
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  PrimaryButton,
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
import { saRoutes } from "@/components/dashboards/super-admin/routes";

const tabs = ["Case Overview", "Resources & Assignments", "Documents & Evidence", "Activity Timeline", "Service Plan", "Notes & Updates"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { "Case Overview": FolderOpen, "Resources & Assignments": UsersRound, "Documents & Evidence": FileText, "Activity Timeline": Clock3, "Service Plan": ClipboardList, "Notes & Updates": NotebookPen };

const CASE_ID = "CASE-2026-10456";
const stages = ["Initial Assessment", "Resource Allocation", "Service Delivery", "Follow-up & Verification", "Case Closure & Feedback"];

const staff = [
  ["Anil Sharma", "Operations Executive", "+91 98765 21001"],
  ["Pooja Verma", "Medical Coordinator", "+91 98765 21002"],
  ["Imran Khan", "Logistics Assistant", "+91 98765 21003"],
];
const volunteers = [
  ["Suman Gupta", "Patient Support", "+91 98765 22001"],
  ["Vivek Tiwari", "Transport Support", "+91 98765 22002"],
  ["Neha Sharma", "Documentation", "+91 98765 22003"],
];
const linkedDocs = [
  ["Case Request Form.pdf", "(560 KB)"],
  ["Identity Proof (Aadhaar).pdf", "(780 KB)"],
  ["Medical Prescription.pdf", "(1.2 MB)"],
  ["Service Plan.pdf", "(498 KB)"],
];
const evidence: { icon: LucideIcon; name: string; size: string; color: string }[] = [
  { icon: Ambulance, name: "Vehicle.jpg", size: "(1.1 MB)", color: "#e02424" },
  { icon: UsersRound, name: "Service.jpg", size: "(1.8 MB)", color: "#2f6fe0" },
  { icon: ClipboardCheck, name: "Checklist.pdf", size: "(240 KB)", color: "#1f9a2b" },
  { icon: PenLine, name: "Acknowledgment.pdf", size: "(312 KB)", color: "#1d3fc4" },
];
const activity: { icon: LucideIcon; title: string; at: string; sub: string; done: boolean; current?: boolean }[] = [
  { icon: CircleCheck, title: "Case Created", at: "22 Nov 2026, 10:24 AM", sub: `Case ${CASE_ID} registered by Admin 01.`, done: true },
  { icon: ShieldCheck, title: "Request Verified", at: "22 Nov 2026, 10:42 AM", sub: "Requester details and eligibility verified.", done: true },
  { icon: FileText, title: "Service Plan Finalized", at: "22 Nov 2026, 11:00 AM", sub: "Service plan and resources approved.", done: true },
  { icon: UsersRound, title: "Resources Assigned", at: "22 Nov 2026, 12:15 PM", sub: "Staff (03), Volunteers (06) and Vehicle (VCH-0234) assigned.", done: true },
  { icon: Truck, title: "Vehicle Dispatched", at: "23 Nov 2026, 09:10 AM", sub: "Vehicle VCH-0234 departed from Ghaziabad Centre.", done: true },
  { icon: Route, title: "Service Delivery (In Progress)", at: "23 Nov 2026, 02:40 PM", sub: "Team on route to requester location (42% completed).", done: false, current: true },
  { icon: FolderOpen, title: "Follow-up & Verification", at: "Due: 24 Nov 2026, 04:00 PM", sub: "Verification of service and beneficiary feedback.", done: false },
  { icon: FolderOpen, title: "Case Closure", at: "Due: 24 Nov 2026, 06:00 PM", sub: "Complete documentation and close case.", done: false },
];
const initialNotes = [
  ["23 Nov 2026, 02:40 PM", "Service team reached sector boundary; ETA 25 minutes. – Anil Sharma"],
  ["23 Nov 2026, 09:10 AM", "Vehicle VCH-0234 dispatched from Ghaziabad Centre. – Pooja Verma"],
  ["22 Nov 2026, 12:15 PM", "Resources assigned (03 Staff, 06 Volunteers, 01 Vehicle). – Admin 01"],
];

export default function SA016CaseDetails() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Case Overview");
  const [stage, setStage] = useState(2); // index in `stages` currently in progress
  const closed = stage >= stages.length;

  return (
    <SuperAdminFrame active="case-workflow">
      <PageHead icon={FolderOpen} title="Complete Case Details – 360° View" links={["Full Case Profile", "Resource Allocation", "Documents", "Evidence", "Activity Timeline"]}>
        <Link href={saRoutes.cases} className="text-[13px] font-semibold text-[#2320c4] hover:underline">← Back to Case Management</Link>
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Target} caption="Case Stage" value={<span className="text-[17px]">{closed ? "Closed" : "In Progress"}</span>} label={closed ? "Case Closed" : stages[stage]} />
        <KpiTile tone="green" icon={UsersRound} caption="Assigned Team" value={<span className="text-[15px]">03 Staff | 06 Volunteers</span>} label="Active Assignments" />
        <KpiTile tone="orange" icon={Truck} caption="Vehicle Status" value={<span className="text-[17px]">On Route</span>} label="VCH-0234 · 42% to Destination" />
        <KpiTile tone="purple" icon={FileText} caption="Documentation Score" value={<span className="text-[17px]">92%</span>} label="11 / 12 Documents" />
        <KpiTile tone="green" icon={Clock3} caption="SLA Status" value={<span className="text-[17px]">On Track</span>} label="ETA: 24 Nov, 06:00 PM" />
        <KpiTile tone="red" icon={TriangleAlert} caption="Risk Level" value={<span className="text-[17px] text-[#138a16]">Low</span>} label="No Immediate Risk" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} icons={tabIcons} />

      <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[1000fr_350fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <div className="flex min-h-0 min-w-0 flex-col gap-[8px]">
          <div className="grid gap-[8px] lg:h-[198px] lg:grid-cols-[370fr_340fr_280fr] lg:[grid-template-rows:minmax(0,1fr)]">
            <Panel title="Case Summary" icon={FolderOpen} bodyClassName="pt-[2px]">
              <dl className="grid grid-cols-[118px_1fr] gap-y-[2px] text-[11.8px]">
                <Row k="Case No."><b>{CASE_ID}</b></Row>
                <Row k="Request Type">Medical Assistance – Mobility Support</Row>
                <Row k="Service Category">Healthcare &amp; Transport</Row>
                <Row k="Priority"><StatusPill className="h-[16px] w-[52px] rounded-[4px] text-[10.5px]">High</StatusPill></Row>
                <Row k="Current Stage"><span className="rounded-[4px] bg-[#e3ecfd] px-[6px] font-semibold text-[#1d4fb8]">{closed ? "Closed" : `In Progress (${stages[stage]})`}</span></Row>
                <Row k="Created On">22 Nov 2026, 10:24 AM</Row>
                <Row k="Target / SLA">24 Nov 2026, 06:00 PM (Within 48 Hours)</Row>
              </dl>
            </Panel>
            <Panel title="Requester / Family Details" icon={UserRound} bodyClassName="pt-[2px]">
              <dl className="grid grid-cols-[118px_1fr] gap-y-[3px] text-[11.8px]">
                <Row k="Requester Name">Shri Rajesh Kumar</Row>
                <Row k="Relationship">Self</Row>
                <Row k="Mobile Number"><span className="flex items-center justify-between">+91 98765 43210<Phone strokeWidth={2} className="h-[13px] w-[13px] text-[#1d4fe0]" /></span></Row>
                <Row k="Alternate Number"><span className="flex items-center justify-between">+91 91234 56789<WhatsAppIcon size={13} color="#1d4fe0" /></span></Row>
                <Row k="Address"><span className="flex items-start justify-between gap-[4px]">H.No. 118, Ganga Vihar, Ghaziabad – 201001<MapPin strokeWidth={2} className="h-[13px] w-[13px] shrink-0 text-[#1d4fe0]" /></span></Row>
                <Row k="Family Members"><b>04</b> (Senior Citizen: 01, Child: 01)</Row>
              </dl>
            </Panel>
            <Panel title="Service Plan" icon={CalendarDays} bodyClassName="flex flex-col justify-between pt-[2px]">
              {stages.map((s, i) => {
                const done = i < stage;
                const current = i === stage;
                return (
                  <div key={s} className={`flex items-center gap-[7px] rounded-[6px] px-[4px] py-px text-[11.6px] font-semibold ${current ? "bg-[#e9f0ff]" : ""}`}>
                    {done ? <CircleCheck strokeWidth={2.4} className="h-[15px] w-[15px] shrink-0 fill-[#1f9a2b] text-white" /> : current ? <CircleDot strokeWidth={2.6} className="h-[15px] w-[15px] shrink-0 text-[#1d4fe0]" /> : <span className="h-[14px] w-[14px] shrink-0 rounded-full border-[1.5px] border-[#9aa1b5]" />}
                    <span className="min-w-0 flex-1 truncate">{s}</span>
                    <span className={`shrink-0 rounded-[4px] px-[5px] text-[10.4px] ${done ? "bg-[#d4f3d2] text-[#1c6b1f]" : current ? "text-[#1d4fb8]" : "text-[#5b6280]"}`}>{done ? "Completed" : current ? "In Progress" : "Pending"}</span>
                  </div>
                );
              })}
            </Panel>
          </div>

          <div className="grid gap-[8px] lg:h-[144px] lg:grid-cols-[480fr_512fr] lg:[grid-template-rows:minmax(0,1fr)]">
            <Panel title="Assigned Staff (03)" icon={UsersRound} action={<ViewLink to="Users & Access Control">View / Manage</ViewLink>} bodyClassName="pt-[0px]">
              <People rows={staff} head={["#", "Staff Name", "Role / Designation", "Contact No.", "Status"]} />
            </Panel>
            <Panel title="Assigned Volunteers (06)" icon={UsersRound} action={<ViewLink to="Users & Access Control">View / Manage</ViewLink>} bodyClassName="pt-[0px]">
              <People rows={volunteers} head={["#", "Volunteer Name", "Role", "Contact No.", "Status"]} />
              <p className="text-center text-[11px] font-semibold leading-[13px] text-[#1d4fe0]">+ 3 more volunteers (Total: 06)</p>
            </Panel>
          </div>

          <div className="grid gap-[8px] lg:min-h-0 lg:flex-1 lg:grid-cols-[370fr_290fr_330fr] lg:[grid-template-rows:minmax(0,1fr)]">
            <Panel title="Assigned Vehicle / Driver" icon={Truck} action={<ViewLink to="Live Operations">View Details</ViewLink>} bodyClassName="pt-[0px]">
              <dl className="grid grid-cols-[100px_1fr] text-[11.4px] leading-[15px]">
                <Row k="Vehicle Code"><b>VCH-0234</b></Row>
                <Row k="Vehicle Type">Ambulance (BLS)</Row>
                <Row k="Driver">Rakesh Yadav</Row>
                <Row k="Driver Contact"><span className="flex items-center gap-[6px]">+91 98210 44556<Phone strokeWidth={2} className="h-[12px] w-[12px] text-[#1d4fe0]" /></span></Row>
                <Row k="Current Status"><StatusPill className="h-[15px] w-[66px] rounded-[4px] text-[10.4px]">On Route</StatusPill></Row>
                <Row k="Route">Ghaziabad Centre → Ganga Vihar (18.6 km)</Row>
              </dl>
            </Panel>
            <Panel title="Linked Documents (04)" icon={FileText} action={<ViewLink to="Audit Logs">View All</ViewLink>} bodyClassName="flex flex-col justify-between pt-[2px]">
              {linkedDocs.map(([n, s]) => (
                <div key={n} className="flex items-center gap-[7px] text-[11.6px] font-medium">
                  <FileText strokeWidth={2} className="h-[14px] w-[14px] shrink-0 text-[#e02424]" />
                  <span className="min-w-0 flex-1 truncate">{n}</span>
                  <span className="shrink-0">{s}</span>
                  <button type="button" aria-label={`Download ${n}`} onClick={() => notice.show(`${n} downloaded (demo).`)}><Download strokeWidth={2.2} className="h-[14px] w-[14px] text-[#1d4fe0]" /></button>
                </div>
              ))}
            </Panel>
            <Panel title="Evidence / Uploads (05)" icon={Images} action={<ViewLink to="Audit Logs">View All</ViewLink>} bodyClassName="grid grid-cols-4 gap-[6px] pt-[2px]">
              {evidence.map((e) => (
                <button key={e.name} type="button" onClick={() => notice.show(`${e.name} (demo).`)} className="flex min-w-0 flex-col items-center gap-[2px]">
                  <span className="flex h-[50px] w-full items-center justify-center rounded-[6px] border border-[#e1e5ee] bg-[#f6f8fd]">
                    <e.icon strokeWidth={1.7} style={{ color: e.color }} className="h-[28px] w-[28px]" />
                  </span>
                  <span className="w-full break-all px-[2px] text-center text-[9px] font-semibold leading-[11px]">{e.name}</span>
                  <span className="text-[9.6px] font-medium">{e.size}</span>
                </button>
              ))}
            </Panel>
          </div>

        </div>

        <Panel title="Activity Timeline" icon={Clock3} action={<ViewLink to="Audit Logs" />} bodyClassName="pt-[8px]">
          <div className="relative flex flex-col gap-[18px]">
          <span className="absolute bottom-[26px] left-[5px] top-[8px] w-[2px] bg-[#cfd5e2]" />
          {activity.map((a) => (
            <div key={a.title} className={`relative flex gap-[8px] rounded-[8px] py-[2px] pr-[4px] ${a.current ? "bg-[#eef3ff]" : ""}`}>
              <span className={`mt-[4px] h-[11px] w-[11px] shrink-0 rounded-full border-[2px] ${a.done ? "border-[#1f9a2b] bg-[#1f9a2b]" : a.current ? "border-[#1d4fe0] bg-white" : "border-[#c4cad6] bg-white"}`} />
              <a.icon strokeWidth={2} className={`mt-[1px] h-[17px] w-[17px] shrink-0 ${a.done ? "text-[#1f9a2b]" : a.current ? "text-[#1d4fe0]" : "text-[#9aa1b5]"}`} />
              <span className="min-w-0 flex-1 leading-tight">
                <span className="flex items-baseline justify-between gap-[4px]">
                  <b className="text-[11.8px]">{a.title}</b>
                  <span className="shrink-0 text-[10px] font-medium">{a.at}</span>
                </span>
                <span className="block text-[10.6px] font-medium text-[#3b4256]">{a.sub}</span>
              </span>
            </div>
          ))}
          </div>
        </Panel>
      </div>

        <div className="grid gap-[10px] lg:h-[100px] lg:grid-cols-[640fr_705fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Panel title="Notes" note="(Latest First)" icon={MessageSquareText} action={<ViewLink to="Audit Logs">View All Notes</ViewLink>} bodyClassName="flex flex-col justify-between pt-[0px]">
            {initialNotes.map(([at, t]) => (
              <p key={at} className="grid grid-cols-[150px_1fr] text-[11.6px] font-medium">
                <span>{at}</span>
                <span className="truncate">{t}</span>
              </p>
            ))}
          </Panel>
          <Panel title="Quick Actions" icon={Zap} bodyClassName="grid grid-cols-2 gap-[10px] pt-[4px] sm:grid-cols-4">
            <PrimaryButton icon={RefreshCw} className="h-[34px] text-[13px]" onClick={() => (closed ? notice.show("Case is already closed.") : setStage((s) => s + 1))}>Update Case Stage</PrimaryButton>
            <PrimaryButton outline icon={Upload} className="h-[34px] text-[13px]" onClick={() => notice.show("Upload evidence (photo / PDF) (demo).")}>Upload Evidence</PrimaryButton>
            <PrimaryButton outline icon={UsersRound} className="h-[34px] text-[13px]" onClick={() => notice.show("Reassign staff, volunteers or vehicle (demo).")}>Reassign Resources</PrimaryButton>
            <button type="button" onClick={() => { if (window.confirm("Close this case? Follow-up and documentation must be complete.")) setStage(stages.length); }} className="flex h-[34px] items-center justify-center gap-[6px] rounded-[8px] border-[1.5px] border-[#e02424] bg-[#fff5f5] text-[13px] font-semibold text-[#c81e1e] hover:bg-[#ffecec]">
              <CircleCheck strokeWidth={2.3} className="h-[14px] w-[14px]" />Close Case
            </button>
          </Panel>
        </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="font-semibold">{k}</dt>
      <dd className="min-w-0 font-medium">{children}</dd>
    </>
  );
}

function People({ rows, head }: { rows: string[][]; head: string[] }) {
  return (
    <TableWrap className="[&_th]:py-[2px] overflow-y-hidden">
      <Thead>
        {head.map((h) => <th key={h} className={`${thS}`}>{h}</th>)}
      </Thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r[0]} className="[&>td]:py-0">
            <td className={`${tdS}`}>{String(i + 1).padStart(2, "0")}</td>
            <td className={`${tdS}`}>{r[0]}</td>
            <td className={`${tdS}`}>{r[1]}</td>
            <td className={`${tdS}`}>{r[2]}</td>
            <td className={`${tdS}`}><StatusPill className="h-[15px] w-[62px] rounded-[4px] text-[10.4px]">Assigned</StatusPill></td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}
