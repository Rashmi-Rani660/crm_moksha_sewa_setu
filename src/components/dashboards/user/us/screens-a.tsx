"use client";

import { useRouter } from "next/navigation";

/** US-001 … US-005 — demo data only; actions show what would happen once the backend exists. */

import Link from "next/link";
import { useState } from "react";
import { useDashboardData } from "@/lib/crm/useDashboardData";
import { usePlanner, useWorkforce } from "@/lib/crm/useWorkforce";
import { useOperations } from "@/lib/crm/useOperations";
import { useCrmQuery, useDebounced } from "@/lib/api/useCrmQuery";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { at, count, records, text, EMPTY, type CrmRecord } from "@/lib/crm/data";
import { humanize, clock, shortDate, shortDateTime } from "@/lib/format";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { Btn, Btns, Card, Field, Lines, Note, SearchBox, SelectBox, Table, Tiles, UserFrame, btnOutline, btnSolid } from "./kit";
import { usRoutes } from "./routes";

const rows2 = "grid gap-[10px] lg:min-h-0 lg:flex-1";

/* --------------------------------- US-001 ---------------------------------- */

export function US001MyWorkDashboard() {
  const notice = useNotice();
  const live = useDashboardData();
  const planner = usePlanner(notice.show);
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
  const work: [string,string,string,string][] = records(at(live.data,"myWork.tasks")).map(row => [text(row.title),shortDateTime(text(row.dueAt,"")),"Open",'/dashboard/user/my-tasks/execution?id=' + row.id]);
  return (
    <UserFrame code="US-001" title="My Work Dashboard">
      <Tiles
        items={[
          { value: live.value("Pending tasks"), label: "Pending tasks", tone: "blue" },
          { value: live.value("Due today"), label: "Due today", tone: "orange" },
          { value: live.value("Overdue"), label: "Overdue", tone: "red" },
          { value: live.value("Assigned cases"), label: "Assigned cases", tone: "sky" },
          { value: live.value("Completed today"), label: "Completed today", tone: "green" },
          { value: live.value("Pending replies"), label: "Pending replies", tone: "orange" },
        ]}
      />
      <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:h-[40px] lg:shrink-0 lg:grid-cols-9">
        {quick.map(([label, href], i) =>
          href ? (
            <Link key={label} href={href} className={`${i === 0 ? btnSolid : btnOutline} !h-[40px]`}>{label}</Link>
          ) : (
            <button key={label} type="button" disabled onClick={() => notice.show(EMPTY)} className={`${btnOutline} !h-[40px]`}>{label}</button>
          ),
        )}
      </div>
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,1.55fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[690fr_460fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Priority work" bodyClassName="flex flex-col gap-[8px]">
            <div className="flex flex-wrap items-center gap-[8px] rounded-[6px] bg-[#eef3fb] px-[8px] py-[5px] text-[13px] font-normal">
              <span>Next action: {text(at(live.data,"myWork.tasks.0.title"))}</span>
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
            <Lines rows={records(planner.planner.data).slice(0,4).map(row => [shortDateTime(text(row.startAt,"")),text(row.title)])} />
            <div><Link href={usRoutes.planner} className={btnSolid}>Open planner</Link></div>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-3 lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Admin instructions" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[]} />
            <div><Link href={usRoutes.notifications} className={btnSolid}>View instructions</Link></div>
          </Card>
          <Card title="Communication" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Pending emails",EMPTY],["WhatsApp replies",EMPTY],["Scheduled callbacks",EMPTY]]} />
            <div><Btn solid disabled onClick={() => notice.show(EMPTY)}>Open hub</Btn></div>
          </Card>
          <Card title="AI work assistant" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Summarise my work",EMPTY],["Find approved SOP",EMPTY],["Prepare daily report",EMPTY]]} />
            <div><Btn solid disabled onClick={() => notice.show(EMPTY)}>Ask AI</Btn></div>
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
  const live = usePlanner(notice.show);
  const [view, setView] = useState<"Day" | "Week" | "Month">("Day");
  const [day, setDay] = useState(28);
  const today: [string,string,string,string,string][] = records(live.planner.data).map(row => [clock(text(row.startAt,"")),text(row.title),humanize(text(row.status,"")),"Details",""]);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <UserFrame code="US-002" active="my-work-planner" title="Work Planner, Calendar & Handover">
      <Tiles
        items={[
          { value: EMPTY, label: "Due today", tone: "orange" },
          { value: EMPTY, label: "Overdue", tone: "red" },
          { value: EMPTY, label: "Meetings", tone: "sky" },
          { value: EMPTY, label: "Handover pending", tone: "purple" },
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
                  <Btn key={t} className="!h-[30px]" onClick={() => notice.show(w)}>{a}</Btn>
                ),
              ])}
            />
            <Btns>
              <Btn solid disabled={live.mutation.busy || !live.can("planner.create")} onClick={live.add}>Add reminder</Btn>
              <Btn disabled={live.mutation.busy || !live.can("planner.create")} onClick={live.reschedule}>Request reschedule</Btn>
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
            <Lines rows={[["Shift", EMPTY], ["Conflict check", EMPTY], ["Handover owner", "Reporting Admin"]]} />
            <div><Btn solid disabled={live.mutation.busy || !live.can("planner.create")} onClick={live.handover}>Prepare handover</Btn></div>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[690fr_460fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Pending work transfer" bodyClassName="flex flex-col gap-[10px]">
            <Table cols={["Record", "Pending action", "Receiving owner"]} rows={records(live.handovers.data).map(row => [text(row.summary),humanize(text(row.status,"")),text(at(row,"to.name"))])} />
            <div><Btn solid disabled={live.mutation.busy || !live.can("planner.create")} onClick={live.handover}>Submit handover</Btn></div>
          </Card>
          <Card title="Reminders & appointments" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={records(live.planner.data).slice(0,3).map(row => [text(row.title),clock(text(row.startAt,""))])} />
            <Btns>
              <Btn solid disabled={live.mutation.busy || !live.can("planner.create")} onClick={live.add}>Set reminder</Btn>
              <Link href={usRoutes.dashboard} className={btnOutline}>Next work</Link>
              <Btn onClick={() => notice.show(records(live.planner.data).filter(row => row.type === "MEETING").map(row => text(row.title)).join("\n") || EMPTY)}>Meeting details</Btn>
            </Btns>
          </Card>
        </div>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-003 ---------------------------------- */

type Msg = { id: string; time: string; text: string; priority: "Critical" | "High" | "Normal"; status: "Unread" | "Ack due" | "Read" | "Acknowledged"; from: string; deadline: string; body: string };


export function US003Notifications() {
  const notice = useNotice();
  const mutation = useCrmMutation(notice.show);
  const inbox = useCrmQuery<CrmRecord[]>("/notifications?limit=100");
  const summary = useCrmQuery<CrmRecord>("/notifications/summary");
  const msgs: Msg[] = records(inbox.data).map(row => ({ id: text(row.id),time: shortDateTime(text(row.createdAt,"")),text: text(row.title),priority: row.priority === "CRITICAL" ? "Critical" : row.priority === "HIGH" ? "High" : "Normal",status: row.acknowledged ? "Acknowledged" : row.requiresAck ? "Ack due" : row.read ? "Read" : "Unread",from: EMPTY,deadline: EMPTY,body: text(row.message) }));
  const [sel, setSel] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [prio, setPrio] = useState("All priorities");
  const visible = msgs
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => (status === "All statuses" || m.status === status) && (prio === "All priorities" || m.priority === prio) && m.text.toLowerCase().includes(q.toLowerCase()));
  const cur = msgs[sel] ?? msgs[0] ?? { id: "",time: EMPTY,text: EMPTY,priority: "Normal",status: "Read",from: EMPTY,deadline: EMPTY,body: EMPTY };
  const update = (i: number, status: string) => { const target = msgs[i]; if (target) void mutation.run(`/notifications/${target.id}/${status === "Acknowledged" ? "acknowledge" : "read"}`, { method: "POST" }, "Saved."); };
  const pill = (p: string) => (p === "Normal" || p === "Read" ? p : `*${p}`);
  return (
    <UserFrame code="US-003" active="notifications-instructions" title="Notifications & Admin Instructions">
      <Tiles
        items={[
          { value: count(summary.data?.unread), label: "Unread", tone: "blue" },
          { value: count(summary.data?.pendingAck), label: "Acknowledgement due", tone: "orange" },
          { value: count(summary.data?.criticalUnacknowledged), label: "Critical", tone: "red" },
          { value: EMPTY, label: "Announcements", tone: "purple" },
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
              <Btn solid disabled={mutation.busy || !cur.id} onClick={() => update(sel,"Acknowledged")}>Acknowledge selected</Btn>
              <Btn disabled={mutation.busy || !cur.id} onClick={() => update(sel,"Read")}>Mark read</Btn>
            </Btns>
          </Card>
          <Card title="Selected instruction" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["From", cur.from], ["Received", `28 Nov · ${cur.time}`], ["Deadline", cur.deadline], ["Linked case",EMPTY]]} />
            <Note boxed>{cur.body}</Note>
            <Btns>
              <Btn solid disabled={mutation.busy || !cur.id} onClick={() => update(sel,"Acknowledged")}>Acknowledge</Btn>
              <Link href={usRoutes.verification} className={btnOutline}>Open documents</Link>
            </Btns>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-2 lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Announcements & reminders" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Updated SOP",EMPTY],["Training refresher",EMPTY],["Critical alerts",EMPTY]]} />
            <div><Btn solid disabled onClick={() => notice.show(EMPTY)}>View SOP</Btn></div>
          </Card>
          <Card title="Delivery & acknowledgement">
            <Lines rows={[["Read", "Separate from acknowledgement"], ["Acknowledged by",EMPTY], ["History", "Timestamp recorded on server"]]} />
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
  const live = useWorkforce(notice.show);
  const profile = live.profile;
  return (
    <UserFrame code="US-004" active="my-profile-hrms" title="My Profile, Attendance & HRMS">
      <Tiles
        items={[
          { value: humanize(text(at(live.attendance.data,"today.status"),"")), label: "Attendance today", tone: "green" },
          { value: humanize(text(live.duty.data?.status,"")), label: "Duty status", tone: "sky" },
          { value: count(live.leave.meta?.total), label: "Leave requests", tone: "orange" },
          { value: EMPTY, label: "HRMS sync", tone: "green" },
        ]}
      />
      <div className={`${rows2} lg:[grid-template-rows:minmax(0,1.5fr)_minmax(0,1fr)]`}>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[640fr_500fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="My employee profile" bodyClassName="flex flex-col gap-[10px]">
            <div className="grid gap-x-[8px] gap-y-[8px] sm:grid-cols-2">
              <Field label="Employee ID" value={text(profile?.crmId)} readOnly />
              <Field label="Name" value={text(profile?.name)} readOnly />
              <Field label="Department" value={text(profile?.department?.name)} readOnly />
              <Field label="Reporting Admin" value={EMPTY} readOnly />
              <Field label="Service centre" value={profile?.centres.map(c => c.name).join(" / ") || EMPTY} readOnly />
              <Field label="Mobile" value={text(profile?.mobile)} readOnly />
            </div>
            <Btns>
              <Btn solid disabled onClick={() => notice.show(EMPTY)}>Request correction</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Personal settings</Btn>
            </Btns>
          </Card>
          <Card title="Attendance & duty" bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Check-in", shortDateTime(text(at(live.attendance.data,"today.checkInAt"),""))], ["Check-out", shortDateTime(text(at(live.attendance.data,"today.checkOutAt"),""))], ["Shift", EMPTY], ["Last sync", EMPTY], ["Leave balance", "From HRMS"]]} />
            <Btns>
              <Btn solid disabled={!live.can("attendance.create") || live.mutation.busy} onClick={live.requestLeave}>Request leave</Btn>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Attendance correction</Btn>
            </Btns>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-[640fr_500fr] lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Attendance history" bodyClassName="flex flex-col gap-[8px]">
            <Table cols={["Date", "In", "Out", "Status"]} rows={records(live.attendance.data?.days).map(row => [shortDate(text(row.day,"")),clock(text(row.checkInAt,"")),clock(text(row.checkOutAt,"")),humanize(text(row.status,""))])} />
            <Note>{count(at(live.attendance.data,"totals.present"))}</Note>
          </Card>
          <Card title="Account & privacy">
            <Lines rows={[["Access level",humanize(profile?.accessLevel)], ["MFA", "Required"], ["Location tracking", "On duty, consent only"], ["Profile changes", "HRMS approval"]]} />
          </Card>
        </div>
      </div>
      {notice.node}
    </UserFrame>
  );
}

/* --------------------------------- US-005 ---------------------------------- */

type Req = { id: string; cat: string; source: string; age: string; status: string; prio: string; clearance: string };

const sources = ["All sources", "Helpline", "WhatsApp", "Website", "Google Ads", "Social media", "Official email", "AI inbound calling", "Chatbot", "Staff app", "Volunteer app"] as const;

export function US005SewaRequests() {
  const router = useRouter();
  const notice = useNotice();
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [source, setSource] = useState<(typeof sources)[number]>("All sources");
  const search = useDebounced(q.trim());
  const live = useOperations("requests",notice.show,{ search: search || undefined,status: status === "New" ? "NEW" : status === "Review" ? "PENDING_VERIFICATION" : undefined,emergency: status === "Urgent" ? true : undefined });
  const reqs: (Req & { recordId: string })[] = live.rows.map(row => ({ recordId: text(row.id),id: row.displayId,cat: humanize(text(row.beneficiaryCategory,"")),source: humanize(text(row.channel,"")),age: row.displayCreated,status: row.displayStatus,prio: row.displayPriority,clearance: EMPTY }));
  const visible = reqs.map((r, i) => ({ r, i })).filter(({ r }) => (source === "All sources" || r.source === source) && `${r.id} ${r.cat}`.toLowerCase().includes(q.toLowerCase()));
  const cur = reqs[sel] ?? reqs[0] ?? { recordId: "",id: EMPTY,cat: EMPTY,source: EMPTY,age: EMPTY,status: EMPTY,prio: EMPTY,clearance: EMPTY };
  return (
    <UserFrame code="US-005" active="sewa-requests" title="Sewa Requests & Digital Leads">
      <Tiles
        items={[
          { value: count(live.total), label: "Assigned requests", tone: "blue" },
          { value: live.metric("byStatus.NEW"), label: "New", tone: "sky" },
          { value: live.metric("pendingVerification"), label: "Verification due", tone: "orange" },
          { value: live.metric("emergencyOpen"), label: "Emergency", tone: "red" },
          { value: EMPTY, label: "Digital leads", tone: "purple" },
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
              onSelect={(k) => { setSel(visible[k].i);live.select(reqs[visible[k].i]?.recordId ?? null); }}
              rows={visible.map(({ r }) => [
                r.id,
                r.cat,
                r.source,
                r.age,
                `*${r.status}`,
                <span key={r.id} className="flex gap-[4px]">
                  {r.status === "New" ? (
                    <Link href={`${usRoutes.createRequest}?id=${r.recordId}`} className={`${btnOutline} !h-[30px]`}>Edit</Link>
                  ) : (
                    <Link href={`${usRoutes.verification}?id=${r.recordId}`} className={`${btnOutline} !h-[30px]`}>Open</Link>
                  )}
                  <Btn className="!h-[30px]" onClick={() => router.push(`${usRoutes.verification}?id=${r.recordId}`)}>Update</Btn>
                </span>,
              ])}
            />
            <div><Link href={usRoutes.createRequest} className={btnSolid}>New request</Link></div>
          </Card>
          <Card title={`Selected request • ${cur.id}`} bodyClassName="flex flex-col gap-[10px]">
            <Lines rows={[["Category", cur.cat], ["Coverage",humanize(text(live.detail.data?.coverage,""))], ["Priority", cur.prio === "Normal" ? "Normal" : `*${cur.prio}`], ["Legal clearance", cur.clearance === "Pending" ? "*Pending" : cur.clearance], ["Owner",text(at(live.detail.data,"owner.name"))], ["Duplicate check", "Review before creation"]]} />
            <Btns>
              <Link href={`${usRoutes.verification}?id=${cur.recordId}`} className={btnSolid}>Verify documents</Link>
              <Btn disabled onClick={() => notice.show(EMPTY)}>Escalate</Btn>
            </Btns>
          </Card>
        </div>
        <div className="grid gap-[10px] lg:min-h-0 lg:grid-cols-2 lg:[grid-template-rows:minmax(0,1fr)]">
          <Card title="Channel intake">
            <Lines rows={[["Helpline / WhatsApp",EMPTY],["Website",live.metric("byChannelThisMonth.WEBSITE")],["Google Ads / social",EMPTY]]} />
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
