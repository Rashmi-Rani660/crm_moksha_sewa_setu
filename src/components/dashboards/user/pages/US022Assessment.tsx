"use client";

/**
 * US-022 — Assessment & Certification.
 * Matched to the US-022 design reference with Super Admin spacing and left-aligned tables.
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
} from "@/components/dashboards/user/UserScreenKit";

const tabs = ["My assessments", "Results", "Certificates"] as const;
type Tab = (typeof tabs)[number];

type AssessmentRow = {
  id: string;
  name: string;
  attempt: string;
  status: "Ready" | "Course pending" | "Passed";
  tone: "green" | "amber";
  action: "Start assessment" | "Open course" | "View result";
  primary?: boolean;
  format: string;
  passing: string;
  duration: string;
  practical: string;
};

const assessments: readonly AssessmentRow[] = [
  {
    id: "a1",
    name: "Communication practice",
    attempt: "1",
    status: "Ready",
    tone: "green",
    action: "Start assessment",
    primary: true,
    format: "MCQ + scenario",
    passing: "Approved course policy",
    duration: "20 min · demo",
    practical: "Required where applicable",
  },
  {
    id: "a2",
    name: "Legal clearance essentials",
    attempt: "—",
    status: "Course pending",
    tone: "amber",
    action: "Open course",
    format: "SOP checklist + MCQ",
    passing: "Approved course policy",
    duration: "15 min · demo",
    practical: "Prerequisite course required",
  },
  {
    id: "a3",
    name: "Privacy & data handling",
    attempt: "1",
    status: "Passed",
    tone: "green",
    action: "View result",
    format: "MCQ + policy check",
    passing: "Approved course policy",
    duration: "15 min · demo",
    practical: "Signed off",
  },
  {
    id: "a4",
    name: "Field safety induction",
    attempt: "1",
    status: "Passed",
    tone: "green",
    action: "View result",
    format: "Scenario + safety check",
    passing: "Approved course policy",
    duration: "20 min · demo",
    practical: "Signed off",
  },
];

export default function US022Assessment() {
  const { show, node } = useUserNotice();
  const [tab, setTab] = useState<Tab>("My assessments");
  const [selectedId, setSelectedId] = useState("a1");

  const visibleRows =
    tab === "Results" || tab === "Certificates"
      ? assessments.filter((a) => a.status === "Passed")
      : assessments;

  const selected = assessments.find((a) => a.id === selectedId) ?? assessments[0];
  const showQueue = tab === "My assessments" || tab === "Results";
  const showCert = tab === "My assessments" || tab === "Certificates";

  return (
    <UserFrame active="assessments">
      <UserHeader code="US-022" title="Assessment & Certification (US-022)" />

      <UserKpiRow
        items={[
          { value: "02", label: "Assessments due", tone: "blue" },
          { value: "01", label: "Ready to start", tone: "green" },
          { value: "01", label: "Prerequisite pending", tone: "orange" },
          { value: "02", label: "Passed", tone: "green" },
          { value: "01", label: "Certificate valid", tone: "blue" },
          { value: "00", label: "Expired", tone: "orange" },
        ]}
      />

      <UserTabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px] lg:mt-[7px]">
        {/* Top Row */}
        <div
          className={`grid gap-[10px] lg:min-h-0 lg:flex-[365_1_0] ${
            showQueue && showCert ? "lg:grid-cols-[54fr_46fr]" : "lg:grid-cols-1"
          } lg:[grid-template-rows:minmax(0,1fr)]`}
        >
          {showQueue && (
            <UserPanel title="Assessment queue">
              <div className="flex h-full flex-col gap-[8px]">
                <div className="overflow-auto rounded-[6px] border border-[#e1e5ee] bg-white">
                  <table className="w-full border-collapse text-left text-[13.5px]">
                    <thead className="sticky top-0 z-10 border-b border-[#e1e5ee] bg-[#f4f7fc] text-[13px] font-semibold text-[#1a1d36]">
                      <tr>
                        <th className="px-[10px] py-[7px] text-left">Assessment</th>
                        <th className="px-[10px] py-[7px] text-left">Attempt</th>
                        <th className="px-[10px] py-[7px] text-left">Status</th>
                        <th className="px-[10px] py-[7px] text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className={userInk}>
                      {visibleRows.map((a) => (
                        <tr
                          key={a.id}
                          onClick={() => setSelectedId(a.id)}
                          className={`cursor-pointer border-b border-[#eef0f5] last:border-0 even:bg-[#f7f9fd] hover:bg-[#eef2ff] ${
                            selectedId === a.id ? "ring-1 ring-inset ring-[#1d4fe0]/30" : ""
                          }`}
                        >
                          <td className="px-[10px] py-[7px] font-medium">{a.name}</td>
                          <td className="px-[10px] py-[7px] whitespace-nowrap">{a.attempt}</td>
                          <td className="px-[10px] py-[7px]">
                            <UserPill tone={a.tone}>{a.status}</UserPill>
                          </td>
                          <td className="px-[10px] py-[7px]">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(a.id);
                                show(`${a.name}: ${a.action} triggered (demo).`);
                              }}
                              className={a.primary ? `${userPrimaryBtn} h-[25px] px-[10px] text-[13px]` : `${userOutlineBtn} h-[25px] px-[10px] text-[13px]`}
                            >
                              {a.action}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[13.5px] font-medium text-[#4a5468]">
                  Selected assessment · {selected.name}
                </p>

                <UserKVList
                  rows={[
                    ["Format", selected.format],
                    ["Passing criteria", selected.passing],
                    ["Duration", selected.duration],
                    ["Practical review", selected.practical],
                  ]}
                />

                <div className="mt-auto flex flex-wrap gap-[8px] pt-[2px]">
                  <button type="button" onClick={() => show(`${selected.name}: assessment started (demo).`)} className={userPrimaryBtn}>
                    Start assessment
                  </button>
                  <button type="button" onClick={() => show("Assessment instructions opened (demo).")} className={userOutlineBtn}>
                    Review instructions
                  </button>
                </div>
              </div>
            </UserPanel>
          )}

          {showCert && (
            <UserPanel title="Certificate & result preview">
              <div className="flex h-full flex-col gap-[8px]">
                <div className="rounded-[8px] border border-[#ead9ad] bg-[#fffdf6] px-[14px] py-[14px] text-center">
                  <p className="text-[11px] font-semibold tracking-[0.5px] text-[#6b5b3e]">
                    NAMO GANGE TRUST · MOKSHA SEWA
                  </p>
                  <p className="mt-[4px] text-[20px] font-bold text-[#1a1d36]">
                    Certificate of Completion
                  </p>
                  <p className="mt-[4px] text-[14px] font-medium text-[#1a1d36]">Demo User 07</p>
                  <p className="mt-[2px] text-[13.5px] font-medium text-[#4a5468]">Privacy &amp; data handling</p>
                  <p className="mt-[4px] text-[12px] text-[#5b6280]">
                    Sample certificate · not valid for verification
                  </p>
                  <p className="mt-[2px] text-[12px] text-[#5b6280]">Issued after authorised approval</p>
                </div>

                <UserKVList
                  rows={[
                    ["Result", "Passed · demo"],
                    ["Certificate ID", "DEMO-CERT-007"],
                    ["Validity", "Policy-defined"],
                    ["Verification", "Authorised record required"],
                  ]}
                />

                <div className="mt-auto flex flex-wrap gap-[8px] pt-[2px]">
                  <button type="button" onClick={() => show("Opening DEMO-CERT-007 preview (demo).")} className={userPrimaryBtn}>
                    View certificate
                  </button>
                  <button type="button" onClick={() => show("Assessment review requested (demo).")} className={userOutlineBtn}>
                    Request review
                  </button>
                </div>
              </div>
            </UserPanel>
          )}
        </div>

        {/* Bottom Row */}
        <div className="grid gap-[10px] lg:min-h-0 lg:flex-[145_1_0] lg:grid-cols-[54fr_46fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <UserPanel title="Assessment process">
            <div className="flex h-full items-center">
              <div className="w-full">
                <UserFlowSteps steps={["Complete course", "Take assessment", "Review result", "Authorised sign-off"]} />
              </div>
            </div>
          </UserPanel>

          <UserPanel title="Need help?">
            <div className="flex h-full flex-col gap-[8px]">
              <UserKVList
                rows={[
                  ["Retest", "If eligible under policy"],
                  ["Appeal", "Submit to reviewer"],
                ]}
              />
              <div className="mt-auto pt-[2px]">
                <button type="button" onClick={() => show("Assessment review request submitted (demo).")} className={userPrimaryBtn}>
                  Request assessment review
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
