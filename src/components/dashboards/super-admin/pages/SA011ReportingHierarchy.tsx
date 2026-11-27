"use client";

/**
 * SA-011 — Reporting Hierarchy (demo data).
 * HRMS is authoritative for employee and designation details; CRM reporting
 * scopes are assigned separately. Circular reporting is rejected; a backup
 * approver and hand-over of open work are required before reassignment.
 */

import { useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, Field, KVList, NativeSelect, Panel, Pill, Screen, TextBox, ink } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Hierarchy", "Reporting Assignments", "Backup Approvers", "Sync History"] as const;
const admins = ["Operations Admin", "Communication Admin", "Finance Admin"] as const;
const usersOf: Record<(typeof admins)[number], string> = { "Operations Admin": "Case & field users", "Communication Admin": "Helpline users", "Finance Admin": "Accounts users" };
const reportOpts = ["Operations Admin", "Communication Admin", "Finance Admin", "Not assigned"] as const;
const backupOpts = ["Super Admin", "Operations Admin", "Finance Admin"] as const;
const deptOpts = ["All departments", "Sewa Operations", "Communication Hub", "Finance & Donations"] as const;

type Row = { id: string; designation: string; reportsTo: string; status: string; handover: string; dept: string };
const initialRows: Row[] = [
  { id: "DEMO-E021", designation: "Case Coordinator", reportsTo: "Operations Admin", status: "Active", handover: "Clear", dept: "Sewa Operations" },
  { id: "DEMO-E022", designation: "Helpline Executive", reportsTo: "Communication Admin", status: "Active", handover: "Clear", dept: "Communication Hub" },
  { id: "DEMO-E023", designation: "Accounts Executive", reportsTo: "Finance Admin", status: "Active", handover: "Clear", dept: "Finance & Donations" },
  { id: "DEMO-E024", designation: "Field Coordinator", reportsTo: "Not assigned", status: "Pending", handover: "Required", dept: "Sewa Operations" },
];

export default function SA011ReportingHierarchy() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const [rows, setRows] = useState(initialRows);
  const [sel, setSel] = useState("DEMO-E021");
  const [focus, setFocus] = useState<(typeof admins)[number]>("Communication Admin");
  const current = rows.find((r) => r.id === sel)!;
  const [reportsTo, setReportsTo] = useState<string>(current.reportsTo);
  const [backup, setBackup] = useState<string>("Super Admin");
  const [date, setDate] = useState("26 Nov 2026");
  const [dept, setDept] = useState<string>("All departments");
  const shown = rows.filter((r) => dept === "All departments" || r.dept === dept);

  const pick = (id: string) => {
    setSel(id);
    setReportsTo(rows.find((r) => r.id === id)!.reportsTo);
  };

  return (
    <Screen
      code="SA-011"
      title="Reporting Hierarchy"
      active="departments-centres"
      picker={screenPicker1120}
      kpis={[
        { value: "03", label: "Access levels" },
        { value: "12", label: "Admins" },
        { value: "173", label: "Users" },
        { value: "07", label: "Departments" },
        { value: "02", label: "Unmapped reports" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title="Reporting structure" h={278} bodyClassName="flex flex-col items-center justify-center">
            <Node>Namo Gange Trust</Node>
            <Line />
            <Node>Moksha Sewa • Super Admin</Node>
            <Line />
            <div className="flex flex-wrap justify-center gap-[10px]">
              {admins.map((a) => (
                <Node key={a} on={a === focus} onClick={() => setFocus(a)}>{a}</Node>
              ))}
            </div>
            <Line />
            <div className="flex flex-wrap justify-center gap-[10px]">
              {admins.map((a) => (
                <Node key={a} on={a === focus} onClick={() => setFocus(a)}>{usersOf[a]}</Node>
              ))}
            </div>
          </Panel>

          <Panel title="Reporting assignments">
            <DataTable
              head={["Employee ID", "Designation", "Reports to", "Centre", "Status", "Handover"]}
              selected={sel}
              onRow={pick}
              pills={[4]}
              rows={shown.map((r) => ({ key: r.id, cells: [r.id, r.designation, r.reportsTo, "Ghaziabad", r.status, <Pill key="h" tone={r.handover === "Clear" ? "green" : "amber"}>{r.handover}</Pill>] }))}
            />
            <Buttons>
              <Btn primary onClick={() => pick("DEMO-E024")}>Assign reporting authority</Btn>
              <Btn onClick={() => notice.show("Open work must be handed over before reassignment (demo).")}>Review handover</Btn>
            </Buttons>
          </Panel>
        </Col>

        <Col>
          <Panel title="Selected reporting assignment" h={250}>
            <div className="grid grid-cols-1 gap-x-[13px] gap-y-[10px] sm:grid-cols-2">
              <Field label="Employee"><TextBox value={sel} readOnly label="Employee" /></Field>
              <Field label="Reports to"><NativeSelect label="Reports to" value={reportsTo} options={reportOpts} onChange={setReportsTo} className="w-full" /></Field>
              <Field label="Backup approver"><NativeSelect label="Backup approver" value={backup} options={backupOpts} onChange={setBackup} className="w-full" /></Field>
              <Field label="Effective date"><TextBox value={date} onChange={setDate} label="Effective date" /></Field>
            </div>
            <Buttons>
              <Btn
                primary
                onClick={() => {
                  if (reportsTo === "Not assigned") return notice.show("Choose a reporting admin.");
                  if (backup === reportsTo) return notice.show("Backup approver must differ from the reporting admin.");
                  setRows(rows.map((r) => (r.id === sel ? { ...r, reportsTo, status: "Pending", handover: r.handover } : r)));
                  notice.show(`${sel} → ${reportsTo}: submitted for review (demo).`);
                }}
              >
                Submit for review
              </Btn>
            </Buttons>
          </Panel>

          <Panel title="HRMS sync & validation">
            <KVList
              rows={[
                ["Employee data", "Read-only from HRMS"],
                ["Last sync", "Demo: 10:20 AM"],
                ["Circular reports", "Blocked"],
                ["Unassigned users", "02"],
                ["Handover required", <Pill key="p" tone="amber">Pending review</Pill>],
                ["Acting admin", "Not assigned"],
                ["Department filter", <NativeSelect key="d" label="Department filter" value={dept} options={deptOpts} onChange={setDept} className="!h-[24px] w-[168px] [&_select]:text-[12.6px]" />],
                ["Open work transfer", "Review before change"],
              ]}
            />
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}

function Node({ children, on = false, onClick }: { children: string; on?: boolean; onClick?: () => void }) {
  const cls = `flex h-[34px] items-center rounded-[7px] border px-[14px] pt-px text-[13.6px] shadow-[0_1px_3px_rgba(20,45,90,0.06)] ${ink} ${
    on ? "border-[#ecd29a] bg-[#fff3dc]" : "border-[#cad7ea] bg-[linear-gradient(180deg,#f4f9ff_0%,#e9f1fb_100%)]"
  }`;
  return onClick ? (
    <button type="button" aria-pressed={on} onClick={onClick} className={`${cls} hover:brightness-[0.98]`}>{children}</button>
  ) : (
    <span className={cls}>{children}</span>
  );
}

const Line = () => <span aria-hidden className="h-[14px] w-px bg-[#9aa7bd]" />;
