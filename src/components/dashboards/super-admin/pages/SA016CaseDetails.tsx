"use client";

/**
 * SA-016 — Complete Case Details – 360° View (demo data).
 * The case timeline is append-only; team, legal clearance, documents,
 * communications, vehicle, expenses and closure evidence are recorded; GPS
 * only during authorised duty with consent; sensitive evidence stays scoped.
 */

import { useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Check, Col, Columns, DataTable, KVList, Panel, Pill, Screen } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Overview", "Timeline", "Documents", "Tasks", "Communication", "Expenses", "Closure"] as const;

const initialTimeline = [
  ["10:15 AM", "Request received", "WhatsApp"],
  ["10:25 AM", "Eligibility verified", "Verification User 01"],
  ["10:40 AM", "Case approval recorded", "Operations Admin"],
  ["11:00 AM", "Field team accepted task", "Field Team 01"],
  ["11:20 AM", "Service commenced", "Field Team 01"],
];

export default function SA016CaseDetails() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const [timeline, setTimeline] = useState(initialTimeline);
  const [closure, setClosure] = useState({ delivery: false, expenses: false });

  return (
    <Screen
      code="SA-016"
      title="Complete Case Details – 360° View"
      active="case-workflow"
      picker={screenPicker1120}
      kpis={[
        { value: "0004", label: "Case ID" },
        { value: "In service", label: "Stage" },
        { value: "High", label: "Priority" },
        { value: "01:10", label: "SLA left" },
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
                ["Linked request", "MSR-26-27-0004"],
                ["Beneficiary", "EWS family (demo)"],
                ["Location", "Ghaziabad"],
                ["Case owner", "Field Team 01"],
                ["Legal / eligibility clearance", <Pill key="v" tone="green">Verified</Pill>],
                ["Vehicle", "MV-01 • assigned"],
                ["Assigned staff", "Field Team 01"],
                ["Volunteer", "Volunteer 01 · limited access"],
                ["Driver / GPS", "Driver 01 · demo, last update 11:20"],
              ]}
            />
          </Panel>

          <Panel title="Case timeline">
            <DataTable head={["Time", "Activity", "By"]} rowH={30} rows={timeline.map((t, i) => ({ key: String(i), cells: t }))} />
          </Panel>

          <div className="flex flex-wrap gap-[8px] lg:h-[29px] lg:shrink-0">
            <Btn primary onClick={() => notice.show("Case stage changes follow valid transitions only (demo).")}>Update case</Btn>
            <Btn
              onClick={() => {
                const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                setTimeline([...timeline, [now, "Case note added", "Super Admin"]]);
              }}
            >
              Add case note
            </Btn>
            <Btn onClick={() => setTab("Closure")}>Review closure</Btn>
          </div>
        </Col>

        <Col>
          <Panel title="Tasks & evidence" h={225}>
            <KVList
              rowH={22}
              rows={[
                ["Assigned tasks", "03"],
                ["Completed tasks", "01"],
                ["Pending tasks", "02"],
                ["Document access", "Restricted"],
                ["Closure checklist", <Pill key="c" tone="amber">Pending</Pill>],
                ["Supporting evidence", "2 files · restricted"],
              ]}
            />
            <Buttons className="!mt-[6px]">
              <Btn onClick={() => notice.show("Evidence preview is limited to authorised users (demo).")}>Preview evidence</Btn>
            </Buttons>
          </Panel>

          <Panel title="Communication & expenses" h={194}>
            <KVList
              rowH={21}
              rows={[
                ["Family update", "Logged / demo"],
                ["Last contact", "11:15 AM"],
                ["Approved case expense", "₹2,500 (demo)"],
                ["Pending expense", "₹500 (demo)"],
                ["Charge to beneficiary", "₹0"],
              ]}
            />
            <Buttons className="!mt-[6px]">
              <Btn primary onClick={() => setTab("Communication")}>View communications</Btn>
              <Btn onClick={() => setTab("Expenses")}>Review expense</Btn>
            </Buttons>
          </Panel>

          <Panel title="Service closure" bodyClassName="!pt-[6px]">
            <Check label="Legal documents complete" checked disabled />
            <Check label="Service delivery evidence" checked={closure.delivery} onChange={(v) => setClosure({ ...closure, delivery: v })} />
            <Check label="Expense reconciliation" checked={closure.expenses} onChange={(v) => setClosure({ ...closure, expenses: v })} />
            <Check label="Closure approved" checked={false} disabled />
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
