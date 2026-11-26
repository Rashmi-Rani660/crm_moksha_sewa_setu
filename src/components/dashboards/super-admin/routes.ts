/** URLs of the Super Admin module pages (SA-001 … SA-020). */
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
  workflows: `${B}/automation-ai`,
  audit: `${B}/audit-logs`,
} as const;
