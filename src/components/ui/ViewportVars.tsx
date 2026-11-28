"use client";

import { useEffect } from "react";

/**
 * Publishes the window size as unitless CSS variables (--vw = width without
 * the scrollbar, --vh). Keeps layout scaling accurate on mount and resize.
 */
export default function ViewportVars() {
  useEffect(() => {
    const d = document.documentElement;
    const sync = () => {
      d.style.setProperty("--vw", String(d.clientWidth || window.innerWidth));
      d.style.setProperty("--vh", String(window.innerHeight));
    };
    sync();
    window.addEventListener("resize", sync);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    ro?.observe(d);
    return () => {
      window.removeEventListener("resize", sync);
      ro?.disconnect();
    };
  }, []);

  return null;
}
