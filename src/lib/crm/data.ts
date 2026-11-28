/** Small, defensive readers for the CRM view objects. Missing fields remain neutral. */
export type CrmRecord = Record<string, unknown>;
export const EMPTY = "—";
export function object(value: unknown): CrmRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as CrmRecord : {};
}
export function at(value: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => Array.isArray(current) && /^\d+$/.test(key) ? current[Number(key)] : object(current)[key], value);
}
export function records(value: unknown): CrmRecord[] {
  return Array.isArray(value) ? value.map(object) : [];
}
export function text(value: unknown, fallback = EMPTY): string {
  if (typeof value === "string") return value || fallback;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return fallback;
}
export function number(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
export function count(value: unknown): string {
  const n = number(value);
  return n === undefined ? EMPTY : String(n).padStart(2, "0");
}
export function money(value: unknown): string {
  const n = number(value);
  return n === undefined ? EMPTY : `₹${(n / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
export function sum(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  return Object.values(object(value)).reduce<number>((total, n) => total + (number(n) ?? 0), 0);
}
export function reason(label = "Reason (at least 5 characters):"): string | undefined {
  const value = window.prompt(label)?.trim();
  if (!value || value.length < 5) return undefined;
  return value;
}
export function choose(rows: CrmRecord[], label: string, key = "name"): CrmRecord | undefined {
  if (!rows.length) return undefined;
  const answer = window.prompt(`${label}\n${rows.map((row, i) => `${i + 1}. ${text(row[key])}`).join("\n")}`);
  if (!answer) return undefined;
  const index = Number(answer) - 1;
  return Number.isInteger(index) ? rows[index] : undefined;
}
/** User-entered wall times are interpreted in IST; the server receives UTC. */
export function istTimestamp(value: string): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}$/.test(value.trim())) return undefined;
  const date = new Date(`${value.trim().replace(" ", "T")}:00+05:30`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
