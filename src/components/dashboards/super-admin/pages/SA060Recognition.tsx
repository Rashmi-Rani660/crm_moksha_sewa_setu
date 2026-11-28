"use client";

/** SA-060 — Sewa Excellence & Recognition. Demo data. */

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

const tabs = ["Recognition", "Nominations", "Milestones", "Review", "History"] as const;
type Tab = (typeof tabs)[number];

type RecRow = { id: string; recipient: string; category: string; evidence: string; reviewer: string; status: string };
const recRows: RecRow[] = [
  { id: "REC-001", recipient: "EMP-001", category: "Service quality", evidence: "Case-linked", reviewer: "Admin 01", status: "Approved" },
  { id: "REC-002", recipient: "VOL-004", category: "Sewa hours", evidence: "Verified log", reviewer: "Admin 02", status: "Review" },
  { id: "REC-003", recipient: "EMP-003", category: "Team support", evidence: "Task record", reviewer: "Admin 01", status: "Approved" },
  { id: "REC-004", recipient: "VOL-007", category: "Field contribution", evidence: "Verified log", reviewer: "Admin 02", status: "Review" },
  { id: "REC-005", recipient: "EMP-005", category: "Learning milestone", evidence: "Certificate", reviewer: "Admin 03", status: "Approved" },
];

export default function SA060Recognition() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Recognition");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Approved" | "Review">("All");

  const rows = recRows.filter((r) => {
    const matchesQ = !q.trim() || [r.id, r.recipient, r.category, r.evidence, r.status].some((f) => f.toLowerCase().includes(q.trim().toLowerCase()));
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  const cycleFilter = () => {
    const next = statusFilter === "All" ? "Approved" : statusFilter === "Approved" ? "Review" : "All";
    setStatusFilter(next);
    notice.show(`Filter: ${next} recognitions (demo).`);
  };

  return (
    <SuperAdminFrame active="training-excellence">
      <Sa51Header code="SA-060" title="Sewa Excellence & Recognition" />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="12" label="Recognitions" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Bell} value="06" label="Milestones" sub="Demo snapshot" />
        <KpiTile tone="orange" icon={CircleCheck} value="03" label="Pending review" sub="Demo snapshot" />
        <KpiTile tone="purple" icon={Users} value="09" label="Approved" sub="Demo snapshot" />
        <KpiTile tone="sky" icon={Layers} value="03" label="Training alerts" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Radio} value="Consent only" label="Published" sub="Demo snapshot" />
      </KpiRow>

      <Sa51Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="grid min-h-0 flex-1 gap-[10px] lg:grid-cols-[1.85fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Recognition register" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div>
              <Sa51SearchRow
                value={q}
                onChange={setQ}
                onFilter={cycleFilter}
                onExport={() => notice.show("Exported recognition register without beneficiary PII (demo).")}
              />
              <div className="overflow-x-auto rounded-[8px] border border-[#e3e7ef]">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr>
                      {["Recognition ID", "Recipient", "Category", "Evidence", "Reviewer", "Status"].map((h) => (
                        <th key={h} className={sa51TableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="even:bg-[#f8fafd] last:[&>td]:border-b-0 hover:bg-[#eef4ff]">
                        <td className={sa51TableCell}>{r.id}</td>
                        <td className={sa51TableCell}>{r.recipient}</td>
                        <td className={sa51TableCell}>{r.category}</td>
                        <td className={sa51TableCell}>{r.evidence}</td>
                        <td className={sa51TableCell}>{r.reviewer}</td>
                        <td className={sa51TableCell}><Sa51Pill>{r.status}</Sa51Pill></td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan={6} className="py-5 text-center text-[14.5px] font-medium text-[#5b6280]">No recognitions match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("New recognition nomination submitted for independent review (demo).")}>
                Nominate
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Independent approval & consent check completed (demo).")}>
                Approve recognition
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Contribution & recognition lifecycle" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51Lifecycle
              steps={["Nominate", "Verify evidence", "Independent review", "Approve", "Recognise"]}
              meta={[
                ["Contribution", "Verified service hours / quality"],
                ["Milestones", "Learning / team / service"],
              ]}
            />
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Recognition preview" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div className="rounded-[8px] border border-[#dce4f2] bg-[#f4f7fd] px-[12px] py-[14px] text-center text-[14px] leading-[1.5] text-[#1a1d36]">
              <p className="font-bold tracking-[0.2px] text-[#0b0c36]">SEWA EXCELLENCE</p>
              <p className="mt-[8px]">Certificate of Appreciation</p>
              <p>Demo Volunteer · Verified contribution</p>
              <p className="text-[#4a5070]">Recognition subject to approval and consent</p>
            </div>
            <div className="mt-[10px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Appreciation certificate previewed with consent check (demo).")}>
                Preview award
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Nomination evidence & independent reviewer log opened (demo).")}>
                Review nomination
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Fair recognition controls" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51KvList
              rows={[
                ["Staff / volunteer", "Separate records"],
                ["Public recognition", "Consent required"],
                ["Sensitive case details", "Excluded"],
                ["Appeal", "Available"],
              ]}
            />
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
