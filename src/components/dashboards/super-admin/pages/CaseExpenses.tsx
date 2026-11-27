"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-042 — Case Expenses & Reimbursement (demo data). */
const spec: ScreenSpec = {
  code: "SA-042",
  title: "Case Expenses & Reimbursement",
  active: "finance-donations",
  kpis: [
    { value: "12", label: "Expense claims" },
    { value: "07", label: "Approved" },
    { value: "03", label: "Pending review" },
    { value: "02", label: "Returned" },
    { value: "₹45,000", label: "Pending amount" },
    { value: "100%", label: "Case-linked" },
  ],
  tabs: ["Expense register", "Claims", "Evidence", "Reimbursements", "History"],
  register: {
    title: "Case expense register",
    columns: [
      { label: "Expense ID", w: 115, align: "right" },
      { label: "Case ID", w: 132 },
      { label: "Category", w: 151 },
      { label: "Amount", w: 131, align: "right" },
      { label: "Claimant", w: 94 },
      { label: "Status", w: 126, pill: true },
    ],
    rows: [
      ["EXP-001", "MS-26-1101", "Cremation materials", "₹3,500", "User 07", "Approved"],
      ["EXP-002", "MS-26-1100", "Vehicle fuel", "₹1,200", "User 08", "Review"],
      ["EXP-003", "MS-26-1099", "Protective supplies", "₹850", "User 09", "Pending"],
      ["EXP-004", "MS-26-1098", "Transport toll", "₹300", "User 10", "Returned"],
      ["EXP-005", "MS-26-1097", "Cremation support", "₹4,500", "User 07", "Approved"],
    ],
    actions: ["Create claim", "Review evidence", "View ledger"],
  },
  side: {
    title: "Selected claim · EXP-002",
    rows: [
      ["Linked case", "MS-26-1100"],
      ["Amount", "₹1,200"],
      ["Supporting bill", "Uploaded · demo"],
      ["Cost centre", "Ghaziabad"],
      ["Approver", "Finance Admin"],
      ["Payment status", "Not released"],
    ],
  },
  lower: {
    title: "Expense variance & ageing",
    kind: "list",
    rows: [
      ["Estimated claim · EXP-002", "₹1,500"],
      ["Actual claim", "₹1,200"],
      ["Variance (under estimate)", "₹300"],
    ],
    note: "Ageing: 0–7 / 8–30 / 30+ days · filter by claim",
    actions: ["Ageing report", "Duplicate invoice check", "Payment reference"],
  },
  safeguards: [
    ["Self-approval", "Blocked"],
    ["Payment release", "Separate authority"],
  ],
};

export default function CaseExpenses() {
  return <RegisterScreen spec={spec} />;
}
