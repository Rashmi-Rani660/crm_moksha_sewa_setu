"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-039 — Finance Command Centre */
const spec: ScreenSpec = {
  code: "SA-039",
  title: "Finance Command Centre",
  active: "finance-donations",
  kpis: [
    { value: "₹18.76L", label: "Donations · FY", tone: "blue" },
    { value: "₹12.40L", label: "Expenses · FY", tone: "green" },
    { value: "₹6.36L", label: "Income less expenses", tone: "orange" },
    { value: "₹45,000", label: "Pending approvals", tone: "purple" },
    { value: "04", label: "Reconciliation due", tone: "blue" },
    { value: "01", label: "Sync failure", tone: "green" },
  ],
  tabs: ["Overview", "Expenses", "Budgets", "Reconciliation", "Fund utilisation"],
  register: {
    title: "Financial control queue",
    columns: [
      { label: "Reference", w: 110 },
      { label: "Category", w: 180 },
      { label: "Amount", w: 100 },
      { label: "Owner", w: 120 },
      { label: "Review", w: 120 },
      { label: "Status", w: 115, pill: true },
    ],
    rows: [
      ["FIN-001", "Case expenses", "₹28,500", "Finance Admin", "Maker-checker", "Pending"],
      ["FIN-002", "Vehicle maintenance", "₹12,400", "Finance Admin", "Maker-checker", "Review"],
      ["FIN-003", "Material purchase", "₹4,100", "Finance Admin", "Maker-checker", "Pending"],
      ["REC-001", "Donation settlement", "₹25,000", "Accounts User", "Bank match", "Pending"],
      ["SYNC-001", "Accounting integration", "—", "Finance Admin", "Technical review", "Failed"],
    ],
    actions: ["Review expenses", "Open reconciliation", "View budget"],
  },
  side: {
    title: "Financial safeguards",
    rows: [
      ["Cash donations", "Not accepted"],
      ["Accounting sync", "Failed · demo"],
      ["Restricted funds", "Separate ledger"],
      ["Available funds", "Ledger-derived only"],
      ["Self-approval", "Blocked"],
      ["Financial year", "2026–27"],
    ],
    actions: ["Review settings", "View history"],
  },
  lower: {
    title: "Expense workflow",
    kind: "flow5",
    steps: ["Request", "Verify", "Approve", "Pay", "Reconcile"],
    rows: [
      ["Pending expense approvals", "₹45,000"],
      ["Unmatched transactions", "04"],
    ],
  },
  safeguards: {
    title: "Fund & budget controls",
    rows: [
      ["Pending expense approvals", "₹45,000"],
      ["Unmatched transactions", "04"],
      ["Restricted funds", "Review ledger"],
      ["Budget utilisation", "Approved budget required"],
    ],
  },
};

export default function SA039FinanceCommand() {
  return <RegisterScreen spec={spec} />;
}
