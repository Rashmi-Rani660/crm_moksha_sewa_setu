"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-047 — Automatic / Manual / Approval Controls (demo data). */
const spec: ScreenSpec = {
  code: "SA-047",
  title: "Automatic / Manual / Approval Controls",
  active: "automation-ai",
  kpis: [
    { value: "32", label: "Workflows" },
    { value: "22", label: "Automatic" },
    { value: "07", label: "Approval-based" },
    { value: "03", label: "Manual" },
    { value: "08", label: "Overrides" },
    { value: "Ready", label: "Emergency pause" },
  ],
  tabs: ["Control matrix", "Approvals", "Overrides", "Pause & resume", "History"],
  register: {
    title: "Workflow control matrix",
    columns: [
      { label: "Workflow", w: 162 },
      { label: "Current mode", w: 148 },
      { label: "Scope", w: 109 },
      { label: "Owner", w: 100 },
      { label: "Change status", w: 130 },
      { label: "Action", w: 100, pill: true },
    ],
    rows: [
      ["Request intake", "Automatic", "Ghaziabad", "Admin 01", "Active", "Review"],
      ["Legal verification", "Approval-based", "Ghaziabad", "Admin 01", "Locked gate", "Review"],
      ["Expense approval", "Approval-based", "Finance", "Admin 02", "Locked gate", "Review"],
      ["Callback routing", "Automatic", "Helpline", "Admin 04", "Active", "Review"],
      ["Case closure", "Manual", "Operations", "Admin 01", "Active", "Review"],
    ],
    actions: ["Request mode change", "Review override", "Emergency pause"],
  },
  side: {
    title: "Selected workflow controls",
    rows: [
      ["Workflow", "Request intake"],
      ["Proposed mode", "Approval-based"],
      ["Reason", "Required"],
      ["Effective scope", "Ghaziabad"],
      ["Approval", "Required for sensitive changes"],
      ["Fallback", "Manual queue"],
    ],
  },
  lower: {
    title: "Mode change & emergency override",
    kind: "list",
    rows: [
      ["Automatic / approval / manual", "22 / 07 / 03"],
      ["Override expiry", "Required"],
      ["Reason & approval", "Mandatory"],
    ],
    note: "Keep emergency helpline and legal gates active",
    actions: ["Request mode change", "Emergency pause", "Override log"],
  },
  safeguards: [
    ["Emergency pause", "Keep helpline available"],
    ["Override expiry", "Required"],
  ],
};

export default function AutomationControls() {
  return <RegisterScreen spec={spec} />;
}
