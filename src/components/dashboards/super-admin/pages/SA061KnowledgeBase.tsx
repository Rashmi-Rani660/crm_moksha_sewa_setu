"use client";

/** SA-061 — Knowledge Base & SOP Management. Demo data. */

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

type TabId =
  | "overview"
  | "records"
  | "review"
  | "activity"
  | "reports";

type SopStatus = "Approved" | "Review due" | "Draft" | "Retired";

interface SopRecord {
  id: string;
  title: string;
  category: string;
  version: string;
  owner: string;
  status: SopStatus;
  aiIndexStatus: string;
  nextReview: string;
  previewSteps: string[];
}

const SOP_RECORDS: SopRecord[] = [
  {
    id: "SOP-001",
    title: "Free cremation eligibility",
    category: "Operations",
    version: "v2.1",
    owner: "Admin 01",
    status: "Approved",
    aiIndexStatus: "Approved version indexed",
    nextReview: "18 Jan 2027 · demo",
    previewSteps: [
      "1. Verify beneficiary eligibility and supporting ID.",
      "2. Confirm centre slot availability and waiver code.",
      "3. Log approval in case register before dispatch.",
    ],
  },
  {
    id: "SOP-002",
    title: "Legal clearance checklist",
    category: "Compliance",
    version: "v1.2",
    owner: "Admin 01",
    status: "Approved",
    aiIndexStatus: "Approved version indexed",
    nextReview: "24 Feb 2027 · demo",
    previewSteps: [
      "1. Verify case category and documents.",
      "2. Obtain applicable legal clearance.",
      "3. Record approval before dispatch.",
    ],
  },
  {
    id: "SOP-003",
    title: "Family communication",
    category: "Communication",
    version: "v1.3",
    owner: "Admin 03",
    status: "Review due",
    aiIndexStatus: "Pending review approval",
    nextReview: "Due now · demo",
    previewSteps: [
      "1. Assign primary family liaison within 30 minutes.",
      "2. Share verified status updates via approved channel.",
      "3. Record consent and acknowledgment in case log.",
    ],
  },
  {
    id: "SOP-004",
    title: "Vehicle handover",
    category: "Fleet",
    version: "v1.0",
    owner: "Admin 02",
    status: "Approved",
    aiIndexStatus: "Approved version indexed",
    nextReview: "10 Mar 2027 · demo",
    previewSteps: [
      "1. Complete pre-dispatch vehicle safety inspection.",
      "2. Verify driver credentials and route manifest.",
      "3. Capture handover timestamp and odometer reading.",
    ],
  },
  {
    id: "SOP-005",
    title: "Volunteer safety",
    category: "Training",
    version: "v1.1",
    owner: "Admin 04",
    status: "Draft",
    aiIndexStatus: "Excluded from AI (Draft)",
    nextReview: "Pending publish · demo",
    previewSteps: [
      "1. Ensure PPE kit issuance before field deployment.",
      "2. Complete site hazard briefing with coordinator.",
      "3. Report any incident to safety desk immediately.",
    ],
  },
  {
    id: "SOP-006",
    title: "Legacy intake process",
    category: "Operations",
    version: "v1.0",
    owner: "Admin 01",
    status: "Retired",
    aiIndexStatus: "Excluded from AI (Retired)",
    nextReview: "Archived · demo",
    previewSteps: [
      "1. Superseded by unified digital intake workflow.",
      "2. Retained for historical audit reference only.",
      "3. Do not use for active case processing.",
    ],
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
  { label: "Draft", tone: "blue" },
  { label: "Review", tone: "green" },
  { label: "Approve", tone: "blue" },
  { label: "Publish", tone: "green" },
  { label: "Index", tone: "blue" },
];

const STATUS_BADGE_CLASS: Record<SopStatus, string> = {
  Approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Review due": "bg-amber-50 text-amber-700 border border-amber-200",
  Draft: "bg-amber-50 text-amber-700 border border-amber-200",
  Retired: "bg-sky-50 text-sky-700 border border-sky-200",
};

export default function SA061KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>("SOP-002");

  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SOP_RECORDS;
    return SOP_RECORDS.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q),
    );
  }, [search]);

  const selectedSop =
    SOP_RECORDS.find((r) => r.id === selectedId) ?? SOP_RECORDS[1];

  return (
    <SuperAdminFrame active="knowledge-base">
      <div className="space-y-2.5">
      <PageHead
          light
        title="Knowledge Base & SOP Management"
        links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
      >
        <div className="flex flex-wrap items-center gap-2">
          <ScreenSwitch current="SA-061" screens={knowledgeScreens} />
        </div>
      </PageHead>

      {/* 6 KPI Tiles */}
      <KpiRow cols={6}>
        <KpiTile
          tone="blue"
          value="24"
          label="Approved SOPs"
          sub="Demo snapshot"
          icon={Radio}
        />
        <KpiTile
          tone="green"
          value="05"
          label="Drafts"
          sub="Demo snapshot"
          icon={Bell}
        />
        <KpiTile
          tone="orange"
          value="03"
          label="Review due"
          sub="Demo snapshot"
          icon={CircleCheck}
        />
        <KpiTile
          tone="purple"
          value="02"
          label="Retired"
          sub="Demo snapshot"
          icon={UsersRound}
        />
        <KpiTile
          tone="blue"
          value="22"
          label="AI indexed"
          sub="Demo snapshot"
          icon={Network}
        />
        <KpiTile
          tone="green"
          value="02"
          label="Sync pending"
          sub="Demo snapshot"
          icon={Radio}
        />
      </KpiRow>

      {/* 5-Tab Bar */}
      <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs sm:grid-cols-5">
        {TABS.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 text-center text-xs font-semibold transition-colors ${
                idx > 0 ? "border-l border-slate-200" : ""
              } ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-2.5 lg:col-span-8">
          <Panel title="Knowledge Base & SOP Management · register">
            <div className="space-y-2">
              {/* Search + Filter + Export */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search records..."
                  className="min-w-[200px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Filter
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Export
                </button>
              </div>

              {/* Register Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-y border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                      <th className="px-2 py-1.5">Document ID</th>
                      <th className="px-2 py-1.5">Title</th>
                      <th className="px-2 py-1.5">Category</th>
                      <th className="px-2 py-1.5">Version</th>
                      <th className="px-2 py-1.5">Owner</th>
                      <th className="px-2 py-1.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((row) => {
                      const isSelected = row.id === selectedSop.id;
                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedId(row.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-blue-50/60"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="py-1.5 pr-3 font-semibold text-slate-800 whitespace-nowrap">
                            {row.id}
                          </td>
                          <td className="py-1.5 pr-3 font-medium text-slate-700">
                            {row.title}
                          </td>
                          <td className="py-1.5 pr-3 text-slate-600">
                            {row.category}
                          </td>
                          <td className="py-1.5 pr-3 text-slate-600">
                            {row.version}
                          </td>
                          <td className="py-1.5 pr-3 text-slate-600 whitespace-nowrap">
                            {row.owner}
                          </td>
                          <td className="py-1.5 text-right whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                STATUS_BADGE_CLASS[row.status]
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-6 text-center text-xs text-slate-500"
                        >
                          No matching SOP records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Register Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <PrimaryButton>Upload document</PrimaryButton>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Review version
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Preview SOP
                </button>
              </div>
            </div>
          </Panel>

          {/* Publication & AI indexing */}
          <Panel title="Publication & AI indexing">
            <div className="space-y-2">
              {/* 5-step pipeline */}
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

              {/* Summary rows */}
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Review due</span>
                  <span className="font-semibold text-slate-800">
                    03 documents
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Index pending</span>
                  <span className="font-semibold text-slate-800">
                    02 approved documents
                  </span>
                </div>
              </div>

              {/* Pipeline Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <PrimaryButton>Review queue</PrimaryButton>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Test retrieval
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Rollback
                </button>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Column */}
        <div className="space-y-2.5 lg:col-span-4">
          <Panel title={`Selected SOP · ${selectedSop.title}`}>
            <div className="space-y-3">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500">Version / owner</span>
                  <span className="font-semibold text-slate-800">
                    {selectedSop.version} · {selectedSop.owner}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500">AI index</span>
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {selectedSop.aiIndexStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500">Next review</span>
                  <span className="font-semibold text-slate-800">
                    {selectedSop.nextReview}
                  </span>
                </div>
              </div>

              {/* Document preview box */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[13px]">
                <p className="mb-1.5 font-semibold text-slate-800">
                  Document preview · {selectedSop.id}
                </p>
                <div className="space-y-1 text-slate-600">
                  {selectedSop.previewSteps.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Selected SOP Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <PrimaryButton>Open document</PrimaryButton>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Compare versions
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Upload
                </button>
              </div>
            </div>
          </Panel>

          {/* Knowledge safeguards */}
          <Panel title="Knowledge safeguards">
            <div className="divide-y divide-slate-100 text-[13px]">
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">
                  Unapproved / expired SOP
                </span>
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Excluded from AI
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Source references</span>
                <span className="font-semibold text-slate-800">
                  Versioned record
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Upload safety</span>
                <span className="font-semibold text-slate-800">
                  Scan before indexing
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Access scope</span>
                <span className="font-semibold text-slate-800">
                  Department / role
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Change history</span>
                <span className="font-semibold text-slate-800">
                  Immutable audit
                </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
      </div>
    </SuperAdminFrame>
  );
}
