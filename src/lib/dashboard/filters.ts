/** Dashboard filters: reporting period + centre. */

export const periodPresets = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "this-week", label: "This Week" },
  { id: "last-week", label: "Last Week" },
  { id: "this-month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
  { id: "this-quarter", label: "This Quarter" },
  { id: "this-year", label: "This Year" },
] as const;

export type PresetId = (typeof periodPresets)[number]["id"];

/** Custom ranges use `yyyy-mm-dd` strings (the value format of `<input type="date">`). */
export type Period = { id: PresetId } | { id: "custom"; from: string; to: string };

export const defaultPeriod: Period = { id: "this-month" };

/** TODO: load the centre list from the API. */
export const centres = [
  "Varanasi",
  "Prayagraj",
  "Haridwar",
  "Rishikesh",
  "Kanpur",
  "Patna",
  "Kolkata",
  "Bhagalpur",
  "Mirzapur",
  "Ghazipur",
  "Farrukhabad",
  "Garhmukteshwar",
] as const;

/** `null` means all centres. */
export type Centre = (typeof centres)[number] | null;

/* ------------------------------ date helpers ------------------------------ */

const day = (y: number, m: number, d: number) => new Date(y, m, d);
const startOfDay = (d: Date) => day(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => day(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Weeks start on Monday. */
const startOfWeek = (d: Date) => addDays(startOfDay(d), -((d.getDay() + 6) % 7));

export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fromISODate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return day(y, m - 1, d);
};

/** Inclusive date range covered by a period, relative to `now`. */
export function periodRange(period: Period, now = new Date()): { from: Date; to: Date } {
  const today = startOfDay(now);
  const y = today.getFullYear();
  const m = today.getMonth();
  switch (period.id) {
    case "today":
      return { from: today, to: today };
    case "yesterday": {
      const d = addDays(today, -1);
      return { from: d, to: d };
    }
    case "this-week":
      return { from: startOfWeek(today), to: today };
    case "last-week": {
      const from = addDays(startOfWeek(today), -7);
      return { from, to: addDays(from, 6) };
    }
    case "this-month":
      return { from: day(y, m, 1), to: today };
    case "last-month":
      return { from: day(y, m - 1, 1), to: day(y, m, 0) };
    case "this-quarter":
      return { from: day(y, m - (m % 3), 1), to: today };
    case "this-year":
      return { from: day(y, 0, 1), to: today };
    case "custom":
      return { from: fromISODate(period.from), to: fromISODate(period.to) };
  }
}

const short = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" });
const withYear = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/** e.g. "01 Nov – 25 Nov" (year added when the range crosses years). */
export function formatRange({ from, to }: { from: Date; to: Date }) {
  if (from.getTime() === to.getTime()) return withYear.format(from);
  const fmt = from.getFullYear() === to.getFullYear() ? short : withYear;
  return `${fmt.format(from)} – ${fmt.format(to)}`;
}

/** Text shown on the period button and in card subtitles. */
export function periodLabel(period: Period) {
  if (period.id === "custom") return formatRange(periodRange(period));
  return periodPresets.find((p) => p.id === period.id)!.label;
}
