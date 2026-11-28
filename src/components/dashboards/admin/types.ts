import type { LucideIcon } from "lucide-react";
import type { TileTone } from "@/components/dashboards/super-admin/kit";

/**
 * Content model of the Admin screens AD-001 … AD-050 (Admin Master Developer
 * Design Book). Every screen shares one layout (see AdScreen.tsx): heading,
 * KPI tiles, tab bar and rows of panels. Demo data only.
 *
 * Text cells may carry a pill colour prefix: "r:" red, "a:" amber, "g:" green,
 * "b:" blue, "p:" purple, "x:" grey — e.g. "r:Emergency".
 */
export type Cell = string;

export type BarColor = "blue" | "amber" | "red" | "green";

export type Kpi = { v: string; l: string; tone?: TileTone; icon?: LucideIcon };

export type Field = {
  label: string;
  value: string;
  /** input (default), select (with options), readonly, textarea. */
  kind?: "input" | "select" | "readonly" | "textarea";
  options?: string[];
  /** Spans both columns of the form. */
  wide?: boolean;
};

export type Block =
  /** Search / status filter row above a table. `search` = text box (AD-011+), otherwise a small square + select (AD-001 … AD-010). */
  | { t: "filter"; search?: boolean; narrow?: boolean; /** "All" option label (AD-021+: "Assigned scope", no Filter button). */ all?: string; placeholder?: string }
  /** Data table; rows are selectable when the panel has a follower. */
  | { t: "table"; cols: string[]; rows: Cell[][]; compact?: boolean; /** Column used by the status filter (defaults to the last pill column). */ status?: number }
  /** "Label … value" rows; `bold` = bold values (AD-011+ lower panels). */
  | { t: "kv"; rows: [string, Cell][]; bold?: boolean; /** Small, tight rows (AD-031+ lower panels). */ dense?: boolean }
  /** Buttons; the first is solid unless `outlineAll`. */
  | { t: "btns"; items: string[]; outlineAll?: boolean }
  /** Labelled progress bar. */
  | { t: "progress"; label: string; value: number; right?: string; color?: BarColor }
  /** Process boxes joined by arrows; [top, bottom] for two-line boxes. */
  | { t: "flow"; steps: (string | [string, string])[] }
  /** Grey step chips in one row (no arrows). */
  | { t: "chips"; items: string[] }
  /** Kanban preview: columns of small cards [id, text]. */
  | { t: "kanban"; cols: { title: string; cards: [string, string][] }[] }
  /** Grey bordered note ("Operational control: …"). */
  | { t: "callout"; text: string }
  /** Row of day tiles; `true` = highlighted (amber). */
  | { t: "days"; items: [string, boolean?][] }
  /** Folder list (mail / chat folders); the first item is selected. */
  | { t: "list"; items: string[] }
  /** Conversation bubbles: "in" (grey-blue, left) / "out" (green, right). */
  | { t: "chat"; msgs: ["in" | "out", string][] }
  /** Single-line reply box (preview only). */
  | { t: "input"; placeholder: string }
  /** Inline meters: label · bar · value. */
  | { t: "meters"; items: [string, number, string][] }
  /** Stacked bar with caption. */
  | { t: "stack"; caption: string; parts: [number, BarColor | "grey"][] }
  /** Plain text line. */
  | { t: "note"; text: string; muted?: boolean }
  /** Light blue info strip. */
  | { t: "info"; text: string }
  /** Light red warning strip. */
  | { t: "alert"; text: string }
  /** Bordered document / record preview card. */
  | { t: "doc"; title: string; lines: string[]; badge?: Cell }
  /** Labelled multi-line text box. */
  | { t: "textarea"; label: string; placeholder: string }
  /** Two-column form. */
  | { t: "form"; fields: Field[] }
  /** Vertical bar chart. */
  | { t: "bars"; items: [string, number][]; note?: string }
  /** Horizontal bar list (label, value %, right text). */
  | { t: "hbars"; items: [string, number, string?][] }
  /** Donut with centre value and legend lines. */
  | { t: "donut"; value: string; unit: string; pct: number; lines: string[] }
  /** Schematic map strip with chips. */
  | { t: "map"; chips: string[]; /** Schematic GPS points instead of a hatched strip. */ gps?: string }
  /** Month calendar (Monday first). */
  | { t: "calendar"; firstDay: number; days: number; marks?: number[] };

export type Panel = {
  title: string;
  /** Title follows the selected table row of the main panel: "<title> · <row[0]>". */
  follow?: boolean;
  blocks: Block[];
};

export type Row = {
  /** Height in design-image px (1366 × 768 reference); rows share the space in this ratio. */
  h: number;
  /** Column widths ratio, in `panels` order (defaults to equal). */
  w?: number[];
  /** Display position of each panel when it differs from `panels` order (the main table stays panels[0]). */
  order?: number[];
  panels: Panel[];
};

export type Screen = {
  code: string;
  title: string;
  kpis: Kpi[];
  tabs: string[];
  rows: Row[];
  /** Row of the main table selected on load (as in the design). */
  selected?: number;
  /** Tabs that open another screen instead of switching the view (screen code). */
  tabLinks?: Record<string, string>;
  /** AD-031+ heading: only DEMO DATA + screen switcher. */
  plain?: boolean;
  /** AD-021+ heading: "27 Nov · demo snapshot" instead of the department switcher. */
  snapshot?: boolean;
  /** Breadcrumb suffix (AD-001 … AD-010: "• Assigned scope only"). */
  scope?: string;
};
