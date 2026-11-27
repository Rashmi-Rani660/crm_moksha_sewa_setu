"use client";

/** SA-057 — AI Virtual Trainer Configuration. Demo data. */

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

const tabs = ["Configuration", "Knowledge", "Practice", "Quality", "Release"] as const;
type Tab = (typeof tabs)[number];

const configRows = [
  { config: "Trainer name", value: "Sewa Sathi", validation: "Demo" },
  { config: "Audience", value: "Operations User", validation: "Scoped" },
  { config: "Language", value: "Hindi / English", validation: "Enabled" },
  { config: "Knowledge source", value: "Approved SOP library", validation: "Versioned" },
  { config: "Scenario", value: "Family seeking free cremation", validation: "Sandbox" },
  { config: "Assessment rubric", value: "Accuracy / empathy / safety", validation: "Review" },
];

export default function SA057VirtualTrainer() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Configuration");

  return (
    <SuperAdminFrame active="training-excellence">
      <Sa51Header code="SA-057" title="AI Virtual Trainer Configuration" />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="Sewa Sathi" label="Trainer" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Bell} value="02" label="Languages" sub="Demo snapshot" />
        <KpiTile tone="orange" icon={CircleCheck} value="Approved" label="Knowledge" sub="Demo snapshot" />
        <KpiTile tone="purple" icon={Users} value="Sandbox" label="Practice mode" sub="Demo snapshot" />
        <KpiTile tone="sky" icon={Layers} value="Required" label="Review" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Radio} value="Draft" label="Release" sub="Demo snapshot" />
      </KpiRow>

      <Tabs
        tabs={tabs}
        value={tab}
        onChange={(t) => {
          setTab(t);
          if (t !== "Configuration") notice.show(`Viewing ${t} (demo snapshot).`);
        }}
      />

      <div className="grid min-h-0 flex-1 gap-[10px] lg:grid-cols-[1.85fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Virtual trainer configuration" className="lg:flex-[1.55]" bodyClassName="flex flex-col justify-between pt-[6px]">
            <div className="overflow-x-auto rounded-[8px] border border-[#e3e7ef]">
              <table className="w-full min-w-max border-collapse">
                <thead>
                  <tr>
                    {["Configuration", "Selected value", "Validation"].map((h) => (
                      <th key={h} className={sa51TableHead}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {configRows.map((r) => (
                    <tr key={r.config} className="last:[&>td]:border-b-0 hover:bg-[#f8faff]">
                      <td className={sa51TableCell}>{r.config}</td>
                      <td className={sa51TableCell}>{r.value}</td>
                      <td className={sa51TableCell}><Sa51Pill>{r.validation}</Sa51Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Opened synthetic Hindi/English lesson preview (demo).")}>
                Preview lesson
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Configuration submitted for human quality review (demo).")}>
                Submit configuration
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Scenario quality checks" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51Lifecycle
              steps={["Configure", "Practice", "Evaluate", "Human review", "Publish"]}
              meta={[
                ["Rubric", "Accuracy / empathy / safety"],
                ["Source", "Approved SOP only"],
              ]}
            />
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Virtual trainer · practice sandbox" className="lg:flex-[1.55]" bodyClassName="flex flex-col justify-between pt-[6px]">
            <div className="flex flex-col gap-[8px] text-[12px] leading-[1.4]">
              <div className="rounded-[8px] border border-[#dce4f2] bg-[#f4f7fd] px-[10px] py-[8px] text-[#1a1d36]">
                <b className="block text-[#0b0c36]">Sewa Sathi</b>
                Namaskar! How would you respond to a family requesting free cremation assistance?
              </div>
              <div className="ml-auto max-w-[90%] rounded-[8px] border border-[#cde5cb] bg-[#ebf8ea] px-[10px] py-[7px] text-[#1a1d36]">
                What if the required documents are missing?
              </div>
              <div className="rounded-[8px] border border-[#dce4f2] bg-[#f4f7fd] px-[10px] py-[8px] text-[#1a1d36]">
                <b className="block text-[#0b0c36]">Trainer</b>
                Explain the process respectfully and refer to the authorised officer. Do not promise dispatch before legal clearance.
              </div>
            </div>
            <div className="mt-[8px] flex flex-wrap items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Synthetic voice practice started with budget guardrails (demo).")}>
                Voice practice
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Synthetic text practice mode active (demo).")}>
                Text practice
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Running scenario evaluation against approved SOP rubric (demo).")}>
                Run scenario
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Trainer release & cost control" className="lg:flex-1" bodyClassName="flex flex-col justify-between pt-[6px]">
            <Sa51KvList
              rows={[
                ["Voice / text budget", "Separate limits"],
                ["Uncertain answer", "Human trainer"],
                ["Real family data", "Prohibited in sandbox"],
                ["Release", "Draft v1 · approval required"],
              ]}
            />
            <div className="mt-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Release checklist opened; approval & rollback required (demo).")}>
                Review release
              </Sa51Btn>
            </div>
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
