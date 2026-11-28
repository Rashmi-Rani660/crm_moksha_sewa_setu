"use client";

import { useRouter } from "next/navigation";
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
import { userRoutes } from "@/components/dashboards/user/routes";

const results = [
  { result: "Legal clearance SOP", source: "SOP-004 · approved", type: "SOPs", action: "View" },
  { result: "Case MS-26-1101", source: "Assigned case", type: "Cases", action: "Open" },
  { result: "Document verification", source: "TASK-026", type: "Tasks", action: "Open" },
];

const filters = ["All results", "Cases", "Tasks", "SOPs", "Documents"] as const;

export default function US018AiSmartSearch() {
  const router = useRouter();
  const { show, node } = useUserNotice();
  const [query, setQuery] = useState("Cremation clearance");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All results");
  const [prompt, setPrompt] = useState("");

  const filtered = results.filter((r) => activeFilter === "All results" || r.type === activeFilter);

  return (
    <UserFrame active="ai-work-assistant">
      <UserHeader code="US-018" title="AI Smart Search & Work Assistant" />
      <UserKpiRow
        items={[
          { value: "Search", label: "Authorised records", tone: "blue" },
          { value: "SOP", label: "Approved sources", tone: "green" },
          { value: "Voice", label: "Optional input", tone: "purple" },
          { value: "Draft", label: "Review required", tone: "orange" },
          { value: "Scope", label: "Assigned work", tone: "blue" },
          { value: "Policy", label: "AI usage", tone: "orange" },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-rows:392fr_106fr] lg:gap-[12px]">
        <div className="grid min-h-0 grid-cols-1 gap-3 lg:[grid-template-columns:750fr_406fr] lg:gap-[12px]">
          <UserPanel title="Universal search">
            <div className="flex gap-[7px]">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Universal search"
                className={`${userInputCls} flex-1`}
              />
              <button type="button" onClick={() => show("Voice input ready (demo).")} className={`${userOutlineBtn} !h-[31px]`}>Voice</button>
              <button type="button" onClick={() => show(`Searched authorised records for "${query}".`)} className={`${userPrimaryBtn} !h-[31px]`}>Search</button>
            </div>

            <div className="mt-[8px] flex flex-wrap gap-[6px]">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={activeFilter === f ? userPrimaryBtn : userOutlineBtn}
                >
                  {f}
                </button>
              ))}
            </div>

            <p className={`mt-[10px] text-[13.8px] ${userInk}`}>Illustrative results</p>
            <div className="mt-[4px] overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse">
                <thead>
                  <tr className="h-[29px] bg-[#e2e9f4] text-left text-[13.8px] font-medium text-[#1a1d36]">
                    <th className="px-[8px]">Result</th>
                    <th className="px-[8px]">Source</th>
                    <th className="px-[8px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.result} className="h-[36px] border-b border-[#dce4ee] text-[14.2px] text-[#1a1d36]">
                      <td className="px-[8px]">{r.result}</td>
                      <td className="px-[8px]">{r.source}</td>
                      <td className="px-[8px]">
                        <button
                          type="button"
                          onClick={() => (r.source === "TASK-026" ? router.push(userRoutes.taskExecution) : show(`Opened ${r.result}.`))}
                          className={userOutlineBtn}
                        >
                          {r.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-[10px] text-[13px] text-[#4a5468]">
              Search results must be filtered server-side before AI retrieval.
            </p>
          </UserPanel>

          <UserPanel title="AI work assistant">
            <div className="rounded-[6px] border border-[#d0e0f5] bg-[#eef4fc] px-[10px] py-[7px]">
              <p className={`text-[13.8px] font-semibold ${userInk}`}>You</p>
              <p className={`text-[13.8px] ${userInk}`}>Summarise my priority work.</p>
            </div>
            <div className="mt-[6px] rounded-[6px] border border-[#cde6d4] bg-[#eaf7ee] px-[10px] py-[7px]">
              <p className={`text-[13.8px] font-semibold ${userInk}`}>AI draft</p>
              <p className={`text-[13.8px] ${userInk}`}>
                Review the emergency case, complete pending verification and follow up on overdue tasks. Confirm each item before acting.
              </p>
            </div>
            <div className="mt-[6px]">
              <UserKVList
                rows={[
                  ["Sources", "Assigned records / SOPs"],
                  ["Usage", "Policy not loaded"],
                  ["Output", "Draft only"],
                ]}
              />
            </div>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about your assigned work..."
              className={`${userTextareaCls} mt-[8px] h-[54px] resize-none`}
            />
            <div className="mt-[8px] flex flex-wrap gap-[7px]">
              <button type="button" onClick={() => show("AI draft generated for review.")} className={userPrimaryBtn}>Ask AI</button>
              <button type="button" onClick={() => show("Priority summary drafted.")} className={userOutlineBtn}>Summarise</button>
              <button type="button" onClick={() => show("Daily report draft created.")} className={userOutlineBtn}>Draft daily report</button>
            </div>
            <p className="mt-[6px] text-[13px] text-[#4a5468]">
              Source links and timestamps must be verified before using an AI draft.
            </p>
          </UserPanel>
        </div>

        <UserPanel title="Frequently used actions">
          <div className="flex flex-wrap gap-[7px]">
            <button type="button" onClick={() => setActiveFilter("SOPs")} className={userPrimaryBtn}>Find approved SOP</button>
            <button type="button" onClick={() => router.push(userRoutes.taskExecution)} className={userOutlineBtn}>Resume task</button>
            <button type="button" onClick={() => show("Report draft prepared.")} className={userOutlineBtn}>Prepare report</button>
            <button type="button" onClick={() => show("AI usage policy summary opened.")} className={userOutlineBtn}>Review AI usage</button>
          </div>
          <p className="mt-[6px] text-[13px] text-[#4a5468]">
            AI cannot grant permissions, clear legal gates or approve expenses.
          </p>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
