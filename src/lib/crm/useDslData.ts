"use client";

import { useEffect, useState } from "react";
import { qs, useCrmQuery, useDebounced } from "@/lib/api/useCrmQuery";
import { useRecordId, useRecordKind, useResource } from "./useResource";
import { useDashboardData } from "./useDashboardData";
import { screenSource } from "./screenSources";
import { at, count, EMPTY, object, records, text, type CrmRecord } from "./data";
import { tableRows } from "./tableValues";
import { humanize } from "@/lib/format";

export function useDslData(code: string, tab: string, query: string, selected: number, show: (message: string) => void) {
  const kind = useRecordKind();
  let config = screenSource(code, tab);
  if (kind === "materialrequest" && config?.module === "inventory" && /material|issue/i.test(tab)) config = { ...config, base: "/inventory/material-requests", detail: true };
  const routeId = useRecordId();
  const [picked, setPicked] = useState<{ base: string; id: string } | null>(null);
  const pickedId = picked?.base === config?.base ? picked?.id : null;
  const search = useDebounced(query.trim());
  const [range] = useState(() => {
    const now = new Date();
    const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
    const from = `${day.slice(0,8)}01T00:00:00+05:30`;
    return { from, to: new Date(Date.parse(from) + 31 * 86400000).toISOString() };
  });
  const params = config?.module === "planner" ? { ...range, includeTeam: true } : config?.search ? { search: search || undefined } : {};
  const live = useResource(config?.base ?? null, config?.module ?? "", show, params, { ...config, detail: false, ...(config ? {} : { summary: null }) });
  const enabled = !!config && (live.can(`${config.module}.view`) || config.base === "/notifications");
  const extra0 = useCrmQuery<unknown>(enabled ? config?.extras?.[0] ?? null : null);
  const extra1 = useCrmQuery<unknown>(enabled ? config?.extras?.[1] ?? null : null);
  const extra2 = useCrmQuery<unknown>(enabled ? config?.extras?.[2] ?? null : null);
  const dashboard = useDashboardData(code === "AD-001");
  const volunteerSummary = useCrmQuery<CrmRecord>(enabled && config?.module === "live_operations" && live.can("volunteers.view") ? "/volunteers/summary" : null);
  const taskSummary = useCrmQuery<CrmRecord>(enabled && config?.module === "live_operations" && live.can("tasks.view") ? "/tasks/summary" : null);
  const entityBase: Record<string,string> = { trip: "/fleet/trips", vehicle: "/fleet/vehicles", driver: "/fleet/drivers", materialrequest: "/inventory/material-requests", purchaserequest: "/inventory/purchase-requests", stockaudit: "/inventory/stock-audits" };
  const matchingRouteId = !kind || !entityBase[kind] || config?.base === entityBase[kind] ? routeId : null;
  const selectedRecord = pickedId || matchingRouteId ? live.rows.find(row => row.id === (pickedId ?? matchingRouteId)) : live.rows[selected] ?? live.rows[0];
  const selectedId = pickedId ?? matchingRouteId ?? text(selectedRecord?.id, "");
  // Detail selection is driven by the actual row id; no client-generated ids or versions.
  const selectedDetail = useCrmQuery<CrmRecord>(enabled && config?.detail !== false && selectedId ? `${config?.base}/${selectedId}` : null);
  const detail = selectedDetail.data ?? (config?.detail === false ? selectedRecord : null);
  const documentBase = config?.module === "requests" || config?.module === "cases" || config?.module === "volunteers" || (config?.module === "fleet" && !config.base.endsWith("/trips")) || config?.module === "service_network";
  const documents = useCrmQuery<CrmRecord[]>(enabled && selectedId && documentBase ? `${config?.base}/${selectedId}/documents` : null);
  const sessions = useCrmQuery<CrmRecord[]>(enabled && selectedId && config?.module === "users" ? `/users/${selectedId}/sessions` : null);
  const devices = useCrmQuery<CrmRecord[]>(enabled && selectedId && config?.module === "users" ? `/users/${selectedId}/devices` : null);
  const availabilityCount = useCrmQuery<CrmRecord[]>(enabled && config?.module === "volunteers" ? "/volunteers?availability=UNAVAILABLE&limit=1" : null);
  const verifiedCount = useCrmQuery<CrmRecord[]>(enabled && config?.module === "service_network" ? "/network/partners?verification=VERIFIED&limit=1" : null);
  const itemCount = useCrmQuery<CrmRecord[]>(enabled && config?.module === "inventory" ? "/inventory/items?status=ACTIVE&limit=1" : null);
  const trail = useCrmQuery<CrmRecord>(enabled && config?.module === "live_operations" && selectedRecord?.dutySessionId && live.can("live_operations.manage") && live.profile?.accessLevel !== "USER" ? `/live/duty/${selectedRecord.dutySessionId}/trail` : null);
  const summary = live.summary.data ?? object(at(live.list.data,"summary"));
  const fields: Record<string, string[]> = {
    Name: ["name"], "Volunteer name": ["name"], "Vehicle ID": ["registrationNo"], "Registration number": ["registrationNo"],
    "Request ID": ["requestNo"], "Case ID": ["caseNo"], "Task ID": ["taskNo"], "User ID": ["crmId"],
    "Assigned owner": ["owner.name"], Owner: ["owner.name"], Assignee: ["assignee.name"],
    "Case owner": ["owner.name"], "Selected profile": ["name"], "Access level": ["accessLevel"],
    Department: ["department.name"], Centre: ["centre.name"], Mobile: ["mobileMasked"],
    "Legal clearance": ["legal.state", "request.legal"], Status: ["status", "stage"],
    "Training status": ["trainingStatus"], "ID verification": ["onboarding.idVerifiedAt"],
    "GPS sharing": ["sharingLocation"], "Last GPS": ["location.at"], "Service capacity": ["capacityPerDay"],
    "Regular driver": ["driver.name"], "Licence valid to": ["licence.validTo"],
    "On hand": ["quantity"], "Stock available": ["quantity"], "Reorder level": ["item.reorderLevel"],
  };
  const metrics: Record<string, string> = config?.module === "volunteers" ? {
    Volunteers: "total", "Total volunteers": "total", "Registered volunteers": "total", Active: "active", "Active volunteers": "active",
    "Volunteers available": "availableNow", "Available now": "availableNow", Available: "availableNow",
    Onboarding: "onboarding", "Pending onboarding": "onboarding", "Verification pending": "onboarding", "Training pending": "trainingPending", "Training due": "trainingPending",
    "Emergency on-call": "emergencyOnCall", "Service hours": "hoursThisMonth",
  } : config?.module === "fleet" ? {
    Vehicles: "vehicles.total", "Total vehicles": "vehicles.total", "Fleet registered": "vehicles.total", "Vehicles available": "vehicles.available", "Vehicle available": "vehicles.available",
    Available: "vehicles.available", Deployed: "vehicles.onTrip", "Vehicle deployed": "vehicles.onTrip", "On trip": "vehicles.onTrip", Maintenance: "vehicles.maintenance",
    "Trips today": "tripsToday", "Drivers on duty": "driversOnDuty", "Document expiry": "vehiclesWithExpiringDocuments",
    "Pending dispatch": "tripsAwaitingApproval", "Trips on road": "tripsOnRoad", "Vehicles ready": "vehicles.available",
  } : config?.module === "service_network" ? {
    Partners: "total", "Network partners": "total", "Total partners": "total", "Review pending": "pendingVerification", "Pending verification": "pendingVerification", "Active agreements": "activeAgreements",
    "Expiring agreements": "agreementsExpiringSoon", "Expired agreements": "agreementsExpired",
  } : config?.module === "inventory" ? {
    "Low stock": "lowStockLines", "Low stock items": "lowStockLines", "Out of stock": "outOfStockLines",
    "Material requests": "materialRequestsAwaitingApproval", "Pending requests": "materialRequestsAwaitingApproval",
    "Purchase requests": "purchasesAwaitingApproval", "Pending procurement": "purchasesAwaitingApproval",
    "Ready to issue": "materialRequestsToIssue", "Pending issues": "materialRequestsToIssue", "Stock audits": "stockCountsAwaitingApproval",
  } : config?.module === "requests" ? {
    Requests: "thisMonth", "New requests": "byStatus.NEW", "Pending verification": "pendingVerification", "Verification pending": "pendingVerification",
    Emergency: "emergencyOpen", "Emergency requests": "emergencyOpen", Unassigned: "unassigned", "Unassigned requests": "unassigned",
    "Out of coverage": "outOfCoverage", "Possible duplicates": "pendingDuplicateReview", "On hold": "byStatus.ON_HOLD",
  } : config?.module === "cases" ? {
    "Active cases": "active", "Emergency cases": "emergencyActive", "On hold": "onHold", "Closed this month": "closedThisMonth",
    "Closure pending": "awaitingClosureDecision", "SLA breaches": "slaBreached", Reopened: "reopenedActive",
  } : config?.module === "tasks" ? {
    "Open tasks": "open", "Pending tasks": "open", Overdue: "overdue", "Overdue tasks": "overdue", "Due today": "dueToday",
    "Awaiting acceptance": "awaitingAcceptance", "Overdue subset": "overdue", "Acknowledgement due": "awaitingAcceptance", "In progress": "inProgress", "Evidence review": "submittedForReview", "Completed today": "completedToday", "Review pending": "submittedForReview",
  } : config?.module === "attendance" ? { "Staff on duty": "onDuty", "On duty": "onDuty", "On leave": "onLeave", "Checked in": "checkedIn" }
    : config?.module === "approvals" ? { "Pending approvals": "pending", Pending: "pending", Critical: "critical", Overdue: "overdue", "Awaiting me": "awaitingMyDecision" }
    : config?.module === "users" ? { Users: "total", "Assigned users": "total", Active: "active", "Active users": "active", "Pending access": "pendingAccessRequests", "Active sessions": "activeSessions" }
    : config?.module === "notifications" ? { Unread: "unread", "Unread alerts": "unread", "Critical alerts": "critical" } : {};
  function value(label: string): string {
    if (code === "AD-001") return dashboard.value(label);
    if (label === "Unavailable" && config?.module === "volunteers") return count(availabilityCount.meta?.total);
    if (label === "Verified" && config?.module === "service_network") return count(verifiedCount.meta?.total);
    if (label === "Item types" && config?.module === "inventory") return count(itemCount.meta?.total);
    if (label === "Shown item lines" && config?.module === "inventory") return live.list.data ? count(live.rows.length) : EMPTY;
    if (config?.module === "live_operations") {
      if (label === "Volunteers available") return count(volunteerSummary.data?.availableNow);
      if (label === "Overdue tasks") return count(taskSummary.data?.overdue);
      if (label === "Unacknowledged") return count(taskSummary.data?.awaitingAcceptance);
      const roster = config.base === "/live/roster" ? live.list.data : extra0.data;
      const path = label === "Staff on duty" ? "summary.onDuty" : label === "GPS stale" ? "summary.stale" : undefined;
      if (path) return count(at(roster,path));
    }
    const metric = metrics[label];
    if (metric) return count(at(summary, metric) ?? (/^byStatus\.|^byStage\./.test(metric) && live.summary.data ? 0 : undefined));
    for (const path of fields[label] ?? []) { const v = at(detail,path); if (v !== undefined && v !== null) return text(v); }
    return EMPTY;
  }
  function rowsFor(title: string): CrmRecord[] {
    const lower = title.toLowerCase();
    if (/timeline|history|activity/.test(lower)) return records(detail?.timeline);
    if (/document|evidence/.test(lower)) return records(documents.data ?? detail?.documents);
    if (/session/.test(lower)) return records(sessions.data);
    if (/device/.test(lower)) return records(devices.data);
    if (/checklist/.test(lower)) return records(detail?.checklist);
    if (/agreement/.test(lower)) return records(detail?.agreements);
    if (config?.module === "fleet") {
      if (/maintenance/.test(lower)) return records(detail?.maintenance);
      if (/driver/.test(lower)) return records(extra0.data);
      if (/trip|dispatch/.test(lower)) return records(extra1.data);
    }
    if (config?.module === "inventory") {
      if (/material request/.test(lower)) return records(extra0.data);
      if (/purchase|procurement/.test(lower)) return records(extra1.data);
      if (/movement|ledger/.test(lower)) return records(extra2.data);
    }
    if (config?.module === "planner" && /handover/.test(lower)) return records(extra0.data);
    if (config?.module === "live_operations") {
      const roster = config.base === "/live/roster" ? live.list.data : extra0.data;
      if (/vehicle|fleet/.test(lower)) return records(at(roster,"vehicles"));
      if (/roster|staff|location|safety/.test(lower)) return records(at(roster,"people"));
      if (/assignment/.test(lower)) return records(extra0.data);
    }
    if (config?.module === "sla") {
      if (/rule/.test(lower)) return records(extra0.data);
      if (/escalation/.test(lower)) return records(extra1.data);
    }
    return live.rows;
  }
  const refreshLive = config?.module === "live_operations";
  const reloadList = live.list.reload;
  const reloadExtra = extra0.reload;
  useEffect(() => {
    if (!refreshLive) return;
    const refresh = () => { if (document.visibilityState === "visible") { reloadList(); reloadExtra(); } };
    const timer = window.setInterval(refresh, 30_000);
    document.addEventListener("visibilitychange", refresh);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, [refreshLive, reloadList, reloadExtra]);
  return { ...live, code, config, enabled: !!config, detail, selectedDetail, selectedRecord, summary, value, rowsFor,
    table: (title: string, columns: string[]) => tableRows(columns, rowsFor(title)), dashboard,
    extras: [extra0, extra1, extra2], trail, status: humanize(text(detail?.status ?? detail?.stage,"")),
    queryString: qs(params), chooseIndex: (index: number) => setPicked(config && live.rows[index]?.id ? { base: config.base, id: text(live.rows[index].id, "") } : null),
  };
}
