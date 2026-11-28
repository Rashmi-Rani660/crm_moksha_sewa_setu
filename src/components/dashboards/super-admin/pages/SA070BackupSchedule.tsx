"use client";

/** SA-070 — Backup Schedule & Restoration. Demo data. */

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
import { ScreenSwitch, backupScreens } from "@/components/dashboards/super-admin/screen-switch";

type TabId = "overview" | "controls" | "alerts" | "history" | "reports";
type ScheduleStatus = "Active" | "Scheduled";

interface ScheduleRecord {
  id: string;
  scope: string;
  frequency: string;
  destination: string;
  retention: string;
  status: ScheduleStatus;
}

const SCHEDULES: ScheduleRecord[] = [
  { id: "SCH-001", scope: "CRM database", frequency: "Daily 02:00", destination: "Encrypted vault", retention: "Policy based", status: "Active" },
  { id: "SCH-002", scope: "Transaction logs", frequency: "Every 15 min", destination: "Offsite vault", retention: "Policy based", status: "Active" },
  { id: "SCH-003", scope: "Documents", frequency: "Daily 02:15", destination: "Immutable vault", retention: "Policy based", status: "Active" },
  { id: "SCH-004", scope: "Restore test", frequency: "Monthly", destination: "Isolated sandbox", retention: "Test policy", status: "Scheduled" },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "controls", label: "Controls" },
  { id: "alerts", label: "Alerts & approvals" },
  { id: "history", label: "History" },
  { id: "reports", label: "Reports" },
];

const CALENDAR_WEEKS = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, null, null, null, null, null, null],
];

const STATUS_BADGE: Record<ScheduleStatus, string> = {
  Active: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  Scheduled: "border border-sky-200 bg-sky-50 text-sky-700",
};

export default function SA070BackupSchedule() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("SCH-001");
  const [selectedDay, setSelectedDay] = useState(26);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SCHEDULES;
    return SCHEDULES.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.scope.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <SuperAdminFrame active="backup-recovery">
      <div className="space-y-2.5">
        <PageHead
          light
          title="Backup Schedule & Restoration"
          links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <ScreenSwitch current="SA-070" screens={backupScreens} />
          </div>
        </PageHead>

        <KpiRow cols={6}>
          <KpiTile tone="blue" value="Daily + logs" label="Schedule" sub="Demo snapshot" icon={Radio} />
          <KpiTile tone="green" value="Policy based" label="Retention" sub="Demo snapshot" icon={Bell} />
          <KpiTile tone="orange" value="Required" label="Encryption" sub="Demo snapshot" icon={CircleCheck} />
          <KpiTile tone="purple" value="Pending" label="Restore approval" sub="Demo snapshot" icon={UsersRound} />
          <KpiTile tone="blue" value="02:00 AM" label="Next backup" sub="Demo snapshot" icon={Network} />
          <KpiTile tone="green" value="Monthly" label="Test cadence" sub="Demo snapshot" icon={Radio} />
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
            <Panel title="Backup Schedule & Restoration · register">
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
                        <th className="px-2 py-1.5">Schedule ID</th>
                        <th className="px-2 py-1.5">Scope</th>
                        <th className="px-2 py-1.5">Frequency</th>
                        <th className="px-2 py-1.5">Destination</th>
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
                            row.id === selectedId ? "bg-blue-50/60" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-2 py-1.5 font-semibold text-slate-800 whitespace-nowrap">{row.id}</td>
                          <td className="px-2 py-1.5 font-medium text-slate-700">{row.scope}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.frequency}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.destination}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.retention}</td>
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
                  <PrimaryButton>Preview schedule</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Request restore</button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Test configuration</button>
                </div>
              </div>
            </Panel>

            <Panel title="Backup calendar · November 2026">
              <div className="space-y-2">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-center text-[14px]">
                    <thead>
                      <tr className="border-y border-slate-200 bg-slate-50/80 text-[15px] font-semibold text-slate-600">
                        <th className="py-1">Mon</th>
                        <th className="py-1">Tue</th>
                        <th className="py-1">Wed</th>
                        <th className="py-1">Thu</th>
                        <th className="py-1">Fri</th>
                        <th className="py-1">Sat</th>
                        <th className="py-1">Sun</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {CALENDAR_WEEKS.map((week, wIdx) => (
                        <tr key={wIdx}>
                          {week.map((day, dIdx) => (
                            <td key={dIdx} className="p-0.5">
                              {day ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedDay(day)}
                                  className={`w-full rounded py-1 text-[14px] font-medium transition-colors ${
                                    selectedDay === day
                                      ? "bg-blue-600 font-semibold text-white"
                                      : "text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  {day}
                                </button>
                              ) : (
                                <span className="block py-1" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[15px] text-slate-500">
                  {selectedDay} Nov selected · daily schedule, Asia/Kolkata
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <PrimaryButton>Preview schedule</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Next scheduled jobs</button>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-2 lg:col-span-4">
            <Panel title="Proposed restore request">
              <div className="space-y-1.5">
                <div className="divide-y divide-slate-100 text-[14px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Restore point</span>
                    <span className="font-semibold text-slate-800">26 Nov · 02:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Scope</span>
                    <span className="font-semibold text-slate-800">CRM database</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Target environment</span>
                    <span className="font-semibold text-slate-800">Isolated sandbox</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Requested by</span>
                    <span className="font-semibold text-slate-800">IT Admin</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Approver</span>
                    <span className="font-semibold text-slate-800">Super Admin + checker</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Production overwrite</span>
                    <span className="font-semibold text-slate-800">Blocked by default</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Preview schedule</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Request restore</button>
                </div>
              </div>
            </Panel>

            <Panel title="Restoration progress & approval">
              <div className="space-y-2">
                <div className="divide-y divide-slate-100 text-[15px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Current request</span>
                    <span className="font-semibold text-slate-800">Not started · awaiting approval</span>
                  </div>
                  <div className="py-1.5">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-500">Restore progress</span>
                      <span className="font-semibold text-slate-800">0%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" />
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Target environment</span>
                    <span className="font-semibold text-slate-800">Isolated sandbox</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Pre-restore snapshot</span>
                    <span className="font-semibold text-slate-800">Required</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Rollback / validation</span>
                    <span className="font-semibold text-slate-800">Documented plan required</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Review approval</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Test restore</button>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </SuperAdminFrame>
  );
}

