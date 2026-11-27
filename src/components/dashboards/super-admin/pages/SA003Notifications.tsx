"use client";

/**
 * SA-003 — Notification & Alert Centre.
 * Matches the reference image: 6 KPI tiles, 7 tabs, notification queue
 * table with filter bar and action row, then create notification /
 * broadcast & delivery / alert preferences panels. Demo data only.
 */

import { useState, type ReactNode } from "react";
import {
  Bell,
  CircleCheck,
  Layers,
  Radio,
  Users,
} from "lucide-react";
import {
  CentreDropdown,
  Dropdown,
  KpiRow,
  KpiTile,
  ModuleDropdown,
  PageHead,
  Panel,
  Pill,
  PrimaryButton,
  SearchField,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  td,
  th,
  useNotice,
  type PillTone,
} from "@/components/dashboards/super-admin/kit";

type Tab = (typeof tabs)[number];
const tabs = [
  "All alerts",
  "Emergency",
  "Operations",
  "Security",
  "Approvals",
  "System",
  "Announcements",
] as const;

const tabFilter: Partial<Record<Tab, string[]>> = {
  Emergency: ["Emergency"],
  Operations: ["Learning"],
  Security: ["Security"],
  Approvals: ["Approval"],
  System: ["System"],
  Announcements: ["Announcement"],
};

const priorityOptions = ["All priorities", "Critical", "High", "Normal"] as const;

const audienceOptions = ["Department / centre / access level", "All admins", "Selected centre"] as const;
const scheduleOptions = ["Now / scheduled", "Now", "Schedule later"] as const;
const templateOptions = ["Approved template", "Emergency alert", "Case update", "Announcement"] as const;

type Alert = {
  id: string;
  subject: string;
  category: string;
  priority: "Critical" | "High" | "Normal";
  assigned: string;
  readAck: string;
  delivery: "Delivered" | "Failed";
  action: "Review" | "Retry";
};
const alerts: Alert[] = [
  { id: "ALT-001", subject: "Emergency case MS-26-1100", category: "Emergency", priority: "Critical", assigned: "Admin 01", readAck: "Unread / Pending", delivery: "Delivered", action: "Review" },
  { id: "ALT-002", subject: "WhatsApp sync delayed", category: "System", priority: "High", assigned: "Admin 02", readAck: "Read / Pending", delivery: "Delivered", action: "Review" },
  { id: "ALT-003", subject: "Expense approval due", category: "Approval", priority: "High", assigned: "Admin 03", readAck: "Read / Ack", delivery: "Delivered", action: "Review" },
  { id: "ALT-004", subject: "Backup completed", category: "System", priority: "Normal", assigned: "Admin 02", readAck: "Read / Ack", delivery: "Delivered", action: "Review" },
  { id: "ALT-005", subject: "Training reminder", category: "Learning", priority: "Normal", assigned: "Admin 04", readAck: "Unread / —", delivery: "Failed", action: "Retry" },
];

const categoryBadgeTone = (category: string): PillTone => {
  switch (category) {
    case "Emergency": return "red";
    case "Approval": return "purple";
    case "Learning": return "blue";
    case "System": return "gray";
    default: return "gray";
  }
};

function PanelRow({ label, value, accent }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-[10px] border-b border-[#eef0f5] pb-[5px] text-[12px] font-semibold leading-tight last:border-b-0 last:pb-0">
      <span className="shrink-0 whitespace-nowrap text-[#1a1d36]">{label}</span>
      <span className={`text-right ${accent ? "text-[#b42318]" : "text-[#1a1d36]"}`}>{value}</span>
    </div>
  );
}

function FieldBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[3px]">
      <span className="text-[11px] font-semibold text-[#3b4256]">{label}</span>
      {children}
    </div>
  );
}

function OutlineButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-[34px] shrink-0 items-center gap-[6px] rounded-[7px] border-[1.5px] border-[#2f4fe0] bg-white px-[14px] text-[13px] font-semibold text-[#1d3fc4] hover:bg-[#f1f4ff]">
      <span className="pt-px">{children}</span>
    </button>
  );
}

export default function SA003Notifications() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("All alerts");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<(typeof priorityOptions)[number]>("All priorities");
  const [audience, setAudience] = useState<(typeof audienceOptions)[number]>(audienceOptions[0]);
  const [subject, setSubject] = useState("");
  const [schedule, setSchedule] = useState<(typeof scheduleOptions)[number]>(scheduleOptions[0]);
  const [template, setTemplate] = useState<(typeof templateOptions)[number]>(templateOptions[0]);

  const q = query.trim().toLowerCase();
  const cats = tabFilter[tab];
  const rows = alerts.filter(
    (a) =>
      (!cats || cats.includes(a.category)) &&
      (priority === "All priorities" || a.priority === priority) &&
      (!q || `${a.id} ${a.subject} ${a.category} ${a.assigned}`.toLowerCase().includes(q)),
  );
  const empty = rows.length === 0;

  return (
    <SuperAdminFrame active="notification-alerts">
      <PageHead light icon={Radio} iconTone="blue" title="Notification & Alert Centre" links={["Super Admin", "FY 2026–27", "Ghaziabad"]}>
        <ModuleDropdown current="SA-003" />
        <CentreDropdown className="w-[165px]" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="37" label="All alerts" sub="Selected period" />
        <KpiTile tone="red" icon={Bell} value="03" label="Critical" sub="Immediate" />
        <KpiTile tone="orange" icon={CircleCheck} value="07" label="High priority" sub="Open" />
        <KpiTile tone="purple" icon={Users} value="14" label="Unread" sub="Review" />
        <KpiTile tone="sky" icon={Layers} value="06" label="Scheduled" sub="Upcoming" />
        <KpiTile tone="red" icon={Radio} value="02" label="Failed delivery" sub="Retry" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
      <Panel title="Notification queue" className="lg:min-h-0 lg:flex-[330_1_0]" bodyClassName="flex flex-col gap-[8px] pt-[4px]">
        <div className="flex items-center gap-[8px]">
          <SearchField value={query} onChange={setQuery} placeholder="Filter visible rows..." className="min-w-0 flex-1" />
          <Dropdown label="Priority" value={priority} options={priorityOptions} onChange={setPriority} className="w-[140px]" />
        </div>
        <TableWrap className="min-h-0 flex-1 overflow-auto">
          <Thead>
            {[
              "Alert ID",
              "Subject",
              "Category",
              "Priority",
              "Assigned to",
              "Read / Ack",
              "Delivery",
              "Action",
            ].map((h, i) => (
              <th key={h} className={`${th} ${[3, 4, 5, 6, 7].includes(i) ? "text-center" : ""}`}>{h}</th>
            ))}
          </Thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b border-[#eef0f5] last:border-0 even:bg-[#f7f9fd] hover:bg-[#eef2ff]">
                <td className={td}>{a.id}</td>
                <td className={`${td} min-w-0`}>{a.subject}</td>
                <td className={`${td} text-center`}>
                  <Pill tone={categoryBadgeTone(a.category)} className="w-[88px] text-[11px]">{a.category}</Pill>
                </td>
                <td className={`${td} text-center`}>
                  {a.priority === "Normal" ? (
                    <span className="font-semibold">{a.priority}</span>
                  ) : (
                    <Pill tone={a.priority === "Critical" ? "red" : "amber"} className="w-[56px] text-[11px] font-bold">{a.priority}</Pill>
                  )}
                </td>
                <td className={td}>{a.assigned}</td>
                <td className={`${td} text-center`}>
                  {a.readAck.includes("Pending") ? (
                    <Pill tone="amber" className="w-[108px] text-[11px]">{a.readAck}</Pill>
                  ) : (
                    <span className="font-semibold">{a.readAck}</span>
                  )}
                </td>
                <td className={`${td} text-center`}>
                  <Pill tone={a.delivery === "Delivered" ? "green" : "red"} className="w-[74px] text-[11px] font-bold">{a.delivery}</Pill>
                </td>
                <td className={`${td} text-center`}>
                  <button
                    type="button"
                    onClick={() => notice.show(`${a.id}: ${a.action} ${a.action === "Retry" ? "delivery retry requested" : "details opened"} (demo).`)}
                    className="font-semibold text-[#2320c4] hover:underline"
                  >
                    {a.action}
                  </button>
                </td>
              </tr>
            ))}
            {empty && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">
                  No notifications match the selected tab and filters.
                </td>
              </tr>
            )}
          </tbody>
        </TableWrap>
        <div className="mt-auto flex flex-wrap items-center gap-[8px] pt-[6px]">
          <PrimaryButton onClick={() => notice.show(`${rows.length} alert(s) acknowledged (demo).`)}>
            Acknowledge
          </PrimaryButton>
          <OutlineButton onClick={() => notice.show("Assign owner opened (demo).")}>
            Assign owner
          </OutlineButton>
          <OutlineButton onClick={() => notice.show("Escalation raised (demo).")}>
            Escalate
          </OutlineButton>
          <OutlineButton onClick={() => notice.show("View history opened (demo).")}>
            View history
          </OutlineButton>
        </div>
      </Panel>

      <div className="grid gap-[10px] sm:grid-cols-2 lg:min-h-0 lg:flex-[245_1_0] lg:[grid-template-rows:minmax(0,1fr)] lg:grid-cols-3">
        <Panel title="Create notification" bodyClassName="flex flex-col gap-[6px] pt-[4px]">
          <div className="grid grid-cols-2 gap-[6px]">
            <FieldBlock label="Audience">
              <Dropdown label="Audience" value={audience} options={audienceOptions} onChange={setAudience} className="w-full" size={12} />
            </FieldBlock>
            <FieldBlock label="Subject">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                className="h-[34px] w-full rounded-[8px] border border-[#d6dbe6] bg-white px-[10px] text-[13px] font-medium outline-none placeholder:text-[#4a5070] focus:border-[#5b6fe0]"
              />
            </FieldBlock>
            <FieldBlock label="Schedule">
              <Dropdown label="Schedule" value={schedule} options={scheduleOptions} onChange={setSchedule} className="w-full" size={12} />
            </FieldBlock>
            <FieldBlock label="Template">
              <Dropdown label="Template" value={template} options={templateOptions} onChange={setTemplate} className="w-full" size={12} />
            </FieldBlock>
          </div>
          <div className="mt-auto pt-[4px]">
            <PrimaryButton onClick={() => notice.show("Notification preview and audience approval requested (demo).")}>
              Preview &amp; approve
            </PrimaryButton>
          </div>
        </Panel>

        <Panel title="Broadcast & delivery" bodyClassName="flex flex-col gap-[6px] pt-[4px]">
          <PanelRow label="Channels" value="Email / WhatsApp / outbound SMS / in-app" />
          <PanelRow label="Failed delivery" value={<span className="text-[#b42318]">02 • retry queue</span>} />
          <PanelRow label="Recipient selection" value="Authorised audience only" />
          <div className="mt-auto flex flex-wrap gap-[8px] pt-[6px]">
            <PrimaryButton onClick={() => notice.show("Delivery history opened (demo).")}>
              Delivery history
            </PrimaryButton>
            <OutlineButton onClick={() => notice.show("Retry failed triggered (demo).")}>
              Retry failed
            </OutlineButton>
          </div>
        </Panel>

        <Panel title="Alert preferences" bodyClassName="flex flex-col gap-[6px] pt-[4px]">
          <PanelRow label="Emergency / security" value={<span>Mandatory • <b className="text-[#1c6b1f]">locked</b></span>} />
          <PanelRow label="Case & task updates" value="Enabled" />
          <PanelRow label="Daily summary" value="Scheduled" />
          <PanelRow label="Escalation" value="Based on SLA" />
          <div className="mt-auto pt-[4px]">
            <PrimaryButton onClick={() => notice.show("Configure rules opened (demo).")}>
              Configure rules
            </PrimaryButton>
          </div>
        </Panel>
      </div>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}
