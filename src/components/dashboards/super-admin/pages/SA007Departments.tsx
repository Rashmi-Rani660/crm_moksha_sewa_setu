"use client";

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
import {
  Bell,
  Building2,
  CircleCheck,
  Cog,
  Layers,
  Network,
  Radio,
  ShieldCheck,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
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

const depts: Dept[] = [
  { crm: "DPT-01", hrms: "HR-101", name: "Operations & Sewa", admin: "Demo Admin 01", accounts: "46", tasks: "12", mode: "Auto", status: "Active", icon: Cog, color: "#f0a020" },
  { crm: "DPT-02", hrms: "HR-102", name: "CSR & Partnerships", admin: "Demo Admin 02", accounts: "22", tasks: "05", mode: "Manual", status: "Active", icon: UsersRound, color: "#7a3fe0" },
  { crm: "DPT-03", hrms: "HR-103", name: "Finance & Donations", admin: "Demo Admin 03", accounts: "24", tasks: "08", mode: "Auto", status: "Active", icon: CircleCheck, color: "#1f9a2b" },
  { crm: "DPT-04", hrms: "HR-104", name: "Communication & Outreach", admin: "Demo Admin 04", accounts: "30", tasks: "06", mode: "Auto", status: "Active", icon: Layers, color: "#2f6fe0" },
  { crm: "DPT-05", hrms: "HR-105", name: "Volunteer Management", admin: "Demo Admin 05", accounts: "28", tasks: "04", mode: "Manual", status: "Active", icon: UsersRound, color: "#d6336c" },
  { crm: "DPT-06", hrms: "HR-106", name: "IT, Automation & CRM", admin: "Demo Admin 06", accounts: "18", tasks: "03", mode: "Auto", status: "In Progress", icon: Network, color: "#0f9f8f" },
  { crm: "DPT-07", hrms: "HR-107", name: "Admin & Support Services", admin: "Demo Admin 07", accounts: "18", tasks: "02", mode: "Auto", status: "Active", icon: ShieldCheck, color: "#7a3fe0" },
];

const detailRows: Record<string, readonly (readonly [string, string])[]> = {
  "DPT-01": [
    ["HRMS source", "HR-101 · Synced"],
    ["Admin", "Demo Admin 01"],
    ["Reports to", "Super Admin"],
    ["Account scope", "Department + centre"],
    ["Open tasks", "12"],
    ["SLA", "96%"],
    ["Training", "92%"],
    ["Budget", "₹2.4 L · demo"],
  ],
};

const reporting: readonly (readonly [string, string])[] = [
  ["Department", "Operations & Sewa"],
  ["Access level", "Admin"],
  ["Module permissions", "Sewa, Cases, Finance"],
  ["Location scope", "Ghaziabad centre"],
] as const;

const automation: readonly (readonly [string, string])[] = [
  ["Assignment mode", "Auto + manual override"],
  ["Training", "92% complete"],
  ["Pending work", "05 items"],
  ["Deactivation", "Archive after handover"],
] as const;

function Bar({ pct, color = "#2f6fe0" }: { pct: number; color?: string }) {
  return (
    <span className="mt-[3px] block h-[7px] w-full overflow-hidden rounded-full bg-[#e3e7ef]">
      <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </span>
  );
}

export default function SA007Departments() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Departments");
  const [selected, setSelected] = useState("DPT-01");

  const sel = depts.find((d) => d.crm === selected) ?? depts[0];
  const detail = detailRows[sel.crm] ?? [
    ["HRMS source", `${sel.hrms} · Synced`],
    ["Admin", sel.admin],
    ["Reports to", "Super Admin"],
    ["Account scope", "Department"],
    ["Open tasks", sel.tasks],
    ["SLA", "94%"],
    ["Training", "88%"],
    ["Budget", "₹1.6 L · demo"],
  ];

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
        <KpiTile tone="blue" icon={Radio} value="07" label="Departments" sub="Registered" />
        <KpiTile tone="green" icon={Bell} value="186" label="CRM accounts" sub="Total" />
        <KpiTile tone="orange" icon={CircleCheck} value="162" label="Active accounts" sub="Enabled" />
        <KpiTile tone="purple" icon={Users} value="12" label="Admins assigned" sub="Across depts" />
        <KpiTile tone="sky" icon={Layers} value="01" label="Active centre" sub="Ghaziabad" />
        <KpiTile tone="green" icon={Radio} value="10:20" label="HRMS sync" sub="Today" />
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
                      onClick={() => notice.show("Map HRMS department: source fields are read-only (demo).")}
                    >
                      Map HRMS
                    </PrimaryButton>
                    <PrimaryButton outline onClick={() => notice.show("Review access: scoped to authorised roles (demo).")}>
                      Review access
                    </PrimaryButton>
                  </div>
                }
              >
                <TableWrap>
                  <Thead>
                    {["CRM ID", "HRMS ID", "Department", "Admin", "Accounts", "Tasks", "Mode"].map((h) => (
<th key={h} className={`${th} px-[6px] py-[6px] text-[12.5px]`}>{h}</th>
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
                          <StatusPill className="h-[19px] min-w-[54px] text-[11px]">{d.mode}</StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px] lg:hidden">
                  <PrimaryButton outline onClick={() => notice.show("Map HRMS department (demo).")}>
                    Map HRMS department
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => notice.show("Review access (demo).")}>
                    Review access
                  </PrimaryButton>
                </div>
                <p className="mt-auto hidden pt-[6px] text-[11.5px] font-medium text-[#5b6280] lg:block">
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
                  <div className="flex items-center justify-between text-[11.5px] font-semibold">
                    <span>SLA compliance</span>
                    <b>96%</b>
                  </div>
                  <Bar pct={96} color="#1f9a2b" />
                </div>
                <div className="mt-[6px]">
                  <div className="flex items-center justify-between text-[11.5px] font-semibold">
                    <span>Training status</span>
                    <b>92%</b>
                  </div>
                  <Bar pct={92} />
                </div>
                <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
                  <PrimaryButton onClick={() => notice.show(`Assign admin to ${sel.crm} (demo).`)}>
                    Assign admin
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => notice.show(`View performance for ${sel.crm} (demo).`)}>
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
                  <PrimaryButton onClick={() => notice.show("Permission matrix opened (demo).")}>
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
                  <PrimaryButton onClick={() => notice.show("Configure workflow opened (demo).")}>
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
