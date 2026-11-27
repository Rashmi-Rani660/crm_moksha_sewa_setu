"use client";

/** SA-058 — Assessment & Certification. Demo data. */

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

const tabs = ["Assessments", "Practical reviews", "Certificates", "Retests", "History"] as const;
type Tab = (typeof tabs)[number];

type AssessmentRow = { learner: string; course: string; score: string; practical: string; attempt: string; status: string };
const assessmentRows: AssessmentRow[] = [
  { learner: "EMP-001", course: "Last-rites SOP", score: "92%", practical: "Passed", attempt: "01", status: "Certified" },
  { learner: "EMP-002", course: "Legal clearance", score: "84%", practical: "Pending", attempt: "01", status: "Review" },
  { learner: "EMP-003", course: "Communication", score: "76%", practical: "N/A", attempt: "01", status: "Retest" },
  { learner: "VOL-004", course: "Field safety", score: "90%", practical: "Passed", attempt: "02", status: "Certified" },
  { learner: "EMP-005", course: "Privacy", score: "88%", practical: "N/A", attempt: "01", status: "Passed" },
  { learner: "VOL-007", course: "Field safety", score: "82%", practical: "Pending", attempt: "01", status: "Review" },
];

export default function SA058Assessments() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Assessments");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const rows = assessmentRows.filter((r) => {
    const matchesQ = !q.trim() || [r.learner, r.course, r.status].some((f) => f.toLowerCase().includes(q.trim().toLowerCase()));
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  const cycleFilter = () => {
    const order = ["All", "Certified", "Review", "Retest", "Passed"];
    const next = order[(order.indexOf(statusFilter) + 1) % order.length];
    setStatusFilter(next);
    notice.show(`Filter: ${next} assessments (demo).`);
  };

  return (
    <SuperAdminFrame active="training-excellence">
      <Sa51Header code="SA-058" title="Assessment & Certification" />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="42" label="Attempts" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Bell} value="30" label="Passed" sub="Demo snapshot" />
        <KpiTile tone="orange" icon={CircleCheck} value="08" label="Retest" sub="Demo snapshot" />
        <KpiTile tone="purple" icon={Users} value="04" label="Review pending" sub="Demo snapshot" />
        <KpiTile tone="sky" icon={Layers} value="28" label="Certificates" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Radio} value="04" label="Practical due" sub="Demo snapshot" />
      </KpiRow>

      <Sa51Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="grid min-h-0 flex-1 gap-[10px] lg:grid-cols-[1.85fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Assessment register" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div>
              <Sa51SearchRow
                value={q}
                onChange={setQ}
                onFilter={cycleFilter}
                onExport={() => notice.show("Exported assessment & certification register (demo).")}
              />
              <div className="overflow-x-auto rounded-[8px] border border-[#e3e7ef]">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr>
                      {["Learner", "Course", "Score", "Practical", "Attempt", "Status"].map((h) => (
                        <th key={h} className={sa51TableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={`${r.learner}-${r.course}`} className="even:bg-[#f8fafd] last:[&>td]:border-b-0 hover:bg-[#eef4ff]">
                        <td className={sa51TableCell}>{r.learner}</td>
                        <td className={sa51TableCell}>{r.course}</td>
                        <td className={sa51TableCell}>{r.score}</td>
                        <td className={sa51TableCell}>{r.practical}</td>
                        <td className={sa51TableCell}>{r.attempt}</td>
                        <td className={sa51TableCell}><Sa51Pill>{r.status}</Sa51Pill></td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan={6} className="py-5 text-center text-[12.5px] font-medium text-[#5b6280]">No assessments match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Opened pending practical assessment review (demo).")}>
                Review assessment
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Unique certificate issued only after mandatory checks (demo).")}>
                Issue approved certificate
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Assessment outcome · demo" className="lg:flex-1">
            <Sa51ProgressBar label="Passed · 30 of 42" pct={71.4} />
            <Sa51KvList
              rows={[
                ["Retest", "08"],
                ["Review pending", "04"],
                ["Practical assessment", "Authorised assessor"],
              ]}
            />
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Assessment & certificate preview" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div className="rounded-[8px] border border-[#dce4f2] bg-[#f4f7fd] px-[12px] py-[14px] text-center text-[12px] leading-[1.5] text-[#1a1d36]">
              <p className="font-bold tracking-[0.2px] text-[#0b0c36]">SEWA SETU · TRAINING CERTIFICATE</p>
              <p className="mt-[8px]">Demo Learner · Free last-rites SOP</p>
              <p>Certificate ID: DEMO-CERT-001</p>
              <p className="text-[#4a5070]">Issued only after approved assessment</p>
            </div>
            <div className="mt-[10px] flex flex-wrap items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Versioned exam builder opened (demo).")}>
                Exam builder
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Certificate preview rendered (demo).")}>
                Preview certificate
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Retest assigned with attempt history tracking (demo).")}>
                Retest
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Certification controls" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51KvList
              rows={[
                ["Attempts / question version", "Recorded"],
                ["Expiry / revocation", "Audited"],
                ["Appeal", "Human review"],
                ["Issue certificate", "After mandatory checks"],
              ]}
            />
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
