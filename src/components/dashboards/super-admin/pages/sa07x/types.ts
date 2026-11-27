import type { LucideIcon } from "lucide-react";
import type { TileTone } from "@/components/dashboards/super-admin/kit";

/** Content model for the SA-071 … SA-082 screens (one shared layout, see SaScreen.tsx). */

export type Row = string[];

export type Kpi = { tone: TileTone; icon: LucideIcon; value: string; label: string };

export type Pair = [label: string, value: string];

export type Bar = { label: string; value: number; max: number };

export type Action = {
  label: string;
  /** Message shown after the action (placeholder until the module exists). */
  notice: string;
  /** Ask for confirmation first (irreversible / outward-facing actions). */
  confirm?: string;
  /** Set the status cell of the selected register row. */
  setStatus?: string;
};

/** A table that fills the main panel (register, or the content of another tab). */
export type TableView = {
  title: string;
  cols: string[];
  rows: Row[];
  /** Column drawn as a status pill. */
  statusCol?: number;
};

export type Register = TableView & {
  kind: "register";
  statusCol: number;
  actions: [Action, Action];
  /** Status dropdown next to the search box. `always` shows it without pressing Filter. */
  filter?: { all: string; col: number; always?: boolean };
  /** Selecting a row refreshes the side panel (`$n` = column n of the selected row). */
  searchHint?: string;
};

export type FormField = { label: string; value: string; options?: string[] };

export type Form = {
  kind: "form";
  title: string;
  /** Laid out two per row, left to right. */
  fields: FormField[];
  actions: [Action, Action];
};

export type ChartData = { points: [label: string, value: number][]; note: string };

export type Screen = {
  id: string;
  title: string;
  /** Sidebar item to highlight (existing sidebar, not changed here). */
  active: string;
  href: string;
  kpis: Kpi[];
  tabs: string[];
  main: Register | Form;
  /** Content of tabs 2…5 (same order as `tabs.slice(1)`). */
  tabViews: TableView[];
  side: { title: string; rows: Pair[]; barsCaption?: string; bars?: Bar[] };
  lowerLeft: { title: string; caption?: string; rows?: Pair[]; bars?: Bar[]; chart?: ChartData };
  lowerRight: { title: string; rows: Pair[] };
};
