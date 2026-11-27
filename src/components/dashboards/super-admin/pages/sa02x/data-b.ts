/** SA-026 … SA-030 — demo content (illustrative only; no production data). */

import {
  AlertTriangle,
  BarChart3,
  Clock,
  FileText,
  Inbox,
  Link2,
  Mail,
  MailCheck,
  MessageCircle,
  MessageSquareText,
  MessagesSquare,
  Network,
  PhoneMissed,
  Reply,
  Settings2,
  UserX,
  UsersRound,
  IndianRupee,
  Send,
  PenLine,
  RefreshCw,
  CheckCheck,
  Workflow,
} from "lucide-react";
import type { Action, Screen } from "./types";

const B = "/dashboard/super-admin/communication-hub";
const a = (label: string, notice: string, confirm?: string): Action => ({ label, notice, confirm });

export const sa026: Screen = {
  id: "SA-026",
  title: "Unified Communication Dashboard",
  active: "communication-hub",
  href: `${B}/unified-dashboard`,
  icon: MessagesSquare,
  kpis: [
    { tone: "blue", icon: Inbox, value: "52", label: "Incoming today" },
    { tone: "green", icon: Reply, value: "18", label: "Pending replies" },
    { tone: "orange", icon: PhoneMissed, value: "03", label: "Missed callbacks" },
    { tone: "purple", icon: UserX, value: "04", label: "Unassigned" },
    { tone: "sky", icon: AlertTriangle, value: "01", label: "Delayed channels" },
    { tone: "green", icon: MessageSquareText, value: "01", label: "Outgoing SMS failed" },
  ],
  tabs: ["Unified inbox", "Channel health", "Assignments", "Templates", "Reports"],
  main: {
    title: "Channel activity · today",
    table: {
      cols: ["Channel", "Received", "Pending", "Status", "Action"],
      pill: [3, 4],
      rows: [
        ["AI inbound calls", "12", "3", "Connected", "Open"],
        ["Official email", "8", "4", "Connected", "Open"],
        ["WhatsApp", "16", "6", "Delayed", "Open"],
        ["AI chatbot", "6", "1", "Connected", "Open"],
        ["Website / apps", "6", "2", "Connected", "Open"],
        ["Social / Google Ads", "4", "2", "Connected", "Open"],
      ],
    },
    actions: [
      a("Assign conversation", "Conversation assigned to an available authorised owner; sensitive or urgent requests escalate to a human (demo)."),
      a("Open inbox", "Unified inbox opened — contact events are separated from unique requests (demo)."),
      a("Review failures", "Channel failures and retries listed for review (demo)."),
    ],
  },
  tabViews: [
    {
      title: "Channel health",
      table: {
        cols: ["Channel", "Last sync", "Failures", "Retry", "Status"],
        pill: [4],
        rows: [
          ["AI inbound calls", "10:24 AM", "0", "—", "Connected"],
          ["Official email", "10:24 AM", "0", "—", "Connected"],
          ["WhatsApp", "10:18 AM", "1", "Controlled", "Delayed"],
          ["Outgoing SMS", "10:20 AM", "1", "Queued", "Review"],
        ],
      },
    },
    {
      title: "Conversation assignments",
      table: {
        cols: ["Ref", "Channel", "Owner", "Unread", "Unresolved", "Status"],
        pill: [5],
        rows: [
          ["COM-001", "AI inbound", "Admin 01", "Yes", "Yes", "Open"],
          ["COM-002", "WhatsApp", "—", "Yes", "Yes", "Unassigned"],
          ["COM-003", "Email", "User 07", "No", "Yes", "Pending"],
        ],
      },
    },
    {
      title: "Approved templates",
      table: {
        cols: ["Template", "Channel", "Owner", "Approval", "Status"],
        pill: [4],
        rows: [
          ["Acknowledgement", "SMS", "Admin 03", "Approved", "Active"],
          ["Document request", "WhatsApp", "Admin 03", "Approved", "Active"],
          ["Callback reminder", "SMS", "Admin 03", "Pending", "Pending"],
        ],
      },
    },
    {
      title: "Communication reports",
      table: {
        cols: ["Report", "Period", "Contact events", "Unique requests", "Status"],
        pill: [4],
        rows: [
          ["Channel summary", "Today", "52", "31 · demo", "Ready"],
          ["Response time", "This week", "310", "184 · demo", "Ready"],
          ["Failed delivery", "Today", "2", "—", "Review"],
        ],
      },
    },
  ],
  side: {
    kind: "kv",
    title: "Communication control",
    rows: [
      ["AI outbound callbacks", "03 due"],
      ["Outgoing SMS", "01 failed"],
      ["WhatsApp sync", "*Delayed"],
      ["Email delivery", "*Connected"],
      ["Auto-reply", "Approval-based"],
      ["Manual fallback", "*Available"],
    ],
    bars: [
      { label: "Assigned conversations", pct: 92 },
      { label: "Reply within target", pct: 85 },
    ],
  },
  bottom: {
    title: "Priority conversation queue",
    table: {
      cols: ["Ref", "Channel", "Subject", "Owner", "Status"],
      pill: [4],
      rows: [
        ["COM-001", "AI inbound", "Urgent cremation assistance", "Admin 01", "Open"],
        ["COM-002", "WhatsApp", "Eligibility clarification", "*Unassigned", "Unassigned"],
        ["COM-003", "Email", "Supporting document received", "User 07", "Pending"],
      ],
    },
  },
};

export const sa027: Screen = {
  id: "SA-027",
  title: "Official Email Workspace",
  active: "communication-hub",
  href: `${B}/email-workspace`,
  icon: Mail,
  kpis: [
    { tone: "blue", icon: Inbox, value: "08", label: "Inbox today" },
    { tone: "green", icon: Mail, value: "04", label: "Unread" },
    { tone: "orange", icon: FileText, value: "03", label: "Assigned to me" },
    { tone: "purple", icon: PenLine, value: "02", label: "Drafts" },
    { tone: "sky", icon: Reply, value: "04", label: "Awaiting reply" },
    { tone: "green", icon: AlertTriangle, value: "01", label: "Delivery failures" },
  ],
  tabs: ["Inbox", "Assigned", "Sent", "Drafts", "Archive"],
  main: {
    title: "Official inbox · shared workspace",
    table: {
      cols: ["From", "Subject", "Case / request", "Time", "Status"],
      pill: [4],
      rows: [
        ["Family 01", "Request for free cremation support", "MS-26-1101", "10:24 AM", "Open"],
        ["Hospital desk", "Supporting document received", "MS-26-1100", "10:17 AM", "Pending"],
        ["Volunteer 04", "Task acknowledgement", "TASK-026", "09:56 AM", "Resolved"],
        ["Donor 01", "Donation receipt enquiry", "DON-078", "09:32 AM", "Pending"],
        ["Operations team", "Case verification update", "MS-26-1099", "09:18 AM", "Resolved"],
      ],
    },
    actions: [
      a("Compose email", "Compose window opened — attachments are scanned and sensitive AI drafts need human review (demo)."),
      a("Assign", "Thread assigned to an authorised user; assignment recorded (demo)."),
      a("Search records", "Search across permitted official threads (demo)."),
    ],
  },
  tabViews: [
    {
      title: "Assigned threads",
      table: {
        cols: ["From", "Subject", "Case / request", "Assigned to", "Status"],
        pill: [4],
        rows: [
          ["Family 01", "Request for free cremation support", "MS-26-1101", "User 07", "Open"],
          ["Hospital desk", "Supporting document received", "MS-26-1100", "User 08", "Pending"],
          ["Donor 01", "Donation receipt enquiry", "DON-078", "Admin 02", "Pending"],
        ],
      },
    },
    {
      title: "Sent",
      table: {
        cols: ["To", "Subject", "Case / request", "Time", "Delivery"],
        pill: [4],
        rows: [
          ["Family 01", "Re: Request for free cremation support", "MS-26-1101", "10:30 AM", "Connected"],
          ["Hospital desk", "Re: Supporting document received", "MS-26-1100", "10:20 AM", "Connected"],
          ["Donor 01", "Donation receipt", "DON-077", "09:10 AM", "Failed"],
        ],
      },
    },
    {
      title: "Drafts · human review before sending",
      table: {
        cols: ["To", "Subject", "Created by", "Last edited", "Status"],
        pill: [4],
        rows: [
          ["Family 02", "Eligibility guidance", "AI draft", "10:05 AM", "Review"],
          ["Hospital desk", "Document checklist", "User 07", "09:40 AM", "Draft"],
        ],
      },
    },
    {
      title: "Archive · retained by policy",
      table: {
        cols: ["From", "Subject", "Case / request", "Archived", "Retention"],
        rows: [
          ["Operations team", "Case closure confirmation", "MS-26-1090", "22 Nov", "Policy governed"],
          ["Volunteer 02", "Service hours", "TASK-019", "21 Nov", "Policy governed"],
        ],
      },
    },
  ],
  side: {
    kind: "thread",
    title: "Selected thread · $2",
    rows: [
      ["From", "$0 · masked"],
      ["Mailbox", "Operations · official"],
      ["Assigned to", "User 07"],
      ["Received", "24 Nov · $3"],
    ],
    bubbles: [
      ["in", "Please guide us regarding eligibility for free last-rites assistance."],
      ["out", "We will review the request and guide you through the next steps."],
    ],
    actions: [
      a("Reply", "Reply window opened (demo)."),
      a("Forward", "Forward window opened (demo)."),
      a("Link case", "Thread linked to the selected case (demo)."),
    ],
  },
  bottom: {
    title: "Thread controls & record history",
    rows: [
      ["Attachments", "Restricted preview / scan"],
      ["AI draft", "Review before sending"],
      ["Status", "*$4"],
      ["Audit", "All official messages retained by policy"],
    ],
  },
};

export const sa028: Screen = {
  id: "SA-028",
  title: "Email Account & Assignment Management",
  active: "communication-hub",
  href: `${B}/email-accounts`,
  icon: MailCheck,
  kpis: [
    { tone: "blue", icon: Mail, value: "04", label: "Official mailboxes" },
    { tone: "green", icon: CheckCheck, value: "04", label: "Connected" },
    { tone: "orange", icon: RefreshCw, value: "00", label: "Sync delayed" },
    { tone: "purple", icon: Inbox, value: "04", label: "Unassigned threads" },
    { tone: "sky", icon: Workflow, value: "06", label: "Active routing rules" },
    { tone: "green", icon: AlertTriangle, value: "01", label: "Delivery failures" },
  ],
  tabs: ["Accounts", "Assignment rules", "Access mapping", "Sync & delivery", "Audit history"],
  main: {
    title: "Official mailbox accounts",
    table: {
      cols: ["Mailbox", "Purpose", "Owner", "Sync", "Status"],
      pill: [4],
      rows: [
        ["Operations mailbox", "Sewa requests", "Admin 01", "10:24 AM", "Connected"],
        ["Finance mailbox", "Donations & receipts", "Admin 02", "10:22 AM", "Connected"],
        ["Volunteer mailbox", "Volunteer coordination", "Admin 03", "10:20 AM", "Connected"],
        ["Support mailbox", "General enquiries", "Admin 04", "10:18 AM", "Connected"],
      ],
    },
    actions: [
      a("Connect mailbox", "Connection uses secure provider authentication; credentials are never shown (demo)."),
      a("Manage assignments", "Assignment rules opened (demo)."),
      a("Test connection", "Connection test completed — token and sync healthy (demo)."),
    ],
  },
  tabViews: [
    {
      title: "Assignment rules",
      table: {
        cols: ["Rule", "Mailbox", "Condition", "Mode", "Status"],
        pill: [4],
        rows: [
          ["RULE-01", "Operations mailbox", "New incoming request", "Approval-based", "Active"],
          ["RULE-02", "Finance mailbox", "Receipt enquiry", "Automatic", "Active"],
          ["RULE-03", "Volunteer mailbox", "Volunteer task", "Manual", "Active"],
          ["RULE-04", "Support mailbox", "General enquiry", "Automatic", "Active"],
        ],
      },
    },
    {
      title: "Access mapping · from HRMS roster",
      table: {
        cols: ["Mailbox", "Owner", "Delegate", "Access review", "Status"],
        pill: [4],
        rows: [
          ["Operations mailbox", "Admin 01", "User 07", "Monthly", "Verified"],
          ["Finance mailbox", "Admin 02", "User 08", "Monthly", "Verified"],
          ["Volunteer mailbox", "Admin 03", "User 09", "Monthly", "Verified"],
          ["Support mailbox", "Admin 04", "User 10", "Monthly", "Verified"],
        ],
      },
    },
    {
      title: "Sync & delivery",
      table: {
        cols: ["Mailbox", "Token expiry", "Last sync", "Delivery failures", "Status"],
        pill: [4],
        rows: [
          ["Operations mailbox", "Review before expiry", "10:24 AM", "0", "Connected"],
          ["Finance mailbox", "Valid", "10:22 AM", "1", "Review"],
          ["Volunteer mailbox", "Valid", "10:20 AM", "0", "Connected"],
          ["Support mailbox", "Valid", "10:18 AM", "0", "Connected"],
        ],
      },
    },
    {
      title: "Audit history",
      table: {
        cols: ["Time", "Actor", "Event", "Mailbox", "Result"],
        pill: [4],
        rows: [
          ["10:24 AM", "System", "Sync completed", "Operations mailbox", "Completed"],
          ["09:50 AM", "Admin 01", "Assignment rule updated", "Operations mailbox", "Approved"],
          ["09:12 AM", "Admin 02", "Delivery retry", "Finance mailbox", "Review"],
        ],
      },
    },
  ],
  side: {
    kind: "fields",
    title: "Selected assignment rule",
    fields: [
      ["Mailbox", "Operations mailbox"],
      ["Condition", "New incoming request"],
      ["Assign to", "Available authorised User"],
      ["Mode", "Approval-based"],
    ],
    rows: [
      ["Fallback", "Reporting Admin"],
      ["Credential storage", "Encrypted vault"],
      ["Last sync", "10:24 AM"],
    ],
    actions: [
      a("Save rule", "Rule saved as a new version; change recorded in the audit trail (demo)."),
      a("Test routing", "Routing test completed — thread would go to an available authorised user (demo)."),
    ],
  },
  bottom: {
    title: "Routing & failure handling",
    steps: ["Receive", "Classify", "Assign", "Acknowledge", "Escalate"],
    rows: [
      ["Failed delivery", "01 · review"],
      ["Retry policy", "Controlled & logged"],
    ],
  },
};

export const sa029: Screen = {
  id: "SA-029",
  title: "WhatsApp Business Desk",
  active: "communication-hub",
  href: `${B}/whatsapp-desk`,
  icon: MessageCircle,
  kpis: [
    { tone: "blue", icon: MessageCircle, value: "16", label: "Incoming chats" },
    { tone: "green", icon: Reply, value: "06", label: "Pending replies" },
    { tone: "orange", icon: UserX, value: "02", label: "Unassigned" },
    { tone: "purple", icon: CheckCheck, value: "10", label: "Resolved today" },
    { tone: "sky", icon: Link2, value: "Delayed", label: "Sync status" },
    { tone: "green", icon: Send, value: "01", label: "Failed sends" },
  ],
  tabs: ["Chat inbox", "Assigned chats", "Templates", "Media", "Delivery status"],
  main: {
    title: "Official WhatsApp inbox",
    table: {
      cols: ["Conversation", "Linked record", "Assigned to", "Last message", "Status"],
      pill: [4],
      rows: [
        ["WA-001 · Family 01", "MS-26-1101", "User 07", "10:24 AM", "Open"],
        ["WA-002 · Family 02", "MS-26-1100", "*Unassigned", "10:18 AM", "Unassigned"],
        ["WA-003 · Volunteer 04", "TASK-026", "User 09", "09:56 AM", "Resolved"],
        ["WA-004 · Family 03", "MS-26-1099", "User 08", "09:42 AM", "Pending"],
        ["WA-005 · Donor 01", "DON-078", "User 10", "09:30 AM", "Resolved"],
      ],
    },
    actions: [
      a("Open chat", "Chat opened — contact details are masked and the chat is linked to its record (demo)."),
      a("Assign conversation", "Conversation assigned; assignment recorded in the audit trail (demo)."),
      a("New message", "New message uses an approved template inside the provider message window (demo)."),
    ],
  },
  tabViews: [
    {
      title: "Assigned chats",
      table: {
        cols: ["Conversation", "Linked record", "Owner", "Last message", "Status"],
        pill: [4],
        rows: [
          ["WA-001 · Family 01", "MS-26-1101", "User 07", "10:24 AM", "Open"],
          ["WA-003 · Volunteer 04", "TASK-026", "User 09", "09:56 AM", "Resolved"],
          ["WA-004 · Family 03", "MS-26-1099", "User 08", "09:42 AM", "Pending"],
        ],
      },
    },
    {
      title: "Approved templates",
      table: {
        cols: ["Template", "Language", "Provider approval", "Owner", "Status"],
        pill: [4],
        rows: [
          ["Acknowledgement", "English / Hindi", "Approved", "Admin 03", "Active"],
          ["Document request", "English / Hindi", "Approved", "Admin 03", "Active"],
          ["Follow-up", "English / Hindi", "Pending", "Admin 03", "Pending"],
        ],
      },
    },
    {
      title: "Media · secured",
      table: {
        cols: ["Media ID", "Conversation", "Type", "Scan", "Status"],
        pill: [3, 4],
        rows: [
          ["MED-021", "WA-001", "Document", "Verified", "Review"],
          ["MED-020", "WA-004", "Image", "Verified", "Active"],
        ],
      },
    },
    {
      title: "Delivery status",
      table: {
        cols: ["Message", "Conversation", "Sent", "Delivered / read", "Status"],
        pill: [4],
        rows: [
          ["MSG-310", "WA-001", "10:24 AM", "Delivered", "Completed"],
          ["MSG-309", "WA-002", "10:18 AM", "Not delivered", "Failed"],
          ["MSG-308", "WA-004", "09:42 AM", "Read", "Completed"],
        ],
      },
    },
  ],
  side: {
    kind: "thread",
    title: "Conversation · $@0",
    rows: [
      ["Contact", "Family 01 · 98XXXXXX01"],
      ["Case", "$1"],
      ["Owner", "$2"],
      ["Consent / window", "Check before sending"],
    ],
    bubbles: [
      ["in", "We need assistance for the final rites."],
      ["out", "We are here to guide you. May we confirm the location and required documents?"],
    ],
    input: "Type a reply...",
    actions: [
      a("Send reply", "Reply queued — delivery and read status will be tracked (demo)."),
      a("Use template", "Approved template list opened (demo)."),
    ],
  },
  bottom: {
    title: "Channel controls",
    rows: [
      ["WhatsApp Business API", "*Delayed"],
      ["Last sync", "10:18 AM · demo"],
      ["Failed sends", "01 · retry review"],
      ["AI reply", "Human review for sensitive requests"],
    ],
  },
};

export const sa030: Screen = {
  id: "SA-030",
  title: "WhatsApp Assignment & Chat Monitoring",
  active: "communication-hub",
  href: `${B}/whatsapp-monitoring`,
  icon: UsersRound,
  kpis: [
    { tone: "blue", icon: Network, value: "06", label: "Open chats" },
    { tone: "green", icon: MessageSquareText, value: "04", label: "Assigned" },
    { tone: "orange", icon: Settings2, value: "02", label: "Unassigned" },
    { tone: "purple", icon: Clock, value: "02", label: "Overdue replies" },
    { tone: "sky", icon: BarChart3, value: "01", label: "Handover pending" },
    { tone: "green", icon: IndianRupee, value: "Delayed", label: "Sync status" },
  ],
  tabs: ["Assignment queue", "Team monitoring", "Chat audit", "Routing rules", "Reports"],
  main: {
    title: "Conversation assignment & monitoring",
    table: {
      cols: ["Chat ID", "Linked record", "Assigned user", "Age", "SLA", "Status"],
      pill: [5],
      rows: [
        ["WA-001", "MS-26-1101", "User 07", "12 min", "Within target", "Open"],
        ["WA-002", "MS-26-1100", "*Unassigned", "18 min", "*Review", "Unassigned"],
        ["WA-004", "MS-26-1099", "User 08", "32 min", "Breached", "Overdue"],
        ["WA-006", "MS-26-1098", "User 09", "25 min", "Breached", "Overdue"],
        ["WA-007", "MS-26-1097", "*Unassigned", "8 min", "Within target", "Unassigned"],
        ["WA-008", "General enquiry", "User 10", "5 min", "Within target", "Open"],
      ],
    },
    actions: [
      a("Assign", "Chat assigned; simultaneous conflicting replies are prevented (demo)."),
      a("Reassign", "Reassignment recorded with owner, time, reason and message ID (demo).", "Reassign the selected chat?"),
      a("Escalate", "Escalated to the responsible admin (demo).", "Escalate the selected chat?"),
    ],
  },
  tabViews: [
    {
      title: "Team monitoring · scoped",
      table: {
        cols: ["Team member", "Open", "Overdue", "Avg response", "Scope", "Status"],
        pill: [5],
        rows: [
          ["User 07", "1", "0", "6 min · demo", "Operations", "Active"],
          ["User 08", "1", "1", "21 min · demo", "Operations", "Review"],
          ["User 09", "1", "1", "17 min · demo", "Volunteers", "Review"],
          ["User 10", "1", "0", "4 min · demo", "Support", "Active"],
        ],
      },
    },
    {
      title: "Chat audit · official chats only",
      table: {
        cols: ["Time", "Chat ID", "Event", "By", "Result"],
        pill: [4],
        rows: [
          ["10:20 AM", "WA-002", "Opened for review", "Admin 01", "Completed"],
          ["10:05 AM", "WA-004", "Assigned to User 08", "Admin 01", "Completed"],
          ["09:50 AM", "WA-006", "Handover requested", "User 09", "Pending"],
        ],
      },
    },
    {
      title: "Routing rules",
      table: {
        cols: ["Rule", "Condition", "Assign to", "Mode", "Status"],
        pill: [4],
        rows: [
          ["WR-01", "New request chat", "Available authorised User", "Automatic", "Active"],
          ["WR-02", "Volunteer chat", "Volunteer coordinator", "Manual", "Active"],
          ["WR-03", "Sensitive or urgent", "Admin on duty", "Approval", "Active"],
        ],
      },
    },
    {
      title: "Monitoring reports",
      table: {
        cols: ["Report", "Period", "Response SLA", "Overdue", "Status"],
        pill: [4],
        rows: [
          ["Response SLA", "Today", "67% · demo", "2", "Review"],
          ["Handover log", "This week", "—", "1", "Ready"],
          ["Assignment history", "This week", "—", "—", "Ready"],
        ],
      },
    },
  ],
  side: {
    kind: "table",
    title: "Team workload & routing",
    table: {
      cols: ["Owner", "Open", "Overdue"],
      rows: [
        ["User 07", "1", "0"],
        ["User 08", "1", "1"],
        ["User 09", "1", "1"],
        ["User 10", "1", "0"],
      ],
    },
    rows: [
      ["Assignment mode", "Automatic / Manual / Approval"],
      ["Handover pending", "01"],
      ["Sync", "*Delayed"],
    ],
    actions: [
      a("Review rule", "Routing rule opened for review (demo)."),
      a("Audit chat", "Chat audit opened; export needs authority and purpose (demo)."),
    ],
  },
  bottom: {
    title: "Assignment lifecycle",
    steps: ["New chat", "Route", "Accept", "Reply", "Resolve"],
    rows: [
      ["History", "Owner, time, reason and message ID"],
      ["Access", "Official chats only; scoped audit"],
    ],
  },
};
