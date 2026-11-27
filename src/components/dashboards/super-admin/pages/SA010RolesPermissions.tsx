"use client";

/**
 * SA-010 — Roles & Permission Matrix.
 * Matched to the SA-010 reference design: 5 KPI tiles, 4 tabs, 9-column
 * module permissions matrix (Admin sample) on the left and access level
 * summary, scope & security, and effective access preview on the right.
 * Demo data only.
 */

import { useState } from "react";
import {
  Radio,
  ShieldCheck,
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

const tabs = ["Permission Matrix", "Access Profiles", "Effective Access", "Change History"] as const;
type Tab = (typeof tabs)[number];

type Cell = "✓" | "Conditional" | "Scoped" | "Approval" | "Restricted" | "Independent" | "—";

type PermRow = {
  module: string;
  view: Cell;
  create: Cell;
  edit: Cell;
  approve: Cell;
  export: Cell;
  assign: Cell;
  archive: Cell;
  manage: Cell;
};

const rows: PermRow[] = [
  { module: "Dashboard & reports", view: "✓", create: "—", edit: "—", approve: "—", export: "Scoped", assign: "—", archive: "—", manage: "—" },
  { module: "Sewa requests & cases", view: "✓", create: "✓", edit: "✓", approve: "Conditional", export: "Scoped", assign: "Scoped", archive: "Approval", manage: "—" },
  { module: "Tasks & field operations", view: "✓", create: "✓", edit: "✓", approve: "Conditional", export: "Scoped", assign: "Scoped", archive: "Approval", manage: "—" },
  { module: "Communication hub", view: "✓", create: "✓", edit: "✓", approve: "—", export: "Restricted", assign: "Scoped", archive: "—", manage: "—" },
  { module: "Finance & donations", view: "—", create: "—", edit: "—", approve: "—", export: "Restricted", assign: "—", archive: "—", manage: "—" },
  { module: "Users & access", view: "✓", create: "—", edit: "—", approve: "Independent", export: "Restricted", assign: "—", archive: "—", manage: "—" },
  { module: "AI & automation", view: "✓", create: "—", edit: "—", approve: "—", export: "Restricted", assign: "—", archive: "—", manage: "—" },
  { module: "Security / backup / audit", view: "—", create: "—", edit: "—", approve: "Independent", export: "Restricted", assign: "—", archive: "—", manage: "—" },
];

const accessLevels = ["Admin", "Super Admin", "User"] as const;
const profiles = ["Operations Admin", "Finance Admin", "Centre Admin", "Read-only Auditor"] as const;

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

const effective = [
  ["Selected profile", "Operations Admin"],
  ["Centre", "Ghaziabad"],
  ["Finance approval", "Restricted"],
  ["Last review", "Demo / pending"],
  ["Access review", "Independent approver"],
  ["Session revocation", "On access change"],
] as const;

function CellValue({ value }: { value: Cell }) {
  if (value === "✓") {
    return (
      <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[4px] bg-[#d4f3d2] text-[11px] font-bold text-[#1c6b1f]">
        ✓
      </span>
    );
  }
  return <span className="text-[12px] font-medium text-[#3b4256]">{value}</span>;
}

export default function SA010RolesPermissions() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Permission Matrix");
  const [level, setLevel] = useState<(typeof accessLevels)[number]>("Admin");
  const [profile, setProfile] = useState<(typeof profiles)[number]>("Operations Admin");
  const [checks, setChecks] = useState<Record<string, boolean>>(() => Object.fromEntries(scopeChecks.map((c) => [c, true])));

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
        <CentreDropdown className="w-[165px]" />
      </PageHead>

      <KpiRow cols={5}>
        <KpiTile tone="blue" icon={ShieldCheck} value="03" label="Access levels" sub="Fixed architecture" />
        <KpiTile tone="green" icon={Users} value="186" label="CRM users" sub="Demo accounts" />
        <KpiTile tone="orange" icon={Users} value="01" label="Super Admin" sub="Organisation scope" />
        <KpiTile tone="purple" icon={Users} value="12" label="Admin" sub="Delegated scope" />
        <KpiTile tone="sky" icon={Users} value="173" label="User" sub="Assigned work" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {tab === "Change History" ? (
          <Panel title="Change history" className="lg:min-h-0 lg:flex-1" bodyClassName="flex flex-col pt-[6px]">
            <KV k="Finance approve set to Conditional for Admin" v="24 Nov, 11:32 AM • Applied" className="py-[6px]" />
            <KV k="Profile 'Operations Admin' updated" v="24 Nov, 10:48 AM • Applied" className="py-[6px]" />
            <KV k="Self-escalation prevention enabled org-wide" v="23 Nov, 02:10 PM • Applied" className="py-[6px]" />
          </Panel>
        ) : (
          <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[68fr_32fr] lg:[grid-template-rows:minmax(0,1fr)]">
            {showMatrix && (
              <Panel title={`Module permissions — ${level} (sample)`} bodyClassName="flex flex-col gap-[8px] pt-[6px]">
                <div className="grid gap-[10px] sm:grid-cols-2">
                  <div>
                    <p className="mb-[2px] text-[11.5px] font-medium text-[#3b4256]">Access level</p>
                    <Dropdown label="Access level" value={level} options={accessLevels} onChange={setLevel} className="w-full" size={12.5} />
                  </div>
                  <div>
                    <p className="mb-[2px] text-[11.5px] font-medium text-[#3b4256]">Permission profile</p>
                    <Dropdown label="Permission profile" value={profile} options={profiles} onChange={setProfile} className="w-full" size={12.5} />
                  </div>
                </div>

                <TableWrap className="min-h-0 flex-1 overflow-auto">
                  <Thead>
                    {["Module", "View", "Create", "Edit", "Approve", "Export", "Assign", "Archive", "Manage"].map((h, i) => (
                      <th key={h} className={`${th} px-[6px] py-[6px] text-[12px] ${i > 0 ? "text-center" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </Thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.module}>
                        <td className={`${td} px-[6px] py-[6px] font-semibold`}>{r.module}</td>
                        <td className={`${td} px-[6px] py-[6px] text-center`}><CellValue value={r.view} /></td>
                        <td className={`${td} px-[6px] py-[6px] text-center`}><CellValue value={r.create} /></td>
                        <td className={`${td} px-[6px] py-[6px] text-center`}><CellValue value={r.edit} /></td>
                        <td className={`${td} px-[6px] py-[6px] text-center`}><CellValue value={r.approve} /></td>
                        <td className={`${td} px-[6px] py-[6px] text-center`}><CellValue value={r.export} /></td>
                        <td className={`${td} px-[6px] py-[6px] text-center`}><CellValue value={r.assign} /></td>
                        <td className={`${td} px-[6px] py-[6px] text-center`}><CellValue value={r.archive} /></td>
                        <td className={`${td} px-[6px] py-[6px] text-center`}><CellValue value={r.manage} /></td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>

                <div className="flex flex-wrap gap-[8px]">
                  <PrimaryButton onClick={() => notice.show("Changes submitted for independent approval (demo).")}>
                    Submit changes for approval
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => notice.show("Effective access preview opened (demo).")}>
                    Preview effective access
                  </PrimaryButton>
                </div>

                <div className="flex flex-wrap items-center gap-[10px] rounded-[8px] border border-[#dce6f7] bg-[#f4f8ff] px-[10px] py-[6px] text-[11.5px] font-medium">
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
                    const on = checks[label];
                    return (
                      <label
                        key={label}
                        className="flex cursor-pointer flex-col items-center justify-center gap-[2px] border-b border-[#eef0f5] py-[3px] text-center last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={(e) => setChecks((s) => ({ ...s, [label]: e.target.checked }))}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-[13px] w-[13px] items-center justify-center rounded-[3px] border text-[9px] font-bold leading-none transition-colors ${
                            on
                              ? "border-[#cbd5e1] bg-[#cbd5e1] text-white"
                              : "border-[#cbd5e1] bg-white text-transparent"
                          }`}
                          aria-hidden
                        >
                          ✓
                        </span>
                        <span className="text-[11.5px] font-medium leading-tight text-[#1a1d36]">{label}</span>
                      </label>
                    );
                  })}
                </Panel>

                <Panel title="Effective access preview" className="lg:min-h-0 lg:flex-[34_1_0]" bodyClassName="flex flex-col gap-[3px] pt-[4px]">
                  {effective.map(([k, v]) => (
                    <KV
                      key={k}
                      k={k}
                      v={v === "Restricted" ? <Pill tone="blue" className="h-[18px] text-[10.5px]">{v}</Pill> : v}
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
