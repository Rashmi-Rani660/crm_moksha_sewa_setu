/** Refresh mounted lists, details and summaries after a successful write or a stale version. */
export const CRM_CHANGED = "sewa-setu:crm-changed";

export function invalidateCrmQueries() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CRM_CHANGED));
}
