"use client";

/**
 * SA-009 — Create User & Assign Access.
 * Matched to the SA-009 reference design: 6 KPI tiles, 4 tabs, top row of 3
 * panels (employee details, access assignment, mandatory account security) and
 * bottom row (module permissions, activation & training).
 *
 * Data: the employee comes from the CMS staff directory (GET /crm/users/cms-lookup, HRMS fields
 * read-only), the access profile from GET /crm/roles, the permission preview from the profile's
 * grants; Save draft / Submit call POST /crm/users (activation always needs independent approval).
 */

import { useMemo, useRef, useState, type ReactNode } from "react";
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
import type { AccessLevel } from "@/lib/api/auth";
import { authorizedRequest } from "@/lib/api/authorized";
import { errorMessage } from "@/lib/api/client";
import { qs, useCrmQuery } from "@/lib/api/useCrmQuery";
import { useAuthSession } from "@/lib/auth/session";
import { useCrmAccess } from "@/lib/api/useCrmAccess";
import { ACCESS_LEVEL_LABEL, clock, shortDate } from "@/lib/format";

const tabs = ["Create user", "Permission preview", "Centre access", "Audit history"] as const;
type Tab = (typeof tabs)[number];

const accessLevels = ["User", "Admin", "Super Admin"] as const;
const LEVEL: Record<(typeof accessLevels)[number], AccessLevel> = { User: "USER", Admin: "ADMIN", "Super Admin": "SUPER_ADMIN" };
/** The seeded access profile used for each level (more profiles: SA-010). */
const DEFAULT_PROFILE: Record<AccessLevel, string> = { USER: "operations_user", ADMIN: "operations_admin", SUPER_ADMIN: "super_admin" };

/** Access review is due 90 days after creation. */
const REVIEW_DAYS = 90;

const securityRows: readonly { label: string; value: string; pill?: boolean }[] = [
  { label: "Mobile verification", value: "Required • locked" },
  { label: "Password + MFA", value: "Required • locked" },
  { label: "New device verification", value: "Required • locked" },
  { label: "Session monitoring", value: "Required", pill: true },
  { label: "Audit trail", value: "Required", pill: true },
  { label: "HRMS exit revocation", value: "Required", pill: true },
];

/** Rows of the permission preview: label → catalogue module(s). */
const PERM_MODULES: readonly { label: string; modules: string[] }[] = [
  { label: "Sewa requests", modules: ["requests"] },
  { label: "Cases & tasks", modules: ["cases", "tasks"] },
  { label: "Official communication", modules: ["communication"] },
  { label: "Finance", modules: ["finance"] },
  { label: "Reports", modules: ["reports"] },
];

const activation: readonly (readonly [string, string])[] = [
  ["Role-wise training", "Auto assign"],
  ["Account invitation", "After approval"],
  ["Training qualification", "Before sensitive work"],
  ["Access review", `Every ${REVIEW_DAYS} days`],
  ["Remarks", "Required for exceptions"],
] as const;

const pipeline = ["Draft", "Review", "Activate"] as const;

type StaffRow = {
  cmsUserId: string;
  name: string;
  mobileMasked: string;
  email?: string;
  employeeId?: string;
  designation?: string;
  department?: string;
  linkedCrmUser?: { id: string; crmId: string };
};
type RoleRow = { id: string; slug: string; name: string; accessLevel: AccessLevel; grants: { module: string; action: string; scope: string }[] };
type CentreRow = { id: string; code: string; name: string };
type AuditRow = { id: string; at: string; summary: string; entityLabel?: string; actor: { name: string } };

const staffLabel = (s: StaffRow) => `${s.employeeId ?? "No emp. id"} • ${s.name}${s.linkedCrmUser ? ` (CRM ${s.linkedCrmUser.crmId})` : ""}`;

/** Grant scope → the wording of the design ("Yes", "Assigned", "Own", "No"). */
function cell(grants: RoleRow["grants"] | undefined, modules: string[], action: string): string {
  const g = grants?.find((x) => modules.includes(x.module) && x.action === action);
  if (!g) return "No";
  return g.scope === "OWN" ? "Own" : g.scope === "ASSIGNED" ? "Assigned" : "Yes";
}

export default function SA009CreateUser() {
  const notice = useNotice();
  const { session } = useAuthSession();
  const access = useCrmAccess();
  const saving = useRef(false);
  const [tab, setTab] = useState<Tab>("Create user");
  const [employeeLabel, setEmployeeLabel] = useState<string>("");
  const [level, setLevel] = useState<(typeof accessLevels)[number]>("User");
  const [state, setState] = useState<"Draft" | "Pending approval" | "Submitted">("Pending approval");
  const [busy, setBusy] = useState(false);

  const staff = useCrmQuery<StaffRow[]>(`/users/cms-lookup${qs({ limit: 100 })}`);
  const roles = useCrmQuery<RoleRow[]>(`/roles${qs({ status: "ACTIVE", accessLevel: LEVEL[level], limit: 50 })}`);
  const centres = useCrmQuery<CentreRow[]>(`/geography/centres${qs({ status: "ACTIVE", limit: 50 })}`);
  const audit = useCrmQuery<AuditRow[]>(`/audit-logs${qs({ entityType: "CrmUser", action: "user.", limit: 6 })}`);

  const staffRows = useMemo(() => staff.data ?? [], [staff.data]);
  const employees = staffRows.map(staffLabel);
  const employee = staffRows.find((s) => staffLabel(s) === employeeLabel) ?? staffRows[0];
  const role = roles.data?.find((r) => r.slug === DEFAULT_PROFILE[LEVEL[level]]) ?? roles.data?.[0];
  const centre = centres.data?.[0];
  const [reviewDue] = useState(() => new Date(Date.now() + REVIEW_DAYS * 86_400_000).toISOString());

  const permRows = PERM_MODULES.map((m) => ({
    module: m.label,
    view: cell(role?.grants, m.modules, "view"),
    create: cell(role?.grants, m.modules, "create"),
    edit: cell(role?.grants, m.modules, "edit"),
    approve: cell(role?.grants, m.modules, "approve"),
  }));

  const showCreate = tab === "Create user" || tab === "Centre access";
  const showPerm = tab === "Create user" || tab === "Permission preview";
  const showActivation = tab === "Create user";
  const showAudit = tab === "Audit history";

  async function save(submitForApproval: boolean) {
    if (busy) return;
    if (!employee) return notice.show(staff.loading ? "Loading the staff directory…" : "No CMS staff record is available to link.");
    if (employee.linkedCrmUser) return notice.show(`${employee.name} already has CRM account ${employee.linkedCrmUser.crmId}.`);
    if (!role) return notice.show(`No active access profile exists for ${level} access.`);
    if (!centre) return notice.show("No active service centre is configured.");
    const reason = window.prompt(submitForApproval ? "Reason for this access request (required):" : "Note for this draft (required):")?.trim();
    if (!reason || reason.length < 5) return notice.show("Give a reason of at least 5 characters.");
    if (saving.current || !access.can("users.create")) return;
    saving.current = true;
    setBusy(true);
    try {
      await authorizedRequest("/users", {
        body: {
          source: "CMS",
          cmsUserId: employee.cmsUserId,
          passwordMode: "CMS",
          accessLevel: LEVEL[level],
          roleId: role.id,
          centreIds: [centre.id],
          reviewDueAt: reviewDue,
          submitForApproval,
          reason,
        },
      });
      setState(submitForApproval ? "Submitted" : "Draft");
      notice.show(submitForApproval ? `${employee.name} was created and sent for independent approval.` : `Draft saved for ${employee.name}.`);
      staff.reload();
      audit.reload();
    } catch (err) {
      notice.show(errorMessage(err));
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  return (
    <SuperAdminFrame active="users-access-control">
      <PageHead
        light
        icon={Radio}
        iconTone="blue"
        title="Create User & Assign Access"
        links={["Super Admin", "FY 2026–27", centre?.name ?? "—"]}
      >
        <ModuleDropdown current="SA-009" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="03" label="Access levels" sub="Fixed architecture" />
        <KpiTile tone="green" icon={Bell} value="HRMS" label="HRMS source" sub="Read-only" />
        <KpiTile tone="orange" icon={CircleCheck} value="Verified" label="Mobile" sub="Login identifier" />
        <KpiTile tone="purple" icon={Users} value="Required" label="MFA" sub="Password + OTP" />
        <KpiTile tone="sky" icon={Layers} value="Approval" label="Activation" sub="Independent review" />
        <KpiTile tone="green" icon={Radio} value="Assigned" label="Training" sub="Role-based" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {/* Top row — 3 panels */}
        {showCreate && (
          <div className="grid gap-[10px] lg:min-h-0 lg:flex-[315_1_0] lg:grid-cols-3 lg:[grid-template-rows:minmax(0,1fr)]">
            <Panel title="Employee details" note="• HRMS read-only" bodyClassName="flex flex-col gap-[6px] pt-[4px]">
              <div className="grid grid-cols-2 gap-[8px]">
                <Field label="Employee">
                  {employees.length ? (
                    <Dropdown label="Employee" value={employee ? staffLabel(employee) : employees[0]} options={employees} onChange={setEmployeeLabel} className="w-full" size={12} />
                  ) : (
                    <ReadOnly value={staff.loading ? "Loading…" : staff.error ?? "No CMS staff found"} />
                  )}
                </Field>
                <Field label="Full name">
                  <ReadOnly value={employee?.name ?? "—"} />
                </Field>
                <Field label="Verified mobile">
                  <ReadOnly value={employee ? `+91 ${employee.mobileMasked}` : "—"} />
                </Field>
                <Field label="Official email">
                  <ReadOnly value={employee?.email ?? "—"} />
                </Field>
                <Field label="Designation">
                  <ReadOnly value={employee?.designation ?? "—"} />
                </Field>
                <Field label="Department">
                  <ReadOnly value={employee?.department ?? "—"} />
                </Field>
              </div>
              <div className="mt-auto flex flex-wrap gap-[8px] pt-[6px]">
                <PrimaryButton onClick={() => staff.reload()}>
                  Select from HRMS
                </PrimaryButton>
                <PrimaryButton outline onClick={() => { staff.reload(); notice.show("Staff directory refreshed from the CMS."); }}>
                  Refresh HRMS
                </PrimaryButton>
              </div>
            </Panel>

            <Panel title="Access assignment" bodyClassName="flex flex-col gap-[6px] pt-[4px]">
              <Field label="Access level">
                <Dropdown label="Access level" value={level} options={accessLevels} onChange={setLevel} className="w-full" size={12.5} />
              </Field>
              <div className="grid grid-cols-2 gap-[8px]">
                <Field label="Reporting authority">
                  <ReadOnly value={session?.name ?? "—"} />
                </Field>
                <Field label="Service centre">
                  <ReadOnly value={centre?.name ?? (centres.loading ? "Loading…" : "—")} />
                </Field>
                <Field label="Validity / review">
                  <ReadOnly value={`Review ${shortDate(reviewDue)}`} />
                </Field>
                <Field label="Activation status">
                  <ReadOnly value={state} />
                </Field>
              </div>
              <p className="mt-auto pt-[4px] text-[15.5px] font-medium text-[#3b4256]">
                {role ? `Access profile: ${role.name} (${ACCESS_LEVEL_LABEL[role.accessLevel]}). ` : ""}Elevated access requires independent approval.
              </p>
            </Panel>

            <Panel title="Mandatory account security" bodyClassName="flex flex-col pt-[4px]">
              <div className="flex flex-col">
                {securityRows.map((r) => (
                  <KV
                    key={r.label}
                    k={r.label}
                    v={r.pill ? <Pill tone="green" className="h-[18px] text-[14.5px]">{r.value}</Pill> : r.value}
                    className="py-[4px]"
                  />
                ))}
              </div>
              <p className="mt-[6px] text-[15px] font-medium text-[#3b4256]">
                Password reset on compromise; no arbitrary periodic expiry.
              </p>
              <div className="mt-auto rounded-[8px] border border-[#dce6f7] bg-[#f4f8ff] px-[10px] py-[6px] text-[15.5px] font-semibold text-[#0b0c36]">
                MFA enforced - independent elevation approval
              </div>
            </Panel>
          </div>
        )}

        {/* Bottom row — module permissions + activation & training */}
        {(showPerm || showActivation || showAudit) && (
          <div
            className={`grid gap-[10px] lg:min-h-0 lg:flex-[260_1_0] ${
              showPerm && showActivation ? "lg:grid-cols-[54fr_46fr]" : "lg:grid-cols-1"
            } lg:[grid-template-rows:minmax(0,1fr)]`}
          >
            {showPerm && (
              <Panel title="Module permissions" note="• least privilege" bodyClassName="flex flex-col pt-[4px]">
                <TableWrap>
                  <Thead>
                    {["Module", "View", "Create", "Edit", "Approve"].map((h) => (
<th key={h} className={`${th} px-[6px] py-[5px] text-[14px]`}>{h}</th>
                    ))}
                  </Thead>
                  <tbody>
                    {permRows.map((r) => (
                      <tr key={r.module}>
                        <td className={`${td} px-[6px] py-[5px] font-semibold`}>{r.module}</td>
                        <td className={`${td} px-[6px] py-[5px]`}>{r.view}</td>
                        <td className={`${td} px-[6px] py-[5px]`}>{r.create}</td>
                        <td className={`${td} px-[6px] py-[5px]`}>{r.edit}</td>
                        <td className={`${td} px-[6px] py-[5px]`}>{r.approve}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                <div className="mt-auto pt-[6px]">
                  <PrimaryButton onClick={() => setTab("Permission preview")}>
                    Preview effective access
                  </PrimaryButton>
                </div>
              </Panel>
            )}

            {showActivation && (
              <Panel title="Activation & training" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col">
                  {activation.map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="py-[4px]" />
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-[8px] pt-[8px]">
                  <PrimaryButton disabled={busy || !access.can("users.create")} onClick={() => save(false)}>
                    Save draft
                  </PrimaryButton>
                  <PrimaryButton outline disabled={busy || !access.can("users.create")} onClick={() => save(true)}>
                    Submit for approval
                  </PrimaryButton>
                  <div className="ml-auto flex items-center gap-[5px]">
                    {pipeline.map((p) => (
                      <Pill key={p} tone="gray" className="h-[20px] px-[8px] text-[15px]">
                        {p}
                      </Pill>
                    ))}
                  </div>
                </div>
              </Panel>
            )}

            {showAudit && (
              <Panel title="Audit history" bodyClassName="flex flex-col pt-[4px]">
                {(audit.data ?? []).map((a) => (
                  <KV key={a.id} k={clock(a.at)} v={`${a.entityLabel ? `${a.entityLabel} • ` : ""}${a.summary} (${a.actor.name})`} className="py-[5px]" />
                ))}
                {!audit.data?.length && <p className="py-[5px] text-[15px] font-medium text-[#5b6280]">{audit.loading ? "Loading…" : audit.error ?? "No account changes recorded yet."}</p>}
              </Panel>
            )}
          </div>
        )}
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="mb-[2px] text-[15.5px] font-medium text-[#3b4256]">{label}</p>
      {children}
    </div>
  );
}

function ReadOnly({ value }: { value: string }) {
  return (
    <input
      readOnly
      value={value}
      aria-label={value}
      className="h-[30px] w-full rounded-[7px] border border-[#d6dbe6] bg-[#f8fafc] px-[9px] text-[14.5px] font-medium text-[#0b0c36] outline-none"
    />
  );
}
