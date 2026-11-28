"use client";

/**
 * SA-017 — Task Management (demo data).
 * Every task links to an authorised case or internal work item; due time,
 * owner, acknowledgement and SLA are tracked; reassignment needs a reason.
 * List, Kanban and calendar previews use the six displayed demo tasks.
 */

import { useState } from "react";
import { useOperations } from "@/lib/crm/useOperations";
import { useDebounced } from "@/lib/api/useCrmQuery";
import { text as value, EMPTY } from "@/lib/crm/data";
import { clock } from "@/lib/format";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { saRoutes, screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, FilterBar, Flow, KVList, Meter, NativeSelect, Panel, Pill, Screen, SearchInput, ink, useFilters } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["All Tasks", "My Team", "Overdue", "Awaiting Acceptance", "Completed"] as const;
const views = ["List", "Kanban", "Calendar"] as const;

const teamOpts = ["All teams", "Verification", "Field operations", "Helpline", "Volunteer coordination", "Internal tasks"] as const;
const priorityOpts = ["All priority", "Critical", "High", "Normal"] as const;
const statusOpts = ["All status", "Pending", "In progress", "Assigned", "Overdue", "Awaiting acceptance", "Completed"] as const;
const columns = ["Pending", "Assigned", "In progress", "Awaiting acceptance", "Overdue", "Completed"];

export default function SA017Tasks() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const [view, setView] = useState<(typeof views)[number]>("List");
  const { q, setQ, f, set, reset } = useFilters({ team: "All teams", priority: "All priority", status: "All status" });
  const search = useDebounced(q.trim());
  const statuses: Record<string,string> = { Pending: "ASSIGNED", Assigned: "ASSIGNED", "In progress": "IN_PROGRESS", "Awaiting acceptance": "ASSIGNED", Completed: "COMPLETED" };
  const live = useOperations("tasks", notice.show, { search: search || undefined, status: tab === "Awaiting Acceptance" ? "ASSIGNED" : tab === "Completed" ? "COMPLETED" : statuses[f.status], overdue: tab === "Overdue" || f.status === "Overdue" ? true : undefined, priority: f.priority === "All priority" ? undefined : f.priority.toUpperCase() });
  const rows = live.rows.map(row => ({ id: row.displayId, recordId: value(row.id), task: value(row.title), who: row.displayOwner, team: EMPTY, due: clock(value(row.dueAt,"")), priority: row.displayPriority, status: row.overdue ? "Overdue" : row.status === "ASSIGNED" ? "Awaiting acceptance" : row.displayStatus }));
  const byTime = [...rows].sort((a, b) => a.due.localeCompare(b.due));

  return (
    <Screen
      code="SA-017"
      title="Task Management"
      active="case-workflow"
      picker={screenPicker1120}
      kpis={[
        { value: live.metric("open"), label: "Open tasks" },
        { value: live.metric("overdue"), label: "Overdue" },
        { value: live.metric("dueToday"), label: "Due today" },
        { value: live.metric("awaitingAcceptance"), label: "Awaiting acceptance" },
        { value: live.metric("completedToday"), label: "Completed today" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title="Central task register" h={433}>
            <div role="tablist" aria-label="Task view" className="mb-[8px] flex gap-[6px]">
              {views.map((v) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={`h-[27px] rounded-[6px] border px-[10px] pt-px text-[15.2px] ${view === v ? "border-[#086eed] bg-[linear-gradient(90deg,#086eed_0%,#093cdd_100%)] text-white" : "border-[#a9bddf] bg-white text-[#1e43a8] hover:bg-[#f1f5fd]"}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <FilterBar>
              <SearchInput value={q} onChange={setQ} className="w-full lg:flex-1" />
              <NativeSelect label="Team" value={f.team} options={teamOpts} onChange={set("team")} className="w-[138px]" />
              <NativeSelect label="Priority" value={f.priority} options={priorityOpts} onChange={set("priority")} className="w-[130px]" />
              <NativeSelect label="Status" value={f.status} options={statusOpts} onChange={set("status")} className="w-[118px]" />
              <Btn onClick={reset} className="!h-[32px]">Reset filters</Btn>
            </FilterBar>

            {view === "List" && (
              <DataTable
                head={["Task ID", "Task / linked case", "Assignee", "Due", "Priority", "Status"]}
                pills={[4, 5]}
                empty={live.empty} onRow={live.select}
                rows={rows.map((t) => ({ key: t.recordId, cells: [t.id, t.task, t.who, t.due, t.priority, t.status] }))}
              />
            )}
            {view === "Kanban" && (
              <div className="grid grid-cols-2 gap-[8px] sm:grid-cols-3 lg:grid-cols-6">
                {columns.map((c) => (
                  <div key={c} className="min-w-0 rounded-[6px] border border-[#dce4ee] bg-white p-[6px]">
                    <p className={`truncate text-[14.4px] font-medium ${ink}`}>{c} ({rows.filter((t) => t.status === c).length})</p>
                    {rows.filter((t) => t.status === c).map((t) => (
                      <div key={t.id} className="mt-[6px] rounded-[5px] border border-[#e1e7f0] bg-[#f8fbff] p-[5px] text-[15.6px] leading-[14px]">
                        <p className={ink}>{t.id.slice(-4)} · {t.due}</p>
                        <p className="text-[#4a5468]">{t.task}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {view === "Calendar" && (
              <DataTable head={["Due (today)", "Task", "Assignee", "Status"]} pills={[3]} rows={byTime.map((t) => ({ key: t.id, cells: [t.due, t.task, t.who, t.status] }))} />
            )}

            <Buttons>
              <Btn primary href={saRoutes.createTask}>Create task</Btn>
              <Btn disabled={!live.canAct("Reassign")} onClick={() => live.act("Reassign")}>Reassign selected</Btn>
              <Btn onClick={() => notice.show(live.documents.map(row => value(row.title)).join("\n") || EMPTY)}>Review evidence</Btn>
            </Buttons>
          </Panel>

          <Panel title="Task execution flow">
            <Flow steps={["Create task", "Assign & notify", "Accept task", "Submit evidence", "Review & close"]} h={64} />
          </Panel>
        </Col>

        <Col>
          <Panel title="Team workload" h={302}>
            <div className="flex flex-col gap-[12px] pt-[2px]">
              <Meter label="Verification" value={EMPTY} pct={0} />
              <Meter label="Field operations" value={EMPTY} pct={0} />
              <Meter label="Helpline" value={EMPTY} pct={0} />
              <Meter label="Volunteer coordination" value={EMPTY} pct={0} />
              <Meter label="Internal tasks" value={EMPTY} pct={0} />
            </div>
          </Panel>

          <Panel title="Assignment & app sync">
            <KVList
              rowH={30}
              rows={[
                ["Staff app", <Pill key="s" tone="green">{EMPTY}</Pill>],
                ["Volunteer app", <Pill key="v" tone="green">{EMPTY}</Pill>],
                ["Awaiting acknowledgement", live.metric("awaitingAcceptance")],
                ["Failed deliveries", EMPTY],
                ["Manual override", "Reason required"],
              ]}
            />
            <Buttons>
              <Btn primary disabled onClick={() => notice.show(EMPTY)}>Review failed delivery</Btn>
            </Buttons>
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
