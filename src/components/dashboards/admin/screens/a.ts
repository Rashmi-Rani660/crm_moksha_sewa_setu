import { F, ONLY, bars, bottom, btns, ctbl, flow, follow, form, hbars, info, k, kv, map, note, panel, prog, row, tbl, textarea, top } from "../dsl";
import type { Screen } from "../types";

/** AD-001 … AD-010 — dashboard, live operations, alerts, approvals, planner, team, attendance. */
export const screensA: Screen[] = [
  {
    code: "AD-001",
    title: "Admin Dashboard",
    scope: ONLY,
    kpis: [
      k("18", "Assigned users", "blue"),
      k("12", "Active cases", "green"),
      k("02", "Emergency cases", "red"),
      k("04", "Unassigned requests", "purple"),
      k("05", "Overdue tasks", "pink"),
      k("24", "Pending tasks", "green"),
      k("04", "Pending approvals", "orange"),
      k("08", "Staff on duty", "purple"),
      k("12", "Volunteers available", "sky"),
      k("06", "Pending replies", "green"),
    ],
    tabs: ["Overview", "Requests & cases", "Team & tasks", "Communication", "Approvals & reports"],
    tabLinks: { "Requests & cases": "AD-011", "Team & tasks": "AD-019", Communication: "AD-031", "Approvals & reports": "AD-004" },
    rows: [
      row(194, [
        panel(
          "Priority actions & decisions",
          kv(
            ["Emergency cases", "r:02 • Emergency"],
            ["Unassigned requests", "a:04 • Unassigned"],
            ["Overdue tasks", "r:05 • Overdue"],
            ["Pending approvals", "04"],
            ["Missed helpline calls", "03"],
            ["Legal verification pending", "02"],
            ["Acknowledgement pending", "02"],
          ),
        ),
        panel(
          "Sewa operations overview",
          ctbl(["Beneficiary category", "Active", "Completed"], [
            ["Unclaimed bodies", "03", "08"],
            ["EWS / needy families", "06", "18"],
            ["Unsupported persons", "03", "08"],
            ["Total", "12", "34"],
          ]),
          { t: "donut", value: "46", unit: "Cases", pct: 74, lines: ["34 completed · 12 active", "Assigned case cohort"] },
        ),
        panel(
          "Team & resource availability",
          kv(
            ["Assigned users", "18"],
            ["Staff on duty", "8 / 10"],
            ["Volunteers available", "12 / 18"],
            ["Vehicles available", "1 / 2"],
            ["Field teams active", "03"],
            ["Task acknowledgement pending", "02"],
          ),
        ),
      ]),
      row(157, [
        panel(
          "Today's work planner",
          kv(["10:30", "Emergency review"], ["11:00", "Verify documents"], ["12:00", "Team review"], ["15:00", "Approvals"], ["Super Admin instruction", "Overdue review · 17:00"]),
        ),
        panel(
          "Communication & AI control",
          kv(["Missed calls", "03"], ["Pending email / WhatsApp", "02 / 04"], ["Failed automation", "r:01 • Failed"], ["Human intervention", "02"], ["WhatsApp sync", "a:Review delay"]),
        ),
        panel("Team performance & quality", prog("Task completion", 82), prog("SLA compliance", 91), kv(["Training pending", "03"], ["Open complaints", "02"])),
      ]),
      row(137, [
        panel(
          "Request intake · last 7 days",
          bars(
            [
              ["21 Nov", 21],
              ["22 Nov", 26],
              ["23 Nov", 20],
              ["24 Nov", 31],
              ["25 Nov", 38],
              ["26 Nov", 30],
              ["27 Nov", 35],
            ],
            "Incoming events; separate from verified cases.",
          ),
        ),
        panel(
          "Finance & resource alerts",
          kv(["Expense approvals pending", "02"], ["Low stock items", "01"], ["Vehicle maintenance", "a:Review due"], ["Coverage", "Ghaziabad only"]),
        ),
        panel(
          "AI insights & management notes",
          note("Review 2 emergencies; assign 4 requests; resolve 5 overdue tasks."),
          note("Last update 10:24", true),
          btns("Assign task", "Approvals", "Escalate"),
        ),
      ]),
    ],
  },
  {
    code: "AD-002",
    title: "Department Live Operations & Emergency Control",
    scope: ONLY,
    kpis: [k("12", "Active cases"), k("02", "Emergency", "red"), k("04", "Unassigned", "orange"), k("02", "Legal review", "purple"), k("03", "Field teams", "sky"), k("01", "Vehicles ready", "green")],
    tabs: ["Live cases", "Emergency queue", "Field resources", "Activity history"],
    rows: [
      top(
        348,
        panel(
          "Live case queue",
          F,
          tbl(
            ["Case ID", "Service", "Owner", "Stage", "Priority"],
            [
              ["MS-26-1101", "Cremation support", "User 07", "b:In service", "r:Emergency"],
              ["MS-26-1100", "Body transport", "User 08", "a:Legal review", "r:Emergency"],
              ["MS-26-1099", "Cremation support", "User 09", "b:Assigned", "High"],
              ["MS-26-1098", "Documentation", "User 10", "a:Pending", "Normal"],
              ["MS-26-1097", "Family assistance", "User 11", "b:In service", "Normal"],
            ],
            3,
          ),
          btns("Review case", "Assign team", "Escalate"),
        ),
        panel(
          "Emergency response & readiness",
          kv(
            ["MS-26-1101", "a:Immediate review"],
            ["MS-26-1100", "a:Legal clearance pending"],
            ["SLA timer", "08 min remaining"],
            ["MV-01", "b:In service"],
            ["MV-02", "g:Available"],
            ["Staff / volunteers", "8 / 12"],
          ),
          btns("Escalate to Super Admin", "Contact team"),
          kv(["MS-26-1101 response", "04 min"], ["MV-02 dispatch gate", "a:Verify driver & documents"], ["SOS / handover", "a:Review queue"]),
        ),
      ),
      bottom(
        150,
        panel("Service workflow", flow("Receive", "Verify", "Approve", "Dispatch", "Close")),
        panel(
          "Coverage & tracking",
          map("Ghaziabad · schematic", "MV-01 · team 01"),
          note("Consent-based duty tracking only. GPS age/accuracy: telemetry required."),
          note("Delhi / Noida: Coming soon."),
        ),
        panel("Recent activities", kv(["10:24", "Case assigned"], ["10:18", "Documents received"], ["10:10", "Vehicle update"])),
      ),
    ],
  },
  {
    code: "AD-003",
    title: "Notifications & Alert Centre",
    scope: ONLY,
    kpis: [k("12", "Open alerts"), k("02", "Critical", "green"), k("05", "Unread", "orange"), k("07", "Acknowledged", "purple"), k("04", "Action pending", "sky"), k("01", "Delivery failed", "red")],
    tabs: ["All alerts", "Critical", "Assigned to me", "Delivery history"],
    rows: [
      top(
        348,
        panel(
          "Assigned notifications",
          F,
          tbl(
            ["Alert", "Subject", "Priority", "Owner", "Status"],
            [
              ["ALT-01", "Emergency case MS-26-1101", "r:Critical", "Admin", "a:Pending"],
              ["ALT-02", "Legal clearance required", "High", "User 08", "a:Pending"],
              ["ALT-03", "Overdue task TASK-026", "High", "User 07", "r:Overdue"],
              ["ALT-04", "Super Admin instruction", "Normal", "Admin", "b:Unread"],
              ["ALT-05", "WhatsApp sync delay", "Normal", "Admin", "a:Review"],
              ["ALT-06", "Training reminder", "Normal", "User 10", "b:Acknowledged"],
            ],
          ),
          btns("Acknowledge", "Assign follow-up", "Escalate"),
        ),
        follow(
          "Selected alert",
          kv(
            ["Source", "Live operations"],
            ["Linked case", "MS-26-1101"],
            ["Received", "27 Nov · 10:24"],
            ["Priority", "r:Critical"],
            ["Read status", "Unread"],
            ["Responsible", "Operations Admin"],
            ["Escalation", "Super Admin if overdue"],
          ),
          btns("Open case", "Acknowledge"),
          kv(["Alert age", "06 min"], ["Acknowledgement due", "09 min"], ["Delivery history", "In-app delivered"]),
        ),
      ),
      bottom(
        150,
        panel("Alert categories", kv(["Operations", "06"], ["Tasks", "03"], ["System / training", "03"])),
        panel("Delivery exceptions", kv(["In-app", "Connected"], ["WhatsApp", "a:Review delay"], ["SMS", "r:01 failed"]), btns("Delivery history", "Retry review")),
        panel("Notification lifecycle", flow("Receive", "Read", "Acknowledge", "Resolve"), note("Critical alerts cannot be muted.")),
      ),
    ],
  },
  {
    code: "AD-004",
    title: "Pending Approvals & Decisions",
    scope: ONLY,
    kpis: [k("04", "Pending decisions"), k("02", "High priority"), k("02", "Expense requests"), k("03", "Within limit"), k("01", "Escalate"), k("06", "Decided today")],
    tabs: ["Pending", "Reviewed", "Escalated", "Decision history"],
    rows: [
      top(
        348,
        panel(
          "Approval queue",
          F,
          tbl(
            ["Approval ID", "Subject", "Amount", "Requester", "Status"],
            [
              ["APV-01", "Cremation material expense", "₹3,500", "User 07", "a:Pending"],
              ["APV-02", "Vehicle trip expense", "₹1,200", "User 08", "a:Pending"],
              ["APV-03", "Case eligibility review", "—", "User 09", "a:Pending"],
              ["APV-04", "Exceptional cost request", "₹18,000", "User 10", "a:Review limit"],
            ],
          ),
          btns("Review selected", "Escalate"),
        ),
        follow(
          "Decision preview",
          kv(
            ["Case", "MS-26-1101"],
            ["Supporting evidence", "Invoice attached"],
            ["Amount", "₹3,500"],
            ["Authority", "Check delegated limit"],
            ["Maker / checker", "Different users required"],
            ["Budget validation", "Required"],
          ),
          textarea("Decision reason", "Enter reason"),
          btns("Approve within limit", "Return", "Reject"),
          kv(["Delegated limit", "Policy lookup required"], ["SLA remaining", "22 min"], ["Decision eligibility", "a:Check authority"]),
          btns("Preview invoice", "Escalate"),
        ),
      ),
      bottom(
        150,
        panel("Approval flow", flow("Submit", "Verify", "Decide", "Notify")),
        panel(
          "Approval guardrails",
          kv(["Self approval", "Blocked"], ["Payment release", "Separate authority"], ["Legal clearance", "Cannot bypass"]),
          note("Independent checker required. Out-of-limit items escalate."),
        ),
        panel("Decision history", kv(["APV-05", "g:Approved"], ["APV-06", "Returned for evidence"], ["APV-07", "Escalated"])),
      ),
    ],
  },
  {
    code: "AD-005",
    title: "Daily Work Planner",
    scope: ONLY,
    kpis: [k("08", "Due today"), k("03", "Completed today"), k("05", "Pending today"), k("05", "Overdue tasks", "red"), k("02", "Meetings today"), k("03", "Reminders")],
    tabs: ["Today", "Week planner", "Meetings", "Reminders"],
    rows: [
      top(
        292,
        panel(
          "Daily agenda · 27 Nov 2026",
          F,
          tbl(
            ["Time", "Work item", "Owner", "Status"],
            [
              ["10:30", "Review emergency cases", "Admin", "a:Pending"],
              ["11:00", "Verify pending documents", "User 08", "a:Pending"],
              ["12:00", "Team work review", "Admin", "b:Scheduled"],
              ["15:00", "Approvals & follow-up", "Admin", "b:Scheduled"],
              ["16:30", "Review overdue tasks", "Admin", "b:Scheduled"],
            ],
          ),
          btns("Add work item", "Schedule meeting", "Set reminder"),
        ),
        panel(
          "Work priorities",
          kv(["Emergency reviews", "02"], ["Pending approvals", "04"], ["Unassigned requests", "04"], ["Overdue tasks", "05"]),
          prog("Daily completion", 38),
          btns("Open task list"),
          kv(["Schedule conflicts", "a:01 · review"], ["Reminders due", "03"]),
          btns("Day", "Week", "Month"),
        ),
      ),
      bottom(
        205,
        panel("Upcoming schedule", kv(["28 Nov", "Staff refresher"], ["30 Nov", "Monthly review"], ["01 Dec", "Inventory review"])),
        panel("Calendar · November", { t: "calendar", firstDay: 6, days: 30, marks: [27] }),
        panel("Planner rules", kv(["Time zone", "Asia/Kolkata"], ["Conflict check", "Required"], ["Reminders", "Policy-based"]), note("Recurring tasks use shared task IDs.")),
      ),
    ],
  },
  {
    code: "AD-006",
    title: "Team & User Management",
    scope: ONLY,
    kpis: [k("18", "Assigned users"), k("16", "Active accounts"), k("02", "Inactive accounts"), k("08", "Staff on duty"), k("03", "Training pending"), k("01", "Access issues")],
    tabs: ["Team directory", "Workload", "Training", "Access requests"],
    rows: [
      top(
        348,
        panel(
          "Assigned team directory",
          F,
          tbl(
            ["User ID", "Designation", "Department", "Workload", "Status"],
            [
              ["USR-007", "Field coordinator", "Sewa operations", "04", "g:Active"],
              ["USR-008", "Documentation executive", "Sewa operations", "03", "g:Active"],
              ["USR-009", "Helpline coordinator", "Communication", "05", "g:Active"],
              ["USR-010", "Operations executive", "Sewa operations", "02", "g:Active"],
              ["USR-011", "Driver", "Field support", "02", "g:Active"],
              ["USR-012", "Support executive", "Field support", "00", "x:Inactive"],
            ],
          ),
          btns("View profile", "Assign work", "Request access change"),
        ),
        follow(
          "Selected user",
          kv(
            ["Access level", "User"],
            ["HRMS ID", "EMP-007"],
            ["Reporting Admin", "Operations Admin"],
            ["Centre", "Ghaziabad"],
            ["MFA", "Verified"],
            ["Training", "a:Review due"],
            ["Open tasks", "04"],
          ),
          btns("View work history", "Request update"),
          kv(["Skill", "Last-rites coordination"], ["Availability", "On duty"], ["Access request", "a:Review pending"]),
        ),
      ),
      bottom(
        150,
        panel("Account distribution", prog("Active accounts", 89), kv(["Inactive", "02"], ["Total", "18"])),
        panel("Team controls", kv(["HRMS master", "Read only"], ["Role changes", "Super Admin approval"], ["Staff access", "Assigned scope"]), btns("Skills filter", "Availability filter")),
        panel("Exceptions", kv(["Access issue", "01"], ["Training pending", "03"], ["Exit handover", "Review when notified"])),
      ),
    ],
  },
  {
    code: "AD-007",
    title: "User Profile & Work History",
    scope: ONLY,
    kpis: [k("04", "Open tasks"), k("01", "Overdue", "red"), k("08", "Completed this week"), k("91%", "SLA compliance"), k("01", "Training due"), k("03", "Cases linked")],
    tabs: ["Profile", "Work history", "Performance", "Training"],
    rows: [
      row(292, [
        panel(
          "User profile · USR-007",
          kv(
            ["Name", "Demo User 07"],
            ["Employee ID", "EMP-007"],
            ["Designation", "Field coordinator"],
            ["Department", "Sewa operations"],
            ["Access level", "User"],
            ["Mobile", "98XXXXXX07"],
            ["Reporting Admin", "Operations Admin"],
            ["Centre", "Ghaziabad"],
          ),
          btns("Assign work", "Request correction"),
        ),
        panel(
          "Work history",
          ctbl(["Task", "Linked case", "Status"], [
            ["TASK-026", "MS-26-1101", "r:Overdue"],
            ["TASK-027", "MS-26-1099", "b:In progress"],
            ["TASK-028", "MS-26-1098", "g:Completed"],
            ["TASK-029", "MS-26-1097", "b:Assigned"],
          ]),
          btns("View task history"),
        ),
        panel(
          "Performance & training",
          prog("SLA compliance", 91),
          prog("Training progress", 80),
          kv(["Refresher", "a:Review due"], ["Quality review", "Human verified"], ["Coaching", "Next review pending"]),
          prog("Task completion", 85),
        ),
      ]),
      bottom(
        205,
        panel("Activity timeline", kv(["10:24", "Task update"], ["10:12", "Case acknowledgement"], ["09:30", "Duty check-in"])),
        panel("Access & privacy", kv(["Account", "g:Active"], ["MFA", "Required"], ["Private data", "Restricted"])),
        panel(
          "Management notes",
          note("Review overdue task and confirm workload before further allocation."),
          btns("Add coaching note", "Escalate"),
          note("Coaching: review on 28 Nov. Human review required."),
        ),
      ),
    ],
  },
  {
    code: "AD-008",
    title: "Team Availability & Workload",
    scope: ONLY,
    kpis: [k("18", "Assigned users"), k("08", "Staff on duty"), k("12", "Volunteers available"), k("03", "Field teams"), k("24", "Pending tasks"), k("05", "Overdue tasks", "red")],
    tabs: ["Availability", "Workload", "Duty roster", "Conflicts"],
    rows: [
      top(
        348,
        panel(
          "Team workload & availability",
          F,
          tbl(
            ["Member", "Type", "Open tasks", "Overdue", "Availability"],
            [
              ["USR-007", "Staff", "04", "01", "g:On duty"],
              ["USR-008", "Staff", "03", "01", "g:On duty"],
              ["USR-009", "Staff", "05", "02", "g:On duty"],
              ["USR-010", "Staff", "02", "00", "g:Available"],
              ["VOL-004", "Volunteer", "01", "00", "b:Assigned"],
              ["VOL-007", "Volunteer", "00", "00", "g:Available"],
            ],
          ),
          btns("Allocate task", "Review capacity", "Reassign"),
        ),
        panel(
          "Capacity indicators",
          prog("Staff on duty · 8/10", 80),
          prog("Volunteers available · 12/18", 67),
          kv(["Assignment conflicts", "02"], ["Acknowledgement pending", "02"], ["Overdue tasks", "05"], ["On-duty tracking", "Consent required"]),
          btns("View roster"),
          kv(["Shift window", "09:00–18:00"], ["Capacity basis", "Skills + time + complexity"]),
        ),
      ),
      bottom(
        150,
        panel("Workload by user", hbars(["USR-007", 65], ["USR-008", 50], ["USR-009", 85])),
        panel("Availability rules", kv(["Skill match", "Required"], ["Training validity", "Required"], ["Overlapping tasks", "Block / review"]), btns("Shift roster", "Review conflicts")),
        panel("Safety exceptions", kv(["Stale GPS", "01"], ["SOS", "Review queue"], ["Off-duty location", "Not collected"])),
      ),
    ],
  },
  {
    code: "AD-009",
    title: "Reporting & Task Allocation",
    scope: ONLY,
    kpis: [k("24", "Pending tasks"), k("04", "Unassigned requests"), k("05", "Overdue tasks", "red"), k("02", "Awaiting acknowledgement"), k("03", "Active field teams"), k("02", "Conflicts to review")],
    tabs: ["Allocation queue", "Create assignment", "Reporting lines", "History"],
    rows: [
      top(
        326,
        panel(
          "Allocation queue",
          F,
          tbl(
            ["Task ID", "Linked record", "Task", "Priority", "Owner"],
            [
              ["TASK-026", "MS-26-1101", "Confirm field readiness", "r:Emergency", "USR-007"],
              ["TASK-027", "MS-26-1100", "Verify legal documents", "High", "USR-008"],
              ["TASK-030", "REQ-26-1102", "Call family", "Normal", "a:Unassigned"],
              ["TASK-031", "REQ-26-1103", "Eligibility check", "High", "a:Unassigned"],
            ],
          ),
          btns("Assign selected", "Reassign", "Escalate"),
        ),
        panel(
          "Assignment details",
          form(
            { label: "Task", value: "TASK-030", kind: "readonly" },
            { label: "Assignee", value: "USR-009", kind: "select", options: ["USR-007", "USR-008", "USR-010"] },
            { label: "Mode", value: "Manual", kind: "select", options: ["Automatic", "Approval"] },
            { label: "Due time", value: "27 Nov · 15:00" },
          ),
          kv(["Reporting Admin", "Operations Admin"], ["Availability", "Check before save"], ["Legal gate", "Required for dispatch"], ["App acknowledgement", "Required"]),
          btns("Preview assignment", "Save assignment"),
          info("AI suggestion: USR-008 · verify availability and skill before approval."),
        ),
      ),
      bottom(
        173,
        panel("Reporting structure", flow("Admin", "Assigned User", "Staff / volunteer app")),
        panel(
          "Assignment checks",
          kv(["Permissions", "Scoped"], ["Capacity", "Verify"], ["Conflict", "Review"], ["Training", "Verify"], ["Acceptance timer", "05 min"], ["Reassignment reason", "Required"]),
        ),
        panel("Recent allocation activity", kv(["10:24", "TASK-026 assigned"], ["10:12", "TASK-027 accepted"], ["09:50", "Task reassigned"])),
      ),
    ],
  },
  {
    code: "AD-010",
    title: "Attendance & HRMS Overview",
    scope: ONLY,
    kpis: [k("10", "Staff roster"), k("08", "On duty"), k("02", "Off duty"), k("01", "Check-in pending"), k("Connected", "HRMS sync"), k("02", "Attendance reviews")],
    tabs: ["Attendance today", "Duty roster", "Exceptions", "HRMS sync"],
    rows: [
      top(
        320,
        panel(
          "Assigned staff attendance",
          F,
          tbl(
            ["Employee", "Shift", "Check-in", "Check-out", "Status"],
            [
              ["EMP-007", "09:00–18:00", "08:58", "—", "g:On duty"],
              ["EMP-008", "09:00–18:00", "09:02", "—", "g:On duty"],
              ["EMP-009", "09:00–18:00", "09:05", "—", "g:On duty"],
              ["EMP-010", "09:00–18:00", "—", "—", "a:Pending"],
              ["EMP-011", "Off duty", "—", "—", "x:Off duty"],
              ["EMP-012", "Off duty", "—", "—", "x:Off duty"],
            ],
          ),
          btns("View HRMS record", "Request correction", "Review exceptions"),
        ),
        panel(
          "HRMS & attendance control",
          kv(
            ["Master system", "HRMS"],
            ["Last sync", "10:24"],
            ["Integration", "g:Connected"],
            ["Duty status", "Assigned roster only"],
            ["Correction authority", "HRMS approval"],
            ["Volunteer records", "Separate registry"],
          ),
          prog("On-duty staff", 80),
          btns("Refresh status"),
          kv(["Sync age", ""], ["Late arrivals", "Policy review"], ["Source changes", "HRMS only"]),
        ),
      ),
      bottom(
        178,
        panel(
          "Attendance review",
          note("Missing check-in 01 · corrections 02"),
          note("Attendance week", true),
          flow(["23", "P"], ["24", "P"], ["25", "P"], ["26", "P"], ["27", "Review"]),
        ),
        panel("Duty & handover", kv(["Shift change", "Authorised roster"], ["Handover", "Acknowledgement"], ["Off-duty tracking", "Disabled"]), btns("Correction request", "Sync exceptions")),
        panel("Data protection", kv(["Attendance source", "HRMS"], ["Private location", "Not collected"], ["Audit", "Mandatory"])),
      ),
    ],
  },
];
