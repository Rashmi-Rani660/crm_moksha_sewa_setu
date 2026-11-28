"use client";

/** Screen switcher in the page heading — same dropdown as the SA-071+ screens (Audit & Activity Logs). */

import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/dashboards/super-admin/kit";
import { screenPicker, screenPicker1120 } from "@/components/dashboards/super-admin/routes";

const B = "/dashboard/super-admin";

export const knowledgeScreens = [
  { code: "SA-054", title: "AI Training Academy Dashboard", href: `${B}/training-excellence` },
  { code: "SA-055", title: "Course & Training Module Management", href: `${B}/training-excellence/courses` },
  { code: "SA-056", title: "Role-wise Training Assignment", href: `${B}/training-excellence/role-assignment` },
  { code: "SA-057", title: "AI Virtual Trainer Configuration", href: `${B}/training-excellence/virtual-trainer` },
  { code: "SA-058", title: "Assessment & Certification", href: `${B}/training-excellence/assessments` },
  { code: "SA-059", title: "Admin & User Performance", href: `${B}/training-excellence/performance` },
  { code: "SA-060", title: "Sewa Excellence & Recognition", href: `${B}/training-excellence/recognition` },
  { code: "SA-061", title: "Knowledge Base & SOP Management", href: `${B}/knowledge-base` },
  { code: "SA-062", title: "Complaints & Grievances", href: `${B}/knowledge-base/complaints` },
];

export const securityScreens = [
  { code: "SA-063", title: "Security Command Centre", href: `${B}/system-security` },
  { code: "SA-064", title: "Login & Active Session Monitoring", href: `${B}/system-security/sessions` },
  { code: "SA-065", title: "Device & Access Management", href: `${B}/system-security/devices` },
  { code: "SA-066", title: "Security Alerts & Incident Management", href: `${B}/system-security/incidents` },
  { code: "SA-067", title: "Data Access & Export Control", href: `${B}/system-security/export-control` },
  { code: "SA-068", title: "Consent & Privacy Management", href: `${B}/system-security/consent-privacy` },
  { code: "SA-074", title: "Emergency System Lockdown", href: `${B}/system-security/emergency-lockdown` },
];

export const backupScreens = [
  { code: "SA-069", title: "Backup & Recovery Dashboard", href: `${B}/backup-recovery` },
  { code: "SA-070", title: "Backup Schedule & Restoration", href: `${B}/backup-recovery/schedule` },
  { code: "SA-071", title: "Disaster Recovery Management", href: `${B}/backup-recovery/disaster-recovery` },
];

export const integrationScreens = [{ code: "SA-072", title: "Integration & API Health", href: `${B}/integrations-api` }];

export const auditScreens = [{ code: "SA-073", title: "Audit & Activity Logs", href: `${B}/audit-logs` }];

export const settingsScreens = [
  { code: "SA-075", title: "System Settings", href: `${B}/system-settings` },
  { code: "SA-076", title: "Technical Support & Issue Tracking", href: `${B}/system-settings/technical-support` },
];

export const reportScreens = [
  { code: "SA-077", title: "Central Reports & MIS", href: `${B}/reports-analytics` },
  { code: "SA-078", title: "Sewa & Social Impact Analytics", href: `${B}/reports-analytics/sewa-impact` },
  { code: "SA-079", title: "Department & Centre Performance", href: `${B}/reports-analytics/department-performance` },
  { code: "SA-080", title: "Campaign & Communication Analytics", href: `${B}/reports-analytics/campaign-analytics` },
  { code: "SA-081", title: "Custom Report Builder", href: `${B}/reports-analytics/report-builder` },
  { code: "SA-082", title: "Scheduled Reports & Management MIS", href: `${B}/reports-analytics/scheduled-reports` },
];

/** Screens listed in the switcher for a sidebar section (only that section's screens). */
export function sectionScreens(active: string): readonly { code: string; title: string; href: string }[] {
  switch (active) {
    case "sewa-operations":
      return screenPicker1120.filter((s) => s.section === "sewa-operations");
    case "communication-hub":
      return screenPicker.filter((s) => s.href.startsWith(`${B}/communication-hub`));
    case "backup-recovery":
      return backupScreens;
    case "system-security":
      return securityScreens;
    case "integrations-api":
      return integrationScreens;
    case "audit-logs":
      return auditScreens;
    case "system-settings":
      return settingsScreens;
    case "reports-analytics":
      return reportScreens;
    default:
      return [];
  }
}

export function ScreenSwitch({ current, screens }: { current: string; screens: readonly { code: string; title: string; href: string }[] }) {
  const router = useRouter();
  const now = screens.find((s) => s.code === current);
  return (
    <Dropdown
      label="Switch screen"
      value={now?.title ?? ""}
      options={screens.map((s) => s.title)}
      onChange={(t) => {
        const next = screens.find((s) => s.title === t);
        if (next && next.code !== current) router.push(next.href);
      }}
      className="w-full sm:w-[330px] [&_button]:!font-normal"
      size={13.5}
    />
  );
}
