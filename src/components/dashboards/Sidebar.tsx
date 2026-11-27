import Image from "next/image";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { isHomeItem, homeHref, sectionHref, slugify } from "@/components/dashboards/shells";
import type { Role } from "@/lib/auth/session";
import SidebarMotto from "@/components/dashboards/SidebarMotto";
import { siteConfig } from "@/lib/config/site";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  /** Vertical centre of the row on the design canvas. */
  y: number;
  /** "gold" = current page pill, "blue" = section heading pill. */
  pill?: "gold" | "blue";
  submenu?: boolean;
  /** Pill box override (left, width, height). */
  box?: { x: number; w: number; h: number };
};

export type SidebarSpec = {
  width: number;
  /** Text size / icon size / text x of the menu rows. */
  fontSize: number;
  iconSize: number;
  textX: number;
  iconX: number;
  /** Pill box: left, width, height. */
  pill: { x: number; w: number; h: number };
  items: NavItem[];
  /** How far the diya artwork sits below its default place. */
  diyaShift?: number;
  /** Height of a plain (non-pill) row; keep ≤ the row pitch so rows never overlap. */
  rowHeight?: number;
  /** Text size inside a pill (defaults to fontSize + 1.5). */
  pillFontSize?: number;
  /** Text weight / colour inside the gold pill (defaults to white semibold). */
  pillTextClass?: string;
  /** Box / background of the gold pill (defaults to the dashboard gold). */
  goldClass?: string;
};

/**
 * Dashboard sidebar: Moksha Sewa emblem + wordmark, menu, diya artwork.
 * Rows sit on the design's measured y positions. On the dashboard the design's
 * gold row is the current page; on a section page that section's row is.
 */
export default function Sidebar({
  spec,
  role,
  active,
  onNavigate,
}: {
  spec: SidebarSpec;
  role: Role;
  /** Slug of the open section; omitted on the dashboard itself. */
  active?: string;
  onNavigate?: () => void;
}) {
  const { width, fontSize, iconSize, textX, iconX, pill, items, diyaShift = 0, rowHeight = 32, pillFontSize = spec.fontSize + 1.5, pillTextClass, goldClass } = spec;
  return (
    <aside
      style={{ width }}
      className="relative h-full min-h-[901px] shrink-0 overflow-hidden bg-[linear-gradient(180deg,#00173e_0%,#011331_35%,#011230_70%,#021434_100%)] text-white lg:block"
    >
      {/* soft light along the right edge, as in the design */}
      <span className="pointer-events-none absolute inset-y-0 right-0 w-[40px] bg-[linear-gradient(90deg,transparent,rgba(10,40,95,0.35))]" />

      {/* Brand — the same Moksha Sewa logo as the login screen, in its
          white-wordmark version for the dark sidebar. */}
      <div className="absolute inset-x-0 top-0 h-[125px]">
        <Image
          src="/images/moksha-sewa-logo-dark.png"
          alt={siteConfig.brand}
          width={1292}
          height={1090}
          priority
          sizes="120px"
          className="absolute left-1/2 top-[4px] h-[100px] w-auto -translate-x-1/2"
        />
        <p className="absolute inset-x-0 top-[108px] text-center text-[12.8px] font-medium leading-none tracking-[-0.3px] text-white">
          {siteConfig.initiative}
        </p>
      </div>

      <nav aria-label="Main">
        <ul>
          {items.map((item) => {
            const { label, icon: Icon, y, submenu, box } = item;
            const href = isHomeItem(item) ? homeHref(role) : sectionHref(role, label);
            // gold = current page; keep the blue heading pill everywhere
            const current = active ? slugify(label) === active : item.pill === "gold";
            const kind = current ? "gold" : item.pill === "blue" ? "blue" : undefined;
            const p = box ?? pill;
            const h = kind ? p.h : rowHeight;
            const isCurrent = kind === "gold";
            return (
              <li key={label} style={{ top: y - h / 2, height: h, left: kind ? p.x : 0, width: kind ? p.w : width }} className="absolute">
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`relative flex h-full items-center transition-colors ${isCurrent && pillTextClass ? "text-[#0b0c36]" : ""} ${
                    kind === "gold" && goldClass
                      ? goldClass
                      : kind === "gold"
                      ? "rounded-[9px] border border-[#ffd668]/70 bg-[linear-gradient(90deg,#fdc006_0%,#f2ad0a_45%,#d99a1b_75%,rgba(160,120,40,0.55)_100%)] shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                      : kind === "blue"
                        ? "rounded-[10px] bg-[linear-gradient(90deg,#28467a,#223d6c)]"
                        : "hover:bg-white/5"
                  }`}
                >
                  <Icon
                    strokeWidth={2}
                    style={{ width: iconSize, height: iconSize, left: iconX - (kind ? p.x : 0) - iconSize / 2 }}
                    className="absolute"
                  />
                  <span
                    style={{ left: textX - (kind ? p.x : 0), fontSize: kind ? pillFontSize : fontSize }}
                    className={`absolute whitespace-nowrap pt-px leading-none tracking-[-0.2px] ${
                      isCurrent && pillTextClass ? pillTextClass : kind ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {label}
                  </span>
                  {submenu && (
                    <ChevronRight strokeWidth={2.4} className="absolute right-[10px] h-[12px] w-[12px]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ bottom: -diyaShift }} className="absolute inset-x-0">
        <SidebarMotto />
      </div>
    </aside>
  );
}
