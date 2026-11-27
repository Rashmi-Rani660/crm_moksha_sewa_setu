import { sa021, sa022, sa023, sa024, sa025 } from "./data-a";
import { sa026, sa027, sa028, sa029, sa030 } from "./data-b";
import type { Screen } from "./types";

export const screenList: Screen[] = [sa021, sa022, sa023, sa024, sa025, sa026, sa027, sa028, sa029, sa030];
export const screens: Record<string, Screen> = Object.fromEntries(screenList.map((s) => [s.id, s]));
