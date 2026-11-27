"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-048 — Automation Rule Builder (demo data). */
const spec: ScreenSpec = {
  code: "SA-048",
  title: "Automation Rule Builder",
  active: "automation-ai",
  kpis: [
    { value: "14", label: "Active rules" },
    { value: "03", label: "Draft rules" },
    { value: "02", label: "Pending review" },
    { value: "03", label: "Failed runs", tone: "red" },
    { value: "On", label: "Version control" },
    { value: "Available", label: "Simulation" },
  ],
  tabs: ["Rule library", "Rule builder", "Simulation", "Publish history", "Exceptions"],
  register: {
    title: "Rule library",
    columns: [
      { label: "Rule ID", w: 94 },
      { label: "Rule", w: 178 },
      { label: "Trigger", w: 136 },
      { label: "Condition", w: 118 },
      { label: "Mode", w: 133 },
      { label: "Status", w: 90, pill: true },
    ],
    rows: [
      ["RULE-001", "Emergency routing", "New request", "Urgent", "Automatic", "Active"],
      ["RULE-002", "Missing legal record", "Verification", "Incomplete", "Approval-based", "Active"],
      ["RULE-003", "Callback retry", "Failed call", "Consent valid", "Automatic", "Review"],
      ["RULE-004", "Expense limit", "Claim submitted", "Above limit", "Approval-based", "Draft"],
      ["RULE-005", "No acknowledgement", "Task assigned", "SLA breached", "Automatic", "Active"],
    ],
    actions: ["Create rule", "Run simulation", "Review version"],
  },
  side: {
    title: "Rule editor · RULE-002",
    rows: [
      ["Trigger", "Verification updated"],
      ["IF", "Mandatory record missing"],
      ["THEN", "Hold dispatch"],
      ["ELSE", "Route for approval"],
      ["Failure action", "Manual queue"],
      ["Publish", "Approval required"],
    ],
  },
  lower: {
    title: "Conditional workflow · missing record",
    kind: "flow",
    from: "Verification updated",
    to: "Mandatory record missing?",
    yes: ["YES → Hold dispatch", "Notify responsible Admin"],
    no: ["NO → Route for approval", "Verify legal clearance"],
    actions: ["Simulate rule", "Publish approval", "Rollback"],
  },
  safeguards: [
    ["Retry limit", "Configured"],
    ["Rollback", "Previous approved version"],
  ],
};

export default function RuleBuilder() {
  return <RegisterScreen spec={spec} />;
}
