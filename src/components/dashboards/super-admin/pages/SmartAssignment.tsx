"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-049 — AI Smart Assignment Management (demo data). */
const spec: ScreenSpec = {
  code: "SA-049",
  title: "AI Smart Assignment Management",
  active: "automation-ai",
  kpis: [
    { value: "36", label: "Open tasks" },
    { value: "05", label: "Overdue", tone: "red" },
    { value: "02", label: "Awaiting acceptance" },
    { value: "08/10", label: "Staff on duty" },
    { value: "12/18", label: "Volunteers available" },
    { value: "Review", label: "Auto assignment" },
  ],
  tabs: ["Assignment queue", "Candidate ranking", "Capacity", "Exceptions", "History"],
  register: {
    title: "Assignment recommendation queue",
    columns: [
      { label: "Task ID", w: 86 },
      { label: "Task", w: 167 },
      { label: "Suggested assignee", w: 143 },
      { label: "Reason", w: 142 },
      { label: "Mode", w: 122 },
      { label: "Status", w: 89, pill: true },
    ],
    rows: [
      ["TASK-026", "Document verification", "User 07", "Skill + capacity", "Approval-based", "Review"],
      ["TASK-027", "Cremation support", "VOL-007", "Trained + available", "Automatic", "Pending"],
      ["TASK-028", "Vehicle coordination", "User 08", "On duty", "Manual", "Review"],
      ["TASK-029", "Family follow-up", "User 09", "Language match", "Automatic", "Pending"],
      ["TASK-030", "Case review", "Admin 01", "Authorised scope", "Approval-based", "Review"],
    ],
    actions: ["Review recommendation", "Assign manually", "Reassign"],
  },
  side: {
    title: "Assignment guardrails",
    rows: [
      ["City", "Ghaziabad only"],
      ["Eligibility", "Verified + trained"],
      ["Availability", "Check conflicts"],
      ["Location", "On-duty consent only"],
      ["Decision reason", "Explain ranking"],
      ["Fallback", "Reporting Admin"],
    ],
  },
  lower: {
    title: "Assignment recommendation · demo",
    kind: "list",
    rows: [
      ["TASK-026 · User 07", "Score 92 / 100"],
      ["Skill / training / access", "Eligible"],
      ["Capacity / conflict", "Available · no conflict"],
    ],
    note: "Score is advisory; consent-based location only",
    actions: ["Review candidates", "Override with reason"],
  },
  safeguards: [
    ["Overdue tasks", "05"],
    ["Sensitive task", "Human review"],
  ],
};

export default function SmartAssignment() {
  return <RegisterScreen spec={spec} />;
}
