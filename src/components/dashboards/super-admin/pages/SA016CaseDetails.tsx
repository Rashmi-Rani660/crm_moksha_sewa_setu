"use client";

/**
 * SA-016 — Complete Case Details – 360° View (demo data).
 * The case timeline is append-only; team, legal clearance, documents,
 * communications, vehicle, expenses and closure evidence are recorded; GPS
 * only during authorised duty with consent; sensitive evidence stays scoped.
 */

import { useState } from "react";
import { useOperations } from "@/lib/crm/useOperations";
import { at, count, text, records, EMPTY } from "@/lib/crm/data";
import { humanize, shortDateTime } from "@/lib/format";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Check, Col, Columns, DataTable, KVList, Panel, Pill, Screen } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Overview", "Timeline", "Documents", "Tasks", "Communication", "Expenses", "Closure"] as const;



export default function SA016CaseDetails() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const live = useOperations("cases", notice.show);
  const record = live.detail.data;
  const timeline = live.timeline.map(item => [shortDateTime(text(item.at,"")), text(item.summary), text(at(item,"actor.name"))]);
  const tasks = records(record?.tasks);
  const [closure, setClosure] = useState({ delivery: false, expenses: false });

  return (
    <Screen
      code="SA-016"
      title="Complete Case Details – 360° View"
      active="case-workflow"
      picker={screenPicker1120}
      kpis={[
        { value: text(record?.caseNo), label: "Case ID" },
        { value: humanize(text(record?.stage,"")), label: "Stage" },
        { value: humanize(text(record?.priority,"")), label: "Priority" },
        { value: shortDateTime(text(at(record,"sla.resolutionDueAt"),"")), label: "SLA left" },
        { value: "₹0", label: "Service fee" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title="Case overview" h={290}>
            <KVList
              rowH={25}
              rows={[
                ["Linked request", text(record?.requestNo)],
                ["Beneficiary", humanize(text(record?.beneficiaryCategory,""))],
                ["Location", text(at(record,"beneficiary.city"))],
                ["Case owner", text(at(record,"owner.name"))],
                ["Legal / eligibility clearance", <Pill key="v" tone="green">{humanize(text(at(record,"request.legal"),""))}</Pill>],
                ["Vehicle", EMPTY],
                ["Assigned staff", text(at(record,"owner.name"))],
                ["Volunteer", EMPTY],
                ["Driver / GPS", EMPTY],
              ]}
            />
          </Panel>

          <Panel title="Case timeline">
            <DataTable head={["Time", "Activity", "By"]} rowH={30} rows={timeline.map((t, i) => ({ key: String(i), cells: t }))} />
          </Panel>

          <div className="flex flex-wrap gap-[8px] lg:h-[29px] lg:shrink-0">
            <Btn primary disabled={!live.canAct("Update case")} onClick={() => live.act("Update case")}>Update case</Btn>
            <Btn
              disabled onClick={() => notice.show(EMPTY)}
            >
              Add case note
            </Btn>
            <Btn disabled={!live.canAct("Submit closure")} onClick={() => live.act("Submit closure")}>Review closure</Btn>
          </div>
        </Col>

        <Col>
          <Panel title="Tasks & evidence" h={225}>
            <KVList
              rowH={22}
              rows={[
                ["Assigned tasks", record ? count(tasks.length) : EMPTY],
                ["Completed tasks", record ? count(tasks.filter(t => t.status === "COMPLETED").length) : EMPTY],
                ["Pending tasks", text(record?.openTasks)],
                ["Document access", "Restricted"],
                ["Closure checklist", <Pill key="c" tone="amber">Pending</Pill>],
                ["Supporting evidence", record ? count(live.documents.length) : EMPTY],
              ]}
            />
            <Buttons className="!mt-[6px]">
              <Btn onClick={() => notice.show(live.documents.map(doc => `${text(doc.title)}: ${text(doc.url)}`).join("\n") || EMPTY)}>Preview evidence</Btn>
            </Buttons>
          </Panel>

          <Panel title="Communication & expenses" h={194}>
            <KVList
              rowH={21}
              rows={[
                ["Family update", EMPTY],
                ["Last contact", EMPTY],
                ["Approved case expense", EMPTY],
                ["Pending expense", EMPTY],
                ["Charge to beneficiary", EMPTY],
              ]}
            />
            <Buttons className="!mt-[6px]">
              <Btn primary onClick={() => setTab("Communication")}>View communications</Btn>
              <Btn onClick={() => setTab("Expenses")}>Review expense</Btn>
            </Buttons>
          </Panel>

          <Panel title="Service closure" bodyClassName="!pt-[6px]">
            <Check label="Legal documents complete" checked={at(record,"request.legal") === "CLEARED"} disabled />
            <Check label="Service delivery evidence" checked={closure.delivery} onChange={(v) => { setClosure({ ...closure, delivery: v }); if (v) void live.act("Service delivered"); }} />
            <Check label="Expense reconciliation" checked={closure.expenses} onChange={(v) => setClosure({ ...closure, expenses: v })} />
            <Check label="Closure approved" checked={false} disabled />
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
