"use client";

/**
 * SA-005 — Organisation Setup.
 * Matched to the SA-005 reference design: 6 KPI tiles, 4 tabs and a 3×2 panel
 * grid (organisation information / structure / documents & compliance over
 * core configuration / service coverage / organisation policies). Demo data only.
 */

import { useState } from "react";
import {
  Bell,
  CircleCheck,
  Layers,
  Radio,
  Users,
} from "lucide-react";
import {
  KpiRow,
  KpiTile,
  KV,
  ModuleDropdown,
  PageHead,
  Panel,
  Pill,
  PrimaryButton,
  SuperAdminFrame,
  Tabs,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const tabs = ["Organisation profile", "Documents & compliance", "Policies", "Configuration"] as const;
type Tab = (typeof tabs)[number];

const info: readonly (readonly [string, string])[] = [
  ["Organisation", "Namo Gange Trust"],
  ["Project", "Moksha Sewa"],
  ["CRM", "Sewa Setu"],
  ["Type", "Public Charitable Trust"],
  ["Registration date", "30 Mar 2015"],
  ["Registration no. / PAN", "Verification required"],
  ["Head office", "Mohan Nagar, Ghaziabad"],
  ["Official contact / email", "Verify approved details"],
  ["Website", "mokshasewa.org"],
] as const;

const coreConfig: readonly (readonly [string, string])[] = [
  ["Financial year", "2026–27"],
  ["Time zone", "Asia/Kolkata"],
  ["Currency", "INR"],
  ["Language", "English / Hindi assistance"],
  ["ID sequence", "FY-wise"],
  ["Service model", "Free Sewa"],
  ["Cash donation", "Not permitted"],
] as const;

const structure = ["Namo Gange Trust", "Moksha Sewa", "Super Admin", "Admin", "User"] as const;

const deptPills = ["Operations", "Finance", "Support"] as const;

const coverage = [
  { city: "Ghaziabad", status: "Active", tone: "green" as const },
  { city: "Delhi", status: "Coming soon", tone: "amber" as const },
  { city: "Noida", status: "Coming soon", tone: "amber" as const },
];

const documents: readonly (readonly [string, string])[] = [
  ["Trust deed", "Upload / verify"],
  ["Registration certificate", "Upload / verify"],
  ["PAN", "Upload / verify"],
  ["12A / 80G", "Validity to verify"],
  ["Other statutory documents", "Upload / verify"],
] as const;

const policies: readonly (readonly [string, string])[] = [
  ["Approval matrix", "Configured by authority"],
  ["Retention policy", "Approved schedule"],
  ["Communication", "Official accounts only"],
  ["HRMS", "Integration • source of truth"],
  ["Website", "Independent CMS; sync only"],
] as const;

export default function SA005OrganisationSetup() {
  const notice = useNotice();
  const [tab, setTab] = useState<Tab>("Organisation profile");
  const [editing, setEditing] = useState(false);

  const showInfo = tab === "Organisation profile" || tab === "Configuration";
  const showStructure = tab === "Organisation profile";
  const showDocs = tab === "Organisation profile" || tab === "Documents & compliance";
  const showConfig = tab === "Organisation profile" || tab === "Configuration";
  const showCoverage = tab === "Organisation profile";
  const showPolicies = tab === "Organisation profile" || tab === "Policies";

  const profile = tab === "Organisation profile";
  const cols = profile ? "lg:grid-cols-3 lg:[grid-template-rows:repeat(2,minmax(0,1fr))]" : "lg:grid-cols-2 lg:[grid-template-rows:minmax(0,1fr)]";

  return (
    <SuperAdminFrame active="organisation-setup">
      <PageHead
        light
        icon={Radio}
        iconTone="blue"
        title="Organisation Setup"
        links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
      >
        <ModuleDropdown current="SA-005" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="01" label="Organisation" sub="Namo Gange Trust" />
        <KpiTile tone="green" icon={Bell} value="07" label="Departments" sub="Mapped" />
        <KpiTile tone="orange" icon={CircleCheck} value="186" label="CRM accounts" sub="Total" />
        <KpiTile tone="purple" icon={Users} value="01" label="Active city" sub="Ghaziabad" />
        <KpiTile tone="sky" icon={Layers} value="02" label="Upcoming cities" sub="Delhi / Noida" />
        <KpiTile tone="green" icon={Radio} value="Free" label="Service model" sub="No cash donations" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className={`grid gap-[10px] ${cols} lg:min-h-0 lg:flex-1`}>
        {showInfo && (
          <Panel title="Organisation information" bodyClassName="flex flex-col pt-[4px]">
            <div className="flex flex-col gap-[4px]">
              {info.map(([k, v]) =>
                editing && !v.includes("Verification") && !v.includes("Verify") ? (
                  <div key={k} className="flex items-center justify-between gap-[8px] border-b border-[#eef0f5] pb-[4px] text-[12.6px]">
                    <span className="font-medium text-[#1a1d36]">{k}</span>
                    <input
                      defaultValue={v}
                      aria-label={k}
                      className="h-[22px] w-[190px] rounded border border-[#cfd5e2] px-[6px] text-right text-[12.5px] font-medium outline-none focus:border-[#5b6fe0]"
                    />
                  </div>
                ) : (
                  <KV key={k} k={k} v={v} />
                ),
              )}
            </div>
            <div className="mt-auto pt-[8px]">
              <PrimaryButton
                onClick={() => {
                  if (editing) notice.show("Changes sent for verification — values stay pending until checked against source documents (demo).");
                  setEditing((e) => !e);
                }}
              >
                {editing ? "Save" : "Edit profile"}
              </PrimaryButton>
            </div>
          </Panel>
        )}

        {showStructure && (
          <Panel title="Organisation structure" bodyClassName="flex flex-col pt-[6px]">
            <div className="rounded-[10px] border border-[#dce6f7] bg-[#f4f8ff] px-[14px] py-[10px] text-center">
              {structure.map((s, i) => (
                <div key={s} className="flex flex-col items-center">
                  {i > 0 && <span className="text-[12px] leading-none text-[#1d4fe0]">↓</span>}
                  <span className="text-[12.8px] font-semibold leading-[1.35] text-[#0b0c36]">{s}</span>
                </div>
              ))}
            </div>
            <p className="mt-[10px] text-[12px] font-medium leading-snug text-[#3b4256]">
              Departments and reporting assignments mapped separately from HRMS.
            </p>
            <div className="mt-[8px] flex flex-wrap gap-[6px]">
              {deptPills.map((d) => (
                <Pill key={d} tone="gray" className="h-[22px] px-[10px] text-[11.5px]">
                  {d}
                </Pill>
              ))}
            </div>
          </Panel>
        )}

        {showDocs && (
          <Panel title="Documents & compliance" bodyClassName="flex flex-col pt-[4px]">
            <div className="flex flex-col gap-[5px]">
              {documents.map(([doc, status]) => (
                <KV key={doc} k={doc} v={status} />
              ))}
            </div>
            <div className="mt-auto pt-[8px]">
              <PrimaryButton onClick={() => notice.show("Document repository opened (demo).")}>
                Document repository
              </PrimaryButton>
            </div>
          </Panel>
        )}

        {showConfig && (
          <Panel title="Core configuration" bodyClassName="flex flex-col pt-[4px]">
            <div className="flex flex-col gap-[5px]">
              {coreConfig.map(([k, v]) => (
                <KV key={k} k={k} v={v} />
              ))}
            </div>
          </Panel>
        )}

        {showCoverage && (
          <Panel title="Service coverage" bodyClassName="flex flex-col pt-[4px]">
            <div className="flex flex-col gap-[5px]">
              {coverage.map((c) => (
                <div key={c.city} className="flex items-center justify-between gap-[8px] border-b border-[#eef0f5] pb-[5px] text-[13px] last:border-b-0 last:pb-0">
                  <span className="font-medium text-[#1a1d36]">{c.city}</span>
                  <Pill tone={c.tone} className="h-[19px] text-[11px]">
                    {c.status}
                  </Pill>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-[8px]">
              <PrimaryButton onClick={() => notice.show("Manage centres opened (demo).")}>
                Manage centres
              </PrimaryButton>
            </div>
          </Panel>
        )}

        {showPolicies && (
          <Panel title="Organisation policies" bodyClassName="flex flex-col pt-[4px]">
            <div className="flex flex-col gap-[5px]">
              {policies.map(([k, v]) => (
                <KV key={k} k={k} v={v} />
              ))}
            </div>
            <div className="mt-auto pt-[8px]">
              <PrimaryButton onClick={() => notice.show("Review policies opened (demo).")}>
                Review policies
              </PrimaryButton>
            </div>
          </Panel>
        )}
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
