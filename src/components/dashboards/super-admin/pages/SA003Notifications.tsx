"use client";

/**
 * SA-003 — Notification & Alert Centre.
 * Notes (design brief 03): read and acknowledgement are separate states;
 * record recipient, owner, escalation, delivery, retries and audit; critical
 * alerts cannot be disabled; broadcasts need a preview and audience approval;
 * SMS is outgoing only.
 */

import { useState } from "react";
import {
  Bell,
  CalendarCheck,
  CircleCheck,
  FileText,
  HandCoins,
  IndianRupee,
  Megaphone,
  MoreVertical,
  Send,
  Settings,
  TriangleAlert,
  UserPlus,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/dashboards/ui";
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
  Toggle,
  ViewLink,
  td,
  th,
  useNotice,
  type PillTone,
} from "@/components/dashboards/super-admin/kit";

type Category = "Emergency" | "Case Update" | "Team" | "Donation" | "System";

const categories: { label: string; icon: LucideIcon; color: string; count: string; match?: Category[]; red?: boolean }[] = [
  { label: "All Alerts", icon: Bell, color: "#1d4fe0", count: "37" },
  { label: "Emergency / Critical", icon: TriangleAlert, color: "#e02424", count: "03", match: ["Emergency"], red: true },
  { label: "Case & Sewa Updates", icon: HandCoins, color: "#f0a020", count: "10", match: ["Case Update"] },
  { label: "Task & Assignment", icon: FileText, color: "#2f6fe0", count: "08", match: [] },
  { label: "Approvals & Requests", icon: CircleCheck, color: "#1f9a2b", count: "04", match: [] },
  { label: "Team & Operations", icon: UserPlus, color: "#7a3fe0", count: "05", match: ["Team"] },
  { label: "Finance & Donations", icon: IndianRupee, color: "#f0a020", count: "02", match: ["Donation"] },
  { label: "System & Technical", icon: Settings, color: "#2f6fe0", count: "02", match: ["System"] },
  { label: "Announcements", icon: Megaphone, color: "#f0a020", count: "03", match: [] },
];

type Alert = { id: string; icon: LucideIcon; color: string; subject: string; bold?: string; detail: string; category: Category; priority: string; received: string; status: string };
const alerts: Alert[] = [
  { id: "ALT-02671", icon: TriangleAlert, color: "#e02424", bold: "Emergency:", subject: "Body at Ghaziabad Hospital", detail: "Immediate field team deployment required.", category: "Emergency", priority: "High", received: "24 Nov, 10:24 AM", status: "Open" },
  { id: "ALT-02666", icon: FileText, color: "#2f6fe0", subject: "Sewa Request Verified – SR-02666", detail: "Case is verified and assigned to Field Team-02.", category: "Case Update", priority: "Medium", received: "24 Nov, 09:56 AM", status: "In Progress" },
  { id: "ALT-02659", icon: UsersRound, color: "#2f6fe0", subject: "Volunteer Onboarded – VOL-0034", detail: "New volunteer joined (Ghaziabad Centre).", category: "Team", priority: "Normal", received: "24 Nov, 09:30 AM", status: "Completed" },
  { id: "ALT-02654", icon: IndianRupee, color: "#f0a020", subject: "Donation Received – ₹ 25,000", detail: "Online donation (REF: DON-1145) – to be acknowledged.", category: "Donation", priority: "Normal", received: "24 Nov, 08:58 AM", status: "Open" },
  { id: "ALT-02651", icon: Settings, color: "#2f6fe0", subject: "System Backup Completed", detail: "Daily backup completed successfully (100%).", category: "System", priority: "Normal", received: "24 Nov, 02:00 AM", status: "Completed" },
];

const categoryTone: Record<Category, PillTone> = { Emergency: "red", "Case Update": "blue", Team: "purple", Donation: "amber", System: "blue" };

const priorities = ["All Priority", "High", "Medium", "Normal"] as const;
const statuses = ["All Status", "Open", "In Progress", "Completed"] as const;
const ranges = ["Last 7 Days", "Today", "Last 30 Days"] as const;

export default function SA003Notifications() {
  const notice = useNotice();
  const [cat, setCat] = useState(0);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("All Priority");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All Status");
  const [range, setRange] = useState<(typeof ranges)[number]>("Last 7 Days");
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set());
  const [channels, setChannels] = useState({ whatsapp: false, email: true, sms: false, inapp: false });
  const [settings, setSettings] = useState({ cases: true, approvals: true, summary: true });

  const q = query.trim().toLowerCase();
  const match = categories[cat].match;
  const rows = alerts.filter(
    (a) =>
      (!match || match.includes(a.category)) &&
      (priority === "All Priority" || a.priority === priority) &&
      (status === "All Status" || a.status === status) &&
      (!q || `${a.id} ${a.subject} ${a.detail}`.toLowerCase().includes(q)),
  );
  const allPicked = rows.length > 0 && rows.every((r) => picked.has(r.id));
  const toggle = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <SuperAdminFrame active="notification-alerts">
      <PageHead
        icon={Bell}
        iconTone="orange"
        title="Notification & Alert Centre"
        links={["Real-time Alerts", "System Notifications", "Announcements", "Team Updates", "Communication Triggers"]}
      >
        <DateChip className="w-[200px]" />
        <CentreDropdown className="w-[180px]" />
        <PrimaryButton icon={UserPlus} onClick={() => notice.show("New notification: choose audience, then preview before sending (demo).")}>
          Create Notification
        </PrimaryButton>
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="red" icon={TriangleAlert} value="03" label="Critical Alerts" badge={{ text: "Immediate Action", tone: "solidRed" }} />
        <KpiTile tone="orange" icon={Bell} value="07" label="High Priority" badge={{ text: "Action Required", tone: "yellow" }} />
        <KpiTile tone="blue" icon={Bell} value="14" label="General Notifications" badge={{ text: "For Information", tone: "blue" }} />
        <KpiTile tone="green" icon={Megaphone} value="05" label="Announcements" badge={{ text: "Active", tone: "green" }} />
        <KpiTile tone="purple" icon={CalendarCheck} value="06" label="Scheduled Alerts" badge={{ text: "Upcoming", tone: "purple" }} />
        <KpiTile tone="sky" icon={Settings} value="02" label="System Alerts" badge={{ text: "Operational", tone: "blue" }} />
      </KpiRow>

      <div className="grid gap-[10px] lg:h-[400px] lg:grid-cols-[232fr_937fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Alert Categories" titleSize={17} bodyClassName="flex flex-col gap-[2px] pt-[8px]">
          {categories.map((c, i) => (
            <button
              key={c.label}
              type="button"
              aria-pressed={cat === i}
              onClick={() => setCat(i)}
              className={`flex min-h-[34px] flex-1 items-center gap-[10px] rounded-[8px] px-[8px] text-left text-[13.5px] font-semibold ${cat === i ? "bg-[#e7efff]" : "hover:bg-[#f4f6fc]"}`}
            >
              <c.icon strokeWidth={2} style={{ color: c.color }} className="h-[20px] w-[20px] shrink-0" />
              <span className="flex-1">{c.label}</span>
              <Pill tone={c.red ? "solidRed" : i === 0 ? "solidBlue" : "gray"} className="w-[34px] text-[12px] font-bold">
                {c.count}
              </Pill>
            </button>
          ))}
        </Panel>

        <Panel
          title={`Recent Notifications & Alerts (${match ? rows.length : 37})`}
          titleSize={17}
          action={
            <div className="hidden items-center gap-[8px] lg:flex">
              <SearchField value={query} onChange={setQuery} placeholder="Search by Alert ID, Case ID, Subject..." className="w-[230px]" />
              <Dropdown label="Priority" value={priority} options={priorities} onChange={setPriority} className="w-[112px]" />
              <Dropdown label="Status" value={status} options={statuses} onChange={setStatus} className="w-[112px]" />
              <Dropdown label="Period" value={range} options={ranges} onChange={setRange} className="w-[112px]" />
            </div>
          }
          bodyClassName="flex flex-col pt-[8px]"
        >
          <div className="mb-2 flex flex-wrap gap-2 lg:hidden">
            <SearchField value={query} onChange={setQuery} placeholder="Search by Alert ID, Case ID, Subject..." className="w-full" />
            <Dropdown label="Priority" value={priority} options={priorities} onChange={setPriority} className="w-[120px]" />
            <Dropdown label="Status" value={status} options={statuses} onChange={setStatus} className="w-[120px]" />
            <Dropdown label="Period" value={range} options={ranges} onChange={setRange} className="w-[120px]" />
          </div>
          <TableWrap>
            <Thead>
              <th className={`${th} w-[30px]`}>
                <Checkbox
                  checked={allPicked}
                  label=""
                  onChange={(v) => setPicked(v ? new Set(rows.map((r) => r.id)) : new Set())}
                />
              </th>
              {["Alert ID", "Subject / Message", "Category", "Priority", "Received On", "Status", "Action"].map((h) => (
                <th key={h} className={`${th} ${["Category", "Priority", "Status", "Action"].includes(h) ? "text-center" : ""}`}>{h}</th>
              ))}
            </Thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b border-[#eef0f5]">
                  <td className={td}><Checkbox checked={picked.has(a.id)} onChange={() => toggle(a.id)} label="" /></td>
                  <td className={`${td} font-semibold`}>{a.id}</td>
                  <td className={`${td} py-[7px]`}>
                    <div className="flex items-center gap-[10px]">
                      <a.icon strokeWidth={2} style={{ color: a.color }} className="h-[22px] w-[22px] shrink-0" />
                      <div className="leading-tight">
                        <p className="text-[13px] font-bold">{a.bold && <span>{a.bold} </span>}<span className={a.bold ? "font-semibold" : ""}>{a.subject}</span></p>
                        <p className="text-[11.8px] font-medium text-[#3b4256]">{a.detail}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`${td} text-center`}><Pill tone={categoryTone[a.category]} className="w-[90px]">{a.category}</Pill></td>
                  <td className={`${td} text-center`}><StatusPill className="w-[64px]">{a.priority}</StatusPill></td>
                  <td className={td}>{a.received}</td>
                  <td className={`${td} text-center`}>
                    <Pill tone={a.status === "Open" ? "red" : a.status === "In Progress" ? "green" : "gray"} className="w-[84px]">{a.status}</Pill>
                  </td>
                  <td className={`${td} text-center`}>
                    <div className="flex items-center justify-center gap-[6px]">
                      <button type="button" onClick={() => notice.show(`${a.id}: delivery, acknowledgement and retries shown in View (demo).`)} className="h-[26px] rounded-[7px] border-[1.5px] border-[#2f4fe0] px-[14px] text-[12.5px] font-semibold text-[#1d3fc4] hover:bg-[#f1f4ff]">
                        View
                      </button>
                      <button type="button" aria-label={`More actions for ${a.id}`} onClick={() => notice.show(`${a.id}: acknowledge / escalate / assign owner (demo).`)} className="rounded p-[2px] hover:bg-[#f1f4fb]">
                        <MoreVertical strokeWidth={2.2} className="h-[16px] w-[16px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">No alerts match these filters.</td>
                </tr>
              )}
            </tbody>
          </TableWrap>
          <p className="mt-auto pt-[8px] text-[12px] font-medium text-[#3b4256]">Delivery, acknowledgement, escalation and retry details are available in View.</p>
        </Panel>
      </div>

      <div className="grid gap-[10px] lg:h-[178px] lg:grid-cols-[405fr_380fr_370fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Create New Notification" icon={CalendarCheck} titleSize={16.5} bodyClassName="grid grid-cols-2 gap-[10px] sm:grid-cols-4">
          {[
            [Users, "Team Alert", "#2f6fe0"],
            [Megaphone, "Announcement", "#f0a020"],
            [CalendarCheck, "Reminder", "#7a3fe0"],
            [Settings, "System Alert", "#2f6fe0"],
          ].map(([Icon, l, c]) => {
            const I = Icon as LucideIcon;
            return (
              <button key={l as string} type="button" onClick={() => notice.show(`${l}: compose, choose audience and preview (demo).`)} className="flex min-h-[90px] flex-col items-center justify-center gap-[8px] rounded-[10px] border border-[#e1e5ee] bg-white shadow-[0_2px_6px_rgba(30,50,110,0.08)] hover:bg-[#f7f9ff]">
                <I strokeWidth={1.9} style={{ color: c as string }} className="h-[30px] w-[30px]" />
                <span className="text-[13.5px] font-semibold">{l as string}</span>
              </button>
            );
          })}
        </Panel>

        <Panel title="Quick Broadcast" icon={Send} titleSize={16.5} bodyClassName="flex items-center gap-[16px]">
          <div className="flex flex-col gap-[9px] rounded-[10px] border border-[#e1e5ee] px-[12px] py-[10px]">
            <Checkbox checked={channels.whatsapp} onChange={(v) => setChannels({ ...channels, whatsapp: v })} label={<span className="flex items-center gap-[6px]"><WhatsAppIcon size={16} />WhatsApp Message</span>} />
            <Checkbox checked={channels.email} onChange={(v) => setChannels({ ...channels, email: v })} label={<span className="flex items-center gap-[6px]"><Bell strokeWidth={2} className="h-[15px] w-[15px] text-[#2f6fe0]" />Email Notification</span>} />
            <Checkbox checked={channels.sms} onChange={(v) => setChannels({ ...channels, sms: v })} label={<span className="flex items-center gap-[6px]"><span className="rounded bg-[#f0a020] px-[3px] text-[9px] font-bold text-white">SMS</span>Outgoing SMS</span>} />
            <Checkbox checked={channels.inapp} onChange={(v) => setChannels({ ...channels, inapp: v })} label={<span className="flex items-center gap-[6px]"><Bell strokeWidth={2} className="h-[15px] w-[15px] text-[#f0a020]" />In-App Notification</span>} />
          </div>
          <PrimaryButton
            icon={Send}
            className="h-[38px] px-[18px]"
            onClick={() => {
              const n = Object.values(channels).filter(Boolean).length;
              if (!n) return notice.show("Choose at least one channel.");
              if (window.confirm(`Preview and send this broadcast on ${n} channel(s)? Audience approval is required.`)) notice.show("Broadcast sent for audience approval (demo).");
            }}
          >
            Send Broadcast
          </PrimaryButton>
        </Panel>

        <Panel title="Notification Settings" icon={Settings} titleSize={16.5} action={<ViewLink to="System Settings" />} bodyClassName="flex flex-col justify-between">
          <SettingRow label="Emergency Alerts (24×7)" locked />
          <SettingRow label="Case & Task Updates" value={settings.cases} onChange={(v) => setSettings({ ...settings, cases: v })} />
          <SettingRow label="Approval Notifications" value={settings.approvals} onChange={(v) => setSettings({ ...settings, approvals: v })} />
          <SettingRow label="Daily Summary Report" value={settings.summary} onChange={(v) => setSettings({ ...settings, summary: v })} />
          <SettingRow label="System & Backup Alerts" locked />
        </Panel>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function SettingRow({ label, value, onChange, locked = false }: { label: string; value?: boolean; onChange?: (v: boolean) => void; locked?: boolean }) {
  return (
    <div className="flex items-center gap-[10px] text-[13.5px] font-semibold">
      <Checkbox checked={locked || !!value} disabled={locked} onChange={onChange} label={label} className="flex-1" />
      {locked ? (
        <Pill tone="green" className="h-[18px] text-[11px]" >Locked</Pill>
      ) : (
        <Toggle checked={!!value} onChange={(v) => onChange?.(v)} label={label} />
      )}
    </div>
  );
}
