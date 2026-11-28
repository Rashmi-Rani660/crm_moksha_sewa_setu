"use client";

import { useState } from "react";
import { useOperations } from "@/lib/crm/useOperations";
import { text, count, records, EMPTY } from "@/lib/crm/data";
import { humanize, shortDateTime } from "@/lib/format";
import {
  UserFlowSteps,
  UserFrame,
  UserHeader,
  UserKVList,
  UserKpiRow,
  UserPanel,
  UserPill,
  useUserNotice,
  userInk,
  userOutlineBtn,
  userPrimaryBtn,
  userTextareaCls,
} from "@/components/dashboards/user/UserScreenKit";



export default function US012TaskExecution() {
  const { show, node } = useUserNotice();
  const live = useOperations("tasks",show,{ mine: true });
  const record = live.detail.data;
  const checklistItems = records(record?.checklist).map(row => ({ id: text(row.key),label: text(row.label),locked: !live.can("tasks.edit") || live.mutation.busy || live.detail.loading,defaultChecked: row.done === true }));
  const checked: Record<string,boolean> = Object.fromEntries(checklistItems.map(row => [row.id,row.defaultChecked]));
  const saveCheck = (key: string,done: boolean) => live.act("Save checklist", { items: checklistItems.map(row => ({ key: row.id,done: row.id === key ? done : row.defaultChecked })) });
  const [remarks, setRemarks] = useState("");

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = checklistItems.length ? Math.round((doneCount / checklistItems.length) * 100) : 0;
  const canSubmit = doneCount === checklistItems.length;

  return (
    <UserFrame active="my-tasks">
      <UserHeader code="US-012" title="Task Acceptance, Execution & Completion" />
      <UserKpiRow
        items={[
          { value: text(record?.taskNo), label: "Selected task", tone: "blue" },
          { value: record ? record.overdue ? "Overdue" : humanize(text(record.status,"")) : EMPTY, label: "SLA status", tone: "red", valueRed: true },
          { value: `${doneCount} / ${checklistItems.length}`, label: "Checklist", tone: "orange" },
          { value: record ? count(records(record.evidence).length) : EMPTY, label: "Evidence files", tone: "green" },
          { value: humanize(text(record?.status,"")), label: "Admin review", tone: "purple" },
          { value: EMPTY, label: "Save state", tone: "green" },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-columns:771fr_385fr] lg:[grid-template-rows:335fr_163fr] lg:gap-[12px]">
        <UserPanel title="Task execution · TASK-026">
          <UserKVList
            rows={[
              ["Linked case",text(record?.reference)],
              ["Instruction",text(record?.description)],
              ["Assigned by",text(record?.createdBy)],
              ["Due",shortDateTime(text(record?.dueAt,""))],
            ]}
          />

          <div className="mt-[6px] flex flex-col items-center gap-[5px]">
            {checklistItems.map((item) => (
              <label key={item.id} className="flex cursor-pointer flex-col items-center gap-[2px] text-[13.8px] text-[#1a1d36]">
                <input
                  type="checkbox"
                  checked={checked[item.id]}
                  disabled={item.locked}
                  onChange={(e) => saveCheck(item.id,e.target.checked)}
                  className="h-[14px] w-[14px] accent-[#1d4fe0]"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            disabled={!live.can("tasks.edit") || !live.id || live.upload.busy} onClick={() => { if (live.id) live.upload.pick(`/tasks/${live.id}/evidence`); }}
            className="mt-[8px] flex h-[32px] w-full items-center justify-center rounded-[6px] border border-dashed border-[#a9bddf] bg-white text-[13.8px] text-[#1a1d36] hover:bg-[#f3f6fc]"
          >
            Drop evidence here · PDF / image · Browse files
          </button>

          <div className="mt-[8px] flex flex-wrap gap-[7px]">
            <button type="button" disabled={!live.can("tasks.edit") || !live.id || live.upload.busy} onClick={() => { if (live.id) live.upload.pick(`/tasks/${live.id}/evidence`); }} className={userPrimaryBtn}>Upload evidence</button>
            <button type="button" disabled onClick={() => show(EMPTY)} className={userOutlineBtn}>Add voice note</button>
            <button type="button" disabled={!live.canAct("Save draft")} onClick={() => live.act("Save draft", { remarks })} className={userOutlineBtn}>Save draft</button>
          </div>
        </UserPanel>

        <UserPanel title="Progress & completion">
          <div className={`flex items-center justify-between text-[13.8px] ${userInk}`}>
            <span>Checklist complete</span>
            <span>{pct}%</span>
          </div>
          <div className="mt-[4px] h-[9px] w-full overflow-hidden rounded-[4px] bg-[#e0e7ef]">
            <div style={{ width: `${pct}%` }} className="h-full bg-[linear-gradient(90deg,#086eed_0%,#3a8ef6_100%)] transition-all" />
          </div>

          <div className="mt-[6px]">
            <UserKVList
              rows={[
                ["Legal clearance", <UserPill key="lc" tone="red">{EMPTY}</UserPill>],
                ["Evidence", record ? count(records(record.evidence).length) : EMPTY],
                ["Draft", EMPTY],
                ["Next action", "Submit missing document"],
              ]}
            />
          </div>

          <p className={`mt-[8px] text-[13.8px] ${userInk}`}>Work remarks</p>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Type or dictate remarks"
            className={`${userTextareaCls} mt-[4px] h-[54px] resize-none`}
          />

          <div className="mt-[8px] flex flex-wrap gap-[7px]">
            <button
              type="button"
              disabled={!canSubmit || !live.canAct("Submit for review")}
              onClick={() => live.act("Submit for review", { remarks })}
              className={userPrimaryBtn}
            >
              Submit for review
            </button>
            <button type="button" disabled onClick={() => show(EMPTY)} className={userOutlineBtn}>Request clarification</button>
            <button type="button" disabled onClick={() => show(EMPTY)} className={userOutlineBtn}>Escalate</button>
          </div>
          <p className="mt-[6px] text-[13px] text-[#4a5468]">
            Complete mandatory documents and evidence before submitting. Draft recovery required.
          </p>
        </UserPanel>

        <UserPanel title="Activity history">
          <table className="w-full border-collapse">
            <thead>
              <tr className="h-[26px] bg-[#e2e9f4] text-left text-[13.8px] font-medium text-[#1a1d36]">
                <th className="w-[140px] px-[8px]">Time</th>
                <th className="px-[8px]">Event</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-[28px] border-b border-[#dce4ee] text-[13.8px] text-[#1a1d36]">
                <td className="px-[8px]">{shortDateTime(text(live.timeline[0]?.at,""))}</td>
                <td className="px-[8px]">{text(live.timeline[0]?.summary)}</td>
              </tr>
              <tr className="h-[28px] border-b border-[#dce4ee] text-[13.8px] text-[#1a1d36]">
                <td className="px-[8px]">{shortDateTime(text(live.timeline[1]?.at,""))}</td>
                <td className="px-[8px]">{text(live.timeline[1]?.summary)}</td>
              </tr>
              <tr className="h-[28px] border-b border-[#dce4ee] text-[13.8px] text-[#1a1d36]">
                <td className="px-[8px]">{shortDateTime(text(live.timeline[2]?.at,""))}</td>
                <td className="px-[8px]">{text(live.timeline[2]?.summary)}</td>
              </tr>
            </tbody>
          </table>
        </UserPanel>

        <UserPanel title="Completion gate">
          <p className={`text-[13.8px] ${userInk}`}>Final closure requires authorised Admin verification.</p>
          <div className="mt-[10px]">
            <UserFlowSteps steps={["Evidence", "Submit", "Review", "Complete"]} />
          </div>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
