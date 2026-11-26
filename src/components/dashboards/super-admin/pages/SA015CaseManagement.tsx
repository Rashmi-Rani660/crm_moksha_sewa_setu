"use client";

/** SA-015 — Case Management. Demo data. */

import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  ChevronsUp,
  CircleCheck,
  CirclePlay,
  Clock3,
  Database,
  Download,
  FileText,
  FolderOpen,
  GraduationCap,
  HeartPulse,
  History,
  Layers,
  List,
  MapPin,
  MoreHorizontal,
  Package,
  RefreshCw,
  TrendingUp,
  TriangleAlert,
  UserRound,
  UserRoundPlus,
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

const tabs = ["Case List", "Case Assignments", "Progress Tracking", "Case Records", "Reports & Analytics"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { "Case List": List, "Case Assignments": UsersRound, "Progress Tracking": TrendingUp, "Case Records": Database, "Reports & Analytics": BarChart3 };

type Stage = "Verification Complete" | "In Service" | "Team Assigned" | "Post-Service Follow-up" | "Closed";
const stageStyle: Record<Stage, { icon: LucideIcon; cls: string }> = {
  "Verification Complete": { icon: CircleCheck, cls: "bg-[#e3f5e1] text-[#1c6b1f]" },
  "In Service": { icon: CirclePlay, cls: "bg-[#e3ecfd] text-[#1d4fb8]" },
  "Team Assigned": { icon: UsersRound, cls: "bg-[#ece6fd] text-[#5b34c2]" },
  "Post-Service Follow-up": { icon: RefreshCw, cls: "bg-[#fdebd2] text-[#8a5300]" },
  Closed: { icon: CircleCheck, cls: "bg-[#eceff4] text-[#3b4256]" },
};
const serviceIcon: Record<string, [LucideIcon, string]> = {
  "Medical Assistance": [HeartPulse, "#e02424"],
  "Education Support": [GraduationCap, "#2f6fe0"],
  "Livelihood Support": [Briefcase, "#2f6fe0"],
  "Relief & Essentials": [Package, "#f0a020"],
  "Documentation Help": [FileText, "#2f6fe0"],
};

type Case = { id: string; req: string; service: string; who: string; centre: string; admin: string; stage: Stage; priority: "High" | "Medium" | "Low" };
const cases: Case[] = [
  { id: "CASE-2026-10456", req: "REQ-2026-15321", service: "Medical Assistance", who: "Ramesh Kumar", centre: "Ghaziabad (HO)", admin: "Admin A01", stage: "Verification Complete", priority: "High" },
  { id: "CASE-2026-10455", req: "REQ-2026-15319", service: "Education Support", who: "Sunita Devi", centre: "Delhi – Centre 02", admin: "Admin A03", stage: "In Service", priority: "Medium" },
  { id: "CASE-2026-10454", req: "REQ-2026-15317", service: "Livelihood Support", who: "Aliya Khan", centre: "Noida – Centre 01", admin: "Admin A02", stage: "Team Assigned", priority: "Medium" },
  { id: "CASE-2026-10453", req: "REQ-2026-15314", service: "Relief & Essentials", who: "Suresh Yadav", centre: "Ghaziabad – C03", admin: "Admin A04", stage: "In Service", priority: "High" },
  { id: "CASE-2026-10452", req: "REQ-2026-15310", service: "Medical Assistance", who: "Meena Sharma", centre: "Delhi – Centre 01", admin: "Admin A01", stage: "Post-Service Follow-up", priority: "Medium" },
  { id: "CASE-2026-10451", req: "REQ-2026-15308", service: "Documentation Help", who: "Pawan Singh", centre: "Noida – Centre 02", admin: "Admin A05", stage: "Verification Complete", priority: "Low" },
  { id: "CASE-2026-10450", req: "REQ-2026-15307", service: "Education Support", who: "Kavita Kumari", centre: "Ghaziabad – C02", admin: "Admin A03", stage: "Team Assigned", priority: "Medium" },
  { id: "CASE-2026-10449", req: "REQ-2026-15306", service: "Livelihood Support", who: "Imran Ali", centre: "Delhi – Centre 03", admin: "Admin A02", stage: "In Service", priority: "High" },
  { id: "CASE-2026-10448", req: "REQ-2026-15303", service: "Relief & Essentials", who: "Geeta Devi", centre: "Noida – Centre 01", admin: "Admin A04", stage: "Closed", priority: "Low" },
  { id: "CASE-2026-10447", req: "REQ-2026-15299", service: "Medical Assistance", who: "Mahesh Prasad", centre: "Ghaziabad (HO)", admin: "Admin A01", stage: "Post-Service Follow-up", priority: "Medium" },
];

const breakdown: [Stage, string, string, string, number][] = [
  ["Verification Complete", "92", "(33%)", "#1f9a2b", 33],
  ["Team Assigned", "54", "(20%)", "#7a3fe0", 20],
  ["In Service", "68", "(25%)", "#2f6fe0", 25],
  ["Post-Service Follow-up", "36", "(13%)", "#f0a020", 13],
  ["Closed", "276", "(10%)", "#9aa1b5", 10],
];

const updates = [
  ["CASE-2026-10456", "Verification completed", "11:32 AM", "#1f9a1f"],
  ["CASE-2026-10452", "Moved to Post-Service Follow-up", "10:56 AM", "#f0a020"],
  ["CASE-2026-10449", "Updated to In Service", "09:48 AM", "#1f5fc4"],
  ["CASE-2026-10444", "Assigned to Admin A05", "09:25 AM", "#7a3fe0"],
  ["CASE-2026-10441", "Case closed successfully", "08:57 AM", "#1f9a1f"],
];

const stageOpts = ["All Stages", ...Object.keys(stageStyle)] as const;
const centreOpts = ["All Centres", "Ghaziabad", "Delhi", "Noida"] as const;
const serviceOpts = ["All Service Types", ...Object.keys(serviceIcon)] as const;
const priorityStyle = { High: "text-[#c81e1e] bg-[#fde4e4]", Medium: "text-[#8a5300] bg-[#fdebd2]", Low: "text-[#1c6b1f] bg-[#e3f5e1]" };

export default function SA015CaseManagement() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Case List");
  const [stage, setStage] = useState<string>("All Stages");
  const [centre, setCentre] = useState<string>("All Centres");
  const [service, setService] = useState<string>("All Service Types");
  const [applied, setApplied] = useState({ stage: "All Stages", centre: "All Centres", service: "All Service Types" });
  const rows = cases.filter(
    (c) =>
      (applied.stage === "All Stages" || c.stage === applied.stage) &&
      (applied.centre === "All Centres" || c.centre.startsWith(applied.centre)) &&
      (applied.service === "All Service Types" || c.service === applied.service),
  );

  return (
    <SuperAdminFrame active="case-workflow">
      <PageHead icon={Briefcase} title="Case Management" links={["Verified Cases", "Assignment Control", "Progress Tracking", "Case Records"]} />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={FolderOpen} value="418" label="Open Cases" />
        <KpiTile tone="green" icon={RefreshCw} value="126" label="In Progress Cases" />
        <KpiTile tone="green" icon={CircleCheck} value="276" label="Closed Cases" />
        <KpiTile tone="red" icon={TriangleAlert} value="34" label="High Priority Cases" />
        <KpiTile tone="purple" icon={UsersRound} value="382" label="Case Assignments" />
        <KpiTile tone="sky" icon={Clock3} value="4.8 Days" label="Avg Resolution Time" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} icons={tabIcons} />

      <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[970fr_375fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <div className="flex min-h-0 min-w-0 flex-col gap-[8px]">
          <section aria-label="Conversion" className="grid grid-cols-1 gap-[10px] rounded-[12px] border border-[#e1e5ee] bg-white p-[8px] shadow-[0_3px_10px_rgba(30,50,110,0.07)] sm:grid-cols-2 lg:h-[66px]">
            <div className="flex items-center gap-[16px] rounded-[9px] bg-[#f1ebff] px-[18px]">
              <FileText strokeWidth={1.8} className="h-[32px] w-[32px] text-[#7a3fe0]" />
              <span className="leading-tight"><span className="block text-[12.5px] font-semibold">Requests Received (This Month)</span><b className="text-[21px]">324</b></span>
            </div>
            <div className="flex items-center gap-[16px] rounded-[9px] bg-[#e8f7e6] px-[18px]">
              <Briefcase strokeWidth={1.8} className="h-[32px] w-[32px] text-[#1f9a2b]" />
              <span className="leading-tight"><span className="block text-[12.5px] font-semibold">Requests Converted to Cases</span><b className="text-[21px]">276 (85%)</b></span>
            </div>
          </section>

          <section aria-label="Case filters" className="grid grid-cols-2 items-end gap-[10px] rounded-[12px] border border-[#e1e5ee] bg-white px-[10px] py-[7px] shadow-[0_3px_10px_rgba(30,50,110,0.07)] sm:grid-cols-5 lg:h-[66px]">
            <Lbl t="Case Stage"><Dropdown label="Case Stage" value={stage} options={stageOpts} onChange={setStage} className="w-full" /></Lbl>
            <Lbl t="Centre"><Dropdown label="Centre filter" value={centre} options={centreOpts} onChange={setCentre} className="w-full" /></Lbl>
            <Lbl t="Service Type"><Dropdown label="Service Type" value={service} options={serviceOpts} onChange={setService} className="w-full" /></Lbl>
            <Lbl t="Date (Case Created)">
              <span className="flex h-[34px] items-center gap-[8px] rounded-[8px] border border-[#d6dbe6] px-[10px] text-[12.5px] font-semibold"><CalendarDays strokeWidth={2} className="h-[15px] w-[15px]" />01 Nov 2026 – 24 Nov 2026</span>
            </Lbl>
            <button type="button" onClick={() => setApplied({ stage, centre, service })} className="flex h-[34px] items-center justify-center gap-[6px] rounded-[8px] border-[1.5px] border-[#6d7fe8] bg-[#f3f7ff] text-[13px] font-semibold text-[#2320c4] hover:bg-[#e9f0ff]">
              <RefreshCw strokeWidth={2.3} className="h-[15px] w-[15px]" />Apply Filters
            </button>
          </section>

          <Panel title="Case List" note={`(${applied.stage === "All Stages" && applied.centre === "All Centres" && applied.service === "All Service Types" ? 276 : rows.length} Cases)`} icon={List} className="min-h-0 lg:flex-1" action={<ViewLink to="Case & Workflow" />} bodyClassName="pt-[2px] [&_td]:px-[4px] [&_td]:text-[11.6px] [&_th]:px-[4px]">
            <TableWrap>
              <Thead>
                {["#", "Case ID", "Linked Request ID", "Service Type", "Beneficiary / Family", "Centre", "Assigned Admin", "Current Stage", "Priority", "Action"].map((h) => (
                  <th key={h} className={`${thS} ${h === "Action" ? "text-center" : ""}`}>{h}</th>
                ))}
              </Thead>
              <tbody>
                {rows.map((c, i) => {
                  const [SI, sc] = serviceIcon[c.service];
                  const st = stageStyle[c.stage];
                  return (
                    <tr key={c.id} className="border-b border-[#eef0f5] last:border-0">
                      <td className={`${tdS}`}>{String(i + 1).padStart(2, "0")}</td>
                      <td className={tdS}><Link href={saRoutes.caseDetails} className="font-semibold text-[#1d4fe0] underline hover:text-[#1840c0]">{c.id}</Link></td>
                      <td className={tdS}>{c.req}</td>
                      <td className={tdS}><span className="flex items-center gap-[6px]"><SI strokeWidth={2} style={{ color: sc }} className="h-[14px] w-[14px]" />{c.service}</span></td>
                      <td className={tdS}><span className="flex items-center gap-[6px]"><UsersRound strokeWidth={2} className="h-[13px] w-[13px]" />{c.who}</span></td>
                      <td className={tdS}><span className="flex items-center gap-[5px]"><MapPin strokeWidth={2} className="h-[13px] w-[13px]" />{c.centre}</span></td>
                      <td className={tdS}><span className="flex items-center gap-[5px]"><UserRound strokeWidth={2} className="h-[13px] w-[13px]" />{c.admin}</span></td>
                      <td className={tdS}>
                        <span className={`inline-flex h-[19px] w-[128px] items-center gap-[5px] rounded-[5px] px-[6px] text-[11px] font-semibold ${st.cls}`}><st.icon strokeWidth={2.2} className="h-[12px] w-[12px]" />{c.stage}</span>
                      </td>
                      <td className={tdS}>
                        <span className={`inline-flex h-[19px] w-[62px] items-center gap-[4px] rounded-[5px] px-[6px] text-[11px] font-semibold ${priorityStyle[c.priority]}`}><ChevronsUp strokeWidth={2.2} className="h-[12px] w-[12px]" />{c.priority}</span>
                      </td>
                      <td className={`${tdS} text-center`}>
                        <button type="button" aria-label={`Actions for ${c.id}`} onClick={() => notice.show(`${c.id}: reassign / update stage / close (demo).`)}><MoreHorizontal strokeWidth={2.2} className="h-[16px] w-[16px]" /></button>
                      </td>
                    </tr>
                  );
                })}
                {!rows.length && <tr><td colSpan={10} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">No cases match these filters.</td></tr>}
              </tbody>
            </TableWrap>
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Case Stage Breakdown" icon={Layers} className="lg:h-[175px]" bodyClassName="flex flex-col justify-between pt-[4px]">
            {breakdown.map(([l, v, p, c, w]) => {
              const I = stageStyle[l].icon;
              return (
                <div key={l} className="flex items-center gap-[8px] text-[12.2px] font-semibold">
                  <I strokeWidth={2} style={{ color: c }} className="h-[15px] w-[15px] shrink-0" />
                  <span className="w-[140px] truncate">{l}</span>
                  <span className="h-[7px] flex-1 overflow-hidden rounded-full bg-[#e3e7ef]"><span style={{ width: `${w * 2.5}%`, background: c }} className="block h-full rounded-full" /></span>
                  <b className="w-[66px] text-right">{v} {p}</b>
                </div>
              );
            })}
          </Panel>
          <Panel title="Quick Actions" icon={Zap} className="lg:h-[200px]" bodyClassName="pt-[4px]">
            <QuickList
              items={[
                { icon: Briefcase, label: "Create Case", onClick: () => notice.show("Cases are created from verified requests (demo).") },
                { icon: UserRoundPlus, label: "Assign Admin", color: "#7a3fe0", onClick: () => notice.show("Assign an admin to a case (demo).") },
                { icon: RefreshCw, label: "Reassign Case", color: "#7a3fe0", onClick: () => notice.show("Reassign with a recorded reason (demo).") },
                { icon: CircleCheck, label: "Close Case", color: "#1f9a2b", onClick: () => notice.show("Close after follow-up and documentation (demo).") },
                { icon: Download, label: "Export Case List", onClick: () => notice.show("Case list exported (demo).") },
              ]}
            />
          </Panel>
          <Panel title="Recent Case Updates" icon={History} className="min-h-0 lg:flex-1" action={<ViewLink to="Audit Logs" />} bodyClassName="flex flex-col justify-between pt-[4px]">
            {updates.map(([id, t, at, c]) => (
              <div key={id} className="flex items-center gap-[7px] text-[11.6px] font-medium">
                <span style={{ background: c }} className="h-[8px] w-[8px] shrink-0 rounded-full" />
                <span className="min-w-0 flex-1 truncate">
                  <Link href={saRoutes.caseDetails} className="font-semibold text-[#1d4fe0] underline">{id}</Link> – {t}
                </span>
                <span className="shrink-0">{at}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function Lbl({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="mb-[3px] text-[12.5px] font-bold leading-none">{t}</p>
      {children}
    </div>
  );
}
