"use client";

/** SA-064 — Login & Active Session Monitoring. Demo data. */

import { useMemo, useState } from "react";
import { Bell, CircleCheck, Network, Radio, UsersRound } from "lucide-react";
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
type SessionStatus = "Active" | "Review" | "Revoked";

interface SessionRecord {
  id: string;
  user: string;
  device: string;
  location: string;
  lastActivity: string;
  status: SessionStatus;
  risk: string;
  mfa: string;
  ip: string;
  created: string;
  expiry: string;
  revokeScope: string;
  riskReview: string;
}

const SESSIONS: SessionRecord[] = [
  { id: "SES-001", user: "User 07", device: "Chrome / desktop", location: "Ghaziabad", lastActivity: "10:24 AM", status: "Active", risk: "Low", mfa: "Verified", ip: "Masked", created: "26 Nov · 09:00 AM", expiry: "Policy controlled", revokeScope: "Selected session only", riskReview: "Normal activity" },
  { id: "SES-002", user: "Admin 01", device: "Edge / desktop", location: "Ghaziabad", lastActivity: "10:22 AM", status: "Active", risk: "Low", mfa: "Verified", ip: "Masked", created: "26 Nov · 08:45 AM", expiry: "Policy controlled", revokeScope: "Selected session only", riskReview: "Normal activity" },
  { id: "SES-003", user: "User 09", device: "Staff App", location: "Ghaziabad", lastActivity: "10:18 AM", status: "Active", risk: "Low", mfa: "Verified", ip: "Masked", created: "26 Nov · 09:10 AM", expiry: "Policy controlled", revokeScope: "Selected session only", riskReview: "Normal activity" },
  { id: "SES-004", user: "User 12", device: "New browser", location: "Unknown", lastActivity: "10:12 AM", status: "Review", risk: "High · new device", mfa: "Verified", ip: "Masked", created: "26 Nov · 09:50 AM", expiry: "Policy controlled", revokeScope: "Selected session only", riskReview: "New browser / unknown location" },
  { id: "SES-005", user: "User 14", device: "Staff App", location: "Unknown", lastActivity: "09:54 AM", status: "Revoked", risk: "High", mfa: "Verified", ip: "Masked", created: "26 Nov · 08:15 AM", expiry: "Revoked", revokeScope: "Selected session only", riskReview: "Session terminated" },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "records", label: "Records" },
  { id: "review", label: "Review & approvals" },
  { id: "activity", label: "Activity history" },
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

const STATUS_BADGE: Record<SessionStatus, string> = {
  Active: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  Review: "border border-amber-200 bg-amber-50 text-amber-700",
  Revoked: "border border-rose-200 bg-rose-50 text-rose-700",
};

export default function SA064SessionMonitoring() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("SES-004");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SESSIONS;
    return SESSIONS.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.user.toLowerCase().includes(q) ||
        r.device.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q),
    );
  }, [search]);

  const selected = SESSIONS.find((r) => r.id === selectedId) ?? SESSIONS[3];

  return (
    <SuperAdminFrame active="system-security">
      <div className="space-y-2.5">
        <PageHead
          light
          title="Login & Active Session Monitoring"
          links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <ScreenSwitch current="SA-064" screens={securityScreens} />
          </div>
        </PageHead>

        <KpiRow cols={6}>
          <KpiTile tone="blue" value="48" label="Active sessions" sub="Demo snapshot" icon={Radio} />
          <KpiTile tone="green" value="08" label="Failed logins · 24h" sub="Demo snapshot" icon={Bell} />
          <KpiTile tone="orange" value="02" label="New devices" sub="Demo snapshot" icon={CircleCheck} />
          <KpiTile tone="purple" value="01" label="Revoked today" sub="Demo snapshot" icon={UsersRound} />
          <KpiTile tone="blue" value="02" label="Risk review" sub="Demo snapshot" icon={Network} />
          <KpiTile tone="green" value="100%" label="MFA coverage" sub="Demo snapshot" icon={Radio} />
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
            <Panel title="Login & Active Session Monitoring · register">
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
                        <th className="px-2 py-1.5">Session ID</th>
                        <th className="px-2 py-1.5">User</th>
                        <th className="px-2 py-1.5">Device</th>
                        <th className="px-2 py-1.5">Approx. location</th>
                        <th className="px-2 py-1.5">Last activity</th>
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
                          <td className="px-2 py-1.5 text-slate-600">{row.device}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.location}</td>
                          <td className="px-2 py-1.5 text-slate-600 whitespace-nowrap">{row.lastActivity}</td>
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
                  <PrimaryButton>Review session</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Revoke session</button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">View login history</button>
                </div>
              </div>
            </Panel>

            <Panel title="Authentication trend · 24 hours">
              <div className="space-y-2">
                <p className="text-[15px] font-medium text-slate-500">
                  Illustrative failed login events · total 8
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
                  <span className="text-slate-600">Idle timeout</span>
                  <span className="font-semibold text-slate-800">Approved policy</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <PrimaryButton>Filter by risk</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Session history</button>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-2 lg:col-span-4">
            <Panel title={`Selected session · ${selected.id}`}>
              <div className="space-y-1.5">
                <div className="divide-y divide-slate-100 text-[14px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Risk</span>
                    <span className="font-semibold text-slate-800">{selected.risk}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">MFA</span>
                    <span className="font-semibold text-slate-800">{selected.mfa}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">IP</span>
                    <span className="font-semibold text-slate-800">{selected.ip}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Created</span>
                    <span className="font-semibold text-slate-800">{selected.created}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Session expiry</span>
                    <span className="font-semibold text-slate-800">{selected.expiry}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Revoke scope</span>
                    <span className="font-semibold text-slate-800">{selected.revokeScope}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Review session</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Revoke session</button>
                </div>
                <div className="divide-y divide-slate-100 border-t border-slate-100 pt-1 text-[15px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Last activity</span>
                    <span className="font-semibold text-slate-800">{selected.lastActivity} · demo</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Risk review</span>
                    <span className="font-semibold text-slate-800">{selected.riskReview}</span>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Login exceptions">
              <div className="divide-y divide-slate-100 text-[15px]">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">New device</span>
                  <span className="font-semibold text-slate-800">02</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Failed login</span>
                  <span className="font-semibold text-slate-800">08</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Location</span>
                  <span className="font-semibold text-slate-800">Approximate only</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Revocation</span>
                  <span className="font-semibold text-slate-800">Invalidate server tokens</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </SuperAdminFrame>
  );
}

