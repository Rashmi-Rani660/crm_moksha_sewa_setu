"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { entityHref } from "./navigation";
import { authorizedRequest } from "@/lib/api/authorized";
import { errorMessage } from "@/lib/api/client";
import { qs } from "@/lib/api/useCrmQuery";
import { useDocumentUpload } from "./useResource";
import { at, choose, EMPTY, istTimestamp, number, reason, records, text, type CrmRecord } from "./data";
import type { useDslData } from "./useDslData";

type Data = ReturnType<typeof useDslData>;
const input = (label: string, initial = "") => window.prompt(label, initial)?.trim();

/** Existing controls call explicit CRM actions. Unsupported controls stay in place, disabled. */
export function useScreenActions(data: Data, show: (message: string) => void) {
  const router = useRouter();
  const [fields, setFields] = useState<Record<string, string>>({});
  const locked = useRef(false);
  const upload = useDocumentUpload(show, !!data.config);
  const setField = (label: string, value: string) => setFields(prev => ({ ...prev, [label]: value }));
  const resourceModule = data.config?.module ?? "";
  const path = data.config?.base ?? "";
  const selected = data.selectedDetail.data ?? data.selectedRecord;
  const version = number(selected?.version);
  const id = text(selected?.id, "");
  const pick = async (endpoint: string, label: string, key = "name") => choose((await authorizedRequest<CrmRecord[]>(endpoint)).data, label, key);
  const centre = async () => data.profile?.centres.length === 1 ? data.profile.centres[0] : pick("/geography/centres?status=ACTIVE&limit=100", "Choose a centre");
  const get = (...labels: string[]) => labels.map(label => fields[label]).find(Boolean);
  const required = (labels: string[], prompt: string) => get(...labels) || input(prompt);
  const withVersion = (body: CrmRecord) => {
    if (version === undefined || !id) throw new Error("Wait for the current record details to load.");
    return { ...body, version };
  };
  async function post(suffix: string, body: CrmRecord = {}, method: "POST" | "PATCH" = "POST") {
    return data.mutation.run<CrmRecord>(`${path}/${id}${suffix ? `/${suffix}` : ""}`, { method, body: withVersion(body) }, "Saved.");
  }
  const actions: Record<string, [string, string]> = {
    "Assign owner": ["assign", "requests.assign"], "Merge duplicate": ["duplicate", "requests.edit"],
    "Return for clarification": ["hold", "requests.edit"], "Record review": ["legal", "requests.edit"],
    "Release dispatch": ["convert", "cases.create"],
    "Assign team": ["assign", "cases.assign"], Reassign: [resourceModule === "tasks" ? "reassign" : "assign", `${resourceModule}.assign`],
    "Approve closure": ["closure", "cases.edit"], "Request reopening": ["reopen", "cases.edit"], "Reopen request": ["reopen", "cases.edit"],
    "Allocate vehicle": ["dispatch", "fleet.assign"], Allocate: ["dispatch", "fleet.assign"],
    "Verify documents": ["verification", "service_network.approve"],
    "Issue material": ["issue", "inventory.edit"], "Issue / return": ["issue", "inventory.edit"],
    "Submit for verification": ["start-verification", "requests.edit"],
    "Accept task": ["accept", "tasks.edit"], "Start task": ["start", "tasks.edit"], "Submit completion": ["submit", "tasks.edit"],
    "Approve completion": ["approve", "tasks.approve"], "Return for changes": ["return", "tasks.approve"],
  };
  function grant(label: string): string | undefined {
    if (label === "Submit for verification" && data.config?.base === "/requests") return "requests.create";
    if (/^(Preview evidence|Review evidence|View evidence|Open received document|View agreement|Review agreement|Maintenance log|View details|Review selected|Review volunteer|Review task|Review case|Review trip|Refresh status|Review history|View history|Review readiness|Review documents|Review checklist|Review stock|Preview checklist|Preview app|Review capacity|Skills filter|Availability filter|Review match|Preview assignment)$/.test(label)) return `${resourceModule}.view`;
    if (/^(Request correction|Correction request)$/.test(label) && resourceModule === "attendance") return "attendance.edit";
    if (/^(Assign selected|Save assignment)$/.test(label) && resourceModule === "tasks") return "tasks.assign";
    if (label === "Register volunteer") return "volunteers.create";
    if (label === "Add partner") return "service_network.create";
    if (label === "Create trip") return "fleet.create";
    if (/^(Schedule service|Request maintenance|Report issue)$/.test(label)) return "fleet.edit";
    if (/^(Request material|Request purchase)$/.test(label)) return "inventory.create";
    if (/^(Stock adjustment|Stock audit)$/.test(label)) return "inventory.edit";
    if (label === "Review verification") return "volunteers.edit";
    if (/^(Approve within limit|Reject)$/.test(label) && resourceModule === "approvals") return "approvals.approve";
    if (label === "Acknowledge") return resourceModule === "notifications" ? "inbox" : "sla.view";
    if (/^(Add work item|Schedule meeting|Set reminder)$/.test(label)) return "planner.create";
    if (label === "Save draft") return resourceModule === "workflows" ? "workflows.edit" : undefined;
    if (label === "Submit for approval" && resourceModule === "tasks") return "tasks.create";
    return actions[label]?.[1];
  }
  function canAct(label: string) {
    if (/^(Request correction|Correction request)$/.test(label) && selected?.userId === data.profile?.id) return false;
    const key = grant(label);
    if (!key || data.mutation.busy || upload.busy) return false;
    return key === "inbox" ? !!data.profile : data.can(key);
  }
  async function act(label: string) {
    if (locked.current || !canAct(label)) return;
    locked.current = true;
    try {
      if (/^(Refresh status|Skills filter|Availability filter|Review capacity)$/.test(label)) { data.reload(); return; }
      if (/^(Preview evidence|Review evidence|View evidence|Open received document|Review documents)$/.test(label)) {
        const docs = data.rowsFor("Documents");
        const doc = choose(docs, "Choose a document", "title");
        const url = text(doc?.url, "");
        if (url && /^https?:\/\//.test(url)) window.open(url, "_blank", "noopener,noreferrer");
        else show(EMPTY);
        return;
      }
      if (label === "Review trip") {
        const trip = path.endsWith("/trips") ? selected : await pick("/fleet/trips?limit=100","Choose trip","tripNo");
        if (!trip?.id) return;
        const current = (await authorizedRequest<CrmRecord>(`/fleet/trips/${trip.id}`)).data;
        const driverId = text(at(current,"driver.id"),"");
        const driver = driverId && !data.can("fleet.assign") ? (await authorizedRequest<CrmRecord>(`/fleet/drivers/${driverId}`)).data : null;
        const operator = data.can("fleet.assign") || driver?.crmUserId === data.profile?.id;
        const choices = [{ name: "View trip",code: "view" },...(operator && current.status === "DISPATCHED" ? [{ name: "Start trip",code: "start" }] : []),...(operator && current.status === "IN_PROGRESS" ? [{ name: "Complete trip",code: "complete" }] : []),...(data.can("fleet.create") && current.status === "COMPLETED" ? [{ name: "Record trip costs",code: "costs" }] : [])];
        const action = choose(choices,"Trip action"); if (!action) return;
        if (action.code === "view") { show(`${text(current.tripNo)} · ${text(current.status)} · ${text(at(current,"vehicle.registrationNo"))}`); return; }
        let body: CrmRecord = { version: current.version };
        if (action.code === "start" || action.code === "complete") {
          const reading = Number(input(action.code === "start" ? "Starting odometer (km):" : "Ending odometer (km):"));
          if (!Number.isInteger(reading) || reading < 0) return;
          body[action.code === "start" ? "odometerStart" : "odometerEnd"] = reading;
        } else {
          const fuel = Number(input("Fuel cost (rupees):")); const toll = Number(input("Toll cost (rupees):")); const other = Number(input("Other cost (rupees):"));
          if (![fuel,toll,other].every(value => Number.isFinite(value) && value >= 0)) return;
          body = { ...body,fuel: Math.round(fuel * 100),toll: Math.round(toll * 100),other: Math.round(other * 100) };
        }
        await data.mutation.run(`/fleet/trips/${current.id}/${action.code}`, { body }, "Trip updated."); return;
      }
      if (label === "Maintenance log") {
        const vehicle = path.endsWith("/vehicles") ? selected : await pick("/fleet/vehicles?limit=100","Choose vehicle","registrationNo");
        if (!vehicle?.id) return;
        const maintenance = (await authorizedRequest<CrmRecord[]>(`/fleet/vehicles/${vehicle.id}/maintenance`)).data;
        const record = choose(maintenance,"Choose maintenance record","kind");
        if (!record) { show("No maintenance records."); return; }
        if (!data.can("fleet.edit")) { show(`${text(record.kind)} · ${text(record.status)}`); return; }
        const action = choose([{ name: "View record",code: "view" },...(record.status === "SCHEDULED" ? [{ name: "Start maintenance",code: "start" }] : []),...(record.status === "IN_PROGRESS" ? [{ name: "Complete maintenance",code: "complete" }] : []),...(["SCHEDULED","IN_PROGRESS"].includes(text(record.status)) ? [{ name: "Cancel maintenance",code: "cancel" }] : [])],"Maintenance action");
        if (!action) return;
        if (action.code === "view") { show(`${text(record.kind)} · ${text(record.status)} · ${text(record.scheduledAt)}`); return; }
        const body: CrmRecord = { version: record.version };
        if (action.code === "cancel") { const note = reason(); if (!note) return; body.reason = note; }
        if (action.code === "complete") { const amount = Number(input("Maintenance cost (rupees):")); if (!Number.isFinite(amount) || amount < 0) return; body.cost = Math.round(amount * 100); }
        await data.mutation.run(`/fleet/vehicles/${vehicle.id}/maintenance/${record.id}/${action.code}`, { body }, "Maintenance updated."); return;
      }
      if (/^(View details|Review selected|Review volunteer|Review task|Review case|Review history|View history|Review readiness|Review checklist|Review stock|Preview checklist|Preview app|Review match|Preview assignment)$/.test(label)) {
        if (resourceModule === "approvals" && data.detail) {
          const href = entityHref(text(data.detail.entityType,""),text(data.detail.entityId,""),data.code.startsWith("AD-") ? "admin" : "super-admin");
          if (href) router.push(href);
          return;
        }
        show(data.detail ? Object.entries(data.detail).filter(([,v]) => typeof v === "string" || typeof v === "number").map(([k,v]) => `${k}: ${text(v)}`).join("\n") : data.empty); return;
      }
      if (/^(View agreement|Review agreement)$/.test(label)) {
        if (!id) return;
        const agreements = records(data.detail?.agreements);
        const choices = [{ name: "View agreement",code: "view" },...(data.can("service_network.edit") ? [{ name: "Add agreement",code: "add" }] : []),...(data.can("service_network.approve") ? [{ name: "Activate agreement",code: "activate" },{ name: "Terminate agreement",code: "terminate" }] : [])];
        const action = label === "View agreement" ? choices[0] : choose(choices,"Agreement action"); if (!action) return;
        if (action.code === "add") {
          const title = input("Agreement title:"); const costTerms = input("Cost terms:");
          const startDate = istTimestamp((input("Start date (YYYY-MM-DD):") || "") + " 00:00"); const endDate = istTimestamp((input("End date (YYYY-MM-DD):") || "") + " 00:00");
          if (title && costTerms && startDate && endDate) await data.mutation.run(`/network/partners/${id}/agreements`, { body: { title,costTerms,startDate,endDate } }, "Agreement created."); return;
        }
        const agreement = choose(agreements,"Choose agreement","title"); if (!agreement) return;
        if (action.code === "view") { show(`${text(agreement.title)} · ${text(agreement.state)} · ${text(agreement.costTerms)}`); return; }
        const note = action.code === "terminate" ? reason() : undefined; if (action.code === "terminate" && !note) return;
        await data.mutation.run(`/network/partners/${id}/agreements/${agreement.id}/${action.code}`, { body: { version: agreement.version,...(note ? { reason: note } : {}) } }, "Agreement updated."); return;
      }
      if (label === "Register volunteer") {
        const name = required(["Name", "Volunteer name"], "Volunteer name:");
        const mobile = required(["Mobile", "Mobile number"], "Mobile (10 digits):");
        const c = await centre(); if (!name || !mobile || !c) return;
        await data.mutation.run("/volunteers", { body: { name, mobile, centreId: c.id } }, "Volunteer registered."); return;
      }
      if (label === "Review verification") {
        const gate = input("Onboarding action: screen, consent, induction, verify-id, activate, reject");
        if (!gate || !["screen", "consent", "induction", "verify-id", "activate", "reject"].includes(gate)) return;
        if (!data.can(`volunteers.${["verify-id", "activate", "reject"].includes(gate) ? "approve" : "edit"}`)) return;
        const note = gate === "reject" ? reason() : undefined;
        if (gate === "reject" && !note) return;
        await post(gate, note ? { reason: note } : {}); return;
      }
      if (/^(Request correction|Correction request)$/.test(label) && resourceModule === "attendance") {
        if (!selected?.userId || selected.userId === data.profile?.id) return;
        const status = input("Status: PRESENT, ON_LEAVE, ABSENT",text(selected.status,"")); const note = reason();
        if (!status || !["PRESENT","ON_LEAVE","ABSENT"].includes(status) || !note) return;
        await data.mutation.run("/workforce/attendance/corrections", { body: { userId: selected.userId,day: selected.day,status,reason: note,...(number(selected.version) !== undefined ? { version: selected.version } : {}) } }, "Attendance corrected."); return;
      }
      if (/^(Assign selected|Save assignment)$/.test(label) && resourceModule === "tasks") {
        const assignee = await pick("/tasks/assignees","Choose assignee"); const note = reason();
        if (assignee && note) await post("reassign",{ assigneeId: assignee.id,reason: note }); return;
      }
      if (label === "Add partner") {
        const name = required(["Partner name", "Name"], "Partner name:");
        const type = input("Partner type: CREMATORIUM, HOSPITAL, MORTUARY, AMBULANCE, PANDIT, NGO, POLICE, VENDOR, OTHER");
        const phone = required(["Contact number", "Phone"], "Contact phone:"); const c = await centre();
        if (!name || !type || !phone || !c) return;
        await data.mutation.run("/network/partners", { body: { name, type, centreId: c.id, contact: { phone } } }, "Partner created."); return;
      }
      if (label === "Create trip") {
        const c = await centre(); const pickup = required(["Pickup", "Pickup location"], "Pickup address:");
        const drop = required(["Drop", "Drop location"], "Drop address:");
        const scheduledAt = istTimestamp(required(["Date & time", "Scheduled at"], "Scheduled at (YYYY-MM-DD HH:MM, IST):") || "");
        const purpose = input("Purpose: BODY_TRANSPORT, FAMILY_PICKUP, MATERIAL, FIELD_VISIT, OTHER");
        if (!c || !pickup || !drop || !scheduledAt || !purpose) return;
        let caseId: unknown;
        if (purpose === "BODY_TRANSPORT") { const kase = await pick("/cases?active=true&limit=100", "Choose case", "caseNo"); if (!kase) return; caseId = kase.id; }
        const created = await data.mutation.run<CrmRecord>("/fleet/trips", { body: { centreId: c.id, pickup: { address: pickup }, drop: { address: drop }, purpose, scheduledAt, ...(caseId ? { caseId } : {}) } });
        if (created) show(text(created.status)); return;
      }
      if (/^(Schedule service|Request maintenance|Report issue)$/.test(label)) {
        const scheduledAt = istTimestamp(input("Service date (YYYY-MM-DD HH:MM, IST):") || ""); if (!scheduledAt || !id) return;
        await data.mutation.run(`/fleet/vehicles/${id}/maintenance`, { body: { kind: label === "Report issue" ? "REPAIR" : "SERVICE", scheduledAt } }, "Maintenance scheduled."); return;
      }
      if (/^(Request material|Request purchase|Stock adjustment|Stock audit)$/.test(label)) {
        const c = await centre(); const item = await pick("/inventory/items?status=ACTIVE&limit=100", "Choose item");
        const quantity = Number(required(["Quantity"], label.includes("Stock") ? "Counted quantity:" : "Quantity:"));
        if (!c || !item || !Number.isInteger(quantity) || quantity < (label.includes("Stock") ? 0 : 1)) return;
        let endpoint = "/inventory/material-requests", body: CrmRecord;
        if (label.includes("Stock")) { endpoint = "/inventory/stock-audits"; body = { centreId: c.id, lines: [{ itemId: item.id, countedQty: quantity }] }; }
        else if (label === "Request purchase") {
          const vendor = input("Vendor:"); const justification = reason("Purchase justification (at least 5 characters):");
          const cost = Number(input("Unit cost in rupees:"));
          if (!vendor || !justification || !Number.isFinite(cost) || cost < 0) return;
          endpoint = "/inventory/purchase-requests"; body = { centreId: c.id, vendor, justification, lines: [{ itemId: item.id, quantity, unitCost: Math.round(cost * 100) }] };
        } else { const purpose = required(["Purpose"], "Purpose:"); if (!purpose) return; body = { centreId: c.id, purpose, lines: [{ itemId: item.id, quantity }] }; }
        const result = await data.mutation.run<CrmRecord>(endpoint, { body }); if (result) show(text(result.status)); return;
      }
      if (label === "Acknowledge") {
        if (resourceModule === "notifications" && id) await data.mutation.run(`/notifications/${id}/acknowledge`, { method: "POST" }, "Acknowledged.");
        else {
          const escalation = choose(records(data.extras[1].data), "Choose escalation", "reference"); if (!escalation) return;
          await data.mutation.run(`/sla/escalations/${escalation.id}/acknowledge`, { method: "POST" }, "Acknowledged.");
        }
        return;
      }
      if (resourceModule === "approvals" && /^(Approve within limit|Reject|Return)$/.test(label)) {
        if (!data.detail?.canDecide || !id) return;
        const note = get("Decision reason") || reason(); if (!note || note.length < 5) return;
        await data.mutation.run(`/approvals/${id}/decision`, { body: { decision: label === "Approve within limit" ? "APPROVE" : "REJECT", reason: note } }, "Decision saved."); return;
      }
      if (/^(Add work item|Schedule meeting|Set reminder)$/.test(label)) {
        const title = required(["Title", "Work item", "Meeting title"], "Planner title:");
        const startAt = istTimestamp(required(["Start time", "Date & time"], "Start (YYYY-MM-DD HH:MM, IST):") || "");
        if (!title || !startAt) return;
        await data.mutation.run("/workforce/planner", { body: { title, startAt, type: label === "Schedule meeting" ? "MEETING" : label === "Set reminder" ? "REMINDER" : "OTHER", visibility: "TEAM" } }, "Planner item saved."); return;
      }
      if (resourceModule === "workflows" && label === "Save draft") {
        const name = required(["Template name", "Name"], "Template name:"); if (name) await post("", { name }, "PATCH"); return;
      }
      if (resourceModule === "requests" && label === "Submit for verification") {
        const name = required(["Requester", "Requester / authority"], "Requester name:");
        const mobile = required(["Mobile", "Mobile / contact"], "Requester mobile (10 digits):");
        const pincode = input("Service PIN code (6 digits):");
        const channel = await pick("/master-data?type=REQUEST_CHANNEL&status=ACTIVE&limit=100", "Request channel", "label");
        const category = await pick("/master-data?type=BENEFICIARY_CATEGORY&status=ACTIVE&limit=100", "Beneficiary category", "label");
        if (!name || !mobile || !pincode || !channel || !category) return;
        if (!window.confirm("Has the family consented to processing their data?")) return;
        const created = await data.mutation.run<CrmRecord>("/requests", { body: { requester: { name,mobile }, location: { pincode, ...(get("Pickup area") ? { area: get("Pickup area") } : {}) }, channel: channel.code, beneficiaryCategory: category.code, notes: get("Notes / instructions") ?? "",consentDataProcessing: true } }, "Request created.");
        if (created && data.can("requests.edit")) await data.mutation.run(`/requests/${created.id}/start-verification`, { body: { version: created.version } }, "Verification started.");
        return;
      }
      if (resourceModule === "tasks" && label === "Submit for approval") {
        const title = required(["Task title", "Title"], "Task title:");
        const assignee = await pick("/tasks/assignees", "Choose assignee");
        const type = await pick("/master-data?type=TASK_TYPE&status=ACTIVE&limit=100", "Task type", "label");
        const dueAt = istTimestamp(required(["Due time", "Due date / time"], "Due (YYYY-MM-DD HH:MM, IST):") || "");
        const priority = get("Priority")?.toUpperCase() || "NORMAL";
        if (!title || !assignee || !type || !dueAt) return;
        await data.mutation.run("/tasks", { body: { title,assigneeId: assignee.id,typeCode: type.code,dueAt,priority,description: get("Notes / instructions") ?? "" } }, "Task created.");
        return;
      }
      const entry = actions[label]; if (!entry) return;
      const [action] = entry; let body: CrmRecord = {};
      if (action === "assign" || action === "reassign") {
        const person = await pick("/tasks/assignees", "Choose assignee"); if (!person) return;
        body[resourceModule === "tasks" ? "assigneeId" : "ownerId"] = person.id;
        if (action === "reassign") { const note = reason(); if (!note) return; body.reason = note; }
      }
      if (["hold", "closure"].includes(action)) {
        const code = await pick(`/master-data${qs({ type: action === "hold" ? "HOLD_REASON" : "CLOSURE_REASON", status: "ACTIVE", limit: 100 })}`, "Choose reason", "label"); if (!code) return;
        body.reasonCode = code.code;
        const note = input(action === "closure" ? "Completion summary (at least 10 characters):" : "Hold note:"); if (!note) return;
        body[action === "closure" ? "summary" : "note"] = note;
      }
      if (["reopen", "return"].includes(action)) { const note = reason(); if (!note) return; body.reason = note; }
      if (action === "duplicate") { const other = await pick("/requests?limit=100", "Duplicate of", "requestNo"); if (!other) return; body.duplicateOfId = other.id; }
      if (action === "legal") {
        const authority = input("Clearing authority:"); const referenceNo = input("Clearance reference:"); if (!authority || !referenceNo) return;
        body = { state: "CLEARED", authority, referenceNo };
      }
      if (action === "verification") body = { outcome: "VERIFIED" };
      if (action === "dispatch") {
        const trip = path.endsWith("/trips") ? selected : await pick("/fleet/trips?status=APPROVED&limit=100", "Choose trip", "tripNo"); if (!trip) return;
        const c = text(at(trip,"centre.id"), "");
        const vehicle = await pick(`/fleet/vehicles${qs({ status: "AVAILABLE", centreId: c || undefined, limit: 100 })}`, "Choose vehicle", "registrationNo");
        const driver = await pick(`/fleet/drivers${qs({ onDuty: true, centreId: c || undefined, limit: 100 })}`, "Choose driver"); if (!vehicle || !driver || number(trip.version) === undefined) return;
        await data.mutation.run(`/fleet/trips/${trip.id}/dispatch`, { body: { version: trip.version, vehicleId: vehicle.id, driverId: driver.id } }, "Trip dispatched."); return;
      }
      if (action === "issue" && !path.endsWith("material-requests")) {
        const request = await pick("/inventory/material-requests?status=APPROVED&limit=100", "Choose material request", "requestNo"); if (!request) return;
        await data.mutation.run(`/inventory/material-requests/${request.id}/issue`, { body: { version: request.version } }, "Materials issued."); return;
      }
      await post(action, body);
    } catch (err) { show(err instanceof Error && !("code" in err) ? err.message : errorMessage(err)); }
    finally { locked.current = false; }
  }
  return { fields, setField, act, canAct, upload };
}
