"use client";

/**
 * SA-004 — Central Approval Centre.
 * Notes (design brief 04): maker-checker, independent approval and separation
 * of duties are enforced on the server; no self-approval; bulk actions only
 * for low-risk, policy-approved records; every decision needs a reason,
 * evidence, audit trail and notification; thresholds are configurable.
 */

import { useState } from "react";
import {
  ArrowLeftRight,
  CircleCheck,
  CircleX,
  Clock3,
  FileText,
  HandHeart,
  Layers,
  MoreVertical,
  Network,
  RefreshCw,
  Settings,
  ShoppingCart,
  Timer,
  Truck,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  CentreDropdown,
  Checkbox,
  DateChip,
  Dropdown,
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  Pill,
  PrimaryButton,
  SearchField,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Thead,
  td,
  th,
  useNotice,
  type PillTone,
} from "@/components/dashboards/super-admin/kit";

type Category = "Sewa Request" | "Expenses" | "Maintenance" | "Donation" | "Procurement" | "User Access" | "Other";

const tabs: { label: string; count: number; match?: Category[] }[] = [
  { label: "All", count: 37 },
  { label: "Sewa Requests", count: 14, match: ["Sewa Request"] },
  { label: "Expenses", count: 7, match: ["Expenses"] },
  { label: "Donations", count: 5, match: ["Donation"] },
  { label: "Procurement", count: 4, match: ["Procurement"] },
  { label: "User Access", count: 3, match: ["User Access"] },
  { label: "Other", count: 4, match: ["Other", "Maintenance"] },
];

type Approval = { id: string; icon: LucideIcon; color: string; title: string; sub: string; category: Category; amount: string; centre: string; priority: string; age: string };
const approvals: Approval[] = [
  { id: "APV-02671", icon: UsersRound, color: "#2f6fe0", title: "Emergency Vehicle Deployment", sub: "For SR-02671 – Body Transportation", category: "Sewa Request", amount: "–", centre: "Ghaziabad", priority: "High", age: "32 min" },
  { id: "APV-02666", icon: Layers, color: "#f0a020", title: "Case Expense Approval", sub: "Standard cremation services & logistics", category: "Expenses", amount: "₹ 28,500", centre: "Ghaziabad", priority: "High", age: "58 min" },
  { id: "APV-02659", icon: Truck, color: "#1f9a2b", title: "Vehicle Maintenance Approval", sub: "MV-02 – Periodic service & AMC", category: "Maintenance", amount: "₹ 12,400", centre: "Ghaziabad", priority: "Medium", age: "1.3 hrs" },
  { id: "APV-02654", icon: HandHeart, color: "#1f9a2b", title: "Donation Utilisation", sub: "For Moksha Sewa – EWS Support", category: "Donation", amount: "₹ 50,000", centre: "Central", priority: "Medium", age: "2.1 hrs" },
  { id: "APV-02651", icon: ShoppingCart, color: "#d6336c", title: "Material Procurement", sub: "Antim ritual kit (50 units)", category: "Procurement", amount: "₹ 17,500", centre: "Ghaziabad", priority: "Normal", age: "3.2 hrs" },
  { id: "APV-02649", icon: UserRound, color: "#2f6fe0", title: "New User Access Request", sub: "Field Coordinator – NCR Zone", category: "User Access", amount: "–", centre: "Central", priority: "Normal", age: "4.5 hrs" },
  { id: "APV-02647", icon: Network, color: "#7a3fe0", title: "Vendor Onboarding Approval", sub: "Funeral Services – Partner (Noida)", category: "Other", amount: "–", centre: "Noida", priority: "Normal", age: "5.0 hrs" },
];

const categoryTone: Record<Category, PillTone> = {
  "Sewa Request": "blue",
  Expenses: "amber",
  Maintenance: "green",
  Donation: "green",
  Procurement: "pink",
  "User Access": "blue",
  Other: "gray",
};

const centres = ["All Centres", "Ghaziabad", "Central", "Noida"] as const;
const departments = ["All Departments", "Operations & Sewa", "Finance & Donations", "Admin & Support"] as const;
const prioritiesList = ["All Priorities", "High", "Medium", "Normal"] as const;
const statusList = ["All Status", "Pending Review", "Approved", "Rejected", "Reassigned"] as const;

const workflow = [
  { title: "1. Submission", sub: "Raised by User / Team", state: "done" },
  { title: "2. Review", sub: "Verification by Department", state: "done" },
  { title: "3. Approval", sub: "Independent approver", state: "current" },
  { title: "4. Notification", sub: "Auto Update to All Stakeholders", state: "todo" },
] as const;

export default function SA004Approvals() {
  const notice = useNotice();
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [centre, setCentre] = useState<(typeof centres)[number]>("All Centres");
  const [dept, setDept] = useState<(typeof departments)[number]>("All Departments");
  const [prio, setPrio] = useState<(typeof prioritiesList)[number]>("All Priorities");
  const [status, setStatus] = useState<(typeof statusList)[number]>("All Status");
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());

  const q = query.trim().toLowerCase();
  const match = tabs[tab].match;
  const rows = approvals.filter(
    (a) =>
      (!match || match.includes(a.category)) &&
      (centre === "All Centres" || a.centre === centre) &&
      (prio === "All Priorities" || a.priority === prio) &&
      (!q || `${a.id} ${a.title} ${a.sub}`.toLowerCase().includes(q)),
  );
  const allPicked = rows.length > 0 && rows.every((r) => picked.has(r.id));
  const reset = () => {
    setQuery("");
    setCentre("All Centres");
    setDept("All Departments");
    setPrio("All Priorities");
    setStatus("All Status");
    setPicked(new Set());
  };
  const bulk = (what: string) => {
    if (!picked.size) return notice.show("Select low-risk records first.");
    const risky = approvals.filter((a) => picked.has(a.id) && a.priority !== "Normal");
    if (what !== "Reassign" && risky.length) return notice.show(`Bulk ${what.toLowerCase()} is only for low-risk records — ${risky.map((r) => r.id).join(", ")} need individual review.`);
    const reason = window.prompt(`${what}: reason for ${picked.size} record(s)`);
    if (reason) notice.show(`${what} recorded with reason for ${picked.size} record(s) (demo).`);
  };

  return (
    <SuperAdminFrame active="central-approvals">
      <PageHead icon={FileText} iconTone="orange" title="Central Approval Centre" links={["Review", "Approve", "Reject", "Reassign", "Track Decisions"]}>
        <DateChip className="w-[200px]" />
        <CentreDropdown className="w-[180px]" />
        <PrimaryButton icon={Settings} onClick={() => notice.show("Approval thresholds and approvers are configured here (demo).")}>Approval Settings</PrimaryButton>
      </PageHead>

      <KpiRow cols={7}>
        <KpiTile tone="blue" icon={FileText} value="37" label="Total for Approval" />
        <KpiTile tone="red" icon={Clock3} value="12" label="High Priority" />
        <KpiTile tone="orange" icon={UsersRound} value="15" label="Pending Review" />
        <KpiTile tone="green" icon={CircleCheck} value="18" label="Approved" sub="(This Month)" />
        <KpiTile tone="red" icon={CircleX} value="03" label="Rejected" />
        <KpiTile tone="purple" icon={RefreshCw} value="02" label="Reassigned" />
        <KpiTile tone="sky" icon={Timer} value="4.6 hrs" label="Avg. Approval Time" />
      </KpiRow>

      <div className="grid gap-[12px] lg:h-[620px] lg:grid-cols-[915fr_252fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <div className="flex min-h-0 min-w-0 flex-col gap-[10px]">
          <div role="tablist" className="flex gap-[8px] overflow-x-auto">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={tab === i}
                onClick={() => setTab(i)}
                className={`flex h-[38px] shrink-0 items-center justify-center whitespace-nowrap rounded-[9px] border px-[16px] pt-px text-[14px] font-semibold shadow-[0_2px_6px_rgba(30,50,110,0.06)] lg:flex-1 ${
                  tab === i ? "border-[#1d4fe0] bg-[#1d4fe0] text-white" : "border-[#e1e5ee] bg-white hover:bg-[#f4f6fc]"
                }`}
              >
                {t.label} ({String(t.count).padStart(2, "0")})
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-[10px] lg:flex-nowrap">
            <SearchField value={query} onChange={setQuery} placeholder="Search by Approval ID, Case ID, Subject..." className="w-full lg:w-[340px]" />
            <Dropdown label="Centre filter" value={centre} options={centres} onChange={setCentre} className="w-[132px]" />
            <Dropdown label="Department" value={dept} options={departments} onChange={setDept} className="w-[150px]" />
            <Dropdown label="Priority" value={prio} options={prioritiesList} onChange={setPrio} className="w-[130px]" />
            <Dropdown label="Status" value={status} options={statusList} onChange={setStatus} className="w-[120px]" />
            <button type="button" aria-label="Reset filters" onClick={reset} className="flex h-[34px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border-[1.5px] border-[#6d7fe8] bg-[#f3f7ff] text-[#2320c4] hover:bg-[#e9f0ff]">
              <RefreshCw strokeWidth={2.3} className="h-[16px] w-[16px]" />
            </button>
          </div>

          <Panel className="min-h-0 flex-1" bodyClassName="flex flex-col px-[10px] pt-[8px]">
            <TableWrap>
              <Thead>
                <th className={`${th} w-[30px]`}>
                  <Checkbox checked={allPicked} label="" onChange={(v) => setPicked(v ? new Set(rows.map((r) => r.id)) : new Set())} />
                </th>
                {["Approval ID", "Request / Subject", "Category", "Amount (₹)", "Centre / Location", "Priority", "Age", "Action"].map((h) => (
                  <th key={h} className={`${th} ${["Request / Subject", "Approval ID"].includes(h) ? "" : "text-center"}`}>{h}</th>
                ))}
              </Thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} className="border-b border-[#eef0f5]">
                    <td className={td}>
                      <Checkbox
                        checked={picked.has(a.id)}
                        label=""
                        onChange={() =>
                          setPicked((p) => {
                            const n = new Set(p);
                            if (n.has(a.id)) n.delete(a.id);
                            else n.add(a.id);
                            return n;
                          })
                        }
                      />
                    </td>
                    <td className={`${td} font-semibold`}>{a.id}</td>
                    <td className={`${td} py-[9px]`}>
                      <div className="flex items-center gap-[10px]">
                        <a.icon strokeWidth={1.9} style={{ color: a.color }} className="h-[26px] w-[26px] shrink-0" />
                        <div className="leading-tight">
                          <p className="text-[13.2px] font-bold">{a.title}</p>
                          <p className="text-[11.8px] font-medium text-[#3b4256]">{a.sub}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${td} text-center`}><Pill tone={categoryTone[a.category]} className="w-[98px]">{a.category}</Pill></td>
                    <td className={`${td} text-center font-semibold`}>{a.amount}</td>
                    <td className={`${td} text-center`}>{a.centre}</td>
                    <td className={`${td} text-center`}><StatusPill className="w-[70px]">{a.priority}</StatusPill></td>
                    <td className={`${td} text-center`}>{a.age}</td>
                    <td className={`${td} text-center`}>
                      <div className="flex items-center justify-center gap-[6px]">
                        <button type="button" onClick={() => notice.show(`${a.id}: review evidence and audit history before deciding (demo).`)} className="h-[28px] rounded-[7px] border-[1.5px] border-[#2f4fe0] px-[16px] text-[12.8px] font-semibold text-[#1d3fc4] hover:bg-[#f1f4ff]">
                          Review
                        </button>
                        <button type="button" aria-label={`More actions for ${a.id}`} onClick={() => notice.show(`${a.id}: reassign / extend SLA / view history (demo).`)} className="rounded p-[2px] hover:bg-[#f1f4fb]">
                          <MoreVertical strokeWidth={2.2} className="h-[16px] w-[16px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">No approvals match these filters.</td>
                  </tr>
                )}
              </tbody>
            </TableWrap>
            <p className="mt-auto pt-[8px] text-[12px] font-medium text-[#3b4256]">Maker–checker enforced • No self-approval • View supporting evidence and audit history before decision.</p>
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[12px]">
          <Panel title="Approval Workflow" bodyClassName="relative flex flex-col gap-[6px] pt-[10px]">
            <span className="absolute bottom-[26px] left-[21px] top-[22px] w-[2px] bg-[#cfd5e2]" />
            {workflow.map((w) => (
              <div key={w.title} className={`relative flex items-start gap-[10px] rounded-[8px] px-[2px] py-[5px] ${w.state === "current" ? "bg-[#e7efff]" : ""}`}>
                <span
                  className={`mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[2.5px] bg-white ${
                    w.state === "done" ? "border-[#1f9a2b]" : w.state === "current" ? "border-[#1d4fe0]" : "border-[#b8bfcd]"
                  }`}
                >
                  {w.state === "done" && <CircleCheck strokeWidth={3} className="h-[12px] w-[12px] text-[#1f9a2b]" />}
                  {w.state === "current" && <span className="h-[7px] w-[7px] rounded-full bg-[#1d4fe0]" />}
                </span>
                <span className="leading-tight">
                  <b className="block text-[13px]">{w.title}</b>
                  <span className="text-[11.8px] font-medium">{w.sub}</span>
                </span>
              </div>
            ))}
          </Panel>

          <Panel title="Quick Actions" bodyClassName="grid grid-cols-2 gap-[8px]">
            <QuickBtn icon={CircleCheck} color="#1f9a2b" label="Approve (low risk)" onClick={() => bulk("Approve")} />
            <QuickBtn icon={CircleX} color="#e02424" label="Reject + reason" onClick={() => bulk("Reject")} />
            <QuickBtn icon={ArrowLeftRight} color="#f0a020" label="Reassign / Extend SLA with reason" onClick={() => bulk("Reassign")} wide />
          </Panel>

          <section aria-label="SLA Compliance" className="flex items-center gap-[10px] rounded-[10px] border border-[#f1e2b8] bg-[#fff6dd] px-[12px] py-[12px]">
            <Timer strokeWidth={2} className="h-[22px] w-[22px] shrink-0 text-[#ef9a12]" />
            <p className="flex-1 text-[13px] font-bold leading-tight">SLA Compliance <span className="font-medium">(This Month)</span></p>
            <b className="text-[18px] text-[#138a16]">96%</b>
          </section>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function QuickBtn({ icon: Icon, color, label, onClick, wide = false }: { icon: LucideIcon; color: string; label: string; onClick: () => void; wide?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`flex min-h-[62px] flex-col items-center justify-center gap-[5px] rounded-[9px] border border-[#e1e5ee] bg-white px-[6px] text-center shadow-[0_2px_6px_rgba(30,50,110,0.07)] hover:bg-[#f7f9ff] ${wide ? "col-span-2" : ""}`}>
      <Icon strokeWidth={2} style={{ color }} className="h-[22px] w-[22px]" />
      <span className="text-[12px] font-semibold leading-tight">{label}</span>
    </button>
  );
}
