"use client";

/** SA-067 — Data Access & Export Control. Demo data. */

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bell, CircleCheck, Network, Radio, UsersRound } from "lucide-react";
import {
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  PrimaryButton,
  SuperAdminFrame,
} from "@/components/dashboards/super-admin/kit";
import { SECURITY_ROUTES } from "@/components/dashboards/super-admin/pages/SA063SecurityCommand";

type TabId = "overview" | "records" | "review" | "activity" | "reports";
type ExportStatus = "Review" | "Approved" | "Denied";

interface ExportRecord {
  id: string;
  user: string;
  scope: string;
  purpose: string;
  approver: string;
  status: ExportStatus;
  classification: string;
  allowedFields: string;
  excluded: string;
  maskedLines: string[];
  expiry: string;
}

const EXPORTS: ExportRecord[] = [
  { id: "EXP-001", user: "Admin 01", scope: "Case summary", purpose: "Monthly MIS", approver: "Super Admin", status: "Review", classification: "Confidential · proposed", allowedFields: "Case ID, status, dates", excluded: "Contacts / identity documents", maskedLines: ["MS-26-1101 · In service · 26 Nov", "MS-26-1100 · Review · 26 Nov"], expiry: "24 hours · proposed" },
  { id: "EXP-002", user: "Admin 02", scope: "Expense register", purpose: "Reconciliation", approver: "Finance checker", status: "Approved", classification: "Internal · approved", allowedFields: "Voucher ID, amount, date", excluded: "Bank account numbers", maskedLines: ["EXP-0142 · Approved · 26 Nov", "EXP-0141 · Settled · 25 Nov"], expiry: "24 hours · active" },
  { id: "EXP-003", user: "User 07", scope: "Case contacts", purpose: "Unspecified", approver: "Admin 01", status: "Denied", classification: "Restricted · denied", allowedFields: "None", excluded: "All PII fields", maskedLines: ["Access denied · policy rule"], expiry: "N/A" },
  { id: "EXP-004", user: "Admin 03", scope: "Chat summary", purpose: "Quality review", approver: "Super Admin", status: "Review", classification: "Confidential · proposed", allowedFields: "Thread ID, timestamp, rating", excluded: "Family phone / address", maskedLines: ["MSG-904 · Reviewed · 26 Nov"], expiry: "24 hours · proposed" },
  { id: "EXP-005", user: "Admin 04", scope: "Training progress", purpose: "Coaching", approver: "Super Admin", status: "Review", classification: "Internal · proposed", allowedFields: "Staff ID, module, score", excluded: "Personal email / phone", maskedLines: ["TRN-204 · 92% · 26 Nov"], expiry: "24 hours · proposed" },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "records", label: "Records" },
  { id: "review", label: "Review & approvals" },
  { id: "activity", label: "Activity history" },
  { id: "reports", label: "Reports" },
];

const PIPELINE_STEPS: { label: string; tone: "blue" | "green" }[] = [
  { label: "Request", tone: "blue" },
  { label: "Validate", tone: "green" },
  { label: "Approve", tone: "blue" },
  { label: "Download", tone: "green" },
  { label: "Expire", tone: "blue" },
];

const STATUS_BADGE: Record<ExportStatus, string> = {
  Review: "border border-amber-200 bg-amber-50 text-amber-700",
  Approved: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  Denied: "border border-rose-200 bg-rose-50 text-rose-700",
};

export default function SA067ExportControl() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("EXP-001");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return EXPORTS;
    return EXPORTS.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.user.toLowerCase().includes(q) ||
        r.scope.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q),
    );
  }, [search]);

  const selected = EXPORTS.find((r) => r.id === selectedId) ?? EXPORTS[0];

  return (
    <SuperAdminFrame active="system-security">
      <div className="space-y-2.5">
        <PageHead
          title="Data Access & Export Control"
          links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-amber-700 uppercase">
              DEMO DATA
            </span>
            <select
              aria-label="Select security module"
              value="SA-067"
              onChange={(e) => {
                const target = SECURITY_ROUTES[e.target.value];
                if (target) router.push(target);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs focus:border-blue-500 focus:outline-none"
            >
              <option value="SA-063">Security Command Centre</option>
              <option value="SA-064">Login &amp; Active Session Monitoring</option>
              <option value="SA-065">Device &amp; Access Management</option>
              <option value="SA-066">Security Alerts &amp; Incident Management</option>
              <option value="SA-067">Data Access &amp; Export Control</option>
              <option value="SA-068">Consent &amp; Privacy Management</option>
            </select>
          </div>
        </PageHead>

        <KpiRow cols={6}>
          <KpiTile tone="blue" value="12" label="Export requests" sub="Demo snapshot" icon={Radio} />
          <KpiTile tone="green" value="07" label="Approved" sub="Demo snapshot" icon={Bell} />
          <KpiTile tone="orange" value="02" label="Denied" sub="Demo snapshot" icon={CircleCheck} />
          <KpiTile tone="purple" value="03" label="Review due" sub="Demo snapshot" icon={UsersRound} />
          <KpiTile tone="blue" value="01" label="Expired links" sub="Demo snapshot" icon={Network} />
          <KpiTile tone="green" value="00" label="Policy exceptions" sub="Demo snapshot" icon={Radio} />
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
                activeTab === tab.id ? "bg-blue-700 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-12">
          <div className="space-y-2.5 lg:col-span-8">
            <Panel title="Data Access & Export Control · register">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search records..."
                    className="min-w-[200px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Filter</button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Export</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-y border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                        <th className="px-2 py-1.5">Request ID</th>
                        <th className="px-2 py-1.5">User</th>
                        <th className="px-2 py-1.5">Data scope</th>
                        <th className="px-2 py-1.5">Purpose</th>
                        <th className="px-2 py-1.5">Approver</th>
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
                          <td className="px-2 py-1.5 font-medium text-slate-700">{row.user}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.scope}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.purpose}</td>
                          <td className="px-2 py-1.5 text-slate-600 whitespace-nowrap">{row.approver}</td>
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
                  <PrimaryButton>Review request</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Deny export</button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Preview masked fields</button>
                </div>
              </div>
            </Panel>

            <Panel title="Export approval & download history">
              <div className="space-y-2">
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
                <div className="divide-y divide-slate-100 text-[13px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">EXP-002</span>
                    <span className="font-semibold text-slate-800">Approved · download event pending</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">EXP-003</span>
                    <span className="font-semibold text-slate-800">Denied · no download</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Link protection</span>
                    <span className="font-semibold text-slate-800">Time-limited · no public links</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>View download audit</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Revoke link</button>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-2.5 lg:col-span-4">
            <Panel title={`Export preview · ${selected.id}`}>
              <div className="space-y-2">
                <div className="divide-y divide-slate-100 text-[13px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Classification</span>
                    <span className="font-semibold text-slate-800">{selected.classification}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Purpose</span>
                    <span className="font-semibold text-slate-800">{selected.purpose}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Allowed fields</span>
                    <span className="font-semibold text-slate-800">{selected.allowedFields}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Excluded</span>
                    <span className="font-semibold text-slate-800">{selected.excluded}</span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-[13px]">
                  <p className="mb-1 font-semibold text-slate-800">Masked preview</p>
                  {selected.maskedLines.map((line) => (
                    <p key={line} className="text-slate-600">{line}</p>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-[13px]">
                  <span className="text-slate-500">Download expiry</span>
                  <span className="font-semibold text-slate-800">{selected.expiry}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Review request</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Deny export</button>
                </div>
              </div>
            </Panel>

            <Panel title="Data loss prevention">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Review due</span>
                  <span className="font-semibold text-slate-800">03</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Denied requests</span>
                  <span className="font-semibold text-slate-800">02</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Public links</span>
                  <span className="font-semibold text-slate-800">Not allowed</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Audit</span>
                  <span className="font-semibold text-slate-800">Actor / scope / reason</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </SuperAdminFrame>
  );
}

