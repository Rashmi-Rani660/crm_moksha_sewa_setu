# Super Admin module — pages SA-001 … SA-009

Visual reference implementation of the Super Admin screens. **All figures are
demonstration data** ("DEMO DATA — Design reference only" in every footer).
Implementation and acceptance testing are still required.

## Folder structure

```
src/app/dashboard/super-admin/
  page.tsx                          SA-001  Super Admin Dashboard
  live-operations/page.tsx          SA-002  Live Operations & Emergency Control
  notification-alerts/page.tsx      SA-003  Notification & Alert Centre
  central-approvals/page.tsx        SA-004  Central Approval Centre
  organisation-setup/page.tsx       SA-005  Organisation Setup
  city-zone-centres/page.tsx        SA-006  City, Zone & Service Centre Management
  departments-centres/page.tsx      SA-007  Organisation & Department Management
  users-access-control/page.tsx     SA-008  Admin & User Management
  users-access-control/create/      SA-009  Create User & Assign Access
  [section]/page.tsx                other sidebar items (placeholder page)

src/components/dashboards/super-admin/
  kit.tsx                           shared frame, headings, KPI tiles, panels, tabs, controls
  pages/SA00x*.tsx                  one file per screen (data at the top of each file)
```

The sidebar menu for Super Admin is defined in
`src/components/dashboards/shells.tsx`.

## Requirements from the design brief

**01 — Dashboard.** Use consistent reporting periods and one database. All KPI
drill-downs respect permissions. Financial difference is not available cash.
Emergency pause requires confirmation and audit; retain manual response.
Dashboard numbers are demonstration only.

**02 — Live Operations.** Emergency queue must show owner, priority, SLA and
escalation. Track GPS only during authorised duty with consent and stale-data
indicators. No deployment outside approved coverage without authorisation.
Record manual override reasons and retain legal verification.

**03 — Notifications.** Read and acknowledgement are distinct states. Record
recipient, owner, escalation, delivery, retries and audit. Critical alerts
cannot be disabled. Broadcast preview and audience approval are required;
outgoing SMS only.

**04 — Central Approvals.** Enforce maker-checker, independent approval and
separation of duties server-side. No self-approval. Restrict bulk actions to
low-risk policy-approved records; require reasons, evidence, audit trail and
notification. Approval thresholds are configurable.

**05 — Organisation Setup.** Registration number, PAN, contact details and
certificates require source verification; do not fabricate or assume validity.
Use FY identifiers, INR and IST. No cash donations. Existing HRMS and website
CMS remain separate.

**06 — City, Zone & Centres.** Only Ghaziabad is active. Delhi and Noida coming
soon. Centre and PIN counts are demo values, not verified coverage. Activation
requires readiness and approval; validate PINs, retain change history and sync
website. Archive rather than delete.

**07 — Departments.** HRMS is authoritative for departments and employees.
Configure CRM-specific access and reporting separately; restrict updates to
authorised scopes. Do not delete linked departments. Transfer active cases,
tasks and access before archival.

**08 — Users.** Exactly three access levels; designation is not an access
level. Mask mobile numbers and use fictional records. No direct deletion.
Enforce MFA, review scope, session revocation and HRMS exit handover.
Volunteers are managed separately.

**09 — Create User.** HRMS employee fields read-only. Verified unique mobile is
login identifier. MFA mandatory and cannot be disabled. Super Admin elevation
needs independent approval and phishing-resistant MFA. Preview effective
permissions, assign training, activate only after approval; no self-escalation.

Visual scope: trend and status charts, budget and training bars, status
colours, schematic GPS (not a real map). Navigation and visible-row search are
demonstrative; other controls are placeholders until the APIs exist.

## Finance & Donations, AI & Automation (SA-041 … SA-050)

All ten screens share one layout, `super-admin/RegisterScreen.tsx` (heading +
screen picker, six KPI tiles, five tabs, register table, controls panel, lower
detail panel, safeguards panel). Each screen is a data file in `pages/`:

```
finance-donations/                  DonationReceipts.tsx       SA-041
finance-donations/case-expenses     CaseExpenses.tsx           SA-042
finance-donations/budget-control    BudgetControl.tsx          SA-043
finance-donations/csr-partnerships  CsrPartnerships.tsx        SA-044
finance-donations/fund-utilisation  FundUtilisation.tsx        SA-045
automation-ai/                      AiAutomationDashboard.tsx  SA-046
automation-ai/controls              AutomationControls.tsx     SA-047
automation-ai/rule-builder          RuleBuilder.tsx            SA-048
automation-ai/smart-assignment      SmartAssignment.tsx        SA-049
automation-ai/ai-configuration      AiConfiguration.tsx        SA-050
automation-ai/workflow-builder      SA019WorkflowBuilder.tsx   (moved from automation-ai/)
```

Sidebar labels "Notifications & Alerts" and "AI & Automation" keep the old
URLs through `slugAlias` in `shells.tsx`.
