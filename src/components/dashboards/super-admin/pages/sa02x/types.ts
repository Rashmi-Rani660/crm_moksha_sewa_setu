import type { LucideIcon } from "lucide-react";
import type { TileTone } from "@/components/dashboards/super-admin/kit";

/**
 * Content model for SA-021 … SA-030.
 * Cell / value text: a leading `*` draws it as a status pill.
 * Tokens (selected row): `$n` column n, `$@n` column n before " · ", `$#n` last two digits of column n.
 */

export type Pair = [label: string, value: string];
export type Bar = { label: string; pct: number };
export type Action = { label: string; notice: string; confirm?: string };

export type Tbl = {
  cols: string[];
  rows: string[][];
  /** Columns drawn as pills. */
  pill?: number[];
};

export type Kpi = { tone: TileTone; icon: LucideIcon; value: string; label: string };

export type Side =
  | { kind: "kv"; title: string; rows: Pair[]; bars?: Bar[]; barsFirst?: boolean }
  | { kind: "fields"; title: string; fields: Pair[]; rows: Pair[]; actions?: Action[] }
  | { kind: "kv-actions"; title: string; rows: Pair[]; actions: Action[] }
  | { kind: "thread"; title: string; rows: Pair[]; bubbles: ["in" | "out", string][]; input?: string; actions: Action[] }
  | { kind: "table"; title: string; table: Tbl; rows: Pair[]; actions: Action[] };

export type Bottom = {
  title: string;
  steps?: string[];
  rows?: Pair[];
  table?: Tbl;
};

export type Screen = {
  id: string;
  title: string;
  /** Sidebar item to highlight (sidebar itself is not changed). */
  active: string;
  href: string;
  icon: LucideIcon;
  kpis: Kpi[];
  tabs: string[];
  main: {
    title: string;
    table: Tbl;
    /** Row selected first (drives the side panel). */
    selected?: number;
    actions: Action[];
    nested?: { title: string; table: Tbl };
  };
  /** Tables of tabs 2 … n. */
  tabViews: { title: string; table: Tbl }[];
  side: Side;
  bottom: Bottom;
};
