"use client";

/** SA-059 — Admin & User Performance. Demo data. */

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

const tabs = ["Overview", "Admin reviews", "User reviews", "Coaching", "Reports"] as const;
type Tab = (typeof tabs)[number];

type PerfRow = { emp: string; level: string; dept: string; tasks: number; sla: string; review: string };
const perfRows: PerfRow[] = [
  { emp: "EMP-001", level: "Admin", dept: "Operations", tasks: 24, sla: "96%", review: "Reviewed" },
  { emp: "EMP-002", level: "User", dept: "Operations", tasks: 18, sla: "94%", review: "Review" },
  { emp: "EMP-003", level: "User", dept: "Communication", tasks: 20, sla: "98%", review: "Reviewed" },
  { emp: "EMP-004", level: "Admin", dept: "Finance", tasks: 12, sla: "100%", review: "Reviewed" },
  { emp: "EMP-005", level: "User", dept: "Support", tasks: 10, sla: "90%", review: "Coaching" },
  { emp: "EMP-006", level: "User", dept: "Operations", tasks: 15, sla: "93%", review: "Review" },
];

const slaBars = [
  { label: "EMP-001 · Admin", pct: 96 },
  { label: "EMP-002 · User", pct: 94 },
  { label: "EMP-003 · User", pct: 98 },
  { label: "EMP-004 · Admin", pct: 100 },
  { label: "EMP-005 · User", pct: 90 },
];

export default function SA059Performance() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Overview");
  const [q, setQ] = useState("");
  const [levelFilter, setLevelFilter] = useState<"All" | "Admin" | "User">("All");

  const rows = perfRows.filter((r) => {
    const matchesQ = !q.trim() || [r.emp, r.level, r.dept, r.review].some((f) => f.toLowerCase().includes(q.trim().toLowerCase()));
    const matchesLevel = levelFilter === "All" || r.level === levelFilter;
    return matchesQ && matchesLevel;
  });

  const cycleFilter = () => {
    const next = levelFilter === "All" ? "Admin" : levelFilter === "Admin" ? "User" : "All";
    setLevelFilter(next);
    notice.show(`Filter: ${next} records (demo).`);
  };

  return (
    <SuperAdminFrame active="training-excellence">
      <Sa51Header code="SA-059" title="Admin & User Performance" />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="12" label="Admins" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Bell} value="173" label="Users" sub="Demo snapshot" />
        <KpiTile tone="orange" icon={CircleCheck} value="82%" label="Tasks on time" sub="Demo snapshot" />
        <KpiTile tone="purple" icon={Users} value="96%" label="SLA compliance" sub="Demo snapshot" />
        <KpiTile tone="sky" icon={Layers} value="05" label="Reviews due" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Radio} value="03" label="Coaching" sub="Demo snapshot" />
      </KpiRow>

      <Sa51Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="grid min-h-0 flex-1 gap-[10px] lg:grid-cols-[1.85fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Performance review register" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div>
              <Sa51SearchRow
                value={q}
                onChange={setQ}
                onFilter={cycleFilter}
                onExport={() => notice.show("Exported performance review register (demo).")}
              />
              <div className="overflow-x-auto rounded-[8px] border border-[#e3e7ef]">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr>
                      {["Employee", "Level", "Department", "Tasks done", "SLA", "Review"].map((h) => (
                        <th key={h} className={sa51TableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.emp} className="even:bg-[#f8fafd] last:[&>td]:border-b-0 hover:bg-[#eef4ff]">
                        <td className={sa51TableCell}>{r.emp}</td>
                        <td className={sa51TableCell}>{r.level}</td>
                        <td className={sa51TableCell}>{r.dept}</td>
                        <td className={sa51TableCell}>{r.tasks}</td>
                        <td className={sa51TableCell}>{r.sla}</td>
                        <td className={sa51TableCell}><Sa51Pill>{r.review}</Sa51Pill></td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan={6} className="py-5 text-center text-[12.5px] font-medium text-[#5b6280]">No records match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Opened human-reviewed performance workflow (demo).")}>
                Review performance
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Private coaching plan assigned (demo).")}>
                Assign coaching
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="SLA performance · sample employees" className="lg:flex-1" bodyClassName="flex flex-col justify-between pt-[6px]">
            {slaBars.map((b) => (
              <Sa51ProgressBar key={b.label} label={b.label} pct={b.pct} />
            ))}
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Performance context & review" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <Sa51KvList
              rows={[
                ["Period", "This month · demo"],
                ["Quality score", "Human-reviewed evidence"],
                ["Task complexity", "Consider in review"],
                ["Authorised leave", "Exclude appropriately"],
                ["Coaching", "Private feedback"],
              ]}
            />
            <div className="mt-[10px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Quality evidence review opened (demo).")}>
                Review quality
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Private coaching history opened (demo).")}>
                Coaching history
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Review & improvement" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51KvList
              rows={[
                ["Review due", "05"],
                ["Coaching assigned", "03"],
                ["Appeal / correction", "Available"],
                ["Disciplinary action", "Human decision only"],
              ]}
            />
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
