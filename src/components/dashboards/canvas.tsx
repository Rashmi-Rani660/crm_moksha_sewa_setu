"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Sidebar from "@/components/dashboards/Sidebar";
import TopBar from "@/components/dashboards/TopBar";
import { shells } from "@/components/dashboards/shells";
import { isSigningOut, useAuthSession, type Role } from "@/lib/auth/session";

/**
 * The dashboards are drawn on the design's 1600×901 canvas and every block is
 * placed with the design's pixel coordinates (see `Box`). From `lg` up the
 * canvas is zoomed so the whole dashboard fits the window (`--vw` / `--vh` come
 * from the inline script in `app/layout.tsx`). When the window is wider than
 * the design, the content is stretched sideways to use the spare width (up to
 * MAX_STRETCH, see `--k`); anything beyond that is shared on both sides.
 *
 * Below `lg` (phones, tablets) the blocks flow in design order in a grid and
 * each is zoomed to fit its cell (see `Box`).
 */
export const DESIGN_W = 1600;
export const DESIGN_H = 901;

const SidebarWidth = createContext(0);

/** Hamburger: collapses the sidebar from `lg` up, opens it as a drawer below. */
const MenuToggle = createContext<() => void>(() => {});
export const useMenuToggle = () => useContext(MenuToggle);

const DESKTOP = "(min-width: 1024px)";

/** Below `lg`: grid of 6 columns (12 from `sm`), 12px padding and gaps — see `Box`. */
const MOBILE_GRID = "grid grid-cols-6 content-start gap-3 p-3 [--cols:6] sm:grid-flow-row-dense sm:grid-cols-12 sm:[--cols:12]";

const RoleContext = createContext<Role>("user");
/** Role of the dashboard being shown. */
export const useDashboardRole = () => useContext(RoleContext);

/** Most the content may be stretched sideways to fill a wide window. */
const MAX_STRETCH = 1.15;

/** `--z` zoom that fits the design in the window; `--k` sideways stretch. */
const canvasVars = (sidebar: number) =>
  ({
    "--z": `clamp(0.6, min(calc(var(--vw, ${DESIGN_W}) / ${DESIGN_W}), calc(var(--vh, ${DESIGN_H}) / ${DESIGN_H})), 2)`,
    "--k": `clamp(1, calc((var(--vw, ${DESIGN_W}) / var(--z) - ${sidebar}) / ${DESIGN_W - sidebar}), ${MAX_STRETCH})`,
  }) as CSSProperties;

export function DashboardCanvas({
  role,
  active,
  children,
}: {
  role: Role;
  /** Open section slug (section pages). */
  active?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const { session, ready } = useAuthSession();
  const shell = shells[role];
  const sidebarWidth = shell.sidebar.width;
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const toggle = () => {
    if (window.matchMedia(DESKTOP).matches) setCollapsed((c) => !c);
    else setDrawer((d) => !d);
  };

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawer]);

  // Signed out → login; signed in with another role → that role's dashboard.
  const otherRole = session && session.role !== role ? session.role : null;
  useEffect(() => {
    if (!ready) return;
    if (!session) {
      if (!isSigningOut()) router.replace("/login"); // sign-out does its own redirect
    }
    else if (otherRole) router.replace(`/dashboard/${otherRole}`);
  }, [ready, session, otherRole, router]);

  if (!session || otherRole) return <main className="min-h-dvh bg-[#f7f8fd]" />;

  return (
    <SidebarWidth.Provider value={sidebarWidth}>
      <MenuToggle.Provider value={toggle}>
      <RoleContext.Provider value={role}>
      <div
        style={canvasVars(collapsed ? 0 : sidebarWidth)}
        className="flex min-h-dvh bg-[#f7f8fd] font-hind subpixel-antialiased text-[#0b0c36] lg:[height:max(901px,calc(var(--vh,901)*1px/var(--z)))] lg:[min-height:0] lg:[width:calc(var(--vw,1600)*1px/var(--z))] lg:overflow-hidden lg:[zoom:var(--z)]"
      >
        <div
          id="dashboard-sidebar"
          className={
            drawer
              ? "fixed inset-y-0 left-0 z-50 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.35)] lg:static lg:shadow-none"
              : `hidden shrink-0 ${collapsed ? "" : "lg:block"}`
          }
        >
          <Sidebar spec={shell.sidebar} role={role} active={active} onNavigate={() => setDrawer(false)} />
        </div>
        {drawer && (
          <button type="button" aria-label="Close menu" onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
        )}
        <div className="relative min-w-0 flex-1">
          <TopBar spec={shell.topBar} role={role} menuOpen={drawer || !collapsed} />
          <main
            style={{ "--inner": `${DESIGN_W - sidebarWidth}px` } as CSSProperties}
            className={`${MOBILE_GRID} lg:relative lg:overflow-visible lg:mx-auto lg:block lg:h-[901px] lg:w-[var(--inner)] lg:gap-0 lg:p-0 lg:[transform:scaleX(var(--k))]`}
          >
            {children}
          </main>
        </div>
      </div>
      </RoleContext.Provider>
      </MenuToggle.Provider>
    </SidebarWidth.Provider>
  );
}

/**
 * Below `lg` (phones / tablets) blocks sit in a grid of 6 columns (12 from
 * `sm`): normal cards take a full row on phones and half a row on tablets,
 * KPI tiles and controls a quarter/half, wide strips a full row. Each block
 * is zoomed so its design width fits its grid cell (never above 1×, so text
 * is never enlarged); when it is narrower than the cell its card chrome
 * (`chrome`) is drawn on the cell so cards still line up edge to edge.
 *
 * `fit`: `scale` (default), `scroll` (wide strips: at least 0.75×, scrolls
 * sideways inside itself), `clip` (like scroll but cropped) or `fluid`
 * (full row, natural height, not zoomed).
 */
export type BoxFit = "scale" | "scroll" | "clip" | "fluid";

/** Grid columns a block spans below `lg`: [phone (of 6), tablet (of 12)]. */
export type BoxSpan = [number, number];

const inferSpan = (w: number, h: number, fit: BoxFit): BoxSpan => {
  if (fit === "fluid" || w >= 600) return [6, 12];
  if (h <= 45) return w <= 150 ? [6, 4] : [3, 4]; // controls (date, centre, refresh)
  if (h <= 82) return [3, 3]; // KPI tiles
  return [6, 6]; // cards
};

const zoomClass: Record<BoxFit, string> = {
  scale: "h-[var(--h)] w-[var(--w)] shrink-0 [zoom:min(1,var(--fill))] lg:[zoom:1]",
  scroll: "h-[var(--h)] w-[var(--w)] shrink-0 [zoom:max(0.75,min(1,var(--fill)))] lg:[zoom:1]",
  clip: "h-[var(--h)] w-[var(--w)] shrink-0 [zoom:max(0.75,min(1,var(--fill)))] lg:[zoom:1]",
  fluid: "w-full lg:h-[var(--h)] lg:w-[var(--w)]",
};

const cellClass: Record<BoxFit, string> = {
  scale: "flex items-start justify-center",
  scroll: "flex items-start overflow-x-auto overscroll-x-contain",
  clip: "flex items-start overflow-hidden rounded-[12px]",
  fluid: "flex",
};

/**
 * A block placed at the design's canvas coordinates: `[x, y, width, height]`
 * measured on the full 1600px design (sidebar included).
 */
export function Box({
  at: [x, y, w, h],
  className = "",
  children,
  as: Tag = "section",
  label,
  fit = w >= 600 ? "scroll" : "scale",
  span,
  chrome = "",
  chromeStyle,
}: {
  at: [number, number, number, number];
  className?: string;
  children?: ReactNode;
  as?: "section" | "div" | "footer";
  label?: string;
  fit?: BoxFit;
  /** Override the grid span below `lg`. */
  span?: BoxSpan;
  /** Card chrome drawn on the grid cell below `lg` (the block keeps its own from `lg`). */
  chrome?: string;
  chromeStyle?: CSSProperties;
}) {
  const sb = useContext(SidebarWidth);
  const [phone, tablet] = span ?? inferSpan(w, h, fit);
  const style = {
    "--x": `${x - sb}px`,
    "--y": `${y}px`,
    "--w": `${w}px`,
    "--h": `${h}px`,
    // design width → cell width (unitless px from --vw, see MOBILE_GRID)
    "--fill": `calc(((var(--vw, 390) - 24 - (var(--cols) - 1) * 12) / var(--cols) * var(--span) + (var(--span) - 1) * 12) / ${w})`,
  } as CSSProperties;
  return (
    <div
      style={{ "--sp-p": phone, "--sp-t": tablet, ...chromeStyle } as CSSProperties}
      className={`min-w-0 [--span:var(--sp-p)] [grid-column:span_var(--span)/span_var(--span)] sm:[--span:var(--sp-t)] lg:contents ${cellClass[fit]} ${chrome}`}
    >
      <Tag
        aria-label={label}
        style={style}
        className={`relative lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] ${zoomClass[fit]} ${className}`}
      >
        {children}
      </Tag>
    </div>
  );
}
