"use client";

import { useRef, useState } from "react";
import { authorizedRequest } from "@/lib/api/authorized";
import { errorMessage } from "@/lib/api/client";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { humanize, shortDateTime } from "@/lib/format";
import { at, choose, count, EMPTY, istTimestamp, number, object, reason, records, text, type CrmRecord } from "./data";
import { useDocumentUpload, useResource } from "./useResource";

export type OperationModule = "requests" | "cases" | "tasks";
type Params = Record<string, string | number | boolean | undefined | null>;

export function useOperations(module: OperationModule, show: (message: string) => void, params: Params = {}) {
  const resource = useResource(`/${module}`, module, show, params);
  const upload = useDocumentUpload(show);
  const masters = useCrmQuery<CrmRecord[]>(resource.can("master_data.view") ? "/master-data?limit=100&status=ACTIVE" : null);
  const people = useCrmQuery<CrmRecord[]>(resource.can("tasks.assign") || resource.can("tasks.create") ? "/tasks/assignees" : resource.can("users.view") ? "/users?limit=100&status=ACTIVE" : null);
  const timeline = useCrmQuery<CrmRecord[]>(resource.id && resource.can(`${module}.view`) && module !== "tasks" ? `/${module}/${resource.id}/timeline` : null);
  const documents = useCrmQuery<CrmRecord[]>(resource.id && resource.can(`${module}.view`) && module !== "tasks" ? `/${module}/${resource.id}/documents` : null);
  const sync = useCrmQuery<CrmRecord>(module === "requests" && resource.can("requests.view") ? "/requests/sync" : null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const actionLock = useRef(false);
  const detail = resource.detail.data;
  const master = (type: string) => records(masters.data).filter(row => row.type === type);
  const field = (label: string, fallback = "") => fields[label] ?? fallback;
  const setField = (label: string, value: string) => setFields(prev => ({ ...prev, [label]: value }));
  const metric = (key: string) => count(at(resource.summary.data,key) ?? (/^byStatus\.|^byStage\./.test(key) && resource.summary.data ? 0 : undefined));

  const actionMap: Record<string, [string, string]> = module === "requests" ? {
    "Assign owner": ["assign", "assign"], "Manual assignment": ["assign", "assign"],
    "Start verification": ["start-verification", "edit"], "Verify request": ["verify", "approve"],
    "Submit for approval": ["verify", "approve"], "Submit for verification": ["start-verification", "edit"],
    "Save draft": ["", "edit"], "Save changes": ["", "edit"], "Update request": ["", "edit"],
    "Place on hold": ["hold", "edit"], "Release hold": ["release", "edit"],
    "Record legal clearance": ["legal", "edit"], "Mark duplicate": ["duplicate", "edit"],
    "Reject": ["reject", "approve"], "Cancel request": ["cancel", "edit"],
    "Coverage override": ["coverage-override", "manage"], "Pause SLA": ["sla/pause", "sla.manage"],
    "Resume SLA": ["sla/resume", "sla.manage"], "Convert to case": ["convert", "cases.create"],
    "Save checklist": ["checklist", "edit"],
  } : module === "cases" ? {
    "Assign case": ["assign", "assign"], "Assign team": ["assign", "assign"],
    "Update case": ["start", "edit"], "Start service": ["start", "edit"],
    "Service delivered": ["service-delivered", "edit"], "Place on hold": ["hold", "edit"],
    "Release hold": ["release", "edit"], "Submit closure": ["closure", "edit"],
    "Submit for closure": ["closure", "edit"], "Request closure": ["closure", "edit"],
    "Cancel case": ["cancel", "manage"], "Reopen case": ["reopen", "edit"],
    "Change priority": ["priority", "edit"], "Apply workflow": ["apply-workflow", "tasks.create"],
    "Pause SLA": ["sla/pause", "sla.manage"], "Resume SLA": ["sla/resume", "sla.manage"],
  } : {
    "Accept task": ["accept", "edit"], Accept: ["accept", "edit"], "Decline task": ["decline", "edit"],
    Decline: ["decline", "edit"], "Start task": ["start", "edit"], "Start work": ["start", "edit"],
    "Save checklist": ["checklist", "edit"], "Submit for review": ["submit", "edit"],
    "Submit task": ["submit", "edit"], "Submit completion": ["submit", "edit"],
    "Approve completion": ["approve", "approve"], Approve: ["approve", "approve"],
    "Return task": ["return", "approve"], "Return for changes": ["return", "approve"],
    Reassign: ["reassign", "assign"], "Reassign task": ["reassign", "assign"],
    "Cancel task": ["cancel", "edit"], "Save draft": ["", "edit"],
  };
  const permission = (label: string) => {
    const grant = actionMap[label]?.[1];
    return grant ? grant.includes(".") ? grant : `${module}.${grant}` : null;
  };
  const canAct = (label: string) => {
    if (/^(Upload|Attach)/.test(label)) return resource.can(`${module}.edit`) && !!resource.id && !upload.busy;
    const grant = permission(label);
    return !!grant && resource.can(grant) && !!detail && !resource.detail.loading && !resource.mutation.busy;
  };

  async function pickCode(type: string, label: string) {
    let rows = master(type);
    if (!rows.length) rows = (await authorizedRequest<CrmRecord[]>(`/master-data?type=${type}&status=ACTIVE&limit=100`)).data;
    return choose(rows, label, "label")?.code;
  }
  async function act(label: string, body: CrmRecord = {}) {
    if (actionLock.current || !canAct(label)) return;
    actionLock.current = true;
    try {
      if (/^(Upload|Attach)/.test(label)) { upload.pick(`/${module}/${resource.id}/${module === "tasks" ? "evidence" : "documents"}`); return; }
      const entry = actionMap[label];
      if (!entry) return;
      const [action] = entry;
      let payload = { ...body };
      if (["cancel", "reopen", "decline", "return", "sla/pause"].includes(action)) {
        const note = reason(); if (!note) return; payload.reason = note;
      }
      if (action === "assign" || action === "reassign") {
        const person = choose(records(people.data), "Choose an assignee");
        if (!person) return show(people.error ?? "No eligible assignees are available.");
        payload[module === "tasks" ? "assigneeId" : "ownerId"] = person.id;
        if (action === "reassign") { const note = reason(); if (!note) return; payload.reason = note; }
      }
      if (action === "hold" || action === "reject" || action === "closure") {
        const code = payload.reasonCode || await pickCode(action === "hold" ? "HOLD_REASON" : action === "reject" ? "REJECTION_REASON" : "CLOSURE_REASON", "Choose a reason");
        if (!code) return; payload.reasonCode = code;
        if (action === "closure") { const summary = text(payload.summary, "").trim() || window.prompt("Service completion summary (at least 10 characters):")?.trim(); if (!summary || summary.length < 10) return; payload.summary = summary; }
        else { const note = reason(); if (!note) return; payload.note = note; }
      }
      if (action === "legal") {
        const authority = window.prompt("Clearing authority:")?.trim();
        const referenceNo = window.prompt("Authority reference number:")?.trim();
        if (!authority || !referenceNo) return;
        payload = { state: "CLEARED", authority, referenceNo, ...payload };
      }
      if (action === "duplicate") {
        const other = choose(resource.rows.filter(row => row.id !== resource.id), "Duplicate of", "requestNo");
        if (!other) return; payload.duplicateOfId = other.id;
      }
      if (action === "coverage-override") {
        const centres = await authorizedRequest<CrmRecord[]>("/geography/centres?status=ACTIVE&limit=100");
        const centre = choose(centres.data, "Choose service centre"); const note = reason();
        if (!centre || !note) return; payload = { centreId: centre.id, reason: note };
      }
      if (action === "priority") {
        const priority = window.prompt("Priority: CRITICAL, HIGH or NORMAL")?.trim().toUpperCase();
        const note = reason(); if (!priority || !["CRITICAL", "HIGH", "NORMAL"].includes(priority) || !note) return;
        payload = { priority, reason: note };
      }
      if (action === "apply-workflow") {
        const templates = await authorizedRequest<CrmRecord[]>("/tasks/templates?status=ACTIVE");
        const template = choose(templates.data, "Choose workflow"); if (!template) return;
        // This endpoint's strict schema intentionally has no version field.
        await resource.mutation.run(`/${module}/${resource.id}/apply-workflow`, { body: { templateId: template.id } }, "Saved.");
        return;
      }
      if (action === "checklist" && payload.items === undefined) payload.items = records(detail?.checklist).map(item => ({ key: item.key, done: item.done }));
      if (action === "" && Object.keys(payload).length === 0) {
        const notes = window.prompt(module === "tasks" ? "Task remarks:" : "Request notes:", text(detail?.notes ?? detail?.remarks, ""));
        if (notes === null) return; payload[module === "tasks" ? "remarks" : "notes"] = notes;
      }
      await resource.action(action, permission(label)!, payload, action === "" ? "PATCH" : "POST");
    } catch (err) { show(errorMessage(err)); }
    finally { actionLock.current = false; }
  }

  async function createRequest(input: CrmRecord) {
    if (!resource.can("requests.create") || resource.mutation.busy) return;
    return resource.mutation.run<CrmRecord>("/requests", { body: input }, "Request created.");
  }
  async function createTask(input: CrmRecord) {
    if (!resource.can("tasks.create") || resource.mutation.busy) return;
    return resource.mutation.run<CrmRecord>("/tasks", { body: input }, "Task created.");
  }
  const rows: (CrmRecord & { displayId: string; displayStatus: string; displayPriority: string; displayOwner: string; displayCreated: string })[] = resource.rows.map(row => ({
    ...row, displayId: text(row.requestNo ?? row.caseNo ?? row.taskNo),
    displayStatus: humanize(text(row.status ?? row.stage, "")),
    displayPriority: humanize(text(row.priority, "")),
    displayOwner: text(at(row, module === "tasks" ? "assignee.name" : "owner.name")),
    displayCreated: shortDateTime(text(row.createdAt, "")),
  }));
  return { ...resource, rows, rawRows: resource.rows, master, pickCode, people: records(people.data),
    timeline: records(timeline.data ?? detail?.timeline), documents: records(documents.data ?? detail?.documents), sync,
    fields, field, setField, metric, act, canAct, upload, createRequest, createTask,
    due: (value: string) => istTimestamp(value), current: object(detail),
    version: number(detail?.version), EMPTY,
  };
}
