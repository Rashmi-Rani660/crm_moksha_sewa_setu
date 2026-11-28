"use client";

import { useState } from "react";
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

const checklistItems = [
  { id: "c1", label: "Assignment accepted (recorded)", locked: true, defaultChecked: true },
  { id: "c2", label: "Review identity details", locked: false, defaultChecked: true },
  { id: "c3", label: "Confirm required documents", locked: false, defaultChecked: false },
  { id: "c4", label: "Submit supporting evidence", locked: false, defaultChecked: false },
];

export default function US012TaskExecution() {
  const { show, node } = useUserNotice();
  const [checked, setChecked] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: false,
    c4: false,
  });
  const [remarks, setRemarks] = useState("");

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / checklistItems.length) * 100);
  const canSubmit = doneCount === checklistItems.length;

  return (
    <UserFrame active="my-tasks">
      <UserHeader code="US-012" title="Task Acceptance, Execution & Completion" />
      <UserKpiRow
        items={[
          { value: "TASK-026", label: "Selected task", tone: "blue" },
          { value: "Overdue", label: "SLA status", tone: "red", valueRed: true },
          { value: `${doneCount} / 4`, label: "Checklist", tone: "orange" },
          { value: "1", label: "Evidence files", tone: "green" },
          { value: "Pending", label: "Admin review", tone: "purple" },
          { value: "Draft", label: "Save state", tone: "green" },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-columns:771fr_385fr] lg:[grid-template-rows:335fr_163fr] lg:gap-[12px]">
        <UserPanel title="Task execution · TASK-026">
          <UserKVList
            rows={[
              ["Linked case", "MS-26-1101"],
              ["Instruction", "Verify pending documents"],
              ["Assigned by", "Admin 01"],
              ["Due", "Today 10:00"],
            ]}
          />

          <div className="mt-[6px] flex flex-col items-center gap-[5px]">
            {checklistItems.map((item) => (
              <label key={item.id} className="flex cursor-pointer flex-col items-center gap-[2px] text-[13.8px] text-[#1a1d36]">
                <input
                  type="checkbox"
                  checked={checked[item.id]}
                  disabled={item.locked}
                  onChange={(e) => setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))}
                  className="h-[14px] w-[14px] accent-[#1d4fe0]"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={() => show("Evidence file picker opened (demo).")}
            className="mt-[8px] flex h-[32px] w-full items-center justify-center rounded-[6px] border border-dashed border-[#a9bddf] bg-white text-[13.8px] text-[#1a1d36] hover:bg-[#f3f6fc]"
          >
            Drop evidence here · PDF / image · Browse files
          </button>

          <div className="mt-[8px] flex flex-wrap gap-[7px]">
            <button type="button" onClick={() => show("Upload evidence initiated.")} className={userPrimaryBtn}>Upload evidence</button>
            <button type="button" onClick={() => show("Voice note recorder ready (demo).")} className={userOutlineBtn}>Add voice note</button>
            <button type="button" onClick={() => show("Task draft saved.")} className={userOutlineBtn}>Save draft</button>
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
                ["Legal clearance", <UserPill key="lc" tone="red">Pending</UserPill>],
                ["Evidence", "1 file · scan required"],
                ["Draft", "Last saved · demo"],
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
              disabled={!canSubmit}
              onClick={() => show("Submitted for Admin review.")}
              className={userPrimaryBtn}
            >
              Submit for review
            </button>
            <button type="button" onClick={() => show("Clarification request sent.")} className={userOutlineBtn}>Request clarification</button>
            <button type="button" onClick={() => show("Escalated to Admin.")} className={userOutlineBtn}>Escalate</button>
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
                <td className="px-[8px]">09:40</td>
                <td className="px-[8px]">Assigned by Admin 01</td>
              </tr>
              <tr className="h-[28px] border-b border-[#dce4ee] text-[13.8px] text-[#1a1d36]">
                <td className="px-[8px]">09:45</td>
                <td className="px-[8px]">Accepted by User 07</td>
              </tr>
              <tr className="h-[28px] border-b border-[#dce4ee] text-[13.8px] text-[#1a1d36]">
                <td className="px-[8px]">10:05</td>
                <td className="px-[8px]">Draft saved</td>
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
