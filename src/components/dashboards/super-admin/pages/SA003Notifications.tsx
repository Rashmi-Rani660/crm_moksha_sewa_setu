"use client";

/**
 * SA-003 — Notification & Alert Centre.
 * Matches the reference image: 6 KPI tiles, 7 tabs, notification queue
 * table with filter bar and action row, then create notification /
 * broadcast & delivery / alert preferences panels.
 *
 * Data: GET /crm/notifications/queue (+ /summary) for people in the caller's scope; a new
 * notification is a broadcast (POST /crm/notifications/broadcasts) that is previewed and then
 * submitted for audience approval — it is only sent once someone else approves it.
 */

import { useRef, useState, type ReactNode } from "react";
import {
  Bell,
  CircleCheck,
  Layers,
  Radio,
  Users,
} from "lucide-react";
import {
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
} from "@/components/dashboards/super-admin/kit";
import { authorizedRequest } from "@/lib/api/authorized";
import { errorMessage } from "@/lib/api/client";
import { qs, useCrmQuery, useDebounced } from "@/lib/api/useCrmQuery";
import { humanize, pad2, shortDateTime } from "@/lib/format";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { useCrmAccess } from "@/lib/api/useCrmAccess";

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

/** Tab → server filter. Emergency = every critical alert, whatever its category. */
const TAB_QUERY: Record<Tab, { category?: string; priority?: string }> = {
  "All alerts": {},
  Emergency: { priority: "CRITICAL" },
  Operations: { category: "TASK" },
  Security: { category: "SECURITY" },
  Approvals: { category: "APPROVAL" },
  System: { category: "SLA" },
  Announcements: { category: "ANNOUNCEMENT" },
};

const priorityOptions = ["All priorities", "Critical", "High", "Normal"] as const;

const audienceOptions = ["Department / centre / access level", "All admins", "Selected centre"] as const;
const scheduleOptions = ["Now / scheduled", "Now", "Schedule later"] as const;
const templateOptions = ["Approved template", "Emergency alert", "Case update", "Announcement"] as const;

type QueueRow = {
  id: string;
  title: string;
  category: string;
  priority: "CRITICAL" | "HIGH" | "NORMAL";
  recipient: { name: string };
  mine: boolean;
  read: boolean;
  requiresAck: boolean;
  acknowledged: boolean;
  createdAt: string;
};
type QueueSummary = { all: number; critical: number; highOpen: number; unread: number; scheduledBroadcasts: number; failedDeliveries: number };
type Centre = { id: string; name: string };
type Broadcast = { id: string; title: string; status: string; recipients: number; sentAt?: string; createdAt: string; version: number };

const readAck = (n: QueueRow) => `${n.read ? "Read" : "Unread"} / ${n.requiresAck ? (n.acknowledged ? "Ack" : "Pending") : "—"}`;

function PanelRow({ label, value, accent }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-[10px] border-b border-[#eef0f5] pb-[5px] text-[14px] font-semibold leading-tight last:border-b-0 last:pb-0">
      <span className="shrink-0 whitespace-nowrap text-[#1a1d36]">{label}</span>
      <span className={`text-right ${accent ? "text-[#b42318]" : "text-[#1a1d36]"}`}>{value}</span>
    </div>
  );
}

function FieldBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[3px]">
      <span className="text-[15px] font-semibold text-[#3b4256]">{label}</span>
      {children}
    </div>
  );
}

function OutlineButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-[34px] shrink-0 items-center gap-[6px] rounded-[7px] border-[1.5px] border-[#2f4fe0] bg-white px-[14px] text-[15px] font-semibold text-[#1d3fc4] hover:bg-[#f1f4ff]">
      <span className="pt-px">{children}</span>
    </button>
  );
}

export default function SA003Notifications() {
  const notice = useNotice();
  const mutation = useCrmMutation(notice.show);
  const broadcastLocked = useRef(false);
  const { can } = useCrmAccess();
  const [tab, setTab] = useState<Tab>("All alerts");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<(typeof priorityOptions)[number]>("All priorities");
  const [audience, setAudience] = useState<(typeof audienceOptions)[number]>(audienceOptions[0]);
  const [subject, setSubject] = useState("");
  const [schedule, setSchedule] = useState<(typeof scheduleOptions)[number]>(scheduleOptions[0]);
  const [template, setTemplate] = useState<(typeof templateOptions)[number]>(templateOptions[0]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const search = useDebounced(query.trim());

  const tabQuery = TAB_QUERY[tab];
  const queue = useCrmQuery<QueueRow[]>(
    `/notifications/queue${qs({ limit: 50, category: tabQuery.category, priority: tabQuery.priority ?? (priority === "All priorities" ? undefined : priority.toUpperCase()), search: search || undefined })}`,
  );
  const summary = useCrmQuery<QueueSummary>("/notifications/queue/summary");
  const centres = useCrmQuery<Centre[]>(`/geography/centres${qs({ status: "ACTIVE", limit: 50 })}`);
  const broadcasts = useCrmQuery<Broadcast[]>(`/notifications/broadcasts${qs({ limit: 5 })}`);

  const rows = queue.data ?? [];
  const empty = rows.length === 0;
  const selected = rows.find((r) => r.id === selectedId);
  const s = summary.data;

  const refresh = () => {
    queue.reload();
    summary.reload();
    broadcasts.reload();
  };

  async function acknowledge() {
    if (mutation.busy) return;
    const target = selected ?? rows.find((r) => r.mine && r.requiresAck && !r.acknowledged);
    if (!target) return notice.show("Select one of your own notifications to acknowledge.");
    if (!target.mine) return notice.show("Only the recipient can acknowledge a notification.");
    try {
      await mutation.run(`/notifications/${target.id}/acknowledge`, { method: "POST" }, "Acknowledged.");
      refresh();
    } catch (err) {
      notice.show(errorMessage(err));
    }
  }

  /** Builds the audience of the "Create notification" form. */
  function audienceFor(): { accessLevels: string[]; centreIds: string[] } | undefined {
    const centreIds = (centres.data ?? []).map((c) => c.id);
    if (audience === "All admins") return { accessLevels: ["ADMIN"], centreIds: [] };
    if (audience === "Selected centre") {
      const available = centres.data ?? [];
      const selected = window.prompt('Choose centre:\n' + available.map((centre,i) => (i + 1) + '. ' + centre.name).join('\n'));
      if (!selected) return;
      const centre = available[Number(selected) - 1];
      return centre ? { accessLevels: [],centreIds: [centre.id] } : undefined;
    }
    return { accessLevels: ["USER"], centreIds };
  }

  async function previewAndSubmit() {
    if (broadcastLocked.current || mutation.busy || !can("notifications.create")) return;
    const title = subject.trim();
    if (title.length < 3) return notice.show("Enter a subject (at least 3 characters).");
    let scheduledAt: string | undefined;
    if (schedule === "Schedule later") {
      const when = window.prompt("Send at (YYYY-MM-DD HH:MM, IST):")?.trim();
      if (!when) return;
      const parsed = new Date(`${when.replace(" ", "T")}:00+05:30`);
      if (Number.isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) return notice.show("Enter a future date and time as YYYY-MM-DD HH:MM.");
      scheduledAt = parsed.toISOString();
    }
    const critical = template === "Emergency alert";
    broadcastLocked.current = true;
    try {
      const aud = audienceFor();
      if (!aud) return;
      const message = window.prompt("Notification message:", title)?.trim();
      if (!message) return;
      const preview = await authorizedRequest<{ recipients: number }>("/notifications/broadcasts/preview", { body: { audience: { ...aud, departmentIds: [], roleIds: [] } } });
      if (!window.confirm(`Send "${title}" to ${preview.data.recipients} user(s)? It goes to approval first.`)) return;
      const reason = window.prompt("Reason for this notification (required for the approver):")?.trim();
      if (!reason) return;
      if (reason.length < 5) return notice.show("Enter a reason of at least 5 characters.");
      const draft = await mutation.run<Broadcast>("/notifications/broadcasts", {
        body: { title, message, priority: critical ? "CRITICAL" : "NORMAL", requiresAck: critical, audience: { ...aud, departmentIds: [], roleIds: [] }, ...(scheduledAt && { scheduledAt }) },
      });
      if (!draft) return;
      const submitted = await mutation.run(`/notifications/broadcasts/${draft.id}/submit`, { body: { version: draft.version, reason } }, `"${title}" sent for audience approval (${preview.data.recipients} recipient(s)).`);
      if (submitted === undefined) return;
      setSubject("");
      refresh();
    } catch (err) {
      notice.show(errorMessage(err));
    } finally { broadcastLocked.current = false; }
  }

  return (
    <SuperAdminFrame active="notification-alerts">
      <PageHead light icon={Radio} iconTone="blue" title="Notification & Alert Centre" links={["Super Admin", "FY 2026–27", "Ghaziabad"]}>
        <ModuleDropdown current="SA-003" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value={pad2(s?.all)} label="All alerts" sub="Last 30 days" />
        <KpiTile tone="red" icon={Bell} value={pad2(s?.critical)} label="Critical" sub="Immediate" />
        <KpiTile tone="orange" icon={CircleCheck} value={pad2(s?.highOpen)} label="High priority" sub="Open" />
        <KpiTile tone="purple" icon={Users} value={pad2(s?.unread)} label="Unread" sub="Review" />
        <KpiTile tone="sky" icon={Layers} value={pad2(s?.scheduledBroadcasts)} label="Scheduled" sub="Upcoming" />
        <KpiTile tone="red" icon={Radio} value={pad2(s?.failedDeliveries)} label="Failed delivery" sub="Retry" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
      <Panel title="Notification queue" className="lg:min-h-0 lg:flex-[330_1_0]" bodyClassName="flex flex-col gap-[8px] pt-[4px]">
        <div className="flex items-center gap-[8px]">
          <SearchField value={query} onChange={setQuery} placeholder="Search by subject..." className="min-w-0 flex-1" />
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
            ].map((h) => (
              <th key={h} className={th}>{h}</th>
            ))}
          </Thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} onClick={() => setSelectedId(a.id)} className={`cursor-pointer border-b border-[#eef0f5] last:border-0 even:bg-[#f7f9fd] hover:bg-[#eef2ff] ${selectedId === a.id ? "ring-1 ring-inset ring-[#1d4fe0]/30" : ""}`}>
                <td className={td}>{shortDateTime(a.createdAt)}</td>
                <td className={td}>{a.title}</td>
                <td className={td}>{humanize(a.category)}</td>
                <td className={td}>{a.priority === "NORMAL" ? (
                    <span className="font-semibold">Normal</span>
                  ) : (
                    <Pill tone={a.priority === "CRITICAL" ? "red" : "amber"} className="w-[56px] text-[15px] font-bold">{humanize(a.priority)}</Pill>
                  )}
                </td>
                <td className={td}>{a.mine ? `${a.recipient.name} (me)` : a.recipient.name}</td>
                <td className={td}>{readAck(a)}</td>
                <td className={td}>
                  <Pill tone="green" className="h-[18px] min-w-[64px] text-[15px] font-bold">Delivered</Pill>
                </td>
                <td className={td}>{a.mine && a.requiresAck && !a.acknowledged ? "Acknowledge" : "Review"}</td>
              </tr>
            ))}
            {empty && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-[15px] font-medium text-[#5b6280]">
                  {queue.loading ? "Loading…" : queue.error ?? "No notifications match the selected tab and filters."}
                </td>
              </tr>
            )}
          </tbody>
        </TableWrap>
        <div className="mt-auto flex flex-wrap items-center gap-[8px] pt-[6px]">
          <PrimaryButton disabled={mutation.busy} onClick={acknowledge}>
            Acknowledge
          </PrimaryButton>
          <OutlineButton onClick={() => notice.show("Notifications go to the owner of the request, case or task they belong to; reassign that record to change who is notified.")}>
            Assign owner
          </OutlineButton>
          <OutlineButton onClick={() => notice.show("Overdue items escalate automatically along the SLA chain (SA-020).")}>
            Escalate
          </OutlineButton>
          <OutlineButton onClick={() => { setTab("All alerts"); setPriority("All priorities"); setQuery(""); }}>
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
                maxLength={160}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                className="h-[34px] w-full rounded-[8px] border border-[#d6dbe6] bg-white px-[10px] text-[15px] font-medium outline-none placeholder:text-[#4a5070] focus:border-[#5b6fe0]"
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
            <PrimaryButton disabled={mutation.busy || !can("notifications.create")} onClick={previewAndSubmit}>
              Preview &amp; approve
            </PrimaryButton>
          </div>
        </Panel>

        <Panel title="Broadcast & delivery" bodyClassName="flex flex-col gap-[6px] pt-[4px]">
          <PanelRow label="Channels" value="In-app (SMS / WhatsApp with Communication Hub)" />
          <PanelRow label="Latest broadcast" value={broadcasts.data?.[0] ? `${broadcasts.data[0].title} • ${humanize(broadcasts.data[0].status)}` : "—"} />
          <PanelRow label="Recipient selection" value="Authorised audience only" />
          <div className="mt-auto flex flex-wrap gap-[8px] pt-[6px]">
            <PrimaryButton onClick={() => notice.show((broadcasts.data ?? []).map((b) => `${b.title}: ${humanize(b.status)}${b.status === "SENT" ? ` to ${b.recipients}` : ""}`).join(" · ") || "No broadcasts yet.")}>
              Delivery history
            </PrimaryButton>
            <OutlineButton onClick={() => notice.show("In-app delivery is immediate; there is nothing to retry.")}>
              Retry failed
            </OutlineButton>
          </div>
        </Panel>

        <Panel title="Alert preferences" bodyClassName="flex flex-col gap-[6px] pt-[4px]">
          <PanelRow label="Emergency / security" value={<span>Mandatory • <b className="text-[#1c6b1f]">locked</b></span>} />
          <PanelRow label="Case & task updates" value="Enabled" />
          <PanelRow label="Critical alerts" value="Acknowledgement required" />
          <PanelRow label="Escalation" value="Based on SLA" />
          <div className="mt-auto pt-[4px]">
            <PrimaryButton onClick={() => notice.show("Escalation timings are configured in SLA & Escalation (SA-020).")}>
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
