"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useOperations } from "@/lib/crm/useOperations";
import { authorizedRequest } from "@/lib/api/authorized";
import { errorMessage } from "@/lib/api/client";
import { useDebounced } from "@/lib/api/useCrmQuery";
import { text, EMPTY, type CrmRecord } from "@/lib/crm/data";
import { shortDateTime } from "@/lib/format";
import {
  UserFlowSteps,
  UserFrame,
  UserHeader,
  UserKVList,
  UserKpiRow,
  UserPanel,
  UserPill,
  useUserNotice,
  userInk,
  userInputCls,
  userOutlineBtn,
  userPrimaryBtn,
} from "@/components/dashboards/user/UserScreenKit";
import { userRoutes } from "@/components/dashboards/user/routes";

type TaskRow = {
  id: string;
  title: string;
  due: string;
  priority: "Critical" | "High" | "Normal";
  priorityTone?: "red" | "amber";
  status: string;
  statusTone: "red" | "green" | "amber" | "blue";
  action: string;
  primary?: boolean;
};



export default function US011MyTasks() {
  const router = useRouter();
  const { show, node } = useUserNotice();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All tasks");
  const search = useDebounced(q.trim());
  const live = useOperations("tasks",show,{ mine: true,search: search || undefined,overdue: filter === "Overdue" ? true : undefined,status: filter === "Accepted" \u00b7 "ACCEPTED" : filter === "Awaiting acceptance" || filter === "To do" \u00b7 "ASSIGNED" : undefined });
  const tasks: TaskRow[] = live.rows.map(row => ({ id: text(row.id),title: text(row.taskNo) + ' \u00b7 ' + text(row.title),due: shortDateTime(text(row.dueAt,"")),priority: row.priority === "CRITICAL" \u00b7 "Critical" : row.priority === "HIGH" \u00b7 "High" : "Normal",priorityTone: row.priority === "CRITICAL" \u00b7 "red" : "amber",status: row.overdue ? "Overdue" : row.status === "ASSIGNED" \u00b7 "Awaiting acceptance" : row.displayStatus,statusTone: row.overdue ? "red" : "blue",action: row.status === "ASSIGNED" \u00b7 "Accept task" : row.status === "ACCEPTED" || row.status === "RETURNED" \u00b7 "Continue" : "Open" }));

  const query = q.trim().toLowerCase();
  const filtered = tasks.filter((t) => {
    const matchQ = !query || t.title.toLowerCase().includes(query);
    const matchF = filter === "All tasks" || filter === "To do" || t.status.toLowerCase() === filter.toLowerCase();
    return matchQ && matchF;
  });

  const handleAction = async (row: TaskRow) => {
    try {
    if (row.action === "Accept task") {
      if (!live.can("tasks.edit") || live.mutation.busy) return;
      const fresh = await authorizedRequest<CrmRecord>('/tasks/' + row.id);
      await live.mutation.run('/tasks/' + row.id + '/accept', { body: { version: fresh.data.version } }, "Task accepted.");
      return;
    }
    if (row.action === "Continue") {
      if (!live.can("tasks.edit") || live.mutation.busy) return;
      const fresh = await authorizedRequest<CrmRecord>('/tasks/' + row.id);
      const started = await live.mutation.run<CrmRecord>('/tasks/' + row.id + '/start', { body: { version: fresh.data.version } }, "Task started.");
      if (!started) return;
    }
    router.push(userRoutes.taskExecution + '?id=' + row.id);
    } catch (err) { show(errorMessage(err)); }
  };

  return (
    <UserFrame active="my-tasks">
      <UserHeader code="US-011" title="My Tasks" />
      <UserKpiRow
        items={[
          { value: live.metric("open"), label: "Pending tasks", tone: "blue" },
          { value: live.metric("dueToday"), label: "Due today", tone: "orange" },
          { value: live.metric("overdue"), label: "Overdue", tone: "red", valueRed: true },
          { value: live.metric("awaitingAcceptance"), label: "Awaiting acceptance", tone: "orange" },
          { value: live.metric("completedToday"), label: "Completed today", tone: "green" },
          { value: EMPTY, label: "Assigned cases", tone: "blue" },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-columns:771fr_385fr] lg:[grid-template-rows:335fr_163fr] lg:gap-[12px]">
        <UserPanel title="My task queue">
          <div className="flex flex-wrap gap-[8px] sm:flex-nowrap">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search task or case ID"
              aria-label="Search task or case ID"
              className={`${userInputCls} flex-1`}
            />
            <select
              aria-label="Filter tasks"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-[31px] w-full rounded-[6px] border border-[#c9d2e0] bg-white px-[10px] text-[13.8px] text-[#1a1d36] outline-none sm:w-[220px]"
            >
              <option>All tasks</option>
              <option>Overdue</option>
              <option>Accepted</option>
              <option>Awaiting acceptance</option>
              <option>To do</option>
            </select>
          </div>

          <div className="mt-[10px] overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="h-[29px] bg-[#e2e9f4] text-left text-[13.8px] font-medium text-[#1a1d36]">
                  <th className="px-[8px]">Task / case</th>
                  <th className="px-[8px]">Due</th>
                  <th className="px-[8px]">Priority</th>
                  <th className="px-[8px]">Status</th>
                  <th className="px-[8px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="h-[36px] border-b border-[#dce4ee] text-[14.2px] text-[#1a1d36]">
                    <td className="whitespace-nowrap px-[8px]">{row.title}</td>
                    <td className="whitespace-nowrap px-[8px]">{row.due}</td>
                    <td className="whitespace-nowrap px-[8px]">
                      {row.priority === "Normal" \u00b7 "Normal" : <UserPill tone={row.priorityTone}>{row.priority}</UserPill>}
                    </td>
                    <td className="whitespace-nowrap px-[8px]">
                      <UserPill tone={row.statusTone}>{row.status}</UserPill>
                    </td>
                    <td className="whitespace-nowrap px-[8px]">
                      <button
                        type="button"
                        disabled={live.mutation.busy || (row.action === "Accept task" && !live.can("tasks.edit"))} onClick={() => handleAction(row)}
                        className={row.primary ? userPrimaryBtn : userOutlineBtn}
                      >
                        {row.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-[10px] flex flex-wrap gap-[7px]">
            <button type="button" onClick={() => show("List view active.")} className={userPrimaryBtn}>List view</button>
            <button type="button" onClick={() => show("Calendar view preview.")} className={userOutlineBtn}>Calendar view</button>
            <button type="button" onClick={live.reload} className={userOutlineBtn}>Refresh</button>
          </div>
        </UserPanel>

        <UserPanel title="Next action">
          <div className="rounded-[6px] border border-[#dce6f5] bg-[#eef4fc] px-[10px] py-[6px] text-[13.8px] font-medium text-[#1a1d36]">
            {text(live.rawRows[0]?.taskNo)} ? {text(live.rawRows[0]?.title)}
          </div>
          <div className="mt-[4px]">
            <UserKVList
              rows={[
                ["Case",text(live.rawRows[0]?.reference)],
                ["Due",tasks[0]?.due ?? EMPTY],
                ["Legal clearance", <UserPill key="lc" tone="red">{EMPTY}</UserPill>],
                ["Owner",text(live.profile?.name)],
                ["Next step", "Review required documents"],
              ]}
            />
          </div>
          <div className="mt-[8px]">
            <button type="button" onClick={() => router.push(userRoutes.taskExecution + (tasks[0] ? "?id=" + tasks[0].id : ""))} className={userPrimaryBtn}>
              Open task
            </button>
          </div>
          <p className="mt-[10px] text-[13.8px] font-semibold text-[#1e43a8]">Today&apos;s progress</p>
          <div className="mt-[2px]">
            <UserKVList
              rows={[
                ["Daily completion · demo", live.metric("completedToday")],
                ["Awaiting acceptance",live.metric("awaitingAcceptance")],
                ["Overdue",live.metric("overdue")],
              ]}
            />
          </div>
        </UserPanel>

        <UserPanel title="Quick work">
          <div className="flex flex-wrap gap-[7px] pt-[2px]">
            <button type="button" onClick={() => router.push(userRoutes.taskExecution + (tasks[0] ? "?id=" + tasks[0].id : ""))} className={userPrimaryBtn}>Resume last task</button>
            <button type="button" onClick={() => setFilter("Overdue")} className={userOutlineBtn}>View overdue</button>
            <button type="button" onClick={() => router.push(userRoutes.aiWorkAssistant)} className={userOutlineBtn}>Ask AI</button>
          </div>
          <p className={`mt-[10px] text-[13.8px] ${userInk}`}>
            Only assigned work. Emergency tasks remain visible until acknowledged.
          </p>
        </UserPanel>

        <UserPanel title="Task status">
          <div className="pt-[8px]">
            <UserFlowSteps steps={["Assigned", "Accepted", "In progress", "Evidence", "Verified"]} />
          </div>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
