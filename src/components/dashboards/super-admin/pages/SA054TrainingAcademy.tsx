"use client";

/** SA-054 — AI Training Academy Dashboard. Demo data. */

import { useState } from "react";
import { Bell, CircleCheck, Layers, Radio, Users } from "lucide-react";
import { SuperAdminFrame, useNotice } from "@/components/dashboards/super-admin/kit";
import {
  KpiRow,
  KpiTile,
  Panel,
  Sa51Btn,
  Sa51Header,
  Sa51KvList,
  Sa51Pill,
  Sa51ProgressBar,
  Sa51SearchRow,
  Sa51Tabs,
  sa51TableCell,
  sa51TableHead,
} from "@/components/dashboards/super-admin/pages/sa51Kit";

const tabs = ["Overview", "Role progress", "Learning queue", "Assessments", "Reports"] as const;
type Tab = (typeof tabs)[number];

type TrackRow = { track: string; assigned: number; qualified: number; pending: number; status: string };
const trackRows: TrackRow[] = [
  { track: "Sewa operations", assigned: 40, qualified: 35, pending: 5, status: "Review" },
  { track: "Legal & documentation", assigned: 32, qualified: 29, pending: 3, status: "On track" },
  { track: "Communication", assigned: 30, qualified: 27, pending: 3, status: "On track" },
  { track: "Volunteer safety", assigned: 24, qualified: 19, pending: 5, status: "Review" },
  { track: "Security & privacy", assigned: 30, qualified: 24, pending: 6, status: "Review" },
];

const qualificationBars = [
  { label: "Sewa operations", pct: 87.5 },
  { label: "Legal & documentation", pct: 90.6 },
  { label: "Communication", pct: 90 },
  { label: "Volunteer safety", pct: 79.2 },
  { label: "Security & privacy", pct: 80 },
];

export default function SA054TrainingAcademy() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Overview");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "On track" | "Review">("All");

  const rows = trackRows.filter((r) => {
    const matchesQ = !q.trim() || r.track.toLowerCase().includes(q.trim().toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  const cycleFilter = () => {
    const next = statusFilter === "All" ? "On track" : statusFilter === "On track" ? "Review" : "All";
    setStatusFilter(next);
    notice.show(`Filter: ${next} tracks (demo).`);
  };

  return (
    <SuperAdminFrame active="training-excellence">
      <Sa51Header code="SA-054" title="AI Training Academy Dashboard" />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="156" label="Learners" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Bell} value="134" label="Qualified" sub="Demo snapshot" />
        <KpiTile tone="orange" icon={CircleCheck} value="08" label="In training" sub="Demo snapshot" />
        <KpiTile tone="purple" icon={Users} value="14" label="Not started" sub="Demo snapshot" />
        <KpiTile tone="sky" icon={Layers} value="05" label="Overdue" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Radio} value="86%" label="Completion" sub="Demo snapshot" />
      </KpiRow>

      <Sa51Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="grid min-h-0 flex-1 gap-[10px] lg:grid-cols-[1.85fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Role-wise learning progress" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div>
              <Sa51SearchRow
                value={q}
                onChange={setQ}
                onFilter={cycleFilter}
                onExport={() => notice.show("Exported role-wise learning progress (demo).")}
              />
              <div className="overflow-x-auto rounded-[8px] border border-[#e3e7ef]">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr>
                      {["Learning track", "Assigned", "Qualified", "Pending", "Status"].map((h) => (
                        <th key={h} className={sa51TableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.track} className="even:bg-[#f8fafd] last:[&>td]:border-b-0 hover:bg-[#eef4ff]">
                        <td className={sa51TableCell}>{r.track}</td>
                        <td className={sa51TableCell}>{r.assigned}</td>
                        <td className={sa51TableCell}>{r.qualified}</td>
                        <td className={sa51TableCell}>{r.pending}</td>
                        <td className={sa51TableCell}><Sa51Pill>{r.status}</Sa51Pill></td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan={5} className="py-5 text-center text-[12.5px] font-medium text-[#5b6280]">No learning tracks match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Course assignment wizard opened (demo).")}>
                Assign course
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Assessment & practical review results opened (demo).")}>
                Review results
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Learning-track qualification progress" className="lg:flex-1" bodyClassName="flex flex-col justify-between pt-[6px]">
            {qualificationBars.map((b) => (
              <Sa51ProgressBar key={b.label} label={b.label} pct={b.pct} />
            ))}
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Training deadlines & exceptions" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <Sa51KvList
              rows={[
                ["Upcoming deadline", "30 Nov · demo"],
                ["Overdue learners", "05"],
                ["Refresher due", "05"],
                ["Practical review", "Required where applicable"],
                ["Retest", "Assign on failure"],
              ]}
            />
            <div className="mt-[10px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Opened training & refresher calendar (demo).")}>
                Training calendar
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("05 overdue learners queued for reminder (demo).")}>
                Review overdue
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Learner status · 156 enrolled" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51KvList
              rows={[
                ["Qualified", "134"],
                ["In training", "08"],
                ["Not started", "14"],
                ["Staff / volunteer", "Separate scope"],
                ["Completion vs qualification", "Separate indicators"],
              ]}
            />
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
