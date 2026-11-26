"use client";

import Link from "next/link";
import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, ArrowUp, ChevronDown, type LucideIcon } from "lucide-react";
import { Box, useDashboardRole, type BoxFit } from "@/components/dashboards/canvas";
import { sectionHref } from "@/components/dashboards/shells";
import { usePopover } from "@/components/dashboards/usePopover";
import EncodencyBadge from "@/components/ui/EncodencyBadge";
import { siteConfig } from "@/lib/config/site";

type At = [number, number, number, number];

/* ---------------------------------- card ---------------------------------- */

export function Card({ at, className = "", children, label, fit }: { at: At; className?: string; children: ReactNode; label?: string; fit?: BoxFit }) {
  return (
    <Box
      at={at}
      label={label}
      fit={fit}
      className={`rounded-[12px] border border-[#e1e5ee] bg-white shadow-[0_3px_10px_rgba(30,50,110,0.07)] ${className}`}
    >
      {children}
    </Box>
  );
}

/** Card heading placed at design offsets inside its card. */
export function CardTitle({
  x,
  y,
  size = 19,
  children,
  note,
}: {
  x: number;
  y: number;
  size?: number;
  children: ReactNode;
  /** Lighter suffix, e.g. "(This Month)". */
  note?: string;
}) {
  return (
    <h2
      style={{ left: x, top: y - 2, fontSize: size }}
      className="absolute whitespace-nowrap font-bold leading-none tracking-[-0.35px] text-[#0b0c36]"
    >
      {children}
      {note && <span style={{ fontSize: size - 4 }} className="font-medium tracking-[-0.2px]"> {note}</span>}
    </h2>
  );
}

/** Href of a section of the current dashboard, by its label. */
export function useSectionHref() {
  const role = useDashboardRole();
  return (label: string) => sectionHref(role, label);
}

export function ViewAll({
  right,
  y,
  size = 14.5,
  to,
  children = "View All",
}: {
  right: number;
  y: number;
  size?: number;
  /** Section label this link opens. */
  to: string;
  children?: ReactNode;
}) {
  const href = useSectionHref();
  return (
    <Link
      href={href(to)}
      style={{ right, top: y, fontSize: size }}
      className="absolute flex items-center whitespace-nowrap font-semibold leading-none tracking-[-0.3px] text-[#2320c4] hover:underline"
    >
      <span className="pt-[2px]">{children}</span>
      <ArrowRight strokeWidth={2.2} style={{ width: size + 2, height: size + 2 }} className="ml-[5px]" />
    </Link>
  );
}

/** Absolute helper for placing anything at card-relative design offsets. */
export function At({
  x,
  y,
  w,
  h,
  className = "",
  style,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div style={{ left: x, top: y, width: w, height: h, ...style }} className={`absolute ${className}`}>
      {children}
    </div>
  );
}

/** A clickable tile (quick actions, modules…) that opens a section. */
export function TileLink({ to, style, className = "", children }: { to: string; style?: CSSProperties; className?: string; children: ReactNode }) {
  const href = useSectionHref();
  return (
    <Link href={href(to)} style={style} className={`absolute block transition-colors hover:bg-[#f7f9ff] focus-visible:outline-2 focus-visible:outline-[#2320c4] ${className}`}>
      {children}
    </Link>
  );
}

/* ---------------------------------- pills --------------------------------- */

export const tones = {
  red: "bg-[#fbd9d9] text-[#9b1c1c]",
  amber: "bg-[#fde7a6] text-[#5c4210]",
  yellow: "bg-[#fbe97a] text-[#4a3b05]",
  green: "bg-[#d3f1cf] text-[#1f4a1c]",
  blue: "bg-[#d9e6fb] text-[#1c2f5e]",
  purple: "bg-[#e3dcfb] text-[#352270]",
  pink: "bg-[#fbd6d6] text-[#7a1d1d]",
  peach: "bg-[#fde3bd] text-[#6b3c05]",
} as const;
export type Tone = keyof typeof tones;

export function Pill({
  tone,
  children,
  w,
  h = 22,
  size = 13.5,
  className = "",
}: {
  tone: Tone;
  children: ReactNode;
  w?: number;
  h?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      style={{ width: w, height: h, fontSize: size }}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-[8px] pt-[2px] font-semibold leading-none tracking-[-0.2px] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Solid count badge (07, 03 …). */
export function CountBadge({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      style={{ background: color }}
      className="inline-flex h-[22px] w-[52px] items-center justify-center rounded-full pt-[2px] text-[14px] font-semibold leading-none text-white"
    >
      {children}
    </span>
  );
}

/* ------------------------------- progress bar ------------------------------ */

export function Bar({ value, w, h = 6, color = "#16880f", track = "#d7dde7" }: { value: number; w: number; h?: number; color?: string; track?: string }) {
  return (
    <span style={{ width: w, height: h, background: track }} className="block overflow-hidden rounded-full">
      <span style={{ width: `${value}%`, background: color }} className="block h-full rounded-full" />
    </span>
  );
}

/* ---------------------------------- donut ---------------------------------- */

export function Donut({
  size,
  thickness,
  segments,
  children,
}: {
  size: number;
  thickness: number;
  /** Values in drawing order, starting at 12 o'clock going clockwise. */
  segments: { value: number; color: string }[];
  children?: ReactNode;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  const lens = segments.map((s) => (s.value / total) * c);
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 -rotate-90" aria-hidden>
        {segments.map((s, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${Math.max(lens[i] - 1.2, 0)} ${c}`}
            strokeDashoffset={-starts[i]}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

/** Coloured dot used in legends. */
export function Dot({ color, size = 14 }: { color: string; size?: number }) {
  return <span style={{ background: color, width: size, height: size }} className="inline-block shrink-0 rounded-full" />;
}

/* ----------------------------------- KPI ----------------------------------- */

export const kpiThemes = {
  blue: { bg: "linear-gradient(180deg,#f5faff,#d6ebfe)", bubble: "#ddeaff", icon: "#1f6fe0" },
  orange: { bg: "linear-gradient(180deg,#fefcf6,#fff0d6)", bubble: "#ffeac2", icon: "#f0a020" },
  purple: { bg: "linear-gradient(180deg,#f6f5fe,#e8e5fc)", bubble: "#e6dcff", icon: "#7a2fe0" },
  green: { bg: "linear-gradient(180deg,#f5fdf4,#dcf9d6)", bubble: "#d2f3cd", icon: "#169a2b" },
  mint: { bg: "linear-gradient(180deg,#f0fdf8,#d6f8e7)", bubble: "#d6f6e4", icon: "#14913a" },
  red: { bg: "linear-gradient(180deg,#fdf5f8,#ffdfe3)", bubble: "#ffe1e2", icon: "#e02020" },
  gold: { bg: "linear-gradient(180deg,#fdfdf6,#fdf0dc)", bubble: "#ffe8bf", icon: "#f39a18" },
  sky: { bg: "linear-gradient(180deg,#f4f9fc,#d9edfd)", bubble: "#dde9ff", icon: "#1f63d8" },
} as const;
export type KpiTheme = keyof typeof kpiThemes;

export function Kpi({
  at,
  theme,
  icon,
  iconSize,
  bubble,
  textX,
  value,
  valueSize,
  label,
  labelSize,
  lines,
  center = false,
  textW,
}: {
  at: At;
  theme: KpiTheme;
  icon: ReactNode;
  iconSize?: number;
  /** Icon bubble: centre x/y and diameter (card-relative). */
  bubble: { cx: number; cy: number; d: number; none?: boolean };
  textX: number;
  value: ReactNode;
  valueSize: number;
  label: ReactNode;
  labelSize: number;
  /** Extra lines under the label (trend, percentage…). */
  lines?: ReactNode;
  center?: boolean;
  /** Width of the text column (centred columns). */
  textW?: number;
}) {
  const t = kpiThemes[theme];
  return (
    <Box
      at={at}
      className="overflow-hidden rounded-[11px] border border-[#dfe5ee] shadow-[0_3px_9px_rgba(30,50,110,0.09)]"
    >
      <div style={{ background: t.bg }} className="absolute inset-0" />
      {!bubble.none && (
        <span
          style={{ left: bubble.cx - bubble.d / 2, top: bubble.cy - bubble.d / 2, width: bubble.d, height: bubble.d, background: t.bubble }}
          className="absolute rounded-full"
        />
      )}
      <span
        style={{ left: bubble.cx, top: bubble.cy, color: t.icon, width: iconSize, height: iconSize }}
        className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        {icon}
      </span>
      <div
        style={{ left: textX, width: textW, right: textW ? undefined : 4 }}
        className={`absolute inset-y-0 flex flex-col justify-center ${center ? "items-center text-center" : ""}`}
      >
        <p style={{ fontSize: valueSize }} className="whitespace-nowrap font-bold leading-none tracking-[-0.4px] text-[#0b0c36]">
          {value}
        </p>
        <p style={{ fontSize: labelSize }} className="mt-[4px] whitespace-nowrap font-semibold leading-[1.12] tracking-[-0.35px] text-[#1a1d36]">
          {label}
        </p>
        {lines}
      </div>
    </Box>
  );
}

export function Trend({ children, size = 15 }: { children: ReactNode; size?: number }) {
  return (
    <p style={{ fontSize: size }} className="mt-[3px] flex items-center whitespace-nowrap font-semibold leading-none text-[#138a16]">
      <ArrowUp strokeWidth={3} style={{ width: size - 1, height: size - 1 }} className="-mt-[2px] mr-[3px]" />
      {children}
    </p>
  );
}

/* --------------------------------- selects --------------------------------- */

/** Small dropdown button with a working option list. */
export function Select<T extends string>({
  value,
  options,
  onChange,
  icon,
  className = "",
  size = 13.5,
  label,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  icon?: ReactNode;
  className?: string;
  size?: number;
  label: string;
}) {
  const { open, setOpen, ref } = usePopover();
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${value}`}
        onClick={() => setOpen(!open)}
        style={{ fontSize: size }}
        className="flex h-full w-full items-center whitespace-nowrap rounded-[8px] border border-[#d6dbe6] bg-white pl-[8px] pr-[6px] font-semibold leading-none tracking-[-0.2px] text-[#0b0c36] shadow-[0_1px_3px_rgba(30,50,110,0.08)]"
      >
        {icon}
        <span className="min-w-0 flex-1 truncate pt-px text-left">{value}</span>
        <ChevronDown strokeWidth={2.4} style={{ width: size + 1, height: size + 1 }} className={`ml-[3px] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul role="listbox" aria-label={label} className="absolute right-0 top-[calc(100%+6px)] z-40 min-w-full rounded-[10px] border border-[#e3e7ef] bg-white p-[5px] shadow-[0_14px_36px_rgba(20,35,90,0.16)]">
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                role="option"
                aria-selected={o === value}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={`flex h-[32px] w-full items-center whitespace-nowrap rounded-[7px] px-[10px] pt-[2px] text-left text-[14px] font-semibold ${
                  o === value ? "bg-[#eef2ff] text-[#2a26cf]" : "hover:bg-[#f4f6fc]"
                }`}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** "Mon, 24 Nov 2026" */
export const formatDay = (d: Date) =>
  `${d.toLocaleDateString("en-GB", { weekday: "short" })}, ${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;

const noSubscribe = () => () => {};
/** Today's date, read on the client only (the server has no "today" for the viewer). */
export function Today() {
  return useSyncExternalStore(noSubscribe, () => formatDay(new Date()), () => "");
}

/* ------------------------------- icon helpers ------------------------------ */

export function Ico({ icon: Icon, color, size, stroke = 1.9, className = "" }: { icon: LucideIcon; color: string; size: number; stroke?: number; className?: string }) {
  return <Icon strokeWidth={stroke} style={{ color, width: size, height: size }} className={`shrink-0 ${className}`} />;
}

/** WhatsApp glyph (not in lucide). */
export function WhatsAppIcon({ size, color = "#16a34a" }: { size: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size }} fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.3z" />
      <path d="M9.2 8.3c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.1.6 0l.6-.5c.2-.1.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.8-.6.4-1.4.5-2.2.3-2.6-.8-4.7-2.9-5.5-5.5-.2-.8-.1-1.6.3-2.2z" fill={color} stroke="none" />
    </svg>
  );
}

/** Lotus outline (case icons). */
export function LotusIcon({ size, color = "#f0a020" }: { size: number; color?: string }) {
  return (
    <svg viewBox="0 0 32 24" style={{ width: size, height: size * 0.75 }} fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round" aria-hidden>
      <path d="M16 3c3 3 4.3 6.6 4.3 9.8S18.8 19 16 20.5c-2.8-1.5-4.3-4.5-4.3-7.7S13 6 16 3z" />
      <path d="M11.9 9.2C9.4 8 6.8 7.8 4.6 8.4c.3 4.6 3.2 9.8 11.4 12.1" />
      <path d="M20.1 9.2c2.5-1.2 5.1-1.4 7.3-.8-.3 4.6-3.2 9.8-11.4 12.1" />
      <path d="M2 13.2c2 4.7 7.3 7.4 14 7.4s12-2.7 14-7.4" />
    </svg>
  );
}

/** Solid map pin. */
export function PinSolid({ size, color = "#0b0c36" }: { size: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size }} aria-hidden>
      <path d="M12 1.8a7.6 7.6 0 0 0-7.6 7.6c0 5.6 7.6 12.8 7.6 12.8s7.6-7.2 7.6-12.8A7.6 7.6 0 0 0 12 1.8z" fill={color} />
      <circle cx="12" cy="9.4" r="2.9" fill="#fff" />
    </svg>
  );
}

/* ---------------------------------- footer --------------------------------- */

export function Footer({ y, leftX, logoRight }: { y: number; leftX: number; logoRight: number }) {
  return (
    <>
      <Box at={[leftX, y - 10, 400, 22]} as="div" className="flex items-center whitespace-nowrap text-[15px] font-semibold leading-none tracking-[-0.25px] text-[#1d1f33]">
        <span className="pt-[2px]">© {siteConfig.copyrightYear} {siteConfig.trust}</span>
        <span className="mx-[15px] h-[20px] w-[1.5px] bg-[#3a3d55]" />
        <span className="pt-[2px] font-semibold text-[#0b0c36]">{siteConfig.name} CRM v1.0</span>
      </Box>
      <Box at={[logoRight - 440, y - 16, 440, 32]} as="div" className="flex items-center justify-end">
        <span className="whitespace-nowrap pt-[2px] text-[15.5px] font-semibold tracking-[-0.25px] text-[#1d1f33]">Designed, Developed &amp; Maintained by</span>
        {/* Same badge as the login screens, sized for the dashboard footer. */}
        <EncodencyBadge
          className="ml-[15px] h-[32px] min-w-[150px] px-3"
          nameClassName="text-[18px]"
          legalClassName="text-[7.5px]"
          sloganClassName="text-[6px]"
        />
      </Box>
    </>
  );
}
