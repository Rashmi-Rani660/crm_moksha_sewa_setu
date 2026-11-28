"use client";

import { useRouter } from "next/navigation";

/**
 * SA-005 — Organisation Setup.
 * Matched to the SA-005 reference design: 6 KPI tiles, 4 tabs and a 3×2 panel
 * grid (organisation information / structure / documents & compliance over
 * core configuration / service coverage / organisation policies). Demo data only.
 */

import { useState } from "react";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { useCrmAccess } from "@/lib/api/useCrmAccess";
import { at, count, records, text, EMPTY, choose, reason, type CrmRecord } from "@/lib/crm/data";
import { humanize } from "@/lib/format";
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
  ["Organisation", EMPTY],
  ["Project", EMPTY],
  ["CRM", EMPTY],
  ["Type", EMPTY],
  ["Registration date", EMPTY],
  ["Registration no. / PAN", EMPTY],
  ["Head office", EMPTY],
  ["Official contact / email", EMPTY],
  ["Website", EMPTY],
] as const;

const coreConfig: readonly (readonly [string, string])[] = [
  ["Financial year", EMPTY],
  ["Time zone", EMPTY],
  ["Currency", EMPTY],
  ["Language", EMPTY],
  ["ID sequence", EMPTY],
  ["Service model", EMPTY],
  ["Cash donation", EMPTY],
] as const;







const documents: readonly (readonly [string, string])[] = [
  ["Trust deed", EMPTY],
  ["Registration certificate", EMPTY],
  ["PAN", EMPTY],
  ["12A / 80G", EMPTY],
  ["Other statutory documents", EMPTY],
] as const;

const policies: readonly (readonly [string, string])[] = [
  ["Approval matrix", EMPTY],
  ["Retention policy", EMPTY],
  ["Communication", EMPTY],
  ["HRMS", EMPTY],
  ["Website", EMPTY],
] as const;

export default function SA005OrganisationSetup() {
  const router = useRouter();
  const notice = useNotice();
  const { can } = useCrmAccess();
  const organisation = useCrmQuery<CrmRecord>(can("organisation.view") ? "/organisation" : null);
  const departments = useCrmQuery<CrmRecord[]>(can("departments.view") ? "/departments?limit=100" : null);
  const users = useCrmQuery<CrmRecord>(can("users.view") ? "/users/summary" : null);
  const cities = useCrmQuery<CrmRecord[]>(can("geography.view") ? "/geography/cities" : null);
  const mutation = useCrmMutation(notice.show);
  const org = organisation.data;
  const [draft, setDraft] = useState<Record<string,string>>({});
  const infoFields: Record<string,string> = { Organisation: "legalName", Project: "displayName", "Registration no. / PAN": "registrationNumber", "Head office": "address.line1", "Official contact / email": "contact.email", Website: "contact.website" };
  const liveInfo = info.map(([label]) => [label, draft[label] ?? text(at(org,infoFields[label] ?? ""))] as const);
  const structure = [text(org?.legalName),text(org?.displayName),"Super Admin","Admin","User"];
  const deptPills = records(departments.data).map(row => text(row.name));
  const coverage = records(cities.data).map(row => ({ city: text(row.name),status: humanize(text(row.status,"")),tone: row.status === "ACTIVE" ? "green" as const : "amber" as const }));
  const certificates = records(org?.certificates);
  async function save() {
    if (!editing) { setEditing(true); return; }
    if (!org) return;
    const body: CrmRecord = { version: org.version };
    for (const [label,value] of Object.entries(draft)) {
      const path = infoFields[label]; if (!path) continue;
      const [head,child] = path.split(".");
      if (child) body[head] = { ...(body[head] as CrmRecord ?? {}), [child]: value }; else body[head] = value;
    }
    await mutation.run("/organisation", { method: "PATCH",body }, "Saved.");
    setEditing(false);
  }
  const [tab, setTab] = useState<Tab>("Organisation profile");
  const [editing, setEditing] = useState(false);

  async function repository() {
    const choices = [{ code: "view",name: "View certificates" },...(can("organisation.edit") ? [{ code: "add",name: "Add certificate" },{ code: "edit",name: "Edit certificate" },{ code: "archive",name: "Withdraw certificate" }] : []),...(can("organisation.approve") ? [{ code: "verify",name: "Verify certificate" }] : [])];
    const action = choose(choices,"Certificate action"); if (!action) return;
    if (action.code === "view") { notice.show(certificates.map(c => text(c.type) + ': ' + text(c.number) + ' / ' + text(c.verification)).join("\n") || EMPTY); return; }
    const certificate = action.code === "add" ? undefined : choose(certificates,"Choose certificate","number");
    if (action.code !== "add" && !certificate) return;
    if (action.code === "archive") {
      const note = reason(); if (note) await mutation.run('/organisation/certificates/' + certificate?.id + '/archive', { body: { reason: note } }, "Certificate withdrawn."); return;
    }
    if (action.code === "verify") {
      const outcome = window.prompt("Outcome: VERIFIED or REJECTED")?.trim(); const remarks = reason("Verification remarks (at least 5 characters):");
      if (remarks && (outcome === "VERIFIED" || outcome === "REJECTED")) await mutation.run('/organisation/certificates/' + certificate?.id + '/verification', { body: { outcome,remarks } }, "Verification recorded."); return;
    }
    const type = window.prompt("Type: REGISTRATION, PAN, 12A, 80G, CSR_1, FCRA, DARPAN, OTHER",text(certificate?.type,""))?.trim();
    const certificateNumber = window.prompt("Certificate number:",text(certificate?.number,""))?.trim();
    const documentUrl = window.prompt("Document URL (optional):",text(certificate?.documentUrl,""))?.trim();
    if (!type || !certificateNumber) return;
    await mutation.run('/organisation/certificates' + (certificate ? '/' + certificate.id : ''), { method: certificate ? "PUT" : "POST",body: { type,number: certificateNumber,...(documentUrl ? { documentUrl } : {}) } }, "Certificate saved.");
  }

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
        <KpiTile tone="blue" icon={Radio} value={org ? "01" : EMPTY} label="Organisation" sub="Namo Gange Trust" />
        <KpiTile tone="green" icon={Bell} value={count(departments.meta?.total)} label="Departments" sub="Mapped" />
        <KpiTile tone="orange" icon={CircleCheck} value={count(users.data?.total)} label="CRM accounts" sub="Total" />
        <KpiTile tone="purple" icon={Users} value={cities.data ? count(cities.data.filter(row => row.status === "ACTIVE").length) : EMPTY} label="Active city" sub="Ghaziabad" />
        <KpiTile tone="sky" icon={Layers} value={cities.data ? count(cities.data.filter(row => row.status === "COMING_SOON").length) : EMPTY} label="Upcoming cities" sub="Delhi / Noida" />
        <KpiTile tone="green" icon={Radio} value="Free" label="Service model" sub="No cash donations" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className={`grid gap-[10px] ${cols} lg:min-h-0 lg:flex-1`}>
        {showInfo && (
          <Panel title="Organisation information" bodyClassName="flex flex-col pt-[4px]">
            <div className="flex flex-col gap-[4px]">
              {liveInfo.map(([k, v]) =>
                editing && !v.includes("Verification") && !v.includes("Verify") ? (
                  <div key={k} className="flex items-center justify-between gap-[8px] border-b border-[#eef0f5] pb-[4px] text-[14.6px]">
                    <span className="font-medium text-[#1a1d36]">{k}</span>
                    <input
                      value={v}
                      onChange={(e) => setDraft(prev => ({ ...prev,[k]: e.target.value }))}
                      readOnly={!infoFields[k]}
                      aria-label={k}
                      className="h-[22px] w-[190px] rounded border border-[#cfd5e2] px-[6px] text-right text-[14.5px] font-medium outline-none focus:border-[#5b6fe0]"
                    />
                  </div>
                ) : (
                  <KV key={k} k={k} v={v} />
                ),
              )}
            </div>
            <div className="mt-auto pt-[8px]">
              <PrimaryButton
                disabled={!can("organisation.edit") || mutation.busy} onClick={save}
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
                <div key={`${i}-${s}`} className="flex flex-col items-center">
                  {i > 0 && <span className="text-[14px] leading-none text-[#1d4fe0]">↓</span>}
                  <span className="text-[14.8px] font-semibold leading-[1.35] text-[#0b0c36]">{s}</span>
                </div>
              ))}
            </div>
            <p className="mt-[10px] text-[14px] font-medium leading-snug text-[#3b4256]">
              Departments and reporting assignments mapped separately from HRMS.
            </p>
            <div className="mt-[8px] flex flex-wrap gap-[6px]">
              {deptPills.map((d) => (
                <Pill key={d} tone="gray" className="h-[22px] px-[10px] text-[15.5px]">
                  {d}
                </Pill>
              ))}
            </div>
          </Panel>
        )}

        {showDocs && (
          <Panel title="Documents & compliance" bodyClassName="flex flex-col pt-[4px]">
            <div className="flex flex-col gap-[5px]">
              {documents.map(([doc]) => (
                <KV key={doc} k={doc} v={humanize(text(certificates.find(c => humanize(text(c.type,"")) === doc)?.verification,""))} />
              ))}
            </div>
            <div className="mt-auto pt-[8px]">
              <PrimaryButton disabled={mutation.busy} onClick={repository}>
                Document repository
              </PrimaryButton>
            </div>
          </Panel>
        )}

        {showConfig && (
          <Panel title="Core configuration" bodyClassName="flex flex-col pt-[4px]">
            <div className="flex flex-col gap-[5px]">
              {coreConfig.map(([k, v]) => (
                <KV key={k} k={k} v={k === "Time zone" ? text(at(org,"policy.timezone")) : k === "Currency" ? text(at(org,"policy.currency")) : v} />
              ))}
            </div>
          </Panel>
        )}

        {showCoverage && (
          <Panel title="Service coverage" bodyClassName="flex flex-col pt-[4px]">
            <div className="flex flex-col gap-[5px]">
              {coverage.map((c) => (
                <div key={c.city} className="flex items-center justify-between gap-[8px] border-b border-[#eef0f5] pb-[5px] text-[15px] last:border-b-0 last:pb-0">
                  <span className="font-medium text-[#1a1d36]">{c.city}</span>
                  <Pill tone={c.tone} className="h-[19px] text-[15px]">
                    {c.status}
                  </Pill>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-[8px]">
              <PrimaryButton onClick={() => router.push("/dashboard/super-admin/city-zone-centres")}>
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
              <PrimaryButton disabled onClick={() => notice.show(EMPTY)}>
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
