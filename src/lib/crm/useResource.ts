"use client";

import { useState, useSyncExternalStore } from "react";
import { qs, useCrmQuery } from "@/lib/api/useCrmQuery";
import { useCrmAccess } from "@/lib/api/useCrmAccess";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { at, choose, number, records, text, type CrmRecord } from "./data";

const subscribeLocation = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};
export function useRecordId() {
  return useSyncExternalStore(subscribeLocation, () => new URLSearchParams(window.location.search).get("id"), () => null);
}

export function useResource(base: string | null, module: string, show: (message: string) => void,
  params: Record<string, string | number | boolean | undefined | null> = {}, options: { summary?: string | null; paginated?: boolean; detail?: boolean; rowsKey?: string } = {}) {
  const access = useCrmAccess(base !== null);
  const routeId = useRecordId();
  const [selection, select] = useState<string | null>(null);
  const allowed = base !== null && (access.can(`${module}.view`) || (base === "/notifications" && !!access.profile));
  const list = useCrmQuery<unknown>(allowed ? `${base}${qs(options.paginated === false ? params : { page: 1, limit: 50, ...params })}` : null);
  const rows = records(options.rowsKey ? at(list.data, options.rowsKey) : list.data);
  const id = selection ?? routeId ?? (typeof rows[0]?.id === "string" ? rows[0].id : null);
  const detail = useCrmQuery<CrmRecord>(allowed && id && options.detail !== false ? `${base}/${encodeURIComponent(id)}` : null);
  const summaryPath = options.summary === undefined ? `${base}/summary` : options.summary;
  const summary = useCrmQuery<CrmRecord>(allowed && summaryPath ? summaryPath : null);
  const mutation = useCrmMutation(show);
  const reload = () => { list.reload(); detail.reload(); summary.reload(); };
  async function action(actionPath: string, permission: string, body: CrmRecord = {}, method: "POST" | "PATCH" = "POST") {
    if (mutation.busy || detail.loading || !access.can(permission)) return;
    if (!detail.data || !id || number(detail.data.version) === undefined) { show("Select a record and wait for its current details to load."); return; }
    const result = await mutation.run<CrmRecord>(`${base}/${encodeURIComponent(id)}${actionPath ? `/${actionPath}` : ""}`, {
      method, body: { ...body, version: detail.data.version },
    }, "Saved.");
    reload();
    return result;
  }
  return { ...access, list, rows, id, select, detail, summary, mutation, action, reload,
    empty: list.loading ? "Loading…" : list.error ?? access.error ?? "No records match the selected filters.",
    total: list.meta?.total,
  };
}

/** Upload bytes through the same authorised client. A document type must come from master data. */
export function useDocumentUpload(show: (message: string) => void, enabled = true) {
  const types = useCrmQuery<CrmRecord[]>(enabled ? "/master-data?type=DOCUMENT_TYPE&status=ACTIVE&limit=100" : null);
  const mutation = useCrmMutation(show);
  const uploadFile = async (path: string, file: File) => {
    const type = choose(records(types.data), "Document type", "label");
    if (!type) { show(types.error ?? "Choose a document type from master data."); return; }
    const body = new FormData();
    body.append("file", file);
    body.append("docType", text(type.code, ""));
    return mutation.run<CrmRecord>(path, { method: "POST", body }, "Uploaded.");
  };
  const pick = (path: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png,.webp,.gif,.mp4,.webm";
    input.addEventListener("change", () => { const file = input.files?.[0]; if (file) void uploadFile(path, file); }, { once: true });
    input.click();
  };
  return { ...mutation, pick, uploadFile, types: records(at(types, "data")) };
}
