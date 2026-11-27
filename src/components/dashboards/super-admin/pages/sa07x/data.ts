import { sa071, sa072, sa073, sa074, sa075, sa076 } from "./data-a";
import { sa077, sa078, sa079, sa080, sa081, sa082 } from "./data-b";
import type { Screen } from "./types";

/** Screen register, in design-book order. */
export const screenList: Screen[] = [sa071, sa072, sa073, sa074, sa075, sa076, sa077, sa078, sa079, sa080, sa081, sa082];

export const screens: Record<string, Screen> = Object.fromEntries(screenList.map((s) => [s.id, s]));
