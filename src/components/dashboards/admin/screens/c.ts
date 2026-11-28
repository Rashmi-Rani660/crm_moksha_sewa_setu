import { FA, SCOPE2, bottom, btns, chips, days, follow, gps, info, k, kv, op, panel, prog, tbl, top } from "../dsl";
import type { Screen } from "../types";

const week = days(["24"], ["25"], ["26"], ["27", true], ["28", true], ["29"], ["30", true]);

/** AD-021 … AD-030 — templates, task progress, SLA, workflows, staff, volunteers, fleet, network, inventory, readiness. */
export const screensC: Screen[] = [
  {
    code: "AD-021",
    title: "Task Templates & Checklists",
    snapshot: true,
    selected: 1,
    kpis: [k("08", "Templates"), k("06", "Published"), k("02", "Drafts"), k("03", "Review due"), k("01", "Retired"), k("02", "Pending changes")],
    tabs: ["Templates", "Checklist Builder", "Versions", "Approvals"],
    rows: [
      top(
        310,
        panel(
          "Task Templates & Checklists · register",
          FA,
          tbl(
            ["Template", "Purpose", "Version", "Owner", "Status"],
            [
              ["TPL-01", "Request verification", "v2", "Admin 01", "b:Active"],
              ["TPL-02", "Legal clearance", "v3", "Admin 01", "b:Active"],
              ["TPL-03", "Vehicle readiness", "v1", "Admin 02", "b:Active"],
              ["TPL-04", "Case closure", "v2", "Admin 01", "a:Draft"],
              ["TPL-05", "Volunteer briefing", "v1", "Admin 02", "a:Review"],
            ],
          ),
          btns("Create draft", "Preview checklist", "Submit for review"),
          op("Provide ordered checklist builder, required-step lock, app preview and version comparison; require Super Admin publication approval."),
        ),
        follow(
          "Selected template",
          kv(["Scope", "Assigned operations"], ["Required checks", "Authority, release, evidence"], ["Version", "v3 approved"], ["Change rights", "Draft only"], ["Publish", "Super Admin approval"]),
          SCOPE2,
        ),
      ),
      bottom(
        188,
        panel(
          "Checklist builder",
          kv(["01 Verify authority", "a:Locked"], ["02 Check legal documents", "a:Locked"], ["03 Record decision", "b:Required"], ["04 Escalate exceptions", "b:Required"]),
          btns("Preview app", "Add draft step"),
        ),
        panel("Version comparison", kv(["Approved version", "g:v3"], ["Proposed version", "a:v4 draft"], ["Changes", "a:Review required"]), chips("Draft", "Review", "Approve"), btns("Compare versions")),
        panel("Publication controls", kv(["Mandatory checks", "r:Cannot bypass"], ["Existing tasks", "g:Pinned version"], ["Global publication", "b:Super Admin"]), btns("Request approval")),
      ),
    ],
  },
  {
    code: "AD-022",
    title: "Task Progress & Acknowledgement",
    snapshot: true,
    selected: 1,
    kpis: [k("24", "Pending tasks"), k("05", "Overdue", "red"), k("02", "Awaiting acceptance"), k("08", "In progress"), k("12", "Due today"), k("03", "Evidence review")],
    tabs: ["Progress", "Acknowledgements", "Evidence", "History"],
    rows: [
      top(
        310,
        panel(
          "Task Progress & Acknowledgement · register",
          FA,
          tbl(
            ["Task", "Case", "Assignee", "Due", "Status"],
            [
              ["TASK-026", "MS-26-1101", "USR-007", "11:30", "b:In progress"],
              ["TASK-027", "MS-26-1100", "USR-008", "10:00", "r:Overdue"],
              ["TASK-031", "MS-26-1102", "VOL-004", "12:00", "a:Pending"],
              ["TASK-032", "MS-26-1103", "USR-009", "12:30", "a:Review"],
              ["TASK-033", "MS-26-1104", "USR-010", "13:00", "a:Pending"],
            ],
          ),
          btns("Review task", "Send reminder", "Reassign", "Escalate"),
          op("Show acceptance deadline, rejection reason, progress evidence and reassignment history."),
        ),
        follow("Selected task", kv(["Owner", "USR-008"], ["Acceptance", "Recorded"], ["Due", "10:00 IST"], ["Evidence", "Awaiting upload"], ["Next action", "Contact owner / escalate"]), SCOPE2),
      ),
      bottom(
        188,
        panel(
          "Task lifecycle",
          chips("Assign", "Accept", "Progress", "Evidence", "Verify"),
          prog("In progress", 33, "08 tasks"),
          prog("Awaiting acceptance", 8, "02 tasks", "amber"),
          btns("Review evidence"),
        ),
        panel("Acceptance queue", kv(["TASK-031 · VOL-004", "a:08 min left"], ["Pending acceptance", "a:02"], ["Rejection reason", "b:Required"]), btns("Send reminder")),
        panel("Exceptions & evidence", kv(["Overdue tasks", "r:05"], ["Evidence review", "a:03"], ["App sync", "b:Check retries"]), btns("Reassign", "Escalate")),
      ),
    ],
  },
  {
    code: "AD-023",
    title: "SLA & Escalation Monitoring",
    snapshot: true,
    selected: 1,
    kpis: [k("05", "Overdue tasks", "red"), k("02", "Emergency cases", "red"), k("03", "At risk"), k("02", "Awaiting acknowledgement"), k("91%", "SLA compliance"), k("03", "Escalations open")],
    tabs: ["SLA Overview", "At Risk", "Breached", "Escalations"],
    rows: [
      top(
        310,
        panel(
          "SLA & Escalation Monitoring · register",
          FA,
          tbl(
            ["Record", "Stage", "Owner", "Time remaining", "Status"],
            [
              ["MS-26-1101", "Emergency response", "Admin 01", "02 min", "a:At risk"],
              ["TASK-027", "Evidence", "USR-008", "Breached", "r:Overdue"],
              ["REQ-26-1104", "Initial response", "Admin 01", "Due now", "r:Emergency"],
              ["TASK-031", "Acceptance", "VOL-004", "08 min", "a:Pending"],
              ["TASK-032", "Verification", "USR-009", "25 min", "b:On track"],
            ],
          ),
          btns("Acknowledge", "Escalate now", "Review history"),
          op("Show remaining time and severity, acknowledgement owner, pause reason and trend with explicit denominators."),
        ),
        follow("Selected escalation", kv(["Policy", "Approved task SLA"], ["Owner", "USR-008"], ["Escalate to", "Admin 01"], ["Next level", "Super Admin"], ["Pause reason", "None"]), SCOPE2),
      ),
      bottom(
        188,
        panel("Escalation ladder", chips("User", "Admin", "Super Admin"), kv(["Emergency", "r:Immediate"], ["Routine escalation", "b:Approved SLA"]), btns("Escalate now")),
        panel(
          "SLA risk snapshot",
          prog("MS-26-1101", 90, "02 min left", "amber"),
          prog("TASK-031", 60, "08 min left"),
          prog("TASK-027", 100, "Breached", "red"),
          btns("Review timers"),
        ),
        panel("Response tracking", kv(["Acknowledgement", "b:Timestamp"], ["Pause reason", "a:Approval required"], ["Emergency gate", "r:Never delayed"]), btns("View history")),
      ),
    ],
  },
  {
    code: "AD-024",
    title: "Workflow Execution & Exceptions",
    snapshot: true,
    selected: 2,
    kpis: [k("12", "Auto assignments today"), k("01", "Failed automation", "red"), k("02", "Human interventions"), k("03", "Awaiting approval"), k("08", "Successful runs"), k("01", "Retry queued")],
    tabs: ["Active Runs", "Workflow", "Failures", "Retry Queue"],
    rows: [
      top(
        310,
        panel(
          "Workflow Execution & Exceptions · register",
          FA,
          tbl(
            ["Run ID", "Workflow", "Mode", "Owner", "Status"],
            [
              ["RUN-101", "Request routing", "Automatic", "Admin 01", "b:Active"],
              ["RUN-102", "Document check", "Approval", "Admin 01", "a:Pending"],
              ["RUN-103", "Task reminder", "Automatic", "Admin 02", "r:Failed"],
              ["RUN-104", "Field allocation", "Manual", "Admin 01", "a:Review"],
              ["RUN-105", "Closure review", "Approval", "Admin 02", "b:Completed"],
            ],
          ),
          btns("Review run", "Retry safely", "Manual fallback", "Escalate"),
          op("Visualise failure node, retry status, approved mode and manual fallback; prevent duplicate side effects."),
        ),
        follow("Selected run", kv(["Failure", "App acknowledgement timeout"], ["Retry", "Queued"], ["Idempotency", "Required"], ["Fallback", "Manual task"], ["Policy", "Approved workflow only"]), SCOPE2),
      ),
      bottom(
        188,
        panel("Execution workflow", chips("Trigger", "Check", "Route", "Approve", "Execute"), kv(["RUN-103 failure", "r:App timeout"], ["Retry path", "a:Controlled"]), btns("Inspect run")),
        panel(
          "Exception monitoring",
          prog("Auto assignments", 100, "12"),
          prog("Human intervention", 17, "02", "amber"),
          prog("Failed automation", 8, "01", "red"),
          btns("Review retry queue"),
        ),
        panel("Admin controls", kv(["Global rules", "b:Read-only"], ["Manual fallback", "g:Scoped"], ["Sensitive action", "a:Human review"]), btns("Request rule change")),
      ),
    ],
  },
  {
    code: "AD-025",
    title: "Staff & Volunteer Live Monitoring",
    snapshot: true,
    kpis: [k("08/10", "Staff on duty"), k("12/18", "Volunteers available"), k("06", "Field assignments"), k("02", "Unacknowledged"), k("05", "Overdue tasks", "red"), k("01", "GPS stale", "red")],
    tabs: ["Live Roster", "GPS Map", "Assignments", "Safety"],
    rows: [
      top(
        310,
        panel(
          "Staff & Volunteer Live Monitoring · register",
          FA,
          tbl(
            ["Member", "Type", "Assigned work", "Last update", "Status"],
            [
              ["EMP-001", "Staff", "MS-26-1101", "10:24", "b:On field"],
              ["EMP-002", "Staff", "Vehicle coordination", "10:23", "b:En route"],
              ["VOL-004", "Volunteer", "Family assistance", "10:20", "b:Assigned"],
              ["VOL-007", "Volunteer", "Standby", "10:19", "b:Available"],
              ["EMP-003", "Staff", "Document verification", "10:18", "b:On duty"],
              ["VOL-009", "Volunteer", "Awaiting acceptance", "10:12", "a:Pending"],
            ],
          ),
          btns("Assign task", "Contact member", "Review SOS"),
          op("Show separate duty and volunteer availability, last GPS update, accuracy and offline state, SOS and acknowledgement."),
        ),
        panel(
          "On-duty resource monitoring",
          kv(["City", "Ghaziabad only"], ["Location consent", "Required"], ["GPS freshness", "01 stale device"], ["Accuracy", "Telemetry required"], ["SOS", "Route to duty admin"]),
          SCOPE2,
        ),
      ),
      bottom(
        188,
        panel("Assignment & safety", chips("Assign", "Accept", "Check-in", "Evidence", "Verify"), kv(["SOS", "r:Immediate response"], ["Pending acceptance", "a:02"]), btns("Open SOS queue")),
        panel(
          "Team availability",
          prog("Staff on duty", 80, "8 / 10"),
          prog("Volunteers available", 67, "12 / 18", "green"),
          kv(["Field assignments", "b:06"]),
          btns("View roster"),
        ),
        panel("GPS & exceptions", gps("Ghaziabad · schematic only"), kv(["Stale devices", "a:01 · not live"], ["Location accuracy", "b:Telemetry required"]), btns("View tracking")),
      ),
    ],
  },
  {
    code: "AD-026",
    title: "Volunteer Coordination",
    snapshot: true,
    selected: 2,
    kpis: [k("18", "Registered volunteers"), k("12", "Available"), k("06", "Unavailable"), k("02", "Verification pending"), k("03", "Training due"), k("04", "Assigned today")],
    tabs: ["Volunteers", "Availability", "Training", "Contribution"],
    rows: [
      top(
        310,
        panel(
          "Volunteer Coordination · register",
          FA,
          tbl(
            ["Volunteer ID", "Skill", "Area", "Training", "Status"],
            [
              ["VOL-001", "Cremation coordination", "Ghaziabad", "Completed", "b:Available"],
              ["VOL-004", "Family assistance", "Ghaziabad", "Completed", "b:Assigned"],
              ["VOL-007", "Last-rites coordination", "Ghaziabad", "Due soon", "b:Available"],
              ["VOL-009", "Documentation", "Ghaziabad", "Pending", "a:Review"],
              ["VOL-012", "Material support", "Ghaziabad", "Completed", "b:Available"],
              ["VOL-018", "Logistics support", "Ghaziabad", "Pending", "a:Review"],
            ],
          ),
          btns("Review volunteer", "Assign task", "View availability"),
          op("Provide availability calendar, skills, training expiry, contribution hours and recognition nomination."),
        ),
        follow(
          "Selected volunteer",
          kv(["App access", "Volunteer App only"], ["Verification", "Verified"], ["Consent", "Recorded"], ["Training", "Due soon"], ["Availability", "Available"], ["Service hours", "24"]),
          SCOPE2,
        ),
      ),
      bottom(
        188,
        panel("Availability calendar", week, info("24–30 Nov schedule"), kv(["VOL-007", "a:Training due"]), btns("View availability")),
        panel(
          "Contribution & skills",
          prog("Available volunteers", 67, "12 / 18", "green"),
          kv(["VOL-007 service hours", "b:24"], ["Skills", "b:Last-rites coordination"]),
          btns("Nominate recognition"),
        ),
        panel("Eligibility gates", kv(["Verification pending", "a:02"], ["Training due", "a:03"], ["Assignment", "b:Required training"]), btns("Review training")),
      ),
    ],
  },
  {
    code: "AD-027",
    title: "Fleet & Vehicle Allocation",
    snapshot: true,
    selected: 1,
    kpis: [k("02", "Fleet registered"), k("01", "Available"), k("01", "Deployed"), k("00", "Maintenance"), k("02", "Drivers on duty"), k("01", "Service due", "red")],
    tabs: ["Fleet", "Dispatch", "Drivers", "GPS", "Trip History"],
    rows: [
      top(
        310,
        panel(
          "Fleet & Vehicle Allocation · register",
          FA,
          tbl(
            ["Vehicle ID", "Vehicle", "Driver", "Case", "Status"],
            [
              ["MV-01", "Force Traveller Type-B", "Driver 01", "MS-26-1101", "b:In service"],
              ["MV-02", "Maruti EECO mortuary/freezer", "Driver 02", "—", "b:Available"],
            ],
          ),
          btns("Allocate vehicle", "Review documents", "Create trip"),
          op("Show availability separately from readiness, driver checks, dispatch queue, trip costs and GPS freshness."),
        ),
        follow(
          "Selected vehicle",
          kv(
            ["Driver availability", "Confirm"],
            ["GPS freshness", "10:22"],
            ["Legal clearance", "Case-specific gate"],
            ["Insurance / fitness", "Verify validity"],
            ["Cleaning checklist", "Required"],
            ["Dispatch", "Pending approval"],
          ),
          SCOPE2,
        ),
      ),
      bottom(
        188,
        panel("Dispatch queue", kv(["TR-001 · Body transport", "b:Assigned"], ["TR-002 · Cremation support", "a:Pending"], ["MV-02 readiness", "a:Review required"]), btns("Review trip", "Allocate")),
        panel("Fleet & GPS", gps("Ghaziabad · schematic only"), kv(["Available", "g:01 / 02"], ["Ready for dispatch", "a:Verify gate"]), btns("View GPS")),
        panel("Trip lifecycle", chips("Approve", "Allocate", "Dispatch", "Arrive", "Close"), kv(["Driver / licence", "a:Verify"], ["Fuel & mileage", "b:Trip ledger"]), btns("Record handover")),
      ),
    ],
  },
  {
    code: "AD-028",
    title: "Service Network Coordination",
    snapshot: true,
    kpis: [k("08", "Network partners"), k("05", "Verified"), k("03", "Review pending"), k("01", "Active city"), k("02", "Upcoming cities"), k("01", "Expired document")],
    tabs: ["Partners", "Availability", "Agreements", "Coordination"],
    rows: [
      top(
        310,
        panel(
          "Service Network Coordination · register",
          FA,
          tbl(
            ["Partner ID", "Facility", "City", "Verification", "Status"],
            [
              ["NET-001", "Cremation ground", "Ghaziabad", "Verified", "b:Active"],
              ["NET-002", "Hospital liaison", "Ghaziabad", "Verified", "b:Active"],
              ["NET-003", "Police liaison", "Ghaziabad", "Verified", "b:Active"],
              ["NET-004", "Mortuary facility", "Ghaziabad", "Review", "a:Pending"],
              ["NET-005", "Material supplier", "Ghaziabad", "Verified", "b:Active"],
              ["NET-006", "Cremation ground", "Delhi", "Review", "a:Coming soon"],
            ],
          ),
          btns("Contact liaison", "View agreement", "Request review"),
          op("Show partner availability, agreement expiry, quality review and case-linked service history."),
        ),
        follow(
          "Selected partner",
          kv(["Service scope", "Free cremation support"], ["Agreement", "Verified"], ["Contact", "Restricted"], ["Capacity", "Confirm before dispatch"], ["Renewal", "Review expiry"]),
          SCOPE2,
        ),
      ),
      bottom(
        188,
        panel("Coordination checklist", chips("Confirm", "Contact", "Link case", "Handover"), kv(["Partner hours", "a:Confirm availability"], ["Agreement", "a:Check expiry"]), btns("Confirm availability")),
        panel("Coverage & agreements", kv(["Ghaziabad", "g:Active"], ["Delhi / Noida", "a:Coming soon"], ["Renewal", "a:Review expiry"]), btns("Review agreement")),
        panel("Service quality", kv(["Partner history", "b:Case-linked"], ["Complaints", "a:Review evidence"], ["Expired documents", "r:Hold"]), btns("View service history")),
      ),
    ],
  },
  {
    code: "AD-029",
    title: "Inventory & Material Requests",
    snapshot: true,
    selected: 2,
    kpis: [k("12", "Item types"), k("06", "Shown item lines"), k("02", "Low stock", "red"), k("03", "Pending issues"), k("02", "Purchase requests"), k("01", "Active store")],
    tabs: ["Stock", "Reservations", "Issues", "Purchase Requests"],
    rows: [
      top(
        310,
        panel(
          "Inventory & Material Requests · register",
          FA,
          tbl(
            ["Item", "Material", "Unit", "Available", "Reorder", "Status"],
            [
              ["INV-001", "Cremation support kit", "Kit", "24", "10", "b:Available"],
              ["INV-002", "Protective gloves", "Pair", "40", "20", "b:Available"],
              ["INV-003", "Body cover", "Piece", "6", "10", "r:Low stock"],
              ["INV-004", "Sanitisation supplies", "Unit", "8", "10", "r:Low stock"],
              ["INV-005", "Cotton cloth", "Piece", "30", "15", "b:Available"],
              ["INV-006", "Documentation kit", "Kit", "40", "10", "b:Available"],
            ],
          ),
          btns("Request material", "Reserve stock", "Request purchase"),
          op("Chart stock against reorder thresholds by item and unit; provide reserve, issue, return, damage and purchasing history."),
        ),
        follow(
          "Selected material",
          kv(["Store", "Ghaziabad"], ["Available", "6 pieces"], ["Reorder", "10 pieces"], ["Reservation", "Check case requirement"], ["Purchase", "Approval required"]),
          SCOPE2,
        ),
      ),
      bottom(
        188,
        panel("Material movement", chips("Request", "Approve", "Reserve", "Issue", "Reconcile"), kv(["Pending issues", "a:03"], ["Purchase requests", "a:02"]), btns("Reserve", "Issue / return")),
        panel(
          "Stock by item",
          prog("Body cover", 60, "6 / 10 pieces", "red"),
          prog("Sanitisation", 80, "8 / 10 units", "red"),
          prog("Cremation kits", 100, "24 / 10 kits", "green"),
          btns("Review stock"),
        ),
        panel("Procurement & audit", kv(["Low stock items", "r:02"], ["Damaged / returns", "b:Record ledger"], ["Stock adjustment", "a:Approval required"]), btns("Request purchase", "Stock audit")),
      ),
    ],
  },
  {
    code: "AD-030",
    title: "Resource Readiness & Maintenance",
    snapshot: true,
    kpis: [k("01", "Vehicle available"), k("01", "Vehicle deployed"), k("01", "Service due", "red"), k("02", "Low stock items", "red"), k("03", "Pending issues"), k("01", "Readiness review")],
    tabs: ["Readiness", "Maintenance", "Calendar", "Safety Review"],
    rows: [
      top(
        310,
        panel(
          "Resource Readiness & Maintenance · register",
          FA,
          tbl(
            ["Resource", "Readiness check", "Owner", "Due", "Status"],
            [
              ["MV-01", "Post-trip inspection", "Driver 01", "After trip", "b:In progress"],
              ["MV-02", "Cleaning checklist", "Driver 02", "Before dispatch", "a:Review"],
              ["MV-02", "Service schedule", "Admin 01", "Due soon", "a:Pending"],
              ["INV-003", "Reorder body cover", "Store user", "Today", "r:Low stock"],
              ["INV-004", "Reorder sanitisation", "Store user", "Today", "r:Low stock"],
            ],
          ),
          btns("Report issue", "Review readiness", "Request maintenance"),
          op("Provide maintenance calendar, repair estimate, supporting bills, safety checklist and authorised release."),
        ),
        panel(
          "Readiness gate · MV-02",
          kv(["Vehicle documents", "Verify validity"], ["Equipment", "Checklist required"], ["Driver", "Confirm duty"], ["Case clearance", "Mandatory"], ["Release", "Authorised only"]),
          SCOPE2,
        ),
      ),
      bottom(
        188,
        panel("Maintenance calendar", week, info("24–30 Nov schedule"), kv(["MV-02 service", "a:Due soon"]), btns("Schedule service")),
        panel("Safety readiness", kv(["Documents / driver", "a:Verify"], ["Equipment / cleaning", "a:Review"], ["Case legal clearance", "r:Mandatory"]), btns("Review checklist")),
        panel("Repair & release", chips("Inspect", "Approve", "Repair", "Verify", "Release"), kv(["Repair costs / bills", "b:Attach evidence"], ["Final release", "a:Authorised only"]), btns("Submit request")),
      ),
    ],
  },
];
