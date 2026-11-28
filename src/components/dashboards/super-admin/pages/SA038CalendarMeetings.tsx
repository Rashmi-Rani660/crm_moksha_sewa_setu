"use client";

import { usePlanner } from "@/lib/crm/useWorkforce";
import { useNotice } from "@/components/dashboards/super-admin/kit";
import { count, records, text, EMPTY } from "@/lib/crm/data";
import { humanize, shortDateTime } from "@/lib/format";
import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-038 — Calendar & Meetings */
const spec: ScreenSpec = {
  code: "SA-038",
  title: "Calendar & Meetings",
  active: "communication-hub",
  kpis: [
    { value: "06", label: "Events today", tone: "blue" },
    { value: "02", label: "Upcoming meetings", tone: "green" },
    { value: "03", label: "Task reminders", tone: "orange" },
    { value: "01", label: "Conflict flagged", tone: "purple" },
    { value: "02", label: "Awaiting RSVP", tone: "blue" },
    { value: "01", label: "Overdue follow-up", tone: "green" },
  ],
  tabs: ["Agenda", "Calendar", "Meetings", "Reminders", "Availability"],
  register: {
    title: "Today's agenda · IST",
    columns: [
      { label: "Time", w: 100 },
      { label: "Event", w: 180 },
      { label: "Type", w: 100 },
      { label: "Owner", w: 100 },
      { label: "Linked record", w: 120 },
      { label: "Status", w: 125, pill: true },
    ],
    rows: [
      ["10:30 AM", "Operations review", "Meeting", "Admin 01", "TEAM-001", "Completed"],
      ["12:00 PM", "Helpline callback", "Reminder", "User 07", "CALL-005", "Due"],
      ["12:30 PM", "Document clarification", "Task", "User 08", "MS-26-1100", "Scheduled"],
      ["02:00 PM", "Volunteer briefing", "Meeting", "Admin 03", "VOL-004", "RSVP pending"],
      ["04:00 PM", "Expense review", "Meeting", "Admin 02", "FIN-001", "Scheduled"],
      ["05:00 PM", "Case follow-up", "Task", "User 09", "MS-26-1099", "Scheduled"],
    ],
    actions: ["Create event", "Check availability", "Set reminder"],
  },
  side: {
    title: "Selected event · volunteer briefing",
    rows: [
      ["Date", "26 Nov 2026"],
      ["Time zone", "Asia/Kolkata"],
      ["Duration", "30 minutes"],
      ["Attendees", "Authorised team"],
      ["Conflict check", "Required"],
      ["Reminder", "Before meeting"],
    ],
    actions: ["Review settings", "View history"],
  },
  lower: {
    title: "Scheduling flow",
    kind: "flow5",
    steps: ["Create", "Check availability", "Invite", "Confirm", "Follow up"],
    rows: [
      ["Conflicts", "01"],
      ["RSVP pending", "02"],
    ],
  },
  safeguards: {
    title: "Agenda exceptions",
    rows: [
      ["Conflicts", "01"],
      ["RSVP pending", "02"],
      ["Overdue follow-up", "01"],
      ["Calendar sync", "Provider required"],
    ],
  },
};

export default function SA038CalendarMeetings() {
  const notice = useNotice();
  const live = usePlanner(notice.show);
  const rows = records(live.planner.data);
  const wired: ScreenSpec = { ...spec,kpis: spec.kpis.map((k,i) => ({ ...k,value: i === 0 ? live.planner.data ? count(rows.length) : EMPTY : i === 1 ? live.planner.data ? count(rows.filter(row => row.type === "MEETING").length) : EMPTY : i === 2 ? live.planner.data ? count(rows.filter(row => row.type === "REMINDER").length) : EMPTY : k.value })) as ScreenSpec["kpis"],register: { ...spec.register,rows: rows.map(row => [shortDateTime(text(row.startAt,"")),text(row.title),humanize(text(row.type,"")),text(row.ownerName),text(row.link),humanize(text(row.status,""))]) } };
  return <><RegisterScreen spec={wired} onAction={(label) => { if (label === "Create event" || label === "Set reminder") void live.add(); }} />{notice.node}</>;
}
