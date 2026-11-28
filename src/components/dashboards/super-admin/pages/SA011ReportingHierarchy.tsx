"use client";

/**
 * SA-011 — Reporting Hierarchy (demo data).
 * HRMS is authoritative for employee and designation details; CRM reporting
 * scopes are assigned separately. Circular reporting is rejected; a backup
 * approver and hand-over of open work are required before reassignment.
 */

import { useState } from "react";
import { authorizedRequest } from "@/lib/api/authorized";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { useResource } from "@/lib/crm/useResource";
import { at, count, records, text, EMPTY, type CrmRecord } from "@/lib/crm/data";
import { humanize } from "@/lib/format";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, Field, KVList, NativeSelect, Panel, Pill, Screen, TextBox, ink } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Hierarchy", "Reporting Assignments", "Backup Approvers", "Sync History"] as const;
type Row = { id: string; designation: string; reportsTo: string; status: string; handover: string; dept: string };


export default function SA011ReportingHierarchy() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const live = useResource("/users", "users", notice.show);
  const hierarchy = useCrmQuery<CrmRecord>(live.can("users.view") ? "/departments/hierarchy" : null);
  const departments = useCrmQuery<CrmRecord[]>(live.can("departments.view") ? "/departments?status=ACTIVE&limit=100" : null);
  const summary = useCrmQuery<CrmRecord>(live.can("users.view") ? "/users/summary" : null);
  const rows: Row[] = live.rows.map(row => ({ id: text(row.crmId),designation: text(row.designation),reportsTo: text(at(row,"reportingTo.name")),status: humanize(text(row.status,"")),handover: EMPTY,dept: text(at(row,"department.name")) }));
  const admins = live.rows.filter(row => row.accessLevel !== "USER").map(row => text(row.name));
  const usersOf: Record<string,string> = Object.fromEntries(admins.map(name => [name,live.rows.filter(row => at(row,"reportingTo.name") === name).map(row => text(row.name)).join(" / ") || EMPTY]));
  const reportOpts = ["Not assigned",...admins];
  const backupOpts = [EMPTY];
  const deptOpts = ["All departments",...records(departments.data).map(row => text(row.name))];
  const [sel, setSel] = useState("");
  const [focus, setFocus] = useState<string>("");
  const current = rows.find(r => r.id === sel) ?? rows[0];
  const [reportsTo, setReportsTo] = useState<string>("");
  const [backup, setBackup] = useState<string>(EMPTY);
  const [date, setDate] = useState("");
  const [dept, setDept] = useState<string>("All departments");
  const shown = rows.filter((r) => dept === "All departments" || r.dept === dept);

  const pick = (id: string) => {
    setSel(id);
    setReportsTo(rows.find((r) => r.id === id)?.reportsTo ?? "");
  };

  return (
    <Screen
      code="SA-011"
      title="Reporting Hierarchy"
      active="departments-centres"
      picker={screenPicker1120}
      kpis={[
        { value: "03", label: "Access levels" },
        { value: count(at(summary.data,"activeByAccessLevel.ADMIN")), label: "Admins" },
        { value: count(at(summary.data,"activeByAccessLevel.USER")), label: "Users" },
        { value: count(departments.meta?.total), label: "Departments" },
        { value: EMPTY, label: "Unmapped reports" },
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
              rows={shown.map((r) => ({ key: r.id, cells: [r.id, r.designation, r.reportsTo, EMPTY, r.status, <Pill key="h" tone={r.handover === "Clear" ? "green" : "amber"}>{r.handover}</Pill>] }))}
            />
            <Buttons>
              <Btn primary onClick={() => { if (current) pick(current.id); }}>Assign reporting authority</Btn>
              <Btn onClick={() => notice.show(text(hierarchy.data?.total))}>Review handover</Btn>
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
                disabled={!live.can("users.edit") || live.mutation.busy}
                onClick={async () => {
                  const user = live.rows.find(row => row.crmId === (sel || current?.id));
                  const manager = live.rows.find(row => row.name === reportsTo);
                  if (!user) return;
                  const fresh = await authorizedRequest<CrmRecord>('/users/' + user.id);
                  await live.mutation.run('/users/' + user.id, { method: "PATCH",body: { version: fresh.data.version,reportingToId: manager?.id ?? null } }, "Reporting assignment saved.");
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
                ["Last sync", EMPTY],
                ["Circular reports", "Blocked"],
                ["Unassigned users", EMPTY],
                ["Handover required", <Pill key="p" tone="amber">Pending review</Pill>],
                ["Acting admin", "Not assigned"],
                ["Department filter", <NativeSelect key="d" label="Department filter" value={dept} options={deptOpts} onChange={setDept} className="!h-[24px] w-[168px] [&_select]:text-[14.6px]" />],
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
  const cls = `flex h-[34px] items-center rounded-[7px] border px-[14px] pt-px text-[15.6px] shadow-[0_1px_3px_rgba(20,45,90,0.06)] ${ink} ${
    on ? "border-[#ecd29a] bg-[#fff3dc]" : "border-[#cad7ea] bg-[linear-gradient(180deg,#f4f9ff_0%,#e9f1fb_100%)]"
  }`;
  return onClick ? (
    <button type="button" aria-pressed={on} onClick={onClick} className={`${cls} hover:brightness-[0.98]`}>{children}</button>
  ) : (
    <span className={cls}>{children}</span>
  );
}

const Line = () => <span aria-hidden className="h-[14px] w-px bg-[#9aa7bd]" />;
