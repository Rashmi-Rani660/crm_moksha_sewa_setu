"use client";

/**
 * SA-002 — Live Operations & Emergency Control.
 * Rebuild matched to the SA-002 reference design: 6 KPI tiles, 5 tabs and a
 * 3-row panel grid (emergency queue, GPS/staff/communication, milestones).
 * GPS is schematic only; stale/offline data is flagged for manual updates.
 * Manual overrides and escalations record a reason. Demo data only.
 */

import { useState } from "react";
import {
  Activity,
  CircleCheck,
  CircleX,
  Flag,
  Headset,
  History,
  LayoutGrid,
  Map,
  MapPin,
  Radio,
  Siren,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Dot } from "@/components/dashboards/ui";
import {
  CentreDropdown,
  Dropdown,
  KpiRow,
  KpiTile,
  KV,
  PageHead,
  Panel,
  Pill,
  PrimaryButton,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  td,
  th,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const tabs = ["Overview", "Emergency queue", "Team & vehicles", "Service coverage", "Activity history"] as const;
type Tab = (typeof tabs)[number];

const tabIcons: Partial<Record<Tab, LucideIcon>> = {
  Overview: LayoutGrid,
  "Emergency queue": Siren,
  "Team & vehicles": Truck,
  "Service coverage": Map,
  "Activity history": History,
};

const moduleOptions = [
  "SA-001 · Super Admin Dashboard",
  "SA-002 · Live Operations & Emergency",
  "SA-003 · Notification & Alerts",
] as const;

type QueueRow = { id: string; category: string; owner: string; sla: string; stage: string };

const queue: QueueRow[] = [
  { id: "MS-26-1100", category: "Unclaimed", owner: "Team A", sla: "04m", stage: "Dispatch" },
  { id: "MS-26-1097", category: "EWS", owner: "Team B", sla: "08m", stage: "Verification" },
  { id: "MS-26-1102", category: "Unsupported", owner: "Unassigned", sla: "02m", stage: "New" },
];

const stages: readonly (readonly [string, string])[] = [
  ["Pending verification", "06"],
  ["Unassigned", "04"],
  ["Assigned / en route", "05"],
  ["In service", "07"],
  ["Closure pending", "02"],
] as const;

const vehicles: { id: string; driver: string; caseId: string; eta: string }[] = [
  { id: "MV-01", driver: "Demo driver 01", caseId: "MS-26-1100", eta: "12m / 10:24" },
  { id: "MV-02", driver: "Demo driver 02", caseId: "—", eta: "Standby / 10:24" },
];

const staffRows: readonly (readonly [string, string])[] = [
  ["Staff on duty", "8 / 10"],
  ["Volunteers available", "12 / 18"],
  ["Field team deployed", "06"],
] as const;

const commRows: readonly (readonly [string, string])[] = [
  ["Missed calls", "03"],
  ["WhatsApp pending", "06"],
  ["Email pending", "04"],
  ["AI callbacks due", "05"],
] as const;

const milestoneRows: readonly (readonly [string, string])[] = [
  ["Received / verified", "24 / 18"],
  ["Assigned / completed", "14 / 10"],
] as const;

const activity = [
  { time: "10:24", text: "Team A dispatched", color: "#1f9a1f" },
  { time: "10:18", text: "Verification received", color: "#1f87e8" },
] as const;

function PctBar({ pct, color = "#2f6fe0" }: { pct: number; color?: string }) {
  return (
    <span className="block h-[7px] w-full overflow-hidden rounded-full bg-[#e3e7ef]">
      <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </span>
  );
}

function StatRows({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <div className="flex flex-col gap-[6px]">
      {rows.map(([k, v]) => (
        <KV key={k} k={k} v={v} />
      ))}
    </div>
  );
}

/** Schematic (not geographic) GPS strip for the vehicle panel. */
function GpsSchematic() {
  return (
    <div className="relative mt-[6px] h-[86px] shrink-0 overflow-hidden rounded-[8px] border border-[#e1e5ee] bg-[#eef3ea]">
      <svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <rect width="400" height="100" fill="#eef2ec" />
        <path d="M0 30 C80 45 140 20 220 38 S340 70 400 52" stroke="#ffffff" strokeWidth="7" fill="none" />
        <path d="M30 100 C80 70 130 62 180 44 S260 14 290 0" stroke="#ffffff" strokeWidth="5" fill="none" />
        <path d="M0 70 C70 66 130 82 210 76" stroke="#f6e7b8" strokeWidth="4" fill="none" />
        <path d="M70 0 C95 30 105 55 98 100" stroke="#d8e6f3" strokeWidth="6" fill="none" />
        <path d="M95 55 C150 48 210 62 265 72" stroke="#1f9a2b" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
        <path d="M265 72 C300 80 330 88 360 92" stroke="#f0a020" strokeWidth="2.5" strokeDasharray="5 4" fill="none" />
      </svg>
      <span className="absolute left-[18%] top-[38%] rounded-[6px] border border-[#cfd5e2] bg-white px-[5px] py-[1px] text-[9.5px] font-bold text-[#0b0c36] shadow-sm">
        10:45
      </span>
      <span className="absolute bottom-[22%] right-[16%] flex items-center gap-[3px] rounded-[6px] border border-[#1f9a2b] bg-white px-[5px] py-[1px] text-[9.5px] font-bold text-[#1f9a2b] shadow-sm">
        <MapPin strokeWidth={2.4} className="h-[10px] w-[10px]" />
        Centre
      </span>
      <span className="absolute right-[6px] top-[4px] text-[9.5px] font-semibold text-[#5b6280]">GPS schematic — demo</span>
    </div>
  );
}

export default function SA002LiveOperations() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [module, setModule] = useState<(typeof moduleOptions)[number]>(moduleOptions[1]);
  const notice = useNotice();

  const showQueue = tab === "Overview" || tab === "Emergency queue";
  const showStage = tab === "Overview" || tab === "Emergency queue";
  const showVehicle = tab === "Overview" || tab === "Team & vehicles";
  const showStaff = tab === "Overview" || tab === "Team & vehicles" || tab === "Service coverage";
  const showComm = tab === "Overview" || tab === "Activity history";
  const showMilestones = tab === "Overview" || tab === "Emergency queue" || tab === "Service coverage";
  const showActivity = tab === "Overview" || tab === "Activity history";

  const row1 = showQueue || showStage;
  const row2 = showVehicle || showStaff || showComm;
  const row3 = showMilestones || showActivity;

  const row1Cols = showQueue && showStage ? "lg:grid-cols-[57fr_43fr]" : "lg:grid-cols-1";
  const row2Count = [showVehicle, showStaff, showComm].filter(Boolean).length;
  const row2Cols = row2Count === 3 ? "lg:grid-cols-[40fr_32fr_28fr]" : row2Count === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1";
  const row3Cols = showMilestones && showActivity ? "lg:grid-cols-2" : "lg:grid-cols-1";

  return (
    <SuperAdminFrame active="live-operations">
      <PageHead
        icon={Radio}
        iconTone="blue"
        title="Live Operations & Emergency Control (SA-002)"
        links={["Super Admin", "FY 2026-27", "Ghaziabad"]}
      >
        <span className="inline-flex h-[30px] items-center rounded-[8px] border border-[#f0dca0] bg-[#fff6da] px-[10px] text-[12px] font-bold text-[#8a6a00]">
          DEMO DATA
        </span>
        <Dropdown label="Module" value={module} options={moduleOptions} onChange={setModule} className="w-[250px]" />
        <CentreDropdown className="w-[165px]" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="24" label="Requests today" sub="Received" />
        <KpiTile tone="green" icon={CircleCheck} value="18" label="Active cases" sub="All open cases" />
        <KpiTile tone="red" icon={CircleX} value="03" label="Emergency" sub="Open" />
        <KpiTile tone="purple" icon={Users} value="04" label="Unassigned" sub="Awaiting owner" />
        <KpiTile tone="sky" icon={Truck} value="02" label="Vehicles" sub="1 available" />
        <KpiTile tone="red" icon={Radio} value="05" label="SLA breaches" sub="Review" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} icons={tabIcons} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {/* Row 1 — emergency queue + live case stage */}
        {row1 && (
          <div className={`grid gap-[10px] ${row1Cols} lg:min-h-0 lg:flex-[205_1_0] lg:[grid-template-rows:minmax(0,1fr)]`}>
            {showQueue && (
              <Panel title="Emergency queue" note="• Ghaziabad" icon={Siren}>
                <TableWrap>
                  <Thead>
                    {["Case", "Category", "Owner", "SLA left", "Stage"].map((h) => (
                      <th key={h} className={`${th} px-[5px] py-[5px] text-[12px]`}>
                        {h}
                      </th>
                    ))}
                  </Thead>
                  <tbody>
                    {queue.map((r) => (
                      <tr key={r.id} className="border-b border-[#eef0f5] last:border-0 [&>td]:px-[5px] [&>td]:py-[5px] [&>td]:text-[12.2px]">
                        <td className={`${td} font-semibold`}>{r.id}</td>
                        <td className={td}>{r.category}</td>
                        <td className={`${td} ${r.owner === "Unassigned" ? "text-[#8a5300]" : ""}`}>{r.owner}</td>
                        <td className={`${td} font-bold`}>{r.sla}</td>
                        <td className={td}>{r.stage}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                <div className="mt-[8px] flex flex-wrap gap-[8px]">
                  <PrimaryButton
                    icon={Users}
                    onClick={() => notice.show("Assign team: owner recorded (demo).")}
                  >
                    Assign team
                  </PrimaryButton>
                  <PrimaryButton
                    outline
                    icon={Siren}
                    onClick={() => notice.show("Escalate: reason required, logged (demo).")}
                  >
                    Escalate
                  </PrimaryButton>
                  <PrimaryButton
                    outline
                    icon={Activity}
                    onClick={() => notice.show("Manual override: reason recorded (demo).")}
                  >
                    Manual override
                  </PrimaryButton>
                </div>
              </Panel>
            )}

            {showStage && (
              <Panel title="Live case stage" icon={Activity} bodyClassName="flex flex-col pt-[3px]">
                <div className="flex flex-col">
                  {stages.map(([label, value]) => (
                    <div key={label} className="flex items-center border-b border-[#eef0f5] py-[7px] last:border-0">
                      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#1a1d36]">{label}</span>
                      <b className="shrink-0 text-[13.5px] font-bold text-[#0b0c36]">{value}</b>
                    </div>
                  ))}
                </div>
                <p className="mt-auto pt-[6px] text-[11px] font-medium leading-tight text-[#5b6280]">
                  Stages are current open-case states; unassigned may overlap verification.
                </p>
              </Panel>
            )}
          </div>
        )}

        {/* Row 2 — vehicle & GPS, staff, communication */}
        {row2 && (
          <div className={`grid gap-[10px] ${row2Cols} lg:min-h-0 lg:flex-[243_1_0] lg:[grid-template-rows:minmax(0,1fr)]`}>
            {showVehicle && (
              <Panel title="Vehicle & GPS status" icon={Truck} bodyClassName="flex flex-col pt-[3px]">
                <TableWrap>
                  <Thead>
                    {["Vehicle", "Driver", "Case", "ETA / GPS"].map((h) => (
                      <th key={h} className={`${th} px-[5px] py-[5px] text-[12px]`}>
                        {h}
                      </th>
                    ))}
                  </Thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id} className="border-b border-[#eef0f5] last:border-0 [&>td]:px-[5px] [&>td]:py-[4px] [&>td]:text-[12.2px]">
                        <td className={`${td} font-semibold`}>{v.id}</td>
                        <td className={td}>{v.driver}</td>
                        <td className={td}>{v.caseId}</td>
                        <td className={`${td} font-semibold`}>{v.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                <p className="mt-[5px] text-[11px] font-medium leading-tight text-[#8a5300]">
                  GPS stale / offline: flag and switch to manual updates.
                </p>
                <GpsSchematic />
              </Panel>
            )}

            {showStaff && (
              <Panel title="Staff & volunteer availability" icon={Users} bodyClassName="flex flex-col pt-[3px]">
                <StatRows rows={staffRows} />
                <div className="mt-[8px] border-t border-[#eef0f5] pt-[6px]">
                  <p className="mb-[5px] text-[12px] font-bold text-[#0b0c36]">Coverage</p>
                  <div className="flex items-center gap-[8px] text-[12.5px] font-semibold">
                    <MapPin strokeWidth={2} className="h-[14px] w-[14px] shrink-0 text-[#1f9a2b]" />
                    <span className="min-w-0 flex-1 truncate">Ghaziabad</span>
                    <Pill tone="green" className="h-[17px] text-[10.5px]">
                      Active
                    </Pill>
                  </div>
                  <div className="mt-[5px] flex items-center gap-[8px] text-[12.5px] font-semibold">
                    <MapPin strokeWidth={2} className="h-[14px] w-[14px] shrink-0 text-[#ef9a12]" />
                    <span className="min-w-0 flex-1 truncate">Delhi / Noida</span>
                    <Pill tone="amber" className="h-[17px] text-[10.5px]">
                      Coming soon
                    </Pill>
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-[6px] pt-[8px]">
                  <div className="flex items-center justify-between text-[11.5px] font-semibold">
                    <span>Staff on duty</span>
                    <b>80%</b>
                  </div>
                  <PctBar pct={80} />
                  <div className="flex items-center justify-between text-[11.5px] font-semibold">
                    <span>Volunteers available</span>
                    <b>67%</b>
                  </div>
                  <PctBar pct={67} />
                </div>
              </Panel>
            )}

            {showComm && (
              <Panel title="Communication watch" icon={Headset} bodyClassName="flex flex-col pt-[3px]">
                <StatRows rows={commRows} />
                <div className="mt-auto pt-[8px]">
                  <PrimaryButton onClick={() => notice.show("Opening communication centre (demo).")}>
                    Open communication
                  </PrimaryButton>
                </div>
              </Panel>
            )}
          </div>
        )}

        {/* Row 3 — milestones + live activity */}
        {row3 && (
          <div className={`grid gap-[10px] ${row3Cols} lg:min-h-0 lg:flex-[154_1_0] lg:[grid-template-rows:minmax(0,1fr)]`}>
            {showMilestones && (
              <Panel title="Today's request milestones" icon={Flag} bodyClassName="flex flex-col pt-[3px]">
                <StatRows rows={milestoneRows} />
                <p className="mt-auto pt-[6px] text-[11px] font-medium leading-tight text-[#5b6280]">
                  Cumulative milestones, not current status.
                </p>
              </Panel>
            )}

            {showActivity && (
              <Panel title="Live activity & control" icon={Activity} bodyClassName="flex flex-col pt-[3px]">
                <div className="flex flex-col gap-[7px]">
                  {activity.map((a) => (
                    <div key={a.time} className="flex items-center gap-[8px] text-[12.5px] font-semibold">
                      <Dot color={a.color} size={8} />
                      <span className="min-w-0 flex-1 truncate">
                        {a.time} • {a.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
                  <PrimaryButton icon={Truck} onClick={() => notice.show("Deploy vehicle: awaiting authorisation (demo).")}>
                    Deploy vehicle
                  </PrimaryButton>
                  <PrimaryButton outline icon={Users} onClick={() => notice.show("Reassign: owner updated (demo).")}>
                    Reassign
                  </PrimaryButton>
                  <PrimaryButton outline icon={Activity} onClick={() => notice.show("Case automation paused (demo).")}>
                    Pause case automation
                  </PrimaryButton>
                </div>
              </Panel>
            )}
          </div>
        )}
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
