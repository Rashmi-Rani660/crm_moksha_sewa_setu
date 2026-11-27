/** URLs of the Super Admin module pages (SA-001 … SA-040). */
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
  // Communication Hub & Calling (SA-031 … SA-038)
  inboundCall: `${B}/communication-hub`,
  outboundCall: `${B}/communication-hub/outbound`,
  callRecordings: `${B}/communication-hub/recordings`,
  chatbotManagement: `${B}/communication-hub/chatbot`,
  outgoingSms: `${B}/communication-hub/sms`,
  socialLeads: `${B}/communication-hub/leads`,
  teamWorkspace: `${B}/communication-hub/workspace`,
  calendarMeetings: `${B}/communication-hub/calendar`,
  // Finance & Donations (SA-039 … SA-040)
  financeCommand: `${B}/finance-donations`,
  donorManagement: `${B}/finance-donations/donations`,
  donationReceipts: `${B}/finance-donations/receipts`,
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

/** SA-011 … SA-020 screens, in the order of the design's screen picker. */
export const screenPicker1120 = [
  { code: "SA-011", title: "Reporting Hierarchy", href: saRoutes.hierarchy , section: "departments-centres" },
  { code: "SA-012", title: "Master Data Management", href: saRoutes.masterData , section: "master-data" },
  { code: "SA-013", title: "Central Leads & Requests Management", href: saRoutes.leads , section: "sewa-operations" },
  { code: "SA-014", title: "Sewa Request Details & Verification", href: saRoutes.requestDetails , section: "sewa-operations" },
  { code: "SA-015", title: "Case Management", href: saRoutes.cases , section: "case-workflow" },
  { code: "SA-016", title: "Complete Case Details – 360° View", href: saRoutes.caseDetails , section: "case-workflow" },
  { code: "SA-017", title: "Task Management", href: saRoutes.tasks , section: "case-workflow" },
  { code: "SA-018", title: "Create & Assign Task", href: saRoutes.createTask , section: "case-workflow" },
  { code: "SA-019", title: "Task Templates & Workflow Builder", href: saRoutes.workflows , section: "case-workflow" },
  { code: "SA-020", title: "SLA & Escalation Management", href: saRoutes.sla , section: "case-workflow" },
] as const;

/** SA-041 … SA-050 screens; the picker lists only the screens of the open section (finance / ai). */
export const screenPicker = [
  { group: "book-031-040", code: "SA-031", title: "AI Inbound Calling Centre", href: saRoutes.inboundCall },
  { group: "book-031-040", code: "SA-032", title: "AI Outbound Calling Centre", href: saRoutes.outboundCall },
  { group: "book-031-040", code: "SA-033", title: "Call Recordings, Transcripts & History", href: saRoutes.callRecordings },
  { group: "book-031-040", code: "SA-034", title: "AI Chatbot Management", href: saRoutes.chatbotManagement },
  { group: "book-031-040", code: "SA-035", title: "Outgoing SMS Management", href: saRoutes.outgoingSms },
  { group: "book-031-040", code: "SA-036", title: "Social Media & Google Ads Leads", href: saRoutes.socialLeads },
  { group: "book-031-040", code: "SA-037", title: "Internal Team Workspace", href: saRoutes.teamWorkspace },
  { group: "book-031-040", code: "SA-038", title: "Calendar & Meetings", href: saRoutes.calendarMeetings },
  { group: "book-031-040", code: "SA-039", title: "Finance Command Centre", href: saRoutes.financeCommand },
  { group: "book-031-040", code: "SA-040", title: "Donations & Donor Management", href: saRoutes.donorManagement },
] as const;

export type ScreenCode = (typeof screenPicker)[number]["code"] | string;
