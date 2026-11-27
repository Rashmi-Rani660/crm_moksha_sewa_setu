"use client";

/**
 * SA-013 — Central Leads & Requests Management (demo data).
 * Intake from website, staff / volunteer apps, email, WhatsApp, AI inbound
 * calls, chatbot, social media and Google Ads; outgoing SMS is not an intake
 * channel. Duplicates go to review; out-of-coverage requests stay separate.
 */

import Link from "next/link";
import { useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { saRoutes, screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, FilterBar, Flow, KVList, NativeSelect, Panel, Pill, Screen, SearchInput, useFilters } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["All Requests", "Emergency", "Unassigned", "Verification Pending", "Out of Coverage"] as const;

const requests = [
  { id: "MSR-26-27-0001", type: "Unclaimed body", source: "AI inbound call", city: "Ghaziabad", owner: "Operations Admin", priority: "Critical", status: "Pending verification" },
  { id: "MSR-26-27-0002", type: "EWS family", source: "Website", city: "Ghaziabad", owner: "Unassigned", priority: "High", status: "Pending" },
  { id: "MSR-26-27-0003", type: "Unsupported person", source: "Volunteer app", city: "Ghaziabad", owner: "Case User 01", priority: "Normal", status: "Verified" },
  { id: "MSR-26-27-0004", type: "EWS family", source: "WhatsApp", city: "Ghaziabad", owner: "Case User 02", priority: "High", status: "In progress" },
  { id: "MSR-26-27-0005", type: "Unclaimed body", source: "Staff app", city: "Ghaziabad", owner: "Case User 03", priority: "Normal", status: "Completed" },
  { id: "MSR-26-27-0006", type: "EWS family", source: "Google Ads", city: "Noida", owner: "Helpdesk", priority: "Normal", status: "Out of coverage" },
];
type Req = (typeof requests)[number];
const byTab: Record<string, (r: Req) => boolean> = {
  Emergency: (r) => r.priority === "Critical",
  Unassigned: (r) => r.owner === "Unassigned",
  "Verification Pending": (r) => r.status === "Pending verification" || r.status === "Pending",
  "Out of Coverage": (r) => r.status === "Out of coverage",
};
const channelOpts = ["All channels", "AI inbound call", "Website", "Volunteer app", "WhatsApp", "Staff app", "Google Ads"] as const;
const priorityOpts = ["All priority", "Critical", "High", "Normal"] as const;
const statusOpts = ["All status", "Pending verification", "Pending", "Verified", "In progress", "Completed", "Out of coverage"] as const;

export default function SA013LeadsRequests() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const { q, setQ, f, set, reset, text } = useFilters({ channel: "All channels", priority: "All priority", status: "All status" });
  const rows = requests.filter(
    (r) =>
      (byTab[tab] ?? (() => true))(r) &&
      (f.channel === "All channels" || r.source === f.channel) &&
      (f.priority === "All priority" || r.priority === f.priority) &&
      (f.status === "All status" || r.status === f.status) &&
      text(r.id, r.type, r.source, r.city, r.owner),
  );

  return (
    <Screen
      code="SA-013"
      title="Central Leads & Requests Management"
      active="sewa-operations"
      picker={screenPicker1120}
      kpis={[
        { value: "324", label: "Requests this month" },
        { value: "276", label: "Completed" },
        { value: "18", label: "In progress" },
        { value: "14", label: "Pending" },
        { value: "16", label: "On hold" },
        { value: "03", label: "Emergency" },
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
              rows={rows.map((r) => ({
                key: r.id,
                cells: [
                  <Link key="id" href={saRoutes.requestDetails} className="hover:text-[#1e43a8] hover:underline">{r.id}</Link>,
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
              <Btn primary onClick={() => notice.show("New request: capture source and consent, then duplicate check (demo).")}>Register request</Btn>
              <Btn onClick={() => notice.show("Assign an owner — manual override needs a reason (demo).")}>Assign owner</Btn>
              <Btn onClick={() => notice.show("02 possible duplicates waiting for review (demo).")}>Review duplicates</Btn>
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
                ["Website / forms", "Synced"],
                ["AI inbound calling", "Connected"],
                ["WhatsApp", <Pill key="w" tone="blue">Delayed</Pill>],
                ["Official email", "Connected"],
                ["Staff / volunteer apps", "Connected"],
                ["Chatbot / social / Google Ads", "Connected"],
              ]}
            />
          </Panel>

          <Panel title="Routing controls">
            <KVList
              rows={[
                ["Mode", "Approval-based"],
                ["Unassigned requests", "04 (demo)"],
                ["Pending duplicate review", "02"],
                ["Out-of-coverage requests", "01"],
                ["Outgoing SMS", "Delivery only"],
              ]}
            />
            <Buttons className="mb-[6px]">
              <Btn primary onClick={() => notice.show("Routing rules: approval-based mode (demo).")}>Review routing</Btn>
              <Btn onClick={() => setTab("Unassigned")}>Manual assignment</Btn>
            </Buttons>
            <KVList
              rows={[
                ["Unanswered calls", <Pill key="u" tone="amber">03</Pill>],
                ["Avg. first response", "18 min · demo"],
                ["Pending replies", <Pill key="p" tone="amber">Email 06 · WA 08</Pill>],
              ]}
            />
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
