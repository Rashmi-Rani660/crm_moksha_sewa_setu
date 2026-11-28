"use client";

import { useRouter } from "next/navigation";

/**
 * SA-002 — Live Operations & Emergency Control.
 * Rebuild matched to the SA-002 reference design: 6 KPI tiles, 5 tabs and a
 * 3-row panel grid (emergency queue, GPS/staff/communication, milestones).
 * GPS is schematic only; stale/offline data is flagged for manual updates.
 * Manual overrides and escalations record a reason. Demo data only.
 */

import { useEffect, useState } from "react";
import { authorizedRequest } from "@/lib/api/authorized";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { useCrmAccess } from "@/lib/api/useCrmAccess";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { at, choose, count, records, text, EMPTY, type CrmRecord } from "@/lib/crm/data";
import { humanize, shortDateTime } from "@/lib/format";
import {
  Bell,
  CircleCheck,
  Layers,
  MapPin,
  Radio,
  Users,
} from "lucide-react";
import { Dot } from "@/components/dashboards/ui";
import {
  KpiRow,
  KpiTile,
  KV,
  ModuleDropdown,
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

type QueueRow = { id: string; category: string; owner: string; sla: string; stage: string };



const stages: readonly (readonly [string, string])[] = [
  ["Pending verification", EMPTY],
  ["Unassigned", EMPTY],
  ["Assigned / en route", EMPTY],
  ["In service", EMPTY],
  ["Closure pending", EMPTY],
] as const;



const staffRows: readonly (readonly [string, string])[] = [
  ["Staff on duty", EMPTY],
  ["Volunteers available", EMPTY],
  ["Field team deployed", EMPTY],
] as const;

const commRows: readonly (readonly [string, string])[] = [
  ["Missed calls", EMPTY],
  ["WhatsApp pending", EMPTY],
  ["Email pending", EMPTY],
  ["AI callbacks due", EMPTY],
] as const;

const milestoneRows: readonly (readonly [string, string])[] = [
  ["Received / verified", EMPTY],
  ["Assigned / completed", EMPTY],
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
      <span className="absolute left-[18%] top-[38%] rounded-[6px] border border-[#cfd5e2] bg-white px-[5px] py-[1px] text-[13.5px] font-bold text-[#0b0c36] shadow-sm">
        {EMPTY}
      </span>
      <span className="absolute bottom-[22%] right-[16%] flex items-center gap-[3px] rounded-[6px] border border-[#1f9a2b] bg-white px-[5px] py-[1px] text-[13.5px] font-bold text-[#1f9a2b] shadow-sm">
        <MapPin strokeWidth={2.4} className="h-[10px] w-[10px]" />
        Centre
      </span>
      <span className="absolute right-[6px] top-[4px] text-[13.5px] font-semibold text-[#5b6280]">GPS schematic — demo</span>
    </div>
  );
}

export default function SA002LiveOperations() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Overview");
  const notice = useNotice();
  const { can } = useCrmAccess();
  const emergency = useCrmQuery<CrmRecord>(can("live_operations.view") ? "/live/emergency-queue" : null);
  const roster = useCrmQuery<CrmRecord>(can("live_operations.view") ? "/live/roster" : null);
  const dashboard = useCrmQuery<CrmRecord>(can("dashboard.view") ? "/dashboard" : null);
  const mutation = useCrmMutation(notice.show);
  const queue: QueueRow[] = records(emergency.data?.items).map(row => ({ id: text(row.reference),category: EMPTY,owner: text(at(row,"owner.name")),sla: text(row.minutesToDue) + 'm',stage: humanize(text(row.status,"")) }));
  const vehicles = records(roster.data?.vehicles).map(row => ({ id: text(row.registrationNo),driver: text(at(row,"trip.driver")),caseId: text(at(row,"trip.tripNo")),eta: row.stale ? "Stale" : shortDateTime(text(at(row,"location.at"),"")) }));
  const activity: { time: string; text: string; color: string }[] = [];
  const reloadEmergency = emergency.reload;
  const reloadRoster = roster.reload;
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") { reloadEmergency();reloadRoster(); } };
    const timer = window.setInterval(refresh,30_000); document.addEventListener("visibilitychange",refresh);
    return () => { window.clearInterval(timer);document.removeEventListener("visibilitychange",refresh); };
  },[reloadEmergency,reloadRoster]);
  async function assign() {
    const selected = choose(records(emergency.data?.items),"Choose record","reference");
    const assignees = await authorizedRequest<CrmRecord[]>("/tasks/assignees");
    const person = choose(assignees.data,"Choose owner"); if (!selected || !person) return;
    const resourceModule = selected.kind === "CASE" ? "cases" : "requests";
    if (!can(resourceModule + '.assign')) return;
    const current = await authorizedRequest<CrmRecord>('/' + resourceModule + '/' + selected.id);
    await mutation.run('/' + resourceModule + '/' + selected.id + '/assign', { body: { version: current.data.version,ownerId: person.id } }, "Owner assigned.");
  }

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
        light
        icon={Radio}
        iconTone="blue"
        title="Live Operations & Emergency Control"
        links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
      >
        <ModuleDropdown current="SA-002" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value={EMPTY} label="Requests today" sub="Received" />
        <KpiTile tone="green" icon={Bell} value={count(at(dashboard.data,"cases.active"))} label="Active cases" sub="All open cases" />
        <KpiTile tone="red" icon={CircleCheck} value={count(at(emergency.data,"summary.total"))} label="Emergency" sub="Open" />
        <KpiTile tone="purple" icon={Users} value={count(at(emergency.data,"summary.unassigned"))} label="Unassigned" sub="Awaiting owner" />
        <KpiTile tone="sky" icon={Layers} value={roster.data ? count(records(roster.data.vehicles).length) : EMPTY} label="Vehicles" sub={count(at(roster.data,"summary.vehiclesAvailable"))} />
        <KpiTile tone="red" icon={Radio} value={count(at(emergency.data,"summary.breached"))} label="SLA breaches" sub="Review" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {/* Row 1 — emergency queue + live case stage */}
        {row1 && (
          <div className={`grid gap-[10px] ${row1Cols} lg:min-h-0 lg:flex-[205_1_0] lg:[grid-template-rows:minmax(0,1fr)]`}>
            {showQueue && (
              <Panel title="Emergency queue" note="• Ghaziabad">
                <TableWrap>
                  <Thead>
                    {["Case", "Category", "Owner", "SLA left", "Stage"].map((h) => (
                      <th key={h} className={`${th} px-[5px] py-[5px] text-[14px]`}>
                        {h}
                      </th>
                    ))}
                  </Thead>
                  <tbody>
                    {queue.map((r) => (
                      <tr key={r.id} className="border-b border-[#eef0f5] last:border-0 [&>td]:px-[5px] [&>td]:py-[5px] [&>td]:text-[14.2px]">
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
                    disabled={mutation.busy || !(can("cases.assign") || can("requests.assign"))} onClick={assign}
                  >
                    Assign team
                  </PrimaryButton>
                  <PrimaryButton
                    outline
                    disabled onClick={() => notice.show(EMPTY)}
                  >
                    Escalate
                  </PrimaryButton>
                  <PrimaryButton
                    outline
                    disabled onClick={() => notice.show(EMPTY)}
                  >
                    Manual override
                  </PrimaryButton>
                </div>
              </Panel>
            )}

            {showStage && (
              <Panel title="Live case stage" bodyClassName="flex flex-col pt-[3px]">
                <div className="flex flex-col">
                  {stages.map(([label, value]) => (
                    <div key={label} className="flex items-center border-b border-[#eef0f5] py-[7px] last:border-0">
                      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-[#1a1d36]">{label}</span>
                      <b className="shrink-0 text-[15.5px] font-bold text-[#0b0c36]">{value}</b>
                    </div>
                  ))}
                </div>
                <p className="mt-auto pt-[6px] text-[15px] font-medium leading-tight text-[#5b6280]">
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
              <Panel title="Vehicle & GPS status" bodyClassName="flex flex-col pt-[3px]">
                <TableWrap>
                  <Thead>
                    {["Vehicle", "Driver", "Case", "ETA / GPS"].map((h) => (
                      <th key={h} className={`${th} px-[5px] py-[5px] text-[14px]`}>
                        {h}
                      </th>
                    ))}
                  </Thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id} className="border-b border-[#eef0f5] last:border-0 [&>td]:px-[5px] [&>td]:py-[4px] [&>td]:text-[14.2px]">
                        <td className={`${td} font-semibold`}>{v.id}</td>
                        <td className={td}>{v.driver}</td>
                        <td className={td}>{v.caseId}</td>
                        <td className={`${td} font-semibold`}>{v.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                <p className="mt-[5px] text-[15px] font-medium leading-tight text-[#8a5300]">
                  GPS stale / offline: flag and switch to manual updates.
                </p>
                <GpsSchematic />
              </Panel>
            )}

            {showStaff && (
              <Panel title="Staff & volunteer availability" bodyClassName="flex flex-col pt-[3px]">
                <StatRows rows={staffRows.map(([label]) => [label,label === "Staff on duty" ? count(at(roster.data,"summary.onDuty")) : EMPTY])} />
                <div className="mt-[8px] border-t border-[#eef0f5] pt-[6px]">
                  <p className="mb-[5px] text-[14px] font-bold text-[#0b0c36]">Coverage</p>
                  <div className="flex items-center gap-[8px] border-b border-[#eef0f5] pb-[4px] text-[14.5px] font-semibold">
                    <span className="min-w-0 flex-1 truncate">Ghaziabad</span>
                    <Pill tone="green" className="h-[17px] text-[14.5px]">
                      Active
                    </Pill>
                  </div>
                  <div className="mt-[5px] flex items-center gap-[8px] text-[14.5px] font-semibold">
                    <span className="min-w-0 flex-1 truncate">Delhi / Noida</span>
                    <Pill tone="amber" className="h-[17px] text-[14.5px]">
                      Coming soon
                    </Pill>
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-[6px] pt-[8px]">
                  <div className="flex items-center justify-between text-[15.5px] font-semibold">
                    <span>Staff on duty</span>
                    <b>{EMPTY}</b>
                  </div>
                  <PctBar pct={0} />
                  <div className="flex items-center justify-between text-[15.5px] font-semibold">
                    <span>Volunteers available</span>
                    <b>{EMPTY}</b>
                  </div>
                  <PctBar pct={0} />
                </div>
              </Panel>
            )}

            {showComm && (
              <Panel title="Communication watch" bodyClassName="flex flex-col pt-[3px]">
                <StatRows rows={commRows} />
                <div className="mt-auto pt-[8px]">
                  <PrimaryButton onClick={() => router.push("/dashboard/super-admin/communication-hub")}>
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
              <Panel title="Today's request milestones" bodyClassName="flex flex-col pt-[3px]">
                <StatRows rows={milestoneRows} />
                <p className="mt-auto pt-[6px] text-[15px] font-medium leading-tight text-[#5b6280]">
                  Cumulative milestones, not current status.
                </p>
              </Panel>
            )}

            {showActivity && (
              <Panel title="Live activity & control" bodyClassName="flex flex-col pt-[3px]">
                <div className="flex flex-col gap-[7px]">
                  {activity.map((a) => (
                    <div key={a.time} className="flex items-center gap-[8px] text-[14.5px] font-semibold">
                      <Dot color={a.color} size={8} />
                      <span className="min-w-0 flex-1 truncate">
                        {a.time} • {a.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
                  <PrimaryButton onClick={() => router.push("/dashboard/super-admin/sewa-operations/fleet-logistics")}>
                    Deploy vehicle
                  </PrimaryButton>
                  <PrimaryButton outline disabled={mutation.busy || !(can("cases.assign") || can("requests.assign"))} onClick={assign}>
                    Reassign
                  </PrimaryButton>
                  <PrimaryButton outline disabled onClick={() => notice.show(EMPTY)}>
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
