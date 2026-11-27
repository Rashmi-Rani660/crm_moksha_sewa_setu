"use client";

/**
 * SA-015 — Case Management (demo data).
 * One case links to a verified request; valid transitions, authorised
 * dispatch, owner and SLA are enforced; closure needs checklist, proof and
 * expense review; reopening needs a reason. KPI totals describe only the five
 * listed sample cases.
 */

import { useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { saRoutes, screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, FilterBar, Flow, KVList, Meter, NativeSelect, Panel, Screen, SearchInput, SubLabel, useFilters } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Case Register", "Active Cases", "On Hold", "Completed", "Reopened"] as const;

const cases = [
  { id: "MSC-26-27-0008", req: "MSR-26-27-0008", who: "EWS family", owner: "Case User 01", stage: "Assigned", priority: "High", sla: "00:45" },
  { id: "MSC-26-27-0003", req: "MSR-26-27-0003", who: "Unsupported person", owner: "Case User 02", stage: "Assigned", priority: "Normal", sla: "02:20" },
  { id: "MSC-26-27-0004", req: "MSR-26-27-0004", who: "EWS family", owner: "Field Team 01", stage: "In service", priority: "High", sla: "01:10" },
  { id: "MSC-26-27-0005", req: "MSR-26-27-0005", who: "Unclaimed body", owner: "Case User 03", stage: "Completed", priority: "Normal", sla: "Closed" },
  { id: "MSC-26-27-0007", req: "MSR-26-27-0007", who: "Unsupported person", owner: "Case User 04", stage: "On hold", priority: "Normal", sla: "Review" },
];
type Case = (typeof cases)[number];
const byTab: Record<string, (c: Case) => boolean> = {
  "Active Cases": (c) => c.stage === "Assigned" || c.stage === "In service",
  "On Hold": (c) => c.stage === "On hold",
  Completed: (c) => c.stage === "Completed",
  Reopened: () => false,
};
const stageOpts = ["All stages", "Assigned", "In service", "Completed", "On hold"] as const;
const ownerOpts = ["All owners", "Case User 01", "Case User 02", "Case User 03", "Case User 04", "Field Team 01"] as const;
const priorityOpts = ["All priorities", "High", "Normal"] as const;

export default function SA015CaseManagement() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const { q, setQ, f, set, reset, text } = useFilters({ stage: "All stages", owner: "All owners", priority: "All priorities" });
  const rows = cases.filter(
    (c) =>
      (byTab[tab] ?? (() => true))(c) &&
      (f.stage === "All stages" || c.stage === f.stage) &&
      (f.owner === "All owners" || c.owner === f.owner) &&
      (f.priority === "All priorities" || c.priority === f.priority) &&
      text(c.id, c.req, c.who, c.owner, c.stage),
  );

  return (
    <Screen
      code="SA-015"
      title="Case Management"
      active="case-workflow"
      picker={screenPicker1120}
      kpis={[
        { value: "05", label: "Sample cases" },
        { value: "02", label: "Assigned" },
        { value: "01", label: "In service" },
        { value: "01", label: "Completed" },
        { value: "01", label: "On hold" },
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
              empty={tab === "Reopened" ? "No reopened cases." : "No cases match these filters."}
              rows={rows.map((c) => ({ key: c.id, cells: [c.id, c.req, c.who, c.owner, c.stage, c.priority, c.sla] }))}
            />
            <Buttons>
              <Btn primary href={saRoutes.caseDetails}>Open case details</Btn>
              <Btn onClick={() => notice.show("Assign a case owner — dispatch must be authorised (demo).")}>Assign case</Btn>
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
                ["Service charge", "₹0"],
              ]}
            />
            <SubLabel>Selected case stages</SubLabel>
            <div className="flex flex-col gap-[8px] pt-[2px]">
              <Meter label="Assigned" value="2 / 5" pct={40} />
              <Meter label="In service" value="1 / 5" pct={20} />
              <Meter label="Completed" value="1 / 5" pct={20} />
              <Meter label="On hold" value="1 / 5" pct={20} />
            </div>
          </Panel>

          <Panel title="Pending decisions">
            <KVList
              rowH={26}
              rows={[
                ["Emergency requests", "03"],
                ["Unassigned requests", "04"],
                ["Overdue tasks", "05"],
                ["Open complaints", "02"],
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
