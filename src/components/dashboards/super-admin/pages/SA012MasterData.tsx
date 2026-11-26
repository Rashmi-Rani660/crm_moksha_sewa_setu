"use client";

/** SA-012 — Master Data Management. Demo data. */

import { useState } from "react";
import {
  Archive,
  Bell,
  Building2,
  CalendarCheck,
  CirclePlus,
  Clock3,
  Code,
  Crown,
  Database,
  Eye,
  FilePen,
  FileText,
  GitBranch,
  History,
  Layers,
  LayoutGrid,
  MoreVertical,
  Network,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Upload,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  Pill,
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

const tabs = ["Service Masters", "Centre Masters", "User Masters", "Document Types", "Code Libraries", "Templates"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { "Service Masters": Layers, "Centre Masters": Building2, "User Masters": UsersRound, "Document Types": FileText, "Code Libraries": Code, Templates: LayoutGrid };
const tabType: Record<Tab, string> = { "Service Masters": "Service Master", "Centre Masters": "Centre Master", "User Masters": "User Master", "Document Types": "Document Type", "Code Libraries": "Code Library", Templates: "Template" };

const records = [
  ["Service Master", "Food Distribution", "SVC-FD-001", "24 Nov 2026, 10:32 AM", "v3.2", "Super Admin", "Active"],
  ["Service Master", "Medical Assistance", "SVC-MD-002", "24 Nov 2026, 09:58 AM", "v2.1", "Admin", "Active"],
  ["Centre Master", "Ghaziabad Centre (HO)", "CTR-GZ-001", "23 Nov 2026, 06:24 PM", "v4.0", "Operations Lead", "Active"],
  ["Centre Master", "Delhi Service Centre", "CTR-DL-002", "23 Nov 2026, 05:41 PM", "v3.1", "Centre Admin", "Active"],
  ["User Master", "Role – Operations Executive", "ROL-OE-001", "24 Nov 2026, 11:10 AM", "v2.5", "Super Admin", "Active"],
  ["Code Library", "Request Priority Codes", "COD-PR-001", "22 Nov 2026, 04:37 PM", "v1.4", "System Admin", "Active"],
  ["Code Library", "Case Status Codes", "COD-CS-001", "22 Nov 2026, 03:15 PM", "v1.6", "System Admin", "Active"],
  ["Document Type", "Identity Proof (Govt.)", "DOC-ID-001", "21 Nov 2026, 07:22 PM", "v1.3", "Admin", "Active"],
  ["Template", "Request Intake Template", "TMP-RQ-001", "24 Nov 2026, 08:19 AM", "v2.0", "Operations Lead", "Draft"],
  ["Template", "Approval Workflow Template", "TMP-AP-002", "23 Nov 2026, 02:47 PM", "v1.9", "Admin", "Review"],
];

const versions = [
  ["v3.2", "24 Nov 2026, 10:32 AM"],
  ["v3.1", "20 Nov 2026, 04:10 PM"],
  ["v3.0", "14 Nov 2026, 11:26 AM"],
  ["v2.5", "08 Nov 2026, 03:05 PM"],
];

const changeLog = [
  ["Record updated: Food Distribution (v3.2)", "24 Nov 2026, 10:32 AM", "#1f9a1f"],
  ["New record added: Delhi Service Centre", "23 Nov 2026, 05:41 PM", "#1f9a1f"],
  ["Template updated: Request Intake Template", "23 Nov 2026, 02:47 PM", "#1f5fc4"],
  ["Status changed: Case Status Codes (Draft → Active)", "22 Nov 2026, 03:15 PM", "#f0a020"],
];

const templates: { icon: LucideIcon; value: string; label: string; bg: string; fg: string }[] = [
  { icon: FileText, value: "12", label: "Request Templates", bg: "#f3eeff", fg: "#7a3fe0" },
  { icon: CalendarCheck, value: "08", label: "Task Templates", bg: "#eaf3ff", fg: "#2f6fe0" },
  { icon: Bell, value: "06", label: "Notification Templates", bg: "#fff5e2", fg: "#ef9a12" },
  { icon: Network, value: "04", label: "Approval Templates", bg: "#ebf8e9", fg: "#1f9a2b" },
];

export default function SA012MasterData() {
  const notice = useNotice();
  // null = every type (the design opens on all records with the first tab highlighted)
  const [tab, setTab] = useState<Tab | null>(null);
  const rows = tab ? records.filter((r) => r[0] === tabType[tab]) : records;

  return (
    <SuperAdminFrame active="master-data">
      <PageHead icon={Database} title="Master Data Management" links={["Service Masters", "Code Libraries", "Templates", "Version Control", "Archive"]} />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Layers} value="18" label="Master Categories" />
        <KpiTile tone="green" icon={Database} value="3,482" label="Active Records" />
        <KpiTile tone="orange" icon={FilePen} value="76" label="Draft Updates" />
        <KpiTile tone="purple" icon={Archive} value="629" label="Archived Items" />
        <KpiTile tone="red" icon={GitBranch} value="24" label="Version Sets" />
        <KpiTile tone="sky" icon={Clock3} value="12" label="Pending Review" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab ?? "Service Masters"} onChange={(t) => setTab(t === tab ? null : t)} icons={tabIcons} />

      <div className="grid gap-[10px] lg:h-[350px] lg:grid-cols-[885fr_465fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title={tab ? `Master Data Records — ${tab}` : "Master Data Records"} icon={Database} titleSize={17} bodyClassName="pt-[4px]">
          <TableWrap>
            <Thead>
              {["#", "Master Type", "Record Name", "Code", "Last Updated", "Version", "Owner", "Status", "Action"].map((h) => (
                <th key={h} className={`${thS} ${["Status", "Action", "Version"].includes(h) ? "text-center" : ""}`}>{h}</th>
              ))}
            </Thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r[2]} className="border-b border-[#eef0f5] last:border-0">
                  <td className={`${tdS}`}>{String(i + 1).padStart(2, "0")}</td>
                  <td className={tdS}>{r[0]}</td>
                  <td className={tdS}>{r[1]}</td>
                  <td className={tdS}>{r[2]}</td>
                  <td className={tdS}>{r[3]}</td>
                  <td className={`${tdS} text-center`}>{r[4]}</td>
                  <td className={tdS}>{r[5]}</td>
                  <td className={`${tdS} text-center`}>
                    <StatusPill className="h-[18px] w-[70px] text-[11px]">{r[6]}</StatusPill>
                  </td>
                  <td className={`${tdS} text-center`}>
                    <div className="flex items-center justify-center gap-[7px] text-[#1d4fe0]">
                      <button type="button" aria-label={`View ${r[1]}`} onClick={() => notice.show(`${r[2]}: record details (demo).`)}><Eye strokeWidth={2.2} className="h-[15px] w-[15px]" /></button>
                      <button type="button" aria-label={`Edit ${r[1]}`} onClick={() => notice.show(`${r[2]}: edits create a new version for review (demo).`)} className="text-[#7a3fe0]"><Pencil strokeWidth={2.2} className="h-[14px] w-[14px]" /></button>
                      <button type="button" aria-label={`More for ${r[1]}`} onClick={() => notice.show(`${r[2]}: publish / archive (demo).`)} className="text-[#0b0c36]"><MoreVertical strokeWidth={2.2} className="h-[15px] w-[15px]" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Version History" icon={History} titleSize={17} className="lg:h-[170px]" action={<ViewLink to="Audit Logs" />} bodyClassName="flex flex-col justify-between pt-[4px]">
            {versions.map(([v, at]) => (
              <div key={v} className="flex items-center gap-[10px] text-[12px] font-medium">
                <span className="w-[44px] rounded-[5px] bg-[#e3ecfd] py-[2px] text-center font-bold text-[#1d3fc4]">{v}</span>
                <span className="flex-1 truncate">Food Distribution – Service Master</span>
                <span className="shrink-0">{at}</span>
              </div>
            ))}
          </Panel>
          <Panel title="Change Log" icon={FileText} titleSize={17} className="min-h-0 lg:flex-1" action={<ViewLink to="Audit Logs" />} bodyClassName="flex flex-col justify-between pt-[4px]">
            {changeLog.map(([t, at, c]) => (
              <div key={t} className="flex items-center gap-[8px] text-[12px] font-medium">
                <span style={{ background: c }} className="h-[8px] w-[8px] shrink-0 rounded-full" />
                <span className="flex-1 truncate">{t}</span>
                <span className="shrink-0">{at}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>

      <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[460fr_440fr_450fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Template Library" icon={Layers} titleSize={17} bodyClassName="grid grid-cols-2 gap-[10px] pt-[6px]">
          {templates.map((t) => (
            <button key={t.label} type="button" onClick={() => notice.show(`${t.label} (demo).`)} style={{ background: t.bg }} className="flex items-center gap-[12px] rounded-[10px] border border-[#e6e9f2] px-[14px] text-left hover:brightness-[0.98]">
              <t.icon strokeWidth={1.9} style={{ color: t.fg }} className="h-[28px] w-[28px] shrink-0" />
              <span className="leading-tight">
                <b className="block text-[20px]">{t.value}</b>
                <span className="text-[12.5px] font-semibold">{t.label}</span>
              </span>
            </button>
          ))}
        </Panel>

        <Panel title="Governance & Compliance" icon={ShieldCheck} titleSize={17} bodyClassName="flex flex-col gap-[9px] pt-[8px]">
          {[
            [Crown, "#f0a020", "Approval Required", <Pill key="y" tone="green" className="h-[22px] px-[12px] text-[12.5px]">Yes</Pill>],
            [RefreshCw, "#2f6fe0", "Auto Sync Status", <Pill key="e" tone="green" className="h-[22px] px-[12px] text-[12.5px]">Enabled</Pill>],
            [Archive, "#7a3fe0", "Archive Policy", <Pill key="a" tone="blue" className="h-[22px] rounded-[6px] px-[12px] text-[12.5px]">Retain for 5 Years</Pill>],
            [Database, "#2f6fe0", "Last Backup", <Pill key="b" tone="blue" className="h-[22px] rounded-[6px] px-[12px] text-[12.5px]">24 Nov 2026, 02:00 AM</Pill>],
          ].map(([I, c, l, v]) => {
            const Icon = I as LucideIcon;
            return (
              <div key={l as string} className="flex items-center gap-[12px] border-b border-[#eef0f5] pb-[6px] last:border-0 last:pb-0">
                <Icon strokeWidth={2} style={{ color: c as string }} className="h-[20px] w-[20px] shrink-0" />
                <span className="flex-1 text-[13.5px] font-semibold">{l as string}</span>
                {v as React.ReactNode}
              </div>
            );
          })}
        </Panel>

        <Panel title="Quick Actions" icon={Zap} titleSize={17} bodyClassName="pt-[6px]">
          <QuickList
            items={[
              { icon: CirclePlus, label: "Add Master", onClick: () => notice.show("New master record — saved as draft for review (demo).") },
              { icon: Upload, label: "Import Data", color: "#7a3fe0", onClick: () => notice.show("Import CSV / Excel with validation preview (demo).") },
              { icon: Layers, label: "Publish Version", color: "#f0a020", onClick: () => notice.show("Publishing needs approval; previous version is kept (demo).") },
              { icon: Archive, label: "Archive Old Records", color: "#d6336c", onClick: () => notice.show("Records are archived, never deleted (demo).") },
            ]}
          />
        </Panel>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

