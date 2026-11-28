"use client";

/**
 * SA-020 — SLA & Escalation Management (demo data).
 * SLA timers use server time, business calendars and priority targets;
 * response, verification and resolution SLAs are distinct; escalation
 * acknowledgements and authorised pauses are recorded; manual emergency
 * response stays available when automation is paused. Timers are static.
 */

import { useState } from "react";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { useCrmAccess } from "@/lib/api/useCrmAccess";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { useDashboardData } from "@/lib/crm/useDashboardData";
import { EMPTY, choose, records, text as value, type CrmRecord } from "@/lib/crm/data";
import { humanize, shortDateTime } from "@/lib/format";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, FilterBar, Flow, KVList, NativeSelect, Panel, Screen, SearchInput, useFilters } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Live SLA Monitor", "SLA Rules", "Escalation Matrix", "Pause History", "Reports"] as const;

type Row = { ref: string; type: string; owner: string; left: string; esc: string; status: string; admin: string; ack: string; priority: string };

const typeOpts = ["All SLA types", "Response", "Resolution", "Acknowledgement"] as const;
const priorityOpts = ["All priority", "Critical", "High", "Normal"] as const;


export default function SA020SlaEscalation() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const { can } = useCrmAccess();
  const monitor = useCrmQuery<CrmRecord>(can("sla.view") ? "/sla/monitor" : null);
  const rules = useCrmQuery<CrmRecord[]>(can("sla.view") ? "/sla/rules" : null);
  const escalations = useCrmQuery<CrmRecord[]>(can("sla.view") ? "/sla/escalations?limit=100" : null);
  const dashboard = useDashboardData();
  const mutation = useCrmMutation(notice.show);
  async function reviewRule() {
    setTab("SLA Rules");
    const rule = choose(records(rules.data).map(row => ({ ...row, name: `${value(row.target)} / ${value(row.priority)}` })), "Choose SLA rule");
    if (!rule) return;
    if (!can("sla.edit")) { notice.show(`${value(rule.name)}: ${value(rule.targetMinutes)} min`); return; }
    const entered = window.prompt("Target minutes:", value(rule.targetMinutes, ""));
    if (entered === null) return;
    const targetMinutes = Number(entered);
    if (!Number.isInteger(targetMinutes) || targetMinutes < 1) return;
    await mutation.run(`/sla/rules/${rule.id}`, { method: "PATCH", body: { version: rule.version, targetMinutes } }, "SLA rule updated.");
  }
  async function reviewEscalation() {
    setTab("Escalation Matrix");
    const escalation = choose(records(escalations.data), "Choose escalation", "reference");
    if (!escalation) return;
    notice.show(`${value(escalation.reference)}: ${value(escalation.status)}`);
    if (escalation.status === "OPEN" && window.confirm("Acknowledge this escalation?")) await mutation.run(`/sla/escalations/${escalation.id}/acknowledge`, { method: "POST" }, "Escalation acknowledged.");
  }
  const rows: Row[] = records(monitor.data?.items).map(item => ({ ref: value(item.reference), type: humanize(value(item.entityType,"")), owner: EMPTY, left: shortDateTime(value(item.dueAt,"")), esc: EMPTY, status: humanize(value(item.slaState,"")), admin: EMPTY, ack: EMPTY, priority: humanize(value(item.priority,"")) }));
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
        { value: dashboard.value("Open tasks"), label: "Open tasks" },
        { value: dashboard.value("Overdue tasks"), label: "Overdue tasks" },
        { value: dashboard.value("Emergency requests"), label: "Emergency requests" },
        { value: EMPTY, label: "SLA compliance" },
        { value: value(monitor.data?.openEscalations), label: "Escalations open" },
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
                disabled
                onClick={() => notice.show(EMPTY)}
              >
                Escalate selected
              </Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Reassign</Btn>
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
              rows={records(rules.data).map(rule => ({ key: value(rule.id), cells: [humanize(value(rule.priority,"")), value(rule.targetMinutes) + " min", records(rule.escalation).map(step => humanize(value(step.notify,""))).join(" / ")] }))}
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
              <Btn primary disabled={!can("sla.view") || mutation.busy} onClick={reviewRule}>Review SLA rules</Btn>
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
              <Btn primary disabled={!can("sla.view") || mutation.busy} onClick={reviewEscalation}>Review escalation history</Btn>
            </Buttons>
            <KVList
              rowH={24}
              rows={[
                ["Last escalation", shortDateTime(value(records(escalations.data)[0]?.lastEscalatedAt,""))],
                ["Awaiting acknowledgement", value(escalations.meta?.total)],
              ]}
            />
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
