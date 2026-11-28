"use client";

/**
 * US-024 — Knowledge Base & SOPs.
 * Matched to the US-024 design reference with Super Admin spacing and left-aligned tables.
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  UserFrame,
  UserHeader,
  UserKVList,
  UserKpiRow,
  UserPanel,
  UserPill,
  UserTabs,
  useUserNotice,
  userInk,
  userInputCls,
  userOutlineBtn,
  userPrimaryBtn,
} from "@/components/dashboards/user/UserScreenKit";

const tabs = ["SOP library", "Saved documents", "Recent updates"] as const;
type Tab = (typeof tabs)[number];

type SopDoc = {
  id: string;
  title: string;
  version: string;
  status: "Approved" | "Updated";
  tone: "green" | "amber";
  action: "Open" | "Read";
  primary?: boolean;
  bookmarked?: boolean;
  excerpt: readonly string[];
};

const docs: readonly SopDoc[] = [
  {
    id: "SOP-004",
    title: "SOP-004 · Legal clearance",
    version: "v2.1",
    status: "Approved",
    tone: "green",
    action: "Open",
    primary: true,
    bookmarked: true,
    excerpt: [
      "Confirm applicable documentation and authorised clearance before dispatch.",
      "Where records are missing, seek clarification and escalate to the responsible Admin.",
      "Do not bypass mandatory legal requirements.",
    ],
  },
  {
    id: "SOP-006",
    title: "SOP-006 · Family communication",
    version: "v1.3",
    status: "Updated",
    tone: "amber",
    action: "Read",
    bookmarked: true,
    excerpt: [
      "Communicate free last-rites support terms clearly and respectfully.",
      "Document family consent and contact verification in the case record.",
      "Never quote unapproved charges or external timelines.",
    ],
  },
  {
    id: "SOP-008",
    title: "SOP-008 · Evidence submission",
    version: "v1.2",
    status: "Approved",
    tone: "green",
    action: "Open",
    excerpt: [
      "Upload clear, legible supporting documents within the assigned SLA window.",
      "Verify case ID and date stamp before submitting for Admin review.",
      "Redacted copies must preserve mandatory verification identifiers.",
    ],
  },
  {
    id: "SOP-010",
    title: "SOP-010 · Field safety",
    version: "v1.0",
    status: "Approved",
    tone: "green",
    action: "Open",
    excerpt: [
      "Follow PPE and hygiene protocol on every active field dispatch.",
      "Report vehicle or site safety hazards immediately to the Duty Admin.",
      "Confirm completion check-in before closing field assignment.",
    ],
  },
  {
    id: "GUIDE-02",
    title: "GUIDE-02 · Cremation checklist",
    version: "v1.1",
    status: "Approved",
    tone: "green",
    action: "Open",
    bookmarked: true,
    excerpt: [
      "Verify centre slot, legal clearance, and family representative sign-off.",
      "Confirm material kit and transport readiness prior to departure.",
      "Log final completion timestamp in Sewa Setu CRM.",
    ],
  },
];

export default function US024KnowledgeBase() {
  const { show, node } = useUserNotice();
  const [tab, setTab] = useState<Tab>("SOP library");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All records");
  const [selectedId, setSelectedId] = useState("SOP-004");
  const [bookmarks, setBookmarks] = useState<string[]>(["SOP-004", "SOP-006", "GUIDE-02"]);

  const q = query.trim().toLowerCase();
  const filtered = docs.filter((d) => {
    const matchQ = !q || d.title.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All records" || d.status === statusFilter;
    const matchTab =
      tab === "Saved documents"
        ? bookmarks.includes(d.id)
        : tab === "Recent updates"
          ? d.status === "Updated"
          : true;
    return matchQ && matchStatus && matchTab;
  });

  const selected = docs.find((d) => d.id === selectedId) ?? docs[0];
  const isBookmarked = bookmarks.includes(selected.id);

  const toggleBookmark = () => {
    setBookmarks((prev) =>
      prev.includes(selected.id) ? prev.filter((id) => id !== selected.id) : [...prev, selected.id],
    );
    show(isBookmarked ? `${selected.id} removed from bookmarks (demo).` : `${selected.id} bookmarked (demo).`);
  };

  return (
    <UserFrame active="knowledge-base">
      <UserHeader code="US-024" title="Knowledge Base & SOPs (US-024)" />

      <UserKpiRow
        items={[
          { value: "06", label: "Available SOPs", tone: "blue" },
          { value: String(bookmarks.length).padStart(2, "0"), label: "Bookmarked", tone: "green" },
          { value: "01", label: "Update to read", tone: "orange" },
          { value: "02", label: "Recently viewed", tone: "orange" },
          { value: "05", label: "Approved guides", tone: "green" },
          { value: "01", label: "Checklist reference", tone: "blue" },
        ]}
      />

      <UserTabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px] lg:mt-[7px]">
        {/* Top Row */}
        <div className="grid gap-[10px] lg:min-h-0 lg:flex-[365_1_0] lg:grid-cols-[54fr_46fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <UserPanel title="Find an approved SOP">
            <div className="flex h-full flex-col gap-[8px]">
              <div className="flex flex-wrap items-center gap-[8px]">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search SOP title, topic or keyword"
                  aria-label="Search SOP title, topic or keyword"
                  className={`${userInputCls} min-w-0 flex-1`}
                />
                <div className="relative w-[170px] shrink-0">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter SOP records"
                    className={`${userInputCls} cursor-pointer appearance-none pr-[28px]`}
                  >
                    <option>All records</option>
                    <option>Approved</option>
                    <option>Updated</option>
                  </select>
                  <ChevronDown strokeWidth={2.4} className="pointer-events-none absolute right-[8px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#1a1d36]" />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-auto rounded-[6px] border border-[#e1e5ee] bg-white">
                <table className="w-full border-collapse text-left text-[13.5px]">
                  <thead className="sticky top-0 z-10 border-b border-[#e1e5ee] bg-[#f4f7fc] text-[13px] font-semibold text-[#1a1d36]">
                    <tr>
                      <th className="px-[10px] py-[7px] text-left">Document</th>
                      <th className="px-[10px] py-[7px] text-left">Version</th>
                      <th className="px-[10px] py-[7px] text-left">Status</th>
                      <th className="px-[10px] py-[7px] text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className={userInk}>
                    {filtered.map((d) => (
                      <tr
                        key={d.id}
                        onClick={() => setSelectedId(d.id)}
                        className={`cursor-pointer border-b border-[#eef0f5] last:border-0 even:bg-[#f7f9fd] hover:bg-[#eef2ff] ${
                          selectedId === d.id ? "ring-1 ring-inset ring-[#1d4fe0]/30" : ""
                        }`}
                      >
                        <td className="px-[10px] py-[7px] font-medium">{d.title}</td>
                        <td className="px-[10px] py-[7px] whitespace-nowrap">{d.version}</td>
                        <td className="px-[10px] py-[7px]">
                          <UserPill tone={d.tone}>{d.status}</UserPill>
                        </td>
                        <td className="px-[10px] py-[7px]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(d.id);
                              show(`${d.title} opened in read-only viewer (demo).`);
                            }}
                            className={d.primary ? `${userPrimaryBtn} h-[25px] px-[10px] text-[13px]` : `${userOutlineBtn} h-[25px] px-[10px] text-[13px]`}
                          >
                            {d.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!filtered.length && (
                      <tr>
                        <td colSpan={4} className="px-[10px] py-[16px] text-left text-[13.5px] text-[#5b6280]">
                          No approved SOPs match your filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-auto flex flex-wrap gap-[8px] pt-[2px]">
                <button type="button" onClick={() => setTab("Saved documents")} className={userPrimaryBtn}>
                  My bookmarks
                </button>
                <button type="button" onClick={() => setTab("SOP library")} className={userOutlineBtn}>
                  Recent documents
                </button>
              </div>
            </div>
          </UserPanel>

          <UserPanel title={selected.title}>
            <div className="flex h-full flex-col gap-[8px]">
              <UserKVList
                rows={[
                  ["Version", `${selected.version.replace("v", "")} · demo`],
                  ["Approval", "Approved version only"],
                  ["Source", "Controlled SOP library"],
                ]}
              />

              <div className="rounded-[8px] border border-[#dce6f7] bg-white p-[12px] text-[13.5px] leading-[19px] text-[#1a1d36]">
                <p className="mb-[5px] font-semibold">Sample excerpt — design preview</p>
                {selected.excerpt.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-[8px]">
                <button type="button" onClick={() => show(`Opening full viewer for ${selected.id} (demo).`)} className={userPrimaryBtn}>
                  Open full SOP
                </button>
                <button type="button" onClick={toggleBookmark} className={userOutlineBtn}>
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
                <button type="button" onClick={() => show(`AI cited ${selected.id} ${selected.version} (demo).`)} className={userOutlineBtn}>
                  Ask AI about SOP
                </button>
              </div>

              <div className="mt-auto">
                <UserKVList
                  rows={[
                    ["AI citation", `${selected.id} · version ${selected.version.replace("v", "")}`],
                    ["Document access", "Read only"],
                  ]}
                />
              </div>
            </div>
          </UserPanel>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-[10px] lg:min-h-0 lg:flex-[145_1_0] lg:grid-cols-[54fr_46fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <UserPanel title="Recently updated">
            <div className="flex h-full flex-col gap-[8px]">
              <UserKVList
                rows={[
                  ["Family communication", "Read updated guidance"],
                  ["Acknowledgement", "Required if assigned"],
                ]}
              />
              <div className="mt-auto pt-[2px]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId("SOP-006");
                    show("Loaded SOP-006 updated guidance (demo).");
                  }}
                  className={userPrimaryBtn}
                >
                  Review update
                </button>
              </div>
            </div>
          </UserPanel>

          <UserPanel title="Document assistance">
            <UserKVList
              rows={[
                ["Search within SOP", "Available in full viewer"],
                ["Report outdated content", "Send correction request"],
              ]}
            />
          </UserPanel>
        </div>
      </div>

      {node}
    </UserFrame>
  );
}
