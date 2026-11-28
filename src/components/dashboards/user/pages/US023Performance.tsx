"use client";

/**
 * US-023 — My Performance & Recognition.
 * Matched to the US-023 design reference with Super Admin spacing and left-aligned tables.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  UserFrame,
  UserHeader,
  UserKVList,
  UserKpiRow,
  UserPanel,
  UserPill,
  UserProgressBar,
  UserTabs,
  useUserNotice,
  userInk,
  userOutlineBtn,
  userPrimaryBtn,
} from "@/components/dashboards/user/UserScreenKit";
import { userRoutes } from "@/components/dashboards/user/routes";

const tabs = ["My performance", "Coaching", "Recognition"] as const;
type Tab = (typeof tabs)[number];

const indicators = [
  { indicator: "Completed today", current: "04", review: "CRM activity" },
  { indicator: "Overdue tasks", current: "02", review: "Review with Admin" },
  { indicator: "Quality feedback", current: "Reviewed", review: "View comments" },
] as const;

export default function US023Performance() {
  const router = useRouter();
  const { show, node } = useUserNotice();
  const [tab, setTab] = useState<Tab>("My performance");
  const [acknowledged, setAcknowledged] = useState(false);

  const showPerf = tab === "My performance";
  const showRecog = tab === "My performance" || tab === "Coaching" || tab === "Recognition";

  return (
    <UserFrame active="my-performance">
      <UserHeader code="US-023" title="My Performance & Recognition (US-023)" />

      <UserKpiRow
        items={[
          { value: "85%", label: "Task completion", tone: "blue" },
          { value: "91%", label: "SLA compliance", tone: "green" },
          { value: "90%", label: "Current learning", tone: "blue" },
          { value: "04", label: "Completed today", tone: "orange" },
          { value: "02", label: "Recognition records", tone: "green" },
          { value: "01", label: "Coaching follow-up", tone: "orange" },
        ]}
      />

      <UserTabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px] lg:mt-[7px]">
        {/* Top Row */}
        <div
          className={`grid gap-[10px] lg:min-h-0 lg:flex-[365_1_0] ${
            showPerf && showRecog ? "lg:grid-cols-[54fr_46fr]" : "lg:grid-cols-1"
          } lg:[grid-template-rows:minmax(0,1fr)]`}
        >
          {showPerf && (
            <UserPanel title="My work performance · This week">
              <div className="flex h-full flex-col gap-[9px]">
                <div className="flex flex-col gap-[7px]">
                  <div>
                    <div className="mb-[3px] flex items-center justify-between text-[13.5px] font-medium text-[#1a1d36]">
                      <span>Task completion</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <UserProgressBar pct={85} />
                  </div>
                  <div>
                    <div className="mb-[3px] flex items-center justify-between text-[13.5px] font-medium text-[#1a1d36]">
                      <span>SLA compliance</span>
                      <span className="font-semibold">91%</span>
                    </div>
                    <UserProgressBar pct={91} />
                  </div>
                  <div>
                    <div className="mb-[3px] flex items-center justify-between text-[13.5px] font-medium text-[#1a1d36]">
                      <span>Current course progress</span>
                      <span className="font-semibold">90%</span>
                    </div>
                    <UserProgressBar pct={90} />
                  </div>
                </div>

                <div className="overflow-auto rounded-[6px] border border-[#e1e5ee] bg-white">
                  <table className="w-full border-collapse text-left text-[13.5px]">
                    <thead className="sticky top-0 z-10 border-b border-[#e1e5ee] bg-[#f4f7fc] text-[13px] font-semibold text-[#1a1d36]">
                      <tr>
                        <th className="px-[10px] py-[7px] text-left">Indicator</th>
                        <th className="px-[10px] py-[7px] text-left">Current</th>
                        <th className="px-[10px] py-[7px] text-left">Review</th>
                      </tr>
                    </thead>
                    <tbody className={userInk}>
                      {indicators.map((r) => (
                        <tr key={r.indicator} className="border-b border-[#eef0f5] last:border-0 even:bg-[#f7f9fd] hover:bg-[#eef2ff]">
                          <td className="px-[10px] py-[7px] font-medium">{r.indicator}</td>
                          <td className="px-[10px] py-[7px] font-semibold">{r.current}</td>
                          <td className="px-[10px] py-[7px]">{r.review}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-auto flex flex-wrap gap-[8px] pt-[2px]">
                  <button type="button" onClick={() => show("Verified work history opened (demo).")} className={userPrimaryBtn}>
                    View work history
                  </button>
                  <button type="button" onClick={() => show("Admin quality comments opened (demo).")} className={userOutlineBtn}>
                    Review feedback
                  </button>
                </div>
              </div>
            </UserPanel>
          )}

          {showRecog && (
            <UserPanel title="Recognition & coaching">
              <div className="flex h-full flex-col gap-[8px]">
                <div className="rounded-[6px] border border-[#dce6f7] bg-[#f4f7fc] px-[10px] py-[6px] text-[13.5px] font-medium text-[#1a1d36]">
                  Service milestone · Verified contribution
                </div>

                <UserKVList
                  rows={[
                    ["Recognition", "Compassionate communication"],
                    ["Status", <UserPill key="st" tone="green">Approved</UserPill>],
                    ["Publicity consent", "Required before publication"],
                    ["Next coaching", acknowledged ? "30 Nov · 11:00 (Acknowledged)" : "30 Nov · 11:00"],
                  ]}
                />

                <div className="rounded-[8px] border border-[#ead9ad] bg-[#fffdf6] px-[14px] py-[12px] text-center">
                  <p className="text-[11px] font-semibold tracking-[0.5px] text-[#7a5b00]">SEWA EXCELLENCE</p>
                  <p className="mt-[2px] text-[20px] font-bold text-[#1a1d36]">Appreciation</p>
                  <p className="text-[13.5px] font-medium text-[#1a1d36]">Demo User 07</p>
                  <p className="mt-[2px] text-[12px] text-[#5b6280]">Illustrative certificate preview</p>
                </div>

                <div className="mt-auto flex flex-wrap gap-[8px] pt-[2px]">
                  <button type="button" onClick={() => show("Recognition record & consent details opened (demo).")} className={userPrimaryBtn}>
                    View recognition
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAcknowledged(true);
                      show("Coaching session acknowledged (demo).");
                    }}
                    className={userOutlineBtn}
                  >
                    Acknowledge coaching
                  </button>
                </div>
              </div>
            </UserPanel>
          )}
        </div>

        {/* Bottom Row */}
        <div className="grid gap-[10px] lg:min-h-0 lg:flex-[155_1_0] lg:grid-cols-[54fr_46fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <UserPanel title="My next improvement">
            <div className="flex h-full flex-col gap-[8px]">
              <UserKVList
                rows={[
                  ["Priority", "Complete overdue work"],
                  ["Learning", "Resume assigned course"],
                ]}
              />
              <div className="mt-auto flex flex-wrap gap-[8px] pt-[2px]">
                <button type="button" onClick={() => router.push(userRoutes.myTasks)} className={userPrimaryBtn}>
                  Open my tasks
                </button>
                <button type="button" onClick={() => router.push(userRoutes.training)} className={userOutlineBtn}>
                  Resume learning
                </button>
              </div>
            </div>
          </UserPanel>

          <UserPanel title="Review principles">
            <UserKVList
              rows={[
                ["Performance source", "Verified work records"],
                ["AI scores", "Human review required"],
                ["Correction", "Request a review"],
              ]}
            />
          </UserPanel>
        </div>
      </div>

      {node}
    </UserFrame>
  );
}
