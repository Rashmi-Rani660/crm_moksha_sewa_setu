"use client";

/** SA-065 — Device & Access Management. Demo data. */

import { Fragment, useState } from "react";
import { ArrowRight, Bell, CircleCheck, Network, Radio, UsersRound } from "lucide-react";
import {
  KpiRow,
  useNotice,
  KpiTile,
  PageHead,
  Panel,
  PrimaryButton,
  SuperAdminFrame,
} from "@/components/dashboards/super-admin/kit";
import { useSessions } from "@/lib/crm/useSessions";
import { EMPTY, count, records, text } from "@/lib/crm/data";
import { humanize, shortDateTime } from "@/lib/format";
import { ScreenSwitch, securityScreens } from "@/components/dashboards/super-admin/screen-switch";

type TabId = "overview" | "records" | "review" | "activity" | "reports";
type DeviceStatus = "Active" | "Review" | "Blocked" | "Revoked";

interface DeviceRecord {
  id: string;
  employeeId: string;
  deviceType: string;
  lastVerified: string;
  trustStatus: string;
  status: DeviceStatus;
  source: string;
  accessLevel: string;
  verification: string;
  mfa: string;
  lastSeen: string;
  actionScope: string;
}



const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "records", label: "Records" },
  { id: "review", label: "Review & approvals" },
  { id: "activity", label: "Activity history" },
  { id: "reports", label: "Reports" },
];

const PIPELINE_STEPS: { label: string; tone: "blue" | "green" }[] = [
  { label: "Register", tone: "blue" },
  { label: "Verify", tone: "green" },
  { label: "Trust", tone: "blue" },
  { label: "Monitor", tone: "green" },
  { label: "Revoke", tone: "blue" },
];

const STATUS_BADGE: Record<DeviceStatus, string> = {
  Active: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  Review: "border border-amber-200 bg-amber-50 text-amber-700",
  Blocked: "border border-rose-200 bg-rose-50 text-rose-700",
  Revoked: "border border-rose-200 bg-rose-50 text-rose-700",
};

export default function SA065DeviceManagement() {
  const notice = useNotice();
  const live = useSessions("devices",notice.show);
  const DEVICES: DeviceRecord[] = records(live.list.data).map(row => ({ id: text(row.id),employeeId: text(live.person?.crmId ?? live.profile?.crmId),deviceType: text(row.device),lastVerified: shortDateTime(text(row.firstSeenAt,"")),trustStatus: row.revoked ? "Revoked" : "Trusted",status: row.revoked ? "Revoked" : "Active",source: EMPTY,accessLevel: humanize(text(live.person?.accessLevel ?? live.profile?.accessLevel,"")),verification: EMPTY,mfa: EMPTY,lastSeen: shortDateTime(text(row.lastSeenAt,"")),actionScope: "Device only" }));
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const filtered = (() => {
    const q = search.trim().toLowerCase();
    if (!q) return DEVICES;
    return DEVICES.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q) ||
        r.deviceType.toLowerCase().includes(q) ||
        r.trustStatus.toLowerCase().includes(q),
    );
  })();

  const selected: DeviceRecord = DEVICES.find(row => row.id === selectedId) ?? DEVICES[0] ?? { id: "",employeeId: EMPTY,deviceType: EMPTY,lastVerified: EMPTY,trustStatus: EMPTY,status: "Active",source: EMPTY,accessLevel: EMPTY,verification: EMPTY,mfa: EMPTY,lastSeen: EMPTY,actionScope: EMPTY };

  return (
    <SuperAdminFrame active="system-security">
      <div className="space-y-2.5">
        <PageHead
          light
          title="Device & Access Management"
          links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <ScreenSwitch current="SA-065" screens={securityScreens} />
          </div>
        </PageHead>

        <KpiRow cols={6}>
          <KpiTile tone="blue" value={live.list.data ? count(DEVICES.length) : EMPTY} label="Registered devices" sub="Demo snapshot" icon={Radio} />
          <KpiTile tone="green" value={EMPTY} label="Pending verification" sub="Demo snapshot" icon={Bell} />
          <KpiTile tone="orange" value={EMPTY} label="Blocked" sub="Demo snapshot" icon={CircleCheck} />
          <KpiTile tone="purple" value={EMPTY} label="Revoked" sub="Demo snapshot" icon={UsersRound} />
          <KpiTile tone="blue" value={EMPTY} label="Trusted" sub="Demo snapshot" icon={Network} />
          <KpiTile tone="green" value={EMPTY} label="Policy exceptions" sub="Demo snapshot" icon={Radio} />
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
            <Panel title="Device & Access Management · register">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search records..."
                    className="min-w-[200px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                  <button type="button" onClick={live.selectUser} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Filter</button>
                  <button type="button" disabled className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Export</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-[15px]">
                    <thead>
                      <tr className="border-y border-slate-200 bg-slate-50/80 text-[14px] font-semibold text-slate-600">
                        <th className="px-2 py-1.5">Device ID</th>
                        <th className="px-2 py-1.5">Employee ID</th>
                        <th className="px-2 py-1.5">Device type</th>
                        <th className="px-2 py-1.5">Last verified</th>
                        <th className="px-2 py-1.5">Trust status</th>
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
                          <td className="px-2 py-1.5 font-medium text-slate-700">{row.employeeId}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.deviceType}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.lastVerified}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.trustStatus}</td>
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
                  <PrimaryButton disabled={!selected.id} onClick={() => notice.show(`${selected.deviceType} ? ${selected.lastSeen}`)}>Review device</PrimaryButton>
                  <button type="button" disabled={!live.canRevoke(selected.id)} onClick={() => live.revoke(selected.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Revoke access</button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">View policy</button>
                </div>
              </div>
            </Panel>

            <Panel title="Device trust & revocation">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50/60 p-1.5">
                  {PIPELINE_STEPS.map((step, idx) => (
                    <Fragment key={step.label}>
                      <div
                        className={`min-w-[84px] flex-1 rounded-lg border px-2.5 py-1.5 text-center text-[14px] font-semibold ${
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
                <div className="divide-y divide-slate-100 text-[15px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">New device queue</span>
                    <span className="font-semibold text-slate-800">{EMPTY}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Trust validity</span>
                    <span className="font-semibold text-slate-800">Policy-based review date</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">HRMS exit / lost device</span>
                    <span className="font-semibold text-slate-800">Revoke scoped credentials</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Review approvals</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Lost device</button>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-2 lg:col-span-4">
            <Panel title={`Selected device · ${selected.id}`}>
              <div className="space-y-1.5">
                <div className="divide-y divide-slate-100 text-[14px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Employee source</span>
                    <span className="font-semibold text-slate-800">{selected.source}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Access level</span>
                    <span className="font-semibold text-slate-800">{selected.accessLevel}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Verification</span>
                    <span className="font-semibold text-slate-800">{selected.verification}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">MFA</span>
                    <span className="font-semibold text-slate-800">{selected.mfa}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Last seen</span>
                    <span className="font-semibold text-slate-800">{selected.lastSeen}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Action scope</span>
                    <span className="font-semibold text-slate-800">{selected.actionScope}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton disabled={!selected.id} onClick={() => notice.show(`${selected.deviceType} ? ${selected.lastSeen}`)}>Review device</PrimaryButton>
                  <button type="button" disabled={!live.canRevoke(selected.id)} onClick={() => live.revoke(selected.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Revoke access</button>
                </div>
                <div className="divide-y divide-slate-100 border-t border-slate-100 pt-1 text-[15px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Trust expiry</span>
                    <span className="font-semibold text-slate-800">Not issued</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Temporary access</span>
                    <span className="font-semibold text-slate-800">Approval required</span>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Device policy">
              <div className="divide-y divide-slate-100 text-[15px]">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Unverified devices</span>
                  <span className="font-semibold text-slate-800">Restricted</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Trusted devices</span>
                  <span className="font-semibold text-slate-800">{EMPTY}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Blocked devices</span>
                  <span className="font-semibold text-slate-800">{EMPTY}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600">Personal content</span>
                  <span className="font-semibold text-slate-800">Not collected</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

