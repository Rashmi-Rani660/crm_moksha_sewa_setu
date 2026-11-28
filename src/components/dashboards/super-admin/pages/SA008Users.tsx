"use client";

/**
 * SA-008 — Admin & User Management.
 * Rebuild matched to the SA-008 reference design: 6 KPI tiles, 5 tabs, the
 * admin & user register (wide table + action buttons) and a bottom row
 * (access & security, account lifecycle, user scope). Exactly three access
 * levels (designation is not an access level); mobile numbers are masked and
 * records are fictional; no direct deletion; MFA enforced, scope reviews,
 * session revocation and HRMS exit hand-over. Volunteers are managed
 * separately. Data: GET /crm/users, /crm/users/summary, /crm/audit-logs.
 */

import Link from "next/link";
import { useState } from "react";
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
import type { AccessLevel } from "@/lib/api/auth";
import { authorizedRequest } from "@/lib/api/authorized";
import { errorMessage } from "@/lib/api/client";
import { qs, useCrmQuery, useDebounced } from "@/lib/api/useCrmQuery";
import { ACCESS_LEVEL_LABEL, clock, humanize, pad2, shortDateTime } from "@/lib/format";

export const CREATE_USER_HREF = "/dashboard/super-admin/users-access-control/create";

const tabs = ["User list", "Permissions", "Account security", "Activity logs", "HRMS sync"] as const;
type Tab = (typeof tabs)[number];

const levels = ["All access levels", "Super Admin", "Admin", "User"] as const;
const statuses = ["All Status", "Active", "Inactive"] as const;
const PER_PAGE = 8;

const levelTone = { "Super Admin": "purple", Admin: "blue", User: "gray" } as const;

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

const LEVEL_PARAM: Record<(typeof levels)[number], AccessLevel | undefined> = {
  "All access levels": undefined,
  "Super Admin": "SUPER_ADMIN",
  Admin: "ADMIN",
  User: "USER",
};

/** Rows of GET /crm/users (mobiles arrive masked from the server). */
type UserRow = {
  id: string;
  crmId: string;
  employeeId?: string;
  name: string;
  mobileMasked: string;
  department: { name: string } | null;
  reportingTo: { name: string } | null;
  accessLevel: AccessLevel;
  centres: { name: string }[];
  status: string;
  version?: number;
  lastLoginAt?: string;
};

type UserSummary = {
  total: number;
  active: number;
  draft: number;
  pendingApproval: number;
  suspended: number;
  exited: number;
  activeByAccessLevel: Record<AccessLevel, number>;
  linkedToCms: number;
  activeSessions: number;
  pendingAccessRequests: number;
};

type AuditRow = { id: string; at: string; action: string; summary: string; entityLabel?: string };

const auditTone = (action: string) =>
  action.includes("suspend") || action.includes("exit") ? ("amber" as const) : action.includes("access") || action.includes("approved") ? ("blue" as const) : action.includes("created") || action.includes("activated") ? ("green" as const) : ("purple" as const);

export default function SA008Users() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("User list");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<(typeof levels)[number]>("All access levels");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All Status");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const search = useDebounced(query.trim());

  const list = useCrmQuery<UserRow[]>(
    `/users${qs({ page, limit: PER_PAGE, sort: "crmId", search: search.length >= 2 ? search : undefined, accessLevel: LEVEL_PARAM[level], inactive: status === "All Status" ? undefined : status === "Inactive" })}`,
  );
  const summary = useCrmQuery<UserSummary>("/users/summary");
  const audit = useCrmQuery<AuditRow[]>(`/audit-logs${qs({ entityType: "CrmUser", limit: 8 })}`);

  const rows = list.data ?? [];
  const total = list.meta?.total ?? 0;
  const pages = list.meta?.totalPages ?? 1;
  const current = Math.min(page, pages);
  const filtered = { length: total };
  const filter = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const s = summary.data;
  const accessSecurity: readonly (readonly [string, string])[] = [
    ["Pending access requests", pad2(s?.pendingAccessRequests)],
    ["Active sessions", pad2(s?.activeSessions)],
    // Password + OTP on every sign-in, new-device verification: cannot be switched off.
    ["MFA", "Mandatory"],
    ["HRMS exit revocation", "Enforced"],
  ];
  const hrmsRows: readonly (readonly [string, string])[] = [
    ["Source", "CMS staff directory"],
    ["Employees linked", s ? `${s.linkedToCms} / ${s.total}` : "—"],
    ["New joiners pending", pad2(s ? s.pendingApproval + s.draft : undefined)],
    ["Exited accounts", pad2(s?.exited)],
    ["Sync mode", "On demand · per account"],
  ];
  const activityLog = (audit.data ?? []).map((a) => ({ time: clock(a.at), text: `${a.entityLabel ? `${a.entityLabel} · ` : ""}${a.summary}`, tone: auditTone(a.action) }));

  async function suspendSelected() {
    if (!selected) return notice.show("Select a user in the register first.");
    if (selected.status !== "ACTIVE") return notice.show("Only an active account can be suspended.");
    const reason = window.prompt(`Reason for suspending ${selected.name} (required):`)?.trim();
    if (!reason) return;
    try {
      const detail = await authorizedRequest<{ version: number }>(`/users/${selected.id}`);
      await authorizedRequest(`/users/${selected.id}/suspend`, { body: { version: detail.data.version, reason } });
      notice.show(`${selected.name} suspended; their sessions were signed out.`);
      setSelected(null);
      list.reload();
      summary.reload();
      audit.reload();
    } catch (err) {
      notice.show(errorMessage(err));
    }
  }

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
        <KpiTile tone="blue" icon={Radio} value={pad2(s?.total)} label="Total accounts" sub="All levels" />
        <KpiTile tone="green" icon={Bell} value={pad2(s?.active)} label="Active" sub="Enabled" />
        <KpiTile tone="orange" icon={CircleCheck} value={pad2(s ? s.total - s.active : undefined)} label="Inactive" sub="Suspended" />
        <KpiTile tone="purple" icon={Users} value={pad2(s?.activeByAccessLevel.SUPER_ADMIN)} label="Super Admin" sub="Org-wide" />
        <KpiTile tone="sky" icon={Layers} value={pad2(s?.activeByAccessLevel.ADMIN)} label="Admin" sub="Departments" />
        <KpiTile tone="green" icon={Radio} value={pad2(s?.activeByAccessLevel.USER)} label="User" sub="Assigned work" />
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
                      <tr key={u.id} onClick={() => setSelected(u)} aria-selected={selected?.id === u.id} className={`cursor-pointer border-b border-[#eef0f5] last:border-0 hover:bg-[#f7f9ff] ${selected?.id === u.id ? "bg-[#f7f9ff]" : ""}`}>
                        <td className={`${td} px-[5px] py-[5px] font-semibold`}>{u.crmId}</td>
                        <td className={`${td} px-[5px] py-[5px] text-[#3b4256]`}>{u.employeeId ?? "—"}</td>
                        <td className={`${td} px-[5px] py-[5px] font-bold`}>{u.name}</td>
                        <td className={`${td} px-[5px] py-[5px]`}>+91 {u.mobileMasked}</td>
                        <td className={`${td} px-[5px] py-[5px]`}>{u.department?.name ?? "—"}</td>
                        <td className={`${td} px-[5px] py-[5px]`}>
                          <Pill tone={levelTone[ACCESS_LEVEL_LABEL[u.accessLevel]]} className="h-[18px] min-w-[74px] text-[14.5px]">
                            {ACCESS_LEVEL_LABEL[u.accessLevel]}
                          </Pill>
                        </td>
                        <td className={`${td} px-[5px] py-[5px]`}>{u.reportingTo?.name ?? "—"}</td>
                        <td className={`${td} px-[5px] py-[5px]`}>{u.centres.map((c) => c.name).join(", ") || "—"}</td>
                        <td className={`${td} px-[5px] py-[5px]`}>
                          <Pill tone="green" className="h-[18px] min-w-[58px] text-[14.5px]">
                            Required
                          </Pill>
                        </td>
                        <td className={`${td} px-[5px] py-[5px]`}>
                          <StatusPill className="h-[18px] min-w-[62px] text-[14.5px]">{humanize(u.status)}</StatusPill>
                        </td>
                        <td className={`${td} px-[5px] py-[5px] text-[15.5px]`}>{shortDateTime(u.lastLoginAt)}</td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan={11} className="py-6 text-center text-[15px] font-medium text-[#5b6280]">
                          {list.loading ? "Loading…" : list.error ?? "No users match these filters."}
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
                  <PrimaryButton outline onClick={() => notice.show(selected ? `Access changes for ${selected.name} are submitted for independent approval.` : "Select a user in the register first.")}>
                    Edit access
                  </PrimaryButton>
                  <PrimaryButton outline onClick={suspendSelected}>
                    Suspend account
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => setTab("Activity logs")}>
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
                  <PrimaryButton onClick={() => { summary.reload(); notice.show("HRMS details are refreshed per account from the CMS staff record."); }}>
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
