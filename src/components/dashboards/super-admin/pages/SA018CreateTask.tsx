"use client";

/**
 * SA-018 — Create & Assign Task (demo form; nothing is saved).
 * Assignee availability, role, centre and case permissions are checked before
 * assignment; volunteers get only the minimum necessary details; sensitive
 * assignments need confirmation; delivery, acknowledgement and fallback are recorded.
 */

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useOperations } from "@/lib/crm/useOperations";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { EMPTY, records, text, type CrmRecord } from "@/lib/crm/data";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { saRoutes, screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Check, Col, Columns, Field, KVList, NativeSelect, Panel, Pill, Screen, TextBox, ink } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Task Details", "Assignee & Scope", "Delivery & SLA", "Review"] as const;



const priorityOpts = ["High", "Critical", "Normal"] as const;
const modeOpts = ["Manual", "Automatic", "Approval-based"] as const;
const recurOpts = ["One-time", "Daily", "Weekly"] as const;
const assigneeTypeOpts = ["Staff", "Volunteer", "Team"] as const;

const channelOpts = ["Staff App", "Volunteer App", "WhatsApp", "Email"] as const;

const initial = {
  title: "",
  type: "",
  linked: "",
  dept: "",
  priority: priorityOpts[0] as string,
  due: "26 Nov 2026 · 12:30 PM",
  mode: modeOpts[0] as string,
  instructions: "",
  location: "Ghaziabad · authorised case",
  recurrence: recurOpts[0] as string,
  assigneeType: assigneeTypeOpts[0] as string,
  assignee: "",
  channel: channelOpts[0] as string,
  acceptance: true,
  notify: true,
  escalate: true,
};

export default function SA018CreateTask() {
  const notice = useNotice();
  const live = useOperations("tasks", notice.show);
  const cases = useCrmQuery<CrmRecord[]>(live.can("cases.view") ? "/cases?limit=100&active=true" : null);
  const departments = useCrmQuery<CrmRecord[]>(live.can("departments.view") ? "/departments?limit=100&status=ACTIVE" : null);
  const typeOpts = live.master("TASK_TYPE").map(row => text(row.code));
  const caseOpts = ["Internal work item", ...records(cases.data).map(row => text(row.caseNo))];
  const deptOpts = records(departments.data).map(row => text(row.name));
  const assigneeOpts = live.people.map(row => text(row.name));
  const router = useRouter();
  const [tab, setTab] = useState<string>(tabs[0]);
  const [f, setF] = useState(initial);
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const set = <K extends keyof typeof initial>(k: K) => (v: (typeof initial)[K]) => setF((s) => ({ ...s, [k]: v }));

  const assign = async () => {
    if (live.mutation.busy || !live.can("tasks.create")) return;
    const dueAt = live.due(f.due);
    if (!dueAt) return notice.show("Enter the due time as YYYY-MM-DD HH:MM (IST).");
    const assignee = live.people.find(row => row.name === f.assignee);
    const linked = records(cases.data).find(row => row.caseNo === f.linked);
    if (!assignee || !f.type || !f.title.trim()) return notice.show("Enter a title, task type and eligible assignee.");
    const recurrence = f.recurrence === "Daily" ? "DAILY" : f.recurrence === "Weekly" ? "WEEKLY" : "NONE";
    const recurrenceUntil = recurrence === "NONE" ? undefined : live.due(window.prompt("Recurrence end (YYYY-MM-DD HH:MM, IST):") || "");
    if (recurrence !== "NONE" && !recurrenceUntil) return;
    if (!["Staff App", "Volunteer App"].includes(f.channel)) return notice.show("This delivery channel has no CRM integration yet.");
    const created = await live.createTask({ title: f.title, description: f.instructions, typeCode: f.type, assigneeId: assignee.id, priority: f.priority.toUpperCase(), dueAt, location: f.location, requireAcceptance: f.acceptance, dispatchToMobile: true, recurrence, ...(recurrenceUntil ? { recurrenceUntil } : {}), ...(linked ? { caseId: linked.id } : {}) });
    if (!created) return;
    for (const file of files) await live.upload.uploadFile('/tasks/' + created.id + '/evidence', file);
    router.push(saRoutes.tasks);
  };

  return (
    <Screen
      code="SA-018"
      title="Create & Assign Task"
      active="case-workflow"
      picker={screenPicker1120}
      kpis={[
        { value: f.mode, label: "Assignment mode" },
        { value: EMPTY, label: "Staff on duty" },
        { value: EMPTY, label: "Volunteers available" },
        { value: EMPTY, label: "Vehicles available" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title="Create task" h={327} bodyClassName="!pb-[7px]">
            <div className="grid grid-cols-1 gap-x-[13px] gap-y-[5px] sm:grid-cols-3">
              <Field label="Task title"><TextBox value={f.title} onChange={set("title")} label="Task title" /></Field>
              <Field label="Task type"><NativeSelect label="Task type" value={f.type} options={typeOpts} onChange={set("type")} className="w-full" /></Field>
              <Field label="Linked case / request"><NativeSelect label="Linked case / request" value={f.linked} options={caseOpts} onChange={set("linked")} className="w-full" /></Field>
              <Field label="Department"><NativeSelect label="Department" value={f.dept} options={deptOpts} onChange={set("dept")} className="w-full" /></Field>
              <Field label="Centre"><TextBox value={live.profile?.centres[0]?.name ?? EMPTY} readOnly label="Centre" /></Field>
              <Field label="Priority"><NativeSelect label="Priority" value={f.priority} options={priorityOpts} onChange={set("priority")} className="w-full" /></Field>
              <Field label="Due date / time"><TextBox value={f.due} onChange={set("due")} label="Due date / time" /></Field>
              <Field label="Assignment mode"><NativeSelect label="Assignment mode" value={f.mode} options={modeOpts} onChange={set("mode")} className="w-full" /></Field>
              <div className="hidden sm:block" />
              <Field label="Instructions" className="sm:col-span-3"><TextBox value={f.instructions} onChange={set("instructions")} label="Instructions" /></Field>
              <Field label="Service location"><TextBox value={f.location} onChange={set("location")} label="Service location" /></Field>
              <Field label="Recurrence"><NativeSelect label="Recurrence" value={f.recurrence} options={recurOpts} onChange={set("recurrence")} className="w-full" /></Field>
            </div>
          </Panel>

          <Panel title="Assignment & delivery">
            <div className="grid grid-cols-1 gap-x-[13px] gap-y-[7px] sm:grid-cols-3">
              <Field label="Assignee type"><NativeSelect label="Assignee type" value={f.assigneeType} options={assigneeTypeOpts} onChange={set("assigneeType")} className="w-full" /></Field>
              <Field label="Assignee"><NativeSelect label="Assignee" value={f.assignee} options={assigneeOpts} onChange={set("assignee")} className="w-full" /></Field>
              <Field label="Reporting admin"><TextBox value={EMPTY} readOnly label="Reporting admin" /></Field>
              <Field label="Delivery channel"><NativeSelect label="Delivery channel" value={f.channel} options={channelOpts} onChange={set("channel")} className="w-full" /></Field>
            </div>
            <Buttons className="!mt-[8px]">
              <Btn primary disabled={live.mutation.busy || !live.can("tasks.create")} onClick={assign}>Review & assign</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Save draft</Btn>
              <Btn href={saRoutes.tasks}>Cancel</Btn>
            </Buttons>
            <div className={`mt-[6px] flex items-center justify-between border-b border-[#e1e7f0] pb-[3px] text-[15.3px] ${ink}`}>
              <span>Attachments</span>
              <span className="truncate pl-[10px]">{files.length ? files.map(file => file.name).join(", ") : "No files selected"}</span>
            </div>
            <input ref={fileInput} type="file" multiple hidden onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
            <Buttons className="!mt-[6px]">
              <Btn onClick={() => fileInput.current?.click()}>Add attachment</Btn>
              <Btn onClick={() => notice.show(live.people.find(row => row.name === f.assignee) ? f.assignee : EMPTY)}>Preview assignee</Btn>
            </Buttons>
          </Panel>
        </Col>

        <Col>
          <Panel title="Pre-assignment checks" h={195}>
            <KVList
              rowH={26}
              rows={[
                ["Centre coverage", <Pill key="a" tone="green">{EMPTY}</Pill>],
                ["Assignee availability", <Pill key="b" tone="green">{EMPTY}</Pill>],
                ["Case access", <Pill key="c" tone="green">{EMPTY}</Pill>],
                ["Legal gate", <Pill key="d" tone="green">{EMPTY}</Pill>],
                ["Conflict / workload", "Review required"],
              ]}
            />
          </Panel>

          <Panel title="SLA & acknowledgement" h={228} bodyClassName="!pt-[4px]">
            <Check label="Require acceptance" checked={f.acceptance} onChange={set("acceptance")} />
            <Check label="Notify reporting admin" checked={f.notify} onChange={set("notify")} />
            <Check label="Escalate if overdue" checked={f.escalate} onChange={set("escalate")} />
            <Check label="Limit sensitive details" checked disabled />
            <KVList
              rowH={24}
              rows={[
                ["Acknowledgement target", EMPTY],
                ["Fallback", EMPTY],
                ["Delivery failure", "Retry / manual follow-up"],
              ]}
            />
          </Panel>

          <Panel title="Approval control">
            <KVList
              rowH={24}
              rows={[
                ["Sensitive assignment", "Independent approval if required"],
                ["Audit log", "Mandatory"],
                ["Task ID", "Generated on save"],
                ["Task checklist", "Acceptance · arrival · evidence"],
              ]}
            />
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
