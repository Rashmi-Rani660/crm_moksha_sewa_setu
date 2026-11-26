"use client";

/** SA-010 — Roles & Permission Matrix. Demo data; changes are recorded locally. */

import { useState } from "react";
import {
  Ban,
  CalendarDays,
  CircleCheck,
  Copy,
  Crown,
  Download,
  Eye,
  FileSearch,
  History,
  Info,
  Layers,
  LayoutGrid,
  Lock,
  Pencil,
  Settings,
  ShieldCheck,
  Database,
  User,
  UserPlus,
  UserRound,
  UsersRound,
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

const levels = ["Full Access", "Manage", "View Only", "Restricted", "No Access"] as const;
type Level = (typeof levels)[number];
const levelStyle: Record<Level, { icon: LucideIcon; cls: string; desc: string }> = {
  "Full Access": { icon: CircleCheck, cls: "bg-[#dcf4d9] text-[#1c6b1f]", desc: "Complete access to the module, including create, edit, approve, delete and configure." },
  Manage: { icon: Settings, cls: "bg-[#ece6fd] text-[#5b34c2]", desc: "Operational access to create, edit and manage records within assigned scope." },
  "View Only": { icon: Eye, cls: "bg-[#dde9fd] text-[#1d4fb8]", desc: "Read-only access to view information and reports without making changes." },
  Restricted: { icon: Lock, cls: "bg-[#fde9c4] text-[#8a5300]", desc: "Limited access with specific constraints (e.g., own records, selected centres)." },
  "No Access": { icon: Ban, cls: "bg-[#fde0e0] text-[#b42318]", desc: "No access to the module or its data." },
};

type Row = [string, Level, Level];
const initialRows: Row[] = [
  ["Dashboard", "Manage", "View Only"],
  ["Live Operations", "Manage", "View Only"],
  ["Requests & Cases", "Manage", "Manage"],
  ["City/Zone & Centres", "Manage", "View Only"],
  ["Users & Access Control", "Manage", "Restricted"],
  ["Organisation Setup", "Manage", "Restricted"],
  ["Departments & Centres", "Manage", "View Only"],
  ["Master Data", "Manage", "View Only"],
  ["Sewa Operations", "Manage", "Manage"],
  ["Case & Workflow", "Manage", "Manage"],
  ["Communication Hub", "Manage", "View Only"],
  ["Automation & AI", "Manage", "Restricted"],
  ["Integrations & API", "Manage", "No Access"],
  ["Reports & Analytics", "View Only", "View Only"],
  ["Finance & Donations", "Manage", "View Only"],
  ["Security & Backup", "Manage", "Restricted"],
  ["Audit Logs", "View Only", "No Access"],
  ["System Settings", "Manage", "Restricted"],
];

type Change = { detail: string; by: string; at: string };
const initialChanges: Change[] = [
  { detail: "Updated 'Reports & Analytics' permission for Admin (View Only → Manage)", by: "Demo Admin 01", at: "24 Nov 2026, 11:32 AM" },
  { detail: "Added new permission group 'Operations Read' (3 modules)", by: "Super Admin", at: "24 Nov 2026, 10:48 AM" },
  { detail: "Modified access for 'Automation & AI' (Restricted → Manage) for Admin", by: "Demo Admin 02", at: "24 Nov 2026, 09:56 AM" },
  { detail: "Updated User role access (added 'Requests & Cases' – Manage)", by: "Operations Lead", at: "23 Nov 2026, 06:14 PM" },
  { detail: "Cloned Admin role to 'Centre Admin' with limited scope", by: "Super Admin", at: "23 Nov 2026, 04:27 PM" },
];

const tabs = ["Roles Overview", "Permission Matrix", "Approval Rights", "Data Access", "Activity History"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { "Roles Overview": UsersRound, "Permission Matrix": LayoutGrid, "Approval Rights": CircleCheck, "Data Access": Database, "Activity History": History };

const roles = [
  { icon: Crown, color: "#f0a020", name: "Super Admin", count: "01", desc: "Full system access with organisation-wide control, configuration and security management.", modules: "16 Modules", groups: "18 Groups", bg: "bg-[#fff8ec]" },
  { icon: UsersRound, color: "#7a3fe0", name: "Admin", count: "12", desc: "Operational access with management rights for assigned centres, departments and workflows.", modules: "14 Modules", groups: "12 Groups", bg: "bg-[#f6f2ff]" },
  { icon: User, color: "#2f6fe0", name: "User", count: "172", desc: "Limited access for day-to-day operations, requests and assigned tasks.", modules: "10 Modules", groups: "06 Groups", bg: "bg-[#f1f6ff]" },
];

export default function SA010RolesPermissions() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Permission Matrix");
  const [rows, setRows] = useState(initialRows);
  const [changes, setChanges] = useState(initialChanges);
  const [editing, setEditing] = useState(false);

  const cycle = (i: number, col: 1 | 2) => {
    if (!editing) return notice.show("Turn on Edit Permissions first.");
    const row = rows[i];
    const next = levels[(levels.indexOf(row[col]) + 1) % levels.length];
    const role = col === 1 ? "Admin" : "User";
    setRows(rows.map((r, j) => (j === i ? (col === 1 ? [r[0], next, r[2]] : [r[0], r[1], next]) : r)));
    const at = new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }).replace(" am", " AM").replace(" pm", " PM");
    setChanges([{ detail: `Updated '${row[0]}' permission for ${role} (${row[col]} → ${next})`, by: "Super Admin", at }, ...changes].slice(0, 5));
  };

  return (
    <SuperAdminFrame active="users-access-control">
      <PageHead icon={ShieldCheck} title="Roles & Permission Matrix" links={["Role-based access, module permissions, approval rights and security controls"]} />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={UsersRound} value="03" label="Access Levels" />
        <KpiTile tone="green" icon={Layers} value="18" label="Permission Groups" />
        <KpiTile tone="orange" icon={LayoutGrid} value="16" label="Modules" />
        <KpiTile tone="purple" icon={Lock} value="09" label="Restricted Actions" />
        <KpiTile tone="red" icon={CircleCheck} value="12" label="Approval Rules" />
        <KpiTile tone="sky" icon={ShieldCheck} value="100%" label="2FA Coverage" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} icons={tabIcons} />

      <div className="grid gap-[10px] lg:h-[612px] lg:grid-cols-[1000fr_355fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <div className="flex min-h-0 min-w-0 flex-col gap-[10px]">
          <div className="grid gap-[10px] lg:h-[420px] lg:grid-cols-[285fr_705fr] lg:[grid-template-rows:minmax(0,1fr)]">
            <Panel title="Role Summary" icon={UsersRound} bodyClassName="flex flex-col gap-[8px] pt-[6px]">
              {roles.map((r) => (
                <div key={r.name} className={`flex flex-1 flex-col justify-between rounded-[10px] border border-[#e6e9f2] px-[12px] py-[8px] ${r.bg}`}>
                  <div className="flex items-center gap-[10px]">
                    <r.icon strokeWidth={1.9} style={{ color: r.color }} className="h-[26px] w-[26px] shrink-0" />
                    <b className="flex-1 text-[15px]">{r.name}</b>
                    <span className="rounded-full bg-[#dde6fb] px-[10px] py-[2px] text-[13px] font-bold text-[#1d3fc4]">{r.count}</span>
                  </div>
                  <p className="text-[12px] font-medium leading-[1.3]">{r.desc}</p>
                  <p className="flex items-center gap-[8px] text-[12.5px] font-semibold">
                    <Layers strokeWidth={2} className="h-[15px] w-[15px]" />
                    {r.modules}
                    <span className="mx-[4px] h-[13px] w-px bg-[#9aa1b5]" />
                    <UsersRound strokeWidth={2} className="h-[15px] w-[15px]" />
                    {r.groups}
                  </p>
                </div>
              ))}
            </Panel>

            <Panel
              title="Permission Matrix — Module-wise Access"
              icon={LayoutGrid}
              action={
                <button
                  type="button"
                  aria-pressed={editing}
                  onClick={() => setEditing((e) => !e)}
                  className={`flex h-[24px] items-center gap-[5px] rounded-[7px] border-[1.5px] px-[9px] text-[12px] font-semibold ${editing ? "border-[#1d4fe0] bg-[#1d4fe0] text-white" : "border-[#2f4fe0] text-[#1d3fc4] hover:bg-[#f1f4ff]"}`}
                >
                  <Pencil strokeWidth={2.2} className="h-[12px] w-[12px]" />
                  {editing ? "Done" : "Edit"}
                </button>
              }
              bodyClassName="pt-[4px] [&_th]:py-[3px]"
            >
              <TableWrap>
                <Thead>
                  <th className={`${thS} w-[30px]`}>#</th>
                  <th className={thS}>Module / Function</th>
                  {[
                    [Crown, "Super Admin", "#f0a020"],
                    [UsersRound, "Admin", "#7a3fe0"],
                    [UserRound, "User", "#2f6fe0"],
                  ].map(([I, l, c]) => {
                    const Icon = I as LucideIcon;
                    return (
                      <th key={l as string} className={`${thS} text-center`}>
                        <span className="inline-flex items-center gap-[5px]"><Icon strokeWidth={2} style={{ color: c as string }} className="h-[15px] w-[15px]" />{l as string}</span>
                      </th>
                    );
                  })}
                </Thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r[0]} className="border-b border-[#eef0f5] last:border-0 [&>td]:py-0">
                      <td className={tdS}>{String(i + 1).padStart(2, "0")}</td>
                      <td className={`${tdS} font-semibold`}>{r[0]}</td>
                      <td className={`${tdS} text-center`}><LevelChip level="Full Access" /></td>
                      <td className={`${tdS} text-center`}><LevelChip level={r[1]} onClick={() => cycle(i, 1)} editing={editing} /></td>
                      <td className={`${tdS} text-center`}><LevelChip level={r[2]} onClick={() => cycle(i, 2)} editing={editing} /></td>
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            </Panel>
          </div>

          <Panel title="Recent Permission Changes" icon={History} className="min-h-0 lg:flex-1" action={<ViewLink to="Audit Logs" />} bodyClassName="pt-[4px]">
            <TableWrap>
              <Thead>
                {["#", "Change Detail", "Updated By", "Date & Time", "Status"].map((h) => (
                  <th key={h} className={thS}>{h}</th>
                ))}
              </Thead>
              <tbody>
                {changes.map((c, i) => (
                  <tr key={c.detail + c.at} className="border-b border-[#eef0f5] last:border-0">
                    <td className={tdS}>{String(i + 1).padStart(2, "0")}</td>
                    <td className={tdS}>{c.detail}</td>
                    <td className={tdS}><span className="flex items-center gap-[6px]"><UserRound strokeWidth={2} className="h-[14px] w-[14px]" />{c.by}</span></td>
                    <td className={tdS}><span className="flex items-center gap-[6px]"><CalendarDays strokeWidth={2} className="h-[14px] w-[14px]" />{c.at}</span></td>
                    <td className={tdS}><StatusPill className="h-[17px] w-[70px] gap-[4px] text-[11px]">Applied</StatusPill></td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Permission Legend" icon={Info} className="lg:h-[260px]" bodyClassName="flex flex-col justify-between pt-[6px]">
            {levels.map((l) => (
              <div key={l} className="flex items-center gap-[10px]">
                <span className="w-[100px] shrink-0"><LevelChip level={l} big /></span>
                <p className="text-[11.4px] font-medium leading-[1.25]">{levelStyle[l].desc}</p>
              </div>
            ))}
          </Panel>
          <Panel title="Quick Actions" icon={Zap} className="min-h-0 lg:flex-1" bodyClassName="pt-[6px]">
            <QuickList
              items={[
                { icon: UserPlus, label: "Create Role", onClick: () => notice.show("New role: name, scope and permission set — activates after approval (demo).") },
                { icon: Pencil, label: "Edit Permissions", color: "#f0a020", onClick: () => setEditing(true) },
                { icon: Copy, label: "Clone Access Set", color: "#7a3fe0", onClick: () => notice.show("Clone an access set into a new role (demo).") },
                { icon: Download, label: "Export Matrix", color: "#7a3fe0", onClick: () => notice.show("Permission matrix exported (demo).") },
                { icon: FileSearch, label: "Audit Changes", color: "#7a3fe0", onClick: () => notice.show("All permission changes are kept in the audit log (demo).") },
              ]}
            />
          </Panel>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function LevelChip({ level, onClick, editing = false, big = false }: { level: Level; onClick?: () => void; editing?: boolean; big?: boolean }) {
  const s = levelStyle[level];
  const cls = `inline-flex items-center justify-center gap-[5px] rounded-[6px] font-semibold leading-none ${big ? "h-[24px] w-[100px] text-[12.5px]" : "h-[14px] w-[96px] text-[10.4px]"} ${s.cls}`;
  const body = (
    <>
      <s.icon strokeWidth={2.2} className={big ? "h-[15px] w-[15px]" : "h-[11px] w-[11px]"} />
      {level}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} title={editing ? "Click to change" : undefined} className={`${cls} ${editing ? "cursor-pointer ring-1 ring-[#1d4fe0]/40 hover:brightness-95" : "cursor-default"}`}>
      {body}
    </button>
  ) : (
    <span className={cls}>{body}</span>
  );
}
