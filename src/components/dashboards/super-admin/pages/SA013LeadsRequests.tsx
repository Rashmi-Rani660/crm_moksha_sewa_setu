"use client";

/**
 * SA-013 — Central Leads & Requests Management (demo data).
 * Intake from website, staff / volunteer apps, email, WhatsApp, AI inbound
 * calls, chatbot, social media and Google Ads; outgoing SMS is not an intake
 * channel. Duplicates go to review; out-of-coverage requests stay separate.
 */

import Link from "next/link";
import { useState } from "react";
import { useOperations } from "@/lib/crm/useOperations";
import { useDebounced } from "@/lib/api/useCrmQuery";
import { at, text as value, EMPTY } from "@/lib/crm/data";
import { humanize } from "@/lib/format";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { saRoutes, screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, FilterBar, Flow, KVList, NativeSelect, Panel, Pill, Screen, SearchInput, useFilters } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["All Requests", "Emergency", "Unassigned", "Verification Pending", "Out of Coverage"] as const;

const channelOpts = ["All channels", "AI inbound call", "Website", "Volunteer app", "WhatsApp", "Staff app", "Google Ads"] as const;
const priorityOpts = ["All priority", "Critical", "High", "Normal"] as const;
const statusOpts = ["All status", "Pending verification", "Pending", "Verified", "In progress", "Completed", "Out of coverage"] as const;

export default function SA013LeadsRequests() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const { q, setQ, f, set, reset } = useFilters({ channel: "All channels", priority: "All priority", status: "All status" });
  const search = useDebounced(q.trim());
  const statusMap: Record<string, string> = { "Pending verification": "PENDING_VERIFICATION", Pending: "NEW", Verified: "VERIFIED", "In progress": "PENDING_VERIFICATION", Completed: "CONVERTED", "Out of coverage": "OUT_OF_COVERAGE" };
  const live = useOperations("requests", notice.show, { search: search || undefined,
    status: tab === "Verification Pending" ? "PENDING_VERIFICATION" : statusMap[f.status],
    emergency: tab === "Emergency" ? true : undefined, unassigned: tab === "Unassigned" ? true : undefined,
    coverage: tab === "Out of Coverage" ? "OUT_OF_COVERAGE" : undefined,
    priority: f.priority === "All priority" ? undefined : f.priority.toUpperCase(),
    channel: liveChannel(f.channel),
  });
  function liveChannel(label: string) { const map: Record<string, string> = { Website: "WEBSITE", "Staff app": "STAFF_APP", "Volunteer app": "VOLUNTEER_APP", WhatsApp: "WHATSAPP", "AI inbound call": "AI_CALL", "Google Ads": "GOOGLE_ADS" }; return map[label]; }
  const rows = live.rows.map(r => ({ id: r.displayId, recordId: value(r.id), type: humanize(value(r.beneficiaryCategory, "")), source: humanize(value(r.channel, "")), city: value(at(r,"location.city")), owner: r.displayOwner, priority: r.displayPriority, status: r.displayStatus }));
  const metric = (key: string) => live.metric(key);
  async function register() {
    const requester = window.prompt("Requester name:")?.trim();
    const mobile = window.prompt("Requester mobile (10 digits):")?.trim();
    const pincode = window.prompt("Service PIN code (6 digits):")?.trim();
    const channel = await live.pickCode("REQUEST_CHANNEL", "Request channel");
    if (!requester || !mobile || !pincode || !channel) return;
    if (!window.confirm("Has the family consented to processing their data?")) return;
    await live.createRequest({ requester: { name: requester, mobile }, location: { pincode }, channel, consentDataProcessing: true });
  }

  return (
    <Screen
      code="SA-013"
      title="Central Leads & Requests Management"
      active="sewa-operations"
      picker={screenPicker1120}
      kpis={[
        { value: metric("thisMonth"), label: "Requests this month" },
        { value: metric("byStatus.CONVERTED"), label: "Completed" },
        { value: metric("byStatus.PENDING_VERIFICATION"), label: "In progress" },
        { value: metric("byStatus.NEW"), label: "Pending" },
        { value: metric("byStatus.ON_HOLD"), label: "On hold" },
        { value: metric("emergencyOpen"), label: "Emergency" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title="Central request register" h={415}>
            <FilterBar>
              <SearchInput value={q} onChange={setQ} className="w-full lg:flex-1" />
              <NativeSelect label="Channel" value={f.channel} options={channelOpts} onChange={set("channel")} className="w-[138px]" />
              <NativeSelect label="Priority" value={f.priority} options={priorityOpts} onChange={set("priority")} className="w-[118px]" />
              <NativeSelect label="Status" value={f.status} options={statusOpts} onChange={set("status")} className="w-[118px]" />
              <Btn onClick={reset} className="!h-[32px]">Reset filters</Btn>
            </FilterBar>
            <DataTable
              head={["Request ID", "Beneficiary type", "Source", "City", "Assigned owner", "Priority", "Status"]}
              pills={[5, 6]}
              empty={live.empty}
              rows={rows.map((r) => ({
                key: r.id,
                cells: [
                  <Link key="id" href={`${saRoutes.requestDetails}?id=${r.recordId}`} className="hover:text-[#1e43a8] hover:underline">{r.id}</Link>,
                  r.type,
                  r.source,
                  r.city,
                  r.owner,
                  r.priority,
                  r.status,
                ],
              }))}
            />
            <Buttons>
              <Btn primary disabled={live.mutation.busy || !live.can("requests.create")} onClick={register}>Register request</Btn>
              <Btn disabled={!live.canAct("Assign owner")} onClick={() => live.act("Assign owner")}>Assign owner</Btn>
              <Btn onClick={() => notice.show(metric("pendingDuplicateReview"))}>Review duplicates</Btn>
            </Buttons>
          </Panel>

          <Panel title="Request intake & routing">
            <Flow steps={["Capture source", "Duplicate review", "Coverage check", "Verify eligibility", "Assign owner"]} h={64} />
          </Panel>
        </Col>

        <Col>
          <Panel title="Intake channel watch" h={240}>
            <KVList
              rows={[
                ["Website / forms", value(live.sync.data?.lastRunAt)],
                ["AI inbound calling", EMPTY],
                ["WhatsApp", <Pill key="w" tone="blue">{EMPTY}</Pill>],
                ["Official email", EMPTY],
                ["Staff / volunteer apps", EMPTY],
                ["Chatbot / social / Google Ads", EMPTY],
              ]}
            />
          </Panel>

          <Panel title="Routing controls">
            <KVList
              rows={[
                ["Mode", "Approval-based"],
                ["Unassigned requests", metric("unassigned")],
                ["Pending duplicate review", metric("pendingDuplicateReview")],
                ["Out-of-coverage requests", metric("outOfCoverage")],
                ["Outgoing SMS", "Delivery only"],
              ]}
            />
            <Buttons className="mb-[6px]">
              <Btn primary disabled onClick={() => notice.show(EMPTY)}>Review routing</Btn>
              <Btn onClick={() => setTab("Unassigned")}>Manual assignment</Btn>
            </Buttons>
            <KVList
              rows={[
                ["Unanswered calls", <Pill key="u" tone="amber">{EMPTY}</Pill>],
                ["Avg. first response", value(live.summary.data?.averageFirstResponseMinutes)],
                ["Pending replies", <Pill key="p" tone="amber">{EMPTY}</Pill>],
              ]}
            />
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
