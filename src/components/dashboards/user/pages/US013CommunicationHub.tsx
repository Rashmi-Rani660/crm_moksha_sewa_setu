"use client";

import { useRouter } from "next/navigation";
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
} from "@/components/dashboards/user/UserScreenKit";
import { userRoutes } from "@/components/dashboards/user/routes";

const queueRows = [
  { channel: "Email", subject: "Supporting document received", age: "12 min", status: "Pending", tone: "amber" as const, action: "Open", primary: true, href: userRoutes.officialEmail },
  { channel: "WhatsApp", subject: "Family assistance", age: "8 min", status: "Urgent", tone: "red" as const, action: "Reply", href: userRoutes.whatsappDesk },
  { channel: "Call", subject: "Scheduled callback", age: "15 min", status: "Due", tone: "amber" as const, action: "Call", href: userRoutes.callingFollowups },
  { channel: "Team", subject: "Shift handover", age: "20 min", status: "Unread", tone: "blue" as const, action: "View", href: userRoutes.communicationHub },
  { channel: "Donor", subject: "Receipt enquiry", age: "25 min", status: "Pending", tone: "amber" as const, action: "Open", href: userRoutes.officialEmail },
];

export default function US013CommunicationHub() {
  const router = useRouter();
  const { show, node } = useUserNotice();
  const [q, setQ] = useState("");
  const [channel, setChannel] = useState("All channels");

  const query = q.trim().toLowerCase();
  const rows = queueRows.filter((r) => {
    const matchQ = !query || r.subject.toLowerCase().includes(query) || r.channel.toLowerCase().includes(query);
    const matchC = channel === "All channels" || r.channel === channel;
    return matchQ && matchC;
  });

  return (
    <UserFrame active="communication-hub">
      <UserHeader code="US-013" title="Communication & Collaboration Hub" />
      <UserKpiRow
        items={[
          { value: "06", label: "Pending replies", tone: "orange" },
          { value: "02", label: "Pending emails", tone: "blue" },
          { value: "04", label: "WhatsApp replies", tone: "green" },
          { value: "03", label: "Callbacks", tone: "orange" },
          { value: "01", label: "Urgent message", tone: "red", valueRed: true },
          { value: "02", label: "Team updates", tone: "blue" },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-columns:771fr_385fr] lg:[grid-template-rows:335fr_163fr] lg:gap-[12px]">
        <UserPanel title="My communication queue">
          <div className="flex flex-wrap gap-[8px] sm:flex-nowrap">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search conversation"
              aria-label="Search conversation"
              className={`${userInputCls} flex-1`}
            />
            <select
              aria-label="Filter channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="h-[31px] w-full rounded-[6px] border border-[#c9d2e0] bg-white px-[10px] text-[13.8px] text-[#1a1d36] outline-none sm:w-[220px]"
            >
              <option>All channels</option>
              <option>Email</option>
              <option>WhatsApp</option>
              <option>Call</option>
              <option>Team</option>
              <option>Donor</option>
            </select>
          </div>

          <div className="mt-[10px] overflow-x-auto">
            <table className="w-full min-w-[580px] border-collapse">
              <thead>
                <tr className="h-[29px] bg-[#e2e9f4] text-left text-[13.8px] font-medium text-[#1a1d36]">
                  <th className="px-[8px]">Channel</th>
                  <th className="px-[8px]">Subject</th>
                  <th className="px-[8px]">Age</th>
                  <th className="px-[8px]">Status</th>
                  <th className="px-[8px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.channel}-${r.subject}`} className="h-[36px] border-b border-[#dce4ee] text-[14.2px] text-[#1a1d36]">
                    <td className="whitespace-nowrap px-[8px]">{r.channel}</td>
                    <td className="whitespace-nowrap px-[8px]">{r.subject}</td>
                    <td className="whitespace-nowrap px-[8px]">{r.age}</td>
                    <td className="whitespace-nowrap px-[8px]">
                      <UserPill tone={r.tone}>{r.status}</UserPill>
                    </td>
                    <td className="whitespace-nowrap px-[8px]">
                      <button
                        type="button"
                        onClick={() => (r.channel === "Team" ? show("Opened team handover message.") : router.push(r.href))}
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
            <button type="button" onClick={() => show("New internal message composer opened.")} className={userPrimaryBtn}>New internal message</button>
            <button type="button" onClick={() => show("Official file sharing dialog opened.")} className={userOutlineBtn}>Share official file</button>
          </div>
        </UserPanel>

        <UserPanel title="Channel shortcuts">
          <UserKVList
            rows={[
              ["Official email", <button key="em" type="button" onClick={() => router.push(userRoutes.officialEmail)} className={userPrimaryBtn}>Open inbox</button>],
              ["WhatsApp", <button key="wa" type="button" onClick={() => router.push(userRoutes.whatsappDesk)} className={userOutlineBtn}>Open chats</button>],
              ["Calling", <button key="cl" type="button" onClick={() => router.push(userRoutes.callingFollowups)} className={userOutlineBtn}>Follow-ups</button>],
              ["AI chatbot", <button key="ai" type="button" onClick={() => router.push(userRoutes.aiChatbot)} className={userOutlineBtn}>Human assistance</button>],
              ["Internal team", "2 unread"],
              ["Donor coordination", "Assigned enquiries"],
            ]}
          />
          <p className="mt-[8px] text-[13px] text-[#4a5468]">
            Official channels only; do not send sensitive details without permission.
          </p>
        </UserPanel>

        <UserPanel title="Internal collaboration">
          <div className="rounded-[6px] border border-[#dce6f5] bg-[#eef4fc] px-[10px] py-[6px]">
            <p className={`text-[13.8px] font-semibold ${userInk}`}>Admin 01 · 10:05</p>
            <p className={`text-[13.8px] ${userInk}`}>Please acknowledge the pending document review.</p>
          </div>
          <div className="mt-[8px] flex gap-[7px]">
            <button type="button" onClick={() => show("Reply box opened.")} className={userPrimaryBtn}>Reply</button>
            <button type="button" onClick={() => show("Handover message acknowledged.")} className={userOutlineBtn}>Acknowledge</button>
          </div>
          <p className="mt-[6px] text-[13px] text-[#4a5468]">
            Official files and internal messages stay linked to the assigned record.
          </p>
        </UserPanel>

        <UserPanel title="Priority handover">
          <UserKVList
            rows={[
              ["Unresolved enquiry", "COM-003"],
              ["Owner", "User 07"],
              ["Handover", "Awaiting acceptance"],
            ]}
          />
          <div className="mt-[8px]">
            <button type="button" onClick={() => show("Viewing handover COM-003.")} className={userPrimaryBtn}>View handover</button>
          </div>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
