"use client";

/**
 * SA-012 — Master Data Management (demo data).
 * Only approved free-service categories may be activated; FY 2026–27 IDs,
 * versioned records and dependency checks; referenced entries are archived,
 * never hard-deleted; eligibility changes need approval and audit.
 */

import { useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, FilterBar, KVList, NativeSelect, Panel, Screen, SearchInput, useFilters } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Beneficiary Categories", "Service Master", "Documents", "Priority & Status", "ID Series"] as const;

const services = [
  { code: "SV-001", name: "Dignified cremation", scope: "Eligible beneficiary", status: "Active", version: "v1.0" },
  { code: "SV-002", name: "Body transportation", scope: "Approved case", status: "Active", version: "v1.0" },
  { code: "SV-003", name: "Documentation assistance", scope: "Approved case", status: "Active", version: "v1.0" },
  { code: "SV-004", name: "Family coordination", scope: "Approved case", status: "Draft", version: "v0.2" },
];
const categoryOpts = ["All categories", "Eligible beneficiary", "Approved case"] as const;
const statusOpts = ["All status", "Active", "Draft"] as const;

export default function SA012MasterData() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const { q, setQ, f, set, reset, text } = useFilters({ category: "All categories", status: "All status" });
  const rows = services.filter(
    (s) => (f.category === "All categories" || s.scope === f.category) && (f.status === "All status" || s.status === f.status) && text(s.code, s.name, s.scope),
  );

  return (
    <Screen
      code="SA-012"
      title="Master Data Management"
      active="master-data"
      picker={screenPicker1120}
      kpis={[
        { value: "03", label: "Beneficiary categories" },
        { value: "04", label: "Service records" },
        { value: "06", label: "Document types" },
        { value: "04", label: "Workflow rules" },
        { value: "02", label: "Change requests" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title="Approved service catalogue — demo" h={372}>
            <FilterBar>
              <SearchInput value={q} onChange={setQ} className="w-full lg:flex-1" />
              <NativeSelect label="Category" value={f.category} options={categoryOpts} onChange={set("category")} className="w-[160px]" />
              <NativeSelect label="Status" value={f.status} options={statusOpts} onChange={set("status")} className="w-[128px]" />
              <Btn onClick={reset} className="!h-[32px]">Reset filters</Btn>
            </FilterBar>
            <DataTable
              head={["Code", "Service / support", "Eligibility scope", "Charge", "Status", "Action", "Version"]}
              rowH={42}
              pills={[4]}
              rows={rows.map((s) => ({
                key: s.code,
                cells: [s.code, s.name, s.scope, "₹0", s.status, <Btn key="r" className="!h-[27px]" onClick={() => notice.show(`${s.code}: changes need approval and are versioned (demo).`)}>Review</Btn>, s.version],
              }))}
            />
            <Buttons>
              <Btn primary onClick={() => notice.show("New master record — saved as draft for approval (demo).")}>Add master record</Btn>
              <Btn onClick={() => notice.show("Import file is validated and held for review (demo).")}>Import for review</Btn>
            </Buttons>
          </Panel>

          <Panel title="Beneficiary classification">
            <DataTable
              head={["Code", "Category", "Verification"]}
              rowH={30}
              rows={[
                { key: "BC-01", cells: ["BC-01", "Unclaimed bodies", "Competent authority clearance"] },
                { key: "BC-02", cells: ["BC-02", "Unsupported persons", "Support / eligibility check"] },
                { key: "BC-03", cells: ["BC-03", "Economically weaker families", "Eligibility evidence"] },
              ]}
            />
          </Panel>
        </Col>

        <Col>
          <Panel title="Master categories" h={318}>
            <KVList
              rowH={27}
              rows={[
                ["Beneficiary categories", "03"],
                ["Service types", "04"],
                ["Document types", "06"],
                ["Priority / status values", "Configured"],
                ["Vehicle / material masters", "Linked"],
                ["Centre / PIN masters", "SA-006"],
                ["Archived records", "View archive"],
                ["Version history", "Review changes"],
              ]}
            />
            <Buttons>
              <Btn onClick={() => setTab("Service Master")}>Search master categories</Btn>
            </Buttons>
          </Panel>

          <Panel title="ID & change governance">
            <KVList
              rows={[
                ["Financial year", "2026-27"],
                ["Request ID example", "MSR-26-27-0001"],
                ["Case ID example", "MSC-26-27-0001"],
                ["Task ID example", "MST-26-27-0001"],
                ["Deletion policy", "Archive only"],
                ["Charge model", "Free Sewa"],
              ]}
            />
            <Buttons>
              <Btn primary onClick={() => notice.show("Change history: every edit is versioned and audited (demo).")}>Review change history</Btn>
              <Btn onClick={() => setTab("ID Series")}>Manage ID series</Btn>
            </Buttons>
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
