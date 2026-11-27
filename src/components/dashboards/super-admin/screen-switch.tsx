"use client";

/** Screen switcher in the page heading — same dropdown as the SA-071+ screens (Audit & Activity Logs). */

import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/dashboards/super-admin/kit";

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
];

export const backupScreens = [
  { code: "SA-069", title: "Backup & Recovery Dashboard", href: `${B}/backup-recovery` },
  { code: "SA-070", title: "Backup Schedule & Restoration", href: `${B}/backup-recovery/schedule` },
];

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
