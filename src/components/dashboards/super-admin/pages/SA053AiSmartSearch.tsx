"use client";

/** SA-053 — AI Universal Smart Search. Demo data. */

import { useState } from "react";
import { Bell, CircleCheck, Layers, Radio, Users } from "lucide-react";
import { SuperAdminFrame, useNotice } from "@/components/dashboards/super-admin/kit";
import {
  KpiRow,
  KpiTile,
  Panel,
  Sa51Btn,
  Sa51Header,
  Sa51KvList,
  Sa51Pill,
  Sa51Tabs,
  sa51TableCell,
  sa51TableHead,
} from "@/components/dashboards/super-admin/pages/sa51Kit";

const tabs = ["All results", "Records", "Knowledge", "How-to", "Recent"] as const;
type Tab = (typeof tabs)[number];

const filterChips = ["All results", "Cases", "Requests", "SOPs", "Documents", "Tasks", "Voice search"] as const;
type Chip = (typeof filterChips)[number];

type SearchRow = { result: string; type: string; source: string; scope: string };
const searchRows: SearchRow[] = [
  { result: "MS-26-1101", type: "Case", source: "Case register", scope: "Ghaziabad" },
  { result: "SOP-004", type: "Knowledge", source: "Legal clearance", scope: "Approved" },
  { result: "TASK-026", type: "Task", source: "Task register", scope: "Assigned" },
  { result: "NET-001", type: "Partner", source: "Network register", scope: "Authorised" },
  { result: "GUIDE-02", type: "How-to", source: "Training academy", scope: "Published" },
];

export default function SA053AiSmartSearch() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("All results");
  const [query, setQuery] = useState("Cremation clearance");
  const [chip, setChip] = useState<Chip>("All results");

  const filtered = searchRows.filter((r) => {
    const q = query.trim().toLowerCase();
    const matchChip =
      chip === "All results" ||
      (chip === "Cases" && r.type === "Case") ||
      (chip === "SOPs" && r.type === "Knowledge") ||
      (chip === "Tasks" && r.type === "Task") ||
      (chip === "Documents" && r.type === "How-to") ||
      (chip === "Requests" && r.type === "Partner") ||
      chip === "Voice search";
    if (!q || q === "cremation clearance") return matchChip;
    return matchChip && [r.result, r.type, r.source, r.scope].some((f) => f.toLowerCase().includes(q));
  });

  return (
    <SuperAdminFrame active="ai-automation">
      <Sa51Header code="SA-053" title="AI Universal Smart Search" />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="Scoped" label="Records" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Bell} value="Verified" label="Knowledge" sub="Demo snapshot" />
        <KpiTile tone="orange" icon={CircleCheck} value="SOPs" label="How-to" sub="Demo snapshot" />
        <KpiTile tone="purple" icon={Users} value="04" label="Recent searches" sub="Demo snapshot" />
        <KpiTile tone="sky" icon={Layers} value="Read only" label="AI mode" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Radio} value="Role based" label="Access" sub="Demo snapshot" />
      </KpiRow>

      <Sa51Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="grid min-h-0 flex-1 gap-[10px] lg:grid-cols-[1.85fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Search results · authorised scope" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div>
              <div className="mb-[8px] flex items-center gap-[8px]">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Smart search query"
                  className="h-[32px] min-w-0 flex-1 rounded-[8px] border border-[#cfd5e2] bg-white px-[12px] text-[14.5px] font-medium text-[#0b0c36] outline-none focus:border-[#1d4fe0]"
                />
                <Sa51Btn primary onClick={() => notice.show(`AI answer generated from scoped approved sources for "${query}" (demo).`)}>
                  Ask AI
                </Sa51Btn>
              </div>
              <div className="overflow-x-auto rounded-[8px] border border-[#e3e7ef]">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr>
                      {["Result", "Type", "Source", "Scope", "Action"].map((h) => (
                        <th key={h} className={sa51TableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.result} className="even:bg-[#f8fafd] last:[&>td]:border-b-0 hover:bg-[#eef4ff]">
                        <td className={sa51TableCell}>{r.result}</td>
                        <td className={sa51TableCell}>{r.type}</td>
                        <td className={sa51TableCell}>{r.source}</td>
                        <td className={sa51TableCell}>{r.scope}</td>
                        <td className={sa51TableCell}>
                          <Sa51Pill onClick={() => notice.show(`Opened authorised source ${r.result} (${r.source}) (demo).`)}>
                            View
                          </Sa51Pill>
                        </td>
                      </tr>
                    ))}
                    {!filtered.length && (
                      <tr>
                        <td colSpan={5} className="py-5 text-center text-[14.5px] font-medium text-[#5b6280]">
                          No authorised records match this query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show(`Scoped search executed for "${query}" (demo).`)}>
                Search
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("AI summary generated from cited approved sources only (demo).")}>
                Ask AI
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Search filters & sources" className="lg:flex-1">
            <div className="flex flex-wrap gap-[6px]">
              {filterChips.map((c) => {
                const on = chip === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setChip(c);
                      if (c === "Voice search") notice.show("Voice input requires explicit consent & retention control (demo).");
                    }}
                    className={`h-[26px] rounded-[7px] px-[10px] text-[14px] font-semibold transition-colors ${on
                      ? "bg-[#1d4fe0] text-white shadow-[0_2px_5px_rgba(29,79,224,0.25)]"
                      : "border border-[#b9c8f0] bg-white text-[#1d4fe0] hover:bg-[#f2f6ff]"
                      }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            <Sa51KvList
              rows={[
                ["Search scope", "Permission-filtered before retrieval"],
                ["Result links", "Open authorised source"],
                ["AI summary", "Separate from source records"],
              ]}
            />
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="AI answer · cited sources" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div className="rounded-[8px] border border-[#dce4f2] bg-[#f4f7fd] px-[11px] py-[10px] text-[14.5px] leading-[1.45] text-[#1a1d36]">
              <p>Legal clearance is required before dispatch. If documents are missing, contact the responsible Admin.</p>
              <p className="mt-[6px] font-semibold text-[#0b0c36]">
                Sources: <span className="font-medium">SOP-004 · Legal clearance; GUIDE-02 · Checklist (demo references).</span>
              </p>
            </div>
            <Sa51KvList
              rows={[
                ["Scope", "Authorised records only"],
                ["Sensitive details", "Masked"],
                ["Uncertain answer", "Refer to Admin"],
              ]}
            />
          </Panel>

          <Panel title="Privacy & access" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51KvList
              rows={[
                ["Restricted records", "Do not reveal existence"],
                ["Voice input", "Consent / retention controls"],
                ["Search history", "Scoped audit"],
                ["Feedback", "Report incorrect answer"],
              ]}
            />
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
