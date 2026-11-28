import { slugify } from "@/components/dashboards/shells";
import { screensA } from "./screens/a";
import { screensB } from "./screens/b";
import { screensC } from "./screens/c";
import { screensD } from "./screens/d";
import { screensE } from "./screens/e";
import type { Screen } from "./types";

/**
 * Where each Admin screen lives: sidebar section (menu label) and its URL.
 * The first screen of a section opens at /dashboard/admin/<section>, the
 * others at /dashboard/admin/<section>/<screen>. AD-001 is the dashboard.
 */
const B = "/dashboard/admin";

const placement: Record<string, [section: string, slug?: string]> = {
  "AD-001": ["Dashboard"],
  "AD-002": ["Live Operations"],
  "AD-003": ["Notifications"],
  "AD-004": ["Approvals"],
  "AD-005": ["Work Planner"],
  "AD-006": ["Team Management"],
  "AD-007": ["Team Management", "availability-hrms"],
  "AD-008": ["Requests & Cases"],
  "AD-009": ["Requests & Cases", "create-request"],
  "AD-010": ["Requests & Cases", "verification"],
  "AD-011": ["Requests & Cases", "legacy-requests"],
  "AD-012": ["Requests & Cases", "case-details"],
  "AD-013": ["Tasks & Workflow"],
  "AD-014": ["Tasks & Workflow", "templates"],
  "AD-015": ["Tasks & Workflow", "sla"],
  "AD-016": ["Staff & Volunteers"],
  "AD-017": ["Staff & Volunteers", "volunteers"],
  "AD-018": ["Fleet & Resources"],
  "AD-019": ["Fleet & Resources", "service-network"],
  "AD-020": ["Fleet & Resources", "inventory"],
  "AD-021": ["Tasks & Workflow", "legacy-templates"],
  "AD-022": ["Tasks & Workflow", "legacy-progress"],
  "AD-023": ["Tasks & Workflow", "legacy-sla"],
  "AD-024": ["Tasks & Workflow", "legacy-workflow-exceptions"],
  "AD-025": ["Staff & Volunteers", "legacy-roster"],
  "AD-026": ["Staff & Volunteers", "legacy-volunteers"],
  "AD-027": ["Fleet & Resources", "legacy-fleet"],
  "AD-028": ["Fleet & Resources", "legacy-service-network"],
  "AD-029": ["Fleet & Resources", "legacy-inventory"],
  "AD-030": ["Fleet & Resources", "legacy-readiness"],
  "AD-031": ["Communication Hub"],
  "AD-032": ["Communication Hub", "email"],
  "AD-033": ["Communication Hub", "whatsapp"],
  "AD-034": ["Communication Hub", "inbound-calls"],
  "AD-035": ["Communication Hub", "outbound-calls"],
  "AD-036": ["AI Operations"],
  "AD-037": ["Communication Hub", "templates-sms"],
  "AD-038": ["Communication Hub", "leads"],
  "AD-039": ["Finance & Approvals"],
  "AD-040": ["Finance & Approvals", "department-finance"],
  "AD-041": ["Finance & Approvals", "donations"],
  "AD-042": ["Finance & Approvals", "procurement"],
  "AD-043": ["Training & Quality"],
  "AD-044": ["Training & Quality", "assessment"],
  "AD-045": ["Training & Quality", "performance"],
  "AD-046": ["Training & Quality", "recognition"],
  "AD-047": ["Reports & MIS"],
  "AD-048": ["Complaints & Feedback"],
  "AD-049": ["Knowledge Base & SOP"],
  "AD-050": ["Settings"],
};

export type PlacedScreen = Screen & { section: string; sectionSlug: string; sub?: string; href: string };

export const adScreens: PlacedScreen[] = [...screensA, ...screensB, ...screensC, ...screensD, ...screensE]
  .sort((a, b) => a.code.localeCompare(b.code))
  .map((s) => {
    const [section, sub] = placement[s.code];
    const sectionSlug = slugify(section);
    const href = s.code === "AD-001" ? B : sub ? `${B}/${sectionSlug}/${sub}` : `${B}/${sectionSlug}`;
    return { ...s, section, sectionSlug, sub, href };
  });

export const screenByCode = (code: string) => adScreens.find((s) => s.code === code);

/** Extra links (top-bar profile / notifications / legacy URLs) that open a screen. */
const extraSections: Record<string, string> = {
  "my-profile": "AD-006",
  notifications: "AD-003",
  "notification-alerts": "AD-003",
  "pending-approvals": "AD-004",
  "daily-work-planner": "AD-005",
  "team-users": "AD-006",
  "user-profile": "AD-006",
  "team-availability": "AD-007",
  "attendance-hrms": "AD-007",
  "task-allocation": "AD-013",
};

/** Screen shown at /dashboard/admin/<section>[/<sub>]. */
export function screenAt(section: string, sub?: string) {
  if (!sub && extraSections[section]) return screenByCode(extraSections[section]);
  return adScreens.find((s) => s.code !== "AD-001" && s.sectionSlug === section && s.sub === sub);
}

/** Buttons that open another screen instead of recording an action. */
export const actionTargets: Record<string, string> = {
  "Create request": "AD-009",
  "Create task": "AD-013",
  "Assign task": "AD-013",
  "Open case": "AD-012",
  "View profile": "AD-006",
  "View work history": "AD-006",
  Approvals: "AD-004",
  "Open task list": "AD-013",
  "View task history": "AD-013",
  "View documents": "AD-010",
  "Open communication": "AD-031",
  "Open inbox": "AD-031",
  "Open linked thread": "AD-032",
  "Open ledger": "AD-039",
  "Review closure": "AD-012",
  "View roster": "AD-016",
  "Calendar view": "AD-005",
  "Review approvals": "AD-004",
  "Review dispatch": "AD-018",
  "View availability": "AD-007",
  "Review legal": "AD-010",
  "Shift roster": "AD-007",
  "Open SOS queue": "AD-016",
  "View GPS": "AD-016",
  "View tracking": "AD-016",
  "Review training": "AD-044",
  "Assign training": "AD-044",
  "Assign course": "AD-044",
  "Nominate recognition": "AD-046",
  "Request access change": "AD-050",
  "Request access": "AD-050",
};
