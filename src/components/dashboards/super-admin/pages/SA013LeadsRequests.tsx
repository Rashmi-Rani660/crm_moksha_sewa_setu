"use client";

/** SA-013 — Central Leads & Requests Management. Demo data. */

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  Bot,
  Calendar,
  CircleCheck,
  Eye,
  Filter,
  Flag,
  GitMerge,
  Headset,
  Layers,
  LayoutGrid,
  List,
  Mail,
  MapPin,
  MessageSquareText,
  Monitor,
  Network,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  RefreshCw,
  Share2,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  UserCheck,
  UserPlus,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Donut, Dot, WhatsAppIcon } from "@/components/dashboards/ui";
import {
  Dropdown,
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  QuickList,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  ViewLink,
  tdS,
  thS,
  useNotice,
} from "@/components/dashboards/super-admin/kit";
import { saRoutes } from "@/components/dashboards/super-admin/routes";

const tabs = ["Overview", "Intake by Source", "Lead / Request List", "Communication Monitoring", "Conversion & Routing", "Source Health"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { Overview: LayoutGrid, "Intake by Source": Layers, "Lead / Request List": List, "Communication Monitoring": MessageSquareText, "Conversion & Routing": Network, "Source Health": Activity };

type Icon = React.ReactNode;
const ic = (I: LucideIcon, c: string, s = 22): Icon => <I strokeWidth={1.9} style={{ color: c, width: s, height: s }} />;

const sources: { icon: Icon; label: string; value: string; pct: string }[] = [
  { icon: ic(Monitor, "#2f6fe0", 26), label: "Website Form", value: "286", pct: "(19.2%)" },
  { icon: ic(Bot, "#7a3fe0", 26), label: "AI Chatbot", value: "198", pct: "(13.3%)" },
  { icon: ic(PhoneIncoming, "#7a3fe0", 26), label: "AI Inbound Calling", value: "124", pct: "(8.3%)" },
  { icon: ic(PhoneCall, "#7a3fe0", 26), label: "AI Outbound Calling", value: "92", pct: "(6.2%)" },
  { icon: ic(UsersRound, "#2f6fe0", 26), label: "Volunteer App", value: "176", pct: "(11.8%)" },
  { icon: ic(Smartphone, "#7a3fe0", 26), label: "Staff App", value: "118", pct: "(7.9%)" },
  { icon: <WhatsAppIcon size={26} />, label: "WhatsApp", value: "317", pct: "(21.3%)" },
  { icon: ic(Mail, "#2f6fe0", 26), label: "Email", value: "104", pct: "(7.0%)" },
  { icon: ic(Share2, "#7a3fe0", 26), label: "Social Media", value: "62", pct: "(4.2%)" },
  { icon: <span className="text-[24px] font-bold leading-none text-[#4285f4]">G</span>, label: "Google Ads / Campaign Leads", value: "76", pct: "(5.1%)" },
  { icon: ic(Headset, "#7a3fe0", 26), label: "Manual Entry / Helpline", value: "131", pct: "(8.8%)" },
];

const distribution = [
  ["WhatsApp", 317, "21.3%", "#1f9a2b"],
  ["Website Form", 286, "19.2%", "#1f87e8"],
  ["Volunteer App", 176, "11.8%", "#f7b500"],
  ["AI Chatbot", 198, "13.3%", "#7cc1f5"],
  ["AI Inbound Calling", 124, "8.3%", "#e02424"],
  ["AI Outbound Calling", 92, "6.2%", "#f08a24"],
  ["Staff App", 118, "7.9%", "#a259e8"],
  ["Email", 104, "7.0%", "#2f4fe0"],
  ["Manual Entry / Helpline", 131, "8.8%", "#f2c94c"],
  ["Google Ads / Campaign", 76, "5.1%", "#d64545"],
  ["Social Media", 62, "4.2%", "#7a3fe0"],
] as const;

const health: { icon: Icon; name: string; time: string }[] = [
  { icon: <WhatsAppIcon size={15} />, name: "WhatsApp", time: "~ 10 sec" },
  { icon: ic(Bot, "#7a3fe0", 15), name: "AI Chatbot", time: "~ 02 sec" },
  { icon: ic(PhoneIncoming, "#7a3fe0", 15), name: "Calling (Inbound)", time: "~ 08 sec" },
  { icon: ic(PhoneCall, "#7a3fe0", 15), name: "Calling (Outbound)", time: "~ 12 sec" },
  { icon: ic(Mail, "#2f6fe0", 15), name: "Email", time: "~ 02 min" },
  { icon: ic(Monitor, "#2f6fe0", 15), name: "Website Form", time: "~ 05 sec" },
  { icon: ic(UsersRound, "#f0a020", 15), name: "Volunteer App", time: "~ 07 sec" },
  { icon: ic(Smartphone, "#2f6fe0", 15), name: "Staff App", time: "~ 08 sec" },
];

type Lead = { id: string; source: string; name: string; mobile: string; service: string; area: string; stage: string; priority: string };
const leads: Lead[] = [
  { id: "REQ-2026-10587", source: "WhatsApp", name: "Ramesh Kumar", mobile: "+91 98765 43210", service: "Grief Support", area: "Ghaziabad (HO)", stage: "New Lead", priority: "High" },
  { id: "REQ-2026-10586", source: "Website", name: "Anita Sharma", mobile: "+91 98210 77890", service: "Medical Aid", area: "Delhi – Central", stage: "Verified", priority: "Medium" },
  { id: "REQ-2026-10585", source: "AI Chatbot", name: "Vikram Singh", mobile: "+91 96543 21098", service: "Food Assistance", area: "Noida – Sec 62", stage: "Auto-Assigned", priority: "Medium" },
  { id: "REQ-2026-10584", source: "Inbound Call", name: "Suman Devi", mobile: "+91 93120 44567", service: "Shelter Support", area: "Delhi – East", stage: "Manual Review", priority: "High" },
  { id: "REQ-2026-10583", source: "Volunteer App", name: "Mohit Verma", mobile: "+91 98710 22134", service: "Education Help", area: "Ghaziabad – Indirapuram", stage: "Verified", priority: "Low" },
  { id: "REQ-2026-10582", source: "Staff App", name: "Priya Nair", mobile: "+91 99909 55678", service: "Counselling", area: "Noida – Sec 18", stage: "Auto-Assigned", priority: "Medium" },
  { id: "REQ-2026-10581", source: "Email", name: "Amit Khanna", mobile: "+91 98102 33445", service: "Financial Aid", area: "Delhi – North", stage: "New Lead", priority: "High" },
  { id: "REQ-2026-10580", source: "Manual / Helpline", name: "Meena Gupta", mobile: "+91 93540 66771", service: "General Enquiry", area: "Delhi – West", stage: "Verified", priority: "Low" },
];
const sourceIcon: Record<string, Icon> = {
  WhatsApp: <WhatsAppIcon size={15} />,
  Website: ic(Monitor, "#2f6fe0", 15),
  "AI Chatbot": ic(Bot, "#7a3fe0", 15),
  "Inbound Call": ic(PhoneIncoming, "#7a3fe0", 15),
  "Volunteer App": ic(UsersRound, "#2f6fe0", 15),
  "Staff App": ic(Smartphone, "#2f6fe0", 15),
  Email: ic(Mail, "#2f6fe0", 15),
  "Manual / Helpline": ic(Headset, "#7a3fe0", 15),
};

const sourceOpts = ["All Sources", ...Object.keys(sourceIcon)] as const;
const dateOpts = ["Last 30 Days", "Last 7 Days", "Today"] as const;
const centreOpts = ["All Centres", "Ghaziabad", "Delhi", "Noida"] as const;
const prioOpts = ["All Priority", "High", "Medium", "Low"] as const;
const statusOpts = ["All Status", "New Lead", "Verified", "Auto-Assigned", "Manual Review"] as const;
type Filters = { source: string; date: string; centre: string; priority: string; status: string };
const noFilters: Filters = { source: "All Sources", date: "Last 30 Days", centre: "All Centres", priority: "All Priority", status: "All Status" };

export default function SA013LeadsRequests() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Overview");
  const [draft, setDraft] = useState<Filters>(noFilters);
  const [applied, setApplied] = useState<Filters>(noFilters);
  const rows = leads.filter(
    (l) =>
      (applied.source === "All Sources" || l.source === applied.source) &&
      (applied.centre === "All Centres" || l.area.startsWith(applied.centre)) &&
      (applied.priority === "All Priority" || l.priority === applied.priority) &&
      (applied.status === "All Status" || l.stage === applied.status),
  );
  const set = (k: keyof Filters) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <SuperAdminFrame active="sewa-operations">
      <PageHead icon={UsersRound} title="Central Leads & Requests Management" links={["Omnichannel Intake", "Lead Conversion", "Request Routing", "Source Monitoring"]} />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={UsersRound} value="1,486" label="Total Incoming Requests" />
        <KpiTile tone="green" icon={UserPlus} value="362" label="New Leads (This Month)" />
        <KpiTile tone="green" icon={CircleCheck} value="968" label="Verified Requests" />
        <KpiTile tone="orange" icon={Layers} value="714" label="Auto-Assigned (48%)" />
        <KpiTile tone="purple" icon={Eye} value="204" label="Manual Review (14%)" />
        <KpiTile tone="sky" icon={ShieldCheck} value="568" label="Converted to Cases (38%)" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} icons={tabIcons} />

      <div className="grid gap-[10px] lg:h-[248px] lg:grid-cols-[515fr_435fr_395fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Request Intake Sources" note="(Omnichannel)" icon={Network} bodyClassName="grid grid-cols-2 gap-[6px] pt-[4px] sm:grid-cols-4">
          {sources.map((s) => (
            <div key={s.label} className="flex min-w-0 items-center gap-[7px] rounded-[8px] border border-[#e1e5ee] px-[7px] py-[3px] shadow-[0_1px_4px_rgba(30,50,110,0.06)]">
              <span className="flex w-[26px] shrink-0 justify-center">{s.icon}</span>
              <span className="min-w-0 leading-[1.1]">
                <span className="block text-[10px] font-semibold">{s.label}</span>
                <b className="block text-[13.5px]">{s.value}</b>
                <span className="text-[10px] font-medium">{s.pct}</span>
              </span>
            </div>
          ))}
        </Panel>

        <Panel title="Source-wise Request Distribution" note="(This Month)" bodyClassName="flex items-center gap-[14px] pt-[2px]">
          <Donut size={142} thickness={30} segments={distribution.map(([, v, , c]) => ({ value: v, color: c }))}>
            <b className="text-[21px] leading-none">1,486</b>
            <span className="text-[12px] font-semibold">Total</span>
          </Donut>
          <ul className="flex min-w-0 flex-1 flex-col gap-[2px]">
            {distribution.map(([l, v, p, c]) => (
              <li key={l} className="flex items-center gap-[6px] text-[11px] font-semibold leading-[14px]">
                <Dot color={c} size={8} />
                <span className="min-w-0 flex-1 truncate">{l}</span>
                <b className="w-[26px] text-right">{v}</b>
                <span className="w-[42px] text-right">({p})</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Live Channel Health" icon={Activity} action={<ViewLink to="Integrations & API">View Details</ViewLink>} bodyClassName="pt-[2px]">
          <TableWrap>
            <Thead>
              {["Channel", "Status", "Response Time"].map((h) => <th key={h} className={`${thS}`}>{h}</th>)}
            </Thead>
            <tbody>
              {health.map((h) => (
                <tr key={h.name}>
                  <td className={`${tdS}`}><span className="flex items-center gap-[7px]">{h.icon}{h.name}</span></td>
                  <td className={`${tdS}`}><span className="inline-flex h-[15px] items-center gap-[4px] rounded-full bg-[#d4f3d2] px-[7px] text-[11px] font-semibold leading-none text-[#1c6b1f]"><CircleCheck strokeWidth={2.4} className="h-[11px] w-[11px]" />Healthy</span></td>
                  <td className={`${tdS}`}>{h.time}</td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>
      </div>

      <section aria-label="Filters" className="flex flex-wrap items-center gap-[8px] rounded-[10px] border border-[#e1e5ee] bg-white px-[10px] py-[6px] shadow-[0_2px_6px_rgba(30,50,110,0.05)] lg:h-[44px] lg:flex-nowrap lg:py-0">
        <FilterLabel icon={Filter} label="Source" />
        <Dropdown label="Source" value={draft.source} options={sourceOpts} onChange={set("source")} className="w-[140px]" size={12.5} />
        <FilterLabel icon={Calendar} label="Date" />
        <Dropdown label="Date" value={draft.date} options={dateOpts} onChange={set("date")} className="w-[120px]" size={12.5} />
        <FilterLabel icon={MapPin} label="Centre" />
        <Dropdown label="Centre filter" value={draft.centre} options={centreOpts} onChange={set("centre")} className="w-[115px]" size={12.5} />
        <FilterLabel icon={Flag} label="Priority" />
        <Dropdown label="Priority" value={draft.priority} options={prioOpts} onChange={set("priority")} className="w-[110px]" size={12.5} />
        <FilterLabel icon={Activity} label="Status" />
        <Dropdown label="Status" value={draft.status} options={statusOpts} onChange={set("status")} className="w-[120px]" size={12.5} />
        <button type="button" onClick={() => { setDraft(noFilters); setApplied(noFilters); }} className="ml-auto flex h-[32px] items-center gap-[6px] rounded-[8px] border-[1.5px] border-[#6d7fe8] px-[14px] text-[13px] font-semibold text-[#2320c4] hover:bg-[#f1f4ff]">
          <RefreshCw strokeWidth={2.3} className="h-[15px] w-[15px]" />Reset
        </button>
        <button type="button" onClick={() => setApplied(draft)} className="flex h-[32px] items-center rounded-[8px] bg-[#1d4fe0] px-[16px] text-[13px] font-semibold text-white hover:bg-[#1840c0]">Apply Filters</button>
      </section>

      <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[955fr_395fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Lead / Request List" note="(Recent)" icon={List} action={<ViewLink to="Sewa Operations" />} bodyClassName="pt-[2px]">
          <TableWrap>
            <Thead>
              {["#", "Request ID", "Source", "Requester Name", "Mobile", "Service Type", "Centre / Area", "Stage", "Priority", "Action"].map((h) => (
                <th key={h} className={`${thS} ${["Stage", "Priority", "Action"].includes(h) ? "text-center" : ""}`}>{h}</th>
              ))}
            </Thead>
            <tbody>
              {rows.map((l, i) => (
                <tr key={l.id} className="border-b border-[#eef0f5] last:border-0">
                  <td className={`${tdS}`}>{String(i + 1).padStart(2, "0")}</td>
                  <td className={tdS}>{l.id}</td>
                  <td className={tdS}><span className="flex items-center gap-[6px]">{sourceIcon[l.source]}{l.source}</span></td>
                  <td className={tdS}>{l.name}</td>
                  <td className={tdS}>{l.mobile}</td>
                  <td className={tdS}>{l.service}</td>
                  <td className={tdS}>{l.area}</td>
                  <td className={`${tdS} text-center`}><StatusPill className="h-[18px] w-[92px] rounded-[5px] text-[11px]">{l.stage}</StatusPill></td>
                  <td className={`${tdS} text-center`}><StatusPill className="h-[18px] w-[60px] rounded-[5px] text-[11px]">{l.priority}</StatusPill></td>
                  <td className={`${tdS} text-center`}>
                    <Link href={saRoutes.requestDetails} className="font-semibold text-[#2320c4] hover:underline">Manage</Link>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={10} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">No requests match these filters.</td></tr>}
            </tbody>
          </TableWrap>
        </Panel>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Communication Monitoring" icon={MessageSquareText} className="lg:h-[100px]" bodyClassName="grid grid-cols-4 gap-[6px] pt-[4px]">
            {[
              [PhoneMissed, "#e02424", "18", "Missed Callbacks"],
              [Mail, "#7a3fe0", "56", "Unread Messages"],
              [ShieldCheck, "#f0a020", "42", "Pending Verification"],
              [Bot, "#1f9a2b", "Active", "Auto-Reply (98.7%)"],
            ].map(([I, c, v, l]) => {
              const Ic = I as LucideIcon;
              return (
                <div key={l as string} className="flex min-w-0 items-center gap-[5px] rounded-[8px] border border-[#e1e5ee] px-[5px]">
                  <Ic strokeWidth={2} style={{ color: c as string }} className="h-[20px] w-[20px] shrink-0" />
                  <span className="min-w-0 leading-[1.1]">
                    <b className="block text-[14px]">{v as string}</b>
                    <span className="block text-[9.6px] font-semibold">{l as string}</span>
                  </span>
                </div>
              );
            })}
          </Panel>
          <Panel title="Quick Actions" icon={Zap} className="min-h-0 lg:flex-1" bodyClassName="pt-[4px]">
            <QuickList
              items={[
                { icon: CircleCheck, label: "Verify Lead", color: "#1f9a2b", href: saRoutes.requestDetails },
                { icon: UserCheck, label: "Convert to Request", onClick: () => notice.show("Verified lead converted to a Sewa request (demo).") },
                { icon: UserPlus, label: "Assign Admin", color: "#7a3fe0", onClick: () => notice.show("Assign an admin for review (demo).") },
                { icon: GitMerge, label: "Merge Duplicate", color: "#7a3fe0", onClick: () => notice.show("Duplicates are merged with history kept (demo).") },
                { icon: TriangleAlert, label: "Escalate", color: "#e02424", href: saRoutes.sla },
              ]}
            />
          </Panel>
        </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function FilterLabel({ icon: I, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-[5px] text-[13px] font-semibold">
      <I strokeWidth={2} className="h-[15px] w-[15px]" />
      {label}
    </span>
  );
}

