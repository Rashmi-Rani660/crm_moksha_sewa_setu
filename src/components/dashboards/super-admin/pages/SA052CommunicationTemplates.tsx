"use client";

/** SA-052 — Notification & Communication Templates. Demo data. */

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

const tabs = ["Templates", "Drafts", "Approvals", "Versions", "Archive"] as const;
type Tab = (typeof tabs)[number];

type TemplateRow = { id: string; channel: string; purpose: string; language: string; version: string; status: string; body: string; vars: string };
const templateRows: TemplateRow[] = [
  {
    id: "TPL-001",
    channel: "WhatsApp",
    purpose: "Request acknowledgement",
    language: "Hindi",
    version: "v2",
    status: "Approved",
    body: "Namaskar, [name] ji. Your request [request_id] has been received. Our team will review eligibility and guide you.",
    vars: "name, request_id",
  },
  {
    id: "TPL-002",
    channel: "Email",
    purpose: "Document clarification",
    language: "English",
    version: "v1",
    status: "Approved",
    body: "Dear [name], please share the pending clearance document for request [request_id] so our centre can proceed.",
    vars: "name, request_id",
  },
  {
    id: "TPL-003",
    channel: "SMS",
    purpose: "Task reminder",
    language: "Hindi",
    version: "v3",
    status: "Approved",
    body: "Sewa Setu: Task [task_id] for case [case_id] is due today. Please update status in CRM.",
    vars: "task_id, case_id",
  },
  {
    id: "TPL-004",
    channel: "In-app",
    purpose: "Emergency alert",
    language: "English",
    version: "v2",
    status: "Review",
    body: "Urgent dispatch alert for [centre]: request [request_id] requires immediate human supervisor review.",
    vars: "centre, request_id",
  },
  {
    id: "TPL-005",
    channel: "WhatsApp",
    purpose: "Donation receipt",
    language: "English",
    version: "v1",
    status: "Draft",
    body: "Thank you [donor_name] for your verified non-cash support towards [initiative]. Reference: [receipt_id].",
    vars: "donor_name, initiative, receipt_id",
  },
  {
    id: "TPL-006",
    channel: "Email",
    purpose: "Case closure",
    language: "Hindi",
    version: "v1",
    status: "Retired",
    body: "Namaskar [name] ji, Sewa case [case_id] has been completed and closed with gratitude.",
    vars: "name, case_id",
  },
];

export default function SA052CommunicationTemplates() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Templates");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selected, setSelected] = useState<TemplateRow>(templateRows[0]);

  const rows = templateRows.filter((r) => {
    const matchesQ = !q.trim() || [r.id, r.channel, r.purpose, r.language, r.status].some((f) => f.toLowerCase().includes(q.trim().toLowerCase()));
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  const cycleFilter = () => {
    const order = ["All", "Approved", "Review", "Draft", "Retired"];
    const next = order[(order.indexOf(statusFilter) + 1) % order.length];
    setStatusFilter(next);
    notice.show(`Filter: ${next} templates (demo).`);
  };

  return (
    <SuperAdminFrame active="communication-hub">
      <Sa51Header code="SA-052" title="Notification & Communication Templates" />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="18" label="Approved" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Bell} value="06" label="Draft" sub="Demo snapshot" />
        <KpiTile tone="orange" icon={CircleCheck} value="03" label="Pending review" sub="Demo snapshot" />
        <KpiTile tone="purple" icon={Users} value="04" label="Retired" sub="Demo snapshot" />
        <KpiTile tone="sky" icon={Layers} value="02" label="Languages" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Radio} value="04" label="Channels" sub="Demo snapshot" />
      </KpiRow>

      <Sa51Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="grid min-h-0 flex-1 gap-[10px] lg:grid-cols-[1.85fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Communication template register" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div>
              <Sa51SearchRow
                value={q}
                onChange={setQ}
                onFilter={cycleFilter}
                onExport={() => notice.show("Exported communication template register (demo).")}
              />
              <div className="overflow-x-auto rounded-[8px] border border-[#e3e7ef]">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr>
                      {["Template ID", "Channel", "Purpose", "Language", "Version", "Status"].map((h) => (
                        <th key={h} className={sa51TableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className={`cursor-pointer last:[&>td]:border-b-0 ${selected.id === r.id ? "bg-[#f2f6ff]" : "hover:bg-[#f8faff]"}`}
                      >
                        <td className={sa51TableCell}>{r.id}</td>
                        <td className={sa51TableCell}>{r.channel}</td>
                        <td className={sa51TableCell}>{r.purpose}</td>
                        <td className={sa51TableCell}>{r.language}</td>
                        <td className={sa51TableCell}>{r.version}</td>
                        <td className={sa51TableCell}><Sa51Pill>{r.status}</Sa51Pill></td>
                      </tr>
                    ))}
                    {!rows.length && (
                      <tr>
                        <td colSpan={6} className="py-5 text-center text-[12.5px] font-medium text-[#5b6280]">No templates match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("New template draft created with required variable validation (demo).")}>
                Create template
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show(`Reviewing ${selected.id} (${selected.version}) approval history (demo).`)}>
                Review version
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Template lifecycle" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51Lifecycle
              steps={["Draft", "Validate variables", "Test", "Approve", "Publish"]}
              meta={[
                ["Channels", "WhatsApp / email / SMS / app / voice"],
                ["Version history", "Retain approved versions"],
              ]}
            />
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title={`Selected template · ${selected.id}`} className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div className="flex flex-col gap-[10px]">
              <div className="rounded-[8px] border border-[#dce4f2] bg-[#f4f7fd] px-[11px] py-[10px] text-[12.5px] leading-[1.45] text-[#1a1d36]">
                {selected.body}
              </div>
              <Sa51KvList
                rows={[
                  ["Language", "Hindi / English"],
                  ["Variables", selected.vars],
                  ["Provider approval", "Verify before send"],
                ]}
              />
            </div>
            <div className="mt-[10px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show(`Masked sample preview rendered for ${selected.id} (demo).`)}>
                Preview
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show(`Test send queued to authorised recipient for ${selected.id} (demo).`)}>
                Test send
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Delivery safeguards" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51KvList
              rows={[
                ["WhatsApp", "Opt-in and approved template"],
                ["SMS", "Outbound only"],
                ["Sensitive replies", "Human review"],
                ["Rollback", "Previous approved version"],
              ]}
            />
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
