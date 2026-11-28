import { FS, FSN, SCOPE, alert, bottom, btns, chips, doc, follow, form, k, kanban, kv, kvb, obtns, panel, prog, tbl, top } from "../dsl";
import type { Screen } from "../types";

const detailBtns = btns("View details", "Review history");

/** AD-011 … AD-020 — requests, verification, legal, cases, closure, tasks. */
export const screensB: Screen[] = [
  {
    code: "AD-011",
    title: "Sewa Requests & Intake",
    selected: 2,
    kpis: [k("05", "Queue records · sample"), k("04", "Unassigned · scope"), k("02", "Emergency · scope", "red"), k("02", "Legal checks due"), k("03", "Missed callbacks"), k("06", "Replies due")],
    tabs: ["Request queue", "Channels", "Duplicate review", "History"],
    rows: [
      top(
        330,
        panel(
          "Request queue",
          FS,
          tbl(
            ["Request ID", "Source", "Beneficiary category", "Priority", "Owner", "Age", "Status"],
            [
              ["REQ-26-1102", "WhatsApp", "EWS family", "High", "—", "12 min", "a:Unassigned"],
              ["REQ-26-1103", "Website", "Unsupported person", "High", "—", "18 min", "a:Unassigned"],
              ["REQ-26-1104", "Helpline", "Unclaimed body", "r:Emergency", "—", "05 min", "a:Unassigned"],
              ["REQ-26-1105", "Volunteer app", "EWS family", "Normal", "—", "22 min", "a:Unassigned"],
              ["REQ-26-1100", "Email", "Unclaimed body", "High", "USR-008", "35 min", "a:Review"],
            ],
          ),
          btns("Create request", "Assign owner", "Merge duplicate", "Escalate"),
        ),
        follow(
          "Selected request",
          kv(["City", "Ghaziabad"], ["Service", "Free cremation support"], ["Legal clearance", "a:Pending"], ["Callback", "Due now"], ["Routing", "Human review"], ["Duplicate check", "Required"]),
          SCOPE,
          detailBtns,
        ),
      ),
      bottom(
        168,
        panel("Intake by source · selected queue", kvb(["WhatsApp / Website", "1 / 1"], ["Helpline / Volunteer app", "1 / 1"], ["Official email", "1"], ["Other channels", "0 in shown queue"])),
        panel("Priority & ageing", kvb(["Emergency REQ-26-1104", "r:Due now"], ["Unassigned", "04"], ["Missed callbacks", "03"], ["Out of coverage", "Separate queue"])),
        panel("Routing exceptions", chips("Capture", "Deduplicate", "Verify", "Assign"), kvb(["Failed AI routing", "Manual fallback"], ["Assignment", "Acknowledge"])),
      ),
    ],
  },
  {
    code: "AD-012",
    title: "Create & Edit Sewa Request",
    kpis: [k("Draft", "Request state"), k("Free", "Service model"), k("01", "Active city"), k("03", "Beneficiary categories"), k("02", "Required reviews"), k("04", "Unassigned queue")],
    tabs: ["Request form", "Family details", "Consent", "History"],
    rows: [
      top(
        330,
        panel(
          "Request intake form",
          form(
            { label: "Requester", value: "Family 01" },
            { label: "Mobile", value: "98XXXXXX01" },
            { label: "Beneficiary category", value: "EWS family", kind: "select", options: ["Unsupported person", "Unclaimed body"] },
            { label: "Service requested", value: "Cremation support" },
            { label: "Pickup area", value: "Ghaziabad" },
            { label: "Source", value: "Helpline" },
            { label: "Notes / instructions", value: "", kind: "textarea" },
          ),
          btns("Save draft", "Submit for verification", "Cancel"),
          { t: "callout", text: "EWS family: family contact, eligibility evidence and applicable death record." },
        ),
        panel(
          "Intake form · draft",
          kv(["Request ID", "Generated on save"], ["Relationship", "Family representative"], ["Consent", "Pending confirmation"], ["Priority", "High"], ["Assigned centre", "Ghaziabad"], ["Owner", "a:Unassigned"]),
          SCOPE,
          detailBtns,
        ),
      ),
      bottom(
        168,
        panel("Category-specific checklist", kvb(["Family representative", "Confirm"], ["EWS eligibility", "Review"], ["Death record", "As applicable"])),
        panel("Consent & duplicate review", kvb(["Purpose-specific consent", "Pending"], ["Potential duplicate", "Check before save"], ["Contact visibility", "Masked"]), btns("Review match")),
        panel("Save & routing", chips("Draft", "Validate", "Verify"), kvb(["Mandatory fields", "Category based"], ["Legal clearance", "Before dispatch"])),
      ),
    ],
  },
  {
    code: "AD-013",
    title: "Request Verification & Eligibility",
    kpis: [k("02", "Pending legal checks"), k("04", "Unassigned requests"), k("02", "Emergency cases", "red"), k("04/05", "Documents reviewed"), k("Hold", "Dispatch gate"), k("01", "Active centre")],
    tabs: ["Verification queue", "Eligibility", "Documents", "Review history"],
    rows: [
      top(
        330,
        panel(
          "Verification queue",
          FSN,
          tbl(
            ["Request ID", "Category", "Eligibility", "Documents", "Legal status", "Owner"],
            [
              ["REQ-26-1100", "Unclaimed body", "a:Review", "4/5", "a:Pending", "USR-008"],
              ["REQ-26-1102", "EWS family", "a:Review", "2/3", "a:Pending", "—"],
              ["REQ-26-1103", "Unsupported person", "a:Pending", "1/3", "a:Pending", "—"],
              ["REQ-26-1104", "Unclaimed body", "a:Review", "0/5", "a:Pending", "—"],
            ],
            2,
          ),
          btns("Preview evidence", "Return for clarification", "Escalate"),
        ),
        panel(
          "Selected verification",
          kv(["Request", "REQ-26-1100"], ["Eligibility", "Under review"], ["Authority clearance", "a:Pending"], ["Document review", "4 of 5"], ["Final decision", "Not approved"], ["Dispatch", "r:Blocked"]),
          SCOPE,
          detailBtns,
        ),
      ),
      bottom(
        168,
        panel("Evidence checklist · unclaimed body", kvb(["Death record / authority", "Verified in"], ["Police release", "r:Missing"], ["Identity / handover", "Review as applicable"])),
        panel("Verification progress", prog("Documents received", 80, "4 / 5"), kvb(["Eligibility", "Under review"], ["Final approval", "Blocked"])),
        panel("Decision workflow", chips("Eligibility", "Evidence", "Clearance", "Dispatch"), kvb(["Emergency", "Human escalation"], ["Legal gate", "No override"])),
      ),
    ],
  },
  {
    code: "AD-014",
    title: "Legal Documents & Clearance",
    kpis: [k("02", "Pending legal clearance"), k("01", "Authority review"), k("04", "Evidence reviewed"), k("01", "Missing document", "red"), k("Hold", "Dispatch status"), k("00", "Overrides allowed")],
    tabs: ["Document register", "Preview", "Clearance", "Audit"],
    rows: [
      top(
        330,
        panel(
          "Document register",
          FS,
          tbl(
            ["Document", "Linked record", "Received", "Review", "Authority"],
            [
              ["Death record", "REQ-26-1100", "27 Nov 10:02", "g:Verified", "Hospital"],
              ["Police release", "REQ-26-1100", "—", "r:Missing", "Police"],
              ["Identity evidence", "REQ-26-1100", "27 Nov 10:04", "g:Verified", "Reviewer"],
              ["Handover record", "REQ-26-1100", "27 Nov 10:10", "a:Review", "Operations"],
              ["Consent / authority", "REQ-26-1100", "27 Nov 10:12", "g:Verified", "Reviewer"],
            ],
          ),
          btns("Request missing document", "Record review", "Escalate"),
        ),
        panel(
          "Restricted document viewer",
          doc("Death record · PREVIEW", ["Reference: REQ-26-1100", "Issuer: Hospital (illustrative)", "Received: 27 Nov · 10:02", "Personal fields: masked"], "g:Verified in"),
          kv(["Police release", "r:Not received"], ["Legal gate", "r:Blocked"]),
          btns("Open received document", "Review history"),
        ),
      ),
      bottom(
        168,
        panel("Document handling", kvb(["Upload scan", "Required"], ["Version / checksum", "Record"], ["Access", "Restricted"])),
        panel("Authority verification", kvb(["Issuer identity", "Verify"], ["Official reference", "Required"], ["Independent review", "As applicable"])),
        panel("Dispatch restriction", chips("Receive", "Verify", "Approve"), alert("Dispatch disabled until all applicable mandatory legal gates pass."), obtns("Release dispatch")),
      ),
    ],
  },
  {
    code: "AD-015",
    title: "Case Management",
    kpis: [k("12", "Active cases · scope"), k("34", "Completed · cohort"), k("02", "Emergency subset", "red"), k("03", "Field teams"), k("02", "Legal checks due"), k("46", "Case cohort total")],
    tabs: ["Case list", "Stages", "Assignments", "Closure"],
    rows: [
      top(
        330,
        panel(
          "Case list",
          FS,
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
          SCOPE,
          detailBtns,
        ),
      ),
      bottom(
        168,
        panel("Case stage · current cohort", kvb(["Active cases", "12"], ["Completed cases", "34"], ["Emergency", "2 · active subset"]), prog("", 74)),
        panel("Beneficiary category · 46 cases", kvb(["Unclaimed", "3 active / 8 closed"], ["EWS families", "6 active / 18 closed"], ["Unsupported", "3 active / 8 closed"])),
        panel("Ageing & SLA", kvb(["Legal hold · MS-26-1100", "Review"], ["Overdue case", "Review timer"], ["Closure evidence", "Mandatory"]), btns("Review delayed cases")),
      ),
    ],
  },
  {
    code: "AD-016",
    title: "Complete Case Details – 360° View",
    kpis: [k("In service", "Current stage"), k("Cleared", "Legal gate"), k("01", "Vehicle assigned"), k("03", "Team members"), k("High", "Priority"), k("Free", "Beneficiary charge")],
    tabs: ["Overview", "Resources", "Documents", "Communication", "Timeline"],
    rows: [
      top(
        330,
        panel(
          "Overview",
          FS,
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
          SCOPE,
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
  },
  {
    code: "AD-017",
    title: "Case Assignment & Field Coordination",
    kpis: [k("12", "Active cases"), k("03", "Active field teams"), k("01/02", "Vehicles available"), k("08/10", "Staff on duty"), k("12/18", "Volunteers available"), k("02", "Acknowledgements due")],
    tabs: ["Assignment queue", "Resources", "Dispatch", "Handover"],
    rows: [
      top(
        330,
        panel(
          "Assignment queue",
          FS,
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
          SCOPE,
          detailBtns,
        ),
      ),
      bottom(
        168,
        panel("Vehicle & legal readiness", kvb(["MV-02", "Available"], ["Driver / documents", "Verify before dispatch"], ["Case MS-26-1100", "r:Blocked"])),
        panel("AI recommendation", kvb(["Team 03", "Available · skill match"], ["Mode", "Manual / Auto / Approval"], ["Conflict check", "Required"]), btns("Review recommendation")),
        panel("Field handover", chips("Accept", "Check-in", "Deliver", "Verify"), kvb(["Acknowledgement", "App timer"], ["GPS / SOS", "Authorised on-duty only"])),
      ),
    ],
  },
  {
    code: "AD-018",
    title: "Case Closure & Follow-up",
    selected: 1,
    kpis: [k("34", "Completed · cohort"), k("12", "Active · cohort"), k("02", "Closure review"), k("02", "Open complaints"), k("01", "Follow-up due"), k("Free", "Service model")],
    tabs: ["Closure queue", "Evidence", "Feedback", "Reopened"],
    rows: [
      top(
        330,
        panel(
          "Closure queue",
          FS,
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
          SCOPE,
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
  },
  {
    code: "AD-019",
    title: "Task Management",
    selected: 1,
    kpis: [k("24", "Pending tasks"), k("05", "Overdue subset", "red"), k("02", "Acknowledgement due"), k("18", "Assigned users"), k("03", "Field teams"), k("04", "Unassigned requests")],
    tabs: ["Task list", "Kanban", "Calendar", "Workload"],
    rows: [
      top(
        330,
        panel(
          "Task list",
          FS,
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
          SCOPE,
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
  },
  {
    code: "AD-020",
    title: "Create & Assign Task",
    kpis: [k("24", "Pending tasks"), k("05", "Overdue tasks", "red"), k("02", "Acceptance due"), k("03", "Assignment modes"), k("18", "Assigned users"), k("Draft", "New task")],
    tabs: ["Task form", "Assignment", "Checklist", "Preview"],
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
          SCOPE,
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
  },
];
