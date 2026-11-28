"use client";

/**
 * SA-015 — Case Management (demo data).
 * One case links to a verified request; valid transitions, authorised
 * dispatch, owner and SLA are enforced; closure needs checklist, proof and
 * expense review; reopening needs a reason. KPI totals describe only the five
 * listed sample cases.
 */

import { useState } from "react";
import { useOperations } from "@/lib/crm/useOperations";
import { useDashboardData } from "@/lib/crm/useDashboardData";
import { useDebounced } from "@/lib/api/useCrmQuery";
import { at, text as value, EMPTY } from "@/lib/crm/data";
import { shortDateTime } from "@/lib/format";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { saRoutes, screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, FilterBar, Flow, KVList, Meter, NativeSelect, Panel, Screen, SearchInput, SubLabel, useFilters } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Case Register", "Active Cases", "On Hold", "Completed", "Reopened"] as const;

const stageOpts = ["All stages", "Assigned", "In service", "Completed", "On hold"] as const;

const priorityOpts = ["All priorities", "High", "Normal"] as const;

export default function SA015CaseManagement() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const { q, setQ, f, set, reset } = useFilters({ stage: "All stages", owner: "All owners", priority: "All priorities" });
  const search = useDebounced(q.trim());
  const stage: Record<string,string> = { Assigned: "OPENED", "In service": "IN_SERVICE", Completed: "CLOSED", "On hold": "ON_HOLD" };
  const live = useOperations("cases", notice.show, { search: search || undefined, stage: tab === "Completed" ? "CLOSED" : tab === "On Hold" ? "ON_HOLD" : stage[f.stage], active: tab === "Active Cases" ? true : undefined, priority: f.priority === "All priorities" ? undefined : f.priority.toUpperCase() });
  const dashboard = useDashboardData();
  const ownerOpts = ["All owners", ...live.people.map(row => value(row.name))];
  const rows = live.rows.filter(r => (tab !== "Reopened" || Number(r.reopenCount) > 0) && (f.owner === "All owners" || r.displayOwner === f.owner)).map(r => ({ id: r.displayId, recordId: value(r.id), req: value(r.requestNo), who: value(r.beneficiaryCategory), owner: r.displayOwner, stage: r.displayStatus, priority: r.displayPriority, sla: shortDateTime(value(at(r,"sla.resolutionDueAt"), "")) }));

  return (
    <Screen
      code="SA-015"
      title="Case Management"
      active="case-workflow"
      picker={screenPicker1120}
      kpis={[
        { value: live.total === undefined ? EMPTY : String(live.total), label: "Sample cases" },
        { value: live.metric("byStage.OPENED"), label: "Assigned" },
        { value: live.metric("byStage.IN_SERVICE"), label: "In service" },
        { value: live.metric("byStage.CLOSED"), label: "Completed" },
        { value: live.metric("onHold"), label: "On hold" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title="Case register — selected records" h={397}>
            <FilterBar>
              <SearchInput value={q} onChange={setQ} className="w-full lg:flex-1" />
              <NativeSelect label="Stage" value={f.stage} options={stageOpts} onChange={set("stage")} className="w-[120px]" />
              <NativeSelect label="Owner" value={f.owner} options={ownerOpts} onChange={set("owner")} className="w-[130px]" />
              <NativeSelect label="Priority" value={f.priority} options={priorityOpts} onChange={set("priority")} className="w-[130px]" />
              <Btn onClick={reset} className="!h-[32px]">Reset filters</Btn>
            </FilterBar>
            <DataTable
              head={["Case ID", "Linked request", "Beneficiary", "Owner", "Stage", "Priority", "SLA left"]}
              pills={[5]}
              empty={live.empty}
              onRow={live.select}
              rows={rows.map((c) => ({ key: c.recordId, cells: [c.id, c.req, c.who, c.owner, c.stage, c.priority, c.sla] }))}
            />
            <Buttons>
              <Btn primary href={live.id ? `${saRoutes.caseDetails}?id=${live.id}` : undefined}>Open case details</Btn>
              <Btn disabled={!live.canAct("Assign case")} onClick={() => live.act("Assign case")}>Assign case</Btn>
              <Btn href={saRoutes.sla}>Escalate</Btn>
            </Buttons>
          </Panel>

          <Panel title="Case lifecycle">
            <Flow steps={["Verified request", "Case opened", "Assigned", "Service delivered", "Evidence review", "Closed"]} h={64} />
          </Panel>
        </Col>

        <Col>
          <Panel title="Case controls" h={368}>
            <KVList
              rowH={26}
              rows={[
                ["Legal gate", "Required where applicable"],
                ["Closure proof", "Mandatory"],
                ["Case expense review", "Conditional"],
                ["Reopen reason", "Mandatory"],
                ["Service charge", EMPTY],
              ]}
            />
            <SubLabel>Selected case stages</SubLabel>
            <div className="flex flex-col gap-[8px] pt-[2px]">
              <Meter label="Assigned" value={live.metric("byStage.OPENED")} pct={0} />
              <Meter label="In service" value={live.metric("byStage.IN_SERVICE")} pct={0} />
              <Meter label="Completed" value={live.metric("byStage.CLOSED")} pct={0} />
              <Meter label="On hold" value={live.metric("onHold")} pct={0} />
            </div>
          </Panel>

          <Panel title="Pending decisions">
            <KVList
              rowH={26}
              rows={[
                ["Emergency requests", dashboard.value("Emergency requests")],
                ["Unassigned requests", dashboard.value("Unassigned requests")],
                ["Overdue tasks", dashboard.value("Overdue tasks")],
                ["Open complaints", EMPTY],
              ]}
            />
            <Buttons>
              <Btn primary href={saRoutes.sla}>Review priority queue</Btn>
            </Buttons>
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
