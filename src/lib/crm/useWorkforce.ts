"use client";

import { useEffect, useRef } from "react";
import { authorizedRequest } from "@/lib/api/authorized";
import { ApiError, errorMessage } from "@/lib/api/client";
import { useCrmAccess } from "@/lib/api/useCrmAccess";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { qs, useCrmQuery } from "@/lib/api/useCrmQuery";
import { choose, EMPTY, istTimestamp, reason, records, text, type CrmRecord } from "./data";
import { useIstDay } from "./useResource";

export function useWorkforce(show: (message: string) => void) {
  const access = useCrmAccess();
  const attendance = useCrmQuery<CrmRecord>(access.can("attendance.view") ? "/workforce/attendance/me" : null);
  const duty = useCrmQuery<CrmRecord>(access.can("attendance.view") ? "/workforce/duty/me" : null);
  const leave = useCrmQuery<CrmRecord[]>(access.can("attendance.view") ? "/workforce/leave?mine=true&limit=100" : null);
  const mutation = useCrmMutation(show);
  const gpsStopped = useRef(false);
  const gpsController = useRef<AbortController | null>(null);
  const lastSent = useRef(0);
  const stopGps = () => { gpsStopped.current = true; gpsController.current?.abort(); };
  const consent = duty.data?.gpsConsent === true && duty.data.status === "ON_DUTY";
  const checkedOut = !!(attendance.data?.today as CrmRecord | null)?.checkOutAt;

  useEffect(() => {
    if (!consent || checkedOut) return;
    gpsStopped.current = false;
    const controller = new AbortController();
    gpsController.current = controller;
    let pending = false;
    const send = () => {
      if (gpsStopped.current || pending || document.visibilityState !== "visible" || Date.now() - lastSent.current < 30_000) return;
      if (!navigator.geolocation) return;
      pending = true;
      navigator.geolocation.getCurrentPosition(position => {
        pending = false;
        if (gpsStopped.current || controller.signal.aborted || document.visibilityState !== "visible") return;
        lastSent.current = Date.now();
        void authorizedRequest("/workforce/duty/location", { body: { lat: position.coords.latitude,lng: position.coords.longitude,accuracy: Math.min(10_000,position.coords.accuracy),at: new Date(position.timestamp).toISOString() },signal: controller.signal }).catch((err: unknown) => {
          if (err instanceof ApiError && err.code === "CRM_GPS_CONSENT_REQUIRED") { gpsStopped.current = true; controller.abort(); }
          else if (!controller.signal.aborted) show(errorMessage(err));
        });
      }, () => { pending = false; }, { maximumAge: 0, timeout: 15_000 });
    };
    send();
    const timer = window.setInterval(send,30_000);
    document.addEventListener("visibilitychange",send);
    return () => { gpsStopped.current = true; controller.abort(); window.clearInterval(timer); document.removeEventListener("visibilitychange",send); };
  }, [consent, checkedOut, show]);

  async function action(name: "check-in" | "check-out" | "start" | "end" | "consent" | "safety", gpsConsent = false) {
    if (!access.can("attendance.create") || mutation.busy) return;
    if (name === "check-out" || name === "end" || (name === "consent" && !gpsConsent)) stopGps();
    const attendanceAction = name === "check-in" || name === "check-out";
    const body = attendanceAction ? name === "check-in" ? {} : undefined : name === "start" || name === "consent" ? { gpsConsent } : name === "safety" ? { status: "NEED_HELP" } : undefined;
    await mutation.run(`/workforce/${attendanceAction ? "attendance" : "duty"}/${name}`, { method: "POST",body }, name === "safety" ? "Help requested — your team has been alerted" : "Saved.");
  }
  async function requestLeave() {
    const type = window.prompt("Leave type: CASUAL, SICK, EMERGENCY, OTHER")?.trim();
    const fromDay = window.prompt("From day (YYYY-MM-DD):")?.trim(); const toDay = window.prompt("To day (YYYY-MM-DD):")?.trim(); const note = reason();
    if (!type || !fromDay || !toDay || !note || !access.can("attendance.create")) return;
    await mutation.run("/workforce/leave", { body: { type,fromDay,toDay,reason: note } }, "Leave requested.");
  }
  return { ...access,attendance,duty,leave,mutation,action,requestLeave };
}

export function usePlanner(show: (message: string) => void) {
  const access = useCrmAccess();
  const today = useIstDay();
  const start = today ? `${today.slice(0,8)}01T00:00:00+05:30` : "";
  const range = { from: start, to: start ? new Date(Date.parse(start) + 31 * 86400000).toISOString() : "" };
  const planner = useCrmQuery<CrmRecord[]>(today && access.can("planner.view") ? `/workforce/planner${qs(range)}` : null);
  const handovers = useCrmQuery<CrmRecord[]>(access.can("planner.view") ? "/workforce/handovers?limit=100" : null);
  const recipients = useCrmQuery<CrmRecord[]>(access.can("users.view") ? "/users?status=ACTIVE&limit=100" : null);
  const mutation = useCrmMutation(show);
  async function add() {
    const title = window.prompt("Reminder title:")?.trim(); const startAt = istTimestamp(window.prompt("When (YYYY-MM-DD HH:MM, IST):") || "");
    if (title && startAt && access.can("planner.create")) await mutation.run("/workforce/planner", { body: { title,type: "REMINDER",startAt } }, "Reminder added.");
  }
  async function reschedule() {
    const item = choose(records(planner.data),"Choose planner item","title"); const startAt = istTimestamp(window.prompt("New time (YYYY-MM-DD HH:MM, IST):") || "");
    if (item && startAt && access.can("planner.edit")) await mutation.run(`/workforce/planner/${item.id}`, { method: "PATCH",body: { version: item.version,startAt } }, "Rescheduled.");
  }
  async function handover() {
    const to = choose(records(recipients.data).filter(person => person.id !== access.profile?.id),"Receiving owner");
    const summary = window.prompt("Handover summary:")?.trim(); if (!to || !summary || !access.can("planner.create")) return;
    await mutation.run("/workforce/handovers", { body: { toUserId: to.id,summary } }, "Handover sent.");
  }
  async function acknowledge() {
    const item = choose(records(handovers.data).filter(row => row.status === "PENDING"),"Choose incoming handover","summary");
    if (!item) return;
    await mutation.run(`/workforce/handovers/${item.id}/acknowledge`, { body: { version: item.version } }, "Acknowledged.");
  }
  return { ...access,planner,handovers,recipients,mutation,add,reschedule,handover,acknowledge,range,today,EMPTY,text };
}
