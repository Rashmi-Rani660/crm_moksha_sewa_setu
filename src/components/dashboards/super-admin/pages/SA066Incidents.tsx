"use client";

/** SA-066 — Security Alerts & Incident Management. Demo data. */

import { Fragment, useMemo, useState } from "react";
import { ArrowRight, Bell, CircleCheck, Network, Radio, UsersRound } from "lucide-react";
import {
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  PrimaryButton,
  SuperAdminFrame,
} from "@/components/dashboards/super-admin/kit";
import { ScreenSwitch, securityScreens } from "@/components/dashboards/super-admin/screen-switch";

type TabId = "overview" | "records" | "review" | "activity" | "reports";
type IncidentStatus = "Investigating" | "Contained" | "Open";

interface IncidentRecord {
  id: string;
  severity: "High" | "Critical" | "Medium";
  source: string;
  owner: string;
  containment: string;
  status: IncidentStatus;
  detected: string;
  affectedScope: string;
  evidence: string;
  nextAction: string;
  notification: string;
  age: string;
  responseTarget: string;
}

const INCIDENTS: IncidentRecord[] = [
  { id: "INC-001", severity: "High", source: "Login monitoring", owner: "Security Admin", containment: "Rate limit", status: "Investigating", detected: "26 Nov · 10:24 AM", affectedScope: "Auth gateway", evidence: "Restricted vault", nextAction: "Review IP logs", notification: "Internal security", age: "18 min · demo", responseTarget: "Approved severity policy" },
  { id: "INC-002", severity: "Critical", source: "Device monitoring", owner: "Security Admin", containment: "Device blocked", status: "Contained", detected: "26 Nov · 10:18 AM", affectedScope: "Staff App", evidence: "Restricted vault", nextAction: "Verify device owner", notification: "Internal security", age: "24 min · demo", responseTarget: "Approved severity policy" },
  { id: "INC-003", severity: "Critical", source: "Export monitoring", owner: "Super Admin", containment: "Export held", status: "Investigating", detected: "26 Nov · 09:45 AM", affectedScope: "Export service", evidence: "Restricted vault", nextAction: "Review access + logs", notification: "Assess applicable obligations", age: "39 min · demo", responseTarget: "Approved severity policy" },
  { id: "INC-004", severity: "Medium", source: "Patch scan", owner: "IT Admin", containment: "Review due", status: "Open", detected: "26 Nov · 09:30 AM", affectedScope: "API node", evidence: "Scan report", nextAction: "Schedule patch window", notification: "IT Operations", age: "54 min · demo", responseTarget: "Approved severity policy" },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "records", label: "Records" },
  { id: "review", label: "Review & approvals" },
  { id: "activity", label: "Activity history" },
  { id: "reports", label: "Reports" },
];

const TIMELINE_STEPS: { label: string; tone: "blue" | "green" }[] = [
  { label: "Detect", tone: "blue" },
  { label: "Assess", tone: "green" },
  { label: "Contain", tone: "blue" },
  { label: "Investigate", tone: "green" },
  { label: "Recover", tone: "blue" },
  { label: "Validate", tone: "green" },
  { label: "Close", tone: "blue" },
];

const SEVERITY_BARS = [
  { label: "Critical", value: 2, height: "h-10" },
  { label: "High", value: 1, height: "h-6" },
  { label: "Medium", value: 1, height: "h-6" },
];

const STATUS_BADGE: Record<IncidentStatus, string> = {
  Investigating: "border border-amber-200 bg-amber-50 text-amber-700",
  Contained: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  Open: "border border-sky-200 bg-sky-50 text-sky-700",
};

export default function SA066Incidents() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("INC-003");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return INCIDENTS;
    return INCIDENTS.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.severity.toLowerCase().includes(q),
    );
  }, [search]);

  const selected = INCIDENTS.find((r) => r.id === selectedId) ?? INCIDENTS[2];

  return (
    <SuperAdminFrame active="system-security">
      <div className="space-y-2.5">
        <PageHead
          light
          title="Security Alerts & Incident Management"
          links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <ScreenSwitch current="SA-066" screens={securityScreens} />
          </div>
        </PageHead>

        <KpiRow cols={6}>
          <KpiTile tone="red" value="02" label="Critical" sub="Demo snapshot" icon={Radio} />
          <KpiTile tone="green" value="01" label="High" sub="Demo snapshot" icon={Bell} />
          <KpiTile tone="orange" value="02" label="Investigating" sub="Demo snapshot" icon={CircleCheck} />
          <KpiTile tone="purple" value="01" label="Contained" sub="Demo snapshot" icon={UsersRound} />
          <KpiTile tone="blue" value="04" label="Open incidents" sub="Demo snapshot" icon={Network} />
          <KpiTile tone="green" value="06" label="Closed this month" sub="Demo snapshot" icon={Radio} />
        </KpiRow>

        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs sm:grid-cols-5">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 text-center text-[14px] font-semibold transition-colors ${
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
            <Panel title="Security Alerts & Incident Management · register">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search records..."
                    className="min-w-[200px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Filter</button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Export</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-[15px]">
                    <thead>
                      <tr className="border-y border-slate-200 bg-slate-50/80 text-[14px] font-semibold text-slate-600">
                        <th className="px-2 py-1.5">Incident ID</th>
                        <th className="px-2 py-1.5">Severity</th>
                        <th className="px-2 py-1.5">Detection source</th>
                        <th className="px-2 py-1.5">Owner</th>
                        <th className="px-2 py-1.5">Containment</th>
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
                          <td className="px-2 py-1.5 text-slate-600">{row.severity}</td>
                          <td className="px-2 py-1.5 font-medium text-slate-700">{row.source}</td>
                          <td className="px-2 py-1.5 text-slate-600 whitespace-nowrap">{row.owner}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.containment}</td>
                          <td className="px-2 py-1.5 text-right whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[15px] font-semibold ${STATUS_BADGE[row.status]}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Open incident</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Escalate</button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Record containment</button>
                </div>
              </div>
            </Panel>

            <Panel title="Incident response timeline">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-100 bg-slate-50/60 p-1.5">
                  {TIMELINE_STEPS.map((step, idx) => (
                    <Fragment key={step.label}>
                      <div
                        className={`min-w-[68px] flex-1 rounded-lg border px-2 py-1.5 text-center text-[15px] font-semibold ${
                          step.tone === "green"
                            ? "border-emerald-200 bg-emerald-50/80 text-slate-700"
                            : "border-blue-200 bg-blue-50/80 text-slate-700"
                        }`}
                      >
                        {step.label}
                      </div>
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <ArrowRight className="h-3 w-3 shrink-0 text-slate-400" />
                      )}
                    </Fragment>
                  ))}
                </div>
                <div className="divide-y divide-slate-100 text-[15px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">09:45 · INC-003</span>
                    <span className="font-semibold text-slate-800">Export anomaly detected</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">09:47</span>
                    <span className="font-semibold text-slate-800">Export held · demo</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">10:24</span>
                    <span className="font-semibold text-slate-800">Evidence review in progress</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Closure gate</span>
                    <span className="font-semibold text-slate-800">Independent validation required</span>
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-2 lg:col-span-4">
            <Panel title={`Selected incident · ${selected.id}`}>
              <div className="space-y-1.5">
                <div className="divide-y divide-slate-100 text-[14px]">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Detected</span>
                    <span className="font-semibold text-slate-800">{selected.detected}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Affected scope</span>
                    <span className="font-semibold text-slate-800">{selected.affectedScope}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Owner</span>
                    <span className="font-semibold text-slate-800">{selected.owner}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Evidence</span>
                    <span className="font-semibold text-slate-800">{selected.evidence}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Next action</span>
                    <span className="font-semibold text-slate-800">{selected.nextAction}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Notification</span>
                    <span className="font-semibold text-slate-800">{selected.notification}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <PrimaryButton>Open incident</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Escalate</button>
                </div>
                <div className="divide-y divide-slate-100 border-t border-slate-100 pt-0.5 text-[14px]">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Age at snapshot</span>
                    <span className="font-semibold text-slate-800">{selected.age}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Response target</span>
                    <span className="font-semibold text-slate-800">{selected.responseTarget}</span>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Incident severity & response">
              <div className="space-y-1.5">
                <p className="text-[15px] font-medium text-slate-500">
                  Open incidents · 4 demo records
                </p>
                <div className="grid grid-cols-3 items-end gap-4">
                  {SEVERITY_BARS.map((bar) => (
                    <div key={bar.label} className="flex flex-col items-center gap-0.5">
                      <span className="text-[15px] font-semibold text-slate-700">{bar.value}</span>
                      <div className={`w-full rounded-t-md bg-blue-600 ${bar.height === "h-10" ? "h-7" : "h-4"}`} />
                      <span className="text-[15px] text-slate-500">{bar.label}</span>
                    </div>
                  ))}
                </div>
                <div className="divide-y divide-slate-100 border-t border-slate-100 pt-0.5 text-[14px]">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600">Critical queue</span>
                    <span className="font-semibold text-slate-800">02 · review immediately</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600">Notifications</span>
                    <span className="font-semibold text-slate-800">Assess applicable obligations</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <PrimaryButton>Response timers</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Evidence vault</button>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </SuperAdminFrame>
  );
}

