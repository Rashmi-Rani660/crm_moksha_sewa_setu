import { saRoutes } from "@/components/dashboards/super-admin/routes";
import { userRoutes } from "@/components/dashboards/user/routes";
import { usRoutes } from "@/components/dashboards/user/us/routes";
import type { DashboardSlug } from "@/lib/api/auth";
import { screenByCode } from "@/components/dashboards/admin/registry";

/** Existing screen routes keep their names; query parameters carry the selected real record. */
export function entityHref(type: string, id: string, role: DashboardSlug): string | null {
  const kind = type.replace(/^Crm/, "").replace(/_/g, "").toLowerCase();
  const sa: Record<string, string | undefined> = {
    request: saRoutes.requestDetails, case: saRoutes.caseDetails, task: saRoutes.tasks,
    user: saRoutes.users, role: saRoutes.roles, city: "/dashboard/super-admin/city-zone-centres",
    trip: "/dashboard/super-admin/sewa-operations/fleet-logistics", vehicle: "/dashboard/super-admin/sewa-operations/fleet-logistics",
    materialrequest: "/dashboard/super-admin/sewa-operations/inventory", purchaserequest: "/dashboard/super-admin/sewa-operations/inventory",
    stockaudit: "/dashboard/super-admin/sewa-operations/inventory", leave: usRoutes.profile,
    volunteer: "/dashboard/super-admin/sewa-operations/volunteers", partner: "/dashboard/super-admin/sewa-operations/service-network",
    broadcast: "/dashboard/super-admin/notification-alerts",
  };
  const ad: Record<string, string> = {
    request: "/dashboard/admin/requests-cases/verification", case: "/dashboard/admin/requests-cases/case-details",
    task: "/dashboard/admin/tasks-workflow/progress", user: "/dashboard/admin/user-profile",
    trip: "/dashboard/admin/fleet-resources", materialrequest: "/dashboard/admin/fleet-resources/inventory",
    purchaserequest: "/dashboard/admin/finance-approvals/procurement", stockaudit: "/dashboard/admin/fleet-resources/inventory",
    leave: "/dashboard/admin/attendance-hrms", volunteer: "/dashboard/admin/staff-volunteers/volunteers",
  };
  const us: Record<string, string> = { request: usRoutes.verification, case: usRoutes.caseDetails, task: userRoutes.taskExecution };
  const adminCodes: Record<string,string> = { request: "AD-013",case: "AD-016",task: "AD-022",user: "AD-007",trip: "AD-027",materialrequest: "AD-029",purchaserequest: "AD-042",stockaudit: "AD-029",leave: "AD-010",volunteer: "AD-026",partner: "AD-028" };
  const href = role === "super-admin" ? sa[kind] : role === "admin" ? screenByCode(adminCodes[kind])?.href ?? ad[kind] : us[kind];
  return href ? `${href}?id=${encodeURIComponent(id)}` : null;
}
