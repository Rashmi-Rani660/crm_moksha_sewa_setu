"use client";

/**
 * SA-014 — Sewa Request Details & Verification (demo data).
 * Eligibility, death documentation and authorised claimant / competent
 * authority clearance are checked; AI never grants final legal clearance;
 * personal details are masked; verifier, approval and evidence are recorded.
 */

import { useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { screenPicker1120 } from "@/components/dashboards/super-admin/routes";
import { Btn, Buttons, Check, Col, Columns, DataTable, Field, KVList, NativeSelect, Panel, Pill, Screen, SubLabel, TextBox, ink } from "@/components/dashboards/super-admin/screen-kit";

const tabs = ["Request Details", "Documents", "Eligibility & Legal", "Communication", "Audit History"] as const;
const categoryOpts = ["Unclaimed body", "Unsupported person", "EWS family"] as const;
const serviceOpts = ["Dignified cremation", "Body transportation", "Documentation assistance", "Family coordination"] as const;
const verifierOpts = ["Verification User 01", "Verification User 02", "Operations Admin"] as const;

const initialChecklist = [
  { item: "Death / hospital record", status: "Verified", owner: "Verification User 01" },
  { item: "Authority referral", status: "Verified", owner: "Verification User 01" },
  { item: "Legal clearance / handover", status: "Pending", owner: "Competent authority" },
  { item: "Eligibility / case approval", status: "Pending", owner: "Operations Admin" },
];

export default function SA014RequestDetails() {
  const notice = useNotice();
  const [tab, setTab] = useState<string>(tabs[0]);
  const [category, setCategory] = useState<string>(categoryOpts[0]);
  const [service, setService] = useState<string>(serviceOpts[0]);
  const [verifier, setVerifier] = useState<string>(verifierOpts[0]);
  const [checklist] = useState(initialChecklist);
  const [remarks, setRemarks] = useState("Await authorised handover and clearance.");
  const [checks, setChecks] = useState({ evidence: true, legal: false, eligibility: false });
  const [hold, setHold] = useState(false);

  return (
    <Screen
      code="SA-014"
      title="Sewa Request Details & Verification"
      active="sewa-operations"
      picker={screenPicker1120}
      kpis={[
        { value: "0001", label: "Request ID" },
        { value: "Critical", label: "Priority" },
        { value: "Active", label: "Coverage" },
        { value: `${checklist.filter((c) => c.status === "Verified").length} / 4`, label: "Documents" },
        { value: hold ? "On hold" : "Pending", label: "Eligibility" },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      <Columns>
        <Col>
          <Panel title="Request & beneficiary details" h={300}>
            <div className="grid grid-cols-1 gap-x-[13px] gap-y-[8px] sm:grid-cols-2">
              <Field label="Request ID"><TextBox value="MSR-26-27-0001" readOnly label="Request ID" /></Field>
              <Field label="Source"><TextBox value="AI inbound call" readOnly label="Source" /></Field>
              <Field label="Beneficiary category"><NativeSelect label="Beneficiary category" value={category} options={categoryOpts} onChange={setCategory} className="w-full" /></Field>
              <Field label="Service requested"><NativeSelect label="Service requested" value={service} options={serviceOpts} onChange={setService} className="w-full" /></Field>
              <Field label="City / centre"><TextBox value="Ghaziabad / HO" readOnly label="City / centre" /></Field>
              <Field label="Contact reference"><TextBox value="Masked / authorised authority" readOnly label="Contact reference" /></Field>
              <Field label="Assigned verifier"><NativeSelect label="Assigned verifier" value={verifier} options={verifierOpts} onChange={setVerifier} className="w-full" /></Field>
              <Field label="Received at"><TextBox value="26 Nov 2026 · 10:15 AM" readOnly label="Received at" /></Field>
            </div>
          </Panel>

          <Panel title="Verification checklist">
            <DataTable
              head={["Evidence / requirement", "Status", "Owner"]}
              pills={[1]}
              rows={checklist.map((c) => ({ key: c.item, cells: [c.item, c.status, c.owner] }))}
            />
            <Buttons>
              <Btn primary onClick={() => notice.show("Missing-document request sent to the authorised contact (demo).")}>Request missing documents</Btn>
              <Btn
                onClick={() =>
                  checks.legal && checks.eligibility
                    ? notice.show("Submitted for human approval (demo).")
                    : notice.show("Record legal clearance and eligibility before approval.")
                }
              >
                Submit for approval
              </Btn>
              <Btn onClick={() => setHold((h) => !h)}>{hold ? "Release hold" : "Place on hold"}</Btn>
            </Buttons>
          </Panel>
        </Col>

        <Col>
          <Panel title="Priority & legal gate" h={195}>
            <KVList
              rowH={26}
              rows={[
                ["SLA remaining", "00:35:00"],
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
              <Btn primary onClick={() => notice.show("Draft saved (demo).")}>Save draft</Btn>
              <Btn onClick={() => notice.show("Escalated to Operations Admin (demo).")}>Escalate</Btn>
            </Buttons>
            <SubLabel>Verification history</SubLabel>
            <KVList
              rowH={24}
              rows={[
                ["10:20 • Hospital record", "Verifier 01"],
                ["10:25 • Authority referral", "Verifier 01"],
                ["Final approver", "Operations Admin"],
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
