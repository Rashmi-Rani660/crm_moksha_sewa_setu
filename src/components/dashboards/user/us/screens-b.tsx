"use client";

/** US-006 … US-010 — demo data only; actions show what would happen once the backend exists. */

import Link from "next/link";
import { useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { Btn, Btns, Card, CheckItem, DropZone, Field, Flow, Lines, Note, Progress, SearchBox, SelectBox, Table, TextArea, Tiles, UserFrame, btnOutline, btnSolid } from "./kit";
import { usRoutes } from "./routes";

const rows2 = "grid gap-[10px] lg:min-h-0 lg:flex-1";

/* --------------------------------- US-006 ---------------------------------- */

const categories = ["Unclaimed body", "EWS family", "Unsupported person"] as const;
const priorities = ["Urgent", "High", "Normal"] as const;
const authorityHint: Record<(typeof categories)[number], string> = {
  "Unclaimed body": "Required for selected category",
  "EWS family": "Optional",
  "Unsupported person": "Required for selected category",
};

export function US006CreateRequest() {
  const notice = useNotice();
  const [mobileSearch, setMobileSearch] = useState("");
  const [f, setF] = useState({ source: "Helpline", requester: "Demo requester", mobile: "98XXXXXX01", city: "Ghaziabad", locality: "Mohan Nagar", authority: "", notes: "Assistance requested for dignified final rites." });
  const [category, setCategory] = useState<(typeof categories)[number]>("Unclaimed body");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("Urgent");
  const [checks, setChecks] = useState({ contact: true, privacy: false, noPaid: true });
  const [savedAt, setSavedAt] = useState("09:50");
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const required = [f.source, f.requester, f.mobile, f.city, f.locality];
  const now = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <UserFrame code="US-006" active="sewa-requests" title="Create & Update Sewa Request">
      <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[690fr_460fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Card title="Request form • Draft" bodyClassName="flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[8px] sm:flex-row">
            <div className="min-w-0 flex-1"><Field value={mobileSearch} onChange={setMobileSearch} placeholder="Find existing contact by mobile" /></div>
            <Btns className="shrink-0">
              <Btn onClick={() => notice.show(mobileSearch.trim() ? `No existing contact found for ${mobileSearch} (demo).` : "Enter a mobile number to search first.")}>Find contact</Btn>
              <Btn onClick={() => notice.show("AI auto-fill suggestions added — review each field before saving (demo).")}>AI auto-fill</Btn>
            </Btns>
          </div>
          <Note>Free Sewa only • Auto-save draft • Required fields marked *</Note>
          <div className="grid gap-x-[8px] gap-y-[7px] sm:grid-cols-2">
            <Field label="Request ID" value="Auto-generated on save" readOnly />
            <Field label="Source *" value={f.source} onChange={set("source")} />
            <Field label="Requester / authority *" value={f.requester} onChange={set("requester")} />
            <Field label="Mobile / contact *" value={f.mobile} onChange={set("mobile")} />
            <Field label="City *" value={f.city} onChange={set("city")} />
            <Field label="Pickup locality *" value={f.locality} onChange={set("locality")} />
            <Field label="Authority reference (if applicable)" value={f.authority} onChange={set("authority")} placeholder={authorityHint[category]} />
            <Field label="Document status" value="Review required" readOnly />
            <SelectBox label="Beneficiary category *" value={category} options={categories} onChange={setCategory} />
            <SelectBox label="Priority" value={priority} options={priorities} onChange={setPriority} />
          </div>
          <TextArea label="Request notes" value={f.notes} onChange={set("notes")} />
          <Btns>
            <Btn solid onClick={() => (setSavedAt(now()), notice.show("Draft saved securely (demo)."))}>Save draft</Btn>
            <Btn
              onClick={() =>
                required.some((v) => !v.trim())
                  ? notice.show("Fill all required (*) fields before submitting.")
                  : !checks.noPaid
                    ? notice.show("Confirm “No paid package or cash collection” before submitting.")
                    : notice.show("Submitted for verification — request ID REQ-26-1106 generated (demo).")
              }
            >
              Submit for verification
            </Btn>
            <Btn onClick={() => notice.show("Voice input: speak the notes; text is shown for review before saving (demo).")}>Voice input</Btn>
            <Btn onClick={() => notice.show(`Last draft (saved ${savedAt}) restored.`)}>Resume draft</Btn>
          </Btns>
        </Card>
        <Card title="Smart assistance & checks" bodyClassName="flex flex-col gap-[6px]">
          <Lines rows={[["Existing contact", "Search before creating"], ["Duplicate match", "*Review"], ["Service coverage", f.city.trim().toLowerCase() === "ghaziabad" ? "*Active" : "*Coming soon"], ["Consent / notice", "Record as applicable"], ["Data entry", "AI suggestions need review"]]} />
          <CheckItem label="Contact / authority details confirmed" checked={checks.contact} onChange={(v) => setChecks({ ...checks, contact: v })} />
          <CheckItem label="Privacy notice provided where applicable" checked={checks.privacy} onChange={(v) => setChecks({ ...checks, privacy: v })} />
          <CheckItem label="No paid package or cash collection" checked={checks.noPaid} onChange={(v) => setChecks({ ...checks, noPaid: v })} />
          <Note boxed>Category-specific legal documents will appear on the verification screen. No promise of service before authorised checks.</Note>
          <div><Link href={usRoutes.verification} className={btnSolid}>Open verification</Link></div>
          <Note>Draft status: saved at {savedAt} · demo. Review AI suggestions before submission.</Note>
          <div><Btn onClick={() => notice.show("Possible duplicate: REQ-26-1101 (same locality, 12 min ago) — compare before creating (demo).")}>Review duplicate</Btn></div>
        </Card>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-007 ---------------------------------- */

type Doc = { name: string; status: "Verified" | "Missing" | "Review" };
const initialDocs: Doc[] = [
  { name: "Authority reference", status: "Verified" },
  { name: "Identity / record", status: "Verified" },
  { name: "Death record", status: "Verified" },
  { name: "Police release (if required)", status: "Missing" },
  { name: "Supporting record", status: "Review" },
];

export function US007Verification() {
  const notice = useNotice();
  const [docs, setDocs] = useState(initialDocs);
  const [sel, setSel] = useState(0);
  const received = docs.filter((d) => d.status !== "Missing").length;
  const upload = (i: number, file?: string) => {
    setDocs(docs.map((d, k) => (k === i ? { ...d, status: "Review" } : d)));
    notice.show(`${file ?? docs[i].name} uploaded — file scan and authorised review pending (demo).`);
  };
  return (
    <UserFrame code="US-007" active="sewa-requests" title="Verification & Documents">
      <Tiles
        items={[
          { value: `${String(received).padStart(2, "0")} / 05`, label: "Documents received", tone: "blue" },
          { value: "03", label: "Verified by authority", tone: "green" },
          { value: String(docs.filter((d) => d.status === "Review").length).padStart(2, "0"), label: "Review due", tone: "orange" },
          { value: "Blocked", label: "Legal gate", tone: "red" },
        ]}
      />
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,2.75fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[670fr_480fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Verification checklist • REQ-26-1101" bodyClassName="flex flex-col gap-[8px]">
            <Table
              cols={["Document / check", "Status", "Action"]}
              selected={sel}
              onSelect={setSel}
              rows={docs.map((d, i) => [
                d.name,
                `*${d.status}`,
                d.status === "Missing" ? (
                  <Btn key={d.name} className="!h-[30px]" onClick={() => upload(i)}>Upload</Btn>
                ) : (
                  <Btn key={d.name} className="!h-[30px]" onClick={() => setSel(i)}>Preview</Btn>
                ),
              ])}
            />
            <Btns>
              <Btn solid onClick={() => { const i = docs.findIndex((d) => d.status === "Missing"); if (i < 0) notice.show("All documents received."); else upload(i); }}>Upload document</Btn>
              <Btn onClick={() => notice.show(received < 5 ? "Submitted for authorised review — missing documents are flagged (demo)." : "Submitted for authorised review (demo).")}>Submit for review</Btn>
              <Btn onClick={() => notice.show("Escalated to your reporting Admin (demo).")}>Escalate</Btn>
            </Btns>
            <DropZone text="Drop PDF / image here or browse · secure upload" onFiles={(n) => { const i = docs.findIndex((d) => d.status === "Missing"); if (n.length) upload(i < 0 ? sel : i, n[0]); }} />
            <Progress value={(received / 5) * 100} label={`Documents received: ${received} of 5 · demo`} />
          </Card>
          <Card title="Selected document • preview" bodyClassName="flex flex-col gap-[8px]">
            <div className="rounded-[8px] border border-[#d6dbe6] bg-[#f8faff] px-[14px] py-[12px] text-[13px] font-normal leading-[1.9] text-[#1a1d36]">
              <p className="border-b border-[#5b6280] pb-[6px] font-medium">{docs[sel].status === "Missing" ? "Document not uploaded" : `Sample ${docs[sel].name.toLowerCase()}`}</p>
              <p className="mt-[6px]">Reference: DEMO-00{sel + 1}</p>
              <p>Case: REQ-26-1101</p>
              <p>Document image not supplied</p>
              <p className="mt-[8px]">Secure viewer required in production</p>
            </div>
            <Lines rows={[["Review owner", "Authorised Admin"], ["User action", "Upload / submit only"], ["Dispatch", "*Blocked"]]} />
            <Btns>
              <Btn onClick={() => notice.show("Clarification request sent to the reviewer (demo).")}>Request clarification</Btn>
              <Btn onClick={() => notice.show("Zoomed preview opens in the secure viewer (demo).")}>Zoom preview</Btn>
            </Btns>
          </Card>
        </div>
        <Card title="Verification progress" bodyClassName="flex flex-col gap-[8px]">
          <Flow steps={["Intake", "Eligibility", "Documents", "Authority clearance", "Dispatch"]} green={[1, 3]} />
          <Note>Mandatory clearance cannot be bypassed. Checklist varies by category and authorised procedure.</Note>
        </Card>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-008 ---------------------------------- */

const cases = [
  { id: "MS-26-1101", cat: "Unclaimed body", stage: "Clearance pending", next: "Review documents", act: "Review docs", href: usRoutes.verification, emergency: "Yes", gate: "Blocked", step: "Submit missing document" },
  { id: "MS-26-1099", cat: "EWS family", stage: "In service", next: "Update progress", act: "Quick update", href: "", emergency: "No", gate: "Cleared", step: "Update progress" },
  { id: "MS-26-1098", cat: "Unsupported person", stage: "In service", next: "Evidence upload", act: "Evidence", href: usRoutes.completion, emergency: "No", gate: "Cleared", step: "Upload completion evidence" },
];

export function US008MyCases() {
  const notice = useNotice();
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All statuses");
  const visible = cases.map((c, i) => ({ c, i })).filter(({ c }) => (status === "All statuses" || c.stage === status) && `${c.id} ${c.cat}`.toLowerCase().includes(q.toLowerCase()));
  const cur = cases[sel];
  return (
    <UserFrame code="US-008" active="my-cases" title="My Assigned Cases">
      <Tiles
        items={[
          { value: "03", label: "Assigned active cases", tone: "blue" },
          { value: "01", label: "Emergency", tone: "red" },
          { value: "02", label: "In progress", tone: "sky" },
          { value: "01", label: "Awaiting clearance", tone: "orange" },
        ]}
      />
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,1.6fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[715fr_435fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="My assigned cases" bodyClassName="flex flex-col gap-[8px]">
            <div className="flex flex-col gap-[8px] sm:flex-row">
              <SearchBox value={q} onChange={setQ} placeholder="Search" />
              <SelectBox hideLabel label="Status" value={status} options={["All statuses", "Clearance pending", "In service"]} onChange={setStatus} />
            </div>
            <Table
              cols={["Case ID", "Category", "Current stage", "Next action", "Action"]}
              selected={visible.findIndex((v) => v.i === sel)}
              onSelect={(k) => setSel(visible[k].i)}
              rows={visible.map(({ c }) => [
                c.id,
                c.cat,
                `*${c.stage}`,
                c.next,
                <span key={c.id} className="flex gap-[4px]">
                  <Link href={usRoutes.caseDetails} className={`${btnOutline} !h-[30px]`}>Open</Link>
                  {c.href ? (
                    <Link href={c.href} className={`${btnOutline} !h-[30px]`}>{c.act}</Link>
                  ) : (
                    <Btn className="!h-[30px]" onClick={() => notice.show(`${c.id}: progress update saved to the case timeline (demo).`)}>{c.act}</Btn>
                  )}
                </span>,
              ])}
            />
            <div><Link href={usRoutes.caseDetails} className={btnSolid}>View selected case</Link></div>
          </Card>
          <Card title="Case at a glance" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Selected", cur.id], ["Emergency", cur.emergency === "Yes" ? "*Yes" : "No"], ["Owner", "User 07"], ["Location", "Ghaziabad"], ["Legal gate", cur.gate === "Blocked" ? "*Blocked" : "*Verified"], ["Next step", cur.step]]} />
            <Btns>
              <Link href={usRoutes.caseDetails} className={btnSolid}>Open details</Link>
              <Link href={usRoutes.verification} className={btnOutline}>Documents</Link>
            </Btns>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[670fr_480fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="My case stages" bodyClassName="flex flex-col gap-[10px]">
            <Flow steps={["Assigned", "Verification", "In service", "Evidence", "Review"]} green={[1, 3]} />
            <Lines rows={[["Awaiting clearance", "01"], ["In service", "02"]]} />
          </Card>
          <Card title="Recent activity">
            <Lines rows={[["09:45", "Case assigned"], ["09:50", "Document review requested"], ["10:00", "Admin follow-up due"]]} />
          </Card>
        </div>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-009 ---------------------------------- */

export function US009CaseDetails() {
  const notice = useNotice();
  const [note, setNote] = useState("Awaiting required authority clearance.");
  const [timeline, setTimeline] = useState(["09:45 · Assigned by Admin 01", "09:50 · Supporting documents received", "10:00 · Legal verification pending", "Next · Authorised clearance required"]);
  return (
    <UserFrame code="US-009" active="my-cases" title="Case Details, Progress & Escalation">
      <Tiles
        items={[
          { value: "MS-26-1101", label: "Case", tone: "blue" },
          { value: "Emergency", label: "Priority", tone: "red" },
          { value: "Blocked", label: "Legal gate", tone: "red" },
          { value: "User 07", label: "Owner", tone: "sky" },
        ]}
      />
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,1.45fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[640fr_500fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Case summary & quick update" bodyClassName="flex flex-col gap-[6px]">
            <Lines rows={[["Linked request", "REQ-26-1101"], ["Beneficiary", "Unclaimed body"], ["Service", "Free cremation support"], ["Location", "Ghaziabad"], ["Contact", "Authority · masked"], ["Current stage", "Verification"]]} />
            <TextArea label="Progress note" value={note} onChange={setNote} />
            <Btns>
              <Btn
                solid
                onClick={() => {
                  if (!note.trim()) return notice.show("Write a progress note first.");
                  const t = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
                  setTimeline([...timeline.slice(0, -1), `${t} · ${note.trim()}`, timeline[timeline.length - 1]]);
                  notice.show("Update saved to the case timeline and daily report (demo).");
                }}
              >
                Save update
              </Btn>
              <Link href={usRoutes.verification} className={btnOutline}>Open documents</Link>
              <Btn onClick={() => window.confirm("Escalate MS-26-1101 to your reporting Admin?") && notice.show("Escalated to reporting Admin — clearance is not overridden (demo).")}>Escalate to Admin</Btn>
              <Btn onClick={() => notice.show("Voice note: recording is converted to text for review before saving (demo).")}>Voice note</Btn>
            </Btns>
          </Card>
          <Card title="Timeline & pending actions" bodyClassName="flex flex-col gap-[6px]">
            <ul className="flex flex-col gap-[6px]">
              {timeline.map((t) => (
                <li key={t} className="rounded-[5px] border-l-[3px] border-[#3a7bd5] bg-[#f1f4fa] px-[8px] py-[5px] text-[13px] font-normal text-[#1a1d36]">{t}</li>
              ))}
            </ul>
            <Lines rows={[["Vehicle", "Not released"], ["Field coordination", "Awaiting approval"], ["SLA", "Server timer required"]]} />
            <Btns>
              <Btn solid onClick={() => notice.show("Resource request sent for approval (demo).")}>Request resource</Btn>
              <Btn onClick={() => notice.show("Calling reporting Admin through the official line (demo).")}>Call reporting Admin</Btn>
            </Btns>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-2 lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Communication & evidence" bodyClassName="flex flex-col gap-[8px]">
            <Lines rows={[["Last official contact", "09:50 · demo"], ["Evidence", "Restricted access"], ["Expenses", "Submit separately"]]} />
            <div><Link href={usRoutes.completion} className={btnSolid}>Add evidence</Link></div>
            <Btns>
              <Btn onClick={() => notice.show("Official call to the masked contact (demo).")}>Call contact</Btn>
              <Btn onClick={() => notice.show("WhatsApp reply with an approved template (demo).")}>WhatsApp reply</Btn>
              <Btn onClick={() => notice.show("Vehicle request sent — dispatch waits for legal clearance (demo).")}>Request vehicle</Btn>
              <Btn onClick={() => notice.show("Material request sent to the store (demo).")}>Request material</Btn>
            </Btns>
          </Card>
          <Card title="Safety & escalation" bodyClassName="flex flex-col gap-[10px]">
            <Note>Urgent assistance: notify reporting Admin. Emergency escalation does not bypass mandatory legal clearance.</Note>
            <div><Btn solid onClick={() => window.confirm("Raise an urgent alert to your reporting Admin?") && notice.show("Urgent alert raised (demo).")}>Raise urgent alert</Btn></div>
          </Card>
        </div>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-010 ---------------------------------- */

type Ev = { name: string; status: "Uploaded" | "Missing" };

export function US010CaseCompletion() {
  const notice = useNotice();
  const [evidence, setEvidence] = useState<Ev[]>([
    { name: "Service record", status: "Uploaded" },
    { name: "Handover record", status: "Uploaded" },
    { name: "Completion evidence", status: "Missing" },
  ]);
  const [material, setMaterial] = useState(false);
  const [remarks, setRemarks] = useState("Service completion recorded; supporting evidence awaiting upload.");
  const [feedback, setFeedback] = useState("Not requested yet");
  const [publicity, setPublicity] = useState(false);
  const evDone = evidence.every((e) => e.status === "Uploaded");
  const steps = [true, true, true, evDone, material];
  const done = steps.filter(Boolean).length;
  const uploaded = evidence.filter((e) => e.status === "Uploaded").length;
  const upload = (file?: string) => {
    setEvidence(evidence.map((e) => (e.status === "Missing" ? { ...e, status: "Uploaded" } : e)));
    notice.show(`${file ?? "Completion evidence"} uploaded — verification by Admin pending (demo).`);
  };
  return (
    <UserFrame code="US-010" active="my-cases" title="Case Completion, Evidence & Feedback">
      <Tiles
        items={[
          { value: "MS-26-1098", label: "Case", tone: "blue" },
          { value: `${String(uploaded).padStart(2, "0")} / 03`, label: "Evidence", tone: "orange" },
          { value: "Pending", label: "Review", tone: "orange" },
          { value: "Not submitted", label: "Closure", tone: "sky" },
        ]}
      />
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,3.3fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[615fr_535fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Completion checklist" bodyClassName="flex flex-col gap-[4px]">
            <Progress value={(done / 5) * 100} label={`Completion checklist: ${done} of 5 steps · demo`} />
            <CheckItem label="Service completion recorded" checked disabled />
            <CheckItem label="Required legal clearance recorded" checked disabled />
            <CheckItem label="Vehicle / authority handover recorded where applicable" checked disabled />
            <CheckItem label="Evidence uploaded and verified" checked={evDone} disabled />
            <CheckItem label="Material and expense records submitted" checked={material} onChange={setMaterial} />
            <TextArea label="Completion remarks" value={remarks} onChange={setRemarks} />
            <Btns className="mt-[4px]">
              <Btn solid onClick={() => notice.show("Draft saved (demo).")}>Save draft</Btn>
              <Btn onClick={() => notice.show(done < 5 ? "Submission is disabled until all required evidence and records are complete." : "Submitted for Admin approval — you cannot approve your own closure (demo).")}>Submit for approval</Btn>
            </Btns>
          </Card>
          <Card title="Evidence & feedback" bodyClassName="flex flex-col gap-[6px]">
            <Table
              cols={["File / record", "Status", "Action"]}
              rows={evidence.map((e) => [
                e.name,
                `*${e.status}`,
                e.status === "Missing" ? (
                  <Btn key={e.name} className="!h-[30px]" onClick={() => upload()}>Upload</Btn>
                ) : (
                  <Btn key={e.name} className="!h-[30px]" onClick={() => notice.show(`${e.name}: secure preview (demo).`)}>Preview</Btn>
                ),
              ])}
            />
            <TextArea label="Optional family feedback" value={feedback} onChange={setFeedback} />
            <CheckItem label="Separate consent recorded for publicity" checked={publicity} onChange={setPublicity} />
            <div><Btn solid onClick={() => notice.show("Feedback saved — it is optional and never a condition of free Sewa (demo).")}>Add feedback</Btn></div>
            <DropZone text="Drop completion evidence or browse · upload required" onFiles={(n) => n.length && upload(n[0])} />
          </Card>
        </div>
        <Card title="Closure workflow" bodyClassName="flex flex-col gap-[8px]">
          <Flow steps={["Submit evidence", "Admin review", "Correct if returned", "Authorised closure"]} green={[1, 3]} />
          <Note>User submits completion for review; cannot approve own closure. Feedback is optional and never a condition of free Sewa.</Note>
        </Card>
      </div>
      {notice.node}
    </UserFrame>
  );
}
