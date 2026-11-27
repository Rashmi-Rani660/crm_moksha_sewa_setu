/** URLs of the Super Admin module pages (SA-001 … SA-020, SA-041 … SA-050). */
const B = "/dashboard/super-admin";

export const saRoutes = {
  home: B,
  approvals: `${B}/central-approvals`,
  users: `${B}/users-access-control`,
  createUser: `${B}/users-access-control/create`,
  roles: `${B}/users-access-control/roles`,
  hierarchy: `${B}/users-access-control/reporting-hierarchy`,
  departments: `${B}/departments-centres`,
  masterData: `${B}/master-data`,
  leads: `${B}/sewa-operations`,
  requestDetails: `${B}/sewa-operations/request-details`,
  cases: `${B}/case-workflow`,
  caseDetails: `${B}/case-workflow/case-details`,
  tasks: `${B}/case-workflow/tasks`,
  createTask: `${B}/case-workflow/tasks/create`,
  sla: `${B}/case-workflow/sla`,
  workflows: `${B}/automation-ai/workflow-builder`,
  // Finance & Donations (SA-041 … SA-045)
  donationReceipts: `${B}/finance-donations`,
  caseExpenses: `${B}/finance-donations/case-expenses`,
  budgetControl: `${B}/finance-donations/budget-control`,
  csrPartnerships: `${B}/finance-donations/csr-partnerships`,
  fundUtilisation: `${B}/finance-donations/fund-utilisation`,
  // AI & Automation (SA-046 … SA-050)
  aiDashboard: `${B}/automation-ai`,
  aiControls: `${B}/automation-ai/controls`,
  ruleBuilder: `${B}/automation-ai/rule-builder`,
  smartAssignment: `${B}/automation-ai/smart-assignment`,
  aiConfiguration: `${B}/automation-ai/ai-configuration`,
  audit: `${B}/audit-logs`,
} as const;

/** SA-041 … SA-050 screens; the picker lists only the screens of the open section (finance / ai). */
export const screenPicker = [
  { group: "finance", code: "SA-041", title: "Donation Receipts & Reconciliation", href: saRoutes.donationReceipts },
  { group: "finance", code: "SA-042", title: "Case Expenses & Reimbursement", href: saRoutes.caseExpenses },
  { group: "finance", code: "SA-043", title: "Financial Approvals & Budget Control", href: saRoutes.budgetControl },
  { group: "finance", code: "SA-044", title: "CSR & Partnership Management", href: saRoutes.csrPartnerships },
  { group: "finance", code: "SA-045", title: "Fund Utilisation & Transparency", href: saRoutes.fundUtilisation },
  { group: "ai", code: "SA-046", title: "AI & Automation Dashboard", href: saRoutes.aiDashboard },
  { group: "ai", code: "SA-047", title: "Automatic / Manual / Approval Controls", href: saRoutes.aiControls },
  { group: "ai", code: "SA-048", title: "Automation Rule Builder", href: saRoutes.ruleBuilder },
  { group: "ai", code: "SA-049", title: "AI Smart Assignment Management", href: saRoutes.smartAssignment },
  { group: "ai", code: "SA-050", title: "AI Configuration & Quality Testing", href: saRoutes.aiConfiguration },
] as const;

export type ScreenCode = (typeof screenPicker)[number]["code"];
