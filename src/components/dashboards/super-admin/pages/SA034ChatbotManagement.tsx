"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-034 — AI Chatbot Management */
const spec: ScreenSpec = {
  code: "SA-034",
  title: "AI Chatbot Management",
  active: "communication-hub",
  kpis: [
    { value: "06", label: "Chats today", tone: "blue" },
    { value: "05", label: "Handled", tone: "green" },
    { value: "01", label: "Human escalation", tone: "orange" },
    { value: "02", label: "Draft updates", tone: "purple" },
    { value: "₹6", label: "AI cost today", tone: "blue" },
    { value: "01", label: "Review due", tone: "green" },
  ],
  tabs: ["Overview", "Knowledge base", "Response rules", "Quality testing", "Cost control"],
  register: {
    title: "Conversation & knowledge review",
    columns: [
      { label: "Reference", w: 110 },
      { label: "Topic", w: 200 },
      { label: "Language", w: 120 },
      { label: "Mode", w: 90 },
      { label: "Owner", w: 100 },
      { label: "Status", w: 115, pill: true },
    ],
    rows: [
      ["CHAT-001", "Free cremation eligibility", "Hindi", "AI", "Admin 01", "Resolved"],
      ["CHAT-002", "Unclaimed body report", "Hindi", "Human", "User 07", "Escalated"],
      ["CHAT-003", "Service coverage", "English", "AI", "Admin 01", "Resolved"],
      ["KB-001", "Required documents", "Hindi / English", "Draft", "Admin 01", "Review"],
      ["KB-002", "Ghaziabad coverage", "Hindi / English", "Published", "Admin 01", "Active"],
    ],
    actions: ["Test chatbot", "Review knowledge", "Take over", "Publish approved"],
  },
  side: {
    title: "Saumya / Moksha Sathi controls",
    rows: [
      ["Channels", "Website chat / voice"],
      ["Name capture", "Respectful address"],
      ["Service scope", "Free last-rites support"],
      ["Coverage", "Ghaziabad only"],
      ["Sensitive enquiries", "Human review"],
      ["Budget & limits", "Configurable"],
    ],
    actions: ["Review settings", "View history"],
  },
  lower: {
    title: "Response workflow",
    kind: "flow5",
    steps: ["Greet", "Understand", "Guide", "Escalate", "Record"],
    rows: [
      ["Unsupported answer", "Ask / escalate"],
      ["Voice usage", "Budget alert"],
    ],
  },
  safeguards: {
    title: "AI guardrails",
    rows: [
      ["Unsupported answer", "Ask / escalate"],
      ["Voice usage", "Budget alert"],
      ["Privacy", "Minimum data"],
      ["Emergency intake", "Always available"],
    ],
  },
};

export default function SA034ChatbotManagement() {
  return <RegisterScreen spec={spec} />;
}
