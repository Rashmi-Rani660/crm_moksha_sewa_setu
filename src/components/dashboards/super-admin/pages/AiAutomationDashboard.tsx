"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-046 — AI & Automation Dashboard (demo data; channel spend sums to ₹8,450). */
const spec: ScreenSpec = {
  code: "SA-046",
  title: "AI & Automation Dashboard",
  active: "automation-ai",
  kpis: [
    { value: "32", label: "Active workflows" },
    { value: "22", label: "Automatic" },
    { value: "07", label: "Approval-based" },
    { value: "03", label: "Manual" },
    { value: "03", label: "Failed runs", tone: "red" },
    { value: "₹8,450", label: "Monthly AI cost" },
  ],
  tabs: ["Overview", "Workflows", "Channels", "Quality & cost", "Exceptions"],
  register: {
    title: "Automation health · demo snapshot",
    columns: [
      { label: "Workflow", w: 100 },
      { label: "Trigger", w: 184 },
      { label: "Mode", w: 151 },
      { label: "Owner", w: 101 },
      { label: "Last run", w: 103 },
      { label: "Status", w: 110, pill: true },
    ],
    rows: [
      ["WF-001", "New request", "Automatic", "Admin 01", "10:24 AM", "Active"],
      ["WF-002", "Sensitive enquiry", "Approval-based", "Admin 01", "10:20 AM", "Review"],
      ["WF-003", "WhatsApp callback", "Automatic", "Admin 04", "10:18 AM", "Delayed"],
      ["WF-004", "Expense approval", "Approval-based", "Admin 02", "10:15 AM", "Pending"],
      ["WF-005", "Manual case review", "Manual", "Admin 01", "10:12 AM", "Active"],
    ],
    actions: ["Review failures", "Open workflow", "Pause automation"],
  },
  side: {
    title: "AI management controls",
    rows: [
      ["Monthly budget", "₹15,000 · demo"],
      ["Budget used", "56.3%"],
      ["Human takeover", "Available"],
      ["Sensitive decisions", "Human approval"],
      ["Service promises", "Verification required"],
      ["Emergency fallback", "Human queue"],
    ],
    budget: { label: "Budget remaining · ₹6,550", value: "43.7%", pct: 43.7 },
  },
  lower: {
    title: "Monthly AI spend by channel · demo",
    kind: "bars2",
    bars: [
      { label: "Inbound voice", value: "₹2,700", pct: 90 },
      { label: "Outbound voice", value: "₹1,800", pct: 60 },
      { label: "Chatbot", value: "₹1,500", pct: 50 },
      { label: "WhatsApp", value: "₹1,100", pct: 36.7 },
      { label: "Email AI", value: "₹650", pct: 21.7 },
      { label: "Smart assignment", value: "₹700", pct: 23.3 },
    ],
    actions: ["Channel usage", "Quality report"],
  },
  safeguards: [
    ["Human interventions", "08"],
    ["Success rate", "Requires run totals"],
    ["Manual intervention", "Review queue"],
    ["WhatsApp sync", "Delayed"],
  ],
};

export default function AiAutomationDashboard() {
  return <RegisterScreen spec={spec} />;
}
