import { F, FA, FS, ONLY, alert, bars, bottom, btns, callout, chips, ctbl, doc, flow, follow, form, hbars, info, k, kv, map, note, obtns, panel, prog, row, tbl, textarea, top } from "../dsl";
import type { Screen } from "../types";

/** AD-001 … AD-010 — dashboard, live operations, alerts, approvals, planner, team, attendance. */
export const screensA: Screen[] = [
  {
    code: "AD-001",
    title: "Admin Dashboard",
    scope: ONLY,
    period: true,
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
    tabLinks: { "Requests & cases": "AD-008", "Team & tasks": "AD-013", Communication: "AD-031", "Approvals & reports": "AD-004" },
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
          {
            t: "donut",
            value: "46",
            unit: "Cases",
            pct: 74,
            lines: ["34 completed · 12 active", "Assigned case cohort"],
          },
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
          note("Last update 10:24 · demo", true),
          btns("Assign task", "Approvals", "Escalate"),
        ),
      ]),
    ],
  },
  {
    code: "AD-002",
    title: "Live Operations & Emergency Control",
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
            ["SLA timer", "08 min remaining · demo"],
            ["MV-01", "b:In service"],
            ["MV-02", "g:Available"],
            ["Staff / volunteers", "8 / 12"],
          ),
          btns("Escalate to Super Admin", "Contact team"),
          kv(["MS-26-1101 response", "04 min · demo"], ["MV-02 dispatch gate", "a:Verify driver & documents"], ["SOS / handover", "a:Review queue"]),
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
    title: "Notifications & Admin Instructions",
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
          kv(["Alert age", "06 min · demo"], ["Acknowledgement due", "09 min · demo"], ["Delivery history", "In-app delivered"]),
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
    title: "Central Approvals & Decisions",
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
            ["Supporting evidence", "Invoice attached · demo"],
            ["Amount", "₹3,500"],
            ["Authority", "Check delegated limit"],
            ["Maker / checker", "Different users required"],
            ["Budget validation", "Required"],
          ),
          textarea("Decision reason", "Enter reason"),
          btns("Approve within limit", "Return", "Reject"),
          kv(["Delegated limit", "Policy lookup required"], ["SLA remaining", "22 min · demo"], ["Decision eligibility", "a:Check authority"]),
          btns("Preview invoice", "Escalate"),
        ),
      ),
      bottom(
        150,
        panel("Approval flow", flow("Submit", "Verify", "Decide", "Notify")),
        panel(
          "Approval guardrails",
          kv(["Self approval", "Blocked"], ["Payment release", "Separate authority"], ["Legal clearance", "Cannot bypass"]),
        ),
        panel("Decision history", kv(["APV-05", "g:Approved"], ["APV-06", "Returned for evidence"], ["APV-07", "Escalated"])),
      ),
    ],
  },
  {
    code: "AD-005",
    title: "Work Planner, Calendar & Handover",
    scope: ONLY,
    kpis: [k("08", "Due today"), k("03", "Completed today"), k("05", "Pending today"), k("05", "Overdue tasks", "red"), k("02", "Meetings today"), k("03", "Reminders")],
    tabs: ["Today / calendar / reminders", "Shift handover"],
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
            ],
          ),
        ),
        panel(
          "Work priorities",
          kv(["Emergency reviews", "02"], ["Pending approvals", "04"], ["Unassigned requests", "04"], ["Overdue tasks", "05"]),
          prog("Daily completion", 38),
          btns("Open task list"),
          kv(["Schedule conflicts", "a:01 · review"], ["Reminders due", "03"]),
        ),
      ),
      bottom(
        205,
        panel("Upcoming schedule", kv(["28 Nov", "Staff refresher"], ["30 Nov", "Monthly review"], ["01 Dec", "Inventory review"])),
        panel("Calendar · November", { t: "calendar", firstDay: 6, days: 30, marks: [27] }),
        panel("Planner rules", kv(["Time zone", "Asia/Kolkata"], ["Conflict check", "Required"], ["Reminders", "Policy-based"]), note("Recurring tasks use shared task IDs.")),
      ),
    ],
    tabRows: {
      "Shift handover": [
        top(
          348,
          panel(
            "Pending work handover · demo",
            tbl(
              ["Record", "Pending work", "Outgoing owner", "Receiving owner", "Status"],
              [
                ["MS-26-1101", "Legal review", "User 07", "User 08", "a:Awaiting acceptance"],
                ["TASK-026", "Vehicle coordination", "User 09", "User 10", "g:Accepted"],
              ],
            ),
            btns("Review handover", "Escalate pending"),
          ),
          panel(
            "Selected handover",
            kv(["Case", "MS-26-1101"], ["Clearance", "Pending"], ["Receiving owner", "User 08"], ["Acknowledgement", "Required"]),
            btns("Send reminder"),
          ),
        ),
        bottom(
          150,
          panel("Handover lifecycle", note("Prepare → Transfer → Accept → Resume")),
          panel("Pending acknowledgement", note("Owner retains responsibility until acceptance.")),
          panel("Continuity rules", note("No change to legal or financial approval authority.")),
        ),
      ],
    },
  },
  {
    code: "AD-006",
    title: "Team Management & User Profiles",
    scope: ONLY,
    kpis: [k("18", "Assigned users"), k("16", "Active accounts"), k("02", "Inactive accounts"), k("08", "Staff on duty"), k("03", "Training pending"), k("01", "Access issues")],
    tabs: ["Team directory", "User profile & history"],
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
        ),
        follow(
          "Selected user",
          kv(
            ["Access level", "User"],
            ["HRMS ID", "EMP-007"],
            ["Reporting Admin", "Operations Admin"],
            ["Centre", "Ghaziabad"],
            ["MFA", "Verified · demo"],
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
    tabKpis: {
      "User profile & history": [k("04", "Open tasks"), k("01", "Overdue", "red"), k("08", "Completed this week"), k("91%", "SLA compliance"), k("01", "Training due"), k("03", "Cases linked")],
    },
    tabRows: {
      "User profile & history": [
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
            note("Coaching: review on 28 Nov · demo. Human review required."),
          ),
        ),
      ],
    },
  },
  {
    code: "AD-007",
    title: "Team Availability, Attendance & HRMS",
    scope: ONLY,
    kpis: [k("18", "Assigned users"), k("08", "Staff on duty"), k("12", "Volunteers available"), k("03", "Field teams"), k("24", "Pending tasks"), k("05", "Overdue tasks", "red")],
    tabs: ["Availability & workload", "Attendance & HRMS"],
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
        ),
        panel(
          "Capacity indicators",
          prog("Staff on duty · 8/10", 80),
          prog("Volunteers available · 12/18", 67),
          kv(["Assignment conflicts", "02 · demo"], ["Acknowledgement pending", "02"], ["Overdue tasks", "05"], ["On-duty tracking", "Consent required"]),
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
    tabKpis: {
      "Attendance & HRMS": [k("10", "Staff roster"), k("08", "On duty"), k("02", "Off duty"), k("01", "Check-in pending"), k("Connected", "HRMS sync"), k("02", "Attendance reviews")],
    },
    tabRows: {
      "Attendance & HRMS": [
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
              ["Last sync", "10:24 · demo"],
              ["Integration", "g:Connected"],
              ["Duty status", "Assigned roster only"],
              ["Correction authority", "HRMS approval"],
              ["Volunteer records", "Separate registry"],
            ),
            prog("On-duty staff", 80),
            btns("Refresh status"),
            kv(["Sync age", "Demo snapshot"], ["Late arrivals", "Policy review"], ["Source changes", "HRMS only"]),
          ),
        ),
        bottom(
          178,
          panel(
            "Attendance review",
            note("Missing check-in 01 · corrections 02"),
            note("Attendance week · demo", true),
            flow(["23", "P"], ["24", "P"], ["25", "P"], ["26", "P"], ["27", "Review"]),
          ),
          panel("Duty & handover", kv(["Shift change", "Authorised roster"], ["Handover", "Acknowledgement"], ["Off-duty tracking", "Disabled"])),
          panel("Data protection", kv(["Attendance source", "HRMS"], ["Private location", "Not collected"], ["Audit", "Mandatory"])),
        ),
      ],
    },
  },
  {
    code: "AD-008",
    title: "Sewa Requests & Digital Leads",
    scope: ONLY,
    kpis: [k("05", "Queue records · sample"), k("04", "Unassigned · scope"), k("02", "Emergency · scope", "red"), k("02", "Legal checks due"), k("03", "Missed callbacks"), k("06", "Replies due")],
    tabs: ["Request inbox", "Digital leads"],
    selected: 2,
    rows: [
      top(
        348,
        panel(
          "Request queue",
          F,
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
          kv(
            ["City", "Ghaziabad"],
            ["Service", "Free cremation support"],
            ["Legal clearance", "a:Pending"],
            ["Callback", "Due now"],
            ["Routing", "Human review"],
            ["Duplicate check", "Required"],
          ),
          info("Assigned scope only · Ghaziabad · demo snapshot"),
          btns("View details", "Review history"),
        ),
      ),
      bottom(
        150,
        panel("Intake by source · selected queue", kv(["WhatsApp / Website", "1 / 1"], ["Helpline / Volunteer app", "1 / 1"], ["Official email", "1"], ["Other channels", "0 in shown queue"])),
        panel("Priority & ageing", kv(["Emergency REQ-26-1104", "r:Due now"], ["Unassigned", "04"], ["Missed callbacks", "03 · demo"], ["Out of coverage", "Separate queue"])),
        panel("Routing exceptions", chips("Capture", "Deduplicate", "Verify", "Assign"), kv(["Failed AI routing", "Manual fallback"], ["Assignment", "Acknowledge"])),
      ),
    ],
    tabKpis: {
      "Digital leads": [k("06", "Website / ad / social contacts"), k("04", "Unassigned requests"), k("02", "Website"), k("02", "Social media"), k("02", "Google Ads"), k("06", "Chatbot chats today")],
    },
    tabRows: {
      "Digital leads": [
        top(
          348,
          panel(
            "Social & Website Lead Coordination",
            FA,
            tbl(
              ["Lead ID", "Source", "Intent", "Owner", "Status"],
              [
                ["LD-031", "Website", "Cremation support", "User 07", "b:Open"],
                ["LD-032", "Social media", "Eligibility", "Unassigned", "a:Pending"],
                ["LD-033", "Google Ads", "Free sewa enquiry", "User 08", "a:Review"],
                ["LD-034", "Website", "Service coverage", "User 09", "b:Open"],
                ["LD-035", "Social media", "General enquiry", "Unassigned", "a:Pending"],
                ["LD-036", "Google Ads", "Duplicate enquiry", "Admin 01", "a:Review"],
              ],
            ),
            btns("Review lead", "Convert to request", "Assign owner"),
          ),
          panel(
            "Selected lead",
            kv(["Source", "Website"], ["Campaign", "Demo outreach"], ["City", "Ghaziabad"], ["Eligibility", "Not yet verified"], ["Duplicate check", "Required"]),
            callout("Assigned scope only · demo snapshot. Sensitive actions require authorised review."),
            kv(["Duplicate review", "2 contacts excluded · demo"]),
          ),
        ),
        bottom(
          150,
          panel("Source mix · contacts", kv(["Website", "2"], ["Social", "2"], ["Google Ads", "2"])),
          panel("Duplicate & conversion", chips("Capture", "Deduplicate", "Verify", "Request"), kv(["Unique requests", "4 valid leads · demo"], ["Conversion", "2 verified / 4 valid · 50% demo"])),
          panel("Routing exceptions", kv(["Unassigned requests", "04 · all sources"], ["Out of coverage", "Review queue"], ["Campaign cost", "₹300 today · demo"])),
        ),
      ],
    },
  },
  {
    code: "AD-009",
    title: "Create & Update Sewa Request",
    scope: ONLY,
    kpis: [k("Draft", "Request state"), k("Free", "Service model"), k("01", "Active city"), k("03", "Beneficiary categories"), k("02", "Required reviews"), k("04", "Unassigned queue")],
    tabs: ["Request form", "Family details", "Consent", "History"],
    rows: [
      top(
        348,
        panel(
          "Request intake form",
          form(
            { label: "Requester", value: "Family 01 (demo)" },
            { label: "Mobile", value: "98XXXXXX01" },
            { label: "Beneficiary category", value: "EWS family", kind: "select", options: ["EWS family", "Unsupported person", "Unclaimed body"] },
            { label: "Service requested", value: "Cremation support" },
            { label: "Pickup area", value: "Ghaziabad" },
            { label: "Source", value: "Helpline" },
            { label: "Notes / instructions", value: "", kind: "textarea", wide: true },
          ),
          btns("Save draft", "Submit for verification", "Cancel"),
          info("EWS family: family contact, eligibility evidence and applicable death record."),
          obtns("Find existing contact", "AI auto-fill", "Voice input", "Resume draft"),
        ),
        panel(
          "Intake form · draft",
          kv(
            ["Request ID", "Generated on save"],
            ["Relationship", "Family representative"],
            ["Consent", "Pending confirmation"],
            ["Priority", "High"],
            ["Assigned centre", "Ghaziabad"],
            ["Owner", "a:Unassigned"],
          ),
          info("Assigned scope only · Ghaziabad · demo snapshot"),
          btns("View details", "Review history"),
        ),
      ),
      bottom(
        150,
        panel("Category-specific checklist", kv(["Family representative", "Confirm"], ["EWS eligibility", "Review"], ["Death record", "As applicable"])),
        panel("Consent & duplicate review", kv(["Purpose-specific consent", "Pending"], ["Potential duplicate", "Check before save"], ["Contact visibility", "Masked"]), btns("Review match")),
        panel("Save & routing", chips("Draft", "Validate", "Verify"), kv(["Mandatory fields", "Category based"], ["Legal clearance", "Before dispatch"])),
      ),
    ],
  },
  {
    code: "AD-010",
    title: "Verification & Legal Clearance",
    scope: ONLY,
    kpis: [k("02", "Pending legal checks"), k("04", "Unassigned requests"), k("02", "Emergency cases", "red"), k("04/05", "Documents reviewed"), k("Hold", "Dispatch gate", "orange"), k("01", "Active centre")],
    tabs: ["Eligibility & verification", "Legal documents & clearance"],
    rows: [
      top(
        348,
        panel(
          "Verification queue",
          FS,
          tbl(
            ["Request ID", "Category", "Eligibility", "Documents", "Legal status", "Owner"],
            [
              ["REQ-26-1100", "Unclaimed body", "a:Review", "4/5", "a:Pending", "USR-008"],
              ["REQ-26-1102", "EWS family", "a:Review", "2/3", "a:Pending", "—"],
              ["REQ-26-1103", "Unsupported person", "a:Pending", "1/3", "a:Pending", "—"],
              ["REQ-26-1104", "Unclaimed body", "a:Review", "0/5", "a:Pending", "—"],
            ],
          ),
          btns("Preview evidence", "Return for clarification", "Escalate"),
        ),
        follow(
          "Selected verification",
          kv(["Request", "REQ-26-1100"], ["Eligibility", "Under review"], ["Authority clearance", "a:Pending"], ["Document review", "4 of 5"], ["Final decision", "Not approved"], ["Dispatch", "r:Blocked"]),
          info("Assigned scope only · Ghaziabad · demo snapshot"),
          btns("View details", "Review history"),
          callout("Received, reviewed and verified are separate counts. Verification pending — no release."),
        ),
      ),
      bottom(
        150,
        panel("Evidence checklist · unclaimed body", kv(["Death record / authority", "Verified in demo"], ["Police release", "r:Missing"], ["Identity / handover", "Review as applicable"])),
        panel("Verification progress", prog("Documents received", 80, "4 / 5"), kv(["Eligibility", "Under review"], ["Final approval", "Blocked"])),
        panel("Decision workflow", chips("Eligibility", "Evidence", "Clearance", "Dispatch"), kv(["Emergency", "Human escalation"], ["Legal gate", "No override"]), obtns("Release dispatch")),
      ),
    ],
    tabKpis: {
      "Legal documents & clearance": [k("02", "Pending legal clearance"), k("01", "Authority review"), k("04", "Evidence reviewed"), k("01", "Missing document", "red"), k("Hold", "Dispatch status", "orange"), k("00", "Overrides allowed")],
    },
    tabRows: {
      "Legal documents & clearance": [
        top(
          348,
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
            doc("Death record · DEMO PREVIEW", ["Reference: REQ-26-1100", "Issuer: Hospital (illustrative)", "Received: 27 Nov · 10:02", "Personal fields: masked"], "g:Verified in demo"),
            kv(["Police release", "r:Not received"], ["Legal gate", "r:Blocked"]),
            btns("Open received document", "Review history"),
            callout("Received, reviewed and verified are separate counts. Verification pending — no release."),
          ),
        ),
        bottom(
          150,
          panel("Document handling", kv(["Upload scan", "Required"], ["Version / checksum", "Record"], ["Access", "Restricted"])),
          panel("Authority verification", kv(["Issuer identity", "Verify"], ["Official reference", "Required"], ["Independent review", "As applicable"])),
          panel("Dispatch restriction", chips("Receive", "Verify", "Approve"), alert("Dispatch disabled until all applicable mandatory legal gates pass."), obtns("Release dispatch")),
        ),
      ],
    },
  },
];
