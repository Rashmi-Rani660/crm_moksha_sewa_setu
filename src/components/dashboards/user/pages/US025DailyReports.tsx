"use client";

/**
 * US-025 — Daily Reports, Settings & Support.
 * Matched to the US-025 design reference with Super Admin spacing and left-aligned tables.
 */

import { useState } from "react";
import {
  UserFlowSteps,
  UserFrame,
  UserHeader,
  UserKVList,
  UserKpiRow,
  UserPanel,
  UserPill,
  UserTabs,
  useUserNotice,
  userInk,
  userOutlineBtn,
  userPrimaryBtn,
  userTextareaCls,
} from "@/components/dashboards/user/UserScreenKit";

const tabs = ["Daily report", "My preferences", "Support & complaints"] as const;
type Tab = (typeof tabs)[number];

const activityRows = [
  { activity: "Tasks completed", source: "Task history", count: "04" },
  { activity: "Overdue tasks", source: "Task queue", count: "02" },
  { activity: "Assigned cases", source: "Case register", count: "03" },
  { activity: "Pending replies", source: "Communication hub", count: "06" },
] as const;

const ticketRows = [
  { ticket: "SUP-007", issue: "Document upload", status: "In review" },
] as const;

export default function US025DailyReports() {
  const { show, node } = useUserNotice();
  const [tab, setTab] = useState<Tab>("Daily report");
  const [remarks, setRemarks] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const showReport = tab === "Daily report";
  const showPrefs = tab === "Daily report" || tab === "My preferences" || tab === "Support & complaints";

  return (
    <UserFrame active="help-support">
      <UserHeader code="US-025" title="Daily Reports, Settings & Support (US-025)" />

      <UserKpiRow
        items={[
          { value: "04", label: "Tasks completed today", tone: "blue" },
          { value: "02", label: "Overdue tasks", tone: "orange" },
          { value: "03", label: "Assigned cases", tone: "blue" },
          { value: submitted ? "00" : "01", label: "Report draft", tone: "orange" },
          { value: "01", label: "Open support ticket", tone: "orange" },
          { value: "02", label: "Unread instructions", tone: "blue" },
        ]}
      />

      <UserTabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px] lg:mt-[7px]">
        {/* Top Row */}
        <div
          className={`grid gap-[10px] lg:min-h-0 lg:flex-[380_1_0] ${
            showReport && showPrefs ? "lg:grid-cols-[54fr_46fr]" : "lg:grid-cols-1"
          } lg:[grid-template-rows:minmax(0,1fr)]`}
        >
          {showReport && (
            <UserPanel title="Daily work report · 28 Nov 2026">
              <div className="flex h-full flex-col gap-[7px]">
                <div className="rounded-[6px] border border-[#dce6f7] bg-[#f4f7fc] px-[10px] py-[5px] text-[13.5px] font-medium text-[#1a1d36]">
                  Auto-generated draft · review before submission
                </div>

                <div className="overflow-auto rounded-[6px] border border-[#e1e5ee] bg-white">
                  <table className="w-full border-collapse text-left text-[13.5px]">
                    <thead className="sticky top-0 z-10 border-b border-[#e1e5ee] bg-[#f4f7fc] text-[13px] font-semibold text-[#1a1d36]">
                      <tr>
                        <th className="px-[10px] py-[6px] text-left">Activity</th>
                        <th className="px-[10px] py-[6px] text-left">Source</th>
                        <th className="px-[10px] py-[6px] text-left">Count</th>
                      </tr>
                    </thead>
                    <tbody className={userInk}>
                      {activityRows.map((r) => (
                        <tr key={r.activity} className="border-b border-[#eef0f5] last:border-0 even:bg-[#f7f9fd] hover:bg-[#eef2ff]">
                          <td className="px-[10px] py-[6px] font-medium">{r.activity}</td>
                          <td className="px-[10px] py-[6px]">{r.source}</td>
                          <td className="px-[10px] py-[6px] font-semibold">{r.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <label htmlFor="daily-remarks" className="mb-[3px] block text-[13.5px] font-medium text-[#1a1d36]">
                    Additional remarks
                  </label>
                  <textarea
                    id="daily-remarks"
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add only missing context or use voice input"
                    className={`${userTextareaCls} min-h-[54px] resize-none`}
                  />
                </div>

                <UserKVList
                  rows={[
                    [
                      "Report status",
                      <UserPill key="rs" tone={submitted ? "green" : "amber"}>
                        {submitted ? "Submitted" : "Draft"}
                      </UserPill>,
                    ],
                    ["Reporting Admin", "Assigned Admin"],
                    ["Last generated", "10:24 · demo"],
                  ]}
                />

                <div className="mt-auto flex flex-wrap gap-[8px] pt-[2px]">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(true);
                      show("Daily report submitted for Admin review (demo).");
                    }}
                    className={userPrimaryBtn}
                  >
                    Review &amp; submit report
                  </button>
                  <button type="button" onClick={() => show("Daily report draft saved (demo).")} className={userOutlineBtn}>
                    Save draft
                  </button>
                  <button type="button" onClick={() => show("Voice note input ready (demo).")} className={userOutlineBtn}>
                    Voice note
                  </button>
                </div>
              </div>
            </UserPanel>
          )}

          {showPrefs && (
            <UserPanel title="My preferences & support">
              <div className="flex h-full flex-col gap-[7px]">
                <UserKVList
                  rows={[
                    ["Language", "English / Hindi"],
                    ["Notifications", "Personal preferences"],
                    ["Emergency alerts", "Always available"],
                    ["MFA", "Mandatory"],
                    ["Session management", "Own sessions only"],
                  ]}
                />

                <div className="flex flex-wrap gap-[8px]">
                  <button type="button" onClick={() => show("Personal notification & language preferences opened (demo).")} className={userPrimaryBtn}>
                    Edit preferences
                  </button>
                  <button type="button" onClick={() => show("Active user sessions list opened (demo).")} className={userOutlineBtn}>
                    Manage own sessions
                  </button>
                </div>

                <p className="pt-[2px] text-[13.5px] font-semibold text-[#1a1d36]">My support tickets</p>

                <div className="overflow-auto rounded-[6px] border border-[#e1e5ee] bg-white">
                  <table className="w-full border-collapse text-left text-[13.5px]">
                    <thead className="sticky top-0 z-10 border-b border-[#e1e5ee] bg-[#f4f7fc] text-[13px] font-semibold text-[#1a1d36]">
                      <tr>
                        <th className="px-[10px] py-[6px] text-left">Ticket</th>
                        <th className="px-[10px] py-[6px] text-left">Issue</th>
                        <th className="px-[10px] py-[6px] text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className={userInk}>
                      {ticketRows.map((t) => (
                        <tr key={t.ticket} className="border-b border-[#eef0f5] last:border-0 even:bg-[#f7f9fd]">
                          <td className="px-[10px] py-[6px] font-medium">{t.ticket}</td>
                          <td className="px-[10px] py-[6px]">{t.issue}</td>
                          <td className="px-[10px] py-[6px]">
                            <UserPill tone="amber">{t.status}</UserPill>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap gap-[8px]">
                  <button type="button" onClick={() => show("Raise support ticket dialog opened (demo).")} className={userPrimaryBtn}>
                    Raise support ticket
                  </button>
                  <button type="button" onClick={() => show("Confidential complaint form opened — routed independently (demo).")} className={userOutlineBtn}>
                    Submit confidential complaint
                  </button>
                </div>

                <div className="mt-auto">
                  <UserKVList
                    rows={[
                      ["Complaint visibility", "Authorised reviewer only"],
                      ["Ticket updates", "Notifications"],
                    ]}
                  />
                </div>
              </div>
            </UserPanel>
          )}
        </div>

        {/* Bottom Row */}
        <div className="grid gap-[10px] lg:min-h-0 lg:flex-[140_1_0] lg:grid-cols-[54fr_46fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <UserPanel title="Before submitting">
            <div className="flex h-full items-center">
              <div className="w-full">
                <UserFlowSteps steps={["Auto draft", "Review", "Submit", "Admin acknowledgement"]} />
              </div>
            </div>
          </UserPanel>

          <UserPanel title="Quick support">
            <div className="flex h-full flex-col gap-[8px]">
              <UserKVList
                rows={[
                  ["Issue details", "Attach screenshot if needed"],
                  ["Escalation", "Responsible Admin"],
                ]}
              />
              <div className="mt-auto pt-[2px]">
                <button type="button" onClick={() => show("Support ticket history opened (demo).")} className={userPrimaryBtn}>
                  View ticket history
                </button>
              </div>
            </div>
          </UserPanel>
        </div>
      </div>

      {node}
    </UserFrame>
  );
}
