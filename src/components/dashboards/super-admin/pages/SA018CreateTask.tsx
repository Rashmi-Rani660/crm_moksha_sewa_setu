"use client";

/** SA-018 — Create & Assign Task. Demo form; nothing is saved to a server. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CircleCheck,
  CirclePlus,
  ClipboardCheck,
  Info,
  List,
  NotebookPen,
  Pencil,
  RefreshCw,
  Repeat,
  Save,
  Settings,
  ShieldCheck,
  SquareCheck,
  TriangleAlert,
  UserPlus,
  UserRound,
  UsersRound,
  Network,
  Zap,
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
  QuickList,
  SuperAdminFrame,
  Tabs,
  useNotice,
} from "@/components/dashboards/super-admin/kit";
import { saRoutes } from "@/components/dashboards/super-admin/routes";

const tabs = ["Create Task", "Task List & Status", "My Assignments", "Recurring Tasks", "Checklist Templates", "Task Reports"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { "Create Task": CirclePlus, "Task List & Status": List, "My Assignments": UserRound, "Recurring Tasks": Repeat, "Checklist Templates": SquareCheck, "Task Reports": BarChart3 };
const tabHref: Partial<Record<Tab, string>> = { "Task List & Status": saRoutes.tasks, "My Assignments": saRoutes.tasks, "Recurring Tasks": saRoutes.workflows, "Checklist Templates": saRoutes.workflows };

const caseOpts = ["Select Case / Request (Optional)", "CASE-2026-10456", "CASE-2026-10455", "SR-2026-011782"] as const;
const typeOpts = ["Operational", "Verification", "Documentation", "Field Visit"] as const;
const prioOpts = ["Medium", "High", "Low"] as const;
const centreOpts = ["Ghaziabad Centre (HO)", "Delhi (Coming Soon)", "Noida (Coming Soon)"] as const;
const assigneeOpts = ["Demo Employee (DEMO-E0137)", "Anil Sharma", "Priya Verma", "Field Team-02"] as const;
const adminOpts = ["Demo Admin 01", "Demo Admin 02", "Operations Lead"] as const;
const deptOpts = ["Operations Department", "Finance & Donations", "Communication & Outreach"] as const;
const templateOpts = ["Beneficiary Verification Checklist", "Document Collection Checklist", "Field Visit Checklist"] as const;
const beforeOpts = ["1 Day", "12 Hours", "2 Hours"] as const;
const followOpts = ["2 Hours", "4 Hours", "1 Day"] as const;
const subTasks = [
  "Verify beneficiary identity & documents",
  "Confirm eligibility as per scheme guidelines",
  "Update verification status in the system",
  "Upload supporting documents (if required)",
  "Close task with remarks",
];
const rules = [
  "Task can be assigned to an individual or a team member.",
  "Assignment can be centre-wise or department-wise.",
  "Due date & time is mandatory for tracking and escalation.",
  "Recurring tasks support Daily / Weekly schedules.",
  "Checklist can be added using pre-defined templates.",
  "Escalation risk is auto-calculated based on due date, priority and task age.",
];

const initial = {
  title: "",
  linked: caseOpts[0] as string,
  type: typeOpts[0] as string,
  priority: prioOpts[0] as string,
  due: "2026-11-24T17:30",
  centre: centreOpts[0] as string,
  assignee: assigneeOpts[0] as string,
  admin: adminOpts[0] as string,
  scope: "centre" as "centre" | "department",
  dept: deptOpts[0] as string,
  recur: "one" as "one" | "daily" | "weekly",
  remindBefore: true,
  before: beforeOpts[0] as string,
  followUp: true,
  follow: followOpts[0] as string,
  repeat: false,
  template: templateOpts[0] as string,
  checks: [true, true, true, false, false],
  notes: "",
  visible: true,
  governed: true,
  restrict: false,
};

export default function SA018CreateTask() {
  const notice = useNotice();
  const router = useRouter();
  const [f, setF] = useState(initial);
  const set = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) => setF((s) => ({ ...s, [k]: v }));

  const assign = (draft: boolean) => {
    if (!f.title.trim()) return notice.show("Task Title is required.");
    if (!draft && !f.due) return notice.show("Due Date & Time is required.");
    if (!draft && !f.checks.some(Boolean)) return notice.show("Select at least one sub-task.");
    notice.show(draft ? `Draft saved: "${f.title}" (demo).` : `Task "${f.title}" assigned to ${f.assignee} (demo).`);
    if (!draft) window.setTimeout(() => router.push(saRoutes.tasks), 900);
  };

  return (
    <SuperAdminFrame active="case-workflow">
      <PageHead icon={ClipboardCheck} title="Create & Assign Task" links={["Task Creation", "Assignment", "Recurrence", "Access & Checklist"]}>
        <Link href={saRoutes.tasks} className="text-[13px] font-semibold text-[#2320c4] hover:underline">← Back to Task Management</Link>
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={ClipboardCheck} value="248" label="Open Tasks" />
        <KpiTile tone="green" icon={UsersRound} value="86%" label="Team Capacity" />
        <KpiTile tone="orange" icon={CalendarDays} value="18" label="Due Today" />
        <KpiTile tone="red" icon={TriangleAlert} value="07" label="Escalation Risk" />
        <KpiTile tone="purple" icon={RefreshCw} value="32" label="Recurring Tasks" />
        <KpiTile tone="sky" icon={SquareCheck} value="14" label="Checklist Templates" />
      </KpiRow>

      <Tabs tabs={tabs} value="Create Task" icons={tabIcons} onChange={(t) => { const h = tabHref[t]; if (h) router.push(h); else if (t !== "Create Task") notice.show(`${t} (demo).`); }} />

      <div className="grid gap-[12px] lg:min-h-0 lg:flex-1 lg:grid-cols-[925fr_420fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <div className="flex min-h-0 min-w-0 flex-col gap-[8px]">
          <Panel title="Task Details" icon={UserPlus} titleSize={15.5} className="lg:h-[158px]" bodyClassName="flex flex-col gap-[7px] pt-[2px]">
            <div className="grid gap-[12px] sm:grid-cols-[1fr_1fr]">
              <Field label="Task Title" required>
                <input value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Enter task title (e.g., Verify beneficiary details)" aria-label="Task Title" className={inputCls} />
              </Field>
              <Field label={<span className="inline-flex items-center gap-[4px]">Linked Case <Info strokeWidth={2} className="h-[13px] w-[13px] text-[#2f6fe0]" /></span>}>
                <Dropdown label="Linked case" value={f.linked} options={caseOpts} onChange={(v) => set("linked", v)} className="w-full" />
              </Field>
            </div>
            <div className="grid gap-[12px] sm:grid-cols-4">
              <Field label="Task Type" required><Dropdown label="Task Type" value={f.type} options={typeOpts} onChange={(v) => set("type", v)} className="w-full" /></Field>
              <Field label="Priority" required><Dropdown label="Priority" value={f.priority} options={prioOpts} onChange={(v) => set("priority", v)} className="w-full" icon={<span className={`mr-[6px] h-[8px] w-[8px] shrink-0 rounded-full ${f.priority === "High" ? "bg-[#e02424]" : f.priority === "Low" ? "bg-[#1f87e8]" : "bg-[#f0a020]"}`} />} /></Field>
              <Field label="Due Date & Time" required><input type="datetime-local" value={f.due} onChange={(e) => set("due", e.target.value)} aria-label="Due Date & Time" className={inputCls} /></Field>
              <Field label="Centre / Location" required><Dropdown label="Centre / Location" value={f.centre} options={centreOpts} onChange={(v) => set("centre", v)} className="w-full" /></Field>
            </div>
          </Panel>

          <Panel title="Assignment & Scope" icon={UsersRound} titleSize={15.5} className="lg:h-[152px]" bodyClassName="flex flex-col gap-[7px] pt-[2px]">
            <div className="grid gap-[12px] sm:grid-cols-2">
              <Field label="Assign To" required><Dropdown label="Assign To" value={f.assignee} options={assigneeOpts} onChange={(v) => set("assignee", v)} className="w-full" /></Field>
              <Field label="Reporting Admin" required><Dropdown label="Reporting Admin" value={f.admin} options={adminOpts} onChange={(v) => set("admin", v)} className="w-full" /></Field>
            </div>
            <div className="grid gap-[12px] sm:grid-cols-2">
              <Field label="Assignment Scope / Visibility" required>
                <div role="radiogroup" aria-label="Assignment scope" className="flex h-[34px] items-center gap-[30px] rounded-[8px] border border-[#e1e5ee] px-[10px]">
                  <Radio on={f.scope === "centre"} onClick={() => set("scope", "centre")} label="Centre-wise" />
                  <Radio on={f.scope === "department"} onClick={() => set("scope", "department")} label="Department-wise" />
                </div>
              </Field>
              <Field label="Applicable Centre(s) / Department(s)" required><Dropdown label="Applicable department" value={f.dept} options={deptOpts} onChange={(v) => set("dept", v)} className="w-full" /></Field>
            </div>
          </Panel>

          <div className="grid gap-[8px] lg:h-[200px] lg:grid-cols-[440fr_477fr] lg:[grid-template-rows:minmax(0,1fr)]">
            <Panel title="Recurrence & Reminders" icon={RefreshCw} titleSize={15.5} bodyClassName="flex flex-col gap-[4px] pt-[2px]">
              <p className="text-[12.4px] font-bold leading-none">Recurring Task</p>
              <div role="radiogroup" aria-label="Recurring task" className="flex h-[28px] items-center justify-between rounded-[8px] border border-[#e1e5ee] px-[10px]">
                <Radio on={f.recur === "one"} onClick={() => set("recur", "one")} label="One-Time" />
                <Radio on={f.recur === "daily"} onClick={() => set("recur", "daily")} label="Daily" />
                <Radio on={f.recur === "weekly"} onClick={() => set("recur", "weekly")} label="Weekly" />
              </div>
              <p className="flex items-center gap-[4px] text-[12.4px] font-bold leading-none">Reminder Settings <Info strokeWidth={2} className="h-[13px] w-[13px] text-[#2f6fe0]" /></p>
              <div className="flex items-center gap-[10px]">
                <Checkbox checked={f.remindBefore} onChange={(v) => set("remindBefore", v)} label="Reminder Before Due" className="flex-1" />
                <Dropdown label="Reminder before" value={f.before} options={beforeOpts} onChange={(v) => set("before", v)} className="h-[24px] w-[116px]" size={12} />
              </div>
              <div className="flex items-center gap-[10px]">
                <Checkbox checked={f.followUp} onChange={(v) => set("followUp", v)} label="Follow-up Reminder" className="flex-1" />
                <Dropdown label="Follow-up" value={f.follow} options={followOpts} onChange={(v) => set("follow", v)} className="h-[24px] w-[116px]" size={12} />
              </div>
              <Checkbox checked={f.repeat} onChange={(v) => set("repeat", v)} label="Repeat Reminder (Till Completion)" />
            </Panel>

            <Panel title="Checklist" note="(Sub-tasks)" icon={SquareCheck} titleSize={15.5} bodyClassName="flex flex-col gap-[4px] pt-[2px]">
              <div className="flex items-center gap-[8px]">
                <p className="shrink-0 text-[12.4px] font-bold">Use Template</p>
                <Dropdown label="Checklist template" value={f.template} options={templateOpts} onChange={(v) => set("template", v)} className="h-[28px] min-w-0 flex-1" size={12.4} />
                <Link href={saRoutes.workflows} className="flex h-[28px] shrink-0 items-center gap-[5px] rounded-[7px] border-[1.5px] border-[#2f4fe0] px-[10px] text-[12px] font-semibold text-[#1d3fc4] hover:bg-[#f1f4ff]">
                  <Pencil strokeWidth={2.2} className="h-[12px] w-[12px]" />View / Edit
                </Link>
              </div>
              <p className="text-[12.4px] font-bold leading-none">Sub-tasks (Pre-defined) <span className="text-[#e02424]">*</span></p>
              <div className="flex flex-col gap-[2px] rounded-[8px] border border-[#e1e5ee] px-[8px] py-[3px]">
                {subTasks.map((s, i) => (
                  <Checkbox key={s} checked={f.checks[i]} onChange={(v) => set("checks", f.checks.map((c, j) => (j === i ? v : c)))} label={<span className="text-[11.8px]">{s}</span>} />
                ))}
              </div>
            </Panel>
          </div>

          <Panel title="Notes" icon={NotebookPen} titleSize={15.5} className="min-h-0 lg:flex-1" bodyClassName="flex pt-[2px]">
            <textarea value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Enter task notes, special instructions, or key references (e.g., related policy, case updates, etc.)" aria-label="Notes" className="min-h-[34px] flex-1 resize-none rounded-[8px] border border-[#cfd5e2] px-[8px] py-[6px] text-[12.6px] font-medium outline-none placeholder:text-[#5b6280] focus:border-[#5b6fe0]" />
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Account Security" icon={ShieldCheck} titleSize={15.5} className="lg:h-[118px]" bodyClassName="flex flex-col justify-between pt-[4px]">
            <Checkbox checked={f.visible} onChange={(v) => set("visible", v)} label="Visible to assigned user(s) and reporting admin only" />
            <Checkbox checked={f.governed} onChange={(v) => set("governed", v)} label="Access governed by role & permission matrix" />
            <Checkbox checked={f.restrict} onChange={(v) => set("restrict", v)} label="Restrict task details for non-authorised roles" />
          </Panel>
          <Panel title="Task Assignment Rules" icon={Network} titleSize={15.5} className="lg:h-[196px]" bodyClassName="flex flex-col justify-between pt-[4px]">
            {rules.map((r) => (
              <p key={r} className="flex items-start gap-[8px] text-[12px] font-medium leading-tight">
                <CircleCheck strokeWidth={2.2} className="mt-px h-[15px] w-[15px] shrink-0 text-[#1f9a2b]" />
                {r}
              </p>
            ))}
          </Panel>
          <Panel title="Quick Notes" icon={Zap} titleSize={15.5} className="min-h-0 lg:flex-1" bodyClassName="pt-[4px]">
            <QuickList
              items={[
                { icon: UserPlus, label: "View Task Assignment Guidelines", onClick: () => notice.show("Assignment guidelines (demo).") },
                { icon: BookOpen, label: "Manage Checklist Templates", color: "#7a3fe0", href: saRoutes.workflows },
                { icon: Settings, label: "Configure Recurring Task Rules", href: saRoutes.workflows },
              ]}
            />
          </Panel>
          <div className="grid grid-cols-[1fr_1.15fr_1.4fr] gap-[8px]">
            <PrimaryButton outline icon={RefreshCw} className="h-[38px] px-[6px]" onClick={() => setF(initial)}>Reset</PrimaryButton>
            <PrimaryButton outline icon={Save} className="h-[38px] px-[6px]" onClick={() => assign(true)}>Save Draft</PrimaryButton>
            <PrimaryButton icon={UserPlus} className="h-[38px] px-[6px]" onClick={() => assign(false)}>Assign Task</PrimaryButton>
          </div>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

const inputCls = "h-[34px] w-full rounded-[8px] border border-[#cfd5e2] bg-white px-[10px] text-[12.6px] font-medium outline-none placeholder:text-[#5b6280] focus:border-[#5b6fe0]";

function Field({ label, required = false, children }: { label: ReactNode; required?: boolean; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="mb-[3px] text-[12.4px] font-bold leading-none">
        {label} {required && <span className="text-[#e02424]">*</span>}
      </p>
      {children}
    </div>
  );
}

function Radio({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onClick} className="flex items-center gap-[7px] pr-[4px] text-[12.8px] font-semibold">
      <span className={`flex h-[15px] w-[15px] items-center justify-center rounded-full border-[1.5px] ${on ? "border-[#1d4fe0]" : "border-[#5b6280]"}`}>
        {on && <span className="h-[7px] w-[7px] rounded-full bg-[#1d4fe0]" />}
      </span>
      {label}
    </button>
  );
}
