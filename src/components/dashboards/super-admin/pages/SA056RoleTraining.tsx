"use client";

/** SA-056 — Role-wise Training Assignment. Demo data. */

import { useState } from "react";
import { Bell, CircleCheck, Layers, Radio, Users } from "lucide-react";
import { SuperAdminFrame, Tabs, useNotice } from "@/components/dashboards/super-admin/kit";
import {
  KpiRow,
  KpiTile,
  Panel,
  Sa51Btn,
  Sa51Header,
  Sa51KvList,
  Sa51Lifecycle,
  Sa51Pill,
  sa51TableCell,
  sa51TableHead,
} from "@/components/dashboards/super-admin/pages/sa51Kit";

const tabs = ["Assignment", "Learner preview", "Schedule", "History"] as const;
type Tab = (typeof tabs)[number];

const planRows = [
  { course: "Free last-rites SOP", audience: "Operations User", due: "30 Nov", criteria: "80% + practical", status: "Required" },
  { course: "Legal clearance", audience: "Operations User", due: "30 Nov", criteria: "80% + practical", status: "Required" },
  { course: "Family communication", audience: "Operations User", due: "30 Nov", criteria: "80%", status: "Required" },
  { course: "Data privacy", audience: "All CRM users", due: "15 Dec", criteria: "80%", status: "Existing" },
];

export default function SA056RoleTraining() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Assignment");

  return (
    <SuperAdminFrame active="training-excellence">
      <Sa51Header code="SA-056" title="Role-wise Training Assignment" />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="03" label="Access levels" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Bell} value="User" label="Selected role" sub="Demo snapshot" />
        <KpiTile tone="orange" icon={CircleCheck} value="03" label="Required courses" sub="Demo snapshot" />
        <KpiTile tone="purple" icon={Users} value="18" label="Eligible learners" sub="Demo snapshot" />
        <KpiTile tone="sky" icon={Layers} value="30 Nov" label="Due date" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Radio} value="Required" label="Assessment" sub="Demo snapshot" />
      </KpiRow>

      <Tabs
        tabs={tabs}
        value={tab}
        onChange={(t) => {
          setTab(t);
          if (t !== "Assignment") notice.show(`Viewing ${t} (demo snapshot).`);
        }}
      />

      <div className="grid min-h-0 flex-1 gap-[10px] lg:grid-cols-[1.85fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Required learning plan" className="lg:flex-[1.55]" bodyClassName="flex flex-col justify-between pt-[6px]">
            <div className="overflow-x-auto rounded-[8px] border border-[#e3e7ef]">
              <table className="w-full min-w-max border-collapse">
                <thead>
                  <tr>
                    {["Course", "Audience", "Due date", "Pass criteria", "Status"].map((h) => (
                      <th key={h} className={sa51TableHead}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {planRows.map((r) => (
                    <tr key={r.course} className="last:[&>td]:border-b-0 hover:bg-[#f8faff]">
                      <td className={sa51TableCell}>{r.course}</td>
                      <td className={sa51TableCell}>{r.audience}</td>
                      <td className={sa51TableCell}>{r.due}</td>
                      <td className={sa51TableCell}>{r.criteria}</td>
                      <td className={sa51TableCell}><Sa51Pill>{r.status}</Sa51Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Previewing 18 eligible Operations User learners (demo).")}>
                Preview learners
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Role-wise training assignment queued for approval & audit (demo).")}>
                Assign training
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Enrolment workflow" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51Lifecycle
              steps={["Preview", "Check prerequisites", "Approve", "Assign", "Track"]}
              meta={[
                ["Auto enrolment", "New joiner / SOP update"],
                ["Refresher / retest", "Rule-based reminders"],
              ]}
            />
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Assignment configuration" className="lg:flex-[1.55]" bodyClassName="flex flex-col justify-between pt-[6px]">
            <Sa51KvList
              rows={[
                ["Access level", "User"],
                ["Department / centre", "Operations / Ghaziabad"],
                ["Mode", "Approval-based"],
                ["Eligible learners", "18 · demo"],
                ["Scope", "Individual / group / volunteer app"],
              ]}
            />
            <div className="mt-[10px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("18 eligible learners matched; 0 volunteer identity overlaps (demo).")}>
                Preview learners
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Prerequisite & conflict check passed: 0 conflicts (demo).")}>
                Check conflicts
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Assignment safeguards" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51KvList
              rows={[
                ["Due date", "Required"],
                ["Conflicting enrolment", "Review before assignment"],
                ["Volunteer app", "Separate identity"],
                ["Permissions", "No automatic elevation"],
              ]}
            />
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
