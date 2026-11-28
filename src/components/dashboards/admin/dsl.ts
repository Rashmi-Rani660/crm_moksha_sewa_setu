import type { LucideIcon } from "lucide-react";
import type { TileTone } from "@/components/dashboards/super-admin/kit";
import type { BarColor, Block, Cell, Field, Kpi, Panel, Row } from "./types";

/** Short builders for the AD-001 … AD-050 screen data. */

export const k = (v: string, l: string, tone?: TileTone, icon?: LucideIcon): Kpi => ({ v, l, tone, icon });
export const panel = (title: string, ...blocks: Block[]): Panel => ({ title, blocks });
/** Panel whose title follows the selected row of the main table. */
export const follow = (title: string, ...blocks: Block[]): Panel => ({ title, follow: true, blocks });
export const row = (h: number, panels: Panel[], w?: number[]): Row => ({ h, panels, w });
/** Main table + side panel row (750 : 405 as in the design). */
export const top = (h: number, main: Panel, side: Panel): Row => ({ h, panels: [main, side], w: [750, 405] });
export const bottom = (h: number, ...panels: Panel[]): Row => ({ h, panels });

export const F: Block = { t: "filter" };
export const FS: Block = { t: "filter", search: true };
export const FSN: Block = { t: "filter", search: true, narrow: true };
export const tbl = (cols: string[], rows: Cell[][], status?: number): Block => ({ t: "table", cols, rows, status });
export const ctbl = (cols: string[], rows: Cell[][]): Block => ({ t: "table", cols, rows, compact: true });
export const kv = (...rows: [string, Cell][]): Block => ({ t: "kv", rows });
export const kvb = (...rows: [string, Cell][]): Block => ({ t: "kv", rows, bold: true });
export const btns = (...items: string[]): Block => ({ t: "btns", items });
export const btns2 = (...items: string[]): Block => ({ t: "btns", items, grid: true });
export const obtns = (...items: string[]): Block => ({ t: "btns", items, outlineAll: true });
export const prog = (label: string, value: number, right?: string, color?: BarColor): Block => ({ t: "progress", label, value, right, color });
export const flow = (...steps: (string | [string, string])[]): Block => ({ t: "flow", steps });
export const chips = (...items: string[]): Block => ({ t: "chips", items });
export const note = (text: string, muted = false): Block => ({ t: "note", text, muted });
export const info = (text: string): Block => ({ t: "info", text });
export const alert = (text: string): Block => ({ t: "alert", text });
export const doc = (title: string, lines: string[], badge?: Cell): Block => ({ t: "doc", title, lines, badge });
export const form = (...fields: Field[]): Block => ({ t: "form", fields });
export const textarea = (label: string, placeholder: string): Block => ({ t: "textarea", label, placeholder });
export const bars = (items: [string, number][], note?: string): Block => ({ t: "bars", items, note });
export const hbars = (...items: [string, number, string?][]): Block => ({ t: "hbars", items });
export const map = (...chips: string[]): Block => ({ t: "map", chips });

/** Scope strip used on the AD-011+ side panels. */
export const SCOPE = info("Assigned scope only · Ghaziabad");
/** Breadcrumb suffix of AD-001 … AD-010. */
export const ONLY = "• Assigned scope only";

/** AD-021+ register filter: search box + "Assigned scope" select, no Filter button. */
export const FA: Block = { t: "filter", search: true, all: "Assigned scope" };
export const callout = (text: string): Block => ({ t: "callout", text });
export const op = (text: string): Block => ({ t: "callout", text: `Operational control: ${text}` });
export const kanban = (...cols: { title: string; cards: [string, string][] }[]): Block => ({ t: "kanban", cols });
export const days = (...items: [string, boolean?][]): Block => ({ t: "days", items });
export const gps = (label: string): Block => ({ t: "map", chips: [], gps: label });
/** AD-021+ scope strip (no city). */
export const SCOPE2 = info("Assigned scope only");

/** AD-031+ dense key/value rows. */
export const kvd = (...rows: [string, Cell][]): Block => ({ t: "kv", rows, dense: true });
export const list = (...items: string[]): Block => ({ t: "list", items });
export const chat = (...msgs: ["in" | "out", string][]): Block => ({ t: "chat", msgs });
export const reply = (placeholder = "Write a reply (preview only)"): Block => ({ t: "input", placeholder });
export const meters = (...items: [string, number, string][]): Block => ({ t: "meters", items });
export const stack = (caption: string, ...parts: [number, BarColor | "grey"][]): Block => ({ t: "stack", caption, parts });
/** AD-031+ register filter ("Search assigned records..."). */
export const FR: Block = { t: "filter", search: true, all: "Assigned scope", placeholder: "Search assigned records..." };
/** AD-031+ scope strip. */
export const SCOPE3 = info("Assigned scope only. Sensitive actions require authorised review.");
/** Three-column top row: folders, register, detail (186 : 566 : 389). */
export const top3 = (h: number, folders: Panel, main: Panel, side: Panel): Row => ({ h, panels: [main, folders, side], w: [566, 186, 389], order: [1, 0, 2] });
