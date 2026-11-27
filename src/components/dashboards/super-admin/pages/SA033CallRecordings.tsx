"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-033 — Call Recordings, Transcripts & History */
const spec: ScreenSpec = {
  code: "SA-033",
  title: "Call Recordings, Transcripts & History",
  active: "communication-hub",
  kpis: [
    { value: "12", label: "Inbound calls", tone: "blue" },
    { value: "04", label: "Outbound completed", tone: "green" },
    { value: "09", label: "Recordings retained", tone: "orange" },
    { value: "02", label: "QA review due", tone: "purple" },
    { value: "01", label: "Transcript retry", tone: "blue" },
    { value: "04", label: "Restricted records", tone: "green" },
  ],
  tabs: ["Call history", "Recordings", "Transcripts", "Quality review", "Audit"],
  register: {
    title: "Call history register",
    columns: [
      { label: "Call ID", w: 110 },
      { label: "Direction", w: 110 },
      { label: "Linked record", w: 130 },
      { label: "Duration", w: 90 },
      { label: "Recording", w: 110 },
      { label: "Review", w: 120, pill: true },
    ],
    rows: [
      ["CALL-001", "Inbound", "MS-26-1101", "02:14", "Restricted", "Pending"],
      ["CALL-002", "Inbound", "Enquiry", "01:46", "Available", "Reviewed"],
      ["CALL-003", "Inbound", "MS-26-1100", "00:42", "Restricted", "Pending"],
      ["OUT-004", "Outbound", "VOL-004", "01:10", "Available", "Reviewed"],
      ["OUT-005", "Outbound", "CALL-006", "00:18", "Not retained", "Retry"],
    ],
    actions: ["Open record", "Review transcript", "Request export"],
  },
  side: {
    title: "Selected call · CALL-001",
    rows: [
      ["Caller", "Masked"],
      ["Recording notice", "Recorded · demo"],
      ["Transcript", "Human review required"],
      ["AI summary", "Urgent cremation assistance"],
      ["Access", "Authorised case team"],
      ["Retention", "Approved policy"],
    ],
    actions: ["Review settings", "View history"],
  },
  lower: {
    title: "Review process",
    kind: "flow5",
    steps: ["Select", "Authorise", "Review", "Correct", "Audit"],
    rows: [
      ["Transcript retry", "01"],
      ["Restricted playback", "Enforced"],
    ],
  },
  safeguards: {
    title: "Quality & privacy",
    rows: [
      ["Transcript retry", "01"],
      ["Restricted playback", "Enforced"],
      ["Download", "Approval required"],
      ["Redaction", "Before approved export"],
    ],
  },
};

export default function SA033CallRecordings() {
  return <RegisterScreen spec={spec} />;
}
