"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-050 — AI Configuration & Quality Testing (demo data). */
const spec: ScreenSpec = {
  code: "SA-050",
  title: "AI Configuration & Quality Testing",
  active: "automation-ai",
  kpis: [
    { value: "04", label: "AI channels" },
    { value: "12", label: "Test cases" },
    { value: "09", label: "Passed" },
    { value: "03", label: "Needs review" },
    { value: "v1.0", label: "Published version" },
    { value: "Enabled", label: "Human fallback" },
  ],
  tabs: ["Configuration", "Knowledge base", "Test lab", "Quality review", "Versions"],
  register: {
    title: "AI quality test register",
    columns: [
      { label: "Test ID", w: 82 },
      { label: "Scenario", w: 192 },
      { label: "Expected behaviour", w: 206 },
      { label: "Channel", w: 82 },
      { label: "Result", w: 75 },
      { label: "Owner", w: 112, pill: true },
    ],
    rows: [
      ["QA-001", "EWS eligibility", "Request verification", "Chatbot", "Passed", "Admin 01"],
      ["QA-002", "Unclaimed body", "Legal clearance gate", "Inbound", "Passed", "Admin 01"],
      ["QA-003", "Urgent family request", "Human transfer", "Inbound", "Review", "Admin 04"],
      ["QA-004", "Outside coverage", "Coming soon / guidance", "Chatbot", "Passed", "Admin 04"],
      ["QA-005", "Repeated abusive calls", "Limit + safe fallback", "Voice", "Review", "Admin 04"],
    ],
    actions: ["Run test", "Review response", "Publish version"],
  },
  side: {
    title: "AI configuration controls",
    rows: [
      ["Knowledge source", "Approved Moksha Sewa SOP"],
      ["Languages", "Hindi / English"],
      ["Response style", "Compassionate"],
      ["Personal data", "Minimum necessary"],
      ["Voice / text budgets", "Separate limits"],
      ["Publish", "Human approval"],
    ],
  },
  lower: {
    title: "AI release & quality checks",
    kind: "list",
    rows: [
      ["Model / prompt / knowledge", "Versioned configuration"],
      ["Voice / text limits", "Separate budgets"],
      ["Regression / security tests", "Required before release"],
    ],
    note: "Compare candidate against approved version; human review",
    actions: ["Compare versions", "Run test suite", "Release approval"],
  },
  safeguards: [
    ["Regression test", "Required"],
    ["Rollback", "Approved version"],
  ],
};

export default function AiConfiguration() {
  return <RegisterScreen spec={spec} />;
}
