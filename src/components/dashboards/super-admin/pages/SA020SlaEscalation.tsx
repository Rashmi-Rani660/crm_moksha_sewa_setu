"use client";

/**
 * SA-020 — SLA & Escalation Management (demo data).
 * SLA timers use server time, business calendars and priority targets;
 * response, verification and resolution SLAs are distinct; escalation
 * acknowledgements and authorised pauses are recorded; manual emergency
 * response stays available when automation is paused. Timers are static.
 */

import { useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, FilterBar, Flow, KVList, NativeSelect, Panel, Screen, SearchInput, useFilters } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Live SLA Monitor", "SLA Rules", "Escalation Matrix", "Pause History", "Reports"] as const;

type Row = { ref: string; type: string; owner: string; left: string; esc: string; status: string; admin: string; ack: string; priority: string };
const initialRows: Row[] = [
  { ref: "MSR-26-27-0001", type: "Response", owner: "Operations Admin", left: "00:35", esc: "L1", status: "Due soon", admin: "Operations", ack: "Pending", priority: "Critical" },
  { ref: "MST-26-27-0004", type: "Resolution", owner: "Case User 03", left: "+00:30", esc: "L2", status: "Overdue", admin: "Operations", ack: "Yes", priority: "High" },
  { ref: "MST-26-27-0007", type: "Acknowledgement", owner: "Field Team 01", left: "+00:10", esc: "L1", status: "Overdue", admin: "Operations", ack: "Pending", priority: "Normal" },
  { ref: "MSC-26-27-0004", type: "Resolution", owner: "Field Team 01", left: "01:10", esc: "None", status: "Within SLA", admin: "Operations", ack: "–", priority: "High" },
];
const typeOpts = ["All SLA types", "Response", "Resolution", "Acknowledgement"] as const;
const priorityOpts = ["All priority", "Critical", "High", "Normal"] as const;
const next: Record<string, string> = { None: "L1", L1: "L2", L2: "L3", L3: "L3" };

export default function SA020SlaEscalation() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const [rows, setRows] = useState(initialRows);
  const { q, setQ, f, set, reset, text } = useFilters({ type: "All SLA types", priority: "All priority" });
  const shown = rows.filter(
    (r) => (f.type === "All SLA types" || r.type === f.type) && (f.priority === "All priority" || r.priority === f.priority) && text(r.ref, r.type, r.owner),
  );

  return (
    <Screen
      code="SA-020"
      title="SLA & Escalation Management"
      active="case-workflow"
      picker={screenPicker1120}
      kpis={[
        { value: "36", label: "Open tasks" },
        { value: "05", label: "Overdue tasks" },
        { value: "03", label: "Emergency requests" },
        { value: "96%", label: "SLA compliance" },
        { value: String(rows.filter((r) => r.esc !== "None").length).padStart(2, "0"), label: "Escalations open" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title="SLA exceptions — action queue" h={350}>
            <FilterBar>
              <SearchInput value={q} onChange={setQ} className="w-full lg:flex-1" />
              <NativeSelect label="SLA type" value={f.type} options={typeOpts} onChange={set("type")} className="w-[152px]" />
              <NativeSelect label="Priority" value={f.priority} options={priorityOpts} onChange={set("priority")} className="w-[132px]" />
              <Btn onClick={reset} className="!h-[32px]">Reset filters</Btn>
            </FilterBar>
            <DataTable
              head={["Reference", "SLA type", "Owner", "Remaining / breach", "Escalation", "Status", "Admin", "Ack"]}
              pills={[5, 7]}
              rowH={38}
              rows={shown.map((r) => ({ key: r.ref, cells: [r.ref, r.type, r.owner, r.left, r.esc, r.status, r.admin, r.ack] }))}
            />
            <Buttons>
              <Btn
                primary
                onClick={() => {
                  const target = rows.find((r) => r.status === "Overdue" || r.status === "Due soon");
                  if (!target) return notice.show("Nothing to escalate.");
                  if (!window.confirm(`Escalate ${target.ref} to ${next[target.esc]}? The acknowledgement is tracked.`)) return;
                  setRows(rows.map((r) => (r.ref === target.ref ? { ...r, esc: next[r.esc], ack: "Pending" } : r)));
                }}
              >
                Escalate selected
              </Btn>
              <Btn onClick={() => notice.show("Reassign with a recorded reason (demo).")}>Reassign</Btn>
              <Btn onClick={() => setTab("Pause History")}>Review pause</Btn>
            </Buttons>
          </Panel>

          <Panel title="Escalation chain">
            <Flow steps={["Assigned owner", "Reporting Admin", "Super Admin", "Incident review"]} h={62} />
            <div className="mt-[10px]">
              <KVList
                rowH={28}
                rows={[
                  ["Emergency escalation", "Immediate notification"],
                  ["Pause reason", "Required / audited"],
                ]}
              />
            </div>
          </Panel>
        </Col>

        <Col>
          <Panel title="SLA rule configuration — example" h={298}>
            <DataTable
              head={["Priority", "Response target", "Escalate"]}
              rowH={27}
              rows={[
                { key: "c", cells: ["Critical", "15 min", "Immediate"] },
                { key: "h", cells: ["High", "30 min", "At breach"] },
                { key: "n", cells: ["Normal", "2 hrs", "At breach"] },
              ]}
            />
            <KVList
              rowH={24}
              rows={[
                ["Resolution SLA", "By service / case type"],
                ["Business calendar", "Configurable"],
                ["Time source", "Server / IST"],
              ]}
            />
            <Buttons className="!mt-[8px]">
              <Btn primary onClick={() => setTab("SLA Rules")}>Review SLA rules</Btn>
            </Buttons>
          </Panel>

          <Panel title="Automation safeguards">
            <KVList
              rowH={24}
              rows={[
                ["Mode", "Approval-based"],
                ["Failed escalation", "Retry + manual alert"],
                ["Manual response", "Always available"],
                ["Pause / resume", "Authorised reason"],
                ["Audit trail", "Mandatory"],
              ]}
            />
            <Buttons className="!mt-[8px] !mb-[4px]">
              <Btn primary onClick={() => setTab("Escalation Matrix")}>Review escalation history</Btn>
            </Buttons>
            <KVList
              rowH={24}
              rows={[
                ["Last escalation", "10:40 · demo"],
                ["Awaiting acknowledgement", `${String(rows.filter((r) => r.ack === "Pending").length).padStart(2, "0")} of shown escalations`],
              ]}
            />
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
