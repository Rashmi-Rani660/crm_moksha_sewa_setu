"use client";

/**
 * SA-009 — Create User & Assign Access.
 * Notes (design brief 09): HRMS employee fields are read-only; the verified,
 * unique mobile number is the login identifier; MFA is mandatory and cannot be
 * disabled; Super Admin elevation needs independent approval and
 * phishing-resistant MFA; preview effective permissions, assign training and
 * activate only after approval — no self-escalation.
 */

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  CalendarDays,
  Crown,
  FileText,
  Lock,
  MapPin,
  Network,
  RefreshCw,
  Settings,
  ShieldCheck,
  UserCog,
  UserPlus,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  Checkbox,
  Dropdown,
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  PrimaryButton,
  SuperAdminFrame,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const employees = ["DEMO-E0137 — Demo Employee (HRMS)", "DEMO-E0142 — Demo Employee 2 (HRMS)", "DEMO-E0150 — Demo Employee 3 (HRMS)"] as const;
const designations = ["Operations Executive", "Field Coordinator", "Case Manager", "Accounts Executive"] as const;
const departments = ["Sewa Operations", "CSR & Partnerships", "Finance & Donations", "Communication & Outreach", "Admin & Support"] as const;
const tabs: { label: string; icon: LucideIcon }[] = [
  { label: "Create / Manage User", icon: UserRound },
  { label: "Access Permissions", icon: FileText },
  { label: "Centre-wise Access", icon: Network },
  { label: "User Audit Logs", icon: FileText },
];
const levels: { id: "Super Admin" | "Admin" | "User"; sub: string; icon: LucideIcon; color: string }[] = [
  { id: "Super Admin", sub: "(Full System Access)", icon: Crown, color: "#f0a020" },
  { id: "Admin", sub: "(Department Access)", icon: UsersRound, color: "#2f6fe0" },
  { id: "User", sub: "(Limited Access)", icon: UserRound, color: "#f0a020" },
];
const modules = [
  "Sewa Request (Create / Update)",
  "Communication Hub (SMS / WhatsApp)",
  "Case & Workflow (Assign / Update)",
  "Finance & Donations",
  "Operations (Dispatch / Tracking)",
  "Master Data (View Only)",
  "Reports & Analytics (View Only)",
  "Settings (Restricted)",
];
const defaultModules = new Set(["Sewa Request (Create / Update)", "Communication Hub (SMS / WhatsApp)", "Case & Workflow (Assign / Update)", "Operations (Dispatch / Tracking)"]);

const initial = {
  employee: employees[0] as (typeof employees)[number],
  designation: designations[0] as (typeof designations)[number],
  department: departments[0] as (typeof departments)[number],
  level: "Admin" as (typeof levels)[number]["id"],
  reporting: "Demo Admin 01",
  ghaziabad: true,
  modules: defaultModules as ReadonlySet<string>,
  forceChange: true,
  restrictIp: false,
  validity: "permanent" as "permanent" | "till",
  tillDate: "",
  remarks: "",
};

export default function SA009CreateUser() {
  const notice = useNotice();
  const [tab, setTab] = useState(0);
  const [f, setF] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const set = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) => setF((s) => ({ ...s, [k]: v }));

  const submit = () => {
    if (!f.ghaziabad) return notice.show("Select at least one applicable service centre.");
    if (!f.modules.size) return notice.show("Select at least one module permission.");
    if (!f.reporting.trim()) return notice.show("Reporting authority is required.");
    if (f.validity === "till" && !f.tillDate) return notice.show("Choose the access end date.");
    if (f.level === "Super Admin" && !window.confirm("Super Admin access needs independent approval and phishing-resistant MFA. Submit for approval?")) return;
    setSubmitted(true);
    notice.show("Submitted for access approval — the account activates only after approval (demo).");
  };

  return (
    <SuperAdminFrame active="users-access-control">
      <PageHead
        icon={UserCog}
        title="Create User & Assign Access"
        links={["User Creation & Access Management", "HRMS Integration", "Role Assignment", "Centre-wise Permissions", "Account Security"]}
      >
        <Link href="/dashboard/super-admin/users-access-control" className="text-[13px] font-semibold text-[#2320c4] hover:underline">
          ← Back to User Management
        </Link>
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={UsersRound} value="–" label="HRMS employees" />
        <KpiTile tone="green" icon={UserPlus} value="162" label="Active users" />
        <KpiTile tone="orange" icon={ShieldCheck} value="03" label="Super Admin / Admin / User" />
        <KpiTile tone="purple" icon={Network} value="07" label="Departments" />
        <KpiTile tone="red" icon={MapPin} value="01" label="Active centre" />
        <KpiTile tone="sky" icon={Lock} value="MFA" label="Mandatory" />
      </KpiRow>

      <div role="tablist" className="flex gap-[8px] overflow-x-auto lg:h-[38px]">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`flex h-[38px] shrink-0 items-center gap-[8px] whitespace-nowrap rounded-[9px] border px-[20px] pt-px text-[14px] font-semibold shadow-[0_2px_6px_rgba(30,50,110,0.06)] ${
              tab === i ? "border-[#1d4fe0] bg-[#1d4fe0] text-white" : "border-[#e1e5ee] bg-white hover:bg-[#f4f6fc]"
            }`}
          >
            <t.icon strokeWidth={2} className="h-[17px] w-[17px]" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-[14px] lg:h-[548px] lg:grid-cols-[750fr_405fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="User Details" icon={UserPlus} className="lg:h-[244px]" bodyClassName="flex flex-col gap-[9px] pt-[8px]">
            <Field label="Select Employee (from HRMS)" required>
              <div className="flex gap-[10px]">
                <Dropdown label="HRMS employee" value={f.employee} options={employees} onChange={(v) => set("employee", v)} className="min-w-0 flex-1" />
                <PrimaryButton outline icon={RefreshCw} onClick={() => notice.show("Synced from HRMS — employee fields are read-only (demo).")}>Sync from HRMS</PrimaryButton>
              </div>
            </Field>
            <div className="grid gap-[12px] sm:grid-cols-3">
              <Field label="Full Name" required><ReadOnly value={f.employee.includes("E0137") ? "Demo Employee" : f.employee.split("— ")[1].replace(" (HRMS)", "")} /></Field>
              <Field label="Mobile Number" required><ReadOnly value="+91 XXXXX XXXXX" /></Field>
              <Field label="Email ID"><ReadOnly value="demo@example.com" /></Field>
            </div>
            <div className="grid gap-[12px] sm:grid-cols-3">
              <Field label="Employee ID"><ReadOnly value={f.employee.split(" ")[0]} /></Field>
              <Field label="Designation" required><Dropdown label="Designation" value={f.designation} options={designations} onChange={(v) => set("designation", v)} className="w-full" /></Field>
              <Field label="Department" required><Dropdown label="Department" value={f.department} options={departments} onChange={(v) => set("department", v)} className="w-full" /></Field>
            </div>
          </Panel>

          <Panel title="Access & Role Assignment" icon={UserPlus} className="lg:h-[128px]" bodyClassName="flex flex-col gap-[12px] pt-[4px] sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <p className="mb-[5px] text-[12.5px] font-bold">Access Level <span className="text-[#e02424]">*</span></p>
              <div role="radiogroup" aria-label="Access Level" className="grid grid-cols-3 gap-[10px]">
                {levels.map((l) => {
                  const on = f.level === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => set("level", l.id)}
                      className={`flex min-h-[44px] items-center gap-[8px] rounded-[9px] border-[1.5px] px-[8px] py-[4px] text-left lg:h-[44px] lg:py-0 ${on ? "border-[#1d4fe0] bg-[#eef3ff]" : "border-[#d6dbe6] bg-white hover:bg-[#f6f8fd]"}`}
                    >
                      <span className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${on ? "border-[#1d4fe0]" : "border-[#5b6280]"}`}>
                        {on && <span className="h-[7px] w-[7px] rounded-full bg-[#1d4fe0]" />}
                      </span>
                      <l.icon strokeWidth={2} style={{ color: l.color }} className="h-[22px] w-[22px] shrink-0" />
                      <span className="min-w-0 leading-tight">
                        <b className="block text-[13px]">{l.id}</b>
                        <span className="block text-[10px] font-medium lg:truncate">{l.sub}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <Field label="Reporting Authority" required className="sm:w-[225px]">
              <input value={f.reporting} onChange={(e) => set("reporting", e.target.value)} aria-label="Reporting Authority" className="h-[34px] w-full rounded-[8px] border border-[#cfd5e2] bg-[#f3f5f9] px-[10px] text-[13px] font-medium outline-none focus:border-[#5b6fe0]" />
            </Field>
          </Panel>

          <Panel title="Service Centre Access & Permissions" icon={UsersRound} className="min-h-0 lg:flex-1" bodyClassName="flex flex-col gap-[14px] pt-[4px] sm:flex-row">
            <div className="sm:w-[245px]">
              <p className="mb-[5px] text-[12.5px] font-bold">Applicable Service Centre(s) <span className="text-[#e02424]">*</span></p>
              <div className="flex flex-col gap-[8px] rounded-[8px] border border-[#e1e5ee] p-[10px]">
                <Checkbox checked={f.ghaziabad} onChange={(v) => set("ghaziabad", v)} label="Ghaziabad Centre (HO)" />
                <Checkbox checked={false} disabled label="Delhi – Coming Soon" />
                <Checkbox checked={false} disabled label="Noida – Coming Soon" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-[5px] text-[12.5px] font-bold">Module Permissions <span className="text-[#e02424]">*</span> <span className="font-medium">(for selected role)</span></p>
              <div className="grid grid-cols-1 gap-x-[16px] gap-y-[8px] sm:grid-cols-2">
                {modules.map((m) => (
                  <Checkbox
                    key={m}
                    checked={f.modules.has(m)}
                    label={m}
                    onChange={(v) => {
                      const n = new Set(f.modules);
                      if (v) n.add(m);
                      else n.delete(m);
                      set("modules", n);
                    }}
                  />
                ))}
              </div>
            </div>
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Account Security" icon={ShieldCheck} bodyClassName="flex flex-col gap-[9px] pt-[8px]">
            <Checkbox checked disabled label="Password + MFA — mandatory / locked" className="!opacity-100" />
            <Checkbox checked={f.forceChange} onChange={(v) => set("forceChange", v)} label="Force Password Change on First Login" />
            <p className="text-[12.5px] font-medium text-[#3b4256]">Reset password on compromise</p>
            <Checkbox checked={f.restrictIp} onChange={(v) => set("restrictIp", v)} label="Restrict Login by IP / Location" />
          </Panel>

          <Panel title="Additional Settings" icon={Settings} className="min-h-0 lg:flex-1" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <p className="text-[13px] font-medium">Account status: <b>{submitted ? "Pending approval (submitted)" : "Pending approval"}</b></p>
            <div>
              <p className="mb-[6px] text-[12.5px] font-bold">Access Validity</p>
              <div role="radiogroup" aria-label="Access Validity" className="flex flex-wrap items-center gap-[14px]">
                <Radio on={f.validity === "permanent"} onClick={() => set("validity", "permanent")} label="Permanent" />
                <Radio on={f.validity === "till"} onClick={() => set("validity", "till")} label="Till Date" />
                <label className="flex h-[32px] flex-1 items-center gap-[6px] rounded-[8px] border border-[#cfd5e2] px-[8px]">
                  <input type="date" value={f.tillDate} disabled={f.validity !== "till"} onChange={(e) => set("tillDate", e.target.value)} aria-label="Access end date" className="min-w-0 flex-1 bg-transparent text-[12.5px] font-medium outline-none disabled:text-[#9aa1b5]" />
                  <CalendarDays strokeWidth={2} className="h-[16px] w-[16px] shrink-0 text-[#5b6280]" />
                </label>
              </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              <p className="mb-[6px] text-[12.5px] font-bold">Remarks <span className="font-medium">(Optional)</span></p>
              <textarea
                value={f.remarks}
                onChange={(e) => set("remarks", e.target.value)}
                placeholder="Enter remarks (e.g., role scope, special access, etc.)"
                className="min-h-[70px] flex-1 resize-none rounded-[8px] border border-[#cfd5e2] p-[10px] text-[13px] font-medium outline-none placeholder:text-[#5b6280] focus:border-[#5b6fe0]"
              />
            </div>
          </Panel>

          <div className="grid grid-cols-[1fr_2fr] gap-[12px]">
            <PrimaryButton
              outline
              icon={RefreshCw}
              className="h-[40px]"
              onClick={() => {
                setF(initial);
                setSubmitted(false);
              }}
            >
              Reset
            </PrimaryButton>
            <PrimaryButton className="h-[40px]" onClick={submit}>Submit for Access Approval</PrimaryButton>
          </div>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function Field({ label, required = false, className = "", children }: { label: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="mb-[4px] text-[12.5px] font-bold">
        {label} {required && <span className="text-[#e02424]">*</span>}
      </p>
      {children}
    </div>
  );
}

function ReadOnly({ value }: { value: string }) {
  return (
    <input readOnly value={value} aria-label={value} title="From HRMS (read-only)" className="h-[34px] w-full rounded-[8px] border border-[#d6dbe6] bg-[#f3f5f9] px-[10px] text-[13px] font-medium text-[#3b4256] outline-none" />
  );
}

function Radio({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onClick} className="flex items-center gap-[7px] pr-[4px] text-[13px] font-semibold">
      <span className={`flex h-[15px] w-[15px] items-center justify-center rounded-full border-[1.5px] ${on ? "border-[#1d4fe0]" : "border-[#5b6280]"}`}>
        {on && <span className="h-[7px] w-[7px] rounded-full bg-[#1d4fe0]" />}
      </span>
      {label}
    </button>
  );
}

