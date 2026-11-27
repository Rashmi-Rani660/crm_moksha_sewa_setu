"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-041 — Donation Receipts & Reconciliation (demo data). */
const spec: ScreenSpec = {
  code: "SA-041",
  title: "Donation Receipts & Reconciliation",
  active: "finance-donations",
  kpis: [
    { value: "18", label: "Receipts issued" },
    { value: "₹1.20L", label: "Settled donations" },
    { value: "03", label: "Unmatched" },
    { value: "02", label: "Receipt pending" },
    { value: "01", label: "Refund review" },
    { value: "10:24 AM", label: "Bank sync" },
  ],
  tabs: ["Reconciliation", "Receipts", "Bank statement", "Exceptions", "Audit history"],
  register: {
    title: "Donation settlement register",
    columns: [
      { label: "Transaction", w: 132 },
      { label: "Channel", w: 106 },
      { label: "Amount", w: 109, align: "right" },
      { label: "Bank match", w: 164 },
      { label: "Receipt", w: 111 },
      { label: "Status", w: 127, pill: true },
    ],
    rows: [
      ["DON-078", "UPI", "₹5,000", "Matched", "REC-078", "Issued"],
      ["DON-079", "NEFT", "₹25,000", "Matched", "Pending", "Review"],
      ["DON-080", "Gateway", "₹2,500", "Unmatched", "Blocked", "Pending"],
      ["DON-081", "UPI", "₹10,000", "Matched", "REC-081", "Issued"],
      ["DON-082", "Gateway", "₹1,000", "Refund review", "Blocked", "Review"],
    ],
    actions: ["Match transaction", "Issue receipt", "Review refund"],
  },
  side: {
    title: "Reconciliation controls",
    rows: [
      ["FY", "2026–27"],
      ["Cash donations", "Not accepted"],
      ["Receipt eligibility", "Settled + verified"],
      ["Tax benefit wording", "Verify approval"],
      ["Duplicate payment", "Block duplicate receipt"],
      ["Bank sync", "10:24 AM · demo"],
    ],
  },
  lower: {
    title: "Reconciliation exceptions",
    kind: "list",
    rows: [
      ["Unmatched settlements", "03"],
      ["Receipts pending", "02"],
      ["Refund under review", "01"],
    ],
    note: "Bank reference · settlement date · receipt date",
    actions: ["Review unmatched", "Receipt history", "Refund history"],
  },
  safeguards: [
    ["Receipt pending", "02"],
    ["Refund under review", "01"],
  ],
};

export default function DonationReceipts() {
  return <RegisterScreen spec={spec} />;
}
