/** SA-071 … SA-076 — demo content (illustrative only; no production data). */

import {
  Activity,
  Bell,
  CalendarClock,
  CircleAlert,
  CircleCheck,
  Clock,
  FileText,
  Hourglass,
  LifeBuoy,
  Link2,
  Network,
  Radio,
  RefreshCw,
  ShieldAlert,
  Siren,
  Timer,
  TriangleAlert,
  UsersRound,
  Settings,
  Building2,
  KeyRound,
  IndianRupee,
  Layers,
  Ticket,
  ShieldCheck,
  Lock,
  Eye,
  Download,
} from "lucide-react";
import type { Screen } from "./types";

const B = "/dashboard/super-admin";

export const sa071: Screen = {
  id: "SA-071",
  title: "Disaster Recovery Management",
  active: "backup-recovery",
  href: `${B}/backup-recovery/disaster-recovery`,
  kpis: [
    { tone: "blue", icon: LifeBuoy, value: "06", label: "Recovery plans" },
    { tone: "green", icon: CalendarClock, value: "01", label: "Drill due" },
    { tone: "orange", icon: CircleAlert, value: "02", label: "Open findings" },
    { tone: "purple", icon: Timer, value: "15 min", label: "RPO target" },
    { tone: "sky", icon: Clock, value: "4 hrs", label: "RTO target" },
    { tone: "green", icon: Radio, value: "Ready", label: "Continuity route" },
  ],
  tabs: ["Overview", "Dependencies", "Drill calendar", "Recovery evidence", "Approvals"],
  main: {
    kind: "register",
    title: "Disaster Recovery Management · register",
    cols: ["Plan ID", "Service", "Priority", "RPO target", "RTO target", "Last drill", "Status"],
    statusCol: 6,
    rows: [
      ["DR-01", "Request intake", "Critical", "15 min", "4 hrs", "22 Nov", "Tested"],
      ["DR-02", "Case records", "Critical", "15 min", "4 hrs", "22 Nov", "Tested"],
      ["DR-03", "Official communications", "High", "30 min", "4 hrs", "22 Nov", "Review"],
      ["DR-04", "Finance ledger", "High", "30 min", "4 hrs", "22 Nov", "Tested"],
      ["DR-05", "Media & documents", "High", "1 hr", "8 hrs", "22 Nov", "Tested"],
      ["DR-06", "AI knowledge & config", "Normal", "24 hrs", "8 hrs", "—", "Drill due"],
    ],
    actions: [
      { label: "Review plan", notice: "Recovery plan opened for review — dependencies, owner and evidence are listed (demo)." },
      { label: "Schedule drill", notice: "Drill request created for an isolated environment; independent approval required (demo)." },
    ],
  },
  tabViews: [
    {
      title: "Service dependencies & fallback",
      cols: ["Service", "Depends on", "Fallback", "Continuity owner", "Status"],
      statusCol: 4,
      rows: [
        ["Request intake", "Database · SMS gateway", "Manual helpline", "Admin 01", "Tested"],
        ["Case records", "Database · File storage", "Read-only replica", "Admin 01", "Tested"],
        ["Official communications", "SMS gateway · Email", "Phone tree", "Admin 03", "Review"],
        ["Finance ledger", "Database · Accounting sync", "Offline ledger sheet", "Admin 04", "Tested"],
        ["AI knowledge & config", "Config store", "Static FAQ", "Admin 02", "Drill due"],
      ],
    },
    {
      title: "Drill calendar · proposed",
      cols: ["Drill ID", "Date", "Plan", "Environment", "Owner", "Status"],
      statusCol: 5,
      rows: [
        ["DRL-12", "22 Nov", "DR-01 · DR-02", "Isolated", "Admin 01", "Completed"],
        ["DRL-13", "22 Dec", "DR-06", "Isolated", "Admin 02", "Scheduled"],
        ["DRL-14", "20 Jan", "DR-03", "Isolated", "Admin 03", "Proposed"],
        ["DRL-15", "17 Feb", "DR-04 · DR-05", "Isolated", "Admin 04", "Proposed"],
      ],
    },
    {
      title: "Recovery evidence",
      cols: ["Evidence ID", "Plan", "Artefact", "Reviewer", "Checked", "Status"],
      statusCol: 5,
      rows: [
        ["EVD-31", "DR-01", "Restore log · isolated run", "Admin 02", "22 Nov", "Verified"],
        ["EVD-32", "DR-02", "Record count reconciliation", "Admin 02", "22 Nov", "Verified"],
        ["EVD-33", "DR-03", "Delivery test report", "—", "—", "Review"],
        ["EVD-34", "DR-04", "Ledger reconciliation", "Admin 04", "22 Nov", "Verified"],
      ],
    },
    {
      title: "Recovery approvals · maker-checker",
      cols: ["Approval ID", "Action", "Maker", "Independent checker", "Requested", "Status"],
      statusCol: 5,
      rows: [
        ["APR-201", "Restore to production · DR-02", "Admin 01", "Admin 02", "22 Nov", "Pending"],
        ["APR-202", "Failover drill · DR-06", "Admin 02", "Super Admin", "24 Nov", "Pending"],
        ["APR-203", "Fallback helpline update", "Admin 03", "Admin 01", "20 Nov", "Approved"],
        ["APR-204", "Rollback plan · DR-04", "Admin 04", "Admin 02", "18 Nov", "Approved"],
      ],
    },
  ],
  side: {
    title: "Recovery readiness",
    rows: [
      ["Emergency intake", "Manual helpline"],
      ["Last restore duration", "1h 20m · demo"],
      ["Actual RPO", "8 min · demo"],
      ["Recovery owner", "Admin 01"],
      ["Next drill", "22 Dec · proposed"],
      ["Open finding", "02 · review"],
    ],
  },
  lowerLeft: {
    title: "Recovery readiness & dependencies",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "Intake → Database → Case records → Communications"],
      ["Status", "Tested plans: 4 of 6"],
      ["Next action", "Next drill: 22 Dec (proposed)"],
    ],
    bars: [{ label: "Tested plans", value: 4, max: 6 }],
  },
  lowerRight: {
    title: "Drill & evidence",
    rows: [
      ["Test environment", "Isolated"],
      ["Evidence", "Required"],
      ["Production recovery", "Independent approval"],
      ["Reconciliation", "Deduplicate offline intake"],
    ],
  },
};

export const sa072: Screen = {
  id: "SA-072",
  title: "Integration & API Health",
  active: "integrations-api",
  href: `${B}/integrations-api`,
  kpis: [
    { tone: "blue", icon: Radio, value: "12", label: "Connected" },
    { tone: "green", icon: Bell, value: "01", label: "Degraded" },
    { tone: "orange", icon: TriangleAlert, value: "01", label: "Failed integration" },
    { tone: "purple", icon: RefreshCw, value: "04", label: "Retry events" },
    { tone: "sky", icon: Link2, value: "14", label: "Integrations" },
    { tone: "green", icon: Clock, value: "10:24", label: "Last check" },
  ],
  tabs: ["Overview", "API telemetry", "Retry queue", "Credentials", "History"],
  main: {
    kind: "register",
    title: "Integration & API Health · register",
    cols: ["Integration", "Direction", "Last sync", "Errors", "Queue", "Owner", "Status"],
    statusCol: 6,
    rows: [
      ["WhatsApp Business", "Both", "10:18", "2", "2", "Admin 03", "Delayed"],
      ["Official email", "Both", "10:24", "0", "0", "Admin 03", "Connected"],
      ["AI inbound calling", "Inbound", "10:23", "0", "0", "Admin 03", "Connected"],
      ["AI outbound calling", "Outbound", "10:23", "0", "0", "Admin 03", "Connected"],
      ["HRMS", "Inbound", "10:22", "0", "0", "Admin 02", "Connected"],
      ["Accounting", "Both", "10:10", "2", "2", "Admin 04", "Failed"],
    ],
    actions: [
      { label: "Review errors", notice: "Error list opened — payloads are redacted, owner and correlation ID shown (demo)." },
      { label: "Retry event", notice: "Retry queued with bounded back-off and an idempotency key — no duplicate requests or messages (demo).", confirm: "Retry the failed events for the selected integration?" },
    ],
  },
  tabViews: [
    {
      title: "API telemetry · per provider",
      cols: ["Provider", "Latency", "Uptime window", "Failure trend", "Last successful sync", "Status"],
      statusCol: 5,
      rows: [
        ["WhatsApp Business", "Telemetry required", "Telemetry required", "2 errors today", "10:18", "Delayed"],
        ["Official email", "Telemetry required", "Telemetry required", "No failures", "10:24", "Connected"],
        ["AI inbound calling", "Telemetry required", "Telemetry required", "No failures", "10:23", "Connected"],
        ["HRMS", "Telemetry required", "Telemetry required", "No failures", "10:22", "Connected"],
        ["Accounting", "Telemetry required", "Telemetry required", "2 errors today", "10:10", "Failed"],
      ],
    },
    {
      title: "Retry queue · bounded back-off",
      cols: ["Event ID", "Integration", "Attempt", "Next retry", "Idempotency key", "Status"],
      statusCol: 5,
      rows: [
        ["EVT-881", "WhatsApp Business", "2 of 5", "10:32", "Set", "Queued"],
        ["EVT-882", "WhatsApp Business", "1 of 5", "10:28", "Set", "Queued"],
        ["EVT-883", "Accounting", "3 of 5", "10:40", "Set", "Failed"],
        ["EVT-884", "Accounting", "2 of 5", "10:36", "Set", "Queued"],
      ],
    },
    {
      title: "Credentials & webhook validation",
      cols: ["Integration", "Credential", "Token expiry", "Storage", "Owner", "Status"],
      statusCol: 5,
      rows: [
        ["WhatsApp Business", "API token", "Review before expiry", "Encrypted vault", "Admin 03", "Review"],
        ["Official email", "SMTP credential", "Rotated 01 Nov", "Encrypted vault", "Admin 03", "Active"],
        ["HRMS", "Service token", "Rotated 05 Nov", "Encrypted vault", "Admin 02", "Active"],
        ["Accounting", "API key", "Rotation due", "Encrypted vault", "Admin 04", "Review"],
      ],
    },
    {
      title: "Integration history",
      cols: ["Time", "Integration", "Event", "Actor", "Outcome"],
      statusCol: 4,
      rows: [
        ["10:24", "Official email", "Health check", "System", "Success"],
        ["10:18", "WhatsApp Business", "Delivery delay detected", "System", "Review"],
        ["10:10", "Accounting", "Sync failed · routed to owner", "System", "Failed"],
        ["09:55", "HRMS", "Credential rotation check", "Admin 02", "Success"],
      ],
    },
  ],
  side: {
    title: "Selected integration · $0",
    rows: [
      ["Last healthy sync", "$2"],
      ["Credential expiry", "Review before expiry"],
      ["Webhook validation", "Required"],
      ["Retry policy", "Bounded / backoff"],
      ["Duplicate protection", "Idempotency"],
      ["Fallback", "Human inbox"],
      ["API latency", "Telemetry required"],
      ["Uptime window", "Telemetry required"],
    ],
  },
  lowerLeft: {
    title: "API telemetry & retry queue",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "Connected 12 · Delayed 1 · Failed 1"],
      ["Status", "Latency / uptime: telemetry required"],
      ["Next action", "Retry events: 4 · bounded replay"],
    ],
  },
  lowerRight: {
    title: "Integration safeguards",
    rows: [
      ["Failed accounting sync", "Review queue"],
      ["API credentials", "Encrypted vault"],
      ["Webhook signatures", "Verify"],
      ["Stale data", "Show timestamp"],
    ],
  },
};

export const sa073: Screen = {
  id: "SA-073",
  title: "Audit & Activity Logs",
  active: "audit-logs",
  href: `${B}/audit-logs`,
  kpis: [
    { tone: "blue", icon: Activity, value: "128", label: "Events today" },
    { tone: "green", icon: KeyRound, value: "04", label: "Permission changes" },
    { tone: "orange", icon: Download, value: "03", label: "Exports" },
    { tone: "purple", icon: ShieldAlert, value: "02", label: "Security events" },
    { tone: "sky", icon: ShieldCheck, value: "00", label: "Integrity alerts" },
    { tone: "green", icon: Clock, value: "24 hrs", label: "Current period" },
  ],
  tabs: ["Audit register", "Change comparison", "Integrity", "Exports", "History"],
  main: {
    kind: "register",
    title: "Audit & Activity Logs · register",
    cols: ["Event ID", "Actor", "Action", "Record", "Time", "Result", "Integrity"],
    statusCol: 6,
    filter: { all: "All outcomes", col: 5, always: true },
    rows: [
      ["AUD-101", "Admin 01", "Case update", "MS-26-1101", "10:24", "Success", "Verified"],
      ["AUD-102", "User 07", "Read record", "MS-26-1100", "10:21", "Success", "Verified"],
      ["AUD-103", "Super Admin", "Access review", "USR-007", "10:19", "Success", "Verified"],
      ["AUD-104", "Admin 04", "Export request", "EXP-003", "10:16", "Pending", "Verified"],
      ["AUD-105", "System", "Login blocked", "SESSION-02", "10:11", "Blocked", "Verified"],
      ["AUD-106", "Admin 02", "SOP publish", "SOP-002", "10:03", "Success", "Verified"],
    ],
    actions: [
      { label: "Filter events", notice: "Filters available: date, actor, module, outcome and correlation ID (demo)." },
      { label: "Request authorised export", notice: "Export request recorded with purpose; approval required before release (demo).", confirm: "Request an authorised export of the filtered audit events?" },
    ],
  },
  tabViews: [
    {
      title: "Audit event comparison · redacted",
      cols: ["Event ID", "Field", "Before", "After", "Actor", "Result"],
      statusCol: 5,
      rows: [
        ["AUD-101", "Case status", "Pending verification", "In review", "Admin 01", "Success"],
        ["AUD-103", "Access scope", "Restricted preview", "Restricted preview", "Super Admin", "Success"],
        ["AUD-106", "SOP version", "v1.2", "v1.3", "Admin 02", "Success"],
        ["AUD-105", "Session", "Active", "Revoked", "System", "Blocked"],
      ],
    },
    {
      title: "Integrity verification",
      cols: ["Segment", "Range", "Hash chain", "Checked", "Result", "Status"],
      statusCol: 5,
      rows: [
        ["SEG-0451", "00:00 – 04:00", "Intact", "Today 10:30", "Matched", "Verified"],
        ["SEG-0452", "04:00 – 08:00", "Intact", "Today 10:30", "Matched", "Verified"],
        ["SEG-0453", "08:00 – 12:00", "Intact", "Today 10:30", "Matched", "Verified"],
        ["SEG-0450", "Yesterday", "Intact", "Today 06:00", "Matched", "Verified"],
      ],
    },
    {
      title: "Export requests · approval required",
      cols: ["Export ID", "Requested by", "Purpose", "Approver", "Requested", "Status"],
      statusCol: 5,
      rows: [
        ["EXP-003", "Admin 04", "Monthly compliance review", "Super Admin", "10:16", "Pending approval"],
        ["EXP-002", "Admin 01", "Incident INC-002 review", "Super Admin", "09:40", "Approved"],
        ["EXP-001", "Admin 03", "Access recertification", "Super Admin", "Yesterday", "Approved"],
      ],
    },
    {
      title: "Audit access history",
      cols: ["Time", "Viewer", "Action", "Scope", "Result"],
      statusCol: 4,
      rows: [
        ["10:26", "Super Admin", "Opened audit register", "All modules", "Success"],
        ["10:19", "Super Admin", "Access review", "Users", "Success"],
        ["09:58", "Admin 02", "Filtered by actor", "Operations", "Success"],
        ["09:12", "User 03", "Attempted audit access", "—", "Blocked"],
      ],
    },
  ],
  side: {
    title: "Selected audit event",
    rows: [
      ["Event", "$0"],
      ["Actor scope", "Operations / Ghaziabad"],
      ["Change", "$2"],
      ["Before / after", "Restricted preview"],
      ["Correlation ID", "DEMO-$0"],
      ["Retention", "Policy governed"],
    ],
  },
  lowerLeft: {
    title: "Audit event comparison",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "AUD-101 · Case status change"],
      ["Status", "Before: Pending verification"],
      ["Next action", "After: In review · masked preview"],
    ],
  },
  lowerRight: {
    title: "Audit controls",
    rows: [
      ["Integrity check", "Verified · demo"],
      ["Export", "Approval required"],
      ["Sensitive fields", "Masked"],
      ["Edit / delete", "Not permitted"],
    ],
  },
};

export const sa074: Screen = {
  id: "SA-074",
  title: "Emergency System Lockdown",
  active: "system-security",
  href: `${B}/system-security/emergency-lockdown`,
  kpis: [
    { tone: "blue", icon: Radio, value: "Normal", label: "Current mode" },
    { tone: "green", icon: Siren, value: "02", label: "Active incidents" },
    { tone: "orange", icon: CircleCheck, value: "Ready", label: "Continuity plan" },
    { tone: "purple", icon: Hourglass, value: "Pending", label: "Approval" },
    { tone: "sky", icon: Network, value: "Scoped", label: "Restriction" },
    { tone: "green", icon: Lock, value: "00", label: "Active lockdowns" },
  ],
  tabs: ["Impact preview", "Restriction scope", "Approvals", "Continuity", "History"],
  main: {
    kind: "form",
    title: "Emergency System Lockdown · configuration",
    fields: [
      { label: "Incident reference", value: "INC-002", options: ["INC-001", "INC-002", "INC-003"] },
      { label: "Affected scope", value: "Affected integration", options: ["Affected integration", "Single module", "Selected sessions", "Selected centre"] },
      { label: "Proposed restriction", value: "Pause affected sync", options: ["Pause affected sync", "Revoke selected sessions", "Read-only mode for module", "Disable export"] },
      { label: "Reason", value: "Suspected compromise" },
      { label: "Duration", value: "60 min · proposed", options: ["30 min", "60 min · proposed", "120 min", "240 min"] },
      { label: "Approver", value: "Independent approver", options: ["Independent approver", "Super Admin (second)", "Security lead"] },
      { label: "Continuity route", value: "Manual intake", options: ["Manual intake", "Helpline only", "Read-only portal"] },
    ],
    actions: [
      { label: "Preview impact", notice: "Impact preview generated — helpline, active cases and emergency intake stay available (demo)." },
      { label: "Request lockdown", notice: "Lockdown request sent for independent approval; step-up MFA and rollback plan required (demo).", confirm: "Submit this scoped lockdown for independent approval? Step-up MFA will be required." },
    ],
  },
  tabViews: [
    {
      title: "Restriction scope · least disruptive first",
      cols: ["Scope", "Restriction", "Duration", "Preserved route", "Status"],
      statusCol: 4,
      rows: [
        ["Affected integration", "Pause affected sync", "60 min · proposed", "Manual intake", "Draft"],
        ["Selected sessions", "Revoke selected only", "Immediate", "Re-login with MFA", "Draft"],
        ["Export function", "Disable until review", "120 min", "Approval-based export", "Draft"],
        ["Whole system", "Not proposed", "—", "—", "Blocked"],
      ],
    },
    {
      title: "Lockdown approvals · maker-checker",
      cols: ["Approval ID", "Incident", "Maker", "Independent approver", "Step-up MFA", "Status"],
      statusCol: 5,
      rows: [
        ["LCK-011", "INC-002", "Super Admin", "Awaiting", "Required", "Pending"],
        ["LCK-010", "INC-001", "Super Admin", "Admin 02", "Completed", "Approved"],
        ["LCK-009", "Drill", "Admin 01", "Super Admin", "Completed", "Approved"],
      ],
    },
    {
      title: "Continuity routes",
      cols: ["Route", "Covers", "Owner", "Last tested", "Status"],
      statusCol: 4,
      rows: [
        ["Manual intake", "Urgent humanitarian requests", "Admin 01", "22 Nov", "Ready"],
        ["Helpline", "Families and volunteers", "Admin 03", "22 Nov", "Ready"],
        ["Active case access", "Authorised case owners only", "Admin 02", "22 Nov", "Ready"],
      ],
    },
    {
      title: "Lockdown history",
      cols: ["Lockdown ID", "Incident", "Scope", "Duration", "Reviewed", "Outcome"],
      statusCol: 5,
      rows: [
        ["LCK-010", "INC-001", "Selected sessions", "45 min", "Yes", "Completed"],
        ["LCK-009", "Drill", "Affected integration", "20 min", "Yes", "Completed"],
        ["LCK-008", "Drill", "Export function", "30 min", "Yes", "Completed"],
      ],
    },
  ],
  side: {
    title: "Impact assessment",
    rows: [
      ["Helpline", "Remain available"],
      ["Active cases", "Preserve authorised access"],
      ["Affected sessions", "Revoke selected only"],
      ["Donations", "Review affected gateway"],
      ["Review time", "Mandatory"],
      ["Rollback plan", "Required"],
    ],
  },
  lowerLeft: {
    title: "Impact preview & confirmation",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "Assess → Preview → Approve → Apply → Review"],
      ["Status", "Emergency intake: manual fallback"],
      ["Next action", "Step-up MFA + independent approval"],
    ],
  },
  lowerRight: {
    title: "Safety controls",
    rows: [
      ["Break-glass", "Audited"],
      ["Self approval", "Blocked"],
      ["Expiry", "Auto review / release policy"],
      ["Evidence", "Required"],
      ["Confirmation", "Step-up MFA required"],
    ],
  },
};

export const sa075: Screen = {
  id: "SA-075",
  title: "System Settings",
  active: "system-settings",
  href: `${B}/system-settings`,
  kpis: [
    { tone: "blue", icon: Building2, value: "01", label: "Organisation" },
    { tone: "green", icon: ShieldCheck, value: "Required", label: "MFA" },
    { tone: "orange", icon: IndianRupee, value: "INR", label: "Currency" },
    { tone: "purple", icon: Clock, value: "IST", label: "Time zone" },
    { tone: "sky", icon: Layers, value: "v1.0", label: "Version" },
    { tone: "green", icon: Settings, value: "02", label: "Draft changes" },
  ],
  tabs: ["General", "Security", "Communication", "Retention", "Change history"],
  main: {
    kind: "form",
    title: "System Settings · configuration",
    fields: [
      { label: "Time zone", value: "Asia/Kolkata", options: ["Asia/Kolkata"] },
      { label: "Language", value: "English / Hindi", options: ["English / Hindi", "English", "Hindi"] },
      { label: "Session timeout", value: "30 min · proposed", options: ["15 min", "30 min · proposed", "60 min"] },
      { label: "Notification defaults", value: "Critical alerts always on", options: ["Critical alerts always on"] },
      { label: "Retention policy", value: "Approved category policy", options: ["Approved category policy"] },
      { label: "Feature flags", value: "Versioned / controlled", options: ["Versioned / controlled"] },
    ],
    actions: [
      { label: "Preview change", notice: "Change diff and impact preview generated for the draft settings (demo)." },
      { label: "Submit configuration", notice: "Configuration submitted for independent approval; the current version stays live until approved (demo).", confirm: "Submit the draft configuration for approval?" },
    ],
  },
  tabViews: [
    {
      title: "Security settings · approval required",
      cols: ["Setting", "Current", "Proposed", "Approval", "Status"],
      statusCol: 4,
      rows: [
        ["Password + MFA", "Mandatory", "Mandatory", "Not changeable", "Enforced"],
        ["Session timeout", "30 min", "30 min", "Policy approval", "Draft"],
        ["Critical alerts", "Cannot disable", "Cannot disable", "Not changeable", "Enforced"],
        ["Audit trail", "Required", "Required", "Not changeable", "Enforced"],
      ],
    },
    {
      title: "Communication settings",
      cols: ["Channel", "Setting", "Owner", "Policy", "Status"],
      statusCol: 4,
      rows: [
        ["SMS", "Outgoing only", "Admin 03", "Approved templates", "Active"],
        ["Email", "Official sender", "Admin 03", "Approved templates", "Active"],
        ["WhatsApp", "Business account", "Admin 03", "Consent required", "Review"],
        ["Critical alerts", "Always on", "Super Admin", "Cannot disable", "Enforced"],
      ],
    },
    {
      title: "Retention policy · approval required",
      cols: ["Category", "Retention", "Basis", "Owner", "Status"],
      statusCol: 4,
      rows: [
        ["Audit logs", "Policy governed", "Compliance", "Super Admin", "Active"],
        ["Case records", "Approved policy", "Service need", "Admin 01", "Active"],
        ["Communication logs", "Proposed", "Operational", "Admin 03", "Draft"],
        ["Backups", "Approved policy", "Recovery", "Admin 02", "Active"],
      ],
    },
    {
      title: "Configuration change history",
      cols: ["Version", "Area", "Changed by", "Approved by", "Date", "Status"],
      statusCol: 5,
      rows: [
        ["v1.0", "Baseline", "Super Admin", "Independent approver", "01 Nov", "Active"],
        ["Draft 02", "Session timeout", "Super Admin", "—", "24 Nov", "Draft"],
        ["Draft 01", "Notification defaults", "Admin 03", "—", "22 Nov", "Draft"],
      ],
    },
  ],
  side: {
    title: "Organisation baseline",
    rows: [
      ["Organisation", "Namo Gange Trust"],
      ["Initiative", "Moksha Sewa"],
      ["FY", "2026–27"],
      ["Service model", "Completely free"],
      ["Cash donations", "Not accepted"],
      ["Coverage", "Ghaziabad active"],
    ],
  },
  lowerLeft: {
    title: "Configuration change history",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "Draft → Validate → Preview → Approve → Publish"],
      ["Status", "Current v1.0 · Draft changes 02"],
      ["Next action", "Rollback: approved version only"],
    ],
  },
  lowerRight: {
    title: "Security defaults",
    rows: [
      ["Password + MFA", "Mandatory"],
      ["Critical alerts", "Cannot disable"],
      ["Audit trail", "Required"],
      ["Rollback", "Approved version"],
    ],
  },
};

export const sa076: Screen = {
  id: "SA-076",
  title: "Technical Support & Issue Tracking",
  active: "system-settings",
  href: `${B}/system-settings/technical-support`,
  kpis: [
    { tone: "blue", icon: Ticket, value: "08", label: "Open tickets" },
    { tone: "green", icon: TriangleAlert, value: "02", label: "Critical" },
    { tone: "orange", icon: UsersRound, value: "06", label: "Assigned" },
    { tone: "purple", icon: Eye, value: "02", label: "Unassigned" },
    { tone: "sky", icon: CircleCheck, value: "14", label: "Resolved this month" },
    { tone: "green", icon: FileText, value: "01", label: "Overdue" },
  ],
  tabs: ["Tickets", "Ageing", "Severity", "Resolution", "History"],
  main: {
    kind: "register",
    title: "Technical Support & Issue Tracking · register",
    cols: ["Ticket ID", "Module", "Issue", "Reporter", "Owner", "Priority", "Status"],
    statusCol: 6,
    rows: [
      ["TKT-101", "WhatsApp", "Sync delay", "User 07", "Admin 03", "High", "In progress"],
      ["TKT-102", "Accounting", "Failed sync", "Admin 04", "Admin 04", "Critical", "Open"],
      ["TKT-103", "Staff App", "GPS stale", "User 08", "Admin 02", "Medium", "Assigned"],
      ["TKT-104", "Reports", "Export timeout", "Admin 01", "Admin 02", "Normal", "Assigned"],
      ["TKT-105", "Security", "Login anomaly", "System", "Admin 02", "Critical", "Open"],
      ["TKT-106", "Training", "Course access", "User 09", "—", "Normal", "Unassigned"],
    ],
    actions: [
      { label: "Create ticket", notice: "New ticket form opened — module, severity, owner and SLA are required; logs are redacted (demo)." },
      { label: "Escalate", notice: "Escalated to the responsible admin; security issues are linked to SA-066 (demo).", confirm: "Escalate the selected ticket to the responsible admin?" },
    ],
  },
  tabViews: [
    {
      title: "Ticket ageing buckets",
      cols: ["Bucket", "Open tickets", "Oldest", "Owner", "Status"],
      statusCol: 4,
      rows: [
        ["Under 1 day", "03", "TKT-105", "Admin 02", "On track"],
        ["1 – 3 days", "03", "TKT-103", "Admin 02", "On track"],
        ["3 – 7 days", "01", "TKT-101", "Admin 03", "Watch"],
        ["Over 7 days", "01", "TKT-099", "Admin 04", "Overdue"],
      ],
    },
    {
      title: "Severity & SLA",
      cols: ["Severity", "Open", "SLA target", "Owner", "Status"],
      statusCol: 4,
      rows: [
        ["Critical", "02", "Immediate review", "Admin 04", "Open"],
        ["High", "01", "4 hrs", "Admin 03", "In progress"],
        ["Medium", "01", "1 day", "Admin 02", "Assigned"],
        ["Normal", "04", "3 days", "Admin 02", "Assigned"],
      ],
    },
    {
      title: "Resolution validation",
      cols: ["Ticket", "Root cause", "Workaround", "Verified by", "Vendor access", "Status"],
      statusCol: 5,
      rows: [
        ["TKT-098", "Token expired", "Manual relink", "Admin 03", "None", "Resolved"],
        ["TKT-097", "Queue backlog", "Replay queue", "Admin 02", "None", "Resolved"],
        ["TKT-096", "Vendor API change", "Pause sync", "Admin 04", "Temporary · expires", "Review"],
        ["TKT-095", "Permission mismatch", "Role corrected", "Admin 02", "None", "Resolved"],
      ],
    },
    {
      title: "Ticket history",
      cols: ["Time", "Ticket", "Event", "Actor", "Status"],
      statusCol: 4,
      rows: [
        ["10:12", "TKT-102", "Escalated to owner", "System", "Open"],
        ["10:05", "TKT-105", "Linked to security incident", "Admin 02", "Open"],
        ["09:40", "TKT-101", "Status updated", "Admin 03", "In progress"],
        ["09:10", "TKT-106", "Created", "User 09", "Unassigned"],
      ],
    },
  ],
  side: {
    title: "Selected ticket · $0",
    rows: [
      ["Priority", "$5"],
      ["Assigned owner", "$4"],
      ["SLA remaining", "Review immediately"],
      ["Linked integration", "$1"],
      ["Workaround", "Manual reconciliation"],
      ["Evidence", "Restricted logs"],
    ],
  },
  lowerLeft: {
    title: "Ticket ageing & severity",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "Critical 2 · Other open 6"],
      ["Status", "Assigned 6 · Unassigned 2"],
      ["Next action", "Overdue 1 · resolution trend requires telemetry"],
    ],
    bars: [
      { label: "Assigned", value: 6, max: 8 },
      { label: "Critical", value: 2, max: 8 },
    ],
  },
  lowerRight: {
    title: "Support exceptions",
    rows: [
      ["Unassigned", "02"],
      ["Overdue", "01"],
      ["Critical", "02"],
      ["Escalation", "Responsible admin"],
    ],
  },
};
