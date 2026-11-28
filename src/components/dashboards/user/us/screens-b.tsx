"use client";

import { useRouter } from "next/navigation";

/** US-006 … US-010 — demo data only; actions show what would happen once the backend exists. */

import Link from "next/link";
import { useState } from "react";
import { useOperations } from "@/lib/crm/useOperations";
import { useRecordId } from "@/lib/crm/useResource";
import { useWorkforce } from "@/lib/crm/useWorkforce";
import { authorizedRequest } from "@/lib/api/authorized";
import { useDebounced } from "@/lib/api/useCrmQuery";
import { at, count, records, text, EMPTY, type CrmRecord } from "@/lib/crm/data";
import { humanize, shortDateTime } from "@/lib/format";
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
  const live = useOperations("requests",notice.show);
  const recordId = useRecordId();
  const record = recordId ? live.detail.data : null;
  const [mobileSearch, setMobileSearch] = useState("");
  const [draft, setF] = useState<Record<string,string>>({});
  const f = { source: draft.source ?? text(record?.channel,""),requester: draft.requester ?? text(at(record,"requester.name"),""),mobile: draft.mobile ?? text(at(record,"requester.mobile"),""),city: draft.city ?? text(at(record,"location.city"),""),locality: draft.locality ?? text(at(record,"location.area"),""),authority: draft.authority ?? "",notes: draft.notes ?? text(record?.notes,"") };
  const [category, setCategory] = useState<(typeof categories)[number]>("Unclaimed body");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("Urgent");
  const [checks, setChecks] = useState({ contact: true, privacy: false, noPaid: true });
  const [savedAt, setSavedAt] = useState(EMPTY);
  const set = (k: keyof typeof f) => (v: string) => setF({ ...draft, [k]: v });
  async function submit() {
    if (!checks.privacy || !checks.contact) return notice.show("Confirm the contact and privacy notice first.");
    if (!/^\d{10}$/.test(f.mobile)) return notice.show("Enter a valid 10-digit mobile number.");
    const pincode = record ? text(at(record,"location.pincode"),"") : window.prompt("Service PIN code (6 digits):")?.trim();
    const channel = live.master("REQUEST_CHANNEL").find(row => text(row.label).toLowerCase() === f.source.toLowerCase() || row.code === f.source.toUpperCase());
    const beneficiary = live.master("BENEFICIARY_CATEGORY").find(row => text(row.label).toLowerCase() === category.toLowerCase() || row.code === ({ "EWS family": "EWS","Unclaimed body": "UNCLAIMED","Unsupported person": "UNSUPPORTED" }[category]));
    if (!pincode || !channel || !beneficiary) return notice.show("Choose a configured request channel and beneficiary category.");
    const body = { requester: { name: f.requester,mobile: f.mobile },location: { city: f.city,area: f.locality,pincode },beneficiaryCategory: beneficiary.code,priority: priority === "Urgent" ? "CRITICAL" : priority.toUpperCase(),notes: f.notes };
    const saved = record ? await live.mutation.run<CrmRecord>('/requests/' + recordId, { method: "PATCH",body: { ...body,version: record.version } }, "Saved.") : await live.createRequest({ ...body,channel: channel.code,consentDataProcessing: true });
    if (saved) {
      let current = saved;
      if (f.authority && live.can("requests.edit")) {
        const legal = await live.mutation.run<CrmRecord>('/requests/' + saved.id + '/legal', { body: { version: current.version,state: "PENDING",referenceNo: f.authority } });
        if (legal) current = legal;
      }
      if (!record && live.can("requests.edit")) await live.mutation.run('/requests/' + saved.id + '/start-verification', { body: { version: current.version } }, "Verification started.");
      setSavedAt(shortDateTime(text(saved.updatedAt ?? saved.createdAt,"")));
    }
  }

  return (
    <UserFrame code="US-006" active="sewa-requests" title="Create & Update Sewa Request">
      <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[690fr_460fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Card title="Request form • Draft" bodyClassName="flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[8px] sm:flex-row">
            <div className="min-w-0 flex-1"><Field value={mobileSearch} onChange={setMobileSearch} placeholder="Find existing contact by mobile" /></div>
            <Btns className="shrink-0">
              <Btn onClick={async () => { if (!mobileSearch.trim()) return; const result = await authorizedRequest<CrmRecord[]>(`/requests?search=${encodeURIComponent(mobileSearch)}&limit=20`); notice.show(result.data.map(row => text(row.requestNo)).join("\n") || "No matching requests."); }}>Find contact</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>AI auto-fill</Btn>
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
            <Btn solid disabled onClick={() => notice.show(EMPTY)}>Save draft</Btn>
            <Btn
              disabled={live.mutation.busy || !live.can(record ? "requests.edit" : "requests.create")} onClick={submit}
            >
              Submit for verification
            </Btn>
            <Btn disabled onClick={() => notice.show(EMPTY)}>Voice input</Btn>
            <Btn disabled onClick={() => notice.show(EMPTY)}>Resume draft</Btn>
          </Btns>
        </Card>
        <Card title="Smart assistance & checks" bodyClassName="flex flex-col gap-[6px]">
          <Lines rows={[["Existing contact", "Search before creating"], ["Duplicate match", "*Review"], ["Service coverage", record ? humanize(text(record.coverage,"")) : EMPTY], ["Consent / notice", "Record as applicable"], ["Data entry", "AI suggestions need review"]]} />
          <CheckItem label="Contact / authority details confirmed" checked={checks.contact} onChange={(v) => setChecks({ ...checks, contact: v })} />
          <CheckItem label="Privacy notice provided where applicable" checked={checks.privacy} onChange={(v) => setChecks({ ...checks, privacy: v })} />
          <CheckItem label="No paid package or cash collection" checked={checks.noPaid} onChange={(v) => setChecks({ ...checks, noPaid: v })} />
          <Note boxed>Category-specific legal documents will appear on the verification screen. No promise of service before authorised checks.</Note>
          <div><Link href={usRoutes.verification} className={btnSolid}>Open verification</Link></div>
          <Note>Draft status: saved at {savedAt} · demo. Review AI suggestions before submission.</Note>
          <div><Btn onClick={() => notice.show(records(record?.possibleDuplicates).map(row => text(row.requestNo)).join("\n") || EMPTY)}>Review duplicate</Btn></div>
        </Card>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-007 ---------------------------------- */

type Doc = { name: string; status: "Verified" | "Missing" | "Review" };


export function US007Verification() {
  const notice = useNotice();
  const live = useOperations("requests",notice.show);
  const docs: (Doc & { id: string; url: string })[] = live.documents.map(row => ({ id: text(row.id),url: text(row.url,""),name: text(row.title ?? row.docType),status: at(row,"verification.state") === "VERIFIED" ? "Verified" : "Review" }));
  const [sel, setSel] = useState(0);
  const received = docs.filter((d) => d.status !== "Missing").length;
  const upload = () => { if (live.id) live.upload.pick('/requests/' + live.id + '/documents'); };

  return (
    <UserFrame code="US-007" active="sewa-requests" title="Verification & Documents">
      <Tiles
        items={[
          { value: `${String(received).padStart(2, "0")} / ${docs.length}`, label: "Documents received", tone: "blue" },
          { value: live.detail.data ? count(docs.filter(doc => doc.status === "Verified").length) : EMPTY, label: "Verified by authority", tone: "green" },
          { value: String(docs.filter((d) => d.status === "Review").length).padStart(2, "0"), label: "Review due", tone: "orange" },
          { value: humanize(text(at(live.detail.data,"legal.state"),"")), label: "Legal gate", tone: "red" },
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
                  <Btn key={d.name} className="!h-[30px]" onClick={() => upload()}>Upload</Btn>
                ) : (
                  <Btn key={d.name} className="!h-[30px]" onClick={() => setSel(i)}>Preview</Btn>
                ),
              ])}
            />
            <Btns>
              <Btn solid onClick={() => { const i = docs.findIndex((d) => d.status === "Missing"); if (i < 0) notice.show("All documents received."); else upload(); }}>Upload document</Btn>
              <Btn disabled={!live.canAct("Submit for approval")} onClick={() => live.act("Submit for approval")}>Submit for review</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Escalate</Btn>
            </Btns>
            <DropZone text="Drop PDF / image here or browse · secure upload" onFiles={() => {}} onFileObjects={(files) => { if (files[0] && live.id) void live.upload.uploadFile(`/requests/${live.id}/documents`,files[0]); }} />
            <Progress value={(received / 5) * 100} label={`Documents received: ${received} of 5 · demo`} />
          </Card>
          <Card title="Selected document • preview" bodyClassName="flex flex-col gap-[8px]">
            <div className="rounded-[8px] border border-[#d6dbe6] bg-[#f8faff] px-[14px] py-[12px] text-[13px] font-normal leading-[1.9] text-[#1a1d36]">
              <p className="border-b border-[#5b6280] pb-[6px] font-medium">{docs[sel]?.name ?? EMPTY}</p>
              <p className="mt-[6px]">Reference: {docs[sel]?.id ?? EMPTY}</p>
              <p>Case: {text(live.detail.data?.requestNo)}</p>
              <p>Document image not supplied</p>
              <p className="mt-[8px]">Secure viewer required in production</p>
            </div>
            <Lines rows={[["Review owner", "Authorised Admin"], ["User action", "Upload / submit only"], ["Dispatch", "*Blocked"]]} />
            <Btns>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Request clarification</Btn>
              <Btn onClick={() => { const url = docs[sel]?.url; if (url && /^https?:\/\//.test(url)) window.open(url,"_blank","noopener,noreferrer"); }}>Zoom preview</Btn>
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



export function US008MyCases() {
  const notice = useNotice();
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All statuses");
  const search = useDebounced(q.trim());
  const live = useOperations("cases",notice.show,{ search: search || undefined,active: true,stage: status === "In service" ? "IN_SERVICE" : undefined });
  const cases = live.rows.map(row => ({ recordId: text(row.id),id: row.displayId,cat: humanize(text(row.beneficiaryCategory,"")),stage: row.displayStatus,next: EMPTY,act: "Open",href: usRoutes.caseDetails + '?id=' + row.id,emergency: row.isEmergency ? "Yes" : "No",gate: EMPTY,step: EMPTY }));
  const visible = cases.map((c, i) => ({ c, i })).filter(({ c }) => (status === "All statuses" || c.stage === status) && `${c.id} ${c.cat}`.toLowerCase().includes(q.toLowerCase()));
  const cur = cases[sel] ?? cases[0] ?? { recordId: "",id: EMPTY,cat: EMPTY,stage: EMPTY,next: EMPTY,act: EMPTY,href: "",emergency: EMPTY,gate: EMPTY,step: EMPTY };
  return (
    <UserFrame code="US-008" active="my-cases" title="My Assigned Cases">
      <Tiles
        items={[
          { value: live.metric("active"), label: "Assigned active cases", tone: "blue" },
          { value: live.metric("emergencyActive"), label: "Emergency", tone: "red" },
          { value: live.metric("byStage.IN_SERVICE"), label: "In progress", tone: "sky" },
          { value: EMPTY, label: "Awaiting clearance", tone: "orange" },
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
              onSelect={(k) => { setSel(visible[k].i);live.select(cases[visible[k].i]?.recordId ?? null); }}
              rows={visible.map(({ c }) => [
                c.id,
                c.cat,
                `*${c.stage}`,
                c.next,
                <span key={c.id} className="flex gap-[4px]">
                  <Link href={`${usRoutes.caseDetails}?id=${c.recordId}`} className={`${btnOutline} !h-[30px]`}>Open</Link>
                  {c.href ? (
                    <Link href={c.href} className={`${btnOutline} !h-[30px]`}>{c.act}</Link>
                  ) : (
                    <Btn className="!h-[30px]" disabled onClick={() => notice.show(EMPTY)}>{c.act}</Btn>
                  )}
                </span>,
              ])}
            />
            <div><Link href={`${usRoutes.caseDetails}?id=${cur.recordId}`} className={btnSolid}>View selected case</Link></div>
          </Card>
          <Card title="Case at a glance" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Selected", cur.id], ["Emergency", cur.emergency === "Yes" ? "*Yes" : "No"], ["Owner",text(at(live.detail.data,"owner.name"))], ["Location",text(at(live.detail.data,"beneficiary.city"))], ["Legal gate", cur.gate], ["Next step", cur.step]]} />
            <Btns>
              <Link href={`${usRoutes.caseDetails}?id=${cur.recordId}`} className={btnSolid}>Open details</Link>
              <Link href={usRoutes.verification} className={btnOutline}>Documents</Link>
            </Btns>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[670fr_480fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="My case stages" bodyClassName="flex flex-col gap-[10px]">
            <Flow steps={["Assigned", "Verification", "In service", "Evidence", "Review"]} green={[1, 3]} />
            <Lines rows={[["Awaiting clearance",EMPTY],["In service",live.metric("byStage.IN_SERVICE")]]} />
          </Card>
          <Card title="Recent activity">
            <Lines rows={live.timeline.slice(-3).map(row => [shortDateTime(text(row.at,"")),text(row.summary)])} />
          </Card>
        </div>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-009 ---------------------------------- */

export function US009CaseDetails() {
  const router = useRouter();
  const notice = useNotice();
  const live = useOperations("cases",notice.show);
  const workforce = useWorkforce(notice.show);
  const record = live.detail.data;
  const [note, setNote] = useState("");
  const timeline = live.timeline.map(row => `${shortDateTime(text(row.at,""))} ? ${text(row.summary)}`);
  return (
    <UserFrame code="US-009" active="my-cases" title="Case Details, Progress & Escalation">
      <Tiles
        items={[
          { value: text(record?.caseNo), label: "Case", tone: "blue" },
          { value: humanize(text(record?.priority,"")), label: "Priority", tone: "red" },
          { value: humanize(text(at(record,"request.legal"),"")), label: "Legal gate", tone: "red" },
          { value: text(at(record,"owner.name")), label: "Owner", tone: "sky" },
        ]}
      />
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,1.45fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[640fr_500fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Case summary & quick update" bodyClassName="flex flex-col gap-[6px]">
            <Lines rows={[["Linked request", text(record?.requestNo)], ["Beneficiary", humanize(text(record?.beneficiaryCategory,""))], ["Service", Array.isArray(record?.services) ? record.services.join(" / ") : EMPTY], ["Location", text(at(record,"beneficiary.city"))], ["Contact", text(at(record,"beneficiary.requesterMobile"))], ["Current stage", humanize(text(record?.stage,""))]]} />
            <TextArea label="Progress note" value={note} onChange={setNote} />
            <Btns>
              <Btn
                solid
                disabled onClick={() => notice.show(EMPTY)}
              >
                Save update
              </Btn>
              <Link href={`${usRoutes.verification}?id=${text(record?.requestId,"")}`} className={btnOutline}>Open documents</Link>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Escalate to Admin</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Voice note</Btn>
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
              <Btn solid onClick={() => router.push(`/dashboard/user/resources-expenses?id=${live.id ?? ""}`)}>Request resource</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Call reporting Admin</Btn>
            </Btns>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-2 lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Communication & evidence" bodyClassName="flex flex-col gap-[8px]">
            <Lines rows={[["Last official contact", EMPTY], ["Evidence", "Restricted access"], ["Expenses", "Submit separately"]]} />
            <div><Link href={`${usRoutes.completion}?id=${live.id ?? ""}`} className={btnSolid}>Add evidence</Link></div>
            <Btns>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Call contact</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>WhatsApp reply</Btn>
              <Btn onClick={() => router.push(`/dashboard/user/resources-expenses?id=${live.id ?? ""}`)}>Request vehicle</Btn>
              <Btn onClick={() => router.push(`/dashboard/user/resources-expenses?id=${live.id ?? ""}`)}>Request material</Btn>
            </Btns>
          </Card>
          <Card title="Safety & escalation" bodyClassName="flex flex-col gap-[10px]">
            <Note>Urgent assistance: notify reporting Admin. Emergency escalation does not bypass mandatory legal clearance.</Note>
            <div><Btn solid disabled={!workforce.can("attendance.create") || workforce.mutation.busy} onClick={() => workforce.action("safety")}>Raise urgent alert</Btn></div>
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
  const live = useOperations("cases",notice.show);
  const record = live.detail.data;
  const evidence: (Ev & { url: string })[] = live.documents.map(row => ({ name: text(row.title ?? row.docType),status: "Uploaded",url: text(row.url,"") }));
  const [material, setMaterial] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [publicity, setPublicity] = useState(false);
  const evDone = evidence.length > 0 && evidence.every(e => e.status === "Uploaded");
  const steps = [record?.stage === "SERVICE_DELIVERED",at(record,"request.legal") === "CLEARED",false,evDone,material];
  const done = steps.filter(Boolean).length;
  const uploaded = evidence.filter((e) => e.status === "Uploaded").length;
  const upload = () => { if (live.id) live.upload.pick(`/cases/${live.id}/documents`); };

  return (
    <UserFrame code="US-010" active="my-cases" title="Case Completion, Evidence & Feedback">
      <Tiles
        items={[
          { value: text(record?.caseNo), label: "Case", tone: "blue" },
          { value: `${String(uploaded).padStart(2, "0")} / ${evidence.length}`, label: "Evidence", tone: "orange" },
          { value: humanize(text(record?.stage,"")), label: "Review", tone: "orange" },
          { value: humanize(text(record?.stage,"")), label: "Closure", tone: "sky" },
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
              <Btn solid disabled onClick={() => notice.show(EMPTY)}>Save draft</Btn>
              <Btn disabled={!live.canAct("Submit closure")} onClick={() => live.act("Submit closure", { summary: remarks, ...(feedback.trim() ? { familyFeedback: { rating: Number(window.prompt("Family rating (1 to 5):")), comment: feedback.trim() } } : {}) })}>Submit for approval</Btn>
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
                  <Btn key={e.name} className="!h-[30px]" onClick={() => { if (/^https?:\/\//.test(e.url)) window.open(e.url,"_blank","noopener,noreferrer"); }}>Preview</Btn>
                ),
              ])}
            />
            <TextArea label="Optional family feedback" value={feedback} onChange={setFeedback} />
            <CheckItem label="Separate consent recorded for publicity" checked={publicity} onChange={setPublicity} />
            <div><Btn solid disabled onClick={() => notice.show(EMPTY)}>Add feedback</Btn></div>
            <DropZone text="Drop completion evidence or browse · upload required" onFiles={() => {}} onFileObjects={(files) => { if (files[0] && live.id) void live.upload.uploadFile(`/cases/${live.id}/documents`,files[0]); }} />
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
