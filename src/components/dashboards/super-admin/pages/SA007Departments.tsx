"use client";

import { useRouter } from "next/navigation";

/**
 * SA-007 — Department Management.
 * Rebuild matched to the SA-007 reference design: 6 KPI tiles, 5 tabs, a top
 * row (department register + selected department) and a bottom row (reporting
 * & permissions, automation & training). HRMS is the source of truth for
 * departments and employees; CRM access and reporting are configured
 * separately and only by authorised scopes. Linked departments are never
 * deleted — move active cases, tasks and access before archiving. Demo data.
 */

import { useState } from "react";
import { Network, ShieldCheck, UsersRound } from "lucide-react";
import { useResource } from "@/lib/crm/useResource";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { EMPTY, count, text, at, choose, type CrmRecord } from "@/lib/crm/data";
import { humanize } from "@/lib/format";
import { Bell, Building2, CircleCheck, Cog, Layers, Radio, Users, type LucideIcon } from "lucide-react";
import {
  KpiRow,
  KpiTile,
  KV,
  ModuleDropdown,
  PageHead,
  Panel,
  PrimaryButton,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  td,
  th,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const tabs = ["Departments", "Assigned admins", "Team structure", "Role mapping", "HRMS sync"] as const;
type Tab = (typeof tabs)[number];

type Dept = {
  crm: string;
  hrms: string;
  name: string;
  admin: string;
  accounts: string;
  tasks: string;
  mode: string;
  status: string;
  icon: LucideIcon;
  color: string;
};

const reporting: readonly (readonly [string, string])[] = [
  ["Department", EMPTY],
  ["Access level", EMPTY],
  ["Module permissions", EMPTY],
  ["Location scope", EMPTY],
] as const;

const automation: readonly (readonly [string, string])[] = [
  ["Assignment mode", EMPTY],
  ["Training", EMPTY],
  ["Pending work", EMPTY],
  ["Deactivation", EMPTY],
] as const;

function Bar({ pct, color = "#2f6fe0" }: { pct: number; color?: string }) {
  return (
    <span className="mt-[3px] block h-[7px] w-full overflow-hidden rounded-full bg-[#e3e7ef]">
      <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </span>
  );
}

export default function SA007Departments() {
  const router = useRouter();
  const notice = useNotice();
  const live = useResource("/departments", "departments", notice.show, {}, { summary: null });
  const users = useCrmQuery<CrmRecord>(live.can("users.view") ? "/users/summary" : null);
  const admins = useCrmQuery<CrmRecord[]>(live.can("users.view") ? "/users?accessLevel=ADMIN&status=ACTIVE&limit=100" : null);
  const appearance = [{ icon: Cog,color: "#f0a020" },{ icon: UsersRound,color: "#7a3fe0" },{ icon: CircleCheck,color: "#1f9a2b" },{ icon: Layers,color: "#2f6fe0" },{ icon: UsersRound,color: "#d6336c" },{ icon: Network,color: "#0f9f8f" },{ icon: ShieldCheck,color: "#7a3fe0" }];
  const depts: Dept[] = live.rows.map((row,index) => ({ crm: text(row.code),hrms: row.source === "CMS" ? "CMS" : EMPTY,name: text(row.name),admin: text(at(row,"head.name")),accounts: count(row.activeUsers),tasks: EMPTY,mode: EMPTY,status: humanize(text(row.status,"")),...appearance[index % appearance.length] }));
  const [tab, setTab] = useState<Tab>("Departments");
  const [selected, setSelected] = useState("");

  const sel = depts.find(d => d.crm === selected) ?? depts[0] ?? { crm: EMPTY,hrms: EMPTY,name: EMPTY,admin: EMPTY,accounts: EMPTY,tasks: EMPTY,mode: EMPTY,status: EMPTY,icon: Cog,color: "#f0a020" };
  const detail = [["HRMS source",sel.hrms],["Admin",sel.admin],["Reports to",EMPTY],["Account scope",EMPTY],["Open tasks",EMPTY],["SLA",EMPTY],["Training",EMPTY],["Budget",EMPTY]];
  async function assignAdmin() {
    const person = choose(admins.data ?? [],"Choose department head");
    const department = live.rows.find(row => row.code === sel.crm);
    if (!person || !department) return;
    await live.mutation.run('/departments/' + department.id, { method: "PATCH",body: { version: department.version,headUserId: person.id } }, "Department head assigned.");
  }

  const showRegister = tab === "Departments" || tab === "Assigned admins" || tab === "Team structure";
  const showSelected = tab === "Departments" || tab === "Assigned admins";
  const showReporting = tab === "Departments" || tab === "Role mapping";
  const showAutomation = tab === "Departments" || tab === "HRMS sync" || tab === "Team structure";

  const topRow = showRegister || showSelected;
  const bottomRow = showReporting || showAutomation;
  const topCount = [showRegister, showSelected].filter(Boolean).length;
  const bottomCount = [showReporting, showAutomation].filter(Boolean).length;

  return (
    <SuperAdminFrame active="departments-centres">
      <PageHead
        light
        icon={Radio}
        iconTone="blue"
        title="Department Management"
        links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
      >
        <ModuleDropdown current="SA-007" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value={count(live.list.meta?.total)} label="Departments" sub="Registered" />
        <KpiTile tone="green" icon={Bell} value={count(users.data?.total)} label="CRM accounts" sub="Total" />
        <KpiTile tone="orange" icon={CircleCheck} value={count(users.data?.active)} label="Active accounts" sub="Enabled" />
        <KpiTile tone="purple" icon={Users} value={count(at(users.data,"activeByAccessLevel.ADMIN"))} label="Admins assigned" sub="Across depts" />
        <KpiTile tone="sky" icon={Layers} value={EMPTY} label="Active centre" sub="Ghaziabad" />
        <KpiTile tone="green" icon={Radio} value={EMPTY} label="HRMS sync" sub="Today" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {/* Top row — register + selected department */}
        {topRow && (
          <div
            className={`grid gap-[10px] lg:min-h-0 lg:flex-[340_1_0] ${
              topCount === 2 ? "lg:grid-cols-[55fr_45fr]" : "lg:grid-cols-1"
            } lg:[grid-template-rows:minmax(0,1fr)]`}
          >
            {showRegister && (
              <Panel
                title="Department register"
                note={`(${String(depts.length).padStart(2, "0")})`}
                bodyClassName="flex flex-col pt-[6px]"
                action={
                  <div className="hidden items-center gap-[8px] lg:flex">
                    <PrimaryButton
                      outline
                      disabled={!live.can("departments.create") || live.mutation.busy} onClick={() => live.mutation.run("/departments/import-cms", { method: "POST" }, "Departments imported.")}
                    >
                      Map HRMS
                    </PrimaryButton>
                    <PrimaryButton outline onClick={() => router.push("/dashboard/super-admin/users-access-control/roles")}>
                      Review access
                    </PrimaryButton>
                  </div>
                }
              >
                <TableWrap>
                  <Thead>
                    {["CRM ID", "HRMS ID", "Department", "Admin", "Accounts", "Tasks", "Mode"].map((h) => (
<th key={h} className={`${th} px-[6px] py-[6px] text-[14.5px]`}>{h}</th>
                    ))}
                  </Thead>
                  <tbody>
                    {depts.map((d) => (
                      <tr
                        key={d.crm}
                        onClick={() => setSelected(d.crm)}
                        className={`cursor-pointer border-b border-[#eef0f5] last:border-0 ${selected === d.crm ? "bg-[#eef2ff]" : "hover:bg-[#f7f9ff]"}`}
                      >
                        <td className={`${td} px-[6px] py-[6px] font-semibold`}>{d.crm}</td>
                        <td className={`${td} px-[6px] py-[6px] text-[#3b4256]`}>{d.hrms}</td>
                        <td className={`${td} px-[6px] py-[6px] font-bold`}>
                          <span className="flex items-center gap-[6px]">
                            <d.icon strokeWidth={2} style={{ color: d.color }} className="h-[16px] w-[16px] shrink-0" />
                            {d.name}
                          </span>
                        </td>
                        <td className={`${td} px-[6px] py-[6px]`}>{d.admin}</td>
                        <td className={`${td} px-[6px] py-[6px] font-semibold`}>{d.accounts}</td>
                        <td className={`${td} px-[6px] py-[6px] font-semibold`}>{d.tasks}</td>
                        <td className={`${td} px-[6px] py-[6px]`}>
                          <StatusPill className="h-[19px] min-w-[54px] text-[15px]">{d.mode}</StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px] lg:hidden">
                  <PrimaryButton outline disabled={!live.can("departments.create") || live.mutation.busy} onClick={() => live.mutation.run("/departments/import-cms", { method: "POST" }, "Departments imported.")}>
                    Map HRMS department
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => router.push("/dashboard/super-admin/users-access-control/roles")}>
                    Review access
                  </PrimaryButton>
                </div>
                <p className="mt-auto hidden pt-[6px] text-[15.5px] font-medium text-[#5b6280] lg:block">
                  Departments come from HRMS; CRM access is mapped separately. Never delete linked departments — archive after handover.
                </p>
              </Panel>
            )}

            {showSelected && (
              <Panel
                title="Selected department"
                note={`• ${sel.crm}`}
                icon={Building2}
                bodyClassName="flex flex-col pt-[4px]"
              >
                <div className="flex flex-col">
                  {detail.map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="border-b border-[#eef0f5] py-[5px] last:border-0" />
                  ))}
                </div>
                <div className="mt-[6px]">
                  <div className="flex items-center justify-between text-[15.5px] font-semibold">
                    <span>SLA compliance</span>
                    <b>{EMPTY}</b>
                  </div>
                  <Bar pct={0} color="#1f9a2b" />
                </div>
                <div className="mt-[6px]">
                  <div className="flex items-center justify-between text-[15.5px] font-semibold">
                    <span>Training status</span>
                    <b>{EMPTY}</b>
                  </div>
                  <Bar pct={0} />
                </div>
                <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
                  <PrimaryButton disabled={!live.can("departments.edit") || live.mutation.busy} onClick={assignAdmin}>
                    Assign admin
                  </PrimaryButton>
                  <PrimaryButton outline disabled onClick={() => notice.show(EMPTY)}>
                    View performance
                  </PrimaryButton>
                </div>
              </Panel>
            )}
          </div>
        )}

        {/* Bottom row — reporting & permissions, automation & training */}
        {bottomRow && (
          <div
            className={`grid gap-[10px] lg:min-h-0 lg:flex-[266_1_0] ${
              bottomCount === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1"
            } lg:[grid-template-rows:minmax(0,1fr)]`}
          >
            {showReporting && (
              <Panel title="Reporting & permissions" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col">
                  {reporting.map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="border-b border-[#eef0f5] py-[5px] last:border-0" />
                  ))}
                </div>
                <div className="mt-auto pt-[8px]">
                  <PrimaryButton onClick={() => router.push("/dashboard/super-admin/users-access-control/roles")}>
                    Permission matrix
                  </PrimaryButton>
                </div>
              </Panel>
            )}

            {showAutomation && (
              <Panel title="Automation & training" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col">
                  {automation.map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="border-b border-[#eef0f5] py-[5px] last:border-0" />
                  ))}
                </div>
                <div className="mt-auto pt-[8px]">
                  <PrimaryButton disabled onClick={() => notice.show(EMPTY)}>
                    Configure workflow
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
