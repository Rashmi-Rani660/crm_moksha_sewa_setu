"use client";

/** SA-011 — Reporting Hierarchy. Demo data. */

import { useState } from "react";
import {
  ArrowDown,
  ArrowLeftRight,
  Bot,
  Building2,
  CircleCheck,
  Crown,
  Database,
  Download,
  GitBranch,
  History,
  Layers,
  Link2,
  MapPin,
  MessageSquareText,
  Minus,
  Network,
  Plus,
  ShieldCheck,
  Table2,
  User,
  UserPlus,
  UserRound,
  UsersRound,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
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

const tabs = ["Hierarchy Overview", "Admin Matrix", "Escalation & Approval", "Mapped Departments", "Change History"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { "Hierarchy Overview": Network, "Admin Matrix": Table2, "Escalation & Approval": Link2, "Mapped Departments": Database, "Change History": History };

const matrix = [
  ["Sewa Operations", "Admin – Sewa Ops", "All Centres", "24"],
  ["Communication Hub", "Admin – Comm. Hub", "HO / Central", "12"],
  ["Finance & Donations", "Admin – Finance", "HO / Central", "08"],
  ["AI & Automation", "Admin – AI", "HO / Central", "06"],
  ["Security & Backup", "Admin – Security", "HO / Central", "05"],
  ["Volunteer Coordination", "Admin – Volunteer", "All Centres", "18"],
  ["Integrations & API", "Admin – Integrations", "HO / Central", "06"],
  ["Reports & Analytics", "Admin – Reports", "HO / Central", "07"],
  ["City / Zone Operations", "Admin – City Zone", "Multi-Zone", "26"],
  ["Case & Workflow", "Admin – Case", "All Centres", "14"],
];

const mapped: { icon: LucideIcon; color: string; bg: string; title: string; sub: string }[] = [
  { icon: UsersRound, color: "#2f6fe0", bg: "#eef4ff", title: "Sewa Operations", sub: "Field Operations, Centre Management & Service Delivery" },
  { icon: MessageSquareText, color: "#1f9a2b", bg: "#eef9ec", title: "Communication Hub", sub: "SMS, WhatsApp, Email & Stakeholder Communication" },
  { icon: Database, color: "#f0a020", bg: "#fff7e8", title: "Finance & Donations", sub: "Donations, Accounting, Payouts & Financial Tracking" },
  { icon: Bot, color: "#7a3fe0", bg: "#f5f0ff", title: "AI & Automation", sub: "AI Workflows, Auto-Assignment & Intelligent Operations" },
  { icon: ShieldCheck, color: "#e02424", bg: "#fff1f1", title: "Security & Backup", sub: "Access, Data Security, Backup & Incident Control" },
  { icon: UsersRound, color: "#2f6fe0", bg: "#eef4ff", title: "Volunteer Coordination", sub: "Volunteer Onboarding, Assignment & Engagement" },
];

const ladder = [
  { icon: User, color: "#2f6fe0", bg: "#eef4ff", title: "Level 1 – User", sub: "Create / Update / Submit Requests, Tasks & Data" },
  { icon: UsersRound, color: "#7a3fe0", bg: "#f5f0ff", title: "Level 2 – Admin", sub: "Review, Approve, Manage Operations & Team Access" },
  { icon: Crown, color: "#f0a020", bg: "#fff7e8", title: "Level 3 – Super Admin", sub: "Final Approval, Escalation, Policy & Structural Control" },
];

const changes = [
  ["Reporting line updated: Communication Hub → Admin – Comm. Hub", "Super Admin", "24 Nov 2026, 11:20 AM"],
  ["New department mapped: Volunteer Coordination (Team Size: 18)", "Admin – HR", "24 Nov 2026, 10:47 AM"],
  ["Escalation chain modified: Level 2 (Admin) approval rules updated", "Super Admin", "23 Nov 2026, 06:32 PM"],
  ["Backup admin assigned: Admin – Finance (Secondary: Admin – Ops)", "Super Admin", "23 Nov 2026, 04:15 PM"],
];

const leaves: { key: string; icon: LucideIcon; label: string; items: string[] }[] = [
  { key: "groups", icon: UsersRound, label: "User Groups (06)", items: ["Field Staff", "Helpline", "Volunteers"] },
  { key: "depts", icon: Layers, label: "Departments (12)", items: ["Sewa Operations", "Finance & Donations", "Case & Workflow"] },
  { key: "centres", icon: MapPin, label: "Centres (10)", items: ["Ghaziabad (HO)", "Delhi – Coming Soon", "Noida – Coming Soon"] },
];

export default function SA011ReportingHierarchy() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Hierarchy Overview");
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set(["org", "ms", "sa", "admin"]));
  const toggle = (k: string) =>
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  return (
    <SuperAdminFrame active="users-access-control">
      <PageHead icon={Network} title="Reporting Hierarchy" links={["Organisation Reporting Structure", "Escalation Ladder", "Admin Mapping", "Responsibility Matrix"]} />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={UsersRound} value="28" label="Total Reporting Units" />
        <KpiTile tone="green" icon={ShieldCheck} value="03" label="Super Admin Nodes" />
        <KpiTile tone="orange" icon={UsersRound} value="12" label="Admin Nodes" />
        <KpiTile tone="purple" icon={Network} value="24" label="User Groups" />
        <KpiTile tone="red" icon={Layers} value="08" label="Escalation Chains" />
        <KpiTile tone="sky" icon={ShieldCheck} value="06" label="Active Hierarchies" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} icons={tabIcons} />

      <div className="grid gap-[10px] lg:h-[452px] lg:grid-cols-[310fr_700fr_340fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Organisation Reporting Tree" icon={Network} bodyClassName="pt-[8px]">
          <TreeNode depth={0} k="org" open={open} onToggle={toggle} icon={Building2} color="#7a3fe0" bg="bg-[#f3eeff]" title="Namo Gange Trust" sub="(Organisation)">
            <TreeNode depth={1} k="ms" open={open} onToggle={toggle} icon={Waves} color="#2f6fe0" bg="bg-[#eef4ff]" title="Moksha Sewa" sub="(Initiative / Vertical)">
              <TreeNode depth={2} k="sa" open={open} onToggle={toggle} icon={Crown} color="#f0a020" bg="bg-[#fff7e8]" title="Super Admin" sub="(System Level)">
                <TreeNode depth={3} k="admin" open={open} onToggle={toggle} icon={UserRound} color="#7a3fe0" bg="bg-[#f3eeff]" title="Admin" sub="(Operational Level)">
                  <div className="ml-[18px] flex flex-col gap-[6px] border-l border-dashed border-[#9aa1b5] pl-[12px] pt-[6px]">
                    {leaves.map((l) => (
                      <div key={l.key}>
                        <div className="flex items-center gap-[8px]">
                          <button type="button" aria-label={`${open.has(l.key) ? "Collapse" : "Expand"} ${l.label}`} onClick={() => toggle(l.key)} className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[3px] border border-[#5b6280] bg-white">
                            {open.has(l.key) ? <Minus strokeWidth={3} className="h-[9px] w-[9px]" /> : <Plus strokeWidth={3} className="h-[9px] w-[9px]" />}
                          </button>
                          <span className="flex h-[28px] flex-1 items-center gap-[8px] rounded-[8px] bg-[#eef4ff] px-[10px] text-[12.6px] font-semibold">
                            <l.icon strokeWidth={2} className="h-[16px] w-[16px] text-[#2f6fe0]" />
                            {l.label}
                          </span>
                        </div>
                        {open.has(l.key) && (
                          <ul className="ml-[36px] mt-[3px] space-y-[2px] text-[11.6px] font-medium">
                            {l.items.map((it) => <li key={it}>• {it}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </TreeNode>
              </TreeNode>
            </TreeNode>
          </TreeNode>
        </Panel>

        <div className="flex min-h-0 min-w-0 flex-col gap-[10px]">
          <Panel title="Admin Reporting Matrix" icon={Table2} className="lg:h-[282px]" bodyClassName="pt-[2px] [&_th]:py-[3px]">
            <TableWrap>
              <Thead>
                {["#", "Department", "Reporting Admin", "Zone / Centre", "Team Size", "Escalation Level", "Status"].map((h) => (
                  <th key={h} className={`${thS} ${["Team Size", "Escalation Level", "Status"].includes(h) ? "text-center" : ""}`}>{h}</th>
                ))}
              </Thead>
              <tbody>
                {matrix.map((r, i) => (
                  <tr key={r[0]} className="border-b border-[#eef0f5] last:border-0 [&>td]:py-px">
                    <td className={tdS}>{String(i + 1).padStart(2, "0")}</td>
                    <td className={tdS}>{r[0]}</td>
                    <td className={tdS}>{r[1]}</td>
                    <td className={tdS}>{r[2]}</td>
                    <td className={`${tdS} text-center`}>{r[3]}</td>
                    <td className={`${tdS} text-center`}><span className="rounded-[4px] bg-[#dde9fd] px-[8px] text-[11px] font-semibold leading-[14px] text-[#1d4fb8]">Level 2</span></td>
                    <td className={`${tdS} text-center`}>
                      <span className="inline-flex h-[15px] items-center gap-[4px] rounded-full bg-[#d4f3d2] px-[7px] text-[11px] font-semibold leading-none text-[#1c6b1f]"><CircleCheck strokeWidth={2.4} className="h-[11px] w-[11px]" />Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>

          <Panel title="Key Mapped Departments / Teams" icon={Layers} className="min-h-0 lg:flex-1" bodyClassName="grid grid-cols-1 gap-[8px] pt-[6px] sm:grid-cols-3">
            {mapped.map((m) => (
              <div key={m.title} style={{ background: m.bg }} className="flex items-center gap-[10px] rounded-[9px] border border-[#e6e9f2] px-[10px] py-[3px]">
                <m.icon strokeWidth={1.9} style={{ color: m.color }} className="h-[26px] w-[26px] shrink-0" />
                <span className="min-w-0 leading-tight">
                  <b className="block text-[12.8px]">{m.title}</b>
                  <span className="block text-[10.8px] font-medium">{m.sub}</span>
                </span>
              </div>
            ))}
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Escalation Hierarchy & Approval Ladder" icon={GitBranch} className="lg:h-[282px]" bodyClassName="flex flex-col justify-between pt-[6px]">
            {ladder.map((l, i) => (
              <div key={l.title} className="flex flex-col items-center">
                {i > 0 && <ArrowDown strokeWidth={2.2} className="mb-[3px] h-[15px] w-[15px]" />}
                <div style={{ background: l.bg }} className="flex w-full items-center gap-[12px] rounded-[9px] border border-[#e1e5ee] px-[12px] py-[7px]">
                  <l.icon strokeWidth={1.9} style={{ color: l.color }} className="h-[28px] w-[28px] shrink-0" />
                  <span className="leading-tight">
                    <b className="block text-[13.5px]">{l.title}</b>
                    <span className="text-[10.8px] font-medium">{l.sub}</span>
                  </span>
                </div>
              </div>
            ))}
          </Panel>
          <Panel title="Quick Actions" icon={Zap} className="min-h-0 lg:flex-1" bodyClassName="pt-[6px]">
            <QuickList
              items={[
                { icon: UserPlus, label: "Add Reporting Line", onClick: () => notice.show("Add a reporting line — needs Super Admin approval (demo).") },
                { icon: ArrowLeftRight, label: "Change Reporting Admin", onClick: () => notice.show("Change the reporting admin of a department (demo).") },
                { icon: ShieldCheck, label: "Assign Backup Admin", color: "#7a3fe0", onClick: () => notice.show("Assign a backup admin for leave / absence (demo).") },
                { icon: Download, label: "Export Structure", color: "#7a3fe0", onClick: () => notice.show("Reporting structure exported (demo).") },
              ]}
            />
          </Panel>
        </div>
      </div>

      <Panel title="Recent Hierarchy Changes / Audit Trail" icon={History} className="lg:min-h-0 lg:flex-1" action={<ViewLink to="Audit Logs" />} bodyClassName="pt-[4px]">
        <TableWrap>
          <Thead>
            {["#", "Change Detail", "Updated By", "Date & Time", "Status"].map((h) => (
              <th key={h} className={thS}>{h}</th>
            ))}
          </Thead>
          <tbody>
            {changes.map((c, i) => (
              <tr key={c[0]} className="border-b border-[#eef0f5] last:border-0">
                <td className={tdS}>{String(i + 1).padStart(2, "0")}</td>
                <td className={tdS}>{c[0]}</td>
                <td className={tdS}><span className="flex items-center gap-[6px]"><UserRound strokeWidth={2} className="h-[14px] w-[14px]" />{c[1]}</span></td>
                <td className={tdS}>{c[2]}</td>
                <td className={tdS}><StatusPill className="h-[15px] w-[70px] text-[10.6px]">Applied</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>
      {notice.node}
    </SuperAdminFrame>
  );
}

function TreeNode({
  depth,
  k,
  open,
  onToggle,
  icon: Icon,
  color,
  bg,
  title,
  sub,
  children,
}: {
  depth: number;
  k: string;
  open: ReadonlySet<string>;
  onToggle: (k: string) => void;
  icon: LucideIcon;
  color: string;
  bg: string;
  title: string;
  sub: string;
  children?: React.ReactNode;
}) {
  const isOpen = open.has(k);
  return (
    <div className={depth ? "ml-[14px] mt-[7px] border-l border-dashed border-[#9aa1b5] pl-[8px]" : ""}>
      <div className="flex items-center gap-[6px]">
        <button type="button" aria-label={`${isOpen ? "Collapse" : "Expand"} ${title}`} onClick={() => onToggle(k)} className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[3px] border border-[#5b6280] bg-white">
          {isOpen ? <Minus strokeWidth={3} className="h-[9px] w-[9px]" /> : <Plus strokeWidth={3} className="h-[9px] w-[9px]" />}
        </button>
        <div className={`flex flex-1 items-center gap-[10px] rounded-[9px] border border-[#e1e5ee] px-[10px] py-[5px] ${bg}`}>
          <Icon strokeWidth={1.9} style={{ color }} className="h-[24px] w-[24px] shrink-0" />
          <span className="leading-tight">
            <b className="block text-[13.5px]">{title}</b>
            <span className="text-[11.4px] font-medium">{sub}</span>
          </span>
        </div>
      </div>
      {isOpen && children}
    </div>
  );
}
