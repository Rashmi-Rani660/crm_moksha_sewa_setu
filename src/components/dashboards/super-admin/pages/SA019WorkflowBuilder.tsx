"use client";

/** SA-019 — Task Templates & Workflow Builder. Demo data. */

import { Fragment, useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CircleCheck,
  CirclePause,
  CirclePlay,
  CirclePlus,
  CircleX,
  Copy,
  Crown,
  Eye,
  FileText,
  FileX,
  GitBranch,
  Hand,
  Layers,
  LayoutGrid,
  ListChecks,
  MoreVertical,
  Network,
  Pencil,
  RefreshCw,
  Settings,
  ShieldCheck,
  Siren,
  TrendingUp,
  TriangleAlert,
  UserCog,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Dropdown,
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  PrimaryButton,
  SearchField,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  tdS,
  thS,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const tabs = ["Template Library", "Workflow Builder", "Conditional Logic", "Failure Handling", "Automation Rules", "Execution Logs"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { "Template Library": LayoutGrid, "Workflow Builder": Network, "Conditional Logic": GitBranch, "Failure Handling": TriangleAlert, "Automation Rules": Settings, "Execution Logs": FileText };

type Template = { name: string; service: string; trigger: string; steps: string; owner: string; status: string };
const initialTemplates: Template[] = [
  { name: "Beneficiary Onboarding Workflow", service: "Sewa Request", trigger: "New Request Created", steps: "06", owner: "Super Admin", status: "Active" },
  { name: "Relief Material Approval Flow", service: "Operations", trigger: "Request Under Review", steps: "05", owner: "Operations Lead", status: "Active" },
  { name: "Medical Assistance Routing", service: "Health Support", trigger: "Service Request (Health)", steps: "06", owner: "Centre Admin", status: "Active" },
  { name: "Donation Utilization Workflow", service: "Finance & Donations", trigger: "Donation Received", steps: "04", owner: "Finance Admin", status: "Draft" },
  { name: "Case Escalation (Priority)", service: "Case Management", trigger: "SLA Breach / High Priority", steps: "05", owner: "Case Admin", status: "Active" },
  { name: "Volunteer Onboarding Flow", service: "Volunteer", trigger: "New Volunteer Registration", steps: "04", owner: "HR Admin", status: "Paused" },
];

const steps: { icon: LucideIcon; title: string; sub: string; bg: string; fg: string }[] = [
  { icon: CirclePlay, title: "Trigger", sub: "New Request Created", bg: "#eaf2ff", fg: "#1d5bd6" },
  { icon: ShieldCheck, title: "Verification", sub: "Validate Details & Documents", bg: "#f1ebff", fg: "#7a3fe0" },
  { icon: UsersRound, title: "Assignment", sub: "Assign to Service Centre", bg: "#e8f7e6", fg: "#1f9a2b" },
  { icon: Bell, title: "Reminder", sub: "Follow-up (After SLA)", bg: "#fff4dc", fg: "#ef9a12" },
  { icon: TrendingUp, title: "Escalation", sub: "Escalate to Higher Authority", bg: "#fdecec", fg: "#e02424" },
  { icon: CircleCheck, title: "Closure", sub: "Mark as Completed", bg: "#e8f7e6", fg: "#1f9a2b" },
];

const rules: { icon: LucideIcon; color: string; bg: string; title: string; sub: string }[] = [
  { icon: Siren, color: "#e02424", bg: "#fff3f3", title: "If emergency", sub: "then immediate escalation to Centre Head." },
  { icon: FileX, color: "#2f6fe0", bg: "#f2f6ff", title: "If document missing", sub: "then hold the workflow & notify the requester." },
  { icon: RefreshCw, color: "#7a3fe0", bg: "#f6f2ff", title: "If no acknowledgement", sub: "then retry up to 3 times or assign manually to an operator." },
];

const serviceOpts = ["All Services", "Sewa Request", "Operations", "Health Support", "Finance & Donations", "Case Management", "Volunteer"] as const;
const statusOpts = ["All Status", "Active", "Draft", "Paused"] as const;

export default function SA019WorkflowBuilder() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Template Library");
  const [templates, setTemplates] = useState(initialTemplates);
  const [service, setService] = useState<string>("All Services");
  const [status, setStatus] = useState<string>("All Status");
  const [q, setQ] = useState("");
  const [paused, setPaused] = useState(false);
  const [ruleOn, setRuleOn] = useState([true, true, true]);

  const rows = templates.filter(
    (t) => (service === "All Services" || t.service === service) && (status === "All Status" || t.status === status) && (!q.trim() || t.name.toLowerCase().includes(q.trim().toLowerCase())),
  );
  const duplicate = (t: Template) => {
    setTemplates((ts) => [...ts, { ...t, name: `${t.name} (Copy)`, status: "Draft", owner: "Super Admin" }]);
    notice.show(`Duplicated "${t.name}" as a draft.`);
  };

  return (
    <SuperAdminFrame active="automation-ai">
      <PageHead icon={Network} title="Task Templates & Workflow Builder" links={["Template Library", "Automation Rules", "Conditional Routing", "Failure Handling"]} />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Layers} value={String(132 + templates.length - initialTemplates.length)} label="Workflow Templates" />
        <KpiTile tone="green" icon={CirclePlay} value={paused ? "00" : "96"} label="Active Automations" />
        <KpiTile tone="orange" icon={GitBranch} value="48" label="Conditional Rules" />
        <KpiTile tone="purple" icon={Hand} value="08" label="Manual Overrides" />
        <KpiTile tone="red" icon={TriangleAlert} value="14" label="Failed Automations" />
        <KpiTile tone="green" icon={CircleCheck} value="92.6%" label="Success Rate" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} icons={tabIcons} />

      <Panel
        title={`Template Library (${132 + templates.length - initialTemplates.length} Templates)`}
        icon={ListChecks}
        className="lg:h-[222px]"
        action={
          <div className="hidden items-center gap-[8px] lg:flex">
            <span className="text-[12.5px] font-bold">Service Type:</span>
            <Dropdown label="Service type" value={service} options={serviceOpts} onChange={setService} className="w-[140px]" size={12.5} />
            <span className="text-[12.5px] font-bold">Status:</span>
            <Dropdown label="Status" value={status} options={statusOpts} onChange={setStatus} className="w-[120px]" size={12.5} />
            <SearchField value={q} onChange={setQ} placeholder="Search templates..." className="w-[230px]" />
          </div>
        }
        bodyClassName="pt-[4px]"
      >
        <div className="mb-2 flex flex-wrap gap-2 lg:hidden">
          <Dropdown label="Service type" value={service} options={serviceOpts} onChange={setService} className="w-[150px]" />
          <Dropdown label="Status" value={status} options={statusOpts} onChange={setStatus} className="w-[130px]" />
          <SearchField value={q} onChange={setQ} placeholder="Search templates..." className="w-full" />
        </div>
        <TableWrap>
          <Thead>
            {["#", "Template Name", "Service Type", "Trigger Event", "Steps", "Owner", "Status", "Action"].map((h) => (
              <th key={h} className={`${thS} ${["Steps", "Action"].includes(h) ? "text-center" : ""}`}>{h}</th>
            ))}
          </Thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={t.name} className="border-b border-[#eef0f5] last:border-0">
                <td className={tdS}>{String(i + 1).padStart(2, "0")}</td>
                <td className={tdS}>{t.name}</td>
                <td className={tdS}>{t.service}</td>
                <td className={tdS}>{t.trigger}</td>
                <td className={`${tdS} text-center`}>{t.steps}</td>
                <td className={tdS}><span className="flex items-center gap-[6px]">{t.owner === "Super Admin" ? <Crown strokeWidth={2} className="h-[14px] w-[14px] text-[#f0a020]" /> : <UsersRound strokeWidth={2} className="h-[14px] w-[14px] text-[#2f6fe0]" />}{t.owner}</span></td>
                <td className={tdS}><StatusPill className="h-[18px] w-[78px] rounded-[5px] text-[11px]">{t.status}</StatusPill></td>
                <td className={`${tdS} text-center`}>
                  <div className="flex items-center justify-center gap-[8px]">
                    <button type="button" aria-label={`View ${t.name}`} onClick={() => notice.show(`${t.name}: ${t.steps} steps (demo).`)}><Eye strokeWidth={2.2} className="h-[15px] w-[15px]" /></button>
                    <button type="button" aria-label={`Edit ${t.name}`} onClick={() => notice.show(`${t.name}: edits are saved as a new draft version (demo).`)}><Pencil strokeWidth={2.2} className="h-[14px] w-[14px]" /></button>
                    <button type="button" aria-label={`Duplicate ${t.name}`} onClick={() => duplicate(t)}><Copy strokeWidth={2.2} className="h-[14px] w-[14px]" /></button>
                    <button type="button" aria-label={`More for ${t.name}`} onClick={() => setTemplates((ts) => ts.map((x) => (x.name === t.name ? { ...x, status: x.status === "Paused" ? "Active" : "Paused" } : x)))} title="Pause / resume"><MoreVertical strokeWidth={2.2} className="h-[15px] w-[15px]" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={8} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">No templates match these filters.</td></tr>}
          </tbody>
        </TableWrap>
      </Panel>

      <div className="grid gap-[10px] lg:h-[170px] lg:grid-cols-[875fr_470fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel
          title={<>Workflow Builder <span className="text-[14px] font-medium">– &quot;Sewa Request Processing&quot;</span></>}
          label="Workflow Builder"
          icon={Network}
          action={<PrimaryButton outline icon={Pencil} className="h-[28px] px-[10px] text-[12.5px]" onClick={() => notice.show("Workflow editor: drag steps, set SLAs and owners (demo).")}>Edit Workflow</PrimaryButton>}
          bodyClassName="flex items-center gap-[4px] overflow-x-auto pt-[4px]"
        >
          {steps.map((s, i) => (
            <Fragment key={s.title}>
              {i > 0 && <ArrowRight strokeWidth={2.2} className="h-[16px] w-[16px] shrink-0" />}
              <div style={{ background: s.bg }} className="flex h-[96px] min-w-[110px] flex-1 flex-col items-center justify-center rounded-[10px] border border-black/5 px-[4px] text-center">
                <s.icon strokeWidth={1.9} style={{ color: s.fg }} className="h-[26px] w-[26px]" />
                <b className="mt-[3px] text-[13.5px] leading-tight">{s.title}</b>
                <span className="text-[11px] font-medium leading-tight">{s.sub}</span>
              </div>
            </Fragment>
          ))}
        </Panel>

        <Panel title="Failure Handling" icon={TriangleAlert} bodyClassName="flex flex-col justify-between pt-[4px]">
          {[
            [CircleX, "#e02424", "Failed Workflows", <span key="a" className="rounded-[5px] bg-[#fde0e0] px-[10px] text-[12.5px] font-bold text-[#b42318]">14</span>],
            [CalendarDays, "#3b4256", "Last Failure", <b key="b" className="text-[12.5px]">24 Nov 2026, 10:48 AM</b>],
            [RefreshCw, "#2f6fe0", "Retry Queue", <span key="c" className="flex items-center gap-[10px]"><span className="rounded-[5px] bg-[#fde9c4] px-[10px] text-[12.5px] font-bold text-[#8a5300]">08</span><button type="button" onClick={() => notice.show("Retry queue: 08 workflows waiting (demo).")} className="flex items-center gap-[3px] text-[12.5px] font-semibold text-[#2320c4] hover:underline">View Queue <ArrowRight strokeWidth={2.2} className="h-[13px] w-[13px]" /></button></span>],
            [UserCog, "#3b4256", "Fallback (Manual Intervention)", <span key="d" className="rounded-[5px] bg-[#d4f3d2] px-[10px] text-[12.5px] font-semibold text-[#1c6b1f]">Enabled</span>],
          ].map(([I, c, l, v]) => {
            const Icon = I as LucideIcon;
            return (
              <div key={l as string} className="flex items-center gap-[10px] text-[13px] font-semibold">
                <Icon strokeWidth={2} style={{ color: c as string }} className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1">{l as string}</span>
                {v as React.ReactNode}
              </div>
            );
          })}
        </Panel>
      </div>

      <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[875fr_470fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Conditional Logic" note="(Automation Routing Rules)" icon={GitBranch} bodyClassName="grid grid-cols-1 gap-[10px] pt-[4px] sm:grid-cols-3">
          {rules.map((r, i) => (
            <div key={r.title} style={{ background: r.bg }} className="flex flex-col justify-between rounded-[10px] border border-[#e6e9f2] px-[12px] py-[8px]">
              <div className="flex gap-[10px]">
                <r.icon strokeWidth={1.9} style={{ color: r.color }} className="h-[26px] w-[26px] shrink-0" />
                <span className="leading-tight">
                  <b className="block text-[13.5px]">{r.title}</b>
                  <span className="text-[12px] font-medium">{r.sub}</span>
                </span>
              </div>
              <button type="button" aria-pressed={ruleOn[i]} onClick={() => setRuleOn(ruleOn.map((v, j) => (j === i ? !v : v)))} className={`ml-auto mt-[4px] flex h-[20px] items-center gap-[4px] rounded-full px-[9px] text-[11.5px] font-semibold ${ruleOn[i] ? "bg-[#d4f3d2] text-[#1c6b1f]" : "bg-[#e9ecf2] text-[#3b4256]"}`}>
                {ruleOn[i] ? <CircleCheck strokeWidth={2.4} className="h-[12px] w-[12px]" /> : <CirclePause strokeWidth={2.4} className="h-[12px] w-[12px]" />}
                {ruleOn[i] ? "Active" : "Paused"}
              </button>
            </div>
          ))}
        </Panel>

        <Panel title="Quick Actions" icon={Zap} bodyClassName="grid grid-cols-2 gap-[10px] pt-[4px]">
          <QuickBtn icon={CirclePlus} label="Create Template" onClick={() => notice.show("New template: trigger, steps, owner — saved as draft (demo).")} />
          <QuickBtn icon={Copy} label="Duplicate Workflow" onClick={() => duplicate(templates[0])} />
          <QuickBtn icon={CircleCheck} label="Publish Rule" onClick={() => notice.show("Rule published after review (demo).")} />
          <QuickBtn
            icon={paused ? CirclePlay : CirclePause}
            label={paused ? "Resume Automation" : "Pause Automation"}
            amber
            onClick={() => {
              if (!paused && !window.confirm("Pause all automations? Manual handling takes over.")) return;
              setPaused((p) => !p);
            }}
          />
        </Panel>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function QuickBtn({ icon: I, label, onClick, amber = false }: { icon: LucideIcon; label: string; onClick: () => void; amber?: boolean }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center justify-center gap-[10px] rounded-[9px] border-[1.5px] border-[#c9d4f5] bg-white text-[13.5px] font-semibold text-[#1d3fc4] hover:bg-[#f1f4ff]">
      <I strokeWidth={2} className={`h-[20px] w-[20px] ${amber ? "text-[#f0a020]" : ""}`} />
      {label}
    </button>
  );
}
