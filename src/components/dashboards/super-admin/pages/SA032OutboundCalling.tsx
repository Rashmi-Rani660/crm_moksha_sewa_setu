"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-032 — AI Outbound Calling Centre */
const spec: ScreenSpec = {
  code: "SA-032",
  title: "AI Outbound Calling Centre",
  active: "communication-hub",
  kpis: [
    { value: "08", label: "Scheduled", tone: "blue" },
    { value: "03", label: "Callbacks due", tone: "green" },
    { value: "04", label: "Completed", tone: "orange" },
    { value: "01", label: "Failed", tone: "purple" },
    { value: "02", label: "Awaiting approval", tone: "blue" },
    { value: "₹18", label: "AI cost today", tone: "green" },
  ],
  tabs: ["Call schedule", "Callback queue", "Campaign rules", "Attempts", "Reports"],
  register: {
    title: "Scheduled calls & follow-ups",
    columns: [
      { label: "Job ID", w: 110 },
      { label: "Linked record", w: 125 },
      { label: "Purpose", w: 200 },
      { label: "Scheduled IST", w: 120 },
      { label: "Owner", w: 100 },
      { label: "Status", w: 115, pill: true },
    ],
    rows: [
      ["OUT-001", "CALL-005", "Missed call follow-up", "Today 12:00", "User 07", "Due"],
      ["OUT-002", "MS-26-1100", "Document clarification", "Today 12:30", "User 08", "Scheduled"],
      ["OUT-003", "MS-26-1099", "Service update", "Today 13:00", "Admin 01", "Approval pending"],
      ["OUT-004", "VOL-004", "Task acknowledgement", "Today 13:30", "User 09", "Scheduled"],
      ["OUT-005", "CALL-006", "Callback retry", "Today 14:00", "User 07", "Failed"],
    ],
    actions: ["Schedule call", "Review approvals", "Retry eligible", "Pause queue"],
  },
  side: {
    title: "Outbound safeguards",
    rows: [
      ["Recipient permission", "Check before call"],
      ["Suppression list", "Enforced"],
      ["Quiet hours", "Policy controlled"],
      ["Retry limit", "Configurable"],
      ["Human takeover", "Available"],
      ["Cost cap", "Policy controlled"],
    ],
    actions: ["Review settings", "View history"],
  },
  lower: {
    title: "Call lifecycle",
    kind: "flow5",
    steps: ["Schedule", "Check consent", "Dial", "Outcome", "Follow up"],
    rows: [
      ["Callbacks due", "03"],
      ["Failed attempts", "01"],
    ],
  },
  safeguards: {
    title: "Delivery exceptions",
    rows: [
      ["Callbacks due", "03"],
      ["Failed attempts", "01"],
      ["Opt-out", "Suppress future calls"],
      ["Urgent callbacks", "Human priority"],
    ],
  },
};

export default function SA032OutboundCalling() {
  return <RegisterScreen spec={spec} />;
}
