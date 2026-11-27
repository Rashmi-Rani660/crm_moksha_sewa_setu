"use client";

import RegisterScreen, { type ScreenSpec } from "@/components/dashboards/super-admin/RegisterScreen";

/** SA-045 — Fund Utilisation & Transparency (demo data). */
const spec: ScreenSpec = {
  code: "SA-045",
  title: "Fund Utilisation & Transparency",
  active: "finance-donations",
  kpis: [
    { value: "₹18.76L", label: "Donations FY" },
    { value: "₹12.40L", label: "Expenses FY" },
    { value: "₹6.36L", label: "Income less expense" },
    { value: "Review", label: "Restricted funds" },
    { value: "02", label: "Reports due" },
    { value: "Review", label: "Ledger status" },
  ],
  tabs: ["Fund overview", "Utilisation", "Restricted funds", "Reports", "Audit"],
  register: {
    title: "Fund utilisation ledger",
    columns: [
      { label: "Fund", w: 119 },
      { label: "Purpose", w: 179 },
      { label: "Income", w: 128, align: "right" },
      { label: "Expense", w: 101, align: "right" },
      { label: "Balance*", w: 104, align: "right" },
      { label: "Status", w: 118, pill: true },
    ],
    rows: [
      ["FUND-01", "General sewa", "₹10.00L", "₹6.50L", "₹3.50L", "Review"],
      ["FUND-02", "Cremation support", "₹5.00L", "₹3.90L", "₹1.10L", "Review"],
      ["FUND-03", "Logistics support", "₹3.76L", "₹2.00L", "₹1.76L", "Review"],
    ],
    actions: ["View ledger", "Prepare report", "Review restrictions"],
  },
  side: {
    title: "Transparency controls",
    rows: [
      ["*Income less expense", "Not available cash"],
      ["Opening balance", "Ledger required"],
      ["Liabilities", "Account separately"],
      ["Bank reconciliation", "Required"],
      ["Donor reporting", "Aggregate / authorised"],
      ["Public report", "Approval required"],
    ],
  },
  lower: {
    title: "Purpose-wise expense · ₹12.40 L",
    kind: "bars",
    bars: [
      { label: "General sewa", value: "₹6.50 L", pct: 52.4 },
      { label: "Cremation support", value: "₹3.90 L", pct: 31.5 },
      { label: "Logistics support", value: "₹2.00 L", pct: 16.1 },
    ],
    actions: ["Fund ledger", "Restricted funds"],
  },
  safeguards: [
    ["Restricted use", "Validate purpose"],
    ["Publication", "Approved aggregate only"],
  ],
};

export default function FundUtilisation() {
  return <RegisterScreen spec={spec} />;
}
