"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-035 — Outgoing SMS Management */
const spec: ScreenSpec = {
  code: "SA-035",
  title: "Outgoing SMS Management",
  active: "communication-hub",
  kpis: [
    { value: "08", label: "Sent today", tone: "blue" },
    { value: "06", label: "Delivered", tone: "green" },
    { value: "01", label: "Pending", tone: "orange" },
    { value: "01", label: "Failed", tone: "purple" },
    { value: "04", label: "Approved templates", tone: "blue" },
    { value: "02", label: "Scheduled", tone: "green" },
  ],
  tabs: ["Delivery queue", "Templates", "Scheduled", "Retry", "Reports"],
  register: {
    title: "Outgoing SMS delivery register",
    columns: [
      { label: "Message ID", w: 110 },
      { label: "Template", w: 180 },
      { label: "Linked record", w: 120 },
      { label: "Recipient", w: 120 },
      { label: "Delivery", w: 90 },
      { label: "Status", w: 115, pill: true },
    ],
    rows: [
      ["SMS-001", "Request acknowledgement", "MS-26-1101", "98XXXXXX01", "10:24 AM", "Delivered"],
      ["SMS-002", "Document reminder", "MS-26-1100", "98XXXXXX02", "10:18 AM", "Delivered"],
      ["SMS-003", "Task assignment", "TASK-026", "98XXXXXX04", "10:10 AM", "Failed"],
      ["SMS-004", "Service update", "MS-26-1099", "98XXXXXX03", "—", "Pending"],
      ["SMS-005", "Donation receipt notice", "DON-078", "98XXXXXX05", "09:32 AM", "Delivered"],
    ],
    actions: ["Create SMS", "Retry eligible", "Review template"],
  },
  side: {
    title: "SMS channel controls",
    rows: [
      ["Direction", "Outgoing only"],
      ["Sender / template", "Approved only"],
      ["Consent / preference", "Validate"],
      ["Provider", "Connected · demo"],
      ["Retry", "Bounded & audited"],
      ["Sensitive details", "Minimise"],
    ],
    actions: ["Review settings", "View history"],
  },
  lower: {
    title: "Delivery lifecycle",
    kind: "flow5",
    steps: ["Select template", "Validate", "Send", "Track", "Retry"],
    rows: [
      ["Failed messages", "01"],
      ["Pending delivery", "01"],
    ],
  },
  safeguards: {
    title: "Delivery exceptions",
    rows: [
      ["Failed messages", "01"],
      ["Pending delivery", "01"],
      ["Scheduled sends", "02"],
      ["Duplicate sends", "Prevent"],
    ],
  },
};

export default function SA035OutgoingSms() {
  return <RegisterScreen spec={spec} />;
}
