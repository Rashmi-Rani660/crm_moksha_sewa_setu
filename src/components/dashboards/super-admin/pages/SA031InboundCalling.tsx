"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-031 — AI Inbound Calling Centre */
const spec: ScreenSpec = {
  code: "SA-031",
  title: "AI Inbound Calling Centre",
  active: "communication-hub",
  kpis: [
    { value: "12", label: "Calls today", tone: "blue" },
    { value: "09", label: "Answered", tone: "green" },
    { value: "03", label: "Missed / callback", tone: "orange" },
    { value: "06", label: "AI handled", tone: "purple" },
    { value: "03", label: "Human handled", tone: "blue" },
    { value: "₹42", label: "AI cost today", tone: "green" },
  ],
  tabs: ["Live queue", "Call routing", "AI scripts", "Callback queue", "Reports"],
  register: {
    title: "Incoming call queue",
    columns: [
      { label: "Call ID", w: 110 },
      { label: "Caller", w: 125 },
      { label: "Purpose", w: 220 },
      { label: "Duration", w: 90 },
      { label: "Owner", w: 110 },
      { label: "Status", w: 115, pill: true },
    ],
    rows: [
      ["CALL-001", "98XXXXXX01", "Urgent cremation support", "02:14", "Admin 01", "Human transfer"],
      ["CALL-002", "98XXXXXX02", "Eligibility enquiry", "01:46", "AI", "Resolved"],
      ["CALL-003", "98XXXXXX03", "Unclaimed body report", "00:42", "Admin 01", "Review"],
      ["CALL-004", "98XXXXXX04", "Service coverage", "01:20", "AI", "Resolved"],
      ["CALL-005", "98XXXXXX05", "Family assistance", "—", "Unassigned", "Callback due"],
    ],
    actions: ["Open call", "Take over", "Register request", "Assign callback"],
  },
  side: {
    title: "AI call control",
    rows: [
      ["Operating hours", "24×7 intake"],
      ["Language", "Hindi / English"],
      ["Recording notice", "Required"],
      ["Emergency transfer", "Immediate human queue"],
      ["Voice session budget", "Policy-based"],
      ["Provider status", "Connected · demo"],
    ],
    actions: ["Review settings", "View history"],
  },
  lower: {
    title: "Inbound workflow",
    kind: "flow5",
    steps: ["Receive", "Identify need", "Verify details", "Route", "Follow up"],
    rows: [
      ["Missed callbacks", "03"],
      ["Urgent human transfer", "01"],
    ],
  },
  safeguards: {
    title: "Priority exceptions",
    rows: [
      ["Missed callbacks", "03"],
      ["Urgent human transfer", "01"],
      ["Failed routing", "Review queue"],
      ["Service promise", "Verification required"],
    ],
  },
};

export default function SA031InboundCalling() {
  return <RegisterScreen spec={spec} />;
}
