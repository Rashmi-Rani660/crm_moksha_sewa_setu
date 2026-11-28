"use client";

import { useState } from "react";
import {
  UserFrame,
  UserHeader,
  UserKVList,
  UserKpiRow,
  UserPanel,
  useUserNotice,
  userInk,
  userInputCls,
  userOutlineBtn,
  userPrimaryBtn,
  userTextareaCls,
} from "@/components/dashboards/user/UserScreenKit";

const folders = [
  { name: "Inbox", count: "08" },
  { name: "Unread", count: "04" },
  { name: "Assigned to me", count: "03" },
  { name: "Drafts", count: "01" },
  { name: "Sent", count: "" },
  { name: "Scheduled", count: "" },
  { name: "Archive", count: "" },
  { name: "Spam / junk", count: "" },
];

const threads = [
  { id: "MS-26-1101", from: "Family 01 · 10:24", subject: "Request for free cremation support · MS-26-1101", body: "Please guide us regarding eligibility for free last-rites assistance." },
  { id: "MS-26-1100", from: "Hospital desk · 10:17", subject: "Supporting document received · MS-26-1100", body: "Hospital release document attached for verification." },
  { id: "DON-078", from: "Donor 01 · 09:32", subject: "Donation receipt enquiry", body: "Kindly share the status of our online donation receipt." },
  { id: "OPS-019", from: "Operations · 09:18", subject: "Case verification update", body: "Verification checklist updated for today's assigned cases." },
];

export default function US014OfficialEmail() {
  const { show, node } = useUserNotice();
  const [selectedId, setSelectedId] = useState("MS-26-1101");
  const [q, setQ] = useState("");
  const [reply, setReply] = useState("");

  const activeThread = threads.find((t) => t.id === selectedId) ?? threads[0];
  const filtered = threads.filter((t) => !q.trim() || t.subject.toLowerCase().includes(q.toLowerCase()) || t.from.toLowerCase().includes(q.toLowerCase()));

  return (
    <UserFrame active="communication-hub">
      <UserHeader code="US-014" title="Official Email Workspace" />
      <UserKpiRow
        items={[
          { value: "02", label: "Awaiting reply", tone: "orange" },
          { value: "04", label: "Unread", tone: "blue" },
          { value: "03", label: "Assigned threads", tone: "blue" },
          { value: "01", label: "Draft", tone: "purple" },
          { value: "00", label: "Failed sends", tone: "green" },
          { value: "08", label: "Inbox today", tone: "blue" },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-rows:390fr_108fr] lg:gap-[12px]">
        <div className="grid min-h-0 grid-cols-1 gap-3 lg:[grid-template-columns:215fr_405fr_530fr] lg:gap-[12px]">
          <UserPanel title="Mail folders">
            <button type="button" onClick={() => show("New official email composer opened.")} className={userPrimaryBtn}>
              Compose
            </button>
            <div className="mt-[8px]">
              <UserKVList rows={folders.map((f) => [f.name, f.count])} />
            </div>
          </UserPanel>

          <UserPanel title="Assigned inbox · sample threads">
            <div className="flex gap-[8px]">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search mail"
                aria-label="Search mail"
                className={`${userInputCls} flex-1`}
              />
              <select aria-label="Filter mail" className="h-[31px] w-[110px] rounded-[6px] border border-[#c9d2e0] bg-white px-[8px] text-[13.8px] text-[#1a1d36]">
                <option>All</option>
                <option>Unread</option>
                <option>Assigned</option>
              </select>
            </div>
            <div className="mt-[8px] flex flex-col gap-[6px]">
              {filtered.map((t) => {
                const on = t.id === selectedId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedId(t.id)}
                    className={`rounded-[6px] border px-[10px] py-[7px] text-left transition-colors ${
                      on ? "border-[#b5cbe9] bg-[#eaf2fc]" : "border-[#e1e7f0] bg-white hover:bg-[#f4f7fc]"
                    }`}
                  >
                    <p className={`text-[13.8px] font-semibold ${userInk}`}>{t.from}</p>
                    <p className={`truncate text-[13.8px] ${userInk}`}>{t.subject}</p>
                  </button>
                );
              })}
            </div>
            <p className="mt-[8px] text-[13px] text-[#4a5468]">Showing 4 sample threads · use filters for assigned work.</p>
          </UserPanel>

          <UserPanel title={`Selected thread · ${activeThread.id}`}>
            <UserKVList
              rows={[
                ["From", `${activeThread.from.split(" · ")[0]} · masked`],
                ["Owner", "User 07"],
                ["Mailbox", "Operations · official"],
              ]}
            />
            <div className="mt-[8px] rounded-[6px] border border-[#d0e0f5] bg-[#eef4fc] px-[10px] py-[7px]">
              <p className={`text-[13.8px] font-semibold ${userInk}`}>Received · 10:24</p>
              <p className={`text-[13.8px] ${userInk}`}>{activeThread.body}</p>
            </div>
            <div className="mt-[6px] rounded-[6px] border border-[#cde6d4] bg-[#eaf7ee] px-[10px] py-[7px]">
              <p className={`text-[13.8px] font-semibold ${userInk}`}>AI draft · review required</p>
              <p className={`text-[13.8px] ${userInk}`}>We will review the request and guide you through the next steps.</p>
            </div>
            <textarea
              rows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write reply..."
              className={`${userTextareaCls} mt-[8px] h-[64px] resize-none`}
            />
            <div className="mt-[8px] flex flex-wrap gap-[6px]">
              <button type="button" onClick={() => show("Reply sent via official mailbox (demo).")} className={userPrimaryBtn}>Reply</button>
              <button type="button" onClick={() => show("Forward selected.")} className={userOutlineBtn}>Forward</button>
              <button type="button" onClick={() => show("CC / BCC fields toggled.")} className={userOutlineBtn}>CC / BCC</button>
              <button type="button" onClick={() => show("Attachment scan queued.")} className={userOutlineBtn}>Attach</button>
              <button type="button" onClick={() => show("Approved email templates opened.")} className={userOutlineBtn}>Template</button>
              <button type="button" onClick={() => setReply("We will review the request and guide you through the next steps.")} className={userOutlineBtn}>AI draft</button>
              <button type="button" onClick={() => show("Linked to case.")} className={userOutlineBtn}>Link case</button>
            </div>
          </UserPanel>
        </div>

        <UserPanel title="Thread controls">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-3 gap-x-[24px] text-[13.8px] text-[#1a1d36]">
              <div>
                <p className="text-[#4a5468]">Attachment scan</p>
                <p>Required</p>
              </div>
              <div>
                <p className="text-[#4a5468]">Scheduled sending</p>
                <p>Authorised only</p>
              </div>
              <div>
                <p className="text-[#4a5468]">Signature</p>
                <p>Official mailbox</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-[7px]">
              <button type="button" onClick={() => show("Email draft saved.")} className={userPrimaryBtn}>Save draft</button>
              <button type="button" onClick={() => show("Send schedule dialog opened.")} className={userOutlineBtn}>Schedule</button>
              <button type="button" onClick={() => show("Internal note added.")} className={userOutlineBtn}>Internal note</button>
            </div>
          </div>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
