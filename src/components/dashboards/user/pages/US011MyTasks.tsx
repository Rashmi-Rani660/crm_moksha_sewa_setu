"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
  priority: "High" | "Normal";
  priorityTone?: "red" | "amber";
  status: string;
  statusTone: "red" | "green" | "amber" | "blue";
  action: string;
  primary?: boolean;
};

const initialTasks: TaskRow[] = [
  { id: "TASK-026", title: "TASK-026 · Verify documents", due: "10:00", priority: "High", priorityTone: "red", status: "Overdue", statusTone: "red", action: "Open", primary: true },
  { id: "TASK-028", title: "TASK-028 · Family follow-up", due: "11:30", priority: "High", priorityTone: "amber", status: "Overdue", statusTone: "red", action: "Open" },
  { id: "TASK-031", title: "TASK-031 · Update case", due: "14:00", priority: "Normal", status: "Accepted", statusTone: "green", action: "Continue" },
  { id: "TASK-032", title: "TASK-032 · Upload evidence", due: "15:00", priority: "Normal", status: "Awaiting acceptance", statusTone: "amber", action: "Accept task" },
  { id: "TASK-033", title: "TASK-033 · Daily report", due: "16:00", priority: "Normal", status: "To do", statusTone: "blue", action: "Open" },
];

export default function US011MyTasks() {
  const router = useRouter();
  const { show, node } = useUserNotice();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All tasks");
  const [tasks, setTasks] = useState(initialTasks);

  const query = q.trim().toLowerCase();
  const filtered = tasks.filter((t) => {
    const matchQ = !query || t.title.toLowerCase().includes(query);
    const matchF = filter === "All tasks" || t.status.toLowerCase() === filter.toLowerCase();
    return matchQ && matchF;
  });

  const handleAction = (row: TaskRow) => {
    if (row.action === "Accept task") {
      setTasks((prev) =>
        prev.map((item) =>
          item.id === row.id ? { ...item, status: "Accepted", statusTone: "green", action: "Continue" } : item,
        ),
      );
      show(`${row.id} accepted (demo).`);
      return;
    }
    router.push(userRoutes.taskExecution);
  };

  return (
    <UserFrame active="my-tasks">
      <UserHeader code="US-011" title="My Tasks" />
      <UserKpiRow
        items={[
          { value: "12", label: "Pending tasks", tone: "blue" },
          { value: "05", label: "Due today", tone: "orange" },
          { value: "02", label: "Overdue", tone: "red", valueRed: true },
          { value: "02", label: "Awaiting acceptance", tone: "orange" },
          { value: "04", label: "Completed today", tone: "green" },
          { value: "03", label: "Assigned cases", tone: "blue" },
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
                      {row.priority === "Normal" ? "Normal" : <UserPill tone={row.priorityTone}>{row.priority}</UserPill>}
                    </td>
                    <td className="whitespace-nowrap px-[8px]">
                      <UserPill tone={row.statusTone}>{row.status}</UserPill>
                    </td>
                    <td className="whitespace-nowrap px-[8px]">
                      <button
                        type="button"
                        onClick={() => handleAction(row)}
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
            <button type="button" onClick={() => show("Task queue refreshed.")} className={userOutlineBtn}>Refresh</button>
          </div>
        </UserPanel>

        <UserPanel title="Next action">
          <div className="rounded-[6px] border border-[#dce6f5] bg-[#eef4fc] px-[10px] py-[6px] text-[13.8px] font-medium text-[#1a1d36]">
            TASK-026 · Verify pending documents
          </div>
          <div className="mt-[4px]">
            <UserKVList
              rows={[
                ["Case", "MS-26-1101"],
                ["Due", "10:00"],
                ["Legal clearance", <UserPill key="lc" tone="red">Pending</UserPill>],
                ["Owner", "User 07"],
                ["Next step", "Review required documents"],
              ]}
            />
          </div>
          <div className="mt-[8px]">
            <button type="button" onClick={() => router.push(userRoutes.taskExecution)} className={userPrimaryBtn}>
              Open task
            </button>
          </div>
          <p className="mt-[10px] text-[13.8px] font-semibold text-[#1e43a8]">Today&apos;s progress</p>
          <div className="mt-[2px]">
            <UserKVList
              rows={[
                ["Daily completion · demo", "4 completed"],
                ["Awaiting acceptance", "02"],
                ["Overdue", "02"],
              ]}
            />
          </div>
        </UserPanel>

        <UserPanel title="Quick work">
          <div className="flex flex-wrap gap-[7px] pt-[2px]">
            <button type="button" onClick={() => router.push(userRoutes.taskExecution)} className={userPrimaryBtn}>Resume last task</button>
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
