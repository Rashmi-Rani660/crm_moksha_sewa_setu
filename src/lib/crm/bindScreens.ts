import type { Block, Screen as AdminScreen } from "@/components/dashboards/admin/types";
import type { Pair, Screen as ResourceScreen, Tbl } from "@/components/dashboards/super-admin/pages/sa02x/types";
import type { useDslData } from "./useDslData";
import type { useScreenActions } from "./useScreenActions";
import { at, EMPTY, records, text } from "./data";

type Data = ReturnType<typeof useDslData>;
type Actions = ReturnType<typeof useScreenActions>;

function pill(value: string) {
  const tone = /^(completed|active|available|verified|approved|closed)/i.test(value) ? "g" : /^(critical|overdue|expired|rejected|breached)/i.test(value) ? "r" : /pending|hold|review/i.test(value) ? "a" : "b";
  return value === EMPTY ? value : `${tone}:${value}`;
}

/** Preserve every block and slot. Only runtime values and form choices are substituted. */
export function bindAdminScreen(screen: AdminScreen, data: Data, actions: Actions): AdminScreen {
  if (!data.enabled) return screen;
  function block(b: Block, title: string): Block {
    switch (b.t) {
      case "table": return { ...b, rows: data.table(title,b.cols).map(row => row.map((value,j) => b.rows.some(old => /^[ragbpx]:/.test(old[j] ?? "")) ? pill(value) : value)) };
      case "kv": return { ...b, rows: b.rows.map(([label]) => [label, data.value(label)] as [string,string]) };
      case "form": return { ...b, fields: b.fields.map(f => ({ ...f,
        value: actions.fields[f.label] ?? (f.kind === "readonly" ? data.value(f.label) : ""),
        options: f.options ? /assignee|owner/i.test(f.label) ? records(data.extras[0].data).map(row => text(row.name)) : /case/i.test(f.label) ? data.rows.map(row => text(row.caseNo)) : f.options.filter(option => !/User \d|Team \d|VOL-|MS-|TASK-/.test(option)) : undefined,
      })) };
      case "progress": return { ...b, value: 0, right: EMPTY };
      case "bars": return { ...b, items: b.items.map(([label],i) => {
        const day = records(at(data.dashboard.data,"weeklyTrend"))[i];
        return [day ? text(day.day) : label, typeof day?.requests === "number" ? day.requests : Number.NaN] as [string,number];
      }) };
      case "hbars": return { ...b, items: b.items.map(([label]) => [label, 0, EMPTY] as [string,number,string]) };
      case "donut": return { ...b, value: EMPTY, pct: 0, lines: b.lines.map(() => EMPTY) };
      case "meters": return { ...b, items: b.items.map(([label]) => [label, 0, EMPTY] as [string, number, string]) };
      case "stack": return { ...b, caption: EMPTY, parts: b.parts.map(([,color]) => [0,color]) };
      case "kanban": return { ...b, cols: b.cols.map(c => ({ ...c, cards: data.rowsFor(title).filter(row => text(row.status).replace(/_/g," ").toLowerCase() === c.title.toLowerCase()).map(row => [text(row.taskNo),text(row.title)] as [string,string]) })) };
      case "map": return { ...b, chips: b.chips.map(() => EMPTY), gps: b.gps ? EMPTY : undefined };
      case "doc": return { ...b, lines: b.lines.map(() => EMPTY), badge: b.badge ? EMPTY : undefined };
      case "note": case "alert": case "info": return /\d|demo|User 0|Team 0|VOL-|MS-|TASK-|Ghaziabad|Delhi|Noida/i.test(b.text) ? { ...b, text: EMPTY } : b;
      case "chat": return { ...b, msgs: [] };
      case "calendar": return { ...b, marks: [] };
      default: return b;
    }
  }
  return { ...screen, kpis: screen.kpis.map(k => ({ ...k, v: data.value(k.l) })),
    rows: screen.rows.map(row => ({ ...row, panels: row.panels.map(panel => ({ ...panel, blocks: panel.blocks.map(b => block(b,panel.title)) })) })),
  };
}

export function bindResourceScreen(screen: ResourceScreen, data: Data): ResourceScreen {
  if (!data.enabled) return screen;
  const table = (t: Tbl, title: string): Tbl => ({ ...t, rows: data.table(title,t.cols) });
  const pairs = (rows: Pair[]): Pair[] => rows.map(([label]) => [label,data.value(label)]);
  const side = screen.side;
  const shared = { ...side, rows: pairs(side.rows) };
  const nextSide = shared.kind === "table" ? { ...shared, table: table(shared.table,shared.title) }
    : shared.kind === "fields" ? { ...shared, fields: pairs(shared.fields) }
    : shared.kind === "kv" ? { ...shared, bars: shared.bars?.map(bar => ({ ...bar, pct: 0, value: EMPTY })) }
    : shared.kind === "thread" ? { ...shared, bubbles: [] } : shared;
  return { ...screen, kpis: screen.kpis.map(k => ({ ...k, value: data.value(k.label) })),
    main: { ...screen.main, table: table(screen.main.table,screen.main.title), nested: screen.main.nested ? { ...screen.main.nested, table: table(screen.main.nested.table,screen.main.nested.title) } : undefined },
    tabViews: screen.tabViews.map(view => ({ ...view, table: table(view.table,view.title) })),
    side: nextSide, bottom: { ...screen.bottom, rows: screen.bottom.rows ? pairs(screen.bottom.rows) : undefined,
      table: screen.bottom.table ? table(screen.bottom.table,screen.bottom.title) : undefined },
  };
}
