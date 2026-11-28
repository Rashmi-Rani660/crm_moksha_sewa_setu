"use client";

/**
 * SA-012 — Master Data Management (demo data).
 * Only approved free-service categories may be activated; FY 2026–27 IDs,
 * versioned records and dependency checks; referenced entries are archived,
 * never hard-deleted; eligibility changes need approval and audit.
 */

import { useState } from "react";
import { authorizedRequest } from "@/lib/api/authorized";
import { useCrmQuery, useDebounced } from "@/lib/api/useCrmQuery";
import { useResource } from "@/lib/crm/useResource";
import { at, count, records, text as value, EMPTY, type CrmRecord } from "@/lib/crm/data";
import { humanize } from "@/lib/format";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Col, Columns, DataTable, FilterBar, KVList, NativeSelect, Panel, Screen, SearchInput, useFilters } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Beneficiary Categories", "Service Master", "Documents", "Priority & Status", "ID Series"] as const;


const categoryOpts = ["All categories", "Eligible beneficiary", "Approved case"] as const;
const statusOpts = ["All status", "Active", "Draft"] as const;

export default function SA012MasterData() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const { q, setQ, f, set, reset } = useFilters({ category: "All categories", status: "All status" });
  const typeByTab: Record<string,string> = { "Beneficiary Categories": "BENEFICIARY_CATEGORY", "Service Master": "SERVICE", Documents: "DOCUMENT_TYPE", "Priority & Status": "PRIORITY" };
  const search = useDebounced(q.trim());
  const live = useResource("/master-data", "master_data", notice.show, { type: typeByTab[tab],search: search || undefined,status: f.status === "All status" ? undefined : f.status.toUpperCase() }, { summary: null });
  const types = useCrmQuery<CrmRecord[]>(live.can("master_data.view") ? "/master-data/types" : null);
  const categories = useCrmQuery<CrmRecord[]>(live.can("master_data.view") ? "/master-data?type=BENEFICIARY_CATEGORY&status=ACTIVE&limit=100" : null);
  const metric = (type: string) => count(records(types.data).find(row => row.type === type)?.total);
  const rows = live.rows.map(row => ({ id: value(row.id),code: value(row.code),name: value(row.label),scope: value(at(row,"attributes.eligibility")),status: humanize(value(row.status,"")),version: value(row.revision) }));
  async function review(id: string) {
    const fresh = (await authorizedRequest<CrmRecord>('/master-data/' + id)).data;
    const label = window.prompt("Label:",value(fresh.label,"")); if (label === null) return;
    await live.mutation.run('/master-data/' + id, { method: "PATCH",body: { version: fresh.version,label } }, "Master record saved.");
  }
  async function create() {
    const type = typeByTab[tab]; const code = window.prompt("Code:")?.trim(); const label = window.prompt("Label:")?.trim();
    if (type && code && label) await live.mutation.run("/master-data", { body: { type,code,label } }, "Master record created.");
  }

  return (
    <Screen
      code="SA-012"
      title="Master Data Management"
      active="master-data"
      picker={screenPicker1120}
      kpis={[
        { value: metric("BENEFICIARY_CATEGORY"), label: "Beneficiary categories" },
        { value: metric("SERVICE"), label: "Service records" },
        { value: metric("DOCUMENT_TYPE"), label: "Document types" },
        { value: EMPTY, label: "Workflow rules" },
        { value: EMPTY, label: "Change requests" },
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
                cells: [s.code, s.name, s.scope, "₹0", s.status, <Btn key="r" className="!h-[27px]" disabled={!live.can("master_data.edit") || live.mutation.busy} onClick={() => review(s.id)}>Review</Btn>, s.version],
              }))}
            />
            <Buttons>
              <Btn primary disabled={!live.can("master_data.create") || live.mutation.busy} onClick={create}>Add master record</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Import for review</Btn>
            </Buttons>
          </Panel>

          <Panel title="Beneficiary classification">
            <DataTable
              head={["Code", "Category", "Verification"]}
              rowH={30}
              rows={records(categories.data).map(row => ({ key: value(row.id),cells: [value(row.code),value(row.label),value(at(row,"attributes.requiresLegalClearance"))] }))}
            />
          </Panel>
        </Col>

        <Col>
          <Panel title="Master categories" h={318}>
            <KVList
              rowH={27}
              rows={[
                ["Beneficiary categories",metric("BENEFICIARY_CATEGORY")],
                ["Service types",metric("SERVICE")],
                ["Document types",metric("DOCUMENT_TYPE")],
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
                ["Request ID example", EMPTY],
                ["Case ID example", EMPTY],
                ["Task ID example", EMPTY],
                ["Deletion policy", "Archive only"],
                ["Charge model", "Free Sewa"],
              ]}
            />
            <Buttons>
              <Btn primary onClick={async () => { if (!live.id) return; const result = await authorizedRequest<CrmRecord[]>(`/master-data/${live.id}/history`); notice.show(result.data.map(row => value(row.summary)).join("\n") || EMPTY); }}>Review change history</Btn>
              <Btn disabled onClick={() => setTab("ID Series")}>Manage ID series</Btn>
            </Buttons>
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
