import {
  FA,
  bottom,
  btns,
  btns2,
  chips,
  days,
  doc,
  flow,
  follow,
  form,
  gps,
  info,
  k,
  kanban,
  kv,
  kvb,
  op,
  panel,
  prog,
  tbl,
  top,
} from "../dsl";
import type { Screen, ScreenView } from "../types";

const SCOPE_GZB = info("Assigned scope only · Ghaziabad");
const SCOPE_DEMO = info("Assigned scope only");
const detailBtns = btns2("View details", "Review history");
const week = days(["24"], ["25"], ["26"], ["27", true], ["28", true], ["29"], ["30", true]);

/* ---------------------- AD-011 Case Management & Assignment --------------------- */

const ad011AllCases: ScreenView = {
  scope: "· Case list · Assigned scope only",
  selected: 0,
  kpis: [
    k("12", "Active cases · scope", "blue"),
    k("34", "Completed · cohort", "green"),
    k("02", "Emergency subset", "red"),
    k("03", "Field teams", "purple"),
    k("02", "Legal checks due", "orange"),
    k("46", "Case cohort total", "green"),
  ],
  rows: [
    top(
      330,
      panel(
        "Case list",
        { t: "filter", search: true, placeholder: "Search case ID, category, owner..." },
        tbl(
          ["Case ID", "Category", "Service", "Owner", "Stage", "Priority"],
          [
            ["MS-26-1101", "EWS family", "Cremation support", "USR-007", "b:In service", "r:Emergency"],
            ["MS-26-1100", "Unclaimed body", "Body transport", "USR-008", "Legal hold", "High"],
            ["MS-26-1099", "Unsupported person", "Cremation support", "USR-009", "b:Assigned", "Normal"],
            ["MS-26-1098", "EWS family", "Cremation support", "USR-010", "b:In service", "High"],
            ["MS-26-1097", "Unclaimed body", "Cremation support", "USR-007", "g:Completed", "Normal"],
          ],
          4,
        ),
        btns("Open case", "Assign team", "Review closure", "Escalate"),
      ),
      follow(
        "Case summary",
        kv(["Centre", "Ghaziabad"], ["Service", "Free cremation"], ["Stage", "b:In service"], ["Vehicle", "MV-01"], ["Team", "Field team 01"], ["Legal gate", "Cleared"]),
        SCOPE_GZB,
        btns2("Open case", "Assign team", "Update status", "Escalate"),
      ),
    ),
    bottom(
      168,
      panel("Case stage · current cohort", kvb(["Active cases", "12"], ["Completed cases", "34"], ["Emergency", "2 · active subset"]), prog("", 74)),
      panel("Beneficiary category · 46 cases", kvb(["Unclaimed", "3 active / 8 closed"], ["EWS families", "6 active / 18 closed"], ["Unsupported", "3 active / 8 closed"])),
      panel("Ageing & SLA", kvb(["Legal hold · MS-26-1100", "Review"], ["Overdue case", "Review timer"], ["Closure evidence", "Mandatory"]), btns("Review delayed cases")),
    ),
  ],
};

const ad011Assign: ScreenView = {
  scope: "· Assign & coordinate · Assigned scope only",
  selected: 0,
  kpis: [
    k("12", "Active cases", "blue"),
    k("03", "Active field teams", "green"),
    k("01/02", "Vehicles available", "orange"),
    k("08/10", "Staff on duty", "purple"),
    k("12/18", "Volunteers available", "sky"),
    k("02", "Acknowledgements due", "orange"),
  ],
  rows: [
    top(
      330,
      panel(
        "Assignment queue",
        { t: "filter", search: true, placeholder: "Search case ID, category, owner..." },
        tbl(
          ["Case", "Service", "Team", "Vehicle", "Clearance", "State"],
          [
            ["MS-26-1101", "Cremation support", "Team 01", "MV-01", "g:Cleared", "b:In service"],
            ["MS-26-1100", "Body transport", "Team 02", "—", "a:Pending", "r:Blocked"],
            ["MS-26-1099", "Cremation support", "Team 03", "—", "g:Cleared", "b:Assigned"],
            ["MS-26-1098", "Cremation support", "—", "—", "a:Review", "a:Pending"],
          ],
        ),
        btns("Preview allocation", "Assign team", "Review dispatch", "Escalate"),
      ),
      panel(
        "Resource selection",
        kv(["Case", "MS-26-1099"], ["Mode", "Manual"], ["Suggested team", "Team 03"], ["Vehicle", "MV-02 · available"], ["Conflict check", "Required"], ["Acceptance", "App acknowledgement"]),
        SCOPE_GZB,
        btns2("Preview allocation", "Assign team", "Review dispatch", "Escalate"),
      ),
    ),
    bottom(
      168,
      panel("Vehicle & legal readiness", kvb(["MV-02", "Available"], ["Driver / documents", "Verify before dispatch"], ["Case MS-26-1100", "r:Blocked"])),
      panel("AI recommendation", kvb(["Team 03", "Available · skill match"], ["Mode", "Manual / Auto / Approval"], ["Conflict check", "Required"]), btns("Review recommendation")),
      panel("Field handover", chips("Accept", "Check-in", "Deliver", "Verify"), kvb(["Acknowledgement", "App timer"], ["GPS / SOS", "Authorised on-duty only"])),
    ),
  ],
};

/* ----------------- AD-012 Case Details, Completion & Follow-up ---------------- */

const ad012Overview: ScreenView = {
  scope: "· Case details · Assigned scope only",
  selected: 0,
  kpis: [
    k("In service", "Current stage", "blue"),
    k("Cleared", "Legal gate", "green"),
    k("01", "Vehicle assigned", "orange"),
    k("03", "Team members", "purple"),
    k("High", "Priority", "sky"),
    k("Free", "Beneficiary charge", "green"),
  ],
  rows: [
    top(
      330,
      panel(
        "Overview",
        { t: "filter", search: true, placeholder: "Search case or evidence..." },
        tbl(
          ["Activity", "Time", "Owner", "Status"],
          [
            ["Request verified", "10:00", "USR-008", "g:Completed"],
            ["Legal clearance recorded", "10:12", "Admin", "g:Completed"],
            ["Team accepted", "10:18", "USR-007", "g:Completed"],
            ["Vehicle dispatched", "10:24", "Driver 01", "b:In service"],
            ["Completion evidence", "—", "Field team", "a:Pending"],
          ],
        ),
        btns("View documents", "Open communication", "Reassign", "Review closure"),
      ),
      panel(
        "Case profile · MS-26-1101",
        kv(["Category", "EWS family"], ["Contact", "98XXXXXX01"], ["Centre", "Ghaziabad"], ["Vehicle", "MV-01"], ["Owner", "USR-007"], ["Expense", "Case-linked ledger"]),
        SCOPE_GZB,
        detailBtns,
      ),
    ),
    bottom(
      168,
      panel("Assigned resources", kvb(["Field team", "Team 01"], ["Vehicle / driver", "MV-01 / Driver 01"], ["GPS update", "10:24"], ["Consent", "On-duty only"])),
      panel("Communication & expenses", kvb(["Official messages", "Open linked thread"], ["Estimated / actual", "Case ledger"], ["Approved expenses", "Review evidence"]), btns("Open ledger", "View history")),
      panel("Completion & case timeline", chips("Verified", "Assigned", "Dispatched", "Evidence"), kvb(["Evidence", "Pending"], ["Family feedback", "Optional"])),
    ),
  ],
};

const ad012Completion: ScreenView = {
  scope: "· Closure & follow-up · Assigned scope only",
  selected: 1,
  kpis: [
    k("34", "Completed · cohort", "blue"),
    k("12", "Active · cohort", "green"),
    k("02", "Closure review", "orange"),
    k("02", "Open complaints", "purple"),
    k("01", "Follow-up due", "orange"),
    k("Free", "Service model", "green"),
  ],
  rows: [
    top(
      330,
      panel(
        "Closure queue",
        { t: "filter", search: true, placeholder: "Search case or evidence..." },
        tbl(
          ["Case", "Evidence", "Expense review", "Feedback", "Decision"],
          [
            ["MS-26-1097", "Received", "Reviewed", "Optional", "g:Closed"],
            ["MS-26-1096", "Received", "a:Pending", "Not requested", "a:Review"],
            ["MS-26-1095", "r:Missing", "Reviewed", "Not requested", "r:Blocked"],
            ["MS-26-1094", "Received", "Reviewed", "Due", "Follow-up"],
          ],
          4,
        ),
        btns("Review evidence", "Request clarification", "Approve closure", "Reopen request"),
      ),
      follow(
        "Selected closure",
        kv(["Delivery evidence", "Received"], ["Handover", "Recorded"], ["Expense review", "a:Pending"], ["Closure approval", "a:Pending"], ["Feedback", "Optional"], ["Reopen", "Reason required"]),
        SCOPE_GZB,
        detailBtns,
      ),
    ),
    bottom(
      168,
      panel("Completion checklist", kvb(["Delivery evidence", "Received"], ["Handover", "Recorded"], ["Expense review", "a:Pending"], ["Closure approval", "Pending"])),
      panel("Evidence preview", doc("Service completion record", ["MS-26-1096 · masked reference", "Received · review required"]), btns("View evidence")),
      panel("Follow-up & reopening", kvb(["Feedback", "Optional"], ["Reopen reason", "Required"], ["Original history", "Preserved"]), btns("Request reopening")),
    ),
  ],
};

/* ------------------ AD-013 Task Management & Allocation --------------------- */

const ad013TaskList: ScreenView = {
  scope: "· Task list · Assigned scope only",
  selected: 1,
  kpis: [
    k("24", "Pending tasks", "orange"),
    k("05", "Overdue subset", "red"),
    k("02", "Acknowledgement due", "orange"),
    k("18", "Assigned users", "purple"),
    k("03", "Field teams", "sky"),
    k("04", "Unassigned requests", "orange"),
  ],
  rows: [
    top(
      330,
      panel(
        "Task list",
        { t: "filter", search: true, placeholder: "Search task ID, title, assignee..." },
        tbl(
          ["Task ID", "Linked record", "Task", "Owner", "Due", "Status"],
          [
            ["TASK-026", "MS-26-1101", "Confirm field readiness", "USR-007", "10:30", "b:In progress"],
            ["TASK-027", "MS-26-1100", "Verify legal documents", "USR-008", "11:00", "r:Overdue"],
            ["TASK-030", "REQ-26-1102", "Call family", "—", "15:00", "a:Unassigned"],
            ["TASK-031", "REQ-26-1103", "Eligibility check", "—", "15:30", "a:Unassigned"],
            ["TASK-032", "MS-26-1099", "Confirm team acceptance", "USR-009", "14:00", "a:Pending"],
          ],
        ),
        btns("Create task", "Reassign", "Set reminder", "Escalate"),
      ),
      follow(
        "Selected task",
        kv(["Owner", "USR-008"], ["Reporting admin", "Operations Admin"], ["Priority", "High"], ["Due", "27 Nov 11:00"], ["SLA", "Breached"], ["Next action", "Review and escalate"]),
        SCOPE_GZB,
        detailBtns,
      ),
    ),
    bottom(
      168,
      panel(
        "Kanban · task preview",
        kanban(
          { title: "To do", cards: [["TASK-030", "Call family"]] },
          { title: "In progress", cards: [["TASK-026", "Field readiness"]] },
          { title: "Review", cards: [["TASK-027", "Overdue"]] },
        ),
      ),
      panel("Workload & ageing", kvb(["Pending tasks", "24"], ["Overdue subset", "5"], ["Acknowledgement due", "2"]), prog("", 21, undefined, "amber")),
      panel("Calendar · 27 Nov", kvb(["11:00", "Legal verification · overdue"], ["14:00", "Team acceptance"], ["15:00", "Family callback"]), btns("Calendar view")),
    ),
  ],
};

const ad013CreateAssign: ScreenView = {
  scope: "· Create & assign · Assigned scope only",
  selected: 0,
  kpis: [
    k("24", "Pending tasks", "orange"),
    k("05", "Overdue tasks", "red"),
    k("02", "Acceptance due", "orange"),
    k("03", "Assignment modes", "purple"),
    k("18", "Assigned users", "sky"),
    k("Draft", "New task", "green"),
  ],
  rows: [
    top(
      330,
      panel(
        "Task details",
        form(
          { label: "Task title", value: "Verify supporting documents" },
          { label: "Linked record", value: "REQ-26-1102" },
          { label: "Priority", value: "High" },
          { label: "Due time", value: "27 Nov · 15:00" },
          { label: "Assignee", value: "USR-009" },
          { label: "Mode", value: "Approval-based", kind: "select", options: ["Automatic", "Manual"] },
          { label: "Notes / instructions", value: "", kind: "textarea" },
        ),
        btns("Save draft", "Preview assignment", "Submit for approval"),
      ),
      panel(
        "Assignment configuration",
        kv(["Department", "Sewa Operations"], ["Centre", "Ghaziabad"], ["Reporting admin", "Operations Admin"], ["Recurrence", "One-time"], ["Reminder", "Before due"], ["Evidence", "Required as applicable"]),
        SCOPE_GZB,
        detailBtns,
      ),
    ),
    bottom(
      168,
      panel("Assignee preview", kvb(["USR-009", "Assigned scope"], ["Skill / training", "Verify"], ["Availability", "Check shift"], ["Workload", "Review capacity"])),
      panel("Conflict & safety checks", kvb(["Overlapping task", "Check required"], ["Mandatory permissions", "Validate"], ["Legal / finance gates", "No bypass"])),
      panel("App acknowledgement", chips("Assign", "Accept", "Progress", "Evidence"), kvb(["Rejection", "Reason required"], ["Missed acceptance", "Escalate"])),
    ),
  ],
};

const ad013Allocation: ScreenView = {
  scope: "· Reporting & allocation · Assigned scope only",
  selected: 2,
  kpis: [
    k("24", "Pending tasks", "orange"),
    k("04", "Unassigned requests", "orange"),
    k("05", "Overdue tasks", "red"),
    k("02", "Awaiting acknowledgement", "orange"),
    k("03", "Active field teams", "sky"),
    k("02", "Conflicts to review", "orange"),
  ],
  rows: [
    top(
      330,
      panel(
        "Allocation queue",
        { t: "filter", search: true, placeholder: "Search task ID, title, assignee..." },
        tbl(
          ["Task ID", "Linked record", "Task", "Priority", "Owner"],
          [
            ["TASK-026", "MS-26-1101", "Confirm field readiness", "r:Emergency", "USR-007"],
            ["TASK-027", "MS-26-1100", "Verify legal documents", "High", "USR-008"],
            ["TASK-030", "REQ-26-1102", "Call family", "Normal", "a:Unassigned"],
            ["TASK-031", "REQ-26-1103", "Eligibility check", "High", "a:Unassigned"],
          ],
          3,
        ),
        btns("Assign selected", "Reassign", "Escalate"),
      ),
      panel(
        "Assignment details",
        form(
          { label: "Task", value: "TASK-030", kind: "readonly" },
          { label: "Assignee", value: "USR-009", kind: "select", options: ["USR-007", "USR-008"] },
          { label: "Mode", value: "Manual", kind: "select", options: ["Automatic", "Approval-based"] },
          { label: "Due time", value: "27 Nov · 15:00" },
        ),
        kv(["Reporting Admin", "Operations Admin"], ["Availability", "Check before save"], ["Legal gate", "Required for dispatch"], ["App acknowledgement", "Required"]),
        btns2("Preview assignment", "Save assignment"),
        info("AI suggestion: USR-008 · verify availability and skill before approval."),
      ),
    ),
    bottom(
      168,
      panel("Reporting structure", flow("Admin", "Assigned User", "Staff / volunteer app")),
      panel("Assignment checks", kvb(["Permissions", "Scoped"], ["Capacity", "Verify"], ["Conflict", "Review"], ["Training", "Verify"], ["Acceptance timer", "05 min"], ["Reassignment reason", "Required"])),
      panel("Recent allocation activity", kvb(["10:24", "TASK-026 assigned"], ["10:12", "TASK-027 accepted"], ["09:50", "Task reassigned"])),
    ),
  ],
};

/* ---------------- AD-014 Task Templates, Progress & Evidence ---------------- */

const ad014Templates: ScreenView = {
  snapshot: true,
  scope: "· Templates & checklists · Assigned scope only",
  selected: 1,
  kpis: [
    k("08", "Templates", "blue"),
    k("06", "Published", "green"),
    k("02", "Drafts", "orange"),
    k("03", "Review due", "orange"),
    k("01", "Retired", "sky"),
    k("02", "Pending changes", "orange"),
  ],
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
        SCOPE_DEMO,
      ),
    ),
    bottom(
      188,
      panel("Checklist builder", kv(["01 Verify authority", "a:Locked"], ["02 Check legal documents", "a:Locked"], ["03 Record decision", "b:Required"], ["04 Escalate exceptions", "b:Required"]), btns("Preview app", "Add draft step")),
      panel("Version comparison", kv(["Approved version", "g:v3"], ["Proposed version", "a:v4 draft"], ["Changes", "a:Review required"]), chips("Draft", "Review", "Approve"), btns("Compare versions")),
      panel("Publication controls", kv(["Mandatory checks", "r:Cannot bypass"], ["Existing tasks", "g:Pinned version"], ["Global publication", "b:Super Admin"]), btns("Request approval")),
    ),
  ],
};

const ad014Progress: ScreenView = {
  snapshot: true,
  scope: "· Progress & evidence · Assigned scope only",
  selected: 1,
  kpis: [
    k("24", "Pending tasks", "orange"),
    k("05", "Overdue", "red"),
    k("02", "Awaiting acceptance", "orange"),
    k("08", "In progress", "purple"),
    k("12", "Due today", "orange"),
    k("03", "Evidence review", "sky"),
  ],
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
      follow(
        "Selected task",
        kv(["Owner", "USR-008"], ["Acceptance", "Recorded"], ["Due", "10:00 IST"], ["Evidence", "Awaiting upload"], ["Next action", "Contact owner / escalate"]),
        SCOPE_DEMO,
      ),
    ),
    bottom(
      188,
      panel("Task lifecycle", chips("Assign", "Accept", "Progress", "Evidence", "Verify"), prog("In progress", 33, "08 tasks"), prog("Awaiting acceptance", 8, "02 tasks", "amber"), btns("Review evidence")),
      panel("Acceptance queue", kv(["TASK-031 · VOL-004", "a:08 min left"], ["Pending acceptance", "a:02"], ["Rejection reason", "b:Required"]), btns("Send reminder")),
      panel("Exceptions & evidence", kv(["Overdue tasks", "r:05"], ["Evidence review", "a:03"], ["App sync", "b:Check retries"]), btns("Reassign", "Escalate")),
    ),
  ],
};

/* -------------------- AD-015 SLA, Workflow & Escalation --------------------- */

const ad015Sla: ScreenView = {
  snapshot: true,
  scope: "· SLA & escalation · Assigned scope only",
  selected: 1,
  kpis: [
    k("05", "Overdue tasks", "red"),
    k("02", "Emergency cases", "red"),
    k("03", "At risk", "orange"),
    k("02", "Awaiting acknowledgement", "orange"),
    k("91%", "SLA compliance", "sky"),
    k("03", "Escalations open", "green"),
  ],
  rows: [
    top(
      310,
      panel(
        "SLA & Escalation Monitoring · register",
        { t: "filter", search: true, all: "Assigned scope", placeholder: "Search SLA or workflow..." },
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
      follow(
        "Selected escalation",
        kv(["Policy", "Approved task SLA"], ["Owner", "USR-008"], ["Escalate to", "Admin 01"], ["Next level", "Super Admin"], ["Pause reason", "None"]),
        SCOPE_DEMO,
      ),
    ),
    bottom(
      188,
      panel("Escalation ladder", chips("User", "Admin", "Super Admin"), kv(["Emergency", "r:Immediate"], ["Routine escalation", "b:Approved SLA"]), btns("Escalate now")),
      panel("SLA risk snapshot", prog("MS-26-1101", 90, "02 min left", "amber"), prog("TASK-031", 60, "08 min left"), prog("TASK-027", 100, "Breached", "red"), btns("Review timers")),
      panel("Response tracking", kv(["Acknowledgement", "b:Timestamp"], ["Pause reason", "a:Approval required"], ["Emergency gate", "r:Never delayed"]), btns("View history")),
    ),
  ],
};

const ad015Exceptions: ScreenView = {
  snapshot: true,
  scope: "· Workflow exceptions · Assigned scope only",
  selected: 2,
  kpis: [
    k("12", "Auto assignments today", "blue"),
    k("01", "Failed automation", "red"),
    k("02", "Human interventions", "orange"),
    k("03", "Awaiting approval", "orange"),
    k("08", "Successful runs", "sky"),
    k("01", "Retry queued", "green"),
  ],
  rows: [
    top(
      310,
      panel(
        "Workflow Execution & Exceptions · register",
        { t: "filter", search: true, all: "Assigned scope", placeholder: "Search SLA or workflow..." },
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
      follow(
        "Selected run",
        kv(["Failure", "App acknowledgement timeout"], ["Retry", "Queued"], ["Idempotency", "Required"], ["Fallback", "Manual task"], ["Policy", "Approved workflow only"]),
        SCOPE_DEMO,
      ),
    ),
    bottom(
      188,
      panel("Execution workflow", chips("Trigger", "Check", "Route", "Approve", "Execute"), kv(["RUN-103 failure", "r:App timeout"], ["Retry path", "a:Controlled"]), btns("Inspect run")),
      panel("Exception monitoring", prog("Auto assignments", 100, "12"), prog("Human intervention", 17, "02", "amber"), prog("Failed automation", 8, "01", "red"), btns("Review retry queue")),
      panel("Admin controls", kv(["Global rules", "b:Read-only"], ["Manual fallback", "g:Scoped"], ["Sensitive action", "a:Human review"]), btns("Request rule change")),
    ),
  ],
};

/* ------------------ AD-018 Fleet, Vehicle & Maintenance --------------------- */

const ad018Fleet: ScreenView = {
  snapshot: true,
  scope: "· Fleet & dispatch · Assigned scope only",
  selected: 1,
  kpis: [
    k("02", "Fleet registered", "blue"),
    k("01", "Available", "green"),
    k("01", "Deployed", "orange"),
    k("00", "Maintenance", "purple"),
    k("02", "Drivers on duty", "sky"),
    k("01", "Service due", "orange"),
  ],
  rows: [
    top(
      310,
      panel(
        "Fleet & Vehicle Allocation · register",
        { t: "filter", search: true, all: "Assigned scope", placeholder: "Search vehicle or trip..." },
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
        kv(["Driver availability", "Confirm"], ["GPS freshness", "10:22"], ["Legal clearance", "Case-specific gate"], ["Insurance / fitness", "Verify validity"], ["Cleaning checklist", "Required"], ["Dispatch", "Pending approval"]),
        SCOPE_DEMO,
        btns2("Review readiness", "Review dispatch"),
      ),
    ),
    bottom(
      188,
      panel("Dispatch queue", kv(["TR-001 · Body transport", "b:Assigned"], ["TR-002 · Cremation support", "a:Pending"], ["MV-02 readiness", "a:Review required"]), btns("Review trip", "Allocate")),
      panel("Fleet & GPS", gps("Ghaziabad · schematic only"), kv(["Available", "g:01 / 02"], ["Ready for dispatch", "a:Verify gate"]), btns("View GPS")),
      panel("Trip lifecycle", chips("Approve", "Allocate", "Dispatch", "Arrive", "Close"), kv(["Driver / licence", "a:Verify"], ["Fuel & mileage", "b:Trip ledger"]), btns("Record handover")),
    ),
  ],
};

const ad018Readiness: ScreenView = {
  snapshot: true,
  scope: "· Readiness & maintenance · Assigned scope only",
  selected: 0,
  kpis: [
    k("01", "Vehicle available", "blue"),
    k("01", "Vehicle deployed", "green"),
    k("01", "Service due", "orange"),
    k("02", "Low stock items", "orange"),
    k("03", "Pending issues", "orange"),
    k("01", "Readiness review", "orange"),
  ],
  rows: [
    top(
      310,
      panel(
        "Resource Readiness & Maintenance · register",
        { t: "filter", search: true, all: "Assigned scope", placeholder: "Search vehicle or trip..." },
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
        SCOPE_DEMO,
      ),
    ),
    bottom(
      188,
      panel("Maintenance calendar", week, info("24–30 Nov schedule"), kv(["MV-02 service", "a:Due soon"]), btns("Schedule service")),
      panel("Safety readiness", kv(["Documents / driver", "a:Verify"], ["Equipment / cleaning", "a:Review"], ["Case legal clearance", "r:Mandatory"]), btns("Review checklist")),
      panel("Repair & release", chips("Inspect", "Approve", "Repair", "Verify", "Release"), kv(["Repair costs / bills", "b:Attach evidence"], ["Final release", "a:Authorised only"]), btns("Submit request")),
    ),
  ],
};

/* ---------------- Compact Admin Workspaces AD-011 … AD-020 ------------------ */

export const screensB: Screen[] = [
  {
    code: "AD-011",
    title: "Case Management & Assignment",
    tabs: ["All cases", "Assignment & coordination"],
    ...ad011AllCases,
    views: {
      "All cases": ad011AllCases,
      "Assignment & coordination": ad011Assign,
    },
  },
  {
    code: "AD-012",
    title: "Case Details, Completion & Follow-up",
    tabs: ["Case overview", "Completion & follow-up"],
    ...ad012Overview,
    views: {
      "Case overview": ad012Overview,
      "Completion & follow-up": ad012Completion,
    },
  },
  {
    code: "AD-013",
    title: "Task Management & Allocation",
    tabs: ["Task list", "Create & assign", "Workload & allocation"],
    ...ad013TaskList,
    views: {
      "Task list": ad013TaskList,
      "Create & assign": ad013CreateAssign,
      "Workload & allocation": ad013Allocation,
    },
  },
  {
    code: "AD-014",
    title: "Task Templates, Progress & Evidence",
    tabs: ["Templates & checklists", "Progress & evidence"],
    ...ad014Templates,
    views: {
      "Templates & checklists": ad014Templates,
      "Progress & evidence": ad014Progress,
    },
  },
  {
    code: "AD-015",
    title: "SLA, Workflow & Escalation",
    tabs: ["SLA & escalation", "Workflow exceptions"],
    ...ad015Sla,
    views: {
      "SLA & escalation": ad015Sla,
      "Workflow exceptions": ad015Exceptions,
    },
  },
  {
    code: "AD-016",
    title: "Staff & Volunteer Live Monitoring",
    snapshot: true,
    scope: "· Live roster & safety · Assigned scope only",
    kpis: [
      k("08/10", "Staff on duty", "blue"),
      k("12/18", "Volunteers available", "green"),
      k("06", "Field assignments", "orange"),
      k("02", "Unacknowledged", "purple"),
      k("05", "Overdue tasks", "red"),
      k("01", "GPS stale", "red"),
    ],
    tabs: ["Staff & Volunteer Live Monitoring", "On-duty resource monitoring", "Assignment & safety", "Team availability", "GPS & exceptions"],
    rows: [
      top(
        310,
        panel(
          "Staff & Volunteer Live Monitoring · register",
          { t: "filter", search: true, all: "Assigned scope", placeholder: "Search staff or volunteer..." },
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
          SCOPE_DEMO,
          btns2("Contact member", "Review SOS"),
        ),
      ),
      bottom(
        188,
        panel("Assignment & safety", chips("Assign", "Accept", "Check-in", "Evidence", "Verify"), kv(["SOS", "r:Immediate response"], ["Pending acceptance", "a:02"]), btns("Open SOS queue")),
        panel("Team availability", prog("Staff on duty", 80, "8 / 10"), prog("Volunteers available", 67, "12 / 18", "green"), kv(["Field assignments", "b:06"]), btns("View roster")),
        panel("GPS & exceptions", gps("Ghaziabad · schematic only"), kv(["Stale devices", "a:01 · not live"], ["Location accuracy", "b:Telemetry required"]), btns("View tracking")),
      ),
    ],
  },
  {
    code: "AD-017",
    title: "Volunteer Coordination",
    snapshot: true,
    selected: 2,
    scope: "· Volunteer directory · Assigned scope only",
    kpis: [
      k("18", "Registered volunteers", "blue"),
      k("12", "Available", "green"),
      k("06", "Unavailable", "orange"),
      k("02", "Verification pending", "orange"),
      k("03", "Training due", "orange"),
      k("04", "Assigned today", "green"),
    ],
    tabs: ["Volunteer Coordination", "Selected volunteer", "Availability calendar", "Contribution & skills", "Eligibility gates"],
    rows: [
      top(
        310,
        panel(
          "Volunteer Coordination · register",
          { t: "filter", search: true, all: "Assigned scope", placeholder: "Search volunteer or skill..." },
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
          SCOPE_DEMO,
          btns2("Assign task", "View availability"),
        ),
      ),
      bottom(
        188,
        panel("Availability calendar", week, info("24–30 Nov schedule"), kv(["VOL-007", "a:Training due"]), btns("View availability")),
        panel("Contribution & skills", prog("Available volunteers", 67, "12 / 18", "green"), kv(["VOL-007 service hours", "b:24"], ["Skills", "b:Last-rites coordination"]), btns("Nominate recognition")),
        panel("Eligibility gates", kv(["Verification pending", "a:02"], ["Training due", "a:03"], ["Assignment", "b:Required training"]), btns("Review training")),
      ),
    ],
  },
  {
    code: "AD-018",
    title: "Fleet, Vehicle & Maintenance",
    tabs: ["Fleet & dispatch", "Readiness & maintenance"],
    ...ad018Fleet,
    views: {
      "Fleet & dispatch": ad018Fleet,
      "Readiness & maintenance": ad018Readiness,
    },
  },
  {
    code: "AD-019",
    title: "Service Network & Partners",
    snapshot: true,
    scope: "· Partners & coordination · Assigned scope only",
    kpis: [
      k("08", "Network partners", "blue"),
      k("05", "Verified", "green"),
      k("03", "Review pending", "orange"),
      k("01", "Active city", "purple"),
      k("02", "Upcoming cities", "sky"),
      k("01", "Expired document", "green"),
    ],
    tabs: ["Service Network Coordination", "Selected partner", "Coordination checklist", "Coverage & agreements", "Service quality"],
    rows: [
      top(
        310,
        panel(
          "Service Network Coordination · register",
          { t: "filter", search: true, all: "Assigned scope", placeholder: "Search partner or facility..." },
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
          SCOPE_DEMO,
          btns2("Confirm availability", "Contact liaison"),
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
    code: "AD-020",
    title: "Inventory & Material Management",
    snapshot: true,
    selected: 2,
    scope: "· Stock & material requests · Assigned scope only",
    kpis: [
      k("12", "Item types", "blue"),
      k("06", "Shown item lines", "green"),
      k("02", "Low stock", "orange"),
      k("03", "Pending issues", "orange"),
      k("02", "Purchase requests", "sky"),
      k("01", "Active store", "green"),
    ],
    tabs: ["Inventory & Material Requests", "Selected material", "Material movement", "Stock by item", "Procurement & audit"],
    rows: [
      top(
        310,
        panel(
          "Inventory & Material Requests · register",
          { t: "filter", search: true, all: "Assigned scope", placeholder: "Search material or item code..." },
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
          SCOPE_DEMO,
          btns2("Reserve stock", "Issue / return"),
        ),
      ),
      bottom(
        188,
        panel("Material movement", chips("Request", "Approve", "Reserve", "Issue", "Reconcile"), kv(["Pending issues", "a:03"], ["Purchase requests", "a:02"]), btns("Reserve", "Issue / return")),
        panel("Stock by item", prog("Body cover", 60, "6 / 10 pieces", "red"), prog("Sanitisation", 80, "8 / 10 units", "red"), prog("Cremation kits", 100, "24 / 10 kits", "green"), btns("Review stock")),
        panel("Procurement & audit", kv(["Low stock items", "r:02"], ["Damaged / returns", "b:Record ledger"], ["Stock adjustment", "a:Approval required"]), btns("Request purchase", "Stock audit")),
      ),
    ],
  },
];
