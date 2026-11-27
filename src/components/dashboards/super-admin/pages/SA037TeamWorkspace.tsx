"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-037 — Internal Team Workspace */
const spec: ScreenSpec = {
  code: "SA-037",
  title: "Internal Team Workspace",
  active: "communication-hub",
  kpis: [
    { value: "12", label: "Admin accounts", tone: "blue" },
    { value: "173", label: "User accounts", tone: "green" },
    { value: "04", label: "Open threads", tone: "orange" },
    { value: "02", label: "Unread mentions", tone: "purple" },
    { value: "01", label: "Pending handover", tone: "blue" },
    { value: "03", label: "Shared files", tone: "green" },
  ],
  tabs: ["Team inbox", "Channels", "Files", "Mentions", "Handover"],
  register: {
    title: "Team conversations",
    columns: [
      { label: "Thread", w: 110 },
      { label: "Department", w: 130 },
      { label: "Subject", w: 200 },
      { label: "Owner", w: 100 },
      { label: "Last update", w: 100 },
      { label: "Status", w: 115, pill: true },
    ],
    rows: [
      ["TEAM-001", "Operations", "Urgent case coordination", "Admin 01", "10:24 AM", "Open"],
      ["TEAM-002", "Finance", "Expense review", "Admin 02", "10:20 AM", "Pending"],
      ["TEAM-003", "Volunteer", "Field assignment update", "Admin 03", "10:12 AM", "Open"],
      ["TEAM-004", "Communication", "Helpline handover", "Admin 04", "09:58 AM", "Review"],
    ],
    actions: ["New thread", "Assign action", "Share file", "Link case"],
  },
  side: {
    title: "Selected thread · TEAM-001",
    rows: [
      ["Audience", "Authorised operations team"],
      ["Linked case", "MS-26-1101"],
      ["Priority", "High"],
      ["Internal note", "Verify documents before dispatch"],
      ["Mention", "Reporting Admin"],
      ["Access", "Department scoped"],
    ],
    actions: ["Review settings", "View history"],
  },
  lower: {
    title: "Collaboration flow",
    kind: "flow5",
    steps: ["Discuss", "Assign", "Accept", "Update", "Close"],
    rows: [
      ["Unread mentions", "02"],
      ["Handover", "01 pending"],
    ],
  },
  safeguards: {
    title: "Team controls",
    rows: [
      ["Unread mentions", "02"],
      ["Handover", "01 pending"],
      ["File access", "Restricted"],
      ["Audit", "Enabled"],
    ],
  },
};

export default function SA037TeamWorkspace() {
  return <RegisterScreen spec={spec} />;
}
