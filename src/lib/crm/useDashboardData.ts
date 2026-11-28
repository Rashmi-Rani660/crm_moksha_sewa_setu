"use client";

import { useCrmAccess } from "@/lib/api/useCrmAccess";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { at, count, number, object, sum, text, type CrmRecord } from "./data";

export function useDashboardData(enabled = true) {
  const access = useCrmAccess(enabled);
  const dashboard = useCrmQuery<CrmRecord>(enabled && access.can("dashboard.view") ? "/dashboard" : null);
  const users = useCrmQuery<CrmRecord>(enabled && access.can("users.view") ? "/users/summary" : null);
  const fleet = useCrmQuery<CrmRecord>(enabled && access.can("fleet.view") ? "/fleet/summary" : null);
  const inventory = useCrmQuery<CrmRecord>(enabled && access.can("inventory.view") ? "/inventory/summary" : null);
  const volunteers = useCrmQuery<CrmRecord>(enabled && access.can("volunteers.view") ? "/volunteers/summary" : null);
  const workforce = useCrmQuery<unknown>(enabled && access.can("attendance.view") ? "/workforce/team-availability" : null);
  const data = dashboard.data;
  const metric = (path: string) => {
    const parent = path.slice(0,path.lastIndexOf("."));
    const value = at(data,path);
    return count(value === undefined && /byStatus|byStage/.test(parent) && at(data,parent) ? 0 : value);
  };
  const values: Record<string, unknown> = {
    "CRM accounts": users.data?.total, "Assigned users": users.data?.total,
    "Active admins": at(users.data, "activeByAccessLevel.ADMIN"),
    Requests: at(data, "requests.thisMonth"), "Requests this month": at(data, "requests.thisMonth"),
    "Active cases": at(data, "cases.active"), "Assigned cases": at(data, "cases.active"),
    Completed: at(data, "cases.closedThisMonth"), "Completed today": at(data, "tasks.completedToday"),
    Emergency: at(data, "requests.emergencyOpen"), "Emergency requests": at(data, "requests.emergencyOpen"),
    "Emergency cases": at(data, "cases.emergencyActive"), "Unassigned requests": at(data, "requests.unassigned"),
    "Overdue tasks": at(data, "tasks.overdue"), Overdue: at(data, "tasks.overdue"),
    "Pending tasks": at(data, "tasks.open"), "Open tasks": at(data, "tasks.open"),
    "Due today": at(data, "tasks.dueToday"), "Awaiting acceptance": at(data, "tasks.awaitingAcceptance"),
    "Pending approvals": at(data, "approvals.pending"), "Critical approvals": at(data, "approvals.critical"),
    "Escalations open": at(data, "sla.openEscalations"),
    "Inventory shortage": inventory.data?.lowStockLines,
    "Staff on duty": at(workforce.data,"summary.onDuty"), "Volunteers available": volunteers.data?.availableNow,
  };
  function value(label: string): string { return count(values[label]); }
  function status(path: string): number | undefined { return number(at(data, path)); }
  return { ...access, dashboard, data, users, fleet, inventory, volunteers, workforce, metric, value, status,
    requests: object(at(data, "requests")), cases: object(at(data, "cases")), tasks: object(at(data, "tasks")),
    requestTotal: sum(at(data, "requests.byStatus")),
    error: dashboard.error ?? users.error ?? fleet.error ?? inventory.error ?? volunteers.error ?? workforce.error,
    generatedAt: text(at(data, "generatedAt"), ""),
  };
}
