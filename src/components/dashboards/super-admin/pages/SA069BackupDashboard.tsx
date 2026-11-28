"use client";

/** SA-069 — Backup & Recovery Dashboard. Demo data. */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
type BackupStatus = "Success" | "Passed";

interface BackupJob {
  id: string;
  scope: string;
  completed: string;
  destination: string;
  integrity: string;
  status: BackupStatus;
}

const BACKUPS: BackupJob[] = [
  { id: "BKP-001", scope: "CRM database", completed: "26 Nov 02:00", destination: "Primary vault", integrity: "Verified", status: "Success" },
  { id: "BKP-002", scope: "Documents", completed: "26 Nov 02:15", destination: "Offsite vault", integrity: "Verified", status: "Success" },
  { id: "BKP-003", scope: "Configuration", completed: "26 Nov 02:25", destination: "Immutable vault", integrity: "Verified", status: "Success" },
  { id: "RST-001", scope: "Test restoration", completed: "22 Nov 16:15", destination: "Sandbox", integrity: "Verified", status: "Passed" },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "controls", label: "Controls" },
  { id: "alerts", label: "Alerts & approvals" },
  { id: "history", label: "History" },
  { id: "reports", label: "Reports" },
];

const STATUS_BADGE: Record<BackupStatus, string> = {
  Success: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  Passed: "border border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function SA069BackupDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("BKP-001");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return BACKUPS;
    return BACKUPS.filter(
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
          title="Backup & Recovery Dashboard"
          links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <ScreenSwitch current="SA-069" screens={backupScreens} />
          </div>
        </PageHead>

        <KpiRow cols={6}>
          <KpiTile tone="blue" value="02:00 AM" label="Last backup" sub="Demo snapshot" icon={Radio} />
          <KpiTile tone="green" value="00" label="Failed jobs" sub="Demo snapshot" icon={Bell} />
          <KpiTile tone="orange" value="Verified" label="Immutable copy" sub="Demo snapshot" icon={CircleCheck} />
          <KpiTile tone="purple" value="Verified" label="Offsite copy" sub="Demo snapshot" icon={UsersRound} />
          <KpiTile tone="blue" value="Passed" label="Restore test" sub="Demo snapshot" icon={Network} />
          <KpiTile tone="green" value="41%" label="Storage used" sub="Demo snapshot" icon={Radio} />
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
            <Panel title="Backup & Recovery Dashboard · register">
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
                        <th className="px-2 py-1.5">Job ID</th>
                        <th className="px-2 py-1.5">Backup scope</th>
                        <th className="px-2 py-1.5">Completed</th>
                        <th className="px-2 py-1.5">Destination</th>
                        <th className="px-2 py-1.5">Integrity</th>
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
                          <td className="px-2 py-1.5 text-slate-600 whitespace-nowrap">{row.completed}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.destination}</td>
                          <td className="px-2 py-1.5 text-slate-600">{row.integrity}</td>
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
                  <PrimaryButton onClick={() => router.push("/dashboard/super-admin/backup-recovery/schedule")}>Review backups</PrimaryButton>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/super-admin/backup-recovery/schedule")}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Request restore
                  </button>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">View test evidence</button>
                </div>
              </div>
            </Panel>

            <Panel title="Backup success · recent jobs">
              <div className="space-y-2">
                <p className="text-[15px] font-medium text-slate-500">
                  Latest 3 backup jobs shown in register · demo
                </p>
                <div className="grid grid-cols-3 items-end gap-4 pt-1">
                  {["Database", "Documents", "Configuration"].map((label) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span className="text-[15px] font-semibold text-slate-700">1</span>
                      <div className="h-9 w-full rounded-t-md bg-emerald-600" />
                      <span className="text-[15px] text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="divide-y divide-slate-100 border-t border-slate-100 pt-1 text-[15px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Failed jobs</span>
                    <span className="font-semibold text-slate-800">00 in displayed sample</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Storage forecast</span>
                    <span className="font-semibold text-slate-800">Requires historical telemetry</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>View backup history</PrimaryButton>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50">Capacity alerts</button>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-2 lg:col-span-4">
            <Panel title="Recovery readiness · actual vs target">
              <div className="space-y-1.5">
                <div className="divide-y divide-slate-100 text-[14px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Actual recovery point</span>
                    <span className="font-semibold text-slate-800">8 min · demo</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Proposed RPO</span>
                    <span className="font-semibold text-slate-800">15 min</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Last restore duration</span>
                    <span className="font-semibold text-slate-800">1 h 20 min · demo</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Proposed RTO</span>
                    <span className="font-semibold text-slate-800">4 h</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Storage</span>
                    <span className="font-semibold text-slate-800">412 GB / 1 TB</span>
                  </div>
                  <div className="py-1.5">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-500">Storage used</span>
                      <span className="font-semibold text-slate-800">41.2%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-[41.2%] rounded-full bg-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500">Restore test</span>
                    <span className="font-semibold text-slate-800">Passed · demo</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton onClick={() => router.push("/dashboard/super-admin/backup-recovery/schedule")}>Review backups</PrimaryButton>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/super-admin/backup-recovery/schedule")}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[14px] font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Request restore
                  </button>
                </div>
              </div>
            </Panel>

            <Panel title="Recovery safeguards">
              <div className="space-y-2">
                <div className="divide-y divide-slate-100 text-[15px]">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Immutable copy</span>
                    <span className="font-semibold text-slate-800">Policy enforced</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Offsite copy</span>
                    <span className="font-semibold text-slate-800">Last job verified · demo</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Encryption</span>
                    <span className="font-semibold text-slate-800">Required</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Restore evidence</span>
                    <span className="font-semibold text-slate-800">Review test report</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-600">Production restore</span>
                    <span className="font-semibold text-slate-800">Independent approval</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PrimaryButton>Integrity report</PrimaryButton>
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

