"use client";

import { useRouter } from "next/navigation";

/**
 * SA-004 — Central Approval Centre.
 * Rebuild matched to the SA-004 reference design: 6 KPI tiles, 6 tabs, the
 * approval queue table and a 3-panel footer (selected approval, workflow,
 * controls). Maker–checker, independent approval and separation of duties are
 * enforced on the server; no self-approval; every decision needs a reason and
 * is audited and notified.
 *
 * Data: GET /crm/approvals, /crm/approvals/summary; decisions: POST /crm/approvals/:id/decision.
 */

import { useState } from "react";
import {
  Bell,
  CircleCheck,
  Layers,
  Radio,
  Users,
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
import { errorMessage } from "@/lib/api/client";
import { qs, useCrmQuery } from "@/lib/api/useCrmQuery";
import { humanize, pad2, shortDateTime } from "@/lib/format";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { entityHref } from "@/lib/crm/navigation";

const tabs = ["All", "Sewa & legal", "Expenses", "Donations", "Procurement", "User access"] as const;
type Tab = (typeof tabs)[number];

/** Approval types shown under each tab (finance and procurement approvals arrive with Phase 4). */
const TAB_TYPES: Record<Exclude<Tab, "All">, string[]> = {
  "Sewa & legal": ["CASE_CLOSURE", "CASE_REOPEN", "CITY_ACTIVATION", "NOTIFICATION_BROADCAST"],
  Expenses: ["TRIP_COST"],
  Donations: [],
  Procurement: ["VEHICLE_DISPATCH", "MATERIAL_REQUEST", "PURCHASE_REQUEST", "STOCK_AUDIT"],
  "User access": ["USER_ACTIVATION", "USER_ACCESS_CHANGE", "USER_REACTIVATION", "LEAVE_REQUEST"],
};

const LEVEL_LABEL: Record<string, string> = { SUPER_ADMIN: "Super Admin", ADMIN: "Admin", USER: "User" };

type Approval = {
  id: string;
  approvalNo: string;
  type: string;
  entityType: string;
  entityId: string;
  entityLabel: string;
  summary: string;
  risk: string;
  requiredLevel: string;
  requestedBy: { name: string };
  requestReason: string;
  evidenceUrls: string[];
  status: string;
  decidedBy?: { name: string };
  decidedAt?: string;
  decisionReason?: string;
  failureMessage?: string;
  dueAt?: string;
  overdue: boolean;
  canDecide: boolean;
  createdAt: string;
};

type Summary = {
  pending: number;
  critical: number;
  overdue: number;
  awaitingMyDecision: number;
  thisMonth: { approved: number; rejected: number; averageDecisionHours: number | null };
};

/** Time left to decide: "05m", "2h", "Overdue". */
function slaLeft(a: Approval): string {
  if (a.status !== "PENDING") return "—";
  if (!a.dueAt) return "—";
  const ms = new Date(a.dueAt).getTime() - Date.now();
  if (ms <= 0) return "Overdue";
  const minutes = Math.round(ms / 60_000);
  return minutes < 60 ? `${pad2(minutes)}m` : `${Math.round(minutes / 60)}h`;
}

const workflow = [
  { n: "1", step: "Submission", state: "Recorded" },
  { n: "2", step: "Verification", state: "Supporting evidence" },
  { n: "3", step: "Decision", state: "Authorised independent approver" },
  { n: "4", step: "Notification", state: "Audit & delivery" },
] as const;

const workflowHelp: Record<(typeof workflowActions)[number], string> = {
  Submit: "Approvals are submitted from the screen of the change itself (user activation, access change, case closure…).",
  Verify: "The checker reviews the reason and evidence shown under Selected approval.",
  Decide: "Approve or reject with a reason. The maker can never decide their own request.",
  Notify: "The maker is notified automatically and the decision is written to the audit trail.",
};

const workflowActions = ["Submit", "Verify", "Decide", "Notify"] as const;

export default function SA004Approvals() {
  const router = useRouter();
  const notice = useNotice();
  const mutation = useCrmMutation(notice.show);
  const [tab, setTab] = useState<Tab>("All");
  const [history, setHistory] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queue = useCrmQuery<Approval[]>(`/approvals${qs({ status: history ? undefined : "PENDING", limit: 100 })}`);
  const summary = useCrmQuery<Summary>("/approvals/summary");

  const all = (queue.data ?? []).filter((a) => (history ? a.status !== "PENDING" : true));
  const rows = tab === "All" ? all : all.filter((a) => TAB_TYPES[tab].includes(a.type));
  const selected = rows.find((a) => a.id === selectedId) ?? rows[0];
  const s = summary.data;

  const controls: readonly (readonly [string, string])[] = [
    ["Overdue decisions", pad2(s?.overdue)],
    ["Awaiting my decision", pad2(s?.awaitingMyDecision)],
    ["Sensitive approvals", "Individual review required"],
    ["Decision reason", "Mandatory"],
  ];

  async function decide(decision: "APPROVE" | "REJECT") {
    if (mutation.busy) return;
    if (!selected) return notice.show("Select an approval first.");
    if (!selected.canDecide) {
      return notice.show(selected.status !== "PENDING" ? "This approval has already been decided." : `You cannot decide ${selected.approvalNo}: it needs an independent ${LEVEL_LABEL[selected.requiredLevel] ?? ""} who did not request it.`);
    }
    const reason = window.prompt(`${decision === "APPROVE" ? "Approve" : "Reject"} ${selected.approvalNo} — reason (required):`)?.trim();
    if (!reason) return;
    if (reason.length < 5) return notice.show("Enter a reason of at least 5 characters.");
    try {
      await mutation.run(`/approvals/${selected.id}/decision`, { body: { decision, reason } }, `${selected.approvalNo} ${decision === "APPROVE" ? "approved" : "rejected"}.`);
      queue.reload();
      summary.reload();
    } catch (err) {
      notice.show(errorMessage(err));
      queue.reload();
    }
  }

  return (
    <SuperAdminFrame active="central-approvals">
      <PageHead
        light
        icon={Radio}
        iconTone="blue"
        title="Central Approval Centre"
        links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
      >
        <ModuleDropdown current="SA-004" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value={pad2(s?.pending)} label="Pending review" sub="Open" />
        <KpiTile tone="red" icon={Bell} value={pad2(s?.critical)} label="Critical approvals" sub="Subset of pending" />
        <KpiTile tone="orange" icon={CircleCheck} value={pad2(s?.thisMonth.approved)} label="Approved" sub="This month" />
        <KpiTile tone="purple" icon={Users} value={pad2(s?.thisMonth.rejected)} label="Rejected" sub="This month" />
        <KpiTile tone="sky" icon={Layers} value={pad2(s?.awaitingMyDecision)} label="Awaiting me" sub="To decide" />
        <KpiTile tone="green" icon={Radio} value={s?.thisMonth.averageDecisionHours === null || !s ? "—" : `${s.thisMonth.averageDecisionHours} h`} label="Average time" sub="This month" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {/* Approval queue */}
        <Panel
          title={history ? "Decision history" : "Approval queue"}
          className="lg:min-h-0 lg:flex-[376_1_0]"
          bodyClassName="flex flex-col px-[10px] pt-[8px]"
        >
          <TableWrap>
            <Thead>
              {["ID", "Request", "Requested by", "Approver", "Amount", "SLA", "Status", "Action"].map((h) => (
<th key={h} className={`${th} px-[6px] py-[6px] text-[14.5px]`}>{h}</th>
              ))}
            </Thead>
            <tbody>
              {rows.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={`cursor-pointer border-b border-[#eef0f5] last:border-0 even:bg-[#f7f9fd] hover:bg-[#eef2ff] ${selected?.id === a.id ? "ring-1 ring-inset ring-[#1d4fe0]/30" : ""}`}
                >
                  <td className={`${td} px-[6px] py-[7px] font-semibold`}>{a.approvalNo}</td>
                  <td className={`${td} px-[6px] py-[7px]`}>{a.summary}</td>
                  <td className={`${td} px-[6px] py-[7px]`}>{a.requestedBy.name}</td>
                  <td className={`${td} px-[6px] py-[7px]`}>{a.decidedBy?.name ?? LEVEL_LABEL[a.requiredLevel] ?? "—"}</td>
                  <td className={`${td} px-[6px] py-[7px] font-semibold`}>—</td>
                  <td className={`${td} px-[6px] py-[7px] font-bold`}>{slaLeft(a)}</td>
                  <td className={`${td} px-[6px] py-[7px]`}>
                    <StatusPill className="h-[19px] min-w-[74px] text-[15px]">{humanize(a.status)}</StatusPill>
                  </td>
                  <td className={`${td} px-[6px] py-[7px]`}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(a.id);
                        const href = entityHref(a.entityType, a.entityId, "super-admin");
                        if (href) router.push(href);
                      }}
                      className="text-[14.8px] font-semibold text-[#0b0c36] hover:text-[#2320c4] hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-[15px] font-medium text-[#5b6280]">
                    {queue.loading ? "Loading…" : queue.error ?? (history ? "No decided approvals in this category." : "No approvals in this category.")}
                  </td>
                </tr>
              )}
            </tbody>
          </TableWrap>

          <div className="mt-[10px] flex flex-wrap gap-[8px]">
            <PrimaryButton
              onClick={() => notice.show(selected ? `${selected.approvalNo}: ${selected.requestReason}` : "Select an approval first.")}
            >
              Review selected
            </PrimaryButton>
            <PrimaryButton
              outline
              onClick={() => notice.show("Approvals are routed automatically by access level and service centre; no manual reassignment.")}
            >
              Reassign
            </PrimaryButton>
            <PrimaryButton
              outline
              onClick={() => {
                setHistory((h) => !h);
                setSelectedId(null);
              }}
            >
              {history ? "Pending queue" : "Decision history"}
            </PrimaryButton>
          </div>
        </Panel>

        {/* Bottom row — selected approval, workflow, controls */}
        <div className="grid gap-[10px] lg:min-h-0 lg:flex-[230_1_0] lg:grid-cols-3 lg:[grid-template-rows:minmax(0,1fr)]">
          <Panel
            title="Selected approval"
            note={selected ? `• ${selected.approvalNo}` : undefined}
            bodyClassName="flex flex-col pt-[3px]"
          >
            <div className="flex flex-col gap-[6px]">
              <KV k="Supporting documents" v={selected ? (selected.evidenceUrls.length ? `${selected.evidenceUrls.length} file(s)` : selected.requestReason) : "—"} />
              <KV k="Maker" v={selected?.requestedBy.name ?? "—"} />
              <KV k="Checker" v={selected ? selected.decidedBy?.name ?? `Independent ${LEVEL_LABEL[selected.requiredLevel] ?? ""}` : "—"} />
              <KV k="Decision" v={selected ? (selected.status === "PENDING" ? `Pending · requested ${shortDateTime(selected.createdAt)}` : `${humanize(selected.status)}${selected.decisionReason ? ` · ${selected.decisionReason}` : ""}${selected.failureMessage ? ` · ${selected.failureMessage}` : ""}`) : "—"} />
            </div>
            <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
              <PrimaryButton disabled={mutation.busy || !selected?.canDecide} onClick={() => decide("APPROVE")}>
                Approve with reason
              </PrimaryButton>
              <PrimaryButton disabled={mutation.busy || !selected?.canDecide} outline onClick={() => decide("REJECT")}>
                Reject with reason
              </PrimaryButton>
            </div>
          </Panel>

          <Panel title="Approval workflow" bodyClassName="flex flex-col pt-[3px]">
            <div className="flex flex-col">
              {workflow.map((w) => (
                <div key={w.n} className="flex items-baseline justify-between gap-[8px] border-b border-[#eef0f5] py-[6px] leading-tight last:border-0">
                  <span className="text-[14.8px] font-semibold text-[#0b0c36]">
                    {w.n} <span className="mx-[2px] text-[#0b0c36]">•</span> {w.step}
                  </span>
                  <span className="shrink-0 text-right text-[15.5px] font-medium text-[#3b4256]">{w.state}</span>
                </div>
              ))}
            </div>
            <p className="mt-[6px] text-[15.5px] font-medium leading-tight text-[#5b6280]">
              Bulk approval restricted to approved low-risk categories.
            </p>
            <div className="mt-auto flex flex-wrap gap-[6px] pt-[8px]">
              {workflowActions.map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => notice.show(workflowHelp[act])}
                  className="flex h-[28px] items-center rounded-[7px] border-[1.5px] border-[#2f4fe0] bg-white px-[12px] pt-px text-[14.2px] font-semibold text-[#1d3fc4] hover:bg-[#f1f4ff]"
                >
                  {act}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Approval controls" bodyClassName="flex flex-col pt-[3px]">
            <div className="flex flex-col gap-[6px]">
              {controls.map(([k, v]) => (
                <KV key={k} k={k} v={v} />
              ))}
            </div>
            <div className="mt-auto pt-[8px]">
              <PrimaryButton
                onClick={() => notice.show("Who must approve what is defined by the access levels in Roles & Permission Matrix (SA-010).")}
              >
                Approval settings
              </PrimaryButton>
            </div>
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
