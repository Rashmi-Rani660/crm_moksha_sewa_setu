"use client";

/**
 * SA-018 — Create & Assign Task (demo form; nothing is saved).
 * Assignee availability, role, centre and case permissions are checked before
 * assignment; volunteers get only the minimum necessary details; sensitive
 * assignments need confirmation; delivery, acknowledgement and fallback are recorded.
 */

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { saRoutes, screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Check, Col, Columns, Field, KVList, NativeSelect, Panel, Pill, Screen, TextBox, ink } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Task Details", "Assignee & Scope", "Delivery & SLA", "Review"] as const;
const typeOpts = ["Field operations", "Verification", "Helpline", "Internal work"] as const;
const caseOpts = ["MSC-26-27-0004", "MSC-26-27-0003", "MSC-26-27-0008", "Internal work item"] as const;
const deptOpts = ["Sewa Operations", "Case & Workflow", "Communication Hub", "Finance & Donations"] as const;
const priorityOpts = ["High", "Critical", "Normal"] as const;
const modeOpts = ["Manual", "Automatic", "Approval-based"] as const;
const recurOpts = ["One-time", "Daily", "Weekly"] as const;
const assigneeTypeOpts = ["Staff", "Volunteer", "Team"] as const;
const assigneeOpts = ["Field Team 01", "Case User 03", "Volunteer 01", "Helpline User 01"] as const;
const channelOpts = ["Staff App", "Volunteer App", "WhatsApp", "Email"] as const;

const initial = {
  title: "Confirm pickup readiness",
  type: typeOpts[0] as string,
  linked: caseOpts[0] as string,
  dept: deptOpts[0] as string,
  priority: priorityOpts[0] as string,
  due: "26 Nov 2026 · 12:30 PM",
  mode: modeOpts[0] as string,
  instructions: "Confirm readiness with authorised team; record acceptance and update case.",
  location: "Ghaziabad · authorised case",
  recurrence: recurOpts[0] as string,
  assigneeType: assigneeTypeOpts[0] as string,
  assignee: assigneeOpts[0] as string,
  channel: channelOpts[0] as string,
  acceptance: true,
  notify: true,
  escalate: true,
};

export default function SA018CreateTask() {
  const notice = useNotice();
  const router = useRouter();
  const [tab, setTab] = useState<string>(tabs[0]);
  const [f, setF] = useState(initial);
  const [files, setFiles] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const set = <K extends keyof typeof initial>(k: K) => (v: (typeof initial)[K]) => setF((s) => ({ ...s, [k]: v }));
  const volunteer = f.assigneeType === "Volunteer" || f.assignee.startsWith("Volunteer");

  const assign = () => {
    if (!f.title.trim()) return notice.show("Task title is required.");
    if (!f.due.trim()) return notice.show("Due date / time is required.");
    if (!f.instructions.trim()) return notice.show("Add instructions for the assignee.");
    if (f.priority === "Critical" && !window.confirm("Sensitive / critical assignment — confirm before dispatch?")) return;
    notice.show(`Task assigned to ${f.assignee} via ${f.channel} (demo).`);
    window.setTimeout(() => router.push(saRoutes.tasks), 900);
  };

  return (
    <Screen
      code="SA-018"
      title="Create & Assign Task"
      active="case-workflow"
      picker={screenPicker1120}
      kpis={[
        { value: f.mode, label: "Assignment mode" },
        { value: "08 / 10", label: "Staff on duty" },
        { value: "12 / 18", label: "Volunteers available" },
        { value: "01 / 02", label: "Vehicles available" },
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
              <Field label="Centre"><TextBox value="Ghaziabad" readOnly label="Centre" /></Field>
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
              <Field label="Reporting admin"><TextBox value="Operations Admin" readOnly label="Reporting admin" /></Field>
              <Field label="Delivery channel"><NativeSelect label="Delivery channel" value={f.channel} options={channelOpts} onChange={set("channel")} className="w-full" /></Field>
            </div>
            <Buttons className="!mt-[8px]">
              <Btn primary onClick={assign}>Review & assign</Btn>
              <Btn onClick={() => notice.show(`Draft saved: "${f.title}" (demo).`)}>Save draft</Btn>
              <Btn href={saRoutes.tasks}>Cancel</Btn>
            </Buttons>
            <div className={`mt-[6px] flex items-center justify-between border-b border-[#e1e7f0] pb-[3px] text-[13.3px] ${ink}`}>
              <span>Attachments</span>
              <span className="truncate pl-[10px]">{files.length ? files.join(", ") : "No files selected"}</span>
            </div>
            <input ref={fileInput} type="file" multiple hidden onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((x) => x.name))} />
            <Buttons className="!mt-[6px]">
              <Btn onClick={() => fileInput.current?.click()}>Add attachment</Btn>
              <Btn onClick={() => notice.show(`${f.assignee}: available · ${volunteer ? "volunteer sees minimum details" : "full case access"} (demo).`)}>Preview assignee</Btn>
            </Buttons>
          </Panel>
        </Col>

        <Col>
          <Panel title="Pre-assignment checks" h={195}>
            <KVList
              rowH={26}
              rows={[
                ["Centre coverage", <Pill key="a" tone="green">Active</Pill>],
                ["Assignee availability", <Pill key="b" tone="green">Available</Pill>],
                ["Case access", <Pill key="c" tone="green">Verified</Pill>],
                ["Legal gate", <Pill key="d" tone="green">Verified</Pill>],
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
                ["Acknowledgement target", "15 min (demo)"],
                ["Fallback", "Operations Admin"],
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
