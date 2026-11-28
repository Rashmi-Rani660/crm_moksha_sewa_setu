"use client";

/** US-001 … US-005 — demo data only; actions show what would happen once the backend exists. */

import Link from "next/link";
import { useState } from "react";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { Btn, Btns, Card, Field, Lines, Note, SearchBox, SelectBox, Table, Tiles, UserFrame, btnOutline, btnSolid } from "./kit";
import { usRoutes } from "./routes";

const rows2 = "grid gap-[10px] lg:min-h-0 lg:flex-1";

/* --------------------------------- US-001 ---------------------------------- */

export function US001MyWorkDashboard() {
  const notice = useNotice();
  const quick: [string, string?][] = [
    ["New request", usRoutes.createRequest],
    ["Accept task"],
    ["Update case", usRoutes.caseDetails],
    ["Upload evidence", usRoutes.completion],
    ["Send reply"],
    ["Make call"],
    ["Submit expense"],
    ["Ask AI"],
    ["Resume draft", usRoutes.createRequest],
  ];
  const work: [string, string, string, string][] = [
    ["MS-26-1101 · Emergency", "Now", "Open case", usRoutes.caseDetails],
    ["TASK-026 · Verify documents", "*Overdue", "Open", usRoutes.verification],
    ["TASK-028 · Family follow-up", "*Overdue", "Open", usRoutes.planner],
    ["2 assignments", "*Accept pending", "Review", usRoutes.cases],
  ];
  return (
    <UserFrame code="US-001" title="My Work Dashboard">
      <Tiles
        items={[
          { value: "12", label: "Pending tasks", tone: "blue" },
          { value: "05", label: "Due today", tone: "orange" },
          { value: "02", label: "Overdue", tone: "red" },
          { value: "03", label: "Assigned cases", tone: "sky" },
          { value: "04", label: "Completed today", tone: "green" },
          { value: "06", label: "Pending replies", tone: "orange" },
        ]}
      />
      <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:h-[40px] lg:shrink-0 lg:grid-cols-9">
        {quick.map(([label, href], i) =>
          href ? (
            <Link key={label} href={href} className={`${i === 0 ? btnSolid : btnOutline} !h-[40px]`}>{label}</Link>
          ) : (
            <button key={label} type="button" onClick={() => notice.show(`${label}: opens the authorised quick action (demo).`)} className={`${btnOutline} !h-[40px]`}>{label}</button>
          ),
        )}
      </div>
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,1.55fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[690fr_460fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Priority work" bodyClassName="flex flex-col gap-[8px]">
            <div className="flex flex-wrap items-center gap-[8px] rounded-[6px] bg-[#eef3fb] px-[8px] py-[5px] text-[13px] font-normal">
              <span>Next action: Emergency case MS-26-1101 · Review clearance</span>
              <Link href={usRoutes.verification} className={btnOutline}>Continue</Link>
            </div>
            <Table
              cols={["Work", "Due / status", "Action"]}
              rows={work.map(([w, due, act, href], i) => [
                w,
                due,
                <Link key={w} href={href} className={`${i === 0 ? btnSolid : btnOutline} !h-[30px]`}>{act}</Link>,
              ])}
            />
          </Card>
          <Card title="Today’s planner" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["10:00 · Verification", "Due"], ["11:30 · Family follow-up", "Scheduled"], ["14:00 · Case update", "Scheduled"], ["16:00 · Daily report", "Scheduled"]]} />
            <div><Link href={usRoutes.planner} className={btnSolid}>Open planner</Link></div>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-3 lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Admin instructions" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Verify pending documents", "*New"], ["Upload service evidence", "Today"], ["Handover unresolved work", "End of shift"]]} />
            <div><Link href={usRoutes.notifications} className={btnSolid}>View instructions</Link></div>
          </Card>
          <Card title="Communication" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Pending emails", "02"], ["WhatsApp replies", "04"], ["Scheduled callbacks", "03"]]} />
            <div><Btn solid onClick={() => notice.show("Communication hub opens with your assigned threads only (demo).")}>Open hub</Btn></div>
          </Card>
          <Card title="AI work assistant" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Summarise my work", "Ask AI"], ["Find approved SOP", "Search"], ["Prepare daily report", "Draft"]]} />
            <div><Btn solid onClick={() => notice.show("AI assistant drafts from your authorised activity only; review before use (demo).")}>Ask AI</Btn></div>
          </Card>
        </div>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-002 ---------------------------------- */

export function US002WorkPlanner() {
  const notice = useNotice();
  const [view, setView] = useState<"Day" | "Week" | "Month">("Day");
  const [day, setDay] = useState(28);
  const today: [string, string, string, string, string][] = [
    ["10:00", "Case verification", "*Due", "Open", usRoutes.verification],
    ["11:30", "Family follow-up", "*Scheduled", "Open", usRoutes.caseDetails],
    ["12:30", "Team briefing", "*Meeting", "Details", ""],
    ["14:00", "Case update", "*Scheduled", "Open", usRoutes.caseDetails],
    ["16:00", "Daily report", "*Scheduled", "Draft", ""],
  ];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <UserFrame code="US-002" active="my-work-planner" title="Work Planner, Calendar & Handover">
      <Tiles
        items={[
          { value: "05", label: "Due today", tone: "orange" },
          { value: "02", label: "Overdue", tone: "red" },
          { value: "01", label: "Meetings", tone: "sky" },
          { value: "02", label: "Handover pending", tone: "purple" },
        ]}
      />
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,1.6fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[690fr_460fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title={`Today • ${day} Nov 2026`} bodyClassName="flex flex-col gap-[10px]">
            <Table
              cols={["Time", "Work / event", "Status", "Action"]}
              rows={today.map(([t, w, s, a, href]) => [
                t,
                w,
                s,
                href ? (
                  <Link key={t} href={href} className={`${btnOutline} !h-[30px]`}>{a}</Link>
                ) : (
                  <Btn key={t} className="!h-[30px]" onClick={() => notice.show(`${w}: ${a === "Draft" ? "daily report draft prepared from your activity log" : "meeting details opened"} (demo).`)}>{a}</Btn>
                ),
              ])}
            />
            <Btns>
              <Btn solid onClick={() => notice.show("Reminder added — conflicts are checked first (demo).")}>Add reminder</Btn>
              <Btn onClick={() => notice.show("Reschedule request sent to your reporting Admin (demo).")}>Request reschedule</Btn>
            </Btns>
          </Card>
          <Card title="Calendar & handover" bodyClassName="flex flex-col gap-[8px]">
            <div role="tablist" className="flex gap-[6px]">
              {(["Day", "Week", "Month"] as const).map((v) => (
                <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)} className={view === v ? btnSolid : btnOutline}>{v}</button>
              ))}
            </div>
            <div className="grid grid-cols-7 rounded-[6px] text-center text-[13px] font-normal">
              {days.map((d) => (
                <span key={d} className="bg-[#eef1f7] py-[5px]">{d}</span>
              ))}
              {(view === "Month" ? Array.from({ length: 14 }, (_, i) => 16 + i) : Array.from({ length: 7 }, (_, i) => 23 + i)).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDay(n)}
                  aria-pressed={day === n}
                  className={`mx-auto my-[4px] h-[26px] w-[30px] rounded-full text-[13px] ${day === n ? "bg-[#dde9fd] text-[#1d4fb8]" : "hover:bg-[#f1f4fb]"}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <Lines rows={[["Shift", "09:30–18:00"], ["Conflict check", "No demo conflict"], ["Handover owner", "Reporting Admin"]]} />
            <div><Btn solid onClick={() => notice.show("Handover draft prepared — the receiving owner must acknowledge (demo).")}>Prepare handover</Btn></div>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[690fr_460fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Pending work transfer" bodyClassName="flex flex-col gap-[10px]">
            <Table cols={["Record", "Pending action", "Receiving owner"]} rows={[["MS-26-1101", "Legal review", "Admin approval required"], ["TASK-028", "Callback", "Awaiting acknowledgement"]]} />
            <div><Btn solid onClick={() => notice.show("Handover submitted with timestamp; ownership changes after acknowledgement (demo).")}>Submit handover</Btn></div>
          </Card>
          <Card title="Reminders & appointments" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Family callback", "11:30"], ["Team meeting", "12:30"], ["Shift handover", "17:45"]]} />
            <Btns>
              <Btn solid onClick={() => notice.show("Reminder set (demo).")}>Set reminder</Btn>
              <Link href={usRoutes.dashboard} className={btnOutline}>Next work</Link>
              <Btn onClick={() => notice.show("Team meeting · 12:30 · briefing room / online link (demo).")}>Meeting details</Btn>
            </Btns>
          </Card>
        </div>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-003 ---------------------------------- */

type Msg = { time: string; text: string; priority: "Critical" | "High" | "Normal"; status: "Unread" | "Ack due" | "Read" | "Acknowledged"; from: string; deadline: string; body: string };
const initialMsgs: Msg[] = [
  { time: "09:45", text: "Emergency case assigned", priority: "Critical", status: "Unread", from: "Reporting Admin", deadline: "Now", body: "Emergency case MS-26-1101 assigned to you. Review clearance status before any field action." },
  { time: "09:40", text: "Verify pending documents", priority: "High", status: "Ack due", from: "Reporting Admin", deadline: "Today · 11:00", body: "Verify the required documents. Do not proceed with dispatch until authorised clearance is recorded." },
  { time: "09:30", text: "Shift handover reminder", priority: "Normal", status: "Read", from: "System", deadline: "17:45", body: "Prepare your shift handover before 17:45." },
  { time: "Yesterday", text: "Updated legal SOP", priority: "Normal", status: "Read", from: "Admin 01", deadline: "—", body: "The legal verification SOP has a new approved version." },
  { time: "Yesterday", text: "Training due", priority: "Normal", status: "Unread", from: "Training", deadline: "This week", body: "Sensitive case handling refresher is due this week." },
];

export function US003Notifications() {
  const notice = useNotice();
  const [msgs, setMsgs] = useState(initialMsgs);
  const [sel, setSel] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [prio, setPrio] = useState("All priorities");
  const visible = msgs
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => (status === "All statuses" || m.status === status) && (prio === "All priorities" || m.priority === prio) && m.text.toLowerCase().includes(q.toLowerCase()));
  const cur = msgs[sel];
  const update = (i: number, s: Msg["status"]) => setMsgs(msgs.map((m, k) => (k === i ? { ...m, status: s } : m)));
  const pill = (p: string) => (p === "Normal" || p === "Read" ? p : `*${p}`);
  return (
    <UserFrame code="US-003" active="notifications-instructions" title="Notifications & Admin Instructions">
      <Tiles
        items={[
          { value: String(2 + msgs.filter((m) => m.status === "Unread").length).padStart(2, "0"), label: "Unread", tone: "blue" },
          { value: String(1 + msgs.filter((m) => m.status === "Ack due").length).padStart(2, "0"), label: "Acknowledgement due", tone: "orange" },
          { value: "01", label: "Critical", tone: "red" },
          { value: "02", label: "Announcements", tone: "purple" },
        ]}
      />
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,1.7fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[690fr_460fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="My notifications" bodyClassName="flex flex-col gap-[8px]">
            <div className="flex flex-col gap-[8px] sm:flex-row">
              <SearchBox value={q} onChange={setQ} placeholder="Search" />
              <SelectBox hideLabel label="Status" value={status} options={["All statuses", "Unread", "Ack due", "Read", "Acknowledged"]} onChange={setStatus} />
              <SelectBox hideLabel label="Priority" value={prio} options={["All priorities", "Critical", "High", "Normal"]} onChange={setPrio} />
            </div>
            <Table cols={["Time", "Message", "Priority", "Status"]} rows={visible.map(({ m }) => [m.time, m.text, pill(m.priority), pill(m.status)])} selected={visible.findIndex((v) => v.i === sel)} onSelect={(k) => setSel(visible[k].i)} />
            <Btns>
              <Btn solid onClick={() => (cur.status === "Acknowledged" ? notice.show("Already acknowledged.") : (update(sel, "Acknowledged"), notice.show(`“${cur.text}” acknowledged · timestamp recorded (demo).`)))}>Acknowledge selected</Btn>
              <Btn onClick={() => (update(sel, cur.status === "Unread" ? "Read" : cur.status), notice.show("Marked read — acknowledgement is still separate (demo)."))}>Mark read</Btn>
            </Btns>
          </Card>
          <Card title="Selected instruction" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["From", cur.from], ["Received", `28 Nov · ${cur.time}`], ["Deadline", cur.deadline], ["Linked case", "MS-26-1101"]]} />
            <Note boxed>{cur.body}</Note>
            <Btns>
              <Btn solid onClick={() => (update(sel, "Acknowledged"), notice.show("Instruction acknowledged (demo)."))}>Acknowledge</Btn>
              <Link href={usRoutes.verification} className={btnOutline}>Open documents</Link>
            </Btns>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-2 lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Announcements & reminders" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Updated SOP", "Read approved version"], ["Training refresher", "Due this week"], ["Critical alerts", "Cannot mute"]]} />
            <div><Btn solid onClick={() => notice.show("Approved SOP version opened (demo).")}>View SOP</Btn></div>
          </Card>
          <Card title="Delivery & acknowledgement">
            <Lines rows={[["Read", "Separate from acknowledgement"], ["Acknowledged by", "User 07"], ["History", "Timestamp recorded on server"]]} />
          </Card>
        </div>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-004 ---------------------------------- */

export function US004MyProfile() {
  const notice = useNotice();
  return (
    <UserFrame code="US-004" active="my-profile-hrms" title="My Profile, Attendance & HRMS">
      <Tiles
        items={[
          { value: "Present", label: "Attendance today", tone: "green" },
          { value: "On duty", label: "Duty status", tone: "sky" },
          { value: "01", label: "Leave requests", tone: "orange" },
          { value: "Current", label: "HRMS sync", tone: "green" },
        ]}
      />
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,1.5fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[640fr_500fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="My employee profile" bodyClassName="flex flex-col gap-[10px]">
            <div className="grid gap-x-[8px] gap-y-[8px] sm:grid-cols-2">
              <Field label="Employee ID" value="EMP-007" readOnly />
              <Field label="Name" value="Demo User 07" readOnly />
              <Field label="Department" value="Sewa Operations" readOnly />
              <Field label="Reporting Admin" value="Admin 01" readOnly />
              <Field label="Service centre" value="Ghaziabad" readOnly />
              <Field label="Mobile" value="98XXXXXX07" readOnly />
            </div>
            <Btns>
              <Btn solid onClick={() => notice.show("Correction request sent to HRMS — profile fields cannot be edited here (demo).")}>Request correction</Btn>
              <Btn onClick={() => notice.show("Personal settings: language and notification preferences (demo).")}>Personal settings</Btn>
            </Btns>
          </Card>
          <Card title="Attendance & duty" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Check-in", "09:30 AM"], ["Check-out", "Not recorded"], ["Shift", "09:30–18:00"], ["Last sync", "09:35 AM · demo"], ["Leave balance", "From HRMS"]]} />
            <Btns>
              <Btn solid onClick={() => notice.show("Leave request submitted to HRMS for approval (demo).")}>Request leave</Btn>
              <Btn onClick={() => notice.show("Attendance correction request submitted to HRMS (demo).")}>Attendance correction</Btn>
            </Btns>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[640fr_500fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Attendance history" bodyClassName="flex flex-col gap-[8px]">
            <Table cols={["Date", "In", "Out", "Status"]} rows={[["28 Nov", "09:30", "—", "Present"], ["27 Nov", "09:27", "18:03", "Present"], ["26 Nov", "09:35", "18:01", "Present"]]} />
            <Note>Recent attendance: 3 / 3 days present · demo sample</Note>
          </Card>
          <Card title="Account & privacy">
            <Lines rows={[["Access level", "User"], ["MFA", "Required"], ["Location tracking", "On duty, consent only"], ["Profile changes", "HRMS approval"]]} />
          </Card>
        </div>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-005 ---------------------------------- */

type Req = { id: string; cat: string; source: string; age: string; status: "Urgent" | "New" | "Review"; prio: string; clearance: string };
const reqs: Req[] = [
  { id: "REQ-26-1101", cat: "Unclaimed body", source: "Helpline", age: "12 min", status: "Urgent", prio: "Emergency", clearance: "Pending" },
  { id: "REQ-26-1102", cat: "EWS family", source: "WhatsApp", age: "25 min", status: "New", prio: "Normal", clearance: "Not started" },
  { id: "REQ-26-1103", cat: "Unsupported person", source: "Website", age: "40 min", status: "Review", prio: "High", clearance: "Pending" },
  { id: "REQ-26-1104", cat: "EWS family", source: "Google Ads", age: "1 hr", status: "New", prio: "Normal", clearance: "Not started" },
  { id: "REQ-26-1105", cat: "EWS family", source: "Social media", age: "2 hr", status: "Review", prio: "Normal", clearance: "Pending" },
];
const sources = ["All sources", "Helpline", "WhatsApp", "Website", "Google Ads", "Social media", "Official email", "AI inbound calling", "Chatbot", "Staff app", "Volunteer app"] as const;

export function US005SewaRequests() {
  const notice = useNotice();
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [source, setSource] = useState<(typeof sources)[number]>("All sources");
  const visible = reqs.map((r, i) => ({ r, i })).filter(({ r }) => (status === "All statuses" || r.status === status) && (source === "All sources" || r.source === source) && `${r.id} ${r.cat}`.toLowerCase().includes(q.toLowerCase()));
  const cur = reqs[sel];
  return (
    <UserFrame code="US-005" active="sewa-requests" title="Sewa Requests & Digital Leads">
      <Tiles
        items={[
          { value: "05", label: "Assigned requests", tone: "blue" },
          { value: "02", label: "New", tone: "sky" },
          { value: "02", label: "Verification due", tone: "orange" },
          { value: "01", label: "Emergency", tone: "red" },
          { value: "02", label: "Digital leads", tone: "purple" },
        ]}
      />
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,2fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[740fr_410fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="My requests & leads" bodyClassName="flex flex-col gap-[8px]">
            <div className="flex flex-col gap-[8px] sm:flex-row">
              <SearchBox value={q} onChange={setQ} placeholder="Search" />
              <SelectBox hideLabel label="Status" value={status} options={["All statuses", "Urgent", "New", "Review"]} onChange={setStatus} />
              <SelectBox hideLabel label="Source" value={source} options={sources} onChange={setSource} />
            </div>
            <Table
              cols={["Request ID", "Category", "Source", "Age", "Status", "Action"]}
              selected={visible.findIndex((v) => v.i === sel)}
              onSelect={(k) => setSel(visible[k].i)}
              rows={visible.map(({ r }) => [
                r.id,
                r.cat,
                r.source,
                r.age,
                `*${r.status}`,
                <span key={r.id} className="flex gap-[4px]">
                  {r.status === "New" ? (
                    <Link href={usRoutes.createRequest} className={`${btnOutline} !h-[30px]`}>Edit</Link>
                  ) : (
                    <Link href={usRoutes.verification} className={`${btnOutline} !h-[30px]`}>Open</Link>
                  )}
                  <Btn className="!h-[30px]" onClick={() => notice.show(`${r.id}: quick update saved to the request timeline (demo).`)}>Update</Btn>
                </span>,
              ])}
            />
            <div><Link href={usRoutes.createRequest} className={btnSolid}>New request</Link></div>
          </Card>
          <Card title={`Selected request • ${cur.id}`} bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Category", cur.cat], ["Coverage", "Ghaziabad"], ["Priority", cur.prio === "Normal" ? "Normal" : `*${cur.prio}`], ["Legal clearance", cur.clearance === "Pending" ? "*Pending" : cur.clearance], ["Owner", "User 07"], ["Duplicate check", "Review before creation"]]} />
            <Btns>
              <Link href={usRoutes.verification} className={btnSolid}>Verify documents</Link>
              <Btn onClick={() => notice.show(`${cur.id} escalated to your reporting Admin (demo).`)}>Escalate</Btn>
            </Btns>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-2 lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Channel intake">
            <Lines rows={[["Helpline / WhatsApp", "02"], ["Website", "01"], ["Google Ads / social", "02"]]} />
          </Card>
          <Card title="Quick guidance">
            <Note boxed>Only assigned leads are visible. Verify coverage and eligibility before committing any service. Delhi and Noida: coming soon.</Note>
          </Card>
        </div>
      </div>
      {notice.node}
    </UserFrame>
  );
}
