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

const chatRows = [
  { id: "CHAT-014", subject: "Eligibility clarification", mode: "Human", tone: "green" as const, action: "Open", primary: true },
  { id: "CHAT-015", subject: "Document guidance", mode: "AI", tone: "blue" as const, action: "Review" },
];

export default function US017AiChatbot() {
  const { show, node } = useUserNotice();
  const [selectedId, setSelectedId] = useState("CHAT-014");
  const [q, setQ] = useState("");
  const [reply, setReply] = useState("");

  const rows = chatRows.filter((r) => !q.trim() || r.id.toLowerCase().includes(q.toLowerCase()) || r.subject.toLowerCase().includes(q.toLowerCase()));

  return (
    <UserFrame active="communication-hub">
      <UserHeader code="US-017" title="AI Chatbot & Human Assistance" />
      <UserKpiRow
        items={[
          { value: "02", label: "Assigned chats", tone: "blue" },
          { value: "01", label: "Human takeover", tone: "orange" },
          { value: "01", label: "Urgent review", tone: "red", valueRed: true },
          { value: "Text", label: "Active mode", tone: "blue" },
          { value: "Not loaded", label: "Usage limit status", tone: "purple" },
          { value: "Paused", label: "Selected AI", tone: "orange" },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-rows:388fr_110fr] lg:gap-[12px]">
        <div className="grid min-h-0 grid-cols-1 gap-3 lg:[grid-template-columns:700fr_456fr] lg:gap-[12px]">
          <UserPanel title="Assigned chatbot conversations">
            <div className="flex gap-[8px]">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search conversation"
                aria-label="Search conversation"
                className={`${userInputCls} flex-1`}
              />
              <select aria-label="Filter chatbot chats" className="h-[31px] w-[180px] rounded-[6px] border border-[#c9d2e0] bg-white px-[10px] text-[13.8px] text-[#1a1d36]">
                <option>All</option>
                <option>Human</option>
                <option>AI</option>
              </select>
            </div>

            <div className="mt-[10px] overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr className="h-[29px] bg-[#e2e9f4] text-left text-[13.8px] font-medium text-[#1a1d36]">
                    <th className="px-[8px]">Session</th>
                    <th className="px-[8px]">Subject</th>
                    <th className="px-[8px]">Mode</th>
                    <th className="px-[8px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="h-[36px] border-b border-[#dce4ee] text-[14.2px] text-[#1a1d36]">
                      <td className="px-[8px]">{r.id}</td>
                      <td className="px-[8px]">{r.subject}</td>
                      <td className="px-[8px]">
                        <UserPill tone={r.tone}>{r.mode}</UserPill>
                      </td>
                      <td className="px-[8px]">
                        <button
                          type="button"
                          onClick={() => setSelectedId(r.id)}
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

            <p className="mt-[8px] text-[13.8px] font-semibold text-[#1e43a8]">Usage &amp; escalation</p>
            <div className="mt-[2px]">
              <UserKVList
                rows={[
                  ["Voice / text", "Voice / text separately"],
                  ["Session duration", "02:35 · demo"],
                  ["AI cost", "Not loaded · demo"],
                  ["Source", "Approved SOP only"],
                ]}
              />
            </div>
            <div className="mt-[8px] flex flex-wrap gap-[7px]">
              <button type="button" onClick={() => show("Usage telemetry panel opened.")} className={userPrimaryBtn}>Review usage</button>
              <button type="button" onClick={() => show("Incorrect AI reply flagged.")} className={userOutlineBtn}>Report incorrect reply</button>
            </div>
          </UserPanel>

          <UserPanel title={`Human assistance · ${selectedId}`}>
            <div className="rounded-[6px] border border-[#d0e0f5] bg-[#eef4fc] px-[10px] py-[7px]">
              <p className={`text-[13.8px] font-semibold ${userInk}`}>Visitor</p>
              <p className={`text-[13.8px] ${userInk}`}>What documents are needed for free cremation support?</p>
            </div>
            <div className="mt-[6px] rounded-[6px] border border-[#cde6d4] bg-[#eaf7ee] px-[10px] py-[7px]">
              <p className={`text-[13.8px] font-semibold ${userInk}`}>AI suggestion · review</p>
              <p className={`text-[13.8px] ${userInk}`}>
                Requirements depend on the case category. Please confirm the location and contact details; our team will guide you.
              </p>
            </div>
            <div className="mt-[6px]">
              <UserKVList
                rows={[
                  ["Source", "SOP-004 · approved version"],
                  ["AI auto-reply", <UserPill key="ar" tone="amber">Paused</UserPill>],
                  ["Current owner", "User 07"],
                ]}
              />
            </div>
            <textarea
              rows={2}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write or dictate your reply"
              className={`${userTextareaCls} mt-[8px] h-[54px] resize-none`}
            />
            <div className="mt-[8px] flex flex-wrap gap-[6px]">
              <button type="button" onClick={() => show(`Reviewed reply sent for ${selectedId}.`)} className={userPrimaryBtn}>Send reviewed reply</button>
              <button type="button" onClick={() => show(`${selectedId} escalated to Admin.`)} className={userOutlineBtn}>Escalate to Admin</button>
              <button type="button" onClick={() => show("AI resume handover requested.")} className={userOutlineBtn}>Request AI resume</button>
            </div>
          </UserPanel>
        </div>

        <UserPanel title="Safety rules">
          <div className="rounded-[6px] border border-[#dce6f5] bg-[#eef4fc] px-[10px] py-[5px] text-[13.8px] text-[#1a1d36]">
            Human help remains available when AI limits are reached. No service promise before verification.
          </div>
          <div className="mt-[6px]">
            <UserFlowSteps steps={["Review", "Respond", "Link request", "Escalate if needed"]} />
          </div>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
