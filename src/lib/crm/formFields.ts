import type { FieldIssue } from "@/lib/api/client";

const names: Record<string,string> = {
  Requester: "requester.name", "Requester / authority *": "requester.name", "Requester / authority": "requester.name",
  "Mobile / contact *": "mobile", "Mobile / contact": "mobile", Mobile: "mobile", "Source *": "channel", Source: "channel",
  "Beneficiary category": "beneficiaryCategory", "Beneficiary category *": "beneficiaryCategory",
  "Task title": "title", "Template name": "name", "Due date / time": "dueAt", "Due time": "dueAt",
  Assignee: "assigneeId", "Assigned verifier": "ownerId", "Notes / instructions": "description",
  "Request notes": "notes", "Service location": "location", "Pickup locality *": "location.area",
  "City *": "location.city", "Service requested": "services", "Completion remarks": "summary",
  "Required date": "scheduledAt", "Quantity / unit": "quantity", "Decision reason": "reason",
};
export function fieldName(label: string) { return names[label] ?? label.replace(/\s*\*$/,"").replace(/\s+(\w)/g,(_,char: string) => char.toUpperCase()).replace(/^./,char => char.toLowerCase()); }

/** Native validation bubbles sit beside existing inputs without introducing layout or copy changes. */
export function clearFieldIssues() {
  if (typeof document === "undefined") return;
  document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input[name],select[name],textarea[name]").forEach(field => field.setCustomValidity(""));
}
export function showFieldIssues(issues: FieldIssue[]) {
  if (typeof document === "undefined") return;
  const fields = Array.from(document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input[name],select[name],textarea[name]"));
  let first: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined;
  for (const issue of issues) {
    const field = fields.find(input => input.name === issue.field || issue.field.endsWith(`.${input.name}`));
    if (!field) continue;
    field.setCustomValidity(issue.message);
    field.addEventListener("input",() => field.setCustomValidity(""),{ once: true });
    first ??= field;
  }
  first?.reportValidity();
}
