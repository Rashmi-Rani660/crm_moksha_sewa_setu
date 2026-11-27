"use client";

/** SA-051 — AI Cost & Usage Control. Demo data. */

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

const tabs = ["Usage overview", "Channel costs", "Limits", "Alerts", "History"] as const;
type Tab = (typeof tabs)[number];

type LedgerRow = { channel: string; usage: string; cost: string; limit: string; status: string };
const ledgerRows: LedgerRow[] = [
  { channel: "Inbound voice", usage: "520 min", cost: "₹2,800", limit: "₹5,000", status: "Within limit" },
  { channel: "Outbound voice", usage: "240 min", cost: "₹1,400", limit: "₹2,500", status: "Within limit" },
  { channel: "Chatbot", usage: "1,620 turns", cost: "₹1,800", limit: "₹3,000", status: "Within limit" },
  { channel: "Email / AI assist", usage: "420 turns", cost: "₹500", limit: "₹1,000", status: "Within limit" },
  { channel: "SMS / WhatsApp", usage: "310 events", cost: "₹950", limit: "₹2,000", status: "Within limit" },
  { channel: "API / storage", usage: "Monthly", cost: "₹1,000", limit: "₹1,500", status: "Within limit" },
];

const dailyTrend = [
  { day: "20 Nov", val: 240 },
  { day: "21 Nov", val: 310 },
  { day: "22 Nov", val: 290 },
  { day: "23 Nov", val: 360 },
  { day: "24 Nov", val: 340 },
  { day: "25 Nov", val: 390 },
];

export default function SA051AiCostUsage() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Usage overview");
  const [q, setQ] = useState("");
  const [channelFilter, setChannelFilter] = useState<"All" | "Voice" | "Text">("All");

  const filteredRows = ledgerRows.filter((r) => {
    const matchesQ = !q.trim() || [r.channel, r.usage, r.cost, r.limit, r.status].some((f) => f.toLowerCase().includes(q.trim().toLowerCase()));
    const matchesChannel =
      channelFilter === "All" ||
      (channelFilter === "Voice" ? r.channel.toLowerCase().includes("voice") : !r.channel.toLowerCase().includes("voice"));
    return matchesQ && matchesChannel;
  });

  const cycleFilter = () => {
    const next = channelFilter === "All" ? "Voice" : channelFilter === "Voice" ? "Text" : "All";
    setChannelFilter(next);
    notice.show(`Filter: ${next} channels (demo).`);
  };

  return (
    <SuperAdminFrame active="ai-automation">
      <Sa51Header code="SA-051" title="AI Cost & Usage Control" />

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="₹15,000" label="Monthly budget" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Bell} value="₹8,450" label="Consumed" sub="Demo snapshot" />
        <KpiTile tone="orange" icon={CircleCheck} value="₹6,550" label="Remaining" sub="Demo snapshot" />
        <KpiTile tone="purple" icon={Users} value="₹4,200" label="Voice cost" sub="Demo snapshot" />
        <KpiTile tone="sky" icon={Layers} value="₹2,300" label="Text AI cost" sub="Demo snapshot" />
        <KpiTile tone="green" icon={Radio} value="56.3%" label="Budget used" sub="Demo snapshot" />
      </KpiRow>

      <Sa51Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="grid min-h-0 flex-1 gap-[10px] lg:grid-cols-[1.85fr_1fr]">
        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Channel-wise usage ledger" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <div>
              <Sa51SearchRow
                value={q}
                onChange={setQ}
                onFilter={cycleFilter}
                onExport={() => notice.show("Exported AI cost & usage ledger CSV (demo).")}
              />
              <div className="overflow-x-auto rounded-[8px] border border-[#e3e7ef]">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr>
                      {["Channel", "Usage", "Cost", "Limit", "Status"].map((h) => (
                        <th key={h} className={sa51TableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((r) => (
                      <tr key={r.channel} className="last:[&>td]:border-b-0 hover:bg-[#f8faff]">
                        <td className={sa51TableCell}>{r.channel}</td>
                        <td className={sa51TableCell}>{r.usage}</td>
                        <td className={sa51TableCell}>{r.cost}</td>
                        <td className={sa51TableCell}>{r.limit}</td>
                        <td className={sa51TableCell}><Sa51Pill>{r.status}</Sa51Pill></td>
                      </tr>
                    ))}
                    {!filteredRows.length && (
                      <tr>
                        <td colSpan={5} className="py-5 text-center text-[12.5px] font-medium text-[#5b6280]">No channels match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-[8px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Channel limits reviewed; emergency human helpline remains unrestricted (demo).")}>
                Review limits
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("Opened monthly AI usage & provider reconciliation report (demo).")}>
                Open usage report
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Daily AI cost trend · demo (₹)" className="lg:flex-1" bodyClassName="flex flex-col justify-between pt-[6px]">
            <div className="grid grid-cols-6 items-end gap-[12px] pt-[6px]">
              {dailyTrend.map((d) => {
                const height = Math.round((d.val / 400) * 64);
                return (
                  <div key={d.day} className="flex flex-col items-center">
                    <span className="mb-[3px] text-[11px] font-semibold text-[#1a1d36]">{d.val}</span>
                    <div
                      style={{ height }}
                      className="w-full max-w-[82px] rounded-t-[4px] bg-[linear-gradient(180deg,#5b9ae8_0%,#1f6fd6_100%)]"
                    />
                    <span className="mt-[4px] text-[11px] font-medium text-[#4a5070]">{d.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-[6px]">
              <Sa51ProgressBar label="Monthly budget consumed" pct={56.3} />
            </div>
          </Panel>
        </div>

        <div className="flex min-h-0 flex-col gap-[10px]">
          <Panel title="Budget & spending controls" className="lg:flex-[1.55]" bodyClassName="flex flex-col gap-[10px] pt-[6px]">
            <Sa51KvList
              rows={[
                ["Monthly budget", "₹15,000"],
                ["Consumed / remaining", "₹8,450 / ₹6,550"],
                ["Voice / text caps", "Separate"],
                ["Alert thresholds", "50 / 75 / 90 / 100%"],
                ["Provider reconciliation", "Review invoice"],
                ["Emergency fallback", "Human helpline"],
              ]}
            />
            <div className="mt-[10px] flex items-center gap-[8px]">
              <Sa51Btn primary onClick={() => notice.show("Budget & cap review modal opened (demo).")}>
                Review limits
              </Sa51Btn>
              <Sa51Btn onClick={() => notice.show("0 billing exceptions pending reconciliation (demo).")}>
                Billing exceptions
              </Sa51Btn>
            </div>
          </Panel>

          <Panel title="Forecast & safeguards" className="lg:flex-1" bodyClassName="pt-[6px]">
            <Sa51KvList
              rows={[
                ["Month-end forecast", "₹9,750 · illustrative"],
                ["Cost basis", "Provider usage ledger"],
                ["Failed-call charges", "Reconcile"],
                ["Override", "Authorised + audited"],
              ]}
            />
          </Panel>
        </div>
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
