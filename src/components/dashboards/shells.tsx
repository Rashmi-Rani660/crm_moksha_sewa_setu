import {
  Award,
  Bell,
  BookOpenCheck,
  CircleCheckBig,
  IndianRupee,
  Radio,
  CalendarDays,
  ChartColumn,
  CircleHelp,
  CircleUserRound,
  CloudUpload,
  FileText,
  House,
  Layers,
  List,
  MapPin,
  Network,
  Link2,
  ListChecks,
  MessageSquareText,
  MessagesSquare,
  NotebookTabs,
  PackageCheck,
  Settings,
  ShieldCheck,
  SquareUserRound,
  Users,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { SidebarSpec } from "@/components/dashboards/Sidebar";
import type { TopBarSpec } from "@/components/dashboards/TopBar";
import type { Role } from "@/lib/auth/session";

/**
 * Per-role chrome: sidebar + top bar layout (design pixel values), the extra
 * sections that dashboard buttons open, and the notification list.
 * TODO: notices come from the notifications API.
 */
export type Notice = { text: string; time: string; /** Section label it opens. */ section: string };

export type Shell = {
  sidebar: SidebarSpec;
  topBar: TopBarSpec;
  /** Sections opened from dashboard buttons that are not in the menu. */
  extras: string[];
  notices: Notice[];
};

/**
 * Menu labels renamed in the SA-021 … SA-050 designs keep their existing URL
 * (old label and new label open the same page).
 */
const slugAlias: Record<string, string> = {
  "notifications-alerts": "notification-alerts",
  "ai-automation": "automation-ai",
  "training-excellence": "knowledge-base",
};

export const slugify = (label: string) => {
  const slug = label
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slugAlias[slug] ?? slug;
};

export const homeHref = (role: Role) => `/dashboard/${role}`;
export const sectionHref = (role: Role, label: string) => `${homeHref(role)}/${slugify(label)}`;

export const shells: Record<Role, Shell> = {
  user: {
    sidebar: {
      width: 221,
      fontSize: 15.6,
      iconSize: 23,
      iconX: 38,
      textX: 67,
      pill: { x: 5, w: 215, h: 35 },
      rowHeight: 32,
      items: [
        { label: "Dashboard", icon: House, y: 150 },
        { label: "My Workspace", icon: SquareUserRound, y: 186, pill: "gold" },
        { label: "My Tasks", icon: ListChecks, y: 222 },
        { label: "Sewa Requests", icon: Users, y: 258 },
        { label: "My Cases", icon: PackageCheck, y: 294 },
        { label: "Communication Hub", icon: MessagesSquare, y: 330 },
        { label: "Knowledge Base", icon: NotebookTabs, y: 366, href: "/dashboard/user/knowledge-base" },
        { label: "My Calendar", icon: CalendarDays, y: 402 },
        { label: "Team & Support", icon: Users, y: 438 },
        { label: "Training & Knowledge", icon: BookOpenCheck, y: 474, href: "/dashboard/user/training-knowledge" },
        { label: "Assessments", icon: Award, y: 510, href: "/dashboard/user/training-knowledge/assessments" },
        { label: "My Performance", icon: ChartColumn, y: 546, href: "/dashboard/user/my-performance" },
        { label: "My Profile", icon: CircleUserRound, y: 582 },
        { label: "Help & Support", icon: CircleHelp, y: 618, href: "/dashboard/user/help-support" },
        {
          label: "User",
          icon: UserRound,
          y: 654,
          submenu: true,
          children: [
            { label: "My Tasks", href: "/dashboard/user/my-tasks" },
            { label: "Task Execution", href: "/dashboard/user/my-tasks/execution" },
            { label: "Communication Hub", href: "/dashboard/user/communication-hub" },
            { label: "Official Email", href: "/dashboard/user/communication-hub/email" },
            { label: "WhatsApp Desk", href: "/dashboard/user/communication-hub/whatsapp" },
            { label: "Calling & Follow-ups", href: "/dashboard/user/communication-hub/calling" },
            { label: "AI Chatbot", href: "/dashboard/user/communication-hub/chatbot" },
            { label: "AI Work Assistant", href: "/dashboard/user/ai-work-assistant" },
            { label: "Vehicle & Material", href: "/dashboard/user/resources-expenses" },
            { label: "Expenses & Claims", href: "/dashboard/user/resources-expenses/expenses" },
            { label: "My Training & AI Trainer", href: "/dashboard/user/training-knowledge" },
            { label: "Assessment & Certification", href: "/dashboard/user/training-knowledge/assessments" },
            { label: "My Performance & Recognition", href: "/dashboard/user/my-performance" },
            { label: "Knowledge Base & SOPs", href: "/dashboard/user/knowledge-base" },
            { label: "Daily Reports & Support", href: "/dashboard/user/help-support" },
          ],
        },
      ],
    },
    topBar: {
      sidebarWidth: 221,
      menuX: 240,
      logoX: 310,
      dividerX: 458,
      crmX: 487,
      search: { x: 853, w: 405, placeholder: "Search requests, tasks, cases, documents..." },
      bellX: 1318,
      notifications: 5,
      divider2X: 1377,
      avatarX: 1400,
      chevronX: 1568,
      user: { name: "User", role: "Sewa Executive" },
      roleSize: 12.8,
    },
    extras: ["Notifications", "Emails", "WhatsApp", "Calls", "Create Sewa Request", "Upload Documents", "Add Follow-up", "Update Case Status"],
    notices: [
      { text: "Verify Sewa Request – SR-02684 is due today", time: "Today", section: "My Tasks" },
      { text: "Coordinate vehicle – VH-0217 is due today", time: "Today", section: "My Tasks" },
      { text: "Case Follow-up – SR-02684 at 10:30 AM", time: "Today", section: "My Calendar" },
      { text: "05 new emails", time: "Today", section: "Emails" },
      { text: "09 new WhatsApp messages", time: "Today", section: "WhatsApp" },
    ],
  },
  admin: {
    // AD-001 … AD-050 design: same navy sidebar / gold current-page pill as
    // the Super Admin screens, with the Admin (assigned scope) menu.
    sidebar: {
      width: 210,
      fontSize: 13.6,
      iconSize: 18,
      iconX: 25,
      textX: 47,
      pill: { x: 7, w: 197, h: 27 },
      rowHeight: 26,
      pillFontSize: 13.6,
      pillTextClass: "font-medium text-[#0b0c36]",
      goldClass: "rounded-[7px] bg-[linear-gradient(90deg,#fdd763_0%,#f2c04e_50%,#e2a438_100%)] shadow-[0_1px_4px_rgba(0,0,0,0.25)]",
      diyaShift: 0,
      compactMotto: true,
      items: [
        { label: "Dashboard", icon: House, y: 138, pill: "gold" },
        { label: "Live Operations", icon: Radio, y: 165 },
        { label: "Notifications & Alerts", icon: Bell, y: 192 },
        { label: "Pending Approvals", icon: CircleCheckBig, y: 219 },
        { label: "Daily Work Planner", icon: UsersRound, y: 246 },
        { label: "Team & Users", icon: Network, y: 273 },
        { label: "User Profile", icon: MapPin, y: 300 },
        { label: "Team Availability", icon: Layers, y: 327 },
        { label: "Task Allocation", icon: Layers, y: 354 },
        { label: "Attendance & HRMS", icon: FileText, y: 381 },
        { label: "Requests & Cases", icon: Network, y: 408 },
        { label: "Tasks & Workflow", icon: MessageSquareText, y: 435 },
        { label: "Staff & Volunteers", icon: Settings, y: 462 },
        { label: "Fleet & Resources", icon: Link2, y: 489 },
        { label: "Communication Hub", icon: ChartColumn, y: 516 },
        { label: "AI Operations", icon: IndianRupee, y: 543 },
        { label: "Finance & Approvals", icon: ShieldCheck, y: 570 },
        { label: "Training & Quality", icon: CloudUpload, y: 597 },
        { label: "Knowledge Base & SOP", icon: BookOpenCheck, y: 624, sub: true },
        { label: "Reports & MIS", icon: List, y: 651 },
        { label: "Complaints & Feedback", icon: Settings, y: 678 },
        { label: "Settings", icon: House, y: 705 },
      ],
    },
    topBar: {
      sidebarWidth: 210,
      menuX: 229,
      logoX: 293,
      crmBadgeX: 416,
      dividerX: 481,
      crmX: 499,
      search: { x: 958, w: 338, placeholder: "Search requests, cases, users...", size: 14.6 },
      mic: true,
      askAi: { x: 1306, w: 70 },
      bellX: 1390,
      notifications: 12,
      avatarX: 1436,
      chevronX: 1572,
      user: { name: "Admin", role: "Operations Admin" },
      roleSize: 11,
      nameSize: 15.5,
    },
    extras: ["My Profile", "Notifications"],
    notices: [
      { text: "02 emergency cases need immediate review", time: "Today", section: "Live Operations" },
      { text: "04 approvals are pending your decision", time: "Today", section: "Pending Approvals" },
      { text: "04 requests are unassigned", time: "Today", section: "Requests & Cases" },
      { text: "05 tasks are overdue", time: "Today", section: "Tasks & Workflow" },
      { text: "Super Admin instruction: overdue review by 17:00", time: "Today", section: "Notifications & Alerts" },
    ],
  },
  "super-admin": {
    // SA-021 … SA-050 design sidebar: "Dashboard" is the first row, the
    // current page is a gold pill with dark text, no submenu chevrons.
    sidebar: {
      width: 210,
      fontSize: 14.6,
      iconSize: 18,
      iconX: 25,
      textX: 47,
      pill: { x: 7, w: 197, h: 27 },
      rowHeight: 26,
      pillFontSize: 14.6,
      pillTextClass: "font-medium text-[#0b0c36]",
      goldClass: "rounded-[7px] bg-[linear-gradient(90deg,#fdd763_0%,#f2c04e_50%,#e2a438_100%)] shadow-[0_1px_4px_rgba(0,0,0,0.25)]",
      diyaShift: 0,
      items: [
        { label: "Dashboard", icon: House, y: 162, pill: "gold" },
        { label: "Live Operations", icon: Radio, y: 192 },
        { label: "Notifications & Alerts", icon: Bell, y: 222 },
        { label: "Central Approvals", icon: CircleCheckBig, y: 252 },
        { label: "Users & Access Control", icon: UsersRound, y: 282 },
        { label: "Organisation Setup", icon: Network, y: 312 },
        { label: "City, Zone & Centres", icon: MapPin, y: 342 },
        { label: "Departments & Centres", icon: Layers, y: 372 },
        { label: "Master Data", icon: Layers, y: 402 },
        { label: "Sewa Operations", icon: FileText, y: 432 },
        { label: "Case & Workflow", icon: Network, y: 462 },
        { label: "Communication Hub", icon: MessageSquareText, y: 492 },
        { label: "AI & Automation", icon: Settings, y: 522, href: "/dashboard/super-admin/automation-ai/ai-cost-usage" },
        { label: "Training & Excellence", icon: Award, y: 552 },
        { label: "Integrations & API", icon: Link2, y: 582 },
        { label: "Reports & Analytics", icon: ChartColumn, y: 612 },
        { label: "Finance & Donations", icon: IndianRupee, y: 642 },
        { label: "System Security", icon: ShieldCheck, y: 672 },
        { label: "Backup & Recovery", icon: CloudUpload, y: 702 },
        { label: "Audit Logs", icon: List, y: 732 },
        { label: "System Settings", icon: Settings, y: 762 },
      ],
    },
    topBar: {
      sidebarWidth: 210,
      menuX: 229,
      logoX: 293,
      crmBadgeX: 416,
      dividerX: 481,
      crmX: 499,
      search: { x: 958, w: 338, placeholder: "Search requests, cases, users...", size: 14.6 },
      mic: true,
      askAi: { x: 1306, w: 70 },
      bellX: 1390,
      notifications: 12,
      avatarX: 1431,
      chevronX: 1572,
      user: { name: "Super Admin", role: "System Administrator" },
      roleSize: 10.6,
      nameSize: 14.6,
      compactProfile: true,
    },
    extras: ["My Profile", "Notifications"],
    notices: [
      { text: "03 emergency requests need immediate attention", time: "Today", section: "Live Operations" },
      { text: "07 critical approvals are pending", time: "Today", section: "Central Approvals" },
      { text: "03 user access requests", time: "Today", section: "Users & Access Control" },
      { text: "System backup completed", time: "09:30 AM", section: "Backup & Recovery" },
      { text: "Automation rule updated – AUTO-015", time: "09:56 AM", section: "AI & Automation" },
    ],
  },
};

/**
 * Menu rows are spaced so the visible gap between neighbours is the same
 * everywhere: a plain row counts as its icon + text (ROW_VISUAL px), a pill
 * as its full height. The first and last rows keep their design position.
 */
const ROW_VISUAL = 22;

function spaceMenuEvenly({ items, pill }: SidebarSpec) {
  const heights = items.map((i) => (i.pill ? (i.box ?? pill).h : ROW_VISUAL));
  const top = items[0].y - heights[0] / 2;
  const bottom = items[items.length - 1].y + heights[heights.length - 1] / 2;
  const gap = (bottom - top - heights.reduce((a, b) => a + b, 0)) / (items.length - 1);
  let edge = top;
  items.forEach((item, i) => {
    item.y = Math.round((edge + heights[i] / 2) * 10) / 10;
    edge += heights[i] + gap;
  });
}

for (const shell of Object.values(shells)) spaceMenuEvenly(shell.sidebar);

/** Menu rows that are the dashboard itself (current-page pill, heading pill, "Dashboard"). */
export const isHomeItem = (item: SidebarSpec["items"][number]) => Boolean(item.pill) || item.label === "Dashboard";

/** Every section a role can open: menu rows (minus the dashboard) + extras. */
export function sectionsOf(role: Role) {
  const { sidebar, extras } = shells[role];
  const labels = [...sidebar.items.filter((i) => !isHomeItem(i)).map((i) => i.label), ...extras];
  return labels.map((label) => ({ label, slug: slugify(label), href: sectionHref(role, label) }));
}

export const findSection = (role: Role, slug: string) => sectionsOf(role).find((s) => s.slug === slug) ?? null;
