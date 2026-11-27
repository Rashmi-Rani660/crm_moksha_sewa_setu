"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-036 — Social Media & Google Ads Leads */
const spec: ScreenSpec = {
  code: "SA-036",
  title: "Social Media & Google Ads Leads",
  active: "communication-hub",
  kpis: [
    { value: "04", label: "Incoming today", tone: "blue" },
    { value: "02", label: "Social media", tone: "green" },
    { value: "02", label: "Google Ads", tone: "orange" },
    { value: "02", label: "Pending review", tone: "purple" },
    { value: "01", label: "Duplicate flagged", tone: "blue" },
    { value: "01", label: "Unassigned", tone: "green" },
  ],
  tabs: ["Lead inbox", "Campaigns", "Source mapping", "Deduplication", "Reports"],
  register: {
    title: "Campaign lead queue",
    columns: [
      { label: "Lead ID", w: 100 },
      { label: "Source", w: 120 },
      { label: "Campaign", w: 180 },
      { label: "Enquiry", w: 160 },
      { label: "Owner", w: 110 },
      { label: "Status", w: 115, pill: true },
    ],
    rows: [
      ["LEAD-001", "Social media", "Free Sewa awareness", "Eligibility enquiry", "User 07", "New"],
      ["LEAD-002", "Google Ads", "Ghaziabad helpline", "Cremation support", "Admin 01", "Review"],
      ["LEAD-003", "Social media", "Volunteer awareness", "Volunteer enquiry", "User 09", "Assigned"],
      ["LEAD-004", "Google Ads", "Free Sewa awareness", "Coverage enquiry", "Unassigned", "Pending"],
    ],
    actions: ["Assign lead", "Review duplicate", "Convert to request"],
  },
  side: {
    title: "Campaign controls",
    rows: [
      ["Service geography", "Ghaziabad active"],
      ["Delhi / Noida", "Coming soon"],
      ["Lead source consent", "Required"],
      ["Attribution", "UTM / platform ID"],
      ["Sync failures", "Retry queue"],
      ["Advertising spend", "Separate from donations"],
    ],
    actions: ["Review settings", "View history"],
  },
  lower: {
    title: "Lead lifecycle",
    kind: "flow5",
    steps: ["Capture", "Deduplicate", "Qualify", "Assign", "Convert"],
    rows: [
      ["Duplicate review", "01"],
      ["Unassigned", "01"],
    ],
  },
  safeguards: {
    title: "Campaign monitoring",
    rows: [
      ["Duplicate review", "01"],
      ["Unassigned", "01"],
      ["Pending review", "02"],
      ["Cost per lead", "Provider data required"],
    ],
  },
};

export default function SA036SocialLeads() {
  return <RegisterScreen spec={spec} />;
}
