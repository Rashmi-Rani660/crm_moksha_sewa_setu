/** SA-021 … SA-025 — demo content (illustrative only; no production data). */

import {
  BellRing,
  Boxes,
  CircleAlert,
  ClipboardList,
  Clock,
  FileWarning,
  Handshake,
  HandHeart,
  Layers,
  MapPin,
  Network,
  Package,
  Radio,
  ShieldCheck,
  Timer,
  Truck,
  UsersRound,
  Wrench,
  Route,
  Store,
  ShoppingCart,
  Globe,
  UserCheck,
  UserPlus,
  GraduationCap,
  Gauge,
} from "lucide-react";
import type { Action, Screen } from "./types";

const B = "/dashboard/super-admin/sewa-operations";
const a = (label: string, notice: string, confirm?: string): Action => ({ label, notice, confirm });

export const sa021: Screen = {
  id: "SA-021",
  title: "Staff & Volunteer Live Monitoring",
  active: "sewa-operations",
  href: `${B}/live-monitoring`,
  icon: Radio,
  kpis: [
    { tone: "blue", icon: Radio, value: "08 / 10", label: "Staff on duty" },
    { tone: "green", icon: UsersRound, value: "12 / 18", label: "Volunteers available" },
    { tone: "orange", icon: ClipboardList, value: "06", label: "Field assignments" },
    { tone: "purple", icon: BellRing, value: "02", label: "Unacknowledged" },
    { tone: "sky", icon: Timer, value: "05", label: "Overdue tasks" },
    { tone: "green", icon: MapPin, value: "01", label: "GPS stale" },
  ],
  tabs: ["Live roster", "Assignments", "Location & safety", "Activity history"],
  main: {
    title: "Live staff & volunteer roster",
    table: {
      cols: ["Member ID", "Type", "Assigned work", "Last update", "Status", "Action"],
      pill: [4],
      rows: [
        ["EMP-001", "Staff", "Case MS-26-1101", "10:24 AM", "On field", "View"],
        ["EMP-002", "Staff", "Vehicle coordination", "10:23 AM", "En route", "View"],
        ["VOL-004", "Volunteer", "Family assistance", "10:20 AM", "Assigned", "View"],
        ["VOL-007", "Volunteer", "Standby", "10:19 AM", "Available", "View"],
        ["EMP-003", "Staff", "Document verification", "10:18 AM", "On duty", "View"],
        ["VOL-009", "Volunteer", "Awaiting acknowledgement", "10:12 AM", "Pending", "*Review"],
      ],
    },
    actions: [
      a("Assign task", "Assignment form opened — conflict check and required training are verified first (demo)."),
      a("Reassign", "Reassignment recorded with reason in the audit trail (demo).", "Reassign the selected member's work?"),
      a("Contact member", "Contact request sent through the app; no off-duty tracking (demo)."),
    ],
  },
  tabViews: [
    {
      title: "Field assignments",
      table: {
        cols: ["Task", "Assignee", "Type", "Due", "Status"],
        pill: [4],
        rows: [
          ["Case MS-26-1101", "EMP-001", "Staff", "11:00 AM", "On field"],
          ["Vehicle coordination", "EMP-002", "Staff", "11:30 AM", "En route"],
          ["Family assistance", "VOL-004", "Volunteer", "12:00 PM", "Assigned"],
          ["Document verification", "EMP-003", "Staff", "12:30 PM", "On duty"],
          ["Standby cover", "VOL-009", "Volunteer", "10:30 AM", "Pending"],
        ],
      },
    },
    {
      title: "Location & safety · on-duty only",
      table: {
        cols: ["Member", "Consent", "Last GPS", "Accuracy", "Safety check-in", "Status"],
        pill: [5],
        rows: [
          ["EMP-001", "Recorded", "10:24 AM", "± 12 m", "10:00 AM", "Active"],
          ["EMP-002", "Recorded", "10:23 AM", "± 18 m", "10:05 AM", "Active"],
          ["VOL-004", "Recorded", "10:20 AM", "± 25 m", "09:50 AM", "Active"],
          ["VOL-009", "Pending", "—", "—", "—", "Review"],
        ],
      },
    },
    {
      title: "Activity history",
      table: {
        cols: ["Time", "Member", "Event", "Recorded by", "Result"],
        pill: [4],
        rows: [
          ["10:24 AM", "EMP-001", "Checked in at case location", "App", "Verified"],
          ["10:20 AM", "VOL-004", "Accepted assignment", "App", "Completed"],
          ["10:12 AM", "VOL-009", "Acknowledgement awaited", "System", "Pending"],
          ["10:05 AM", "EMP-002", "Safety check-in", "App", "Completed"],
        ],
      },
    },
  ],
  side: {
    kind: "kv",
    title: "Resource availability",
    barsFirst: true,
    bars: [
      { label: "Staff on duty", pct: 80 },
      { label: "Volunteers available", pct: 67 },
    ],
    rows: [
      ["Service city", "Ghaziabad"],
      ["Delhi / Noida", "*Coming soon"],
      ["Tracking consent", "Required"],
      ["Stale GPS", "1 device · review"],
      ["Emergency check-in", "Enabled by policy"],
    ],
  },
  bottom: {
    title: "Live monitoring & exceptions",
    steps: ["Assign", "Accept", "Check-in", "Evidence", "Verify"],
    rows: [
      ["Pending acknowledgement", "02"],
      ["Overdue tasks", "05"],
      ["Manual escalation", "Responsible Admin"],
    ],
  },
};

export const sa022: Screen = {
  id: "SA-022",
  title: "Volunteer Management",
  active: "sewa-operations",
  href: `${B}/volunteers`,
  icon: HandHeart,
  kpis: [
    { tone: "blue", icon: UsersRound, value: "18", label: "Registered volunteers" },
    { tone: "green", icon: UserCheck, value: "12", label: "Available" },
    { tone: "orange", icon: UserPlus, value: "06", label: "Unavailable" },
    { tone: "purple", icon: ShieldCheck, value: "02", label: "Verification pending" },
    { tone: "sky", icon: GraduationCap, value: "03", label: "Training due" },
    { tone: "green", icon: ClipboardList, value: "04", label: "Assigned today" },
  ],
  tabs: ["Volunteer directory", "Onboarding", "Availability", "Training", "Contribution"],
  main: {
    title: "Volunteer directory",
    selected: 2,
    table: {
      cols: ["Volunteer ID", "Name", "Area", "Availability", "Verification", "Training"],
      pill: [3, 4, 5],
      rows: [
        ["VOL-001", "Demo Volunteer 01", "Ghaziabad", "Available", "Verified", "Completed"],
        ["VOL-004", "Demo Volunteer 04", "Ghaziabad", "Assigned", "Verified", "Completed"],
        ["VOL-007", "Demo Volunteer 07", "Ghaziabad", "Available", "Verified", "Due soon"],
        ["VOL-009", "Demo Volunteer 09", "Ghaziabad", "Pending", "Review", "Pending"],
        ["VOL-012", "Demo Volunteer 12", "Ghaziabad", "Available", "Verified", "Completed"],
        ["VOL-018", "Demo Volunteer 18", "Ghaziabad", "Pending", "Review", "Pending"],
      ],
    },
    actions: [
      a("Register volunteer", "Registration form opened — eligibility, consent and emergency contact are required (demo)."),
      a("Review verification", "Verification review opened for the selected volunteer (demo)."),
      a("Assign task", "Assignment blocked until required training is complete; otherwise task is offered in the Volunteer App (demo)."),
    ],
  },
  tabViews: [
    {
      title: "Onboarding pipeline",
      table: {
        cols: ["Volunteer ID", "Step", "Consent", "Induction", "Emergency contact", "Status"],
        pill: [5],
        rows: [
          ["VOL-009", "Verify", "Recorded", "Pending", "Provided", "Review"],
          ["VOL-018", "Verify", "Recorded", "Pending", "Pending", "Review"],
          ["VOL-012", "Activated", "Recorded", "Completed", "Provided", "Active"],
          ["VOL-007", "Activated", "Recorded", "Completed", "Provided", "Active"],
        ],
      },
    },
    {
      title: "Availability",
      table: {
        cols: ["Volunteer ID", "Today", "This week", "Preferred area", "Status"],
        pill: [4],
        rows: [
          ["VOL-001", "09:00 – 17:00", "5 days", "Ghaziabad", "Available"],
          ["VOL-004", "Assigned", "4 days", "Ghaziabad", "Assigned"],
          ["VOL-007", "10:00 – 16:00", "3 days", "Ghaziabad", "Available"],
          ["VOL-009", "—", "Not confirmed", "Ghaziabad", "Pending"],
        ],
      },
    },
    {
      title: "Training status",
      table: {
        cols: ["Volunteer ID", "Course", "Due", "Completed", "Status"],
        pill: [4],
        rows: [
          ["VOL-007", "Sensitive case handling", "30 Nov", "—", "Due soon"],
          ["VOL-009", "Induction", "28 Nov", "—", "Pending"],
          ["VOL-001", "Sensitive case handling", "—", "12 Nov", "Completed"],
          ["VOL-012", "Induction", "—", "10 Nov", "Completed"],
        ],
      },
    },
    {
      title: "Service hours & recognition",
      table: {
        cols: ["Volunteer ID", "Hours (month)", "Assignments", "Feedback", "Recognition"],
        rows: [
          ["VOL-001", "14 · demo", "6", "Positive", "Under review"],
          ["VOL-004", "11 · demo", "5", "Positive", "—"],
          ["VOL-012", "9 · demo", "4", "Positive", "—"],
          ["VOL-007", "7 · demo", "3", "Neutral", "—"],
        ],
      },
    },
  ],
  side: {
    kind: "fields",
    title: "Selected volunteer · $0",
    fields: [
      ["Name", "$1"],
      ["Mobile", "98XXXXXX$#0"],
      ["Preferred area", "$2"],
      ["App status", "Connected"],
    ],
    rows: [
      ["Consent", "Recorded · demo"],
      ["Training", "*$5"],
      ["Access", "Volunteer App only"],
      ["Availability", "*$3"],
    ],
  },
  bottom: {
    title: "Onboarding & contribution",
    steps: ["Register", "Consent", "Verify", "Train", "Activate"],
    rows: [
      ["Pending verification", "02"],
      ["Training due", "03"],
      ["Recognition", "Service hours & quality"],
    ],
  },
};

export const sa023: Screen = {
  id: "SA-023",
  title: "Fleet & Logistics",
  active: "sewa-operations",
  href: `${B}/fleet-logistics`,
  icon: Truck,
  kpis: [
    { tone: "blue", icon: Truck, value: "02", label: "Fleet registered" },
    { tone: "green", icon: UserCheck, value: "01", label: "Available" },
    { tone: "orange", icon: Route, value: "01", label: "Deployed" },
    { tone: "purple", icon: Wrench, value: "00", label: "Maintenance" },
    { tone: "sky", icon: UsersRound, value: "02", label: "Drivers on duty" },
    { tone: "green", icon: Gauge, value: "01", label: "Service due" },
  ],
  tabs: ["Fleet overview", "Trips & dispatch", "Drivers", "Maintenance", "Fuel & costs"],
  main: {
    title: "Fleet availability & dispatch",
    table: {
      cols: ["Vehicle ID", "Vehicle", "Assigned driver", "Case", "GPS update", "Status"],
      pill: [5],
      rows: [
        ["MV-01", "Force Traveller Type-B", "Demo Driver 01", "MS-26-1101", "10:24 AM", "In service"],
        ["MV-02", "Maruti EECO mortuary/freezer", "Demo Driver 02", "—", "10:22 AM", "Available"],
      ],
    },
    actions: [
      a("Allocate vehicle", "Allocation checks legal clearance, driver availability, documents and conflicts before dispatch (demo)."),
      a("Create trip", "Trip draft created for approval (demo)."),
      a("Maintenance log", "Maintenance log opened (demo)."),
    ],
    nested: {
      title: "Dispatch queue",
      table: {
        cols: ["Trip", "Purpose", "Pickup area", "ETA", "Status"],
        pill: [4],
        rows: [
          ["TR-001", "Body transportation", "Ghaziabad", "15 min · demo", "Assigned"],
          ["TR-002", "Cremation support", "Ghaziabad", "Awaiting approval", "Pending"],
        ],
      },
    },
  },
  tabViews: [
    {
      title: "Trips & dispatch",
      table: {
        cols: ["Trip", "Vehicle", "Purpose", "Pickup area", "ETA", "Status"],
        pill: [5],
        rows: [
          ["TR-001", "MV-01", "Body transportation", "Ghaziabad", "15 min · demo", "Assigned"],
          ["TR-002", "—", "Cremation support", "Ghaziabad", "Awaiting approval", "Pending"],
          ["TR-000", "MV-02", "Family transport", "Ghaziabad", "Completed 09:40", "Completed"],
        ],
      },
    },
    {
      title: "Drivers",
      table: {
        cols: ["Driver", "Vehicle", "Licence check", "Duty", "Status"],
        pill: [4],
        rows: [
          ["Demo Driver 01", "MV-01", "Verified", "On duty", "On duty"],
          ["Demo Driver 02", "MV-02", "Verified", "On duty", "Available"],
        ],
      },
    },
    {
      title: "Maintenance",
      table: {
        cols: ["Vehicle", "Last service", "Next service", "Documents", "Status"],
        pill: [4],
        rows: [
          ["MV-01", "15 Oct", "Due soon", "Valid", "Due soon"],
          ["MV-02", "02 Nov", "02 Feb", "Valid", "Active"],
        ],
      },
    },
    {
      title: "Fuel & trip costs · case-linked",
      table: {
        cols: ["Trip", "Case", "Mileage", "Fuel / toll", "Approval"],
        pill: [4],
        rows: [
          ["TR-000", "MS-26-1098", "18 km · demo", "₹420 · demo", "Approved"],
          ["TR-001", "MS-26-1101", "In progress", "Pending", "Pending"],
        ],
      },
    },
  ],
  side: {
    kind: "kv",
    title: "Vehicle readiness",
    rows: [
      ["MV-01", "*In service"],
      ["MV-02", "*Available"],
      ["Driver verification", "*Verified"],
      ["GPS connectivity", "*Connected"],
      ["Next maintenance", "*Due soon"],
      ["Service coverage", "Ghaziabad only"],
    ],
    bars: [
      { label: "Fleet available", pct: 50 },
      { label: "Driver availability", pct: 100 },
    ],
  },
  bottom: {
    title: "Trip lifecycle & cost control",
    steps: ["Approve", "Allocate", "Dispatch", "Arrive", "Close"],
    rows: [
      ["Trip evidence", "Required"],
      ["Fuel / toll expenses", "Case-linked approval"],
    ],
  },
};

export const sa024: Screen = {
  id: "SA-024",
  title: "Service Network Management",
  active: "sewa-operations",
  href: `${B}/service-network`,
  icon: Handshake,
  kpis: [
    { tone: "blue", icon: UsersRound, value: "08", label: "Network partners" },
    { tone: "green", icon: Network, value: "05", label: "Verified" },
    { tone: "orange", icon: MapPin, value: "03", label: "Review pending" },
    { tone: "purple", icon: Layers, value: "01", label: "Active city" },
    { tone: "sky", icon: Globe, value: "02", label: "Upcoming cities" },
    { tone: "green", icon: FileWarning, value: "01", label: "Expired documents" },
  ],
  tabs: ["Partner directory", "Facilities", "Verification", "Coverage", "Agreements"],
  main: {
    title: "Service network directory",
    table: {
      cols: ["Partner ID", "Facility type", "City", "Contact", "Verification", "Status"],
      pill: [4, 5],
      rows: [
        ["NET-001", "Cremation ground", "Ghaziabad", "Masked", "Verified", "Active"],
        ["NET-002", "Hospital liaison", "Ghaziabad", "Masked", "Verified", "Active"],
        ["NET-003", "Police liaison", "Ghaziabad", "Masked", "Verified", "Active"],
        ["NET-004", "Mortuary facility", "Ghaziabad", "Masked", "Review", "Pending"],
        ["NET-005", "Material supplier", "Ghaziabad", "Masked", "Verified", "Active"],
        ["NET-006", "Cremation ground", "Delhi", "Not verified", "Review", "Coming soon"],
      ],
    },
    actions: [
      a("Add partner", "Partner form opened — agreement, authorised contact, capacity and hours are validated (demo)."),
      a("Verify documents", "Document verification opened (demo)."),
      a("Review agreement", "Agreement review opened — expiry alerts and approved cost terms shown (demo)."),
    ],
  },
  tabViews: [
    {
      title: "Facilities & capacity",
      table: {
        cols: ["Partner ID", "Facility", "Capacity", "Working hours", "Compliance", "Status"],
        pill: [5],
        rows: [
          ["NET-001", "Cremation ground", "Confirm before dispatch", "Confirm before dispatch", "Verified", "Active"],
          ["NET-002", "Hospital liaison", "Not applicable", "24 × 7 · demo", "Verified", "Active"],
          ["NET-004", "Mortuary facility", "To be confirmed", "To be confirmed", "Review", "Pending"],
        ],
      },
    },
    {
      title: "Document verification",
      table: {
        cols: ["Partner ID", "Document", "Valid till", "Verified by", "Status"],
        pill: [4],
        rows: [
          ["NET-001", "Service agreement", "Mar 2027 · demo", "Admin 01", "Verified"],
          ["NET-004", "Facility licence", "—", "—", "Review"],
          ["NET-005", "Supplier agreement", "Expired", "Admin 02", "Expired"],
          ["NET-002", "Authorised contact", "Mar 2027 · demo", "Admin 01", "Verified"],
        ],
      },
    },
    {
      title: "Coverage",
      table: {
        cols: ["City", "Partners", "Verified", "Service", "Status"],
        pill: [4],
        rows: [
          ["Ghaziabad", "5", "4", "Enabled", "Active"],
          ["Delhi", "1", "0", "Not enabled", "Coming soon"],
          ["Noida", "0", "0", "Not enabled", "Coming soon"],
        ],
      },
    },
    {
      title: "Agreements",
      table: {
        cols: ["Partner ID", "Agreement", "Cost terms", "Expiry", "Status"],
        pill: [4],
        rows: [
          ["NET-001", "Free cremation support", "Approved terms", "Mar 2027 · demo", "Verified"],
          ["NET-002", "Hospital liaison", "No cost", "Mar 2027 · demo", "Verified"],
          ["NET-005", "Material supply", "Approved terms", "Expired", "Expired"],
        ],
      },
    },
  ],
  side: {
    kind: "kv-actions",
    title: "Selected partner · $0",
    rows: [
      ["Service scope", "Free cremation support"],
      ["City", "$2"],
      ["Contact access", "Authorised only"],
      ["Agreement status", "*$4"],
      ["Working hours", "Confirm before dispatch"],
      ["Last validation", "24 Nov · demo"],
    ],
    actions: [
      a("View agreement", "Agreement opened (demo)."),
      a("Assign liaison", "Liaison assignment recorded in the audit trail (demo)."),
    ],
  },
  bottom: {
    title: "Network readiness & activation",
    steps: ["Register", "Document review", "Approve", "Activate"],
    rows: [
      ["Ghaziabad", "*Active"],
      ["Delhi / Noida", "*Coming soon"],
    ],
  },
};

export const sa025: Screen = {
  id: "SA-025",
  title: "Inventory & Material Management",
  active: "sewa-operations",
  href: `${B}/inventory`,
  icon: Boxes,
  kpis: [
    { tone: "blue", icon: Boxes, value: "12", label: "Item types" },
    { tone: "green", icon: Package, value: "148", label: "Stock units" },
    { tone: "orange", icon: CircleAlert, value: "02", label: "Low stock items" },
    { tone: "purple", icon: Clock, value: "03", label: "Pending issues" },
    { tone: "sky", icon: ShoppingCart, value: "02", label: "Purchase requests" },
    { tone: "green", icon: Store, value: "01", label: "Active store" },
  ],
  tabs: ["Stock overview", "Issue & return", "Purchase requests", "Stock audit", "History"],
  main: {
    title: "Inventory register · Ghaziabad",
    table: {
      cols: ["Item code", "Material", "Unit", "Available", "Reorder", "Status"],
      pill: [5],
      rows: [
        ["INV-001", "Cremation support kit", "Kit", "24", "10", "Available"],
        ["INV-002", "Protective gloves", "Pair", "40", "20", "Available"],
        ["INV-003", "Body cover", "Piece", "6", "10", "Low stock"],
        ["INV-004", "Sanitisation supplies", "Unit", "8", "10", "Low stock"],
        ["INV-005", "Cotton cloth", "Piece", "30", "15", "Available"],
        ["INV-006", "Documentation kit", "Kit", "40", "10", "Available"],
      ],
    },
    actions: [
      a("Issue material", "Issue form opened — case link is mandatory and negative stock is blocked (demo)."),
      a("Request purchase", "Purchase request created for approval (demo)."),
      a("Stock adjustment", "Adjustment submitted for maker-checker approval (demo).", "Submit a stock adjustment for approval?"),
    ],
  },
  tabViews: [
    {
      title: "Issue & return",
      table: {
        cols: ["Issue ID", "Material", "Quantity", "Case", "Issued by", "Status"],
        pill: [5],
        rows: [
          ["ISS-031", "Cremation support kit", "1", "MS-26-1101", "Admin 01", "Open"],
          ["ISS-030", "Protective gloves", "4 pairs", "MS-26-1100", "Admin 01", "Completed"],
          ["ISS-029", "Body cover", "1", "MS-26-1099", "Admin 02", "Completed"],
        ],
      },
    },
    {
      title: "Purchase requests · approval required",
      table: {
        cols: ["Request ID", "Material", "Quantity", "Requested by", "Approver", "Status"],
        pill: [5],
        rows: [
          ["PR-014", "Body cover", "20 · demo", "Admin 01", "Super Admin", "Pending"],
          ["PR-013", "Sanitisation supplies", "30 · demo", "Admin 02", "Super Admin", "Pending"],
        ],
      },
    },
    {
      title: "Stock audit",
      table: {
        cols: ["Audit ID", "Scope", "Counted", "Variance", "Reviewer", "Status"],
        pill: [5],
        rows: [
          ["AUD-12", "Ghaziabad store", "148", "0", "Admin 02", "Verified"],
          ["AUD-11", "Consumables", "62", "-2", "Admin 02", "Review"],
        ],
      },
    },
    {
      title: "Stock ledger history",
      table: {
        cols: ["Time", "Material", "Movement", "Quantity", "Case / reference"],
        rows: [
          ["10:20 AM", "Cremation support kit", "Issue", "-1", "MS-26-1101"],
          ["09:45 AM", "Protective gloves", "Issue", "-4", "MS-26-1100"],
          ["Yesterday", "Cotton cloth", "Receipt", "+30", "PR-009"],
        ],
      },
    },
  ],
  side: {
    kind: "kv",
    title: "Stock alerts & issue queue",
    rows: [
      ["Body cover", "*Low stock"],
      ["Sanitisation supplies", "*Low stock"],
      ["Pending material issues", "03"],
      ["Purchase requests", "02"],
      ["Store location", "Ghaziabad"],
      ["Stock adjustments", "Approval required"],
    ],
    bars: [
      { label: "Kit stock vs target", pct: 80 },
      { label: "Protective supplies", pct: 67 },
    ],
  },
  bottom: {
    title: "Material movement",
    steps: ["Request", "Approve", "Reserve", "Issue", "Reconcile"],
    rows: [
      ["Case-linked consumption", "Mandatory"],
      ["Stock audit", "Maker-checker"],
    ],
  },
};

void ShieldCheck;
