/** Only screens backed by implemented CRM modules appear here. Later phases are untouched. */
export type ScreenSource = { base: string; module: string; summary?: string | null; paginated?: boolean; detail?: boolean; rowsKey?: string; search?: boolean; extras?: string[] };
const source = (base: string, module: string, options: Partial<ScreenSource> = {}): ScreenSource => ({ base, module, search: true, ...options });
const request = source("/requests", "requests", { extras: ["/requests/sync"] });
const cases = source("/cases", "cases");
const tasks = source("/tasks", "tasks", { extras: ["/tasks/assignees"] });
const volunteers = source("/volunteers", "volunteers", { extras: ["/volunteers/sync"] });
const fleet = source("/fleet/vehicles", "fleet", { summary: "/fleet/summary", extras: ["/fleet/drivers?limit=100", "/fleet/trips?limit=100"] });
const network = source("/network/partners", "service_network", { summary: "/network/summary" });
const inventory = source("/inventory/stock", "inventory", { summary: "/inventory/summary", detail: false, extras: ["/inventory/material-requests?limit=100", "/inventory/purchase-requests?limit=100", "/inventory/movements?limit=100"] });
const planner = source("/workforce/planner", "planner", { summary: null, paginated: false, search: false, detail: false, extras: ["/workforce/handovers?limit=100"] });
const live = source("/live/emergency-queue", "live_operations", { summary: null, paginated: false, search: false, detail: false, rowsKey: "items", extras: ["/live/roster"] });
const sla = source("/sla/monitor", "sla", { summary: null, paginated: false, search: false, detail: false, rowsKey: "items", extras: ["/sla/rules", "/sla/escalations?limit=100"] });
const templates = source("/tasks/templates", "workflows", { summary: null, paginated: false, search: false });
const users = source("/users", "users", { extras: ["/departments?limit=100"] });

export const screenSources: Record<string, ScreenSource> = {
  "AD-001": source("/dashboard", "dashboard", { summary: null, paginated: false, detail: false, search: false }),
  "AD-002": live, "AD-003": source("/notifications", "notifications", { search: false, detail: false }),
  "AD-004": source("/approvals", "approvals", { detail: true }), "AD-005": planner,
  "AD-006": users, "AD-007": users,
  "AD-008": source("/workforce/team-availability", "attendance", { summary: null, paginated: false, search: false, detail: false, rowsKey: "people" }),
  "AD-009": tasks,
  "AD-010": source("/workforce/attendance", "attendance", { summary: null, search: false, detail: false, extras: ["/workforce/attendance/me", "/workforce/leave?mine=true&limit=100", "/workforce/duty/me"] }),
  "AD-011": request, "AD-012": request, "AD-013": request, "AD-014": request,
  "AD-015": cases, "AD-016": cases, "AD-017": cases, "AD-018": cases,
  "AD-019": tasks, "AD-020": tasks, "AD-021": templates, "AD-022": tasks,
  "AD-023": sla, "AD-024": sla, "AD-025": volunteers, "AD-026": volunteers,
  "AD-027": fleet, "AD-028": network, "AD-029": inventory, "AD-030": fleet,
  "AD-042": source("/inventory/purchase-requests", "inventory", { summary: "/inventory/summary" }),
  "SA-021": source("/live/roster", "live_operations", { summary: null, paginated: false, search: false, detail: false, rowsKey: "people", extras: ["/tasks?limit=100"] }),
  "SA-022": volunteers, "SA-023": fleet, "SA-024": network, "SA-025": inventory,
};

export function screenSource(code: string, tab: string): ScreenSource | undefined {
  const config = screenSources[code];
  if (!config) return;
  if (config.module === "fleet") {
    if (/driver/i.test(tab)) return { ...config, base: "/fleet/drivers" };
    if (/trip|dispatch/i.test(tab)) return { ...config, base: "/fleet/trips" };
  }
  if (config.module === "inventory" && code !== "AD-042") {
    if (/material request|issue request/i.test(tab)) return { ...config, base: "/inventory/material-requests", detail: true };
    if (/purchase|procurement/i.test(tab)) return { ...config, base: "/inventory/purchase-requests", detail: true };
    if (/audit|count/i.test(tab)) return { ...config, base: "/inventory/stock-audits", detail: true, search: false };
    if (/movement|issue.*return|ledger/i.test(tab)) return { ...config, base: "/inventory/movements", detail: false, search: false };
    if (/catalogue|items/i.test(tab)) return { ...config, base: "/inventory/items", detail: true };
  }
  return config;
}
