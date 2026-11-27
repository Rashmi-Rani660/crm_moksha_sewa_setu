"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-040 — Donations & Donor Management */
const spec: ScreenSpec = {
  code: "SA-040",
  title: "Donations & Donor Management",
  active: "finance-donations",
  kpis: [
    { value: "₹18.76L", label: "Donations · FY", tone: "blue" },
    { value: "01", label: "New donor · demo", tone: "green" },
    { value: "04", label: "Reconciliation due", tone: "orange" },
    { value: "02", label: "Receipts pending", tone: "purple" },
    { value: "01", label: "Payment review", tone: "blue" },
    { value: "00", label: "Cash donations", tone: "green" },
  ],
  tabs: ["Donor directory", "Online donations", "Receipts", "Consent", "Reports"],
  register: {
    title: "Donation & donor register",
    columns: [
      { label: "Donation ID", w: 110 },
      { label: "Donor", w: 140 },
      { label: "Channel", w: 120 },
      { label: "Amount", w: 100 },
      { label: "Receipt", w: 100 },
      { label: "Status", w: 115, pill: true },
    ],
    rows: [
      ["DON-078", "Demo Donor 01", "Online", "₹25,000", "Pending", "Reconcile"],
      ["DON-077", "Anonymous", "Online", "₹5,000", "Issued", "Settled"],
      ["DON-076", "Demo Donor 02", "Bank transfer", "₹10,000", "Issued", "Settled"],
      ["DON-075", "Demo Donor 03", "Online", "₹2,500", "Pending", "Review"],
      ["DON-074", "Demo Donor 04", "Online", "₹1,000", "Issued", "Settled"],
    ],
    actions: ["View donor", "Review payment", "Issue eligible receipt"],
  },
  side: {
    title: "Selected donation · DON-078",
    rows: [
      ["Donor identity", "Masked / authorised"],
      ["Payment reference", "Provider verified"],
      ["Fund restriction", "Confirm designation"],
      ["Receipt eligibility", "Verify settlement"],
      ["Communication consent", "Check preference"],
      ["Tax benefit", "Verify valid approval"],
    ],
    actions: ["Review settings", "View history"],
  },
  lower: {
    title: "Donation lifecycle",
    kind: "flow5",
    steps: ["Receive", "Verify", "Reconcile", "Receipt", "Acknowledge"],
    rows: [
      ["Cash donation", "Not accepted"],
      ["Duplicate receipt", "Prevent"],
    ],
  },
  safeguards: {
    title: "Donor safeguards",
    rows: [
      ["Cash donation", "Not accepted"],
      ["Duplicate receipt", "Prevent"],
      ["Refund request", "Approval required"],
      ["Donor export", "Restricted"],
    ],
  },
};

export default function SA040DonationsManagement() {
  return <RegisterScreen spec={spec} />;
}
