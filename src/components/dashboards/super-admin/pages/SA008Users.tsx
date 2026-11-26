"use client";

/**
 * SA-008 — Admin & User Management.
 * Notes (design brief 08): exactly three access levels (designation is not an
 * access level); mobile numbers are masked and records are fictional; no
 * direct deletion; MFA enforced, scope reviews, session revocation and HRMS
 * exit hand-over. Volunteers are managed separately.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { saRoutes } from "@/components/dashboards/super-admin/routes";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  CircleCheck,
  Eye,
  FileText,
  KeyRound,
  Lock,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  UserCog,
  UserPlus,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Checkbox,
  Dropdown,
  KpiRow,
  KpiTile,
  PageHead,
  Pager,
  Panel,
  Pill,
  SearchField,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Thead,
  td,
  th,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

export const CREATE_USER_HREF = "/dashboard/super-admin/users-access-control/create";

type Role = "Super Admin" | "Admin" | "User";
type DemoUser = { id: string; name: string; mobile: string; role: Role; centre: string; dept: string; status: "Active" | "Inactive"; login: string };

const departments = ["Operations & Sewa", "CSR & Partnerships", "Finance & Donations", "Communication & Outreach", "Volunteer Management", "IT, Automation & CRM", "Admin & Support Services"];

/** First eight rows as designed; the rest are generated fictional accounts (2 Super Admin, 12 Admin, 172 User, 24 inactive). */
const firstLogins = ["24 Nov, 10:12 AM", "24 Nov, 09:56 AM", "24 Nov, 09:40 AM", "24 Nov, 09:27 AM", "23 Nov, 06:12 PM", "23 Nov, 05:48 PM", "23 Nov, 04:20 PM", "20 Nov, 11:05 AM"];
const users: DemoUser[] = Array.from({ length: 186 }, (_, i) => {
  const n = i + 1;
  const role: Role = n === 1 || n === 93 ? "Super Admin" : n <= 3 || (n % 15 === 0 && n <= 150) ? "Admin" : "User";
  const inactive = n % 8 === 0 || n === 185; // 24 inactive
  const day = 23 - Math.floor(i / 12);
  const login = i < 8 ? firstLogins[i] : `${Math.max(day, 1)} Nov, ${String(((i * 7) % 12) + 1).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")} ${i % 2 ? "AM" : "PM"}`;
  return {
    id: `MS-U${String(n).padStart(4, "0")}`,
    name: `Demo User ${String(n).padStart(2, "0")}`,
    mobile: `+91 XXXXX XX${String(n % 100).padStart(2, "0")}`,
    role,
    centre: "Ghaziabad",
    dept: departments[i % departments.length],
    status: inactive ? "Inactive" : "Active",
    login,
  };
});

const tabs = ["User List", "Roles & Permissions", "Access Control", "User Activity Logs", "Account Security"] as const;
const centres = ["All Centres", "Ghaziabad"] as const;
const deptOptions = ["All Departments", ...departments] as const;
const roles = ["All Roles", "Super Admin", "Admin", "User"] as const;
const statuses = ["All Status", "Active", "Inactive"] as const;
const PER_PAGE = 8;

const roleTone = { "Super Admin": "purple", Admin: "blue", User: "gray" } as const;

const quick: { icon: LucideIcon; label: string; href?: string; color: string }[] = [
  { icon: UserPlus, label: "Create New User", href: CREATE_USER_HREF, color: "#2f6fe0" },
  { icon: UserCog, label: "Manage Roles & Permissions", href: "/dashboard/super-admin/users-access-control/roles", color: "#2f6fe0" },
  { icon: UsersRound, label: "Assign / Change User Role", href: "/dashboard/super-admin/users-access-control/roles", color: "#2f6fe0" },
  { icon: CircleCheck, label: "Deactivate / Activate User", color: "#1f9a2b" },
  { icon: KeyRound, label: "Reset Password", color: "#1f9a2b" },
  { icon: FileText, label: "View User Activity Logs", color: "#2f6fe0" },
];

export default function SA008Users() {
  const notice = useNotice();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("User List");
  const [query, setQuery] = useState("");
  const [centre, setCentre] = useState<(typeof centres)[number]>("All Centres");
  const [dept, setDept] = useState<(typeof deptOptions)[number]>("All Departments");
  const [role, setRole] = useState<(typeof roles)[number]>("All Roles");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All Status");
  const [page, setPage] = useState(1);
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (centre === "All Centres" || u.centre === centre) &&
        (dept === "All Departments" || u.dept === dept) &&
        (role === "All Roles" || u.role === role) &&
        (status === "All Status" || u.status === status) &&
        (!q || `${u.id} ${u.name} ${u.mobile}`.toLowerCase().includes(q)),
    );
  }, [query, centre, dept, role, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const filter = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };
  const allPicked = rows.length > 0 && rows.every((r) => picked.has(r.id));

  return (
    <SuperAdminFrame active="users-access-control">
      <PageHead icon={UsersRound} title="Admin & User Management" links={["User Management", "Roles & Permissions", "Access Control", "User Activity", "Account Security"]} />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={UsersRound} value="186" label="Total users" />
        <KpiTile tone="green" icon={CircleCheck} value="162" label="Active users" />
        <KpiTile tone="orange" icon={UserPlus} value="24" label="Inactive users" />
        <KpiTile tone="purple" icon={ShieldCheck} value="03" label="Access levels" />
        <KpiTile tone="red" icon={Lock} value="03" label="Access Issues" />
        <KpiTile tone="sky" icon={KeyRound} value="256" label="Permission Sets" />
      </KpiRow>

      <div className="flex flex-wrap items-center gap-[10px] lg:h-[38px] lg:flex-nowrap">
        <div role="tablist" className="flex gap-[8px] overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => (t === "Roles & Permissions" ? router.push(saRoutes.roles) : t === "Access Control" ? router.push(saRoutes.hierarchy) : setTab(t))}
              className={`flex h-[38px] shrink-0 items-center gap-[6px] whitespace-nowrap rounded-[9px] border px-[18px] pt-px text-[14px] font-semibold shadow-[0_2px_6px_rgba(30,50,110,0.06)] ${
                tab === t ? "border-[#1d4fe0] bg-[#1d4fe0] text-white" : "border-[#e1e5ee] bg-white hover:bg-[#f4f6fc]"
              }`}
            >
              {t === "User List" && <Plus strokeWidth={2.4} className="h-[15px] w-[15px]" />}
              {t}
            </button>
          ))}
        </div>
        <Link href={CREATE_USER_HREF} className="flex h-[38px] shrink-0 items-center gap-[7px] rounded-[8px] bg-[#1d4fe0] px-[18px] text-[14px] font-semibold text-white shadow-[0_3px_8px_rgba(29,79,224,0.3)] hover:bg-[#1840c0] lg:ml-auto">
          <Plus strokeWidth={2.4} className="h-[16px] w-[16px]" />
          <span className="pt-px">Add New User</span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-[10px] lg:h-[34px] lg:flex-nowrap">
        <SearchField value={query} onChange={filter(setQuery)} placeholder="Search by Name, Mobile, User ID..." className="w-full lg:w-[310px]" />
        <Dropdown label="Centre" value={centre} options={centres} onChange={filter(setCentre)} className="w-[132px]" />
        <Dropdown label="Department" value={dept} options={deptOptions} onChange={filter(setDept)} className="w-[150px]" />
        <Dropdown label="Role" value={role} options={roles} onChange={filter(setRole)} className="w-[120px]" />
        <Dropdown label="Status" value={status} options={statuses} onChange={filter(setStatus)} className="w-[120px]" />
        <button
          type="button"
          aria-label="Reset filters"
          onClick={() => {
            setQuery("");
            setCentre("All Centres");
            setDept("All Departments");
            setRole("All Roles");
            setStatus("All Status");
            setPage(1);
          }}
          className="flex h-[34px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border-[1.5px] border-[#6d7fe8] bg-[#f3f7ff] text-[#2320c4] hover:bg-[#e9f0ff]"
        >
          <RefreshCw strokeWidth={2.3} className="h-[16px] w-[16px]" />
        </button>
      </div>

      <div className="grid gap-[12px] lg:h-[500px] lg:grid-cols-[838fr_325fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title={tab === "User List" ? `User List (${filtered.length})` : tab} icon={UsersRound} titleSize={16.5} bodyClassName="flex flex-col pt-[8px]">
          {tab === "User List" ? (
            <>
              <TableWrap>
                <Thead>
                  <th className={`${th} w-[30px]`}>
                    <Checkbox checked={allPicked} label="" onChange={(v) => setPicked(v ? new Set(rows.map((r) => r.id)) : new Set())} />
                  </th>
                  {["User ID", "Name", "Mobile No.", "Role", "Centre / Location", "Status", "Last Login", "Action"].map((h) => (
                    <th key={h} className={`${th} text-center`}>{h}</th>
                  ))}
                </Thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u.id} className="border-b border-[#eef0f5]">
                      <td className={td}>
                        <Checkbox checked={picked.has(u.id)} label="" onChange={() => setPicked((p) => { const n = new Set(p); if (n.has(u.id)) n.delete(u.id); else n.add(u.id); return n; })} />
                      </td>
                      <td className={`${td} py-[9px] text-center font-semibold`}>{u.id}</td>
                      <td className={td}>{u.name}</td>
                      <td className={`${td} text-center`}>{u.mobile}</td>
                      <td className={`${td} text-center`}><Pill tone={roleTone[u.role]} className="w-[88px] rounded-[5px]">{u.role}</Pill></td>
                      <td className={`${td} text-center`}>{u.centre}</td>
                      <td className={`${td} text-center`}><StatusPill className="w-[70px]">{u.status}</StatusPill></td>
                      <td className={`${td} text-center`}>{u.login}</td>
                      <td className={`${td} text-center`}>
                        <div className="flex items-center justify-center gap-[8px] text-[#1d4fe0]">
                          <button type="button" aria-label={`View ${u.name}`} onClick={() => notice.show(`${u.id}: profile, effective permissions and sessions (demo).`)}><Eye strokeWidth={2.2} className="h-[17px] w-[17px]" /></button>
                          <button type="button" aria-label={`Edit ${u.name}`} onClick={() => notice.show(`${u.id}: role changes need independent approval (demo).`)}><Pencil strokeWidth={2.2} className="h-[16px] w-[16px]" /></button>
                          <button type="button" aria-label={`More for ${u.name}`} onClick={() => notice.show(`${u.id}: deactivate / revoke sessions — no direct deletion (demo).`)} className="text-[#0b0c36]"><MoreVertical strokeWidth={2.2} className="h-[16px] w-[16px]" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!rows.length && <tr><td colSpan={9} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">No users match these filters.</td></tr>}
                </tbody>
              </TableWrap>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-[10px]">
                <p className="text-[12px] font-medium text-[#3b4256]">
                  Showing {filtered.length ? (current - 1) * PER_PAGE + 1 : 0}–{(current - 1) * PER_PAGE + rows.length} of {filtered.length} demo accounts
                </p>
                <Pager page={current} pages={pages} onChange={setPage} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <ShieldCheck strokeWidth={1.8} className="h-[40px] w-[40px] text-[#2f4fe0]" />
              <p className="mt-[10px] text-[15px] font-bold">{tab}</p>
              <p className="mt-[4px] max-w-[420px] text-[13px] font-medium text-[#4a5070]">This view is a placeholder in the design prototype. Its records and actions will appear here once the module is connected.</p>
            </div>
          )}
        </Panel>

        <div className="flex min-h-0 flex-col gap-[12px]">
          <Panel title="Access Levels (03)" icon={UsersRound} titleSize={16} bodyClassName="flex flex-col gap-[8px] pt-[8px]">
            {[
              ["Super Admin", "02", "bg-[#f1ebff]"],
              ["Admin", "12", "bg-[#e7f0ff]"],
              ["User", "172", "bg-[#e6f6e3]"],
            ].map(([l, v, bg]) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setRole(l as (typeof roles)[number]);
                  setPage(1);
                  setTab("User List");
                }}
                className={`flex h-[38px] items-center justify-between rounded-[8px] px-[14px] text-[14px] font-semibold hover:brightness-95 ${bg}`}
              >
                <span>{l}</span>
                <b>{v}</b>
              </button>
            ))}
          </Panel>

          <Panel title="Quick Actions" icon={Zap} titleSize={16} className="min-h-0 flex-1" bodyClassName="flex flex-col pt-[4px]">
            {quick.map((a) => {
              const body = (
                <>
                  <a.icon strokeWidth={2} style={{ color: a.color }} className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1 text-[13px] font-semibold">{a.label}</span>
                  <ChevronRight strokeWidth={2.4} className="h-[15px] w-[15px]" />
                </>
              );
              const cls = "flex min-h-[32px] flex-1 items-center gap-[10px] border-b border-[#eef0f5] px-[4px] text-left last:border-0 hover:bg-[#f6f8fd]";
              return a.href ? (
                <Link key={a.label} href={a.href} className={cls}>{body}</Link>
              ) : (
                <button key={a.label} type="button" onClick={() => notice.show(`${a.label} (demo).`)} className={cls}>{body}</button>
              );
            })}
          </Panel>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}
