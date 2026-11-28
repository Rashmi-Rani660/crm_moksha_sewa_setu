"use client";

/** SA-063 — Security Command Centre. Demo data. */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
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
import { ScreenSwitch, securityScreens } from "@/components/dashboards/super-admin/screen-switch";

type TabId = "overview" | "controls" | "alerts" | "history" | "reports";
type EventStatus = "Investigating" | "Contained" | "Open";

interface SecurityEvent {
  id: string;
  detection: string;
  severity: "High" | "Critical" | "Medium";
  owner: string;
  lastSeen: string;
  status: EventStatus;
}

const EVENTS: SecurityEvent[] = [
  { id: "INC-001", detection: "Repeated failed login", severity: "High", owner: "Security Admin", lastSeen: "10:24 AM", status: "Investigating" },
  { id: "INC-002", detection: "Unrecognised device", severity: "Critical", owner: "Security Admin", lastSeen: "10:18 AM", status: "Contained" },
  { id: "INC-003", detection: "Export anomaly", severity: "Critical", owner: "Super Admin", lastSeen: "09:45 AM", status: "Investigating" },
  { id: "INC-004", detection: "Patch review", severity: "Medium", owner: "IT Admin", lastSeen: "09:30 AM", status: "Open" },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "controls", label: "Controls" },
  { id: "alerts", label: "Alerts & approvals" },
  { id: "history", label: "History" },
  { id: "reports", label: "Reports" },
];

const TREND_BARS = [
  { label: "00–04", value: 0, height: "h-1" },
  { label: "04–08", value: 1, height: "h-4" },
  { label: "08–12", value: 3, height: "h-10" },
  { label: "12–16", value: 2, height: "h-7" },
  { label: "16–20", value: 1, height: "h-4" },
  { label: "20–24", value: 1, height: "h-4" },
];

const STATUS_BADGE: Record<EventStatus, string> = {
  Investigating: "border border-amber-200 bg-amber-50 text-amber-700",
  Contained: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  Open: "border border-sky-200 bg-sky-50 text-sky-700",
};

export const SECURITY_ROUTES: Record<string, string> = {
  "SA-063": "/dashboard/super-admin/system-security",
  "SA-064": "/dashboard/super-admin/system-security/sessions",
  "SA-065": "/dashboard/super-admin/system-security/devices",
  "SA-066": "/dashboard/super-admin/system-security/incidents",
  "SA-067": "/dashboard/super-admin/system-security/export-control",
  "SA-068": "/dashboard/super-admin/system-security/consent-privacy",
};

export default function SA063SecurityCommand() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("INC-001");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return EVENTS;
    return EVENTS.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.detection.toLowerCase().includes(q) ||
        r.severity.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <SuperAdminFrame active="system-security">
      <div className="space-y-2.5">
        <PageHead
          light
          title="Security Command Centre"
          links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <ScreenSwitch current="SA-063" screens={securityScreens} />
          </div>
        </PageHead>

        <KpiRow cols={6}>
          <KpiTile tone="red" value="02" label="Critical alerts" sub="Demo snapshot" icon={Radio} />
          <KpiTile tone="green" value="48" label="Active sessions" sub="Demo snapshot" icon={Bell} />
          <KpiTile tone="orange" value="08" label="Failed logins · 24h" sub="Demo snapshot" icon={CircleCheck} />
          <KpiTile tone="purple" value="100%" label="MFA coverage" sub="Demo snapshot" icon={UsersRound} />
          <KpiTile tone="blue" value="03" label="Export review" sub="Demo snapshot" icon={Network} />
          <KpiTile tone="green" value="04" label="Open incidents" sub="Demo snapshot" icon={Radio} />
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
            <Panel title="Security event queue · latest snapshot">
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
                        <th className="px-2 py-1.5">Event ID</th>
                        <th className="px-2 py-1.5">Detection</th>
                        <th className="px-2 py-1.5">Severity</th>
                        <th className="px-2 py-1.5">Owner</th>
                        <th className="px-2 py-1.5">Last seen</th>
                        <th className="px-2 py-1.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedId(row.id)}
                          className={`cursor-pointer transition-colors ${
                            row.id === selectedId ? "bg-blue-50/60" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-2 py-1.5 font-semibold text-slate-800 whitespace-nowrap">{row.id}</td>
                          <td className="px-2 py-1.5 font-medium text-slate-700">{row.detection}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.severity}</td>
                          <td className="px-2 py-1.5 text-slate-600 whitespace-nowrap">{row.owner}</td>
                          <td className="px-2 py-1.5 text-slate-600 whitespace-nowrap">{row.lastSeen}</td>
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
                  <PrimaryButton onClick={() => router.push("/dashboard/super-admin/system-security/incidents")}>Review incident</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">
                    Open emergency controls
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/super-admin/system-security/sessions")}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Review sessions
                  </button>
                </div>
              </div>
            </Panel>

            <Panel title="Security event trend · last 24 hours">
              <div className="space-y-2">
                <p className="text-[15px] font-medium text-slate-500">
                  Illustrative failed logins by 4-hour interval · total 8
                </p>
                <div className="grid grid-cols-6 items-end gap-3 pt-1">
                  {TREND_BARS.map((bar) => (
                    <div key={bar.label} className="flex flex-col items-center gap-1">
                      <span className="text-[15px] font-semibold text-slate-700">{bar.value}</span>
                      <div className={`w-full rounded-t-md bg-blue-600 ${bar.height}`} />
                      <span className="text-[15px] text-slate-500">{bar.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[15px]">
                  <span className="text-slate-600">Critical alerts</span>
                  <span className="font-semibold text-slate-800">02 · immediate review</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <PrimaryButton>View 7 days</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">
                    View 30 days
                  </button>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-2 lg:col-span-4">
            <Panel title="Security posture & emergency control">
              <div className="space-y-1.5">
                <div className="divide-y divide-slate-100 text-[14px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Telemetry last received</span>
                    <span className="font-semibold text-slate-800">26 Nov · 10:24 AM · demo</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">MFA / active sessions</span>
                    <span className="font-semibold text-slate-800">Required / 48</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Unpatched findings</span>
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[15px] font-semibold text-amber-700">
                      01 · review
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">API credentials</span>
                    <span className="font-semibold text-slate-800">Review expiry</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Backup / restore test</span>
                    <span className="font-semibold text-slate-800">02:00 AM / Passed · demo</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Break-glass access</span>
                    <span className="font-semibold text-slate-800">Independent review</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton onClick={() => router.push("/dashboard/super-admin/system-security/incidents")}>Review incident</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">
                    Request lockdown
                  </button>
                </div>
                <p className="text-[15px] text-slate-400">
                  Lockdown: confirm scope, reason, authority and helpline continuity.
                </p>
              </div>
            </Panel>

            <Panel title="Priority actions & continuity">
              <div className="space-y-2">
                <div className="divide-y divide-slate-100 text-[15px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Export review</span>
                    <span className="font-semibold text-slate-800">03 pending</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Device verification</span>
                    <span className="font-semibold text-slate-800">02 pending</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Lockdown</span>
                    <span className="font-semibold text-slate-800">Confirmation + audit</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Human helpline</span>
                    <span className="font-semibold text-slate-800">Continuity required</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Session revocation</span>
                    <span className="font-semibold text-slate-800">Scoped and authorised</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton onClick={() => router.push("/dashboard/super-admin/system-security/incidents")}>Open alerts</PrimaryButton>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/super-admin/system-security/sessions")}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Review sessions
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

