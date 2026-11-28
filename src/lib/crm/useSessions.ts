"use client";

import { useState } from "react";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { useCrmAccess } from "@/lib/api/useCrmAccess";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { endSession, readTokens } from "@/lib/auth/session";
import { choose, reason, records, text, type CrmRecord } from "./data";

export function useSessions(kind: "sessions" | "devices", show: (message: string) => void) {
  const access = useCrmAccess();
  const [person,setPerson] = useState<CrmRecord | null>(null);
  const users = useCrmQuery<CrmRecord[]>(access.can("users.view") ? "/users?limit=100" : null);
  const own = !person || person.id === access.profile?.id;
  const list = useCrmQuery<CrmRecord[]>(access.profile ? own ? `/auth/${kind}` : `/users/${person?.id}/${kind}` : null);
  const mutation = useCrmMutation(show);
  const selectUser = () => { const chosen = choose(records(users.data),"Select user"); if (chosen) setPerson(chosen); };
  const canRevoke = (id: string) => !!id && !mutation.busy && (own || kind === "devices" && access.can("users.edit"));
  async function revoke(id: string) {
    if (!canRevoke(id)) return;
    if (own) {
      const result = await mutation.run<null>(`/auth/${kind}/${id}`, { method: "DELETE" }, "Revoked.");
      if (result !== undefined && kind === "sessions" && readTokens()?.sessionId === id) endSession("Your session has ended. Please sign in again.");
    } else if (kind === "devices") {
      const note = reason(); if (!note) return;
      await mutation.run(`/users/${person?.id}/devices/${id}/revoke`, { body: { reason: note } }, "Device revoked.");
    }
  }
  return { ...access,list,users,person,own,mutation,selectUser,canRevoke,revoke,
    userName: text(person?.name ?? access.profile?.name),
  };
}
