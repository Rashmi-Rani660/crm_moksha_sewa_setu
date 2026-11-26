"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Sidebar from "@/components/dashboards/Sidebar";
import TopBar from "@/components/dashboards/TopBar";
import { shells } from "@/components/dashboards/shells";
import { useAuthSession, type Role } from "@/lib/auth/session";

/**
 * The dashboards are drawn on the design's 1600×901 canvas and every block is
 * placed with the design's pixel coordinates (see `Box`). From `lg` up the
 * canvas is zoomed so the whole dashboard fits the window (`--vw` / `--vh` come
 * from the inline script in `app/layout.tsx`). When the window is wider than
 * the design, the content is stretched sideways to use the spare width (up to
 * MAX_STRETCH, see `--k`); anything beyond that is shared on both sides.
 *
 * Below `lg` (phones, tablets) the blocks flow and wrap in design order, all
 * zoomed by the same factor `--s` so a ~490px design card fits the screen
 * width (never stretched, at most 1.1×). Blocks wider than that scroll
 * sideways inside themselves (or are cropped, see `Box` `fit`).
 */
export const DESIGN_W = 1600;
export const DESIGN_H = 901;

const SidebarWidth = createContext(0);

/** Hamburger: collapses the sidebar from `lg` up, opens it as a drawer below. */
const MenuToggle = createContext<() => void>(() => {});
export const useMenuToggle = () => useContext(MenuToggle);

const DESKTOP = "(min-width: 1024px)";

/** Below `lg`: zoom that fits a 490px design card in the window (max 1.1). */
const MOBILE_SCALE = "min(1.1, calc((var(--vw, 390) - 40) / 490))";

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
    if (!session) router.replace("/login");
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
            style={{ "--inner": `${DESIGN_W - sidebarWidth}px`, "--s": MOBILE_SCALE } as CSSProperties}
            className="flex flex-wrap content-start justify-center gap-3 p-3 lg:relative lg:overflow-visible lg:mx-auto lg:block lg:h-[901px] lg:w-[var(--inner)] lg:gap-0 lg:p-0 lg:[transform:scaleX(var(--k))]"
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
 * How a block behaves below `lg`: `scale` (zoomed by `--s`, the default for
 * normal blocks), `scroll` (zoomed, scrolls sideways when wider than the
 * screen — default for blocks 600px+ wide), `clip` (zoomed, cropped to the
 * screen width) or `fluid` (full width, natural height, not zoomed).
 */
export type BoxFit = "scale" | "scroll" | "clip" | "fluid";

const zoomed = "h-[var(--h)] w-[var(--w)] [zoom:var(--s)] lg:[zoom:1]";
const fitClass: Record<BoxFit, string> = {
  scale: zoomed,
  scroll: zoomed,
  clip: zoomed,
  fluid: "w-full lg:h-[var(--h)] lg:w-[var(--w)]",
};

/** Wrapper below `lg` for `scroll` / `clip`; it disappears from `lg` up. */
const wrapClass: Partial<Record<BoxFit, string>> = {
  scroll: "w-full overflow-x-auto overscroll-x-contain lg:contents",
  clip: "w-full overflow-hidden rounded-[12px] lg:contents",
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
}: {
  at: [number, number, number, number];
  className?: string;
  children?: ReactNode;
  as?: "section" | "div" | "footer";
  label?: string;
  fit?: BoxFit;
}) {
  const sb = useContext(SidebarWidth);
  const style = {
    "--x": `${x - sb}px`,
    "--y": `${y}px`,
    "--w": `${w}px`,
    "--h": `${h}px`,
  } as CSSProperties;
  const block = (
    <Tag
      aria-label={label}
      style={style}
      className={`relative shrink-0 lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] ${fitClass[fit]} ${className}`}
    >
      {children}
    </Tag>
  );
  const wrap = wrapClass[fit];
  return wrap ? <div className={wrap}>{block}</div> : block;
}
