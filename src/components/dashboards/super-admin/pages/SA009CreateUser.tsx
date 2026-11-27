"use client";

/**
 * SA-009 — Create User & Assign Access.
 * Matched to the SA-009 reference design: 6 KPI tiles, 4 tabs, top row of 3
 * panels (employee details, access assignment, mandatory account security) and
 * bottom row (module permissions, activation & training). Demo data only.
 */

import { useState, type ReactNode } from "react";
import {
  Bell,
  CircleCheck,
  Layers,
  Radio,
  Users,
} from "lucide-react";
import {
  CentreDropdown,
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

const tabs = ["Create user", "Permission preview", "Centre access", "Audit history"] as const;
type Tab = (typeof tabs)[number];

const employees = [
  "E-0004 • Demo employee 04",
  "E-0005 • Demo employee 05",
  "E-0006 • Demo employee 06",
] as const;

const accessLevels = ["User", "Admin", "Super Admin"] as const;

const securityRows: readonly { label: string; value: string; pill?: boolean }[] = [
  { label: "Mobile verification", value: "Required • locked" },
  { label: "Password + MFA", value: "Required • locked" },
  { label: "New device verification", value: "Required • locked" },
  { label: "Session monitoring", value: "Required", pill: true },
  { label: "Audit trail", value: "Required", pill: true },
  { label: "HRMS exit revocation", value: "Required", pill: true },
];

const permRows: readonly { module: string; view: string; create: string; edit: string; approve: string }[] = [
  { module: "Sewa requests", view: "Yes", create: "Yes", edit: "Assigned", approve: "No" },
  { module: "Cases & tasks", view: "Assigned", create: "No", edit: "Assigned", approve: "No" },
  { module: "Official communication", view: "Assigned", create: "Yes", edit: "Assigned", approve: "No" },
  { module: "Finance", view: "No", create: "No", edit: "No", approve: "No" },
  { module: "Reports", view: "Own", create: "No", edit: "No", approve: "No" },
];

const activation: readonly (readonly [string, string])[] = [
  ["Role-wise training", "Auto assign"],
  ["Account invitation", "After approval"],
  ["Training qualification", "Before sensitive work"],
  ["Access review", "Scheduled"],
  ["Remarks", "Required for exceptions"],
] as const;

const pipeline = ["Draft", "Review", "Activate"] as const;

export default function SA009CreateUser() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Create user");
  const [employee, setEmployee] = useState<(typeof employees)[number]>(employees[0]);
  const [level, setLevel] = useState<(typeof accessLevels)[number]>("User");
  const [submitted, setSubmitted] = useState(false);

  const showCreate = tab === "Create user" || tab === "Centre access";
  const showPerm = tab === "Create user" || tab === "Permission preview";
  const showActivation = tab === "Create user";
  const showAudit = tab === "Audit history";

  const fullName = employee.split("• ")[1] ?? "Demo employee 04";

  return (
    <SuperAdminFrame active="users-access-control">
      <PageHead
        light
        icon={Radio}
        iconTone="blue"
        title="Create User & Assign Access"
        links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
      >
        <ModuleDropdown current="SA-009" />
        <CentreDropdown className="w-[165px]" />
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
                  <Dropdown label="Employee" value={employee} options={employees} onChange={setEmployee} className="w-full" size={12} />
                </Field>
                <Field label="Full name">
                  <ReadOnly value={fullName} />
                </Field>
                <Field label="Verified mobile">
                  <ReadOnly value="+91 •••••• 0004" />
                </Field>
                <Field label="Official email">
                  <ReadOnly value="demo04@example.invalid" />
                </Field>
                <Field label="Designation">
                  <ReadOnly value="Operations Executive" />
                </Field>
                <Field label="Department">
                  <ReadOnly value="Operations & Sewa" />
                </Field>
              </div>
              <div className="mt-auto flex flex-wrap gap-[8px] pt-[6px]">
                <PrimaryButton onClick={() => notice.show("Selected from HRMS — fields are read-only (demo).")}>
                  Select from HRMS
                </PrimaryButton>
                <PrimaryButton outline onClick={() => notice.show("Refreshed from HRMS (demo).")}>
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
                  <ReadOnly value="Admin 01" />
                </Field>
                <Field label="Service centre">
                  <ReadOnly value="Ghaziabad" />
                </Field>
                <Field label="Validity / review">
                  <ReadOnly value="Review 26 Feb 2027" />
                </Field>
                <Field label="Activation status">
                  <ReadOnly value={submitted ? "Submitted" : "Pending approval"} />
                </Field>
              </div>
              <p className="mt-auto pt-[4px] text-[11.5px] font-medium text-[#3b4256]">
                Elevated access requires independent approval and passkey.
              </p>
            </Panel>

            <Panel title="Mandatory account security" bodyClassName="flex flex-col pt-[4px]">
              <div className="flex flex-col">
                {securityRows.map((r) => (
                  <KV
                    key={r.label}
                    k={r.label}
                    v={r.pill ? <Pill tone="green" className="h-[18px] text-[10.5px]">{r.value}</Pill> : r.value}
                    className="py-[4px]"
                  />
                ))}
              </div>
              <p className="mt-[6px] text-[11px] font-medium text-[#3b4256]">
                Password reset on compromise; no arbitrary periodic expiry.
              </p>
              <div className="mt-auto rounded-[8px] border border-[#dce6f7] bg-[#f4f8ff] px-[10px] py-[6px] text-[11.5px] font-semibold text-[#0b0c36]">
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
                    {["Module", "View", "Create", "Edit", "Approve"].map((h, i) => (
                      <th key={h} className={`${th} px-[6px] py-[5px] text-[12px] ${i > 0 ? "text-center" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </Thead>
                  <tbody>
                    {permRows.map((r) => (
                      <tr key={r.module}>
                        <td className={`${td} px-[6px] py-[5px] font-semibold`}>{r.module}</td>
                        <td className={`${td} px-[6px] py-[5px] text-center`}>{r.view}</td>
                        <td className={`${td} px-[6px] py-[5px] text-center`}>{r.create}</td>
                        <td className={`${td} px-[6px] py-[5px] text-center`}>{r.edit}</td>
                        <td className={`${td} px-[6px] py-[5px] text-center`}>{r.approve}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                <div className="mt-auto pt-[6px]">
                  <PrimaryButton onClick={() => notice.show("Effective access preview opened (demo).")}>
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
                  <PrimaryButton
                    onClick={() => {
                      setSubmitted(false);
                      notice.show("Draft saved (demo).");
                    }}
                  >
                    Save draft
                  </PrimaryButton>
                  <PrimaryButton
                    outline
                    onClick={() => {
                      setSubmitted(true);
                      notice.show("Submitted for independent approval (demo).");
                    }}
                  >
                    Submit for approval
                  </PrimaryButton>
                  <div className="ml-auto flex items-center gap-[5px]">
                    {pipeline.map((p) => (
                      <Pill key={p} tone="gray" className="h-[20px] px-[8px] text-[11px]">
                        {p}
                      </Pill>
                    ))}
                  </div>
                </div>
              </Panel>
            )}

            {showAudit && (
              <Panel title="Audit history" bodyClassName="flex flex-col pt-[4px]">
                <KV k="10:05" v="Draft created by Super Admin 01" className="py-[5px]" />
                <KV k="10:12" v="HRMS employee selected • fields locked" className="py-[5px]" />
                <KV k="10:18" v="Access level assigned • pending approval" className="py-[5px]" />
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
      <p className="mb-[2px] text-[11.5px] font-medium text-[#3b4256]">{label}</p>
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
      className="h-[30px] w-full rounded-[7px] border border-[#d6dbe6] bg-[#f8fafc] px-[9px] text-[12.5px] font-medium text-[#0b0c36] outline-none"
    />
  );
}
