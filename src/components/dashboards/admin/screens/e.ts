import { bottom, chips, days, doc, follow, k, kvd, meters, obtns, panel, tbl, top, btns } from "../dsl";
import type { Block, Screen } from "../types";

/** AD-041+ register filter: "Search <screen title>..." + Assigned scope. */
const fs = (title: string): Block => ({ t: "filter", search: true, all: "Assigned scope", placeholder: `Search ${title.toLowerCase()}...` });

/** AD-041 … AD-050 — donations, procurement, training, performance, recognition, MIS, complaints, SOPs, settings. */
export const screensE: Screen[] = [
  {
    code: "AD-041",
    title: "Donation & Donor Coordination",
    plain: true,
    kpis: [k("08", "Donations today"), k("₹24,000", "Received today"), k("02", "Receipts pending"), k("01", "Settlement review"), k("04", "Donor follow-ups"), k("00", "Cash accepted")],
    tabs: ["Donations", "Receipts", "Follow-ups", "Exceptions"],
    rows: [
      top(
        322,
        panel(
          "Donation & Donor Coordination",
          fs("Donation & Donor Coordination"),
          tbl(["Receipt ref", "Donor", "Amount", "Channel", "Status"], [
            ["DON-078", "Donor 01", "₹5,000", "UPI", "g:Verified"],
            ["DON-079", "Donor 02", "₹2,000", "Bank", "a:Pending"],
            ["DON-080", "Donor 03", "₹3,000", "Gateway", "a:Review"],
            ["DON-081", "Anonymous", "₹1,000", "UPI", "g:Verified"],
          ]),
          btns("Review receipt", "Assign follow-up", "Refer exception"),
        ),
        panel(
          "Selected record & controls",
          kvd(
            ["Donation controls", "Official payment channels only"],
            ["Receipt issue", "Finance authorised"],
            ["80G status", "Verify eligibility"],
            ["Donor contact", "Consent required"],
            ["Settlement", "Finance reconciliation"],
            ["Selected receipt", "DON-078 · verified"],
            ["Settlement age", "1 day"],
            ["Refund status", "No refund on selected record"],
            ["Month received", "View verified ledger"],
            ["Gateway reference", "Required on settlement"],
          ),
        ),
      ),
      bottom(
        185,
        panel(
          "Receipt preview",
          doc("NAMO GANGE TRUST · MOKSHA SEWA", ["SAMPLE RECEIPT — NOT VALID", "DON-078 · Donor 01 (masked)", "UPI · ₹5,000 · verified", "Receipt issuance subject to settlement and eligibility"]),
          obtns("View receipt history"),
        ),
        panel(
          "Settlement exceptions",
          kvd(
            ["Pending receipts", "02"],
            ["Settlement review", "01"],
            ["Ageing", "Bank timestamp required"],
            ["Refund / reversal", "Review history"],
            ["Oldest pending receipt", "2 days"],
            ["Refund history", "Finance review only"],
          ),
        ),
        panel(
          "Donor follow-up",
          kvd(["Follow-ups", "04"], ["Cash donations", "Not accepted"], ["80G", "Validate eligibility"], ["Export", "Scoped permission"], ["Receipt status filter", "Issued / pending / cancelled"], ["Payment channel", "UPI / bank / gateway"]),
        ),
      ),
    ],
  },
  {
    code: "AD-042",
    title: "Procurement & Expense Approval",
    plain: true,
    kpis: [k("02", "Purchase requests"), k("₹7,500", "Pending expense approvals", "orange"), k("01", "Duplicate review", "red"), k("02", "Low stock items", "red"), k("₹56,000", "Uncommitted budget"), k("01", "Escalation", "orange")],
    tabs: ["Requests", "Bills", "Budget checks", "History"],
    rows: [
      top(
        322,
        panel(
          "Procurement & Expense Approval",
          fs("Procurement & Expense Approval"),
          tbl(["Reference", "Item / purpose", "Amount", "Owner", "Status"], [
            ["PR-021", "Body covers", "₹2,500", "User 07", "a:Pending"],
            ["PR-022", "Sanitisation supplies", "₹1,500", "User 08", "a:Review"],
            ["APV-031", "Transport expense", "₹4,500", "Admin 01", "a:Pending"],
            ["APV-032", "Material expense", "₹3,000", "Admin 01", "a:Pending"],
          ]),
          btns("Review request", "Preview bill", "Escalate"),
        ),
        panel(
          "Selected record & controls",
          kvd(
            ["Approval checks", "Independent approver"],
            ["Budget availability", "Check before commit"],
            ["Invoice duplicate", "Review"],
            ["Payment release", "Separate authority"],
            ["Delegated limit", "₹5,000"],
            ["Selected claim", "₹4,500 · APV-031"],
            ["Budget gate", "Check before approval"],
            ["Duplicate invoice", "Pending review"],
            ["Approval authority", "Independent checker"],
          ),
        ),
      ),
      bottom(
        185,
        panel(
          "Budget commitments",
          meters(["Posted (₹000)", 100, "124"], ["Committed (₹000)", 16, "20"], ["Uncommitted (₹000)", 45, "56"]),
          kvd(["Approved FY budget", "₹2,00,000"], ["Uncommitted balance", "₹56,000"]),
        ),
        panel("Invoice viewer", doc("APV-031 · invoice review", ["No invoice supplied · Secure viewer required", "Claim: ₹4,500 · duplicate check pending"]), obtns("Open bill")),
        panel("Approval workflow", chips("Submit", "Verify", "Approve", "Release"), kvd(["Self approval", "Blocked"], ["Over limit", "Escalate"])),
      ),
    ],
  },
  {
    code: "AD-043",
    title: "Team Training Dashboard",
    plain: true,
    kpis: [k("18", "Assigned users"), k("15", "Training current"), k("03", "Training due"), k("02", "Upcoming assessments"), k("01", "Refresher due", "orange"), k("83%", "Current coverage")],
    tabs: ["Overview", "Learners", "Courses", "Calendar"],
    rows: [
      top(
        322,
        panel(
          "Team Training Dashboard",
          fs("Team Training Dashboard"),
          tbl(["Learner", "Course", "Due date", "Progress", "Status"], [
            ["User 07", "Legal clearance SOP", "28 Nov", "80%", "a:In progress"],
            ["User 08", "Family communication", "29 Nov", "100%", "g:Completed"],
            ["User 09", "Field safety", "30 Nov", "40%", "a:In progress"],
            ["User 10", "Data privacy", "30 Nov", "0%", "a:Pending"],
          ]),
          btns("Assign training", "View course", "Send reminder"),
        ),
        panel(
          "Selected record & controls",
          kvd(
            ["Training priorities", "Mandatory SOP first"],
            ["Staff training", "Separate roster"],
            ["Volunteer training", "App scope"],
            ["Refresher", "Expiry based"],
            ["Qualification", "Practical review"],
            ["Overdue learners", "01"],
            ["Next assessment", "28 Nov"],
            ["Qualification", "Separate from completion"],
            ["Training roster", "Staff / volunteers separately"],
          ),
        ),
      ),
      bottom(
        185,
        panel("Training coverage", meters(["Current", 100, "15"], ["Due", 20, "3"]), kvd(["Assigned learners", "18"], ["Coverage", "83%"])),
        panel(
          "Upcoming calendar",
          days(["27|Fri"], ["28|Sat", true], ["29|Sun", true], ["30|Mon", true]),
          kvd(["28 · Legal clearance", "Assessment"], ["29 · Family communication", "Course"], ["30 · Field safety / privacy", "Course"]),
        ),
        panel("Priority learning actions", kvd(["Assessments due", "02"], ["Training due", "03"], ["Practical verification", "Required"]), obtns("Assign course", "Review results")),
      ),
    ],
  },
  {
    code: "AD-044",
    title: "Training Assignment & Assessment",
    plain: true,
    kpis: [k("03", "Training due", "orange"), k("02", "Assessments due", "orange"), k("01", "Retest pending", "orange"), k("04", "Assigned courses", "purple"), k("02", "Practical reviews", "orange"), k("01", "Refresher due", "orange")],
    tabs: ["Assignments", "Assessment", "Certificates", "History"],
    rows: [
      top(
        322,
        panel(
          "Training Assignment & Assessment",
          fs("Training Assignment & Assessment"),
          tbl(["Learner", "Module", "Due", "Assessment", "Status"], [
            ["User 07", "Legal clearance", "28 Nov", "Practical", "a:Pending"],
            ["User 09", "Field safety", "30 Nov", "MCQ", "a:In progress"],
            ["VOL-007", "Sewa induction", "30 Nov", "Practical", "a:Review"],
            ["User 10", "Privacy", "30 Nov", "MCQ", "a:Pending"],
          ]),
          btns("Assign course", "Review assessment", "Request retest"),
        ),
        panel(
          "Selected record & controls",
          kvd(
            ["Assignment settings", "Approved course only"],
            ["Audience", "Assigned team"],
            ["Passing criteria", "Course policy"],
            ["Retest", "Authorised"],
            ["Certification", "Practical sign-off"],
            ["Expiry date", "From approved course policy"],
            ["Result detail", "Score + practical evidence"],
          ),
        ),
      ),
      bottom(
        185,
        panel(
          "Learner preview",
          doc("User 07 · Legal clearance", ["Due 28 Nov · Practical assessment", "Result: pending", "Certificate: not issued"]),
          kvd(["Prerequisite", "Verify before enrolment"], ["Attempt", "01"]),
        ),
        panel(
          "Assessment history",
          kvd(["Current attempt", "Pending practical"], ["Retest queue", "01"], ["Appeal", "Independent review"], ["Passing criteria", "Approved course"], ["Previous attempt", "No prior attempt"]),
        ),
        panel("Certification gate", chips("Learn", "Assess", "Verify", "Certify"), kvd(["Practical sign-off", "Required"], ["Expiry", "Policy based"], ["Certificate status", "Not issued"])),
      ),
    ],
  },
  {
    code: "AD-045",
    title: "Team Performance & Coaching",
    plain: true,
    kpis: [k("18", "Assigned users"), k("82%", "Task completion"), k("91%", "SLA compliance"), k("05", "Overdue tasks", "red"), k("03", "Training due", "orange"), k("02", "Open complaints", "red")],
    tabs: ["Performance", "Workload", "Quality", "Coaching"],
    rows: [
      top(
        322,
        panel(
          "Team Performance & Coaching",
          fs("Team Performance & Coaching"),
          tbl(["User", "Open tasks", "Completion", "SLA", "Review"], [
            ["User 07", "4", "85%", "91%", "g:On track"],
            ["User 08", "3", "90%", "95%", "g:On track"],
            ["User 09", "5", "70%", "82%", "a:Review"],
            ["User 10", "2", "80%", "90%", "a:Review"],
          ]),
          btns("Review performance", "Create coaching plan", "View history"),
        ),
        panel(
          "Selected record & controls",
          kvd(
            ["Review context", "Task complexity"],
            ["Quality evidence", "Verified only"],
            ["Coaching", "Human review"],
            ["Complaints", "Verified records"],
            ["AI score", "Advisory only"],
            ["Period", "This week"],
            ["Denominator", "Completed / assigned due tasks"],
            ["Next coaching review", "30 Nov"],
            ["Prior week comparison", "Await verified historical data"],
          ),
        ),
      ),
      bottom(
        185,
        panel("Task completion · selected users", meters(["User 07", 85, "85"], ["User 08", 90, "90"], ["User 09", 70, "70"], ["User 10", 80, "80"])),
        panel("SLA compliance · selected users", meters(["User 07", 91, "91"], ["User 08", 95, "95"], ["User 09", 82, "82"], ["User 10", 90, "90"])),
        panel("Coaching timeline", kvd(["Review", "Discuss evidence"], ["Plan", "Agree improvement"], ["30 Nov", "Next review"], ["AI score", "Advisory only"]), obtns("Coaching history")),
      ),
    ],
  },
  {
    code: "AD-046",
    title: "Sewa Excellence & Recognition",
    plain: true,
    kpis: [k("02", "Pending nominations"), k("01", "Review due"), k("03", "Service milestones"), k("—", "Approved recognition", "orange"), k("—", "Certificates issued", "orange"), k("—", "Verified sewa hours")],
    tabs: ["Contribution", "Nominations", "Milestones", "History"],
    rows: [
      top(
        322,
        panel(
          "Sewa Excellence & Recognition",
          fs("Sewa Excellence & Recognition"),
          tbl(["Reference", "Member", "Recognition", "Evidence", "Status"], [
            ["REC-021", "VOL-007", "Service milestone", "24 hours", "a:Review"],
            ["REC-022", "User 08", "Compassion in service", "Verified feedback", "a:Pending"],
            ["REC-023", "Field Team 01", "Team excellence", "Case review", "a:Draft"],
            ["REC-024", "VOL-012", "Sewa contribution", "Duty log", "g:Verified"],
          ]),
          btns("Nominate", "Preview certificate", "Submit review"),
        ),
        panel(
          "Selected record & controls",
          kvd(
            ["Recognition criteria", "Verified contribution"],
            ["Family feedback", "Optional"],
            ["Privacy", "Consent before publicity"],
            ["Approval", "Authorised reviewer"],
            ["Certificate", "Approved template"],
            ["Selected nomination", "REC-021 · review"],
            ["Publicity consent", "Not recorded · do not publish"],
          ),
        ),
      ),
      bottom(
        185,
        panel("Contribution timeline", kvd(["VOL-007", "24 verified hours"], ["User 08", "Compassion review"], ["Field Team 01", "Team nomination"], ["VOL-012", "Duty log verified"])),
        panel("Appreciation preview", doc("NAMO GANGE TRUST · MOKSHA SEWA", ["Certificate of Appreciation", "Demo Volunteer 07", "Service milestone · Draft / not issued"])),
        panel("Nomination controls", chips("Nominate", "Verify", "Review", "Recognise"), kvd(["Publicity", "Consent required"], ["Pending", "02"])),
      ),
    ],
  },
  {
    code: "AD-047",
    title: "Department Reports & MIS",
    plain: true,
    kpis: [k("12", "Active cases"), k("34", "Completed cases"), k("24", "Pending tasks"), k("05", "Overdue tasks", "red"), k("91%", "SLA compliance"), k("06", "Pending replies", "orange")],
    tabs: ["Operations", "Team", "Finance", "Communication", "Saved reports"],
    rows: [
      top(
        322,
        panel(
          "Department Reports & MIS",
          fs("Department Reports & MIS"),
          tbl(["Report", "Period", "Scope", "Updated", "Status"], [
            ["Sewa case summary", "This month", "Ghaziabad", "10:24", "g:Ready"],
            ["Task ageing", "Today", "Assigned team", "10:24", "g:Ready"],
            ["Expense summary", "FY 26–27", "Department", "10:20", "g:Ready"],
            ["Communication SLA", "Today", "Assigned channels", "10:18", "a:Review"],
          ]),
          btns("Preview report", "Save filter", "Request export"),
        ),
        follow(
          "Selected record & controls",
          kvd(
            ["Report controls", "Assigned scope only"],
            ["Period", "Configurable"],
            ["Sensitive fields", "Masked"],
            ["Export", "Permission required"],
            ["Data freshness", "Show timestamp"],
            ["Date range", "01–27 Nov 2026"],
            ["Refresh", "Request verified dataset"],
            ["Period options", "Today / week / month / FY / custom"],
            ["Output", "Table / chart / PDF / Excel"],
            ["Delivery history", "Sent / failed · authorised"],
          ),
        ),
      ),
      { h: 185, w: [450, 330, 330], panels: [
        panel("Report preview · case summary", meters(["Active", 35, "12"], ["Completed", 100, "34"])),
        panel("Saved filters & favourites", kvd(["Sewa case summary", "This month"], ["Task ageing", "Today"], ["Expense summary", "FY 26–27"]), obtns("Save filter", "Favourite")),
        panel("Delivery & freshness", kvd(["Last update", "10:24"], ["Sensitive fields", "Masked"], ["Recipients", "Approved only"], ["Export", "Authorisation required"])),
      ] },
    ],
  },
  {
    code: "AD-048",
    title: "Complaints & Grievance Resolution",
    plain: true,
    kpis: [k("02", "Open complaints", "red"), k("01", "Urgent", "red"), k("01", "Awaiting response", "orange"), k("00", "Overdue", "green"), k("01", "Review due", "orange"), k("02", "Resolved this month", "green")],
    tabs: ["Open", "Assigned", "Confidential", "Resolved"],
    rows: [
      top(
        322,
        panel(
          "Complaints & Grievance Resolution",
          fs("Complaints & Grievance Resolution"),
          tbl(["Complaint ID", "Category", "Owner", "Age", "Status"], [
            ["GR-021", "Response delay", "Admin 01", "2h", "a:Open"],
            ["GR-022", "Service coordination", "Admin 01", "1h", "a:Review"],
            ["GR-019", "Communication", "Admin 01", "Closed", "g:Resolved"],
            ["GR-020", "Follow-up", "Admin 01", "Closed", "g:Resolved"],
          ]),
          btns("Assign complaint", "Record response", "Escalate"),
        ),
        panel(
          "Selected record & controls",
          kvd(
            ["Complaint controls", "Confidential access"],
            ["SLA", "Approved policy"],
            ["Evidence", "Restricted"],
            ["Appeal", "Escalate independently"],
            ["Feedback", "Optional"],
            ["Selected complaint", "GR-021 · urgent"],
            ["Response remaining", "00:30"],
            ["Conflict check", "Independent reviewer required"],
            ["Evidence", "Restricted case drill-down"],
            ["Response history", "View authorised timeline"],
          ),
        ),
      ),
      bottom(
        185,
        panel("Complaint ageing · open", meters(["GR-021 (hours)", 100, "2"], ["GR-022 (hours)", 50, "1"])),
        panel("Response & escalation", kvd(["Urgent", "01"], ["Awaiting response", "01"], ["Overdue", "00"], ["Countdown", "Server SLA"]), obtns("Review queue")),
        panel("Confidential cases", kvd(["Visibility", "Restricted"], ["Conflict of interest", "Independent reviewer"], ["Closure", "Evidence required"], ["Appeal", "Escalate independently"])),
      ),
    ],
  },
  {
    code: "AD-049",
    title: "Knowledge Base & SOP Workspace",
    plain: true,
    kpis: [k("12", "Approved SOPs"), k("02", "Review due", "orange"), k("01", "Change request", "orange"), k("00", "Expired in use", "green"), k("03", "Saved guides"), k("02", "Training links", "green")],
    tabs: ["SOP library", "Saved guides", "Change requests", "History"],
    rows: [
      top(
        322,
        panel(
          "Knowledge Base & SOP Workspace",
          fs("Knowledge Base & SOP Workspace"),
          tbl(["SOP ID", "Title", "Version", "Review date", "Status"], [
            ["SOP-004", "Legal clearance", "v1.2", "30 Nov", "g:Approved"],
            ["SOP-005", "Field safety", "v1.1", "30 Nov", "a:Review"],
            ["SOP-006", "Family communication", "v1.0", "15 Dec", "g:Approved"],
            ["SOP-007", "Case closure", "v1.0", "15 Dec", "g:Approved"],
          ]),
          btns("Open SOP", "Request change", "Link training"),
        ),
        panel(
          "Selected record & controls",
          kvd(
            ["Selected SOP", "Legal clearance"],
            ["Source", "Approved knowledge base"],
            ["AI index", "Approved versions only"],
            ["Preview", "Read only"],
            ["Publish", "Super Admin"],
            ["Index freshness", "10:24"],
            ["Review due", "30 Nov"],
            ["Version access", "Read-only archive"],
            ["Document search", "Approved versions only"],
            ["Source reference", "SOP ID + version"],
          ),
        ),
      ),
      bottom(
        185,
        panel(
          "SOP viewer · sample excerpt",
          doc("SOP-004 · v1.2 — sample excerpt", [
            "Legal clearance checklist",
            "1. Verify applicable authority documents.",
            "2. Record clearance status and reviewer.",
            "3. Block dispatch until required clearance.",
            "Illustrative text, not the signed SOP.",
          ]),
        ),
        panel("Version comparison", kvd(["Current", "v1.2 · approved"], ["Previous", "Open archived version"], ["Change request", "01"], ["Review due", "30 Nov"])),
        panel("Knowledge safeguards", kvd(["AI indexing", "Approved only"], ["Expired in use", "00"], ["Publish", "Super Admin"], ["Source links", "Required"]), obtns("Compare versions")),
      ),
    ],
  },
  {
    code: "AD-050",
    title: "Admin Settings & Support",
    plain: true,
    kpis: [k("01", "Open support ticket"), k("01", "Access request", "orange"), k("00", "Critical issues", "green"), k("02", "Notification rules", "purple"), k("Active", "MFA policy"), k("10:24", "Last sync", "green")],
    tabs: ["Preferences", "Access requests", "Support", "Activity"],
    rows: [
      top(
        322,
        panel(
          "Admin Settings & Support",
          fs("Admin Settings & Support"),
          tbl(["Reference", "Setting / issue", "Owner", "Updated", "Status"], [
            ["SUP-021", "WhatsApp sync delay", "Technical team", "10:18", "a:Open"],
            ["ACC-021", "Team access request", "Super Admin", "10:20", "a:Pending"],
            ["SET-001", "Language preference", "Admin 01", "10:24", "g:Active"],
            ["SET-002", "Notification preference", "Admin 01", "10:24", "g:Active"],
          ]),
          btns("Raise ticket", "Request access", "Save preferences"),
        ),
        panel(
          "Selected record & controls",
          kvd(
            ["Account controls", "Mobile + password + OTP"],
            ["Scope", "Assigned departments"],
            ["Session", "Manage own sessions"],
            ["Global settings", "Restricted"],
            ["Emergency alerts", "Cannot mute"],
            ["Ticket severity", "Medium"],
            ["Support scope", "No unrestricted vendor access"],
            ["Session revocation", "Own sessions only"],
            ["Resolution SLA", "Approved support policy"],
            ["Evidence", "Attach screenshot securely"],
            ["Closure", "Requester confirmation"],
          ),
        ),
      ),
      bottom(
        185,
        panel("Personal preferences", kvd(["Language", "Hindi / English"], ["Notifications", "Scoped preferences"], ["Emergency alerts", "Cannot mute"], ["Session", "Manage own only"])),
        panel("Technical ticket timeline", kvd(["10:18", "SUP-021 raised"], ["Status", "Open · WhatsApp delay"], ["Owner", "Technical team"], ["Next action", "Review sync"])),
        panel("Access & support", kvd(["Access request", "ACC-021 pending"], ["Vendor access", "Time limited"], ["MFA", "Mandatory"], ["Global settings", "Restricted"]), obtns("View ticket history")),
      ),
    ],
  },
];
