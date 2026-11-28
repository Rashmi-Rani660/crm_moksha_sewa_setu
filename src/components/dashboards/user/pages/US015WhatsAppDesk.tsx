"use client";

import { useState } from "react";
import {
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

const chats = [
  { id: "WA-001", name: "WA-001 · Family 01", meta: "MS-26-1101 · Urgent · 10:24", contact: "Family 01 · masked", msg: "We need assistance for the final rites." },
  { id: "WA-004", name: "WA-004 · Family 03", meta: "MS-26-1099 · Pending · 09:42", contact: "Family 03 · masked", msg: "Sharing address confirmation for Ghaziabad." },
  { id: "WA-005", name: "WA-005 · Donor 01", meta: "DON-078 · Receipt enquiry · 09:30", contact: "Donor 01 · masked", msg: "Please confirm our online receipt status." },
];

export default function US015WhatsAppDesk() {
  const { show, node } = useUserNotice();
  const [selectedId, setSelectedId] = useState("WA-001");
  const [q, setQ] = useState("");
  const [reply, setReply] = useState("");

  const activeChat = chats.find((c) => c.id === selectedId) ?? chats[0];
  const filtered = chats.filter((c) => !q.trim() || c.name.toLowerCase().includes(q.toLowerCase()) || c.meta.toLowerCase().includes(q.toLowerCase()));

  return (
    <UserFrame active="communication-hub">
      <UserHeader code="US-015" title="WhatsApp Business Desk" />
      <UserKpiRow
        items={[
          { value: "04", label: "Pending replies", tone: "orange" },
          { value: "03", label: "Assigned chats", tone: "blue" },
          { value: "01", label: "Urgent", tone: "red", valueRed: true },
          { value: "02", label: "Human handling", tone: "green" },
          { value: "Delayed", label: "Sync status", tone: "orange" },
          { value: "01", label: "Failed send", tone: "red", valueRed: true },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-rows:390fr_108fr] lg:gap-[12px]">
        <div className="grid min-h-0 grid-cols-1 gap-3 lg:[grid-template-columns:215fr_405fr_530fr] lg:gap-[12px]">
          <UserPanel title="Chat folders">
            <button type="button" onClick={() => show("Template-based WhatsApp initiation opened.")} className={userPrimaryBtn}>
              New message
            </button>
            <div className="mt-[8px]">
              <UserKVList
                rows={[
                  ["Assigned chats", "03"],
                  ["Pending replies", "04"],
                  ["Urgent", "01"],
                  ["Resolved", ""],
                  ["Templates", ""],
                  ["Media", ""],
                  ["Failed sends", "01"],
                  ["AI / human control", "Human active"],
                ]}
              />
            </div>
          </UserPanel>

          <UserPanel title="Official WhatsApp inbox · sample threads">
            <div className="flex gap-[8px]">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search chats"
                aria-label="Search chats"
                className={`${userInputCls} flex-1`}
              />
              <select aria-label="Filter chats" className="h-[31px] w-[110px] rounded-[6px] border border-[#c9d2e0] bg-white px-[8px] text-[13.8px] text-[#1a1d36]">
                <option>All</option>
                <option>Urgent</option>
                <option>Pending</option>
              </select>
            </div>
            <div className="mt-[8px] flex flex-col gap-[6px]">
              {filtered.map((c) => {
                const on = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`rounded-[6px] border px-[10px] py-[7px] text-left transition-colors ${
                      on ? "border-[#b5cbe9] bg-[#eaf2fc]" : "border-[#e1e7f0] bg-white hover:bg-[#f4f7fc]"
                    }`}
                  >
                    <p className={`text-[13.8px] font-semibold ${userInk}`}>{c.name}</p>
                    <p className={`truncate text-[13.8px] ${userInk}`}>{c.meta}</p>
                  </button>
                );
              })}
            </div>
            <p className="mt-[8px] text-[13px] text-[#4a5468]">Pending replies count messages; assigned chats count conversations.</p>
          </UserPanel>

          <UserPanel title={`Conversation · ${activeChat.id}`}>
            <UserKVList
              rows={[
                ["Contact", activeChat.contact],
                ["Handling", <UserPill key="hm" tone="green">Human active</UserPill>],
                ["AI auto-reply", "Paused"],
                ["Messaging window", "Unverified · sending blocked"],
              ]}
            />
            <div className="mt-[8px] rounded-[6px] border border-[#d0e0f5] bg-[#eef4fc] px-[10px] py-[7px]">
              <p className={`text-[13.8px] font-semibold ${userInk}`}>Family 01 · 10:24</p>
              <p className={`text-[13.8px] ${userInk}`}>{activeChat.msg}</p>
            </div>
            <div className="mt-[6px] rounded-[6px] border border-[#cde6d4] bg-[#eaf7ee] px-[10px] py-[7px]">
              <p className={`text-[13.8px] font-semibold ${userInk}`}>User 07 · draft</p>
              <p className={`text-[13.8px] ${userInk}`}>We are here to guide you. May we confirm the location and required documents?</p>
            </div>
            <textarea
              rows={2}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type a reply..."
              className={`${userTextareaCls} mt-[8px] h-[54px] resize-none`}
            />
            <div className="mt-[8px] flex flex-wrap gap-[6px]">
              <button type="button" disabled className={userPrimaryBtn}>Send reply</button>
              <button type="button" onClick={() => show("Approved WhatsApp templates opened.")} className={userOutlineBtn}>Use template</button>
              <button type="button" onClick={() => show("Media attachment selector opened.")} className={userOutlineBtn}>Media</button>
              <button type="button" onClick={() => show("Linked to case.")} className={userOutlineBtn}>Link case</button>
              <button type="button" onClick={() => show("Internal note saved.")} className={userOutlineBtn}>Internal note</button>
            </div>
          </UserPanel>
        </div>

        <UserPanel title="Delivery & consent">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-3 gap-x-[24px] text-[13.8px] text-[#1a1d36]">
              <div>
                <p className="text-[#4a5468]">Opt-in / window</p>
                <p>Verify before sending</p>
              </div>
              <div>
                <p className="text-[#4a5468]">Last sync</p>
                <p>Delayed · demo</p>
              </div>
              <div>
                <p className="text-[#4a5468]">Failed sends</p>
                <p>01 · review</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-[7px]">
              <button type="button" onClick={() => show("Delivery status log opened.")} className={userPrimaryBtn}>Review delivery</button>
              <button type="button" onClick={() => show("Handover requested.")} className={userOutlineBtn}>Request handover</button>
            </div>
          </div>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
