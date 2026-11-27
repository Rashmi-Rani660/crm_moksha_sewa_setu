"use client";

/** SA-062 — Complaints & Grievances. Demo data. */

import { Fragment, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  CircleCheck,
  Network,
  Radio,
  UsersRound,
} from "lucide-react";
import {
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  PrimaryButton,
  SuperAdminFrame,
} from "@/components/dashboards/super-admin/kit";
import { ScreenSwitch, knowledgeScreens } from "@/components/dashboards/super-admin/screen-switch";

type TabId = "overview" | "records" | "review" | "activity" | "reports";
type GrievanceStatus = "Overdue" | "Open" | "In review" | "Awaiting reply";

interface GrievanceRecord {
  id: string;
  category: string;
  relatedCase: string;
  owner: string;
  priority: "High" | "Urgent" | "Normal";
  status: GrievanceStatus;
  received: string;
  slaRemaining: string;
  escalation: string;
  contact: string;
  nextAction: string;
}

const GRIEVANCES: GrievanceRecord[] = [
  {
    id: "GRV-001",
    category: "Response delay",
    relatedCase: "MS-26-1101",
    owner: "Admin 01",
    priority: "High",
    status: "Overdue",
    received: "24 Nov · 09:20 AM",
    slaRemaining: "Breached by 35 min",
    escalation: "Super Admin",
    contact: "Family 01 · masked",
    nextAction: "Acknowledge and resolve",
  },
  {
    id: "GRV-002",
    category: "Communication quality",
    relatedCase: "MS-26-1100",
    owner: "Admin 03",
    priority: "Urgent",
    status: "Open",
    received: "25 Nov · 11:05 AM",
    slaRemaining: "45 min remaining",
    escalation: "Zone Lead",
    contact: "Family 02 · masked",
    nextAction: "Call family liaison",
  },
  {
    id: "GRV-003",
    category: "Documentation query",
    relatedCase: "MS-26-1099",
    owner: "Admin 01",
    priority: "Normal",
    status: "In review",
    received: "25 Nov · 02:15 PM",
    slaRemaining: "4 h remaining",
    escalation: "None",
    contact: "Family 03 · masked",
    nextAction: "Verify certificate copy",
  },
  {
    id: "GRV-004",
    category: "Vehicle coordination",
    relatedCase: "MS-26-1098",
    owner: "Admin 02",
    priority: "High",
    status: "Open",
    received: "26 Nov · 08:40 AM",
    slaRemaining: "2 h remaining",
    escalation: "Fleet Lead",
    contact: "Family 04 · masked",
    nextAction: "Confirm driver dispatch",
  },
  {
    id: "GRV-005",
    category: "Service feedback",
    relatedCase: "MS-26-1097",
    owner: "Admin 04",
    priority: "Normal",
    status: "Awaiting reply",
    received: "26 Nov · 10:10 AM",
    slaRemaining: "6 h remaining",
    escalation: "None",
    contact: "Family 05 · masked",
    nextAction: "Follow up on closure",
  },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "records", label: "Records" },
  { id: "review", label: "Review & approvals" },
  { id: "activity", label: "Activity history" },
  { id: "reports", label: "Reports" },
];

const PIPELINE_STEPS: { label: string; tone: "blue" | "green" }[] = [
  { label: "Receive", tone: "blue" },
  { label: "Acknowledge", tone: "green" },
  { label: "Investigate", tone: "blue" },
  { label: "Resolve", tone: "green" },
  { label: "Confirm", tone: "blue" },
];

const AGEING_BARS = [
  { label: "< 1 day", value: 3, height: "h-10" },
  { label: "1–2 days", value: 2, height: "h-7" },
  { label: "3–7 days", value: 2, height: "h-7" },
  { label: "> 7 days", value: 1, height: "h-4" },
];

const STATUS_BADGE: Record<GrievanceStatus, string> = {
  Overdue: "border border-rose-200 bg-rose-50 text-rose-700",
  Open: "border border-sky-200 bg-sky-50 text-sky-700",
  "In review": "border border-sky-200 bg-sky-50 text-sky-700",
  "Awaiting reply": "border border-amber-200 bg-amber-50 text-amber-700",
};

export default function SA062Complaints() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("GRV-001");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return GRIEVANCES;
    return GRIEVANCES.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.relatedCase.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q),
    );
  }, [search]);

  const selected =
    GRIEVANCES.find((r) => r.id === selectedId) ?? GRIEVANCES[0];

  return (
    <SuperAdminFrame active="knowledge-base">
      <div className="space-y-2.5">
        <PageHead
          light
          title="Complaints & Grievances"
          links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <ScreenSwitch current="SA-062" screens={knowledgeScreens} />
          </div>
        </PageHead>

        <KpiRow cols={6}>
          <KpiTile tone="blue" value="08" label="Open complaints" sub="Demo snapshot" icon={Radio} />
          <KpiTile tone="green" value="02" label="Urgent" sub="Demo snapshot" icon={Bell} />
          <KpiTile tone="red" value="02" label="Overdue" sub="Demo snapshot" icon={CircleCheck} />
          <KpiTile tone="purple" value="14" label="Resolved this month" sub="Demo snapshot" icon={UsersRound} />
          <KpiTile tone="blue" value="03" label="Awaiting reply" sub="Demo snapshot" icon={Network} />
          <KpiTile tone="green" value="01" label="Reopened" sub="Demo snapshot" icon={Radio} />
        </KpiRow>

        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs sm:grid-cols-5">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 text-center text-xs font-semibold transition-colors ${
                idx > 0 ? "border-l border-slate-200" : ""
              } ${
                activeTab === tab.id
                  ? "bg-blue-700 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-12">
          <div className="space-y-2.5 lg:col-span-8">
            <Panel title="Complaints & Grievances · register">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search records..."
                    className="min-w-[200px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Filter
                  </button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Export
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-y border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                        <th className="px-2 py-1.5">Complaint ID</th>
                        <th className="px-2 py-1.5">Category</th>
                        <th className="px-2 py-1.5">Related case</th>
                        <th className="px-2 py-1.5">Owner</th>
                        <th className="px-2 py-1.5">Priority</th>
                        <th className="px-2 py-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedId(row.id)}
                          className={`cursor-pointer transition-colors ${
                            row.id === selected.id ? "bg-blue-50/60" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-2 py-1.5 font-semibold text-slate-800 whitespace-nowrap">{row.id}</td>
                          <td className="px-2 py-1.5 font-medium text-slate-700">{row.category}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.relatedCase}</td>
                          <td className="px-2 py-1.5 text-slate-600 whitespace-nowrap">{row.owner}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.priority}</td>
                          <td className="px-2 py-1.5 text-right whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[row.status]}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Assign complaint</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Escalate
                  </button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Add resolution
                  </button>
                </div>
              </div>
            </Panel>

            <Panel title="Resolution & ageing">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/60 p-1.5">
                  {PIPELINE_STEPS.map((step, idx) => (
                    <Fragment key={step.label}>
                      <div
                        className={`min-w-[84px] flex-1 rounded-lg border px-2.5 py-1.5 text-center text-xs font-semibold ${
                          step.tone === "green"
                            ? "border-emerald-200 bg-emerald-50/80 text-slate-700"
                            : "border-blue-200 bg-blue-50/80 text-slate-700"
                        }`}
                      >
                        {step.label}
                      </div>
                      {idx < PIPELINE_STEPS.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      )}
                    </Fragment>
                  ))}
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-medium text-slate-500">
                    Open complaint age · example distribution (8)
                  </p>
                  <div className="grid grid-cols-4 items-end gap-3 pt-1">
                    {AGEING_BARS.map((bar) => (
                      <div key={bar.label} className="flex flex-col items-center gap-1">
                        <span className="text-[11px] font-semibold text-slate-700">{bar.value}</span>
                        <div className={`w-full rounded-t-md bg-blue-600 ${bar.height}`} />
                        <span className="text-[11px] text-slate-500">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-2.5 lg:col-span-4">
            <Panel title={`Selected grievance · ${selected.id}`}>
              <div className="space-y-2.5">
                <div className="divide-y divide-slate-100 text-[13px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Received</span>
                    <span className="font-semibold text-slate-800">{selected.received}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">SLA remaining</span>
                    <span className="font-semibold text-slate-800">{selected.slaRemaining}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Responsible admin</span>
                    <span className="font-semibold text-slate-800">{selected.owner}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Escalation</span>
                    <span className="font-semibold text-slate-800">{selected.escalation}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Contact</span>
                    <span className="font-semibold text-slate-800">{selected.contact}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Next action</span>
                    <span className="font-semibold text-slate-800">{selected.nextAction}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Assign complaint</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Escalate
                  </button>
                </div>
              </div>
            </Panel>

            <Panel title="Priority & confidentiality">
              <div className="space-y-2.5">
                <div className="divide-y divide-slate-100 text-[13px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Urgent / overdue</span>
                    <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                      02 / 02
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Unacknowledged urgent</span>
                    <span className="font-semibold text-slate-800">01</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Confidential complaints</span>
                    <span className="font-semibold text-slate-800">Restricted queue</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Appeal / reopening</span>
                    <span className="font-semibold text-slate-800">Reason and independent review</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Closure</span>
                    <span className="font-semibold text-slate-800">Evidence + family feedback</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Review urgent</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Confidential queue
                  </button>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </SuperAdminFrame>
  );
}

