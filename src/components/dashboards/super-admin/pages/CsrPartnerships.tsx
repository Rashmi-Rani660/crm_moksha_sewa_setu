"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-044 — CSR & Partnership Management (demo data). */
const spec: ScreenSpec = {
  code: "SA-044",
  title: "CSR & Partnership Management",
  active: "finance-donations",
  kpis: [
    { value: "08", label: "Prospects" },
    { value: "03", label: "Under review" },
    { value: "02", label: "Agreements active" },
    { value: "02", label: "Reports due" },
    { value: "01", label: "Renewals due" },
    { value: "04", label: "Follow-ups" },
  ],
  tabs: ["Partner pipeline", "Due diligence", "Agreements", "Reporting", "History"],
  register: {
    title: "CSR & partnership pipeline",
    columns: [
      { label: "Partner ID", w: 93 },
      { label: "Organisation", w: 140 },
      { label: "Stage", w: 84 },
      { label: "Purpose", w: 193 },
      { label: "Owner", w: 104 },
      { label: "Next action", w: 135, pill: true },
    ],
    rows: [
      ["CSR-001", "Demo Partner A", "Review", "Free cremation support", "Admin 03", "Due diligence"],
      ["CSR-002", "Demo Partner B", "Proposal", "Vehicle support", "Admin 03", "Review"],
      ["CSR-003", "Demo Partner C", "Active", "Material support", "Admin 03", "Report due"],
      ["CSR-004", "Demo Partner D", "Active", "Sewa operations", "Admin 03", "Renewal"],
      ["CSR-005", "Demo Partner E", "Prospect", "General support", "Unassigned", "Assign"],
    ],
    actions: ["Add prospect", "Review proposal", "Assign follow-up"],
  },
  side: {
    title: "Selected partnership · CSR-003",
    rows: [
      ["Partner details", "Illustrative only"],
      ["Agreement", "Review original"],
      ["Funding restriction", "Material support"],
      ["Commitment", "Not treated as cash"],
      ["Reporting owner", "Admin 03"],
      ["Due diligence", "Required"],
    ],
  },
  lower: {
    title: "CSR pipeline · demo",
    kind: "list",
    rows: [
      ["Proposed funding", "₹5.00 L"],
      ["Confirmed funding", "₹2.00 L"],
      ["Received funding", "₹1.00 L"],
    ],
    note: "Track project milestones and reports separately",
    actions: ["Agreement renewals", "Milestone tracker"],
  },
  safeguards: [
    ["Reports due", "02"],
    ["Unassigned prospects", "01"],
  ],
};

export default function CsrPartnerships() {
  return <RegisterScreen spec={spec} />;
}
