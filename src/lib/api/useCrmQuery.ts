"use client";

import { useCallback, useEffect, useState } from "react";
import { authorizedRequest } from "@/lib/api/authorized";
import { errorMessage, type PageMeta } from "@/lib/api/client";

/**
 * Loads one CRM API resource for a screen. `path` null = do not load (e.g. waiting for a
 * selection). Changing `path` cancels the previous request, so fast typing in a search box never
 * shows stale results; the previous data stays on screen until the new data arrives. `reload()`
 * re-fetches after a change.
 */
export interface CrmQuery<T> {
  data: T | null;
  meta: PageMeta | undefined;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

interface Result<T> {
  key: string | null;
  data: T | null;
  meta?: PageMeta;
  error: string | null;
}

export function useCrmQuery<T>(path: string | null): CrmQuery<T> {
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result<T>>({ key: null, data: null, error: null });
  const key = path ? `${tick}:${path}` : null;

  useEffect(() => {
    if (!key || !path) return;
    const controller = new AbortController();
    authorizedRequest<T>(path, { signal: controller.signal })
      .then((res) => setResult({ key, data: res.data, meta: res.meta, error: null }))
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setResult((prev) => ({ ...prev, key, error: errorMessage(err) }));
      });
    return () => controller.abort();
  }, [key, path]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data: result.data, meta: result.meta, loading: key !== null && result.key !== key, error: result.key === key ? result.error : null, reload };
}

/** Builds a query string, skipping empty values: qs({ page: 1, search: "" }) → "?page=1". */
export function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  return entries.length ? `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}` : "";
}

/** Debounced copy of a value (search boxes). */
export function useDebounced<T>(value: T, ms = 300): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);
  return v;
}
