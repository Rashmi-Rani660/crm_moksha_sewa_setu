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
  userInputCls,
  userOutlineBtn,
  userPrimaryBtn,
  userTextareaCls,
} from "@/components/dashboards/user/UserScreenKit";

const callRows = [
  { id: "CALL-031", label: "CALL-031 · MS-26-1101", type: "Inbound", due: "Now", status: "Urgent", tone: "red" as const, action: "Open" },
  { id: "CALL-032", label: "CALL-032 · MS-26-1099", type: "Callback", due: "11:30", status: "Due", tone: "amber" as const, action: "Call", primary: true },
  { id: "CALL-033", label: "CALL-033 · MS-26-1098", type: "Outbound", due: "14:00", status: "Scheduled", tone: "blue" as const, action: "View" },
  { id: "CALL-034", label: "CALL-034 · Family 04", type: "Missed", due: "10:10", status: "Retry", tone: "amber" as const, action: "Review" },
];

export default function US016CallingFollowups() {
  const { show, node } = useUserNotice();
  const [selectedId, setSelectedId] = useState("CALL-032");
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("All calls");
  const [notes, setNotes] = useState("");

  const query = q.trim().toLowerCase();
  const rows = callRows.filter((r) => {
    const matchQ = !query || r.label.toLowerCase().includes(query);
    const matchT = typeFilter === "All calls" || r.type === typeFilter;
    return matchQ && matchT;
  });

  return (
    <UserFrame active="communication-hub">
      <UserHeader code="US-016" title="Calling & Follow-ups" />
      <UserKpiRow
        items={[
          { value: "03", label: "Callbacks due", tone: "orange" },
          { value: "01", label: "Missed call", tone: "red", valueRed: true },
          { value: "01", label: "Active call", tone: "blue" },
          { value: "04", label: "Calls today", tone: "blue" },
          { value: "02", label: "Follow-ups", tone: "orange" },
          { value: "01", label: "Retry pending", tone: "orange" },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-columns:771fr_385fr] lg:[grid-template-rows:335fr_163fr] lg:gap-[12px]">
        <UserPanel title="My call & callback queue">
          <div className="flex flex-wrap gap-[8px] sm:flex-nowrap">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search call or case"
              aria-label="Search call or case"
              className={`${userInputCls} flex-1`}
            />
            <select
              aria-label="Filter calls"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-[31px] w-full rounded-[6px] border border-[#c9d2e0] bg-white px-[10px] text-[13.8px] text-[#1a1d36] outline-none sm:w-[220px]"
            >
              <option>All calls</option>
              <option>Inbound</option>
              <option>Callback</option>
              <option>Outbound</option>
              <option>Missed</option>
            </select>
          </div>

          <div className="mt-[10px] overflow-x-auto">
            <table className="w-full min-w-[580px] border-collapse">
              <thead>
                <tr className="h-[29px] bg-[#e2e9f4] text-left text-[13.8px] font-medium text-[#1a1d36]">
                  <th className="px-[8px]">Call / case</th>
                  <th className="px-[8px]">Type</th>
                  <th className="px-[8px]">Due</th>
                  <th className="px-[8px]">Status</th>
                  <th className="px-[8px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="h-[36px] border-b border-[#dce4ee] text-[14.2px] text-[#1a1d36]">
                    <td className="whitespace-nowrap px-[8px]">{r.label}</td>
                    <td className="whitespace-nowrap px-[8px]">{r.type}</td>
                    <td className="whitespace-nowrap px-[8px]">{r.due}</td>
                    <td className="whitespace-nowrap px-[8px]">
                      <UserPill tone={r.tone}>{r.status}</UserPill>
                    </td>
                    <td className="whitespace-nowrap px-[8px]">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(r.id);
                          show(`Selected ${r.id} in call workspace.`);
                        }}
                        className={r.primary ? userPrimaryBtn : userOutlineBtn}
                      >
                        {r.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-[10px] flex flex-wrap gap-[7px]">
            <button type="button" onClick={() => show("Callback scheduler opened.")} className={userPrimaryBtn}>Schedule callback</button>
            <button type="button" onClick={() => show("Call history opened.")} className={userOutlineBtn}>Call history</button>
          </div>
        </UserPanel>

        <UserPanel title="Call workspace">
          <UserKVList
            rows={[
              ["Selected", selectedId],
              ["Contact", "Family 02 · masked"],
              ["Recording", "Notice / consent required"],
              ["Duration", "Not connected"],
              ["Next retry", "Policy limit · not loaded"],
            ]}
          />
          <p className={`mt-[8px] text-[13.8px] ${userInk}`}>Outcome / notes</p>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Review AI summary or enter notes"
            className={`${userTextareaCls} mt-[4px] h-[54px] resize-none`}
          />
          <div className="mt-[8px] flex flex-wrap gap-[7px]">
            <button type="button" onClick={() => show(`Outcome saved for ${selectedId}.`)} className={userPrimaryBtn}>Save outcome</button>
            <button type="button" onClick={() => setNotes("Reviewed AI summary: callback requested for document clarification.")} className={userOutlineBtn}>AI summary</button>
            <button type="button" onClick={() => show(`${selectedId} escalated to Admin.`)} className={userOutlineBtn}>Escalate</button>
          </div>
          <p className="mt-[6px] text-[13px] text-[#4a5468]">
            Call requires contact permission. Review AI summary before saving.
          </p>
        </UserPanel>

        <UserPanel title="Follow-up controls">
          <UserFlowSteps steps={["Call", "Outcome", "Next action", "Log"]} />
          <div className="mt-[6px]">
            <UserKVList
              rows={[
                ["Contact frequency", "Approved policy"],
                ["Opt-out", "Respect immediately"],
              ]}
            />
          </div>
        </UserPanel>

        <UserPanel title="Today's schedule">
          <UserKVList
            rows={[
              ["11:30", "Family follow-up"],
              ["14:00", "Case update call"],
              ["16:00", "Pending callback"],
            ]}
          />
          <div className="mt-[8px]">
            <button type="button" onClick={() => show("Calendar schedule opened.")} className={userPrimaryBtn}>View calendar</button>
          </div>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
