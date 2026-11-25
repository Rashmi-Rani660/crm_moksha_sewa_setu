"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";

/**
 * Shared behaviour for the dashboard's popovers (filters, profile menu):
 * closes on outside click and Escape (returning focus to the trigger), moves
 * focus into the panel when it opens, and lets ArrowUp/ArrowDown step through
 * the elements matching `itemSelector`.
 */
export function usePopover(open: boolean, setOpen: (open: boolean) => void, itemSelector: string) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Callers pass a fresh `setOpen` each render; keep the latest in a ref so
  // the effect below only runs when the panel opens or closes.
  const setOpenRef = useRef(setOpen);
  useEffect(() => {
    setOpenRef.current = setOpen;
  });

  useEffect(() => {
    if (!open) return;
    const close = () => setOpenRef.current(false);
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    // Focus an explicit target (e.g. a search box), else the selected item,
    // else the first item.
    const panel = panelRef.current;
    const first =
      panel?.querySelector<HTMLElement>("[data-autofocus]") ??
      panel?.querySelector<HTMLElement>(`${itemSelector}[aria-selected="true"]`) ??
      panel?.querySelector<HTMLElement>(itemSelector);
    first?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, itemSelector]);

  const onPanelKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(itemSelector) ?? []);
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === "ArrowDown"
        ? items[i < 0 ? 0 : Math.min(i + 1, items.length - 1)]
        : items[i <= 0 ? 0 : i - 1];
    next.focus();
  };

  return { rootRef, triggerRef, panelRef, onPanelKeyDown };
}
