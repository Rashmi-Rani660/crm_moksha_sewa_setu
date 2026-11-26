"use client";

/**
 * SA-007 — Organisation & Department Management.
 * Notes (design brief 07): HRMS is the source of truth for departments and
 * employees; CRM access and reporting are configured separately and only by
 * authorised scopes. Linked departments are never deleted — move active cases,
 * tasks and access before archiving.
 */

import { useState } from "react";
import {
  ChevronRight,
  Cog,
  Eye,
  HandHeart,
  Headset,
  IndianRupee,
  Layers,
  MapPin,
  Megaphone,
  Monitor,
  MoreVertical,
  Network,
  Pencil,
  Plus,
  ShieldCheck,
  UserPlus,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  Dropdown,
  KpiRow,
  KpiTile,
  PageHead,
  Pager,
  Panel,
  PrimaryButton,
  SearchField,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Thead,
  td,
  th,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

type Dept = { code: string; name: string; head: string; users: number; status: string; icon: LucideIcon; color: string; short: string[]; bg: string; border: string };
const depts: Dept[] = [
  { code: "DPT-01", name: "Operations & Sewa", head: "Demo Admin 01", users: 46, status: "Active", icon: Cog, color: "#f0a020", short: ["Operations", "& Sewa"], bg: "#fff1d6", border: "#f3d9a4" },
  { code: "DPT-02", name: "CSR & Partnerships", head: "Demo Admin 02", users: 22, status: "Active", icon: HandHeart, color: "#7a3fe0", short: ["CSR &", "Partnerships"], bg: "#f1ebff", border: "#d9ccfa" },
  { code: "DPT-03", name: "Finance & Donations", head: "Demo Admin 03", users: 24, status: "Active", icon: IndianRupee, color: "#1f9a2b", short: ["Finance", "& Donations"], bg: "#e8f7e6", border: "#bfe3bb" },
  { code: "DPT-04", name: "Communication & Outreach", head: "Demo Admin 04", users: 30, status: "Active", icon: Megaphone, color: "#2f6fe0", short: ["Communication", "& Outreach"], bg: "#e7f0ff", border: "#c9dafa" },
  { code: "DPT-05", name: "Volunteer Management", head: "Demo Admin 05", users: 28, status: "Active", icon: UsersRound, color: "#d6336c", short: ["Volunteer", "Management"], bg: "#fde8ef", border: "#f5c6d6" },
  { code: "DPT-06", name: "IT, Automation & CRM", head: "Demo Admin 06", users: 18, status: "In Progress", icon: Monitor, color: "#0f9f8f", short: ["IT & CRM"], bg: "#e2f6f3", border: "#b6e4dc" },
  { code: "DPT-07", name: "Admin & Support Services", head: "Demo Admin 07", users: 18, status: "Active", icon: Headset, color: "#7a3fe0", short: ["Admin &", "Support"], bg: "#f1ebff", border: "#d9ccfa" },
];

const tabs = ["Departments (07)", "Department Heads", "Team Structure", "Role Mapping"] as const;
const statusList = ["All Status", "Active", "In Progress"] as const;

const actions: { icon: LucideIcon; label: string }[] = [
  { icon: Pencil, label: "Edit Department" },
  { icon: UsersRound, label: "Manage Department Users" },
  { icon: Network, label: "Assign / Change Department Head" },
  { icon: ShieldCheck, label: "Department Role & Permissions" },
];

export default function SA007Departments() {
  const notice = useNotice();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Departments (07)");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusList)[number]>("All Status");
  const [selected, setSelected] = useState("DPT-01");
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();
  const rows = depts.filter((d) => (status === "All Status" || d.status === status) && (!q || `${d.code} ${d.name} ${d.head} ${d.status}`.toLowerCase().includes(q)));
  const sel = depts.find((d) => d.code === selected) ?? depts[0];

  return (
    <SuperAdminFrame active="departments-centres">
      <PageHead icon={UsersRound} title="Organisation & Department Management" links={["Department Setup", "Team Structure", "Department Heads", "Resource Allocation", "Role Mapping"]}>
        <PrimaryButton icon={Plus} onClick={() => notice.show("Departments are created in HRMS; CRM access is mapped here (demo).")}>Add Department</PrimaryButton>
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Layers} value="07" label="Total Departments" />
        <KpiTile tone="green" icon={UsersRound} value="186" label="Total users" />
        <KpiTile tone="orange" icon={UserPlus} value="162" label="Active users" />
        <KpiTile tone="purple" icon={Network} value="07" label="Department Heads" />
        <KpiTile tone="red" icon={UsersRound} value="18" label="Volunteers" />
        <KpiTile tone="sky" icon={MapPin} value="01" label="Active centre" />
      </KpiRow>

      <div className="flex flex-wrap items-center gap-[10px] lg:h-[38px] lg:flex-nowrap">
        <div role="tablist" className="flex gap-[8px] overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`flex h-[38px] shrink-0 items-center whitespace-nowrap rounded-[9px] border px-[20px] pt-px text-[14px] font-semibold shadow-[0_2px_6px_rgba(30,50,110,0.06)] ${
                tab === t ? "border-[#1d4fe0] bg-[#1d4fe0] text-white" : "border-[#e1e5ee] bg-white hover:bg-[#f4f6fc]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <SearchField value={query} onChange={setQuery} placeholder="Search by Department, Head, Status..." className="w-full lg:ml-auto lg:w-[330px]" />
        <Dropdown label="Status" value={status} options={statusList} onChange={setStatus} className="w-[170px]" />
      </div>

      <div className="grid gap-[12px] lg:h-[540px] lg:grid-cols-[595fr_575fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Department List" icon={Layers} titleSize={17} bodyClassName="flex flex-col pt-[10px]">
          <TableWrap>
            <Thead>
              {["Dept. Code", "Department Name", "Department Head", "Users", "Status", "Action"].map((h) => (
                <th key={h} className={`${th} ${h === "Department Name" || h === "Department Head" ? "" : "text-center"}`}>{h}</th>
              ))}
            </Thead>
            <tbody>
              {rows.map((d) => (
                <tr
                  key={d.code}
                  onClick={() => setSelected(d.code)}
                  aria-selected={d.code === selected}
                  className={`cursor-pointer border-b border-[#eef0f5] ${d.code === selected ? "bg-[#f1f5ff]" : "hover:bg-[#f8faff]"}`}
                >
                  <td className={`${td} py-[11px]`}>
                    <span className="flex items-center gap-[8px] font-semibold"><d.icon strokeWidth={2} style={{ color: d.color }} className="h-[22px] w-[22px]" />{d.code}</span>
                  </td>
                  <td className={`${td} whitespace-normal font-semibold leading-tight`}>{d.name}</td>
                  <td className={td}>{d.head}</td>
                  <td className={`${td} text-center font-semibold`}>{d.users}</td>
                  <td className={`${td} text-center`}><StatusPill className="w-[86px]">{d.status}</StatusPill></td>
                  <td className={`${td} text-center`}>
                    <div className="flex items-center justify-center gap-[8px] text-[#1d4fe0]" onClick={(e) => e.stopPropagation()}>
                      <button type="button" aria-label={`View ${d.name}`} onClick={() => setSelected(d.code)}><Eye strokeWidth={2.2} className="h-[17px] w-[17px]" /></button>
                      <button type="button" aria-label={`Edit ${d.name}`} onClick={() => notice.show(`${d.name}: CRM-specific settings only; HRMS fields are read-only (demo).`)}><Pencil strokeWidth={2.2} className="h-[16px] w-[16px]" /></button>
                      <button type="button" aria-label={`More for ${d.name}`} onClick={() => notice.show(`${d.name}: archive after moving cases, tasks and access — no delete (demo).`)} className="text-[#0b0c36]"><MoreVertical strokeWidth={2.2} className="h-[16px] w-[16px]" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={6} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">No departments match.</td></tr>}
            </tbody>
          </TableWrap>
          <div className="mt-auto flex items-center justify-between pt-[8px]">
            <p className="text-[12px] font-medium text-[#3b4256]">Showing 1–{rows.length} of 7 Departments</p>
            <Pager page={page} pages={1} onChange={setPage} />
          </div>
        </Panel>

        <div className="flex min-h-0 flex-col gap-[12px]">
          <Panel title="Organisation Structure" icon={Network} titleSize={17} className="lg:h-[272px]" bodyClassName="flex flex-col items-center pt-[4px]">
            <Org bg="#fff1d6" border="#f3d9a4" title="Namo Gange Trust" sub="(Governing Body / Management)" />
            <span className="h-[12px] w-[2px] bg-[#1d4fe0]" />
            <Org bg="#e7f0ff" border="#9cbcf5" title="Moksha Sewa" sub="(Project / Initiative)" />
            <span className="h-[12px] w-[2px] bg-[#1d4fe0]" />
            <div className="relative grid w-full grid-cols-4 gap-[6px] pt-[12px] sm:grid-cols-7">
              <span className="absolute left-[7%] right-[7%] top-0 hidden h-[2px] bg-[#1d4fe0] sm:block" />
              {depts.map((d) => (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => setSelected(d.code)}
                  style={{ background: d.bg, borderColor: d.code === selected ? "#1d4fe0" : d.border }}
                  className="relative flex h-[66px] flex-col items-center justify-center rounded-[8px] border text-center"
                >
                  <span className="absolute -top-[13px] hidden h-[12px] w-[2px] bg-[#1d4fe0] sm:block" />
                  <d.icon strokeWidth={2} style={{ color: d.color }} className="h-[20px] w-[20px]" />
                  {d.short.map((l) => (
                    <span key={l} className="text-[10.5px] font-bold leading-tight">{l}</span>
                  ))}
                </button>
              ))}
            </div>
          </Panel>

          <div className="grid min-h-0 flex-1 gap-[12px] sm:grid-cols-[275fr_290fr]">
            <Panel title="Selected Department – Details" icon={Layers} titleSize={15} bodyClassName="flex flex-col justify-between pt-[6px]">
              {[
                ["Department Name", sel.name],
                ["Department Code", sel.code],
                ["Department Head", sel.head],
                ["Total Users", String(sel.users)],
                ["Total Volunteers", "–"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[118px_10px_1fr] text-[12.8px]">
                  <span className="font-semibold">{k}</span>
                  <span>:</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
              <div className="grid grid-cols-[118px_10px_1fr] items-center text-[12.8px]">
                <span className="font-semibold">Status</span>
                <span>:</span>
                <StatusPill className="w-[80px]">{sel.status}</StatusPill>
              </div>
            </Panel>

            <Panel title="Department Actions" icon={Cog} titleSize={15} bodyClassName="flex flex-col pt-[4px]">
              {actions.map((a) => (
                <button key={a.label} type="button" onClick={() => notice.show(`${a.label} — ${sel.name} (demo).`)} className="flex min-h-[34px] flex-1 items-center gap-[10px] border-b border-[#eef0f5] px-[4px] text-left hover:bg-[#f6f8fd]">
                  <a.icon strokeWidth={2} className="h-[18px] w-[18px] shrink-0 text-[#2f6fe0]" />
                  <span className="flex-1 text-[12.8px] font-semibold">{a.label}</span>
                  <ChevronRight strokeWidth={2.4} className="h-[15px] w-[15px]" />
                </button>
              ))}
              <p className="pt-[6px] text-[11.8px] font-medium text-[#3b4256]">HRMS sync / permission mapping</p>
            </Panel>
          </div>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function Org({ bg, border, title, sub }: { bg: string; border: string; title: string; sub: string }) {
  return (
    <div style={{ background: bg, borderColor: border }} className="w-[230px] rounded-[9px] border px-[10px] py-[5px] text-center shadow-[0_2px_6px_rgba(30,50,110,0.07)]">
      <b className="block text-[14px] leading-tight">{title}</b>
      <span className="text-[11.5px] font-semibold">{sub}</span>
    </div>
  );
}
