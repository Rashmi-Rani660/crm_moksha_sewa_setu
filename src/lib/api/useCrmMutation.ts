"use client";

import { useRef, useState } from "react";
import { authorizedRequest } from "./authorized";
import { ApiError, errorMessage, type FieldIssue, type RequestOptions } from "./client";
import { clearFieldIssues, showFieldIssues } from "@/lib/crm/formFields";

/** A synchronous guard also prevents double clicks before React has rendered the busy state. */
export function useCrmMutation(show: (message: string) => void) {
  const locked = useRef(false);
  const [busy, setBusy] = useState(false);
  const [issues, setIssues] = useState<FieldIssue[]>([]);
  async function run<T>(path: string, options: Omit<RequestOptions, "token">, success?: string): Promise<T | undefined> {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setIssues([]);
    clearFieldIssues();
    try {
      const result = await authorizedRequest<T>(path, options);
      if (success) show(result.message || success);
      return result.data;
    } catch (err) {
      setIssues(err instanceof ApiError ? err.fieldIssues : []);
      if (err instanceof ApiError) showFieldIssues(err.fieldIssues);
      show(errorMessage(err));
      return undefined;
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return { run, busy, issues };
}
