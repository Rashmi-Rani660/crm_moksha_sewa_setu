"use client";

/** SA-014 — Sewa Request Details & Verification. Demo data. */

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CircleCheck,
  Clock3,
  ClipboardCheck,
  Copy,
  Eye,
  FileText,
  Flame,
  History,
  Hospital,
  Layers,
  MapPin,
  MessageSquareText,
  Monitor,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  UserRoundCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  PrimaryButton,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  tdS,
  thS,
  useNotice,
} from "@/components/dashboards/super-admin/kit";
import { saRoutes } from "@/components/dashboards/super-admin/routes";

const tabs = ["Request Details", "Document Verification", "Verification History", "Approvals & Actions", "Related Records"] as const;
type Tab = (typeof tabs)[number];
const tabIcons: Partial<Record<Tab, LucideIcon>> = { "Request Details": ClipboardCheck, "Document Verification": FileText, "Verification History": History, "Approvals & Actions": ShieldCheck, "Related Records": Layers };

const REQUEST_ID = "SR-2026-011782";

const docs = [
  ["ID Proof (Requester)", "24 Nov 2026, 09:52 AM", "Verified"],
  ["Hospital Slip", "24 Nov 2026, 09:55 AM", "Verified"],
  ["Death Certificate /\nProvisional Record", "24 Nov 2026, 10:03 AM", "Under Review"],
  ["Address Proof\n(Requester / Family)", "24 Nov 2026, 09:58 AM", "Verified"],
  ["Consent Form\n(Family Declaration)", "24 Nov 2026, 10:01 AM", "Verified"],
  ["Additional Attachments\n(Photos / Other)", "", "Not Received"],
];

const timeline = [
  { title: "Request Received & Registered", by: "By System (Sewa Setu Portal)", at: "24 Nov 2026, 09:48 AM", state: "done" },
  { title: "Documents Uploaded", by: "By Ramesh Kumar Sharma (Requester)", at: "24 Nov 2026, 09:52 AM", state: "done" },
  { title: "Initial Verification (Documents)", by: "By Demo Admin 01 (Operations)", at: "24 Nov 2026, 10:06 AM", state: "done" },
  { title: "Hospital Record Cross-Check", by: "By Operations Executive (Hospital Desk)", at: "24 Nov 2026, 10:18 AM", state: "current" },
  { title: "Pending – Level 2 Approval", by: "Next: Review by Super Admin / Approving Authority", at: "", state: "todo" },
] as const;

type Decision = "Pending" | "Approved" | "Sent Back" | "Escalated";

export default function SA014RequestDetails() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Request Details");
  const [docStatus, setDocStatus] = useState(docs.map((d) => d[2]));
  const [decision, setDecision] = useState<Decision>("Pending");
  const [remarks, setRemarks] = useState("All mandatory documents received and verified.  Hospital record cross-checked.\nRequest is eligible for approval and field action.");
  const received = docStatus.filter((s) => s !== "Not Received").length;

  const decide = (d: Decision, question: string) => {
    if (!remarks.trim()) return notice.show("Add remarks before a decision.");
    if (!window.confirm(question)) return;
    setDecision(d);
    notice.show(`Request ${REQUEST_ID}: ${d.toLowerCase()} — recorded in the audit trail (demo).`);
  };

  return (
    <SuperAdminFrame active="sewa-operations">
      <PageHead icon={ClipboardCheck} title="Sewa Request Details & Verification" links={["Request Intake", "Document Verification", "Family / Hospital Details", "Approvals"]}>
        <Link href={saRoutes.leads} className="text-[13px] font-semibold text-[#2320c4] hover:underline">← Back to Leads & Requests</Link>
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="green" icon={CircleCheck} value="Verified" label="Verification Status" />
        <KpiTile tone="blue" icon={FileText} value={`${String(received).padStart(2, "0")} / 06`} label="Documents Received" />
        <KpiTile tone="orange" icon={ShieldCheck} value="Level 2" label="Approval Level" />
        <KpiTile tone="purple" icon={Clock3} value="04 Hrs 36 Min" label="SLA Timer" />
        <KpiTile tone="sky" icon={UsersRound} value="Admin 01" label="Assigned Admin" />
        <KpiTile tone="green" icon={MapPin} value="Ready" label="Field Readiness" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} icons={tabIcons} />

      <div className="grid gap-[10px] lg:h-[302px] lg:grid-cols-[400fr_410fr_535fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Request Summary" icon={UserRound} titleSize={15.5} bodyClassName="pt-[4px]">
          <dl className="grid grid-cols-[150px_1fr] gap-y-[3px] text-[12.4px]">
            <Row k="Request ID">
              <span className="flex items-center justify-between font-bold">
                {REQUEST_ID}
                <button type="button" aria-label="Copy request ID" onClick={() => { void navigator.clipboard?.writeText(REQUEST_ID); notice.show("Request ID copied."); }}>
                  <Copy strokeWidth={2} className="h-[14px] w-[14px]" />
                </button>
              </span>
            </Row>
            <Row k="Request Source"><span className="inline-flex items-center gap-[5px] rounded-[5px] bg-[#ece6fd] px-[8px] font-semibold text-[#3b2a8a]"><Monitor strokeWidth={2} className="h-[13px] w-[13px]" />Sewa Setu Portal</span></Row>
            <Row k="Service Type"><span className="flex items-center gap-[5px] font-semibold"><Flame strokeWidth={2} className="h-[14px] w-[14px] text-[#ef7a12]" />Antim Sanskar Sewa</span></Row>
            <Row k="Requester Name"><span className="flex items-center gap-[5px]"><UserRound strokeWidth={2} className="h-[13px] w-[13px]" />Ramesh Kumar Sharma</span></Row>
            <Row k="Mobile Number"><span className="flex items-center gap-[5px]"><Phone strokeWidth={2} className="h-[13px] w-[13px]" />+91 98765 43210</span></Row>
            <Row k="Patient/Deceased Name"><b>Smt. Kamla Devi Sharma</b></Row>
            <Row k="City"><span className="flex items-center gap-[5px]"><MapPin strokeWidth={2} className="h-[13px] w-[13px]" />Ghaziabad</span></Row>
            <Row k="Centre"><span className="flex items-center gap-[5px]"><Building2 strokeWidth={2} className="h-[13px] w-[13px]" />Ghaziabad Centre (HO)</span></Row>
            <Row k="Date & Time"><span className="flex items-center gap-[5px]"><CalendarDays strokeWidth={2} className="h-[13px] w-[13px]" />24 Nov 2026, 09:48 AM</span></Row>
            <Row k="Priority"><span className="inline-flex items-center gap-[5px] rounded-full bg-[#fde0e0] px-[9px] font-semibold text-[#b42318]"><TriangleAlert strokeWidth={2.2} className="h-[12px] w-[12px]" />High</span></Row>
          </dl>
        </Panel>

        <Panel title="Family / Hospital / Location Details" icon={UsersRound} titleSize={15.5} bodyClassName="flex flex-col gap-[6px] pt-[4px]">
          <SubHead icon={UsersRound} title="Family Details" />
          <dl className="grid grid-cols-[150px_1fr] gap-y-[3px] px-[4px] text-[12.2px]">
            <Row k="Family Contact">Rakesh Sharma (Son)</Row>
            <Row k="Alternate Mobile">+91 98111 22334</Row>
            <Row k="Relation">Son</Row>
            <Row k="No. of Family Members"><b>04</b></Row>
          </dl>
          <SubHead icon={Hospital} title="Hospital & Location Details" />
          <dl className="grid grid-cols-[150px_1fr] gap-y-[3px] px-[4px] text-[12.2px]">
            <Row k="Hospital Name">District Hospital, Ghaziabad</Row>
            <Row k="Hospital Reg. No.">DHGZ/2026/11847</Row>
            <Row k="Location (Pickup)">Ward No. 5, District Hospital, Ghaziabad</Row>
            <Row k="Service Centre (Processing)"><span className="flex items-center gap-[4px]"><MapPin strokeWidth={2} className="h-[12px] w-[12px]" />Ghaziabad Centre (HO)</span></Row>
            <Row k="Field Area"><span className="flex items-center gap-[4px]"><MapPin strokeWidth={2} className="h-[12px] w-[12px]" />Ghaziabad – City Zone</span></Row>
          </dl>
        </Panel>

        <Panel
          title="Document Verification"
          icon={FileText}
          titleSize={15.5}
          action={
            <button type="button" onClick={() => notice.show("Upload or view documents (demo).")} className="flex items-center gap-[4px] text-[12.5px] font-semibold text-[#2320c4] hover:underline">
              View / Upload Documents <ArrowRight strokeWidth={2.2} className="h-[13px] w-[13px]" />
            </button>
          }
          bodyClassName="pt-[4px]"
        >
          <TableWrap>
            <Thead>
              {["#", "Document", "Received On", "Status", "Action"].map((h) => <th key={h} className={`${thS} ${h === "Action" ? "text-center" : ""}`}>{h}</th>)}
            </Thead>
            <tbody>
              {docs.map((d, i) => {
                const st = docStatus[i];
                return (
                  <tr key={d[0]} className="border-b border-[#eef0f5] last:border-0">
                    <td className={`${tdS}`}>{String(i + 1).padStart(2, "0")}</td>
                    <td className={`${tdS} whitespace-pre-line leading-[14px]`}>{d[0]}</td>
                    <td className={tdS}>{d[1] ? <span className="flex items-center gap-[5px]"><CalendarDays strokeWidth={2} className="h-[13px] w-[13px]" />{d[1]}</span> : <ArrowRight strokeWidth={2} className="h-[14px] w-[14px]" />}</td>
                    <td className={tdS}>
                      <StatusPill className="h-[18px] w-[96px] gap-[4px] text-[11px]">{st}</StatusPill>
                    </td>
                    <td className={`${tdS} text-center`}>
                      {st === "Not Received" ? (
                        <button type="button" aria-label="Upload document" onClick={() => setDocStatus(docStatus.map((s, j) => (j === i ? "Under Review" : s)))} className="rounded-[5px] border border-[#2f4fe0] p-[2px] text-[#1d3fc4] hover:bg-[#f1f4ff]">
                          <Plus strokeWidth={2.4} className="h-[13px] w-[13px]" />
                        </button>
                      ) : (
                        <button type="button" aria-label={`View ${d[0]}`} onClick={() => st === "Under Review" ? setDocStatus(docStatus.map((s, j) => (j === i ? "Verified" : s))) : notice.show(`${d[0]} (demo).`)} title={st === "Under Review" ? "Mark as verified" : "View"} className="rounded-[5px] border border-[#cfd5e2] p-[2px] text-[#1d4fe0] hover:bg-[#f1f4ff]">
                          <Eye strokeWidth={2.2} className="h-[13px] w-[13px]" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </TableWrap>
        </Panel>
      </div>

      <div className="grid gap-[10px] lg:min-h-0 lg:flex-1 lg:grid-cols-[590fr_755fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Verification History / Timeline" icon={History} titleSize={15.5} bodyClassName="relative flex flex-col justify-between pt-[6px]">
          <span className="absolute bottom-[22px] left-[29px] top-[18px] w-[2px] bg-[#1f9a2b]/60" />
          {timeline.map((t) => (
            <div key={t.title} className="relative flex items-start gap-[12px]">
              <span className={`mt-[2px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[2.5px] bg-white ${t.state === "done" ? "border-[#1f9a2b] bg-[#1f9a2b]" : "border-[#1d4fe0]"}`}>
                {t.state === "done" ? <CircleCheck strokeWidth={3} className="h-[12px] w-[12px] text-white" /> : <span className={`h-[6px] w-[6px] rounded-full ${t.state === "current" ? "bg-[#1d4fe0]" : "bg-white"}`} />}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <b className="block text-[12.8px]">{t.title === "Pending – Level 2 Approval" && decision !== "Pending" ? `Level 2 Approval – ${decision}` : t.title}</b>
                <span className="text-[11.4px] font-medium">{t.by}</span>
              </span>
              {t.at && <span className="flex shrink-0 items-center gap-[5px] text-[12px] font-medium"><CalendarDays strokeWidth={2} className="h-[13px] w-[13px]" />{t.at}</span>}
            </div>
          ))}
        </Panel>

        <Panel title="Approving Authority" icon={UserRoundCheck} titleSize={15.5} bodyClassName="flex flex-col gap-[6px] pt-[4px]">
          {[
            ["Verified By", "Demo Admin 01 (Operations)", "24 Nov 2026, 10:06 AM", true],
            ["Reviewed By", "Operations Lead", "24 Nov 2026, 10:18 AM", true],
            ["Final Approver", "Super Admin", "", false],
          ].map(([k, v, at, done]) => (
            <div key={k as string} className="grid grid-cols-[150px_22px_1fr_auto] items-center rounded-[7px] border border-[#eef0f5] px-[10px] py-[3px] text-[12.6px]">
              <b>{k as string}</b>
              {done || decision === "Approved" ? <CircleCheck strokeWidth={2.2} className="h-[15px] w-[15px] text-[#1f9a2b]" /> : <span className="h-[14px] w-[14px] rounded-full border-[1.5px] border-[#5b6280]" />}
              <span className="font-medium">{v as string}</span>
              {at ? (
                <span className="flex items-center gap-[5px] font-medium"><CalendarDays strokeWidth={2} className="h-[13px] w-[13px]" />{at as string}</span>
              ) : (
                <StatusPill className="h-[18px] w-[90px] text-[11px]">{decision === "Pending" ? "Pending" : decision === "Approved" ? "Approved" : decision}</StatusPill>
              )}
            </div>
          ))}
          <p className="mt-[4px] flex items-center gap-[7px] text-[13px] font-bold"><MessageSquareText strokeWidth={2} className="h-[16px] w-[16px]" />Remarks (Verification / Approval)</p>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} aria-label="Remarks" className="min-h-[52px] flex-1 resize-none rounded-[8px] border border-[#cfd5e2] p-[8px] text-[12.6px] font-medium outline-none focus:border-[#5b6fe0]" />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:h-[40px] lg:grid-cols-[320fr_320fr_315fr_320fr]">
        <PrimaryButton icon={CircleCheck} className="h-[38px] text-[14.5px]" onClick={() => decide("Approved", "Approve this Sewa request? Maker–checker rules apply; your approval is recorded.")}>Approve Request</PrimaryButton>
        <PrimaryButton outline icon={RotateCcw} className="h-[38px] text-[14.5px]" onClick={() => decide("Sent Back", "Send back to the requester for clarification?")}>Send Back for Clarification</PrimaryButton>
        <Link href={saRoutes.createTask} className="flex h-[38px] items-center justify-center gap-[7px] rounded-[8px] border-[1.5px] border-[#2f4fe0] bg-white text-[14.5px] font-semibold text-[#1d3fc4] hover:bg-[#f1f4ff]">
          <UsersRound strokeWidth={2.2} className="h-[16px] w-[16px]" />Assign for Field Action
        </Link>
        <button type="button" onClick={() => decide("Escalated", "Escalate this request to Super Admin?")} className="flex h-[38px] items-center justify-center gap-[7px] rounded-[8px] border-[1.5px] border-[#e02424] bg-[#fff5f5] text-[14.5px] font-semibold text-[#c81e1e] hover:bg-[#ffecec]">
          <TriangleAlert strokeWidth={2.2} className="h-[16px] w-[16px]" />Escalate to Super Admin
        </button>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="font-semibold">{k}</dt>
      <dd className="min-w-0 font-medium">{children}</dd>
    </>
  );
}

function SubHead({ icon: I, title }: { icon: LucideIcon; title: string }) {
  return (
    <p className="flex items-center gap-[7px] rounded-[6px] bg-[#e9effa] px-[8px] py-[3px] text-[12.6px] font-bold">
      <I strokeWidth={2} className="h-[14px] w-[14px] text-[#1d4fe0]" />
      {title}
    </p>
  );
}

