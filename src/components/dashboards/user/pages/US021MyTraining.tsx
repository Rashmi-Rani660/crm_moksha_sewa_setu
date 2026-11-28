"use client";

/**
 * US-021 — My Training & AI Virtual Trainer.
 * Matched to the US-021 design reference with Super Admin spacing and left-aligned tables.
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  UserFrame,
  UserHeader,
  UserKVList,
  UserKpiRow,
  UserPanel,
  UserProgressBar,
  UserTabs,
  useUserNotice,
  userInk,
  userInputCls,
  userOutlineBtn,
  userPrimaryBtn,
} from "@/components/dashboards/user/UserScreenKit";

const tabs = ["My courses", "AI trainer", "Learning history"] as const;
type Tab = (typeof tabs)[number];

type CourseRow = {
  id: string;
  title: string;
  due: string;
  progress: number;
  status: "In progress" | "Not started" | "Completed";
  action: "Resume" | "Start" | "Review";
  primary?: boolean;
};

const courses: readonly CourseRow[] = [
  { id: "c1", title: "Compassionate communication", due: "28 Nov", progress: 90, status: "In progress", action: "Resume", primary: true },
  { id: "c2", title: "Legal clearance essentials", due: "30 Nov", progress: 0, status: "Not started", action: "Start" },
  { id: "c3", title: "Privacy & data handling", due: "Completed", progress: 100, status: "Completed", action: "Review" },
  { id: "c4", title: "Field safety induction", due: "Completed", progress: 100, status: "Completed", action: "Review" },
];

type PracticeMessage = {
  id: string;
  sender: "trainer" | "user";
  tone: "blue" | "slate" | "green";
  text: string;
};

const initialMessages: PracticeMessage[] = [
  { id: "m1", sender: "trainer", tone: "blue", text: "Trainer: How would you respond when required documents are missing?" },
  { id: "m2", sender: "user", tone: "slate", text: "I will explain the process respectfully and request authorised assistance." },
  { id: "m3", sender: "trainer", tone: "green", text: "Trainer: Good. Do not promise dispatch before legal clearance." },
];

export default function US021MyTraining() {
  const { show, node } = useUserNotice();
  const [tab, setTab] = useState<Tab>("My courses");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All records");
  const [messages, setMessages] = useState<PracticeMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [lang, setLang] = useState<"Hindi / English" | "English only">("Hindi / English");

  const q = query.trim().toLowerCase();
  const filtered = courses.filter((c) => {
    const matchQ = !q || c.title.toLowerCase().includes(q);
    const matchF = filter === "All records" || c.status === filter;
    const matchTab = tab === "Learning history" ? c.status === "Completed" : true;
    return matchQ && matchF && matchTab;
  });

  const sendReply = () => {
    const text = draft.trim();
    if (!text) {
      show("Type a practice response first (demo).");
      return;
    }
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: "user", tone: "slate", text },
      {
        id: `t-${Date.now() + 1}`,
        sender: "trainer",
        tone: "green",
        text: "Trainer: Recorded in training sandbox. Remember to cite SOP-004 before confirming dispatch.",
      },
    ]);
    setDraft("");
    show("Practice response evaluated against approved SOPs (demo).");
  };

  const showCourses = tab === "My courses" || tab === "Learning history";
  const showTrainer = tab === "My courses" || tab === "AI trainer";

  return (
    <UserFrame active="training-knowledge">
      <UserHeader code="US-021" title="My Training & AI Virtual Trainer (US-021)" />

      <UserKpiRow
        items={[
          { value: "04", label: "Assigned courses", tone: "blue" },
          { value: "02", label: "Completed", tone: "green" },
          { value: "01", label: "In progress", tone: "orange" },
          { value: "01", label: "Not started", tone: "orange" },
          { value: "02", label: "Due for completion", tone: "orange" },
          { value: "90%", label: "Current course", tone: "blue" },
        ]}
      />

      <UserTabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px] lg:mt-[7px]">
        {/* Top Row */}
        <div
          className={`grid gap-[10px] lg:min-h-0 lg:flex-[355_1_0] ${
            showCourses && showTrainer ? "lg:grid-cols-[54fr_46fr]" : "lg:grid-cols-1"
          } lg:[grid-template-rows:minmax(0,1fr)]`}
        >
          {showCourses && (
            <UserPanel title="My assigned learning">
              <div className="flex h-full flex-col gap-[8px]">
                <div className="flex flex-wrap items-center gap-[8px]">
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search course or SOP"
                    aria-label="Search course or SOP"
                    className={`${userInputCls} min-w-0 flex-1`}
                  />
                  <div className="relative w-[170px] shrink-0">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      aria-label="Filter learning records"
                      className={`${userInputCls} cursor-pointer appearance-none pr-[28px]`}
                    >
                      <option>All records</option>
                      <option>In progress</option>
                      <option>Not started</option>
                      <option>Completed</option>
                    </select>
                    <ChevronDown strokeWidth={2.4} className="pointer-events-none absolute right-[8px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#1a1d36]" />
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto rounded-[6px] border border-[#e1e5ee] bg-white">
                  <table className="w-full border-collapse text-left text-[13.5px]">
                    <thead className="sticky top-0 z-10 border-b border-[#e1e5ee] bg-[#f4f7fc] text-[13px] font-semibold text-[#1a1d36]">
                      <tr>
                        <th className="px-[10px] py-[7px] text-left">Course</th>
                        <th className="px-[10px] py-[7px] text-left">Due</th>
                        <th className="px-[10px] py-[7px] text-left">Progress</th>
                        <th className="px-[10px] py-[7px] text-left">Next action</th>
                      </tr>
                    </thead>
                    <tbody className={userInk}>
                      {filtered.map((c) => (
                        <tr key={c.id} className="border-b border-[#eef0f5] last:border-0 even:bg-[#f7f9fd] hover:bg-[#eef2ff]">
                          <td className="px-[10px] py-[7px] font-medium">{c.title}</td>
                          <td className="px-[10px] py-[7px] whitespace-nowrap">{c.due}</td>
                          <td className="px-[10px] py-[7px] whitespace-nowrap font-semibold">{c.progress}%</td>
                          <td className="px-[10px] py-[7px]">
                            <button
                              type="button"
                              onClick={() => show(`${c.title}: ${c.action} opened (demo).`)}
                              className={c.primary ? `${userPrimaryBtn} h-[25px] px-[10px] text-[13px]` : `${userOutlineBtn} h-[25px] px-[10px] text-[13px]`}
                            >
                              {c.action}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {!filtered.length && (
                        <tr>
                          <td colSpan={4} className="px-[10px] py-[16px] text-left text-[13.5px] text-[#5b6280]">
                            No learning records match the current filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-[5px]">
                  <div className="flex items-center justify-between text-[13.5px] font-medium text-[#1a1d36]">
                    <span>Current course progress</span>
                    <span className="font-semibold">90%</span>
                  </div>
                  <UserProgressBar pct={90} />
                </div>

                <div className="flex flex-wrap gap-[8px] pt-[2px]">
                  <button type="button" onClick={() => show("Resuming Communication · Lesson 3 of 4 (demo).")} className={userPrimaryBtn}>
                    Resume last lesson
                  </button>
                  <button type="button" onClick={() => setTab("Learning history")} className={userOutlineBtn}>
                    Open learning history
                  </button>
                </div>
              </div>
            </UserPanel>
          )}

          {showTrainer && (
            <UserPanel title="AI Virtual Trainer · Practice">
              <div className="flex h-full flex-col gap-[8px]">
                <div className="flex flex-col gap-[6px] rounded-[8px] border border-[#dce6f7] bg-white p-[10px]">
                  <div className="rounded-[6px] border border-[#e3eaf5] bg-[#f4f7fc] px-[10px] py-[6px] text-[13.5px] font-medium text-[#1a1d36]">
                    Scenario: A family requests free last-rites support.
                  </div>
                  <div className="flex max-h-[128px] flex-col gap-[6px] overflow-y-auto pr-[2px]">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-[6px] border px-[10px] py-[6px] text-[13.5px] leading-[18px] ${
                          m.tone === "blue"
                            ? "border-[#d5e3fb] bg-[#eef5ff] text-[#1a1d36]"
                            : m.tone === "green"
                              ? "border-[#cde9d2] bg-[#eef9f0] text-[#1a1d36]"
                              : "border-[#e1e5ee] bg-[#f7f9fd] text-[#1a1d36]"
                        }`}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendReply();
                    }}
                    placeholder="Type your practice response"
                    aria-label="Type your practice response"
                    className={userInputCls}
                  />
                  <div className="flex flex-wrap gap-[8px]">
                    <button type="button" onClick={sendReply} className={userPrimaryBtn}>
                      Send practice reply
                    </button>
                    <button type="button" onClick={() => show("Voice practice sandbox ready (demo).")} className={userOutlineBtn}>
                      Voice practice
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLang((prev) => (prev === "Hindi / English" ? "English only" : "Hindi / English"));
                        show("Trainer language preference toggled (demo).");
                      }}
                      className={userOutlineBtn}
                    >
                      Ask trainer
                    </button>
                  </div>
                </div>

                <div className="mt-auto">
                  <UserKVList
                    rows={[
                      ["Language", lang],
                      ["Source", "Approved SOP only"],
                      ["Mode", "Training sandbox"],
                    ]}
                  />
                </div>
              </div>
            </UserPanel>
          )}
        </div>

        {/* Bottom Row */}
        <div className="grid gap-[10px] lg:min-h-0 lg:flex-[155_1_0] lg:grid-cols-[54fr_46fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <UserPanel title="Next learning action">
            <UserKVList
              rows={[
                ["Current lesson", "Communication · Lesson 3 of 4"],
                ["Assessment", "After completion"],
                ["Refresher", "Due 30 Nov"],
              ]}
            />
          </UserPanel>

          <UserPanel title="Learning safeguards">
            <UserKVList
              rows={[
                ["Practical sign-off", "Authorised reviewer"],
                ["AI usage", "Within approved limit"],
                ["Qualification", "Separate from course completion"],
              ]}
            />
          </UserPanel>
        </div>
      </div>

      {node}
    </UserFrame>
  );
}
