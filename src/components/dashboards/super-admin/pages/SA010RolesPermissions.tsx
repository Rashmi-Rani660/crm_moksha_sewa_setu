"use client";

/**
 * SA-010 — Roles & Permission Matrix.
 * Matched to the SA-010 reference design: 5 KPI tiles, 4 tabs, 9-column
 * module permissions matrix (Admin sample) on the left and access level
 * summary, scope & security, and effective access preview on the right.
 * Data: GET /crm/roles (profiles + grants), /crm/roles/catalogue (matrix rows), /crm/users/summary,
 * /crm/audit-logs (change history). Scope rules are enforced by the server and cannot be switched off.
 */

import { useState } from "react";
import type { AccessLevel } from "@/lib/api/auth";
import { qs, useCrmQuery } from "@/lib/api/useCrmQuery";
import { pad2, shortDateTime } from "@/lib/format";
import {
  Radio,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  Dropdown,
  KpiRow,
  KpiTile,
  KV,
  ModuleDropdown,
  PageHead,
  Panel,
  Pill,
  PrimaryButton,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  td,
  th,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const tabs = ["Permission Matrix", "Access Profiles", "Effective Access", "Change History"] as const;
type Tab = (typeof tabs)[number];

type Cell = "✓" | "Conditional" | "Scoped" | "Approval" | "Restricted" | "Independent" | "—";

const ACTIONS = ["view", "create", "edit", "approve", "export", "assign", "archive", "manage"] as const;
type ActionKey = (typeof ACTIONS)[number];
type PermRow = { module: string } & Record<ActionKey, Cell>;

type Grant = { module: string; action: string; scope: string; requiresApproval: boolean };
type RoleRow = { id: string; name: string; slug: string; accessLevel: AccessLevel; grants: Grant[]; updatedAt: string; userCount: number };
type Catalogue = { modules: { key: string; group: string; actions: { action: string }[] }[] };
type UserSummary = { total: number; activeByAccessLevel: Record<AccessLevel, number> };
type AuditRow = { id: string; at: string; summary: string };

const accessLevels = ["Admin", "Super Admin", "User"] as const;
const LEVEL: Record<(typeof accessLevels)[number], AccessLevel> = { Admin: "ADMIN", "Super Admin": "SUPER_ADMIN", User: "USER" };

/**
 * One matrix cell for a catalogue group (several modules): "✓" when every module of the group that
 * has the action grants it centre- or organisation-wide, "Scoped" for narrower grants,
 * "Conditional" when only some modules grant it, "Approval" when it is routed through an approval.
 */
function cellFor(grants: Grant[], groupModules: { key: string; actions: { action: string }[] }[], action: ActionKey): Cell {
  const withAction = groupModules.filter((m) => m.actions.some((a) => a.action === action)).map((m) => m.key);
  if (!withAction.length) return "—";
  const found = grants.filter((g) => withAction.includes(g.module) && g.action === action);
  if (!found.length) return "—";
  if (found.some((g) => g.requiresApproval)) return "Approval";
  if (found.length < withAction.length) return "Conditional";
  return found.every((g) => g.scope === "ORGANISATION" || g.scope === "CENTRE") ? "✓" : "Scoped";
}

const levelSummary: readonly (readonly [string, string])[] = [
  ["Super Admin", "Organisation-wide"],
  ["Admin", "Department / centre"],
  ["User", "Assigned records only"],
] as const;

const scopeChecks = [
  "Department scope enforced",
  "Centre scope enforced",
  "Record ownership enforced",
  "Mandatory MFA",
  "Prevent self-escalation",
  "Sensitive exports require approval",
] as const;


function CellValue({ value }: { value: Cell }) {
  if (value === "✓") {
    return (
      <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[4px] bg-[#d4f3d2] text-[15px] font-bold text-[#1c6b1f]">
        ✓
      </span>
    );
  }
  return <span className="text-[14px] font-medium text-[#3b4256]">{value}</span>;
}

export default function SA010RolesPermissions() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Permission Matrix");
  const [level, setLevel] = useState<(typeof accessLevels)[number]>("Admin");
  const [profileName, setProfile] = useState<string>("");

  const roles = useCrmQuery<RoleRow[]>(`/roles${qs({ accessLevel: LEVEL[level], status: "ACTIVE", limit: 50 })}`);
  const catalogue = useCrmQuery<Catalogue>("/roles/catalogue");
  const summary = useCrmQuery<UserSummary>("/users/summary");
  const history = useCrmQuery<AuditRow[]>(`/audit-logs${qs({ entityType: "CrmRole", limit: 10 })}`);

  const profiles = (roles.data ?? []).map((r) => r.name);
  const role = roles.data?.find((r) => r.name === profileName) ?? roles.data?.[0];
  const modules = catalogue.data?.modules ?? [];
  const groups = [...new Set(modules.map((m) => m.group))];
  const rows: PermRow[] = groups.map((group) => {
    const groupModules = modules.filter((m) => m.group === group);
    return { module: group, ...(Object.fromEntries(ACTIONS.map((a) => [a, cellFor(role?.grants ?? [], groupModules, a)])) as Record<ActionKey, Cell>) };
  });
  const financeApprove = role?.grants.find((g) => g.module === "finance" && g.action === "approve");
  const effective: readonly (readonly [string, string])[] = [
    ["Selected profile", role?.name ?? "—"],
    ["Users holding it", pad2(role?.userCount)],
    ["Finance approval", financeApprove ? (financeApprove.requiresApproval ? "Approval" : "Allowed") : "Restricted"],
    ["Last change", shortDateTime(role?.updatedAt)],
    ["Access review", "Independent approver"],
    ["Session revocation", "On access change"],
  ];
  const s = summary.data;

  const showMatrix = tab === "Permission Matrix" || tab === "Access Profiles";
  const showRight = tab === "Permission Matrix" || tab === "Access Profiles" || tab === "Effective Access";

  return (
    <SuperAdminFrame active="users-access-control">
      <PageHead
        light
        icon={Radio}
        iconTone="blue"
        title="Roles & Permission Matrix"
        links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
      >
        <ModuleDropdown current="SA-010" />
      </PageHead>

      <KpiRow cols={5}>
        <KpiTile tone="blue" icon={ShieldCheck} value="03" label="Access levels" sub="Fixed architecture" />
        <KpiTile tone="green" icon={Users} value={pad2(s?.total)} label="CRM users" sub="All accounts" />
        <KpiTile tone="orange" icon={Users} value={pad2(s?.activeByAccessLevel.SUPER_ADMIN)} label="Super Admin" sub="Organisation scope" />
        <KpiTile tone="purple" icon={Users} value={pad2(s?.activeByAccessLevel.ADMIN)} label="Admin" sub="Delegated scope" />
        <KpiTile tone="sky" icon={Users} value={pad2(s?.activeByAccessLevel.USER)} label="User" sub="Assigned work" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {tab === "Change History" ? (
          <Panel title="Change history" className="lg:min-h-0 lg:flex-1" bodyClassName="flex flex-col pt-[6px]">
            {(history.data ?? []).map((h) => (
              <KV key={h.id} k={h.summary} v={`${shortDateTime(h.at)} • Applied`} className="py-[6px]" />
            ))}
            {!history.data?.length && <p className="py-[6px] text-[15px] font-medium text-[#5b6280]">{history.loading ? "Loading…" : history.error ?? "No access profile changes recorded yet."}</p>}
          </Panel>
        ) : (
          <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[68fr_32fr] lg:[grid-template-rows:minmax(0,1fr)]">
            {showMatrix && (
              <Panel title={`Module permissions — ${role?.name ?? level}`} bodyClassName="flex flex-col gap-[8px] pt-[6px]">
                <div className="grid gap-[10px] sm:grid-cols-2">
                  <div>
                    <p className="mb-[2px] text-[15.5px] font-medium text-[#3b4256]">Access level</p>
                    <Dropdown label="Access level" value={level} options={accessLevels} onChange={(v) => { setLevel(v); setProfile(""); }} className="w-full" size={12.5} />
                  </div>
                  <div>
                    <p className="mb-[2px] text-[15.5px] font-medium text-[#3b4256]">Permission profile</p>
                    <Dropdown label="Permission profile" value={role?.name ?? "—"} options={profiles.length ? profiles : ["—"]} onChange={setProfile} className="w-full" size={12.5} />
                  </div>
                </div>

                <TableWrap className="min-h-0 flex-1 overflow-auto">
                  <Thead>
                    {["Module", "View", "Create", "Edit", "Approve", "Export", "Assign", "Archive", "Manage"].map((h) => (
<th key={h} className={`${th} px-[6px] py-[6px] text-[14px]`}>{h}</th>
                    ))}
                  </Thead>
                  <tbody>
                    {!rows.length && (
                      <tr>
                        <td colSpan={9} className="py-6 text-center text-[15px] font-medium text-[#5b6280]">{catalogue.loading || roles.loading ? "Loading…" : catalogue.error ?? roles.error ?? "No access profile for this level."}</td>
                      </tr>
                    )}
                    {rows.map((r) => (
                      <tr key={r.module}>
                        <td className={`${td} px-[6px] py-[6px] font-semibold`}>{r.module}</td>
                        <td className={`${td} px-[6px] py-[6px]`}><CellValue value={r.view} /></td>
                        <td className={`${td} px-[6px] py-[6px]`}><CellValue value={r.create} /></td>
                        <td className={`${td} px-[6px] py-[6px]`}><CellValue value={r.edit} /></td>
                        <td className={`${td} px-[6px] py-[6px]`}><CellValue value={r.approve} /></td>
                        <td className={`${td} px-[6px] py-[6px]`}><CellValue value={r.export} /></td>
                        <td className={`${td} px-[6px] py-[6px]`}><CellValue value={r.assign} /></td>
                        <td className={`${td} px-[6px] py-[6px]`}><CellValue value={r.archive} /></td>
                        <td className={`${td} px-[6px] py-[6px]`}><CellValue value={r.manage} /></td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>

                <div className="flex flex-wrap gap-[8px]">
                  <PrimaryButton onClick={() => notice.show(role?.slug === "super_admin" ? "The Super Admin profile is locked." : "Profile changes are made by a Super Admin and recorded in the change history; holders are signed out when their access changes.")}>
                    Submit changes for approval
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => setTab("Effective Access")}>
                    Preview effective access
                  </PrimaryButton>
                </div>

                <div className="flex flex-wrap items-center gap-[10px] rounded-[8px] border border-[#dce6f7] bg-[#f4f8ff] px-[10px] py-[6px] text-[15.5px] font-medium">
                  <span className="font-semibold text-[#1c6b1f]">✓ Allowed</span>
                  <span className="font-semibold text-[#8a5300]">Conditional / Approval</span>
                  <span className="font-semibold text-[#1d4fb8]">Scoped / Restricted</span>
                  <span className="font-semibold text-[#3b4256]">— Denied</span>
                  <span className="text-[#3b4256]">Changes require independent review. No self-escalation.</span>
                </div>
              </Panel>
            )}

            {showRight && (
              <div className="flex min-h-0 flex-col gap-[10px]">
                <Panel title="Access level summary" className="lg:min-h-0 lg:flex-[24_1_0]" bodyClassName="flex flex-col gap-[4px] pt-[4px]">
                  {levelSummary.map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="py-[3px]" />
                  ))}
                </Panel>

                <Panel title="Scope & security" className="lg:min-h-0 lg:flex-[42_1_0]" bodyClassName="flex flex-col justify-between py-[4px]">
                  {scopeChecks.map((label) => {
                    // Enforced by the server for every profile; shown, not switchable.
                    const on = true;
                    return (
                      <label
                        key={label}
                        className="flex cursor-pointer flex-col items-center justify-center gap-[2px] border-b border-[#eef0f5] py-[3px] text-center last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          readOnly
                          className="sr-only"
                        />
                        <span
                          className={`flex h-[13px] w-[13px] items-center justify-center rounded-[3px] border text-[13px] font-bold leading-none transition-colors ${
                            on
                              ? "border-[#cbd5e1] bg-[#cbd5e1] text-white"
                              : "border-[#cbd5e1] bg-white text-transparent"
                          }`}
                          aria-hidden
                        >
                          ✓
                        </span>
                        <span className="text-[15.5px] font-medium leading-tight text-[#1a1d36]">{label}</span>
                      </label>
                    );
                  })}
                </Panel>

                <Panel title="Effective access preview" className="lg:min-h-0 lg:flex-[34_1_0]" bodyClassName="flex flex-col gap-[3px] pt-[4px]">
                  {effective.map(([k, v]) => (
                    <KV
                      key={k}
                      k={k}
                      v={v === "Restricted" ? <Pill tone="blue" className="h-[18px] text-[14.5px]">{v}</Pill> : v}
                      className="py-[3px]"
                    />
                  ))}
                </Panel>
              </div>
            )}
          </div>
        )}
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
