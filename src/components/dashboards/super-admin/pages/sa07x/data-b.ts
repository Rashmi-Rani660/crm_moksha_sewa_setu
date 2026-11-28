/** SA-077 … SA-082 — demo content (illustrative only; no production data). */

import {
  Building2,
  CalendarClock,
  CircleAlert,
  CircleCheck,
  Clock,
  Download,
  FileText,
  HandHeart,
  IndianRupee,
  Layers,
  Link2,
  ListChecks,
  Megaphone,
  Network,
  Pause,
  Percent,
  Radio,
  Send,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
  Table2,
  Eye,
  Timer,
  Target,
  ChartColumn,
} from "lucide-react";
import type { Screen } from "./types";

const B = "/dashboard/super-admin/reports-analytics";

export const sa077: Screen = {
  id: "SA-077",
  title: "Central Reports & MIS",
  active: "reports-analytics",
  href: B,
  kpis: [
    { tone: "blue", icon: ChartColumn, value: "24", label: "Available reports" },
    { tone: "green", icon: CalendarClock, value: "08", label: "Scheduled" },
    { tone: "orange", icon: CircleAlert, value: "03", label: "Pending review" },
    { tone: "purple", icon: Download, value: "04", label: "Exports today" },
    { tone: "sky", icon: TriangleAlert, value: "01", label: "Failed run" },
    { tone: "green", icon: Clock, value: "FY 26–27", label: "Period" },
  ],
  tabs: ["Report catalogue", "Favourites", "Saved filters", "Preview", "Exports"],
  main: {
    kind: "register",
    title: "Central Reports & MIS · register",
    cols: ["Report ID", "Report title", "Scope", "Period", "Owner", "Last run", "Status"],
    statusCol: 6,
    rows: [
      ["RPT-01", "Daily operations", "Ghaziabad", "Daily", "Admin 01", "10:00", "Ready"],
      ["RPT-02", "Sewa impact", "Ghaziabad", "Monthly", "Admin 01", "09:00", "Ready"],
      ["RPT-03", "Donation ledger", "Central", "FY", "Admin 04", "09:15", "Review"],
      ["RPT-04", "AI usage cost", "Central", "Monthly", "Admin 03", "09:20", "Ready"],
      ["RPT-05", "Training progress", "Central", "Monthly", "Admin 02", "09:30", "Ready"],
      ["RPT-06", "Integration health", "Central", "Daily", "Admin 03", "10:10", "Failed"],
    ],
    actions: [
      { label: "Open report", notice: "Report opened with role-scoped filters, reporting period and data freshness shown (demo)." },
      { label: "Schedule report", notice: "Schedule draft created — recipients and permissions are rechecked at every run (demo)." },
    ],
  },
  tabViews: [
    {
      title: "Favourite reports",
      cols: ["Report ID", "Report title", "Pinned by", "Scope", "Last run", "Status"],
      statusCol: 5,
      rows: [
        ["RPT-01", "Daily operations", "Super Admin", "Ghaziabad", "10:00", "Ready"],
        ["RPT-02", "Sewa impact", "Super Admin", "Ghaziabad", "09:00", "Ready"],
        ["RPT-06", "Integration health", "Admin 03", "Central", "10:10", "Failed"],
      ],
    },
    {
      title: "Saved filters",
      cols: ["Filter ID", "Name", "Report", "Scope", "Period", "Owner"],
      rows: [
        ["FLT-11", "Ghaziabad · today", "Daily operations", "Ghaziabad", "Today", "Admin 01"],
        ["FLT-12", "Ghaziabad · this month", "Sewa impact", "Ghaziabad", "This month", "Admin 01"],
        ["FLT-13", "Central · FY to date", "Donation ledger", "Central", "FY 2026–27", "Admin 04"],
        ["FLT-14", "Central · last 7 days", "Integration health", "Central", "7 days", "Admin 03"],
      ],
    },
    {
      title: "Scoped preview · metric definitions",
      cols: ["Metric", "Definition", "Value", "Source", "Freshness"],
      rows: [
        ["Request count", "Verified sewa requests received", "312 · demo", "Request ledger", "10:00 AM"],
        ["Case count", "Cases opened from verified requests", "296 · demo", "Case ledger", "10:00 AM"],
        ["Service events", "Visits, pickups, ceremonies logged", "824 · demo", "Service log", "10:00 AM"],
        ["Completed cremations", "Verified free cremations completed", "276 · demo", "Case ledger", "10:00 AM"],
      ],
    },
    {
      title: "Export requests · masked",
      cols: ["Export ID", "Report", "Requested by", "Masking", "Approval", "Status"],
      statusCol: 5,
      rows: [
        ["EXP-011", "Daily operations", "Admin 01", "Masked", "Not required", "Completed"],
        ["EXP-012", "Sewa impact", "Admin 01", "Masked", "Not required", "Completed"],
        ["EXP-013", "Donation ledger", "Admin 04", "Masked", "Required", "Pending"],
        ["EXP-014", "AI usage cost", "Admin 03", "Masked", "Not required", "Completed"],
      ],
    },
  ],
  side: {
    title: "Report details · $0",
    rows: [
      ["Data source", "Case / request ledger"],
      ["Reporting window", "Today · IST"],
      ["Data freshness", "$5 AM"],
      ["Access scope", "Authorised only"],
      ["Export fields", "Masked by default"],
      ["Schedule", "Daily · proposed"],
    ],
  },
  lowerLeft: {
    title: "Report catalogue & favourites",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "Operations · Finance · AI · Security · Training"],
      ["Status", "Preview: daily Sewa operations"],
      ["Next action", "Saved filters · favourite reports · freshness"],
    ],
  },
  lowerRight: {
    title: "Report exceptions",
    rows: [
      ["Pending review", "03"],
      ["Failed runs", "01"],
      ["Export audit", "Mandatory"],
      ["External reporting", "Anonymised only"],
    ],
  },
};

export const sa078: Screen = {
  id: "SA-078",
  title: "Sewa & Social Impact Analytics",
  active: "reports-analytics",
  href: `${B}/sewa-impact`,
  kpis: [
    { tone: "blue", icon: HandHeart, value: "276", label: "Free cremations" },
    { tone: "green", icon: UsersRound, value: "156", label: "EWS families" },
    { tone: "orange", icon: CircleAlert, value: "52", label: "Unclaimed bodies" },
    { tone: "purple", icon: UsersRound, value: "68", label: "Unsupported persons" },
    { tone: "sky", icon: Clock, value: "120", label: "Volunteer hours" },
    { tone: "green", icon: IndianRupee, value: "₹12.40L", label: "FY expenditure" },
  ],
  tabs: ["Impact overview", "Beneficiaries", "Service trends", "Costs", "Reports"],
  main: {
    kind: "register",
    title: "Sewa & Social Impact Analytics · register",
    cols: ["Category", "Completed cases", "Share", "Service area", "Status"],
    statusCol: 4,
    rows: [
      ["EWS families", "156", "56.5%", "Ghaziabad", "Verified"],
      ["Unclaimed bodies", "52", "18.8%", "Ghaziabad", "Verified"],
      ["Unsupported persons", "68", "24.6%", "Ghaziabad", "Verified"],
    ],
    actions: [
      { label: "Review impact", notice: "Impact review opened — counts use verified completed cremations and primary categories only (demo)." },
      { label: "Export anonymised report", notice: "Anonymised report queued; public release needs approval (demo).", confirm: "Export the anonymised impact report? Public release still needs approval." },
    ],
  },
  tabViews: [
    {
      title: "Beneficiary categories · mutually exclusive",
      cols: ["Category", "Definition", "Deduplication", "Count", "Status"],
      statusCol: 4,
      rows: [
        ["EWS families", "Primary category: economically weaker family", "Primary category only", "156", "Verified"],
        ["Unclaimed bodies", "Primary category: no claimant", "Primary category only", "52", "Verified"],
        ["Unsupported persons", "Primary category: no family support", "Primary category only", "68", "Verified"],
      ],
    },
    {
      title: "Service trends · completed cremations vs service events",
      cols: ["Month", "Completed cremations", "Service events", "Change", "Status"],
      statusCol: 4,
      rows: [
        ["Nov 2026", "276", "824", "↑ 55%", "Verified"],
        ["Oct 2026", "178", "540", "↑ 22%", "Verified"],
        ["Sep 2026", "146", "448", "↑ 24%", "Verified"],
        ["Aug 2026", "118", "362", "↑ 23%", "Verified"],
      ],
    },
    {
      title: "Costs · matched periods only",
      cols: ["Period", "Expense", "Cases (same period)", "Cost per case", "Status"],
      statusCol: 4,
      rows: [
        ["Nov 2026", "₹1.20L · demo", "276", "₹435 · demo", "Verified"],
        ["Oct 2026", "₹0.78L · demo", "178", "₹438 · demo", "Verified"],
        ["Sep 2026", "₹0.64L · demo", "146", "₹438 · demo", "Verified"],
        ["FY 2026–27", "₹12.40L", "FY cases required", "Not computed", "Review"],
      ],
    },
    {
      title: "Impact reports · anonymised",
      cols: ["Report", "Audience", "Anonymised", "Approver", "Status"],
      statusCol: 4,
      rows: [
        ["Monthly impact summary", "Management", "Yes", "Super Admin", "Approved"],
        ["Quarterly trustee report", "Trustees", "Yes", "Super Admin", "Review"],
        ["Public impact page", "Public", "Yes", "Trust approval", "Pending"],
      ],
    },
  ],
  side: {
    title: "Impact indicators",
    rows: [
      ["Active centres", "01"],
      ["Delhi / Noida", "Coming soon"],
      ["Volunteer hours", "120 · demo"],
      ["Complaints resolved", "14 · demo"],
      ["Expense scope", "FY 2026–27"],
      ["Case counts", "This month · demo"],
    ],
    barsCaption: "Primary category distribution · demo",
    bars: [
      { label: "EWS families", value: 156, max: 276 },
      { label: "Unclaimed bodies", value: 52, max: 276 },
      { label: "Unsupported persons", value: 68, max: 276 },
    ],
  },
  lowerLeft: {
    title: "Completed free cremations · monthly demo trend",
    chart: {
      points: [["Jun", 78], ["Jul", 96], ["Aug", 118], ["Sep", 146], ["Oct", 178], ["Nov", 276]],
      note: "Illustrative monthly completed cremations; not actual service totals.",
    },
  },
  lowerRight: {
    title: "Public reporting controls",
    rows: [
      ["Beneficiary identities", "Anonymised"],
      ["Category overlap", "Primary category only"],
      ["Financial scope", "Matched periods only"],
      ["Publication", "Review required"],
    ],
  },
};

export const sa079: Screen = {
  id: "SA-079",
  title: "Department & Centre Performance",
  active: "reports-analytics",
  href: `${B}/department-performance`,
  kpis: [
    { tone: "blue", icon: Layers, value: "07", label: "Departments" },
    { tone: "green", icon: Building2, value: "01", label: "Active centre" },
    { tone: "orange", icon: CircleAlert, value: "05", label: "Overdue tasks" },
    { tone: "purple", icon: Eye, value: "03", label: "Reviews due" },
    { tone: "sky", icon: ShieldCheck, value: "96%", label: "SLA · demo" },
    { tone: "green", icon: CircleCheck, value: "82%", label: "Task completion" },
  ],
  tabs: ["Overview", "Departments", "Centres", "Workload", "Review"],
  main: {
    kind: "register",
    title: "Department & Centre Performance · register",
    cols: ["Department / centre", "Admin", "Assigned tasks", "Completed", "Overdue", "Quality", "Status"],
    statusCol: 6,
    rows: [
      ["Operations & Sewa", "Admin 01", "20", "16", "2", "Review", "Active"],
      ["Communication", "Admin 03", "15", "12", "1", "Review", "Active"],
      ["Finance & Donations", "Admin 04", "10", "9", "1", "Review", "Active"],
      ["Volunteer coordination", "Admin 02", "10", "8", "1", "Review", "Active"],
      ["IT & CRM", "Admin 02", "8", "7", "0", "Review", "Active"],
      ["Ghaziabad centre", "Admin 01", "—", "—", "—", "Scope view", "Active"],
    ],
    actions: [
      { label: "Review performance", notice: "Review opened — denominators, time window and evidence shown; no automated ranking of staff (demo)." },
      { label: "Open details", notice: "Department detail opened with task complexity and workload context (demo)." },
    ],
  },
  tabViews: [
    {
      title: "Department targets & denominators",
      cols: ["Department", "Target", "Denominator", "Window", "Result", "Status"],
      statusCol: 5,
      rows: [
        ["Operations & Sewa", "90% on time", "Eligible requests", "This month", "80%", "Review"],
        ["Communication", "90% on time", "Eligible replies", "This month", "80%", "Review"],
        ["Finance & Donations", "95% on time", "Eligible entries", "This month", "90%", "Review"],
        ["IT & CRM", "90% on time", "Eligible tickets", "This month", "88%", "Review"],
      ],
    },
    {
      title: "Centre view · Ghaziabad only",
      cols: ["Centre", "Stage", "Requests", "SLA", "Notes", "Status"],
      statusCol: 5,
      rows: [
        ["Ghaziabad", "Active", "312 · demo", "96% · demo", "Overlaps department view", "Active"],
        ["Delhi", "Coming soon", "—", "—", "Excluded from active KPIs", "Pending"],
        ["Noida", "Coming soon", "—", "—", "Excluded from active KPIs", "Pending"],
      ],
    },
    {
      title: "Department workload",
      cols: ["Department", "Open tasks", "Complexity", "Capacity", "Overdue", "Status"],
      statusCol: 5,
      rows: [
        ["Operations & Sewa", "4", "High", "Balanced", "2", "Review"],
        ["Communication", "3", "Medium", "Balanced", "1", "Review"],
        ["Finance & Donations", "1", "Medium", "Available", "1", "Review"],
        ["Volunteer coordination", "2", "Medium", "Stretched", "1", "Review"],
      ],
    },
    {
      title: "Evidence-based review · follow-up",
      cols: ["Review ID", "Department", "Evidence", "Follow-up", "Reviewer", "Status"],
      statusCol: 5,
      rows: [
        ["REV-21", "Operations & Sewa", "Task log · case notes", "Coaching session", "Super Admin", "Due"],
        ["REV-22", "Communication", "Reply samples", "Template update", "Super Admin", "Due"],
        ["REV-23", "Volunteer coordination", "Roster record", "Capacity plan", "Super Admin", "Due"],
      ],
    },
  ],
  side: {
    title: "Performance review",
    rows: [
      ["Period", "This month · demo"],
      ["Centre scope", "Ghaziabad"],
      ["Upcoming cities", "Excluded from active KPIs"],
      ["Review due", "03"],
      ["Quality evidence", "Required"],
      ["Coaching", "Authorised review"],
    ],
  },
  lowerLeft: {
    title: "Performance comparison · this month",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "SLA compliance 96% · task completion 82%"],
      ["Status", "Overdue tasks 5 · Reviews due 3"],
      ["Next action", "Ghaziabad only · other cities excluded"],
    ],
    bars: [
      { label: "SLA compliance", value: 96, max: 100 },
      { label: "Task completion", value: 82, max: 100 },
    ],
  },
  lowerRight: {
    title: "Metric safeguards",
    rows: [
      ["Department totals", "Avoid double count"],
      ["SLA denominator", "Eligible records"],
      ["Quality", "Evidence-based"],
      ["AI scoring", "Human review"],
    ],
  },
};

export const sa080: Screen = {
  id: "SA-080",
  title: "Campaign & Communication Analytics",
  active: "reports-analytics",
  href: `${B}/campaign-analytics`,
  kpis: [
    { tone: "blue", icon: Megaphone, value: "02", label: "Google leads" },
    { tone: "green", icon: Network, value: "02", label: "Social leads" },
    { tone: "orange", icon: Link2, value: "06", label: "Website / app contacts" },
    { tone: "purple", icon: Target, value: "04", label: "Valid campaign leads" },
    { tone: "sky", icon: IndianRupee, value: "₹200", label: "Cost per lead" },
    { tone: "green", icon: Percent, value: "85%", label: "Response SLA" },
  ],
  tabs: ["Overview", "Campaigns", "Channels", "Conversion", "Cost"],
  main: {
    kind: "register",
    title: "Campaign & Communication Analytics · register",
    cols: ["Source", "Contacts today", "Valid leads", "Spend today", "Cost / lead", "Status"],
    statusCol: 5,
    rows: [
      ["Google Ads", "2", "2", "₹400", "₹200", "Review"],
      ["Meta / social", "2", "2", "₹400", "₹200", "Review"],
      ["Website", "2", "—", "—", "—", "Connected"],
      ["Staff App", "2", "—", "—", "—", "Connected"],
      ["Volunteer App", "2", "—", "—", "—", "Connected"],
      ["WhatsApp", "16", "—", "—", "—", "Delayed"],
    ],
    actions: [
      { label: "Review campaign", notice: "Campaign review opened — attribution is deduplicated and spend is reconciled with providers (demo)." },
      { label: "Open source report", notice: "Source report opened for the selected channel (demo)." },
    ],
  },
  tabViews: [
    {
      title: "Campaigns",
      cols: ["Campaign ID", "Name", "Channel", "Spend", "Valid leads", "Status"],
      statusCol: 5,
      rows: [
        ["CMP-31", "Free last-rites awareness", "Google Ads", "₹400", "2", "Review"],
        ["CMP-32", "Volunteer drive", "Meta / social", "₹400", "2", "Review"],
        ["CMP-33", "Helpline reminder", "Website", "—", "—", "Active"],
        ["CMP-34", "Awareness broadcast", "SMS", "Outgoing only", "—", "Scheduled"],
      ],
    },
    {
      title: "Channels · contact events vs leads vs verified requests",
      cols: ["Channel", "Contact events", "Leads", "Verified sewa requests", "Dedup rule", "Status"],
      statusCol: 5,
      rows: [
        ["Google", "2", "2", "Verification required", "First / last touch", "Review"],
        ["Meta", "2", "2", "Verification required", "First / last touch", "Review"],
        ["Website + chatbot", "2", "—", "—", "Match by contact", "Connected"],
        ["Apps", "4", "—", "—", "Match by contact", "Connected"],
        ["WhatsApp", "16", "—", "—", "Match by contact", "Delayed"],
      ],
    },
    {
      title: "Conversion funnel · demo",
      cols: ["Stage", "Count", "Definition", "Owner", "Status"],
      statusCol: 4,
      rows: [
        ["Contact events", "28", "Any inbound touch", "Admin 03", "Active"],
        ["Leads", "04", "Valid, de-duplicated contacts", "Admin 03", "Review"],
        ["Verified sewa requests", "—", "Needs verified records", "Admin 01", "Pending"],
      ],
    },
    {
      title: "Channel cost · reconciliation",
      cols: ["Provider", "App spend", "Provider-reported", "Variance", "Status"],
      statusCol: 4,
      rows: [
        ["Google Ads", "₹400", "₹400", "₹0", "Verified"],
        ["Meta", "₹400", "₹400", "₹0", "Verified"],
        ["SMS gateway", "Outgoing only", "Pending", "—", "Review"],
      ],
    },
  ],
  side: {
    title: "Attribution & response",
    rows: [
      ["Campaign spend", "₹800 · demo"],
      ["Valid paid leads", "4 · demo"],
      ["Cost per valid lead", "₹200"],
      ["Pending replies", "18"],
      ["Channel response SLA", "85% · demo"],
      ["Consent", "Check before outreach"],
    ],
  },
  lowerLeft: {
    title: "Campaign conversion & cost",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "Google leads 2 · Social leads 2"],
      ["Status", "Spend ₹800 · Valid paid leads 4"],
      ["Next action", "Cost / valid lead ₹200 · conversion requires verified records"],
    ],
    bars: [
      { label: "Google valid leads", value: 2, max: 4 },
      { label: "Social valid leads", value: 2, max: 4 },
    ],
  },
  lowerRight: {
    title: "Communication quality",
    rows: [
      ["Source attribution", "First / last touch policy"],
      ["Paid vs organic", "Separate"],
      ["SMS", "Outgoing only"],
      ["Sensitive audiences", "No targeting by grief"],
    ],
  },
};

export const sa081: Screen = {
  id: "SA-081",
  title: "Custom Report Builder",
  active: "reports-analytics",
  href: `${B}/report-builder`,
  kpis: [
    { tone: "blue", icon: FileText, value: "Draft", label: "Report state" },
    { tone: "green", icon: Table2, value: "Cases", label: "Data source" },
    { tone: "orange", icon: ListChecks, value: "06", label: "Selected fields" },
    { tone: "purple", icon: ShieldCheck, value: "Scoped", label: "Access" },
    { tone: "sky", icon: Download, value: "CSV", label: "Output format" },
    { tone: "green", icon: Pause, value: "Off", label: "Schedule" },
  ],
  tabs: ["Data source", "Fields", "Filters", "Preview", "Saved reports"],
  main: {
    kind: "form",
    title: "Custom Report Builder · configuration",
    fields: [
      { label: "Report name", value: "Monthly sewa summary" },
      { label: "Data source", value: "Verified cases", options: ["Verified cases", "Verified requests", "Service events", "Campaign leads"] },
      { label: "Allowed fields", value: "Category / date / status", options: ["Category / date / status", "Category / centre / month", "Department / task / status"] },
      { label: "Filters", value: "Ghaziabad · month", options: ["Ghaziabad · month", "Ghaziabad · today", "Ghaziabad · FY to date"] },
      { label: "Grouping", value: "Primary category", options: ["Primary category", "Month", "Centre", "Department"] },
      { label: "Output format", value: "CSV / PDF", options: ["CSV / PDF", "CSV", "PDF"] },
      { label: "Access scope", value: "Authorised management", options: ["Authorised management", "Centre admins", "Super Admin only"] },
    ],
    actions: [
      { label: "Preview report", notice: "Preview built from the approved dataset with row and field permissions applied server-side (demo)." },
      { label: "Save definition", notice: "Report definition saved as a new version — query limits and masking are validated (demo)." },
    ],
  },
  tabViews: [
    {
      title: "Allowed fields · masking",
      cols: ["Field", "Type", "Masking", "Permission", "Selected"],
      statusCol: 4,
      rows: [
        ["Primary category", "Category", "None", "Management", "Active"],
        ["Completion date", "Date", "None", "Management", "Active"],
        ["Case ID", "Identifier", "Masked", "Management", "Active"],
        ["Status", "Category", "None", "Management", "Active"],
        ["Beneficiary name", "Personal data", "Excluded", "Not allowed", "Blocked"],
      ],
    },
    {
      title: "Filters · query validation",
      cols: ["Filter", "Operator", "Value", "Scope", "Validation"],
      statusCol: 4,
      rows: [
        ["Centre", "equals", "Ghaziabad", "Server-side", "Verified"],
        ["Period", "within", "This month", "Server-side", "Verified"],
        ["Status", "equals", "Completed", "Server-side", "Verified"],
        ["Row limit", "max", "10,000", "Query limit", "Enforced"],
      ],
    },
    {
      title: "Report preview · illustrative case data",
      cols: ["Primary category", "Completed cases", "Share", "Masking", "Status"],
      statusCol: 4,
      rows: [
        ["EWS families", "156", "56.5%", "Case ID masked", "Verified"],
        ["Unclaimed bodies", "52", "18.8%", "Case ID masked", "Verified"],
        ["Unsupported persons", "68", "24.6%", "Case ID masked", "Verified"],
      ],
    },
    {
      title: "Saved report definitions",
      cols: ["Report ID", "Name", "Version", "Owner", "Schedule", "Status"],
      statusCol: 5,
      rows: [
        ["CRB-01", "Monthly sewa summary", "v1", "Admin 01", "Off", "Draft"],
        ["CRB-02", "Campaign conversion", "v3", "Admin 03", "Weekly", "Approved"],
        ["CRB-03", "Department workload", "v2", "Admin 02", "Off", "Approved"],
      ],
    },
  ],
  side: {
    title: "Preview settings",
    rows: [
      ["Reporting period", "This month · demo"],
      ["Fields", "Case ID masked"],
      ["Aggregation", "Count completed cases"],
      ["Sensitive data", "Excluded"],
      ["Estimated rows", "Preview required"],
      ["Approval", "Before restricted export"],
    ],
  },
  lowerLeft: {
    title: "Report preview · illustrative case data",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "Dataset: Sewa Cases · Month: Nov 2026"],
      ["Status", "Group: primary beneficiary category"],
      ["Next action", "EWS 156 · Unclaimed 52 · Unsupported 68"],
    ],
    bars: [
      { label: "EWS families", value: 156, max: 236 },
      { label: "Unclaimed bodies", value: 52, max: 236 },
      { label: "Unsupported persons", value: 68, max: 236 },
    ],
  },
  lowerRight: {
    title: "Report governance",
    rows: [
      ["Query limits", "Enforced"],
      ["Field permissions", "Server-side"],
      ["Schedule", "Separate approval"],
      ["Version history", "Required"],
    ],
  },
};

export const sa082: Screen = {
  id: "SA-082",
  title: "Scheduled Reports & Management MIS",
  active: "reports-analytics",
  href: `${B}/scheduled-reports`,
  kpis: [
    { tone: "blue", icon: CalendarClock, value: "08", label: "Scheduled" },
    { tone: "green", icon: Send, value: "06", label: "Sent today" },
    { tone: "orange", icon: TriangleAlert, value: "01", label: "Failed" },
    { tone: "purple", icon: Pause, value: "01", label: "Paused" },
    { tone: "sky", icon: Timer, value: "01", label: "Next due" },
    { tone: "green", icon: Radio, value: "09:00", label: "Last delivery" },
  ],
  tabs: ["Schedules", "Calendar", "Recipients", "Delivery history", "Failures"],
  main: {
    kind: "register",
    title: "Scheduled Reports & Management MIS · register",
    cols: ["Schedule ID", "Report", "Recipients", "Frequency", "Next run", "Last delivery", "Status"],
    statusCol: 6,
    rows: [
      ["SCH-01", "Daily operations", "Management group", "Daily", "Tomorrow 09:00", "Today 09:00", "Active"],
      ["SCH-02", "Sewa impact", "Management group", "Monthly", "01 Dec", "01 Nov", "Active"],
      ["SCH-03", "Donation ledger", "Finance group", "Weekly", "30 Nov", "23 Nov", "Active"],
      ["SCH-04", "AI cost", "Authorised admins", "Daily", "Tomorrow 09:30", "Today 09:30", "Active"],
      ["SCH-05", "Integration health", "IT group", "Daily", "Tomorrow 10:00", "Failed", "Review"],
      ["SCH-06", "Training progress", "Training group", "Weekly", "—", "23 Nov", "Paused"],
    ],
    actions: [
      { label: "Create schedule", notice: "Schedule form opened — timezone, frequency, approved recipients and delivery method are required (demo)." },
      { label: "Pause schedule", notice: "Schedule paused and the change recorded in the audit trail (demo).", confirm: "Pause the selected schedule? Pause and resume are audited.", setStatus: "Paused" },
    ],
  },
  tabViews: [
    {
      title: "Delivery calendar · upcoming",
      cols: ["Date", "Time", "Report", "Recipients", "Delivery", "Status"],
      statusCol: 5,
      rows: [
        ["27 Nov", "09:00", "Daily operations", "Management group", "Secure link", "Scheduled"],
        ["27 Nov", "09:30", "AI cost", "Authorised admins", "Secure link", "Scheduled"],
        ["30 Nov", "09:00", "Donation ledger", "Finance group", "Secure link", "Scheduled"],
        ["01 Dec", "09:00", "Sewa impact", "Management group", "Secure link", "Scheduled"],
      ],
    },
    {
      title: "Recipients · permission recheck",
      cols: ["Group", "Members", "Report access", "Last checked", "Revoked excluded", "Status"],
      statusCol: 5,
      rows: [
        ["Management group", "5", "Authorised", "Today 09:00", "Yes", "Verified"],
        ["Finance group", "3", "Authorised", "23 Nov", "Yes", "Verified"],
        ["IT group", "4", "Authorised", "Today 10:00", "Yes", "Review"],
        ["Training group", "6", "Authorised", "23 Nov", "Yes", "Paused"],
      ],
    },
    {
      title: "Delivery history",
      cols: ["Run ID", "Report", "Delivered", "Link expiry", "Method", "Status"],
      statusCol: 5,
      rows: [
        ["RUN-501", "Daily operations", "Today 09:00", "Expires in 48 hrs", "Secure link", "Sent"],
        ["RUN-502", "AI cost", "Today 09:30", "Expires in 48 hrs", "Secure link", "Sent"],
        ["RUN-498", "Donation ledger", "23 Nov", "Expired", "Secure link", "Sent"],
        ["RUN-499", "Integration health", "Today 10:00", "—", "Secure link", "Failed"],
      ],
    },
    {
      title: "Failed runs",
      cols: ["Run ID", "Report", "Reason", "Retries", "Owner", "Status"],
      statusCol: 5,
      rows: [
        ["RUN-499", "Integration health", "Source report failed", "2 of 3", "Admin 03", "Failed"],
      ],
    },
  ],
  side: {
    title: "Selected schedule · $0",
    rows: [
      ["Time zone", "Asia/Kolkata"],
      ["Recipients", "Approved group"],
      ["Delivery", "Secure link"],
      ["Access recheck", "At execution"],
      ["Failure route", "Responsible admin"],
      ["Next run", "$4"],
    ],
  },
  lowerLeft: {
    title: "Delivery calendar & history",
    caption: "DEMO / proposed monitoring",
    rows: [
      ["Overview", "27 Nov 09:00 · Daily operations"],
      ["Status", "30 Nov · Donation ledger"],
      ["Next action", "01 Dec · Sewa impact report"],
    ],
  },
  lowerRight: {
    title: "Delivery safeguards",
    rows: [
      ["Failed delivery", "01"],
      ["Retry", "Bounded & logged"],
      ["Revoked recipients", "Exclude"],
      ["Sensitive attachment", "Secure link only"],
      ["Delivery history", "06 sent · 01 failed (demo)"],
    ],
  },
};

