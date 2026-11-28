"use client";

/**
 * SA-008 — Admin & User Management.
 * Rebuild matched to the SA-008 reference design: 6 KPI tiles, 5 tabs, the
 * admin & user register (wide table + action buttons) and a bottom row
 * (access & security, account lifecycle, user scope). Exactly three access
 * levels (designation is not an access level); mobile numbers are masked and
 * records are fictional; no direct deletion; MFA enforced, scope reviews,
 * session revocation and HRMS exit hand-over. Volunteers are managed
 * separately. Demo data only.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bell,
  CircleCheck,
  Layers,
  Radio,
  Users,
} from "lucide-react";
import {
  Dropdown,
  KpiRow,
  KpiTile,
  KV,
  ModuleDropdown,
  PageHead,
  Pager,
  Panel,
  Pill,
  PrimaryButton,
  SearchField,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  td,
  th,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

export const CREATE_USER_HREF = "/dashboard/super-admin/users-access-control/create";

const tabs = ["User list", "Permissions", "Account security", "Activity logs", "HRMS sync"] as const;
type Tab = (typeof tabs)[number];

type Role = "Super Admin" | "Admin" | "User";

type DemoUser = {
  id: string;
  hrms: string;
  name: string;
  mobile: string;
  dept: string;
  level: Role;
  reporting: string;
  centre: string;
  mfa: string;
  status: "Active" | "Inactive";
  login: string;
};

const departments = [
  "Operations & Sewa",
  "CSR & Partnerships",
  "Finance & Donations",
  "Communication & Outreach",
  "Volunteer Management",
  "IT, Automation & CRM",
  "Admin & Support Services",
];

const firstLogins = [
  "24 Nov, 10:12 AM",
  "24 Nov, 09:56 AM",
  "24 Nov, 09:40 AM",
  "24 Nov, 09:27 AM",
  "23 Nov, 06:12 PM",
  "23 Nov, 05:48 PM",
  "23 Nov, 04:20 PM",
  "20 Nov, 11:05 AM",
];

/** First eight rows as designed; the rest generated fictional (1 Super Admin, 12 Admin, 173 User, 24 inactive). */
const users: DemoUser[] = Array.from({ length: 186 }, (_, i) => {
  const n = i + 1;
  const level: Role = n === 1 ? "Super Admin" : n <= 13 || (n % 16 === 0 && n <= 160) ? "Admin" : "User";
  const inactive = n % 8 === 0 || n === 185;
  const day = 23 - Math.floor(i / 12);
  const login =
    i < 8
      ? firstLogins[i]
      : `${Math.max(day, 1)} Nov, ${String(((i * 7) % 12) + 1).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")} ${i % 2 ? "AM" : "PM"}`;
  const reporting = level === "Super Admin" ? "—" : level === "Admin" ? "Super Admin 01" : `Admin ${String((i % 12) + 1).padStart(2, "0")}`;
  return {
    id: `MS-U${String(n).padStart(4, "0")}`,
    hrms: `HR-E${String(1000 + n)}`,
    name: `Demo User ${String(n).padStart(2, "0")}`,
    mobile: `+91 •••••• ${String(n % 10000).padStart(4, "0")}`,
    dept: departments[i % departments.length],
    level,
    reporting,
    centre: "Ghaziabad",
    mfa: "Required",
    status: inactive ? "Inactive" : "Active",
    login,
  };
});

const levels = ["All access levels", "Super Admin", "Admin", "User"] as const;
const statuses = ["All Status", "Active", "Inactive"] as const;
const PER_PAGE = 8;

const levelTone = { "Super Admin": "purple", Admin: "blue", User: "gray" } as const;

const accessSecurity: readonly (readonly [string, string])[] = [
  ["Pending access requests", "03"],
  ["Active sessions", "48"],
  ["MFA", "Mandatory"],
  ["HRMS exit revocation", "Enforced"],
] as const;

const lifecycle: readonly (readonly [string, string])[] = [
  ["New account approval", "Independent review"],
  ["Role change", "Audited"],
  ["Suspension", "Reason required"],
  ["Exit handover", "Revoke access"],
] as const;

const scope: readonly (readonly [string, string])[] = [
  ["Super Admin", "Organisation control"],
  ["Admin", "Teams / centres"],
  ["User", "Assigned work"],
  ["Volunteers", "Separate app"],
] as const;

const activityLog = [
  { time: "10:12", text: "MS-U0001 signed in · new device verified", tone: "green" as const },
  { time: "09:56", text: "MS-U0004 role changed User → Admin · approved", tone: "blue" as const },
  { time: "09:40", text: "MS-U0008 account suspended · reason recorded", tone: "amber" as const },
  { time: "09:12", text: "HRMS sync · 2 accounts flagged for exit", tone: "purple" as const },
];

const hrmsRows: readonly (readonly [string, string])[] = [
  ["Last sync", "Today · 10:20"],
  ["Employees matched", "186 / 186"],
  ["New joiners pending", "02"],
  ["Exit revocations", "01 pending"],
  ["Sync mode", "Scheduled · hourly"],
] as const;

export default function SA008Users() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("User list");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<(typeof levels)[number]>("All access levels");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All Status");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (level === "All access levels" || u.level === level) &&
        (status === "All Status" || u.status === status) &&
        (!q || `${u.id} ${u.hrms} ${u.name} ${u.mobile}`.toLowerCase().includes(q)),
    );
  }, [query, level, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const filter = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const showRegister = tab === "User list" || tab === "Permissions" || tab === "Activity logs";
  const showAccess = tab === "User list" || tab === "Account security" || tab === "Permissions";
  const showLifecycle = tab === "User list" || tab === "Account security";
  const showScope = tab === "User list" || tab === "Permissions";
  const showActivity = tab === "Activity logs";
  const showHrms = tab === "HRMS sync";

  const mainPanel = showRegister;
  const bottomRow = showAccess || showLifecycle || showScope || showActivity || showHrms;
  const bottomCount = [showAccess, showLifecycle, showScope, showActivity, showHrms].filter(Boolean).length;

  return (
    <SuperAdminFrame active="users-access-control">
      <PageHead
        light
        icon={Radio}
        iconTone="blue"
        title="Admin & User Management"
        links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
      >
        <ModuleDropdown current="SA-008" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="186" label="Total accounts" sub="All levels" />
        <KpiTile tone="green" icon={Bell} value="162" label="Active" sub="Enabled" />
        <KpiTile tone="orange" icon={CircleCheck} value="24" label="Inactive" sub="Suspended" />
        <KpiTile tone="purple" icon={Users} value="01" label="Super Admin" sub="Org-wide" />
        <KpiTile tone="sky" icon={Layers} value="12" label="Admin" sub="Departments" />
        <KpiTile tone="green" icon={Radio} value="173" label="User" sub="Assigned work" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {/* Main — admin & user register */}
        {mainPanel && (
          <Panel
            title="Admin & user register"
            note={`(${filtered.length})`}
            className="lg:min-h-0 lg:flex-[376_1_0]"
            bodyClassName="flex flex-col px-[10px] pt-[8px]"
            action={
              <div className="hidden items-center gap-[8px] lg:flex">
                <SearchField value={query} onChange={filter(setQuery)} placeholder="Search by Name, CRM ID, Mobile..." className="w-[250px]" />
                <Dropdown label="Access level" value={level} options={levels} onChange={filter(setLevel)} className="w-[160px]" />
                <Dropdown label="Status" value={status} options={statuses} onChange={filter(setStatus)} className="w-[130px]" />
              </div>
            }
          >
            <div className="mb-[6px] flex flex-wrap gap-[8px] lg:hidden">
              <SearchField value={query} onChange={filter(setQuery)} placeholder="Search by Name, CRM ID, Mobile..." className="w-full" />
              <Dropdown label="Access level" value={level} options={levels} onChange={filter(setLevel)} className="w-[160px]" />
              <Dropdown label="Status" value={status} options={statuses} onChange={filter(setStatus)} className="w-[130px]" />
            </div>

            {tab === "User list" || tab === "Permissions" ? (
              <>
                <TableWrap>
                  <Thead>
                    {["CRM ID", "HRMS ID", "Name", "Mobile", "Department", "Level", "Reporting", "Centre", "MFA", "Status", "Last login"].map((h) => (
<th key={h} className={`${th} px-[5px] py-[5px] text-[15.8px]`}>{h}</th>
                    ))}
                  </Thead>
                  <tbody>
                    {rows.map((u) => (
                      <tr key={u.id} className="border-b border-[#eef0f5] last:border-0 hover:bg-[#f7f9ff]">
                        <td className={`${td} px-[5px] py-[5px] font-semibold`}>{u.id}</td>
                        <td className={`${td} px-[5px] py-[5px] text-[#3b4256]`}>{u.hrms}</td>
                        <td className={`${td} px-[5px] py-[5px] font-bold`}>{u.name}</td>
                        <td className={`${td} px-[5px] py-[5px]`}>{u.mobile}</td>
                        <td className={`${td} px-[5px] py-[5px]`}>{u.dept}</td>
                        <td className={`${td} px-[5px] py-[5px]`}>
                          <Pill tone={levelTone[u.level]} className="h-[18px] min-w-[74px] text-[14.5px]">
                            {u.level}
                          </Pill>
                        </td>
                        <td className={`${td} px-[5px] py-[5px]`}>{u.reporting}</td>
                        <td className={`${td} px-[5px] py-[5px]`}>{u.centre}</td>
                        <td className={`${td} px-[5px] py-[5px]`}>
                          <Pill tone="green" className="h-[18px] min-w-[58px] text-[14.5px]">
                            {u.mfa}
                          </Pill>
                        </td>
                        <td className={`${td} px-[5px] py-[5px]`}>
                          <StatusPill className="h-[18px] min-w-[62px] text-[14.5px]">{u.status}</StatusPill>
                        </td>
                        <td className={`${td} px-[5px] py-[5px] text-[15.5px]`}>{u.login}</td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan={11} className="py-6 text-center text-[15px] font-medium text-[#5b6280]">
                          No users match these filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </TableWrap>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-[8px] pt-[8px]">
                  <p className="text-[15.5px] font-medium text-[#3b4256]">
                    Showing {filtered.length ? (current - 1) * PER_PAGE + 1 : 0}–{(current - 1) * PER_PAGE + rows.length} of {filtered.length} · mobiles masked · no direct deletion
                  </p>
                  <Pager page={current} pages={pages} onChange={setPage} />
                </div>

                <div className="mt-[8px] flex flex-wrap gap-[8px] border-t border-[#eef0f5] pt-[8px]">
                  <Link href={CREATE_USER_HREF}>
                    <PrimaryButton>Create user</PrimaryButton>
                  </Link>
                  <PrimaryButton outline onClick={() => notice.show("Edit access: role changes need independent approval (demo).")}>
                    Edit access
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => notice.show("Suspend account: reason required, sessions revoked (demo).")}>
                    Suspend account
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => notice.show("View audit opened (demo).")}>
                    View audit
                  </PrimaryButton>
                </div>
              </>
            ) : tab === "Activity logs" ? (
              <div className="flex flex-col gap-[8px] pt-[4px]">
                {activityLog.map((a) => (
                  <div key={a.time + a.text} className="flex items-center gap-[10px] rounded-[8px] border border-[#eef0f5] bg-[#f8faff] px-[12px] py-[8px]">
                    <Pill tone={a.tone} className="h-[20px] min-w-[48px] text-[15px]">
                      {a.time}
                    </Pill>
                    <span className="min-w-0 flex-1 text-[15px] font-semibold">{a.text}</span>
                  </div>
                ))}
                <p className="pt-[4px] text-[15.5px] font-medium text-[#5b6280]">All security events are retained in the audit trail.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-[6px] pt-[4px]">
                {hrmsRows.map(([k, v]) => (
                  <KV key={k} k={k} v={v} className="border-b border-[#eef0f5] py-[5px] last:border-0" />
                ))}
                <div className="pt-[8px]">
                  <PrimaryButton onClick={() => notice.show("HRMS sync started (demo).")}>
                    Sync now
                  </PrimaryButton>
                </div>
              </div>
            )}
          </Panel>
        )}

        {/* Bottom row — access & security, account lifecycle, user scope */}
        {bottomRow && (
          <div
            className={`grid gap-[10px] lg:min-h-0 lg:flex-[230_1_0] ${
              bottomCount >= 3 ? "lg:grid-cols-3" : bottomCount === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1"
            } lg:[grid-template-rows:minmax(0,1fr)]`}
          >
            {showAccess && (
              <Panel title="Access & security" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col">
                  {accessSecurity.map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="border-b border-[#eef0f5] py-[5px] last:border-0" />
                  ))}
                </div>
              </Panel>
            )}

            {showLifecycle && (
              <Panel title="Account lifecycle" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col">
                  {lifecycle.map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="border-b border-[#eef0f5] py-[5px] last:border-0" />
                  ))}
                </div>
              </Panel>
            )}

            {showScope && (
              <Panel title="User scope" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col">
                  {scope.map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="border-b border-[#eef0f5] py-[5px] last:border-0" />
                  ))}
                </div>
              </Panel>
            )}

            {showActivity && (
              <Panel title="Security events" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col gap-[6px]">
                  {activityLog.slice(0, 3).map((a) => (
                    <div key={a.time + a.text} className="text-[14.5px] font-semibold leading-tight">
                      <Pill tone={a.tone} className="mr-[6px] h-[18px] min-w-[44px] text-[14.5px]">
                        {a.time}
                      </Pill>
                      {a.text}
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {showHrms && (
              <Panel title="HRMS integration" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col">
                  {hrmsRows.slice(0, 4).map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="border-b border-[#eef0f5] py-[5px] last:border-0" />
                  ))}
                </div>
              </Panel>
            )}
          </div>
        )}
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
