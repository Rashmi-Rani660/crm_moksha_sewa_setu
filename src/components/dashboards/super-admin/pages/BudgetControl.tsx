"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-043 — Financial Approvals & Budget Control (demo data). */
const spec: ScreenSpec = {
  code: "SA-043",
  title: "Financial Approvals & Budget Control",
  active: "finance-donations",
  kpis: [
    { value: "₹20.00L", label: "Budget" },
    { value: "₹12.40L", label: "Expenses" },
    { value: "62%", label: "Utilised" },
    { value: "07", label: "Pending approvals" },
    { value: "₹45,000", label: "Pending claims" },
    { value: "01", label: "Over-budget", tone: "red" },
  ],
  tabs: ["Approval queue", "Budgets", "Limits", "Exceptions", "Audit history"],
  register: {
    title: "Financial approval queue",
    columns: [
      { label: "Approval ID", w: 121 },
      { label: "Category", w: 177 },
      { label: "Amount", w: 117, align: "right" },
      { label: "Maker", w: 89 },
      { label: "Approver", w: 132 },
      { label: "Status", w: 113, pill: true },
    ],
    rows: [
      ["APV-001", "Case expenses", "₹12,000", "User 07", "Admin 02", "Pending"],
      ["APV-002", "Procurement", "₹18,000", "User 08", "Admin 02", "Review"],
      ["APV-003", "Vehicle maintenance", "₹8,000", "User 09", "Super Admin", "Pending"],
      ["APV-004", "Reimbursement", "₹7,000", "User 10", "Admin 02", "Pending"],
    ],
    actions: ["Review approval", "Request clarification", "View budget"],
  },
  side: {
    title: "Budget guardrails",
    rows: [
      ["Financial year", "2026–27"],
      ["Approved budget", "₹20.00L · demo"],
      ["Posted expenditure", "₹12.40L · demo"],
      ["Committed costs", "Review separately"],
      ["Restricted funds", "Purpose bound"],
      ["Self-approval", "Blocked"],
    ],
  },
  lower: {
    title: "Budget allocation · FY 2026–27",
    kind: "bars",
    bars: [
      { label: "Posted expenses", value: "₹12.40 L · 62%", pct: 62 },
      { label: "Committed expenses", value: "₹2.00 L · 10%", pct: 10 },
      { label: "Uncommitted budget", value: "₹5.60 L · 28%", pct: 28 },
    ],
    actions: ["Review approval limits", "Payment authority"],
  },
  safeguards: [
    ["Over-budget request", "01"],
    ["Approval policy", "Maker-checker"],
  ],
};

export default function BudgetControl() {
  return <RegisterScreen spec={spec} />;
}
