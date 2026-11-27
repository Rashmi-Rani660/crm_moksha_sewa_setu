"use client";

/** SA-068 — Consent & Privacy Management. Demo data. */

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
type ConsentStatus = "Active" | "Withdrawn" | "Review";

interface ConsentRecord {
  id: string;
  relatedRecord: string;
  purpose: string;
  grantedDate: string;
  retention: string;
  status: ConsentStatus;
  withdrawal: string;
  processing: string;
  owner: string;
  evidence: string;
}

const CONSENTS: ConsentRecord[] = [
  { id: "CNS-001", relatedRecord: "VOL-007", purpose: "On-duty GPS", grantedDate: "24 Nov 2026", retention: "Policy based", status: "Active", withdrawal: "None", processing: "Active on duty", owner: "Privacy Admin", evidence: "Versioned notice" },
  { id: "CNS-002", relatedRecord: "MS-26-1101", purpose: "Case communication", grantedDate: "24 Nov 2026", retention: "Policy based", status: "Active", withdrawal: "None", processing: "Active", owner: "Privacy Admin", evidence: "Versioned notice" },
  { id: "CNS-003", relatedRecord: "VOL-009", purpose: "Location tracking", grantedDate: "23 Nov 2026", retention: "Review", status: "Withdrawn", withdrawal: "25 Nov · demo", processing: "Stop tracking", owner: "Privacy Admin", evidence: "Versioned notice" },
  { id: "CNS-004", relatedRecord: "MS-26-1100", purpose: "Service evidence", grantedDate: "24 Nov 2026", retention: "Policy based", status: "Review", withdrawal: "Pending", processing: "Restricted", owner: "Privacy Admin", evidence: "Versioned notice" },
  { id: "CNS-005", relatedRecord: "DON-078", purpose: "Donor updates", grantedDate: "22 Nov 2026", retention: "Policy based", status: "Active", withdrawal: "None", processing: "Active", owner: "Privacy Admin", evidence: "Versioned notice" },
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
  { label: "Verify", tone: "green" },
  { label: "Review", tone: "blue" },
  { label: "Act", tone: "green" },
  { label: "Confirm", tone: "blue" },
];

const STATUS_BADGE: Record<ConsentStatus, string> = {
  Active: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  Withdrawn: "border border-amber-200 bg-amber-50 text-amber-700",
  Review: "border border-amber-200 bg-amber-50 text-amber-700",
};

export default function SA068ConsentPrivacy() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("CNS-003");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CONSENTS;
    return CONSENTS.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.relatedRecord.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q),
    );
  }, [search]);

  const selected = CONSENTS.find((r) => r.id === selectedId) ?? CONSENTS[2];

  return (
    <SuperAdminFrame active="system-security">
      <div className="space-y-2.5">
        <PageHead
          title="Consent & Privacy Management (SA-068)"
          links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-amber-700 uppercase">
              DEMO DATA
            </span>
            <select
              aria-label="Select security module"
              value="SA-068"
              onChange={(e) => {
                const target = SECURITY_ROUTES[e.target.value];
                if (target) router.push(target);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs focus:border-blue-500 focus:outline-none"
            >
              <option value="SA-063">SA-063 · Security Command Centre</option>
              <option value="SA-064">SA-064 · Login &amp; Active Session Monitoring</option>
              <option value="SA-065">SA-065 · Device &amp; Access Management</option>
              <option value="SA-066">SA-066 · Security Alerts &amp; Incident Management</option>
              <option value="SA-067">SA-067 · Data Access &amp; Export Control</option>
              <option value="SA-068">SA-068 · Consent &amp; Privacy Management</option>
            </select>
          </div>
        </PageHead>

        <KpiRow cols={6}>
          <KpiTile tone="blue" value="124" label="Consent records" sub="Demo snapshot" icon={Radio} />
          <KpiTile tone="green" value="04" label="Withdrawn" sub="Demo snapshot" icon={Bell} />
          <KpiTile tone="orange" value="03" label="Requests due" sub="Demo snapshot" icon={CircleCheck} />
          <KpiTile tone="purple" value="01" label="Exceptions" sub="Demo snapshot" icon={UsersRound} />
          <KpiTile tone="blue" value="05" label="Privacy requests" sub="Demo snapshot" icon={Network} />
          <KpiTile tone="green" value="02" label="Review pending" sub="Demo snapshot" icon={Radio} />
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
            <Panel title="Consent & Privacy Management · register">
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
                        <th className="px-2 py-1.5">Consent ID</th>
                        <th className="px-2 py-1.5">Related record</th>
                        <th className="px-2 py-1.5">Purpose</th>
                        <th className="px-2 py-1.5">Granted date</th>
                        <th className="px-2 py-1.5">Retention</th>
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
                          <td className="px-2 py-1.5 font-medium text-slate-700">{row.relatedRecord}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.purpose}</td>
                          <td className="px-2 py-1.5 text-slate-600 whitespace-nowrap">{row.grantedDate}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.retention}</td>
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
                  <PrimaryButton>Review consent</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Process withdrawal</button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Open privacy request</button>
                </div>
              </div>
            </Panel>

            <Panel title="Privacy request queue">
              <div className="space-y-2">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-y border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                        <th className="px-2 py-1.5">Request</th>
                        <th className="px-2 py-1.5">Type</th>
                        <th className="px-2 py-1.5">Deadline</th>
                        <th className="px-2 py-1.5 text-right">Owner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-2 py-1.5 font-semibold text-slate-800">PRV-001</td>
                        <td className="px-2 py-1.5 text-slate-600">Withdrawal</td>
                        <td className="px-2 py-1.5 text-slate-600">Immediate processing stop</td>
                        <td className="px-2 py-1.5 text-right text-slate-600">Privacy Admin</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1.5 font-semibold text-slate-800">PRV-002</td>
                        <td className="px-2 py-1.5 text-slate-600">Correction</td>
                        <td className="px-2 py-1.5 text-slate-600">Policy based</td>
                        <td className="px-2 py-1.5 text-right text-slate-600">Privacy Admin</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

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

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Request history</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Retention review</button>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-2.5 lg:col-span-4">
            <Panel title={`Selected consent · ${selected.id}`}>
              <div className="space-y-2">
                <div className="divide-y divide-slate-100 text-[13px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Purpose</span>
                    <span className="font-semibold text-slate-800">{selected.purpose}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Withdrawal</span>
                    <span className="font-semibold text-slate-800">{selected.withdrawal}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Processing</span>
                    <span className="font-semibold text-slate-800">{selected.processing}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Retention</span>
                    <span className="font-semibold text-slate-800">Legal / policy review</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Owner</span>
                    <span className="font-semibold text-slate-800">{selected.owner}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Evidence</span>
                    <span className="font-semibold text-slate-800">{selected.evidence}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Review consent</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">Process withdrawal</button>
                </div>
                <div className="divide-y divide-slate-100 border-t border-slate-100 pt-1 text-[13px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Notice version</span>
                    <span className="font-semibold text-slate-800">Versioned · review evidence</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Retention deadline</span>
                    <span className="font-semibold text-slate-800">Pending policy decision</span>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Privacy safeguards">
              <div className="divide-y divide-slate-100 text-[13px]">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Off-duty GPS</span>
                  <span className="font-semibold text-slate-800">Disabled</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Consent notice</span>
                  <span className="font-semibold text-slate-800">Versioned</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Data minimisation</span>
                  <span className="font-semibold text-slate-800">Required</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Deletion requests</span>
                  <span className="font-semibold text-slate-800">Reviewed by authority</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </SuperAdminFrame>
  );
}
