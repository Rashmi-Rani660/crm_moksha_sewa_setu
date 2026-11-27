"use client";

/**
 * SA-004 — Central Approval Centre.
 * Rebuild matched to the SA-004 reference design: 6 KPI tiles, 6 tabs, the
 * approval queue table and a 3-panel footer (selected approval, workflow,
 * controls). Maker–checker, independent approval and separation of duties are
 * enforced; no self-approval; bulk actions only for low-risk, policy-approved
 * records; every decision needs a reason, evidence, audit trail and
 * notification. Demo data only.
 */

import { useState } from "react";
import {
  Bell,
  CircleCheck,
  FileText,
  Radio,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  CentreDropdown,
  Dropdown,
  KpiRow,
  KpiTile,
  KV,
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

const tabs = ["All", "Sewa & legal", "Expenses", "Donations", "Procurement", "User access"] as const;
type Tab = (typeof tabs)[number];

const moduleOptions = [
  "SA-003 · Notification & Alerts",
  "SA-004 · Central Approval Centre",
  "SA-005 · Organisation Setup",
] as const;

type Category = (typeof tabs)[number];

type Approval = {
  id: string;
  request: string;
  requestedBy: string;
  approver: string;
  amount: string;
  sla: string;
  status: string;
  category: Exclude<Category, "All">;
};

const approvals: Approval[] = [
  { id: "AP-001", request: "Emergency dispatch", requestedBy: "User 01", approver: "Admin 01", amount: "—", sla: "05m", status: "Pending", category: "Sewa & legal" },
  { id: "AP-002", request: "Eligibility verification", requestedBy: "User 02", approver: "Admin 02", amount: "—", sla: "20m", status: "Under review", category: "Sewa & legal" },
  { id: "AP-003", request: "Case expense", requestedBy: "User 03", approver: "Admin 03", amount: "₹28,500", sla: "1h", status: "Pending", category: "Expenses" },
  { id: "AP-004", request: "Vehicle maintenance", requestedBy: "User 04", approver: "Admin 03", amount: "₹12,400", sla: "2h", status: "Pending", category: "Expenses" },
  { id: "AP-005", request: "User access change", requestedBy: "Admin 01", approver: "Super Admin 02", amount: "—", sla: "3h", status: "Pending", category: "User access" },
  { id: "AP-006", request: "Material request", requestedBy: "User 05", approver: "Admin 03", amount: "₹4,100", sla: "4h", status: "Pending", category: "Procurement" },
];

type Detail = { supporting: string; maker: string; checker: string; decision: string };

const details: Record<string, Detail> = {
  "AP-001": { supporting: "Emergency dispatch request form", maker: "User 01", checker: "Admin 01", decision: "Pending independent review" },
  "AP-002": { supporting: "Eligibility documents / ID proof", maker: "User 02", checker: "Admin 02", decision: "Under review by checker" },
  "AP-003": { supporting: "Invoice / case expense record", maker: "User 03", checker: "Admin 03", decision: "Pending independent review" },
  "AP-004": { supporting: "Service estimate / AMC quote", maker: "User 04", checker: "Admin 03", decision: "Pending independent review" },
  "AP-005": { supporting: "Role change justification", maker: "Admin 01", checker: "Super Admin 02", decision: "Pending independent review" },
  "AP-006": { supporting: "Material quotation / catalog", maker: "User 05", checker: "Admin 03", decision: "Pending independent review" },
};

const workflow = [
  { n: "1", step: "Submission", state: "Recorded" },
  { n: "2", step: "Verification", state: "Supporting evidence" },
  { n: "3", step: "Decision", state: "Authorised independent approver" },
  { n: "4", step: "Notification", state: "Audit & delivery" },
] as const;

const controls: readonly (readonly [string, string])[] = [
  ["SLA compliance", "96% • demo"],
  ["Pending expense value", "₹45,000"],
  ["Sensitive approvals", "Individual review required"],
  ["Reassignment", "Reason mandatory"],
] as const;

const workflowActions = ["Submit", "Verify", "Decide", "Notify"] as const;

export default function SA004Approvals() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("All");
  const [module, setModule] = useState<(typeof moduleOptions)[number]>(moduleOptions[1]);
  const [selectedId, setSelectedId] = useState("AP-003");

  const rows = tab === "All" ? approvals : approvals.filter((a) => a.category === tab);
  const selected = approvals.find((a) => a.id === selectedId) ?? approvals[2];
  const detail = details[selected.id];

  return (
    <SuperAdminFrame active="central-approvals">
      <PageHead
        icon={Radio}
        iconTone="blue"
        title="Central Approval Centre (SA-004)"
        links={["Super Admin", "FY 2026-27", "Ghaziabad"]}
      >
        <span className="inline-flex h-[30px] items-center rounded-[8px] border border-[#f0dca0] bg-[#fff6da] px-[10px] text-[12px] font-bold text-[#8a6a00]">
          DEMO DATA
        </span>
        <Dropdown label="Module" value={module} options={moduleOptions} onChange={setModule} className="w-[250px]" />
        <CentreDropdown className="w-[165px]" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="15" label="Pending review" sub="Open" />
        <KpiTile tone="red" icon={Bell} value="07" label="Critical approvals" sub="Subset of pending" />
        <KpiTile tone="orange" icon={CircleCheck} value="18" label="Approved" sub="This month" />
        <KpiTile tone="purple" icon={Users} value="03" label="Rejected" sub="This month" />
        <KpiTile tone="sky" icon={Users} value="02" label="Reassigned" sub="Events" />
        <KpiTile tone="green" icon={Radio} value="4.6 h" label="Average time" sub="This month" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {/* Approval queue */}
        <Panel
          title="Approval queue"
          icon={FileText}
          className="lg:min-h-0 lg:flex-[376_1_0]"
          bodyClassName="flex flex-col px-[10px] pt-[8px]"
        >
          <TableWrap>
            <Thead>
              {["ID", "Request", "Requested by", "Approver", "Amount", "SLA", "Status", "Action"].map((h) => (
                <th key={h} className={`${th} px-[6px] py-[6px] text-[12.5px] ${["Amount", "SLA", "Status", "Action"].includes(h) ? "text-center" : ""}`}>
                  {h}
                </th>
              ))}
            </Thead>
            <tbody>
              {rows.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setSelectedId(a.id)}
                  className={`cursor-pointer border-b border-[#eef0f5] last:border-0 hover:bg-[#f7f9ff] ${selectedId === a.id ? "bg-[#eef2ff]" : ""}`}
                >
                  <td className={`${td} px-[6px] py-[7px] font-semibold`}>{a.id}</td>
                  <td className={`${td} px-[6px] py-[7px]`}>{a.request}</td>
                  <td className={`${td} px-[6px] py-[7px]`}>{a.requestedBy}</td>
                  <td className={`${td} px-[6px] py-[7px]`}>{a.approver}</td>
                  <td className={`${td} px-[6px] py-[7px] text-center font-semibold`}>{a.amount}</td>
                  <td className={`${td} px-[6px] py-[7px] text-center font-bold`}>{a.sla}</td>
                  <td className={`${td} px-[6px] py-[7px] text-center`}>
                    <StatusPill className="h-[19px] min-w-[74px] text-[11px]">{a.status}</StatusPill>
                  </td>
                  <td className={`${td} px-[6px] py-[7px] text-center`}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(a.id);
                        notice.show(`${a.id}: evidence and audit history opened (demo).`);
                      }}
                      className="text-[12.8px] font-semibold text-[#0b0c36] hover:text-[#2320c4] hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-[13px] font-medium text-[#5b6280]">
                    No approvals in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </TableWrap>

          <div className="mt-[10px] flex flex-wrap gap-[8px]">
            <PrimaryButton
              icon={CircleCheck}
              onClick={() => notice.show(`${selectedId}: review opened with evidence (demo).`)}
            >
              Review selected
            </PrimaryButton>
            <PrimaryButton
              outline
              onClick={() => notice.show(`${selectedId}: reassign requires a reason (demo).`)}
            >
              Reassign
            </PrimaryButton>
            <PrimaryButton
              outline
              onClick={() => notice.show("Decision history opened (demo).")}
            >
              Decision history
            </PrimaryButton>
          </div>
        </Panel>

        {/* Bottom row — selected approval, workflow, controls */}
        <div className="grid gap-[10px] lg:min-h-0 lg:flex-[230_1_0] lg:grid-cols-3 lg:[grid-template-rows:minmax(0,1fr)]">
          <Panel
            title="Selected approval"
            note={`• ${selected.id}`}
            icon={FileText}
            bodyClassName="flex flex-col pt-[3px]"
          >
            <div className="flex flex-col gap-[6px]">
              <KV k="Supporting documents" v={detail.supporting} />
              <KV k="Maker" v={detail.maker} />
              <KV k="Checker" v={detail.checker} />
              <KV k="Decision" v={detail.decision} />
            </div>
            <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
              <PrimaryButton
                onClick={() => notice.show(`${selected.id}: approved with reason (demo).`)}
              >
                Approve with reason
              </PrimaryButton>
              <PrimaryButton
                outline
                onClick={() => notice.show(`${selected.id}: rejected with reason (demo).`)}
              >
                Reject with reason
              </PrimaryButton>
            </div>
          </Panel>

          <Panel title="Approval workflow" icon={CircleCheck} bodyClassName="flex flex-col pt-[3px]">
            <div className="flex flex-col">
              {workflow.map((w, i) => (
                <div key={w.n} className="flex items-start gap-[8px] border-b border-[#eef0f5] py-[6px] last:border-0">
                  <span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1d4fe0] bg-[#eef2ff] text-[10px] font-bold text-[#1d4fe0]">
                    {w.n}
                  </span>
                  <span className="flex min-w-0 flex-1 items-baseline justify-between gap-[8px] leading-tight">
                    <b className="text-[12.8px] font-bold text-[#0b0c36]">• {w.step}</b>
                    <span className="shrink-0 text-right text-[11.5px] font-medium text-[#3b4256]">{w.state}</span>
                  </span>
                  {i === workflow.length - 1 && null}
                </div>
              ))}
            </div>
            <p className="mt-[6px] text-[11.5px] font-medium leading-tight text-[#5b6280]">
              Bulk approval restricted to approved low-risk categories.
            </p>
            <div className="mt-auto flex flex-wrap gap-[6px] pt-[8px]">
              {workflowActions.map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => notice.show(`${act}: workflow step recorded (demo).`)}
                  className="flex h-[28px] items-center rounded-[7px] border-[1.5px] border-[#2f4fe0] bg-white px-[12px] pt-px text-[12.2px] font-semibold text-[#1d3fc4] hover:bg-[#f1f4ff]"
                >
                  {act}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Approval controls" icon={CircleCheck} bodyClassName="flex flex-col pt-[3px]">
            <div className="flex flex-col gap-[6px]">
              {controls.map(([k, v]) => (
                <KV key={k} k={k} v={v} />
              ))}
            </div>
            <div className="mt-auto pt-[8px]">
              <PrimaryButton
                onClick={() => notice.show("Approval thresholds and approvers are configured here (demo).")}
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
