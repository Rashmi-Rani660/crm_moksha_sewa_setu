import {
  Award,
  Bell,
  BookOpenCheck,
  CircleCheckBig,
  IndianRupee,
  Radio,
  ChartColumn,
  ClipboardList,
  CloudUpload,
  FileText,
  House,
  Layers,
  List,
  MapPin,
  Network,
  Link2,
  MailCheck,
  MessageSquareText,
  MessagesSquare,
  Settings,
  ShieldCheck,
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
    // US-001 … US-010 design: same chrome as the Super Admin screens, user menu.
    sidebar: {
      width: 210,
      fontSize: 14.6,
      iconSize: 18,
      iconX: 22,
      textX: 42,
      pill: { x: 5, w: 202, h: 27 },
      rowHeight: 26,
      pillFontSize: 14.6,
      pillTextClass: "font-medium text-[#0b0c36]",
      goldClass: "rounded-[7px] bg-[linear-gradient(90deg,#fdd763_0%,#f2c04e_50%,#e2a438_100%)] shadow-[0_1px_4px_rgba(0,0,0,0.25)]",
      diyaShift: 0,
      items: [
        { label: "Dashboard", icon: House, y: 162, pill: "gold" },
        { label: "My Work Planner", icon: Radio, y: 192 },
        { label: "Notifications & Instructions", icon: Bell, y: 222 },
        { label: "My Profile & HRMS", icon: CircleCheckBig, y: 252 },
        { label: "Sewa Requests", icon: UsersRound, y: 282 },
        { label: "My Cases", icon: Network, y: 312 },
        { label: "My Tasks", icon: MapPin, y: 342 },
        { label: "Communication Hub", icon: MessageSquareText, y: 372 },
        { label: "AI Work Assistant", icon: Layers, y: 402 },
        { label: "Resources & Expenses", icon: FileText, y: 432 },
        { label: "Training & Performance", icon: Network, y: 462 },
        { label: "Knowledge Base", icon: MessageSquareText, y: 492 },
        { label: "Reports & Support", icon: Settings, y: 522 },
        { label: "Settings", icon: Link2, y: 552 },
      ],
    },
    topBar: {
      sidebarWidth: 210,
      menuX: 229,
      logoX: 293,
      crmBadgeX: 416,
      dividerX: 481,
      crmX: 499,
      search: { x: 958, w: 338, placeholder: "Search my requests, cases, tasks...", size: 14.6 },
      mic: true,
      askAi: { x: 1306, w: 70 },
      bellX: 1390,
      notifications: 12,
      avatarX: 1431,
      chevronX: 1572,
      user: { name: "User 07", role: "Operations User" },
      roleSize: 10.6,
      nameSize: 14.6,
      compactProfile: true,
    },
    extras: ["My Profile", "Notifications"],
    notices: [
      { text: "Emergency case MS-26-1101 assigned to you", time: "09:45 AM", section: "Notifications & Instructions" },
      { text: "Verify pending documents by 11:00", time: "09:40 AM", section: "Notifications & Instructions" },
      { text: "Family follow-up at 11:30", time: "Today", section: "My Work Planner" },
      { text: "Shift handover reminder", time: "09:30 AM", section: "My Work Planner" },
      { text: "Training refresher due this week", time: "Yesterday", section: "Training & Performance" },
    ],
  },
  admin: {
    // AD-001 … AD-050 design: same navy sidebar / gold current-page pill as
    // the Super Admin screens, with the Admin (assigned scope) menu.
    sidebar: {
      width: 210,
      fontSize: 14.6,
      iconSize: 18,
      iconX: 23,
      textX: 44,
      pill: { x: 7, w: 197, h: 27 },
      rowHeight: 26,
      pillFontSize: 14.6,
      pillTextClass: "font-medium text-[#0b0c36]",
      goldClass: "rounded-[7px] bg-[linear-gradient(90deg,#fdd763_0%,#f2c04e_50%,#e2a438_100%)] shadow-[0_1px_4px_rgba(0,0,0,0.25)]",
      diyaShift: 0,
      compactMotto: true,
      items: [
        { label: "Dashboard", icon: House, y: 162, pill: "gold" },
        { label: "Live Operations", icon: Radio, y: 190 },
        { label: "Notifications & Alerts", icon: Bell, y: 218 },
        { label: "Pending Approvals", icon: CircleCheckBig, y: 246 },
        { label: "Daily Work Planner", icon: UsersRound, y: 274 },
        { label: "Team & Users", icon: Network, y: 302 },
        { label: "User Profile", icon: MapPin, y: 330 },
        { label: "Team Availability", icon: Layers, y: 358 },
        { label: "Task Allocation", icon: Layers, y: 386 },
        { label: "Attendance & HRMS", icon: FileText, y: 414 },
        { label: "Requests & Cases", icon: Network, y: 442 },
        { label: "Tasks & Workflow", icon: MessageSquareText, y: 470 },
        { label: "Staff & Volunteers", icon: Settings, y: 498 },
        { label: "Fleet & Resources", icon: Link2, y: 526 },
        { label: "Communication Hub", icon: ChartColumn, y: 554 },
        { label: "AI Operations", icon: IndianRupee, y: 582 },
        { label: "Finance & Approvals", icon: ShieldCheck, y: 610 },
        { label: "Training & Quality", icon: CloudUpload, y: 638 },
        { label: "Knowledge Base & SOP", icon: BookOpenCheck, y: 666, sub: true },
        { label: "Reports & MIS", icon: List, y: 694 },
        { label: "Complaints & Feedback", icon: Settings, y: 722 },
        { label: "Settings", icon: House, y: 750 },
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
