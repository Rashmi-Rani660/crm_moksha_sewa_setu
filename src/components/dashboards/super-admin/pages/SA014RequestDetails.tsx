"use client";

/**
 * SA-014 — Sewa Request Details & Verification (demo data).
 * Eligibility, death documentation and authorised claimant / competent
 * authority clearance are checked; AI never grants final legal clearance;
 * personal details are masked; verifier, approval and evidence are recorded.
 */

import { useState } from "react";
import { useOperations } from "@/lib/crm/useOperations";
import { at, text, records, EMPTY } from "@/lib/crm/data";
import { humanize, shortDateTime } from "@/lib/format";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Check, Col, Columns, DataTable, Field, KVList, NativeSelect, Panel, Pill, Screen, SubLabel, TextBox, ink } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Request Details", "Documents", "Eligibility & Legal", "Communication", "Audit History"] as const;
export default function SA014RequestDetails() {
  const notice = useNotice();
  const live = useOperations("requests", notice.show);
  const record = live.detail.data;
  const categoryOpts = live.master("BENEFICIARY_CATEGORY").map(row => text(row.code));
  const serviceOpts = live.master("SERVICE").map(row => text(row.code));
  const verifierOpts = live.people.map(row => text(row.name));
  const [tab, setTab] = useState<string>(tabs[0]);
  const [category, setCategory] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [verifier, setVerifier] = useState<string>("");
  const checklist = records(record?.checklist).map(item => ({ item: text(item.label), status: item.done ? "Verified" : "Pending", owner: EMPTY }));
  const [remarks, setRemarks] = useState("");
  const checks = { evidence: checklist.length > 0 && checklist.every(item => item.status === "Verified"), legal: at(record,"legal.state") === "CLEARED", eligibility: !!record?.verification };
  const setChecks = (next: typeof checks) => {
    if (next.legal !== checks.legal && next.legal) void live.act("Record legal clearance");
    else if (next.evidence !== checks.evidence) void live.act("Save checklist", { items: records(record?.checklist).map(item => ({ key: item.key, done: next.evidence })) });
    else if (next.eligibility) void live.act("Verify request");
  };
  const hold = record?.status === "ON_HOLD";
  async function save() {
    const result = await live.action("", "requests.edit", { notes: remarks, ...(category ? { beneficiaryCategory: category } : {}), ...(service ? { services: [service] } : {}) }, "PATCH");
    const owner = live.people.find(person => person.name === verifier);
    if (result && owner && owner.id !== at(record, "owner.id") && live.can("requests.assign")) {
      await live.mutation.run(`/requests/${live.id}/assign`, { body: { version: result.version, ownerId: owner.id } }, "Assigned.");
    }
  }

  return (
    <Screen
      code="SA-014"
      title="Sewa Request Details & Verification"
      active="sewa-operations"
      picker={screenPicker1120}
      kpis={[
        { value: text(record?.requestNo), label: "Request ID" },
        { value: humanize(text(record?.priority, "")), label: "Priority" },
        { value: humanize(text(record?.coverage, "")), label: "Coverage" },
        { value: `${checklist.filter((c) => c.status === "Verified").length} / ${checklist.length}`, label: "Documents" },
        { value: record ? humanize(text(record.status, "")) : EMPTY, label: "Eligibility" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title="Request & beneficiary details" h={300}>
            <div className="grid grid-cols-1 gap-x-[13px] gap-y-[8px] sm:grid-cols-2">
              <Field label="Request ID"><TextBox value={text(record?.requestNo)} readOnly label="Request ID" /></Field>
              <Field label="Source"><TextBox value={humanize(text(record?.channel, ""))} readOnly label="Source" /></Field>
              <Field label="Beneficiary category"><NativeSelect label="Beneficiary category" value={category || text(record?.beneficiaryCategory, "")} options={categoryOpts} onChange={setCategory} className="w-full" /></Field>
              <Field label="Service requested"><NativeSelect label="Service requested" value={service || text((record?.services as string[] | undefined)?.[0], "")} options={serviceOpts} onChange={setService} className="w-full" /></Field>
              <Field label="City / centre"><TextBox value={text(at(record,"centre.name"))} readOnly label="City / centre" /></Field>
              <Field label="Contact reference"><TextBox value={text(at(record,"requester.mobile"))} readOnly label="Contact reference" /></Field>
              <Field label="Assigned verifier"><NativeSelect label="Assigned verifier" value={verifier || text(at(record,"owner.name"), "")} options={verifierOpts} onChange={setVerifier} className="w-full" /></Field>
              <Field label="Received at"><TextBox value={shortDateTime(text(record?.createdAt,""))} readOnly label="Received at" /></Field>
            </div>
          </Panel>

          <Panel title="Verification checklist">
            <DataTable
              head={["Evidence / requirement", "Status", "Owner"]}
              pills={[1]}
              rows={checklist.map((c) => ({ key: c.item, cells: [c.item, c.status, c.owner] }))}
            />
            <Buttons>
              <Btn primary disabled={!live.can("requests.edit") || !live.id} onClick={() => live.upload.pick(`/requests/${live.id}/documents`)}>Request missing documents</Btn>
              <Btn
                disabled={!live.canAct("Submit for approval")} onClick={() => live.act("Submit for approval")}
              >
                Submit for approval
              </Btn>
              <Btn disabled={!live.canAct(hold ? "Release hold" : "Place on hold")} onClick={() => live.act(hold ? "Release hold" : "Place on hold")}>{hold ? "Release hold" : "Place on hold"}</Btn>
            </Buttons>
          </Panel>
        </Col>

        <Col>
          <Panel title="Priority & legal gate" h={195}>
            <KVList
              rowH={26}
              rows={[
                ["SLA remaining", shortDateTime(text(at(record,"sla.responseDueAt"), ""))],
                ["Legal clearance", <Pill key="l" tone={checks.legal ? "green" : "amber"}>{checks.legal ? "Recorded" : "Pending"}</Pill>],
                ["Dispatch", checks.legal ? "Allowed after approval" : "Blocked until clearance"],
                ["Final verification", "Human decision"],
                ["AI recommendation", "Review only"],
              ]}
            />
          </Panel>

          <Panel title="Verification notes">
            <p className={`text-[15.3px] ${ink}`}>Reviewer remarks</p>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              aria-label="Reviewer remarks"
              className={`mt-[3px] h-[46px] w-full resize-none rounded-[6px] border border-[#c9d2e0] bg-white px-[11px] py-[6px] text-[15.3px] outline-none focus:border-[#5b7fe0] ${ink}`}
            />
            <div className="mt-[4px]">
              <Check label="Evidence reviewed" checked={checks.evidence} onChange={(v) => setChecks({ ...checks, evidence: v })} />
              <Check label="Legal clearance recorded" checked={checks.legal} onChange={(v) => setChecks({ ...checks, legal: v })} />
              <Check label="Eligibility confirmed" checked={checks.eligibility} onChange={(v) => setChecks({ ...checks, eligibility: v })} />
            </div>
            <Buttons className="!mt-[6px]">
              <Btn primary disabled={!live.canAct("Save draft")} onClick={save}>Save draft</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Escalate</Btn>
            </Buttons>
            <SubLabel>Verification history</SubLabel>
            <KVList
              rowH={24}
              rows={[
                [shortDateTime(text(live.timeline[0]?.at,"")),text(live.timeline[0]?.summary)],
                [shortDateTime(text(live.timeline[1]?.at,"")),text(live.timeline[1]?.summary)],
                ["Final approver",text(at(record,"verification.verifiedBy"))],
              ]}
            />
            <Buttons className="!mt-[6px]">
              <Btn onClick={() => setTab("Documents")}>Preview evidence</Btn>
              <Btn onClick={() => setTab("Audit History")}>View history</Btn>
            </Buttons>
          </Panel>
        </Col>
      </Columns>
      {notice.node}
    </Screen>
  );
}
