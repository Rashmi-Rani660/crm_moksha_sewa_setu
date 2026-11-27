"use client";

/** SA-055 — Course & Training Module Management. Demo data. */

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
  Sa51Lifecycle,
  Sa51Pill,
  Sa51SearchRow,
  Sa51Tabs,
  sa51TableCell,
  sa51TableHead,
} from "@/components/dashboards/super-admin/pages/sa51Kit";

const tabs = ["Course library", "Modules", "Versions", "Review", "Archive"] as const;
type Tab = (typeof tabs)[number];

type CourseRow = { id: string; title: string; audience: string; version: string; duration: string; status: string; prereq: string; assessment: string };
const courseRows: CourseRow[] = [
  { id: "CRS-001", title: "Free last-rites SOP", audience: "Operations", version: "v2", duration: "45 min", status: "Published", prereq: "Induction", assessment: "80% + practical" },
  { id: "CRS-002", title: "Legal clearance", audience: "Admin / User", version: "v3", duration: "60 min", status: "Published", prereq: "CRS-001", assessment: "80% + practical" },
  { id: "CRS-003", title: "Family communication", audience: "All staff", version: "v2", duration: "30 min", status: "Published", prereq: "Induction", assessment: "80%" },
  { id: "CRS-004", title: "Volunteer field safety", audience: "Volunteer App", version: "v1", duration: "45 min", status: "Review", prereq: "Volunteer induction", assessment: "80% + practical" },
  { id: "CRS-005", title: "Data privacy", audience: "All CRM users", version: "v1", duration: "30 min", status: "Draft", prereq: "None", assessment: "80%" },
  { id: "CRS-006", title: "Donation reconciliation", audience: "Finance", version: "v2", duration: "45 min", status: "Published", prereq: "Data privacy", assessment: "85% + audit check" },
];

export default function SA055CourseManagement() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Course library");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selected, setSelected] = useState<CourseRow>(courseRows[0]);

  const rows = courseRows.filter((r) => {
    const matchesQ = !q.trim() || [r.id, r.title, r.audience, r.status].some((f) => f.toLowerCase().includes(q.trim().toLowerCase()));
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  const cycleFilter = () => {
    const order = ["All", "Published", "Review", "Draft"];
    const next = order[(order.indexOf(statusFilter) + 1) % order.length];
    setStatusFilter(next);
    notice.show(`Filter: ${next} courses (demo).`);
  };

  return (
    <SuperAdminFrame active="training-excellence">
      <Sa51Header code="SA-055" title="Course & Training Module Management" />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="24" label="Courses" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Bell} value="16" label="Published" sub="Demo snapshot" />
        <KpiTile tone="orange" icon={CircleCheck} value="05" label="Draft" sub="Demo snapshot" />
        <KpiTile tone="purple" icon={Users} value="03" label="Review due" sub="Demo snapshot" />
        <KpiTile tone="sky" icon={Layers} value="02" label="Languages" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Radio} value="Tracked" label="Versions" sub="Demo snapshot" />
      </KpiRow>

      <Sa51Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="grid min-h-0 flex-1 gap-[10px] lg:grid-cols-[1.85fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Course library" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div>
              <Sa51SearchRow
                value={q}
                onChange={setQ}
                onFilter={cycleFilter}
                onExport={() => notice.show("Exported course library catalog (demo).")}
              />
              <div className="overflow-x-auto rounded-[8px] border border-[#e3e7ef]">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr>
                      {["Course ID", "Title", "Audience", "Version", "Duration", "Status"].map((h) => (
                        <th key={h} className={sa51TableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className={`cursor-pointer last:[&>td]:border-b-0 ${selected.id === r.id ? "bg-[#eef4ff]" : "even:bg-[#f8fafd] hover:bg-[#f2f6ff]"}`}
                      >
                        <td className={sa51TableCell}>{r.id}</td>
                        <td className={sa51TableCell}>{r.title}</td>
                        <td className={sa51TableCell}>{r.audience}</td>
                        <td className={sa51TableCell}>{r.version}</td>
                        <td className={sa51TableCell}>{r.duration}</td>
                        <td className={sa51TableCell}><Sa51Pill>{r.status}</Sa51Pill></td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan={6} className="py-5 text-center text-[12.5px] font-medium text-[#5b6280]">No courses match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("New course draft created with SOP linkage (demo).")}>
                Create course
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show(`Reviewing ${selected.id} content & version history (demo).`)}>
                Review content
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Module sequence" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51Lifecycle
              steps={["Introduction", "Legal clearance", "Field process", "Assessment", "Review"]}
              meta={[
                ["Lesson resources", "PDF / video / approved SOP"],
                ["Version", "v2 · retain previous results"],
              ]}
            />
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title={`Course builder · ${selected.id}`} className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <Sa51KvList
              rows={[
                ["Selected course", selected.title],
                ["Duration", selected.duration],
                ["Language", "Hindi / English"],
                ["Prerequisite", selected.prereq],
                ["Assessment", selected.assessment],
              ]}
            />
            <div className="mt-[10px] flex flex-wrap items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show(`Added lesson slot to ${selected.id} (demo).`)}>
                Add lesson
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Approved SOP / video uploader opened (demo).")}>
                Upload SOP / video
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show(`Previewing ${selected.title} (${selected.version}) (demo).`)}>
                Preview
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Publication controls" className="lg:flex-1" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <Sa51KvList
              rows={[
                ["Content owner", "Operations Admin"],
                ["Practical assessor", "Authorised"],
                ["Approval", "Required"],
                ["Archive", "Preserve records"],
              ]}
            />
            <div className="mt-[8px]">
              <Sa51Btn primary onClick={() => notice.show(`Submitted ${selected.id} for publication approval (demo).`)}>
                Publish review
              </Sa51Btn>
            </div>
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
