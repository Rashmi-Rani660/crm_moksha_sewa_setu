"use client";

import { useRouter } from "next/navigation";

/**
 * SA-006 — City, Zone & Service Centre Management.
 * Matched to the SA-006 reference design: 6 KPI tiles, 6 tabs, top row
 * (city list + geographical hierarchy) and bottom row (activation readiness,
 * routing & website sync, centre controls). Only Ghaziabad is active; Delhi
 * and Noida are coming soon. Demo data only.
 */

import { useState } from "react";
import { authorizedRequest } from "@/lib/api/authorized";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { useCrmAccess } from "@/lib/api/useCrmAccess";
import { count, records, text, EMPTY, choose, reason, type CrmRecord } from "@/lib/crm/data";
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
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Tabs,
  Thead,
  td,
  th,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const tabs = ["City management", "State management", "Zones", "Service centres", "Coverage & PIN codes", "Expansion"] as const;
type Tab = (typeof tabs)[number];

type City = { code: string; name: string; state: string; zones: string; centres: string; pins: string; status: string };

const readiness: readonly { label: string; value: string; pill?: boolean }[] = [
  { label: "Approved services", value: "Required", pill: true },
  { label: "Assigned admin / team", value: "Required", pill: true },
  { label: "Vehicles / inventory", value: "Required", pill: true },
  { label: "Management approval", value: "Required", pill: true },
  { label: "PIN validation", value: "Unique and valid" },
];

const routing: readonly (readonly [string, string])[] = [
  ["Coverage publication", "Approved changes only"],
  ["Request routing", "Auto / Manual / Approval"],
  ["Outside coverage", "Separate review queue"],
  ["Last sync", EMPTY],
  ["Change history", "Audit required"],
] as const;

const controls: readonly (readonly [string, string])[] = [
  ["Working hours", "Configurable"],
  ["Staff & volunteers", "Area mapping"],
  ["Vehicle allocation", "Centre-wise"],
  ["Case transfers", "Authorised only"],
  ["Status", "Active / Coming soon / Planned / Suspended / Inactive"],
] as const;

export default function SA006CityZone() {
  const router = useRouter();
  const notice = useNotice();
  const { can } = useCrmAccess();
  const tree = useCrmQuery<CrmRecord[]>(can("geography.view") ? "/geography/tree" : null);
  const rawCities = useCrmQuery<CrmRecord[]>(can("geography.view") ? "/geography/cities" : null);
  const centres = useCrmQuery<CrmRecord[]>(can("geography.view") ? "/geography/centres?limit=100" : null);
  const pins = useCrmQuery<CrmRecord[]>(can("geography.view") ? "/geography/pincodes?limit=100" : null);
  const mutation = useCrmMutation(notice.show);
  const cities: City[] = records(tree.data).flatMap(state => records(state.cities).map(city => ({ code: text(city.code), name: text(city.name), state: text(state.name), zones: count(records(city.zones).length), centres: count(records(city.centres).length), pins: count(records(city.centres).reduce((n,c) => n + Number(c.pincodes || 0),0)),status: humanize(text(city.status,"")) })));
  const hierarchyCities = cities.map(city => ({ name: city.name,status: city.status }));
  async function createCity() {
    if (!can("geography.create") || mutation.busy) return;
    const states = await authorizedRequest<CrmRecord[]>("/geography/states");
    const state = choose(states.data,"Choose state");
    const code = window.prompt("City code:")?.trim(); const name = window.prompt("City name:")?.trim();
    if (state && code && name) await mutation.run("/geography/cities", { body: { stateId: state.id,code,name } }, "City created.");
  }
  async function editCoverage() {
    const centre = choose(records(centres.data),"Choose centre"); const pincode = window.prompt("PIN code (6 digits):")?.trim();
    if (!centre || !pincode) return;
    await mutation.run("/geography/pincodes", { body: { centreId: centre.id,pincodes: [{ pincode }] } }, "Coverage saved.");
  }
  async function cityAction(activate: boolean) {
    const city = choose(records(rawCities.data),"Choose city"); const note = reason(); if (!city || !note) return;
    await mutation.run('/geography/cities/' + city.id + (activate ? '/activate' : '/status'), { body: { version: city.version,reason: note,...(activate ? {} : { status: "INACTIVE" }) } }, "Saved.");
  }
  async function manage(kind: "zones" | "centres") {
    const city = choose(records(rawCities.data),"Choose city"); if (!city) return;
    const code = window.prompt("Code:")?.trim(); const name = window.prompt("Name:")?.trim();
    if (code && name) await mutation.run('/geography/' + kind, { body: { cityId: city.id,code,name } }, "Saved.");
  }
  const [tab, setTab] = useState<Tab>("City management");

  const showCity = tab === "City management" || tab === "State management";
  const showHierarchy = tab === "City management" || tab === "State management" || tab === "Zones" || tab === "Expansion";
  const showReadiness = tab === "City management" || tab === "Service centres";
  const showRouting = tab === "City management" || tab === "Coverage & PIN codes";
  const showControls = tab === "City management" || tab === "Service centres" || tab === "Zones";

  const topRow = showCity || showHierarchy;
  const bottomRow = showReadiness || showRouting || showControls;
  const topCount = [showCity, showHierarchy].filter(Boolean).length;
  const bottomCount = [showReadiness, showRouting, showControls].filter(Boolean).length;

  return (
    <SuperAdminFrame active="city-zone-centres">
      <PageHead
        light
        icon={Radio}
        iconTone="blue"
        title="City, Zone & Service Centre Management"
        links={["Super Admin", "FY 2026–27", "Ghaziabad"]}
      >
        <ModuleDropdown current="SA-006" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value={tree.data ? count(tree.data.length) : EMPTY} label="States / UTs" sub="Configured" />
        <KpiTile tone="green" icon={Bell} value={rawCities.data ? count(rawCities.data.length) : EMPTY} label="Cities" sub="Registered" />
        <KpiTile tone="orange" icon={CircleCheck} value={rawCities.data ? count(rawCities.data.filter(c => c.status === "ACTIVE").length) : EMPTY} label="Active cities" sub="Ghaziabad" />
        <KpiTile tone="purple" icon={Users} value={rawCities.data ? count(rawCities.data.filter(c => c.status === "COMING_SOON").length) : EMPTY} label="Upcoming" sub="Delhi / Noida" />
        <KpiTile tone="sky" icon={Layers} value={centres.data ? count(centres.data.filter(c => c.status === "ACTIVE").length) : EMPTY} label="Active centres" sub="Demo" />
        <KpiTile tone="green" icon={Radio} value={count(pins.meta?.total)} label="Mapped PINs" sub="Demo • 12 active" />
      </KpiRow>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
        {/* Top row — city list + geographical hierarchy */}
        {topRow && (
          <div
            className={`grid gap-[10px] lg:min-h-0 lg:flex-[300_1_0] ${
              topCount === 2 ? "lg:grid-cols-[54fr_46fr]" : "lg:grid-cols-1"
            } lg:[grid-template-rows:minmax(0,1fr)]`}
          >
            {showCity && (
              <Panel title="City list" bodyClassName="flex flex-col pt-[6px]">
                <TableWrap>
                  <Thead>
                    {["Code", "City", "State / UT", "Zones", "Centres", "PINs", "Status"].map((h) => (
<th key={h} className={th}>{h}</th>
                    ))}
                  </Thead>
                  <tbody>
                    {cities.map((c) => (
                      <tr key={c.code}>
                        <td className={`${td} px-[6px] py-[7px] font-semibold`}>{c.code}</td>
                        <td className={`${td} px-[6px] py-[7px] font-bold`}>{c.name}</td>
                        <td className={`${td} px-[6px] py-[7px]`}>{c.state}</td>
                        <td className={`${td} px-[6px] py-[7px]`}>{c.zones}</td>
                        <td className={`${td} px-[6px] py-[7px]`}>{c.centres}</td>
                        <td className={`${td} px-[6px] py-[7px] font-semibold`}>{c.pins}</td>
                        <td className={`${td} px-[6px] py-[7px]`}>
                          <StatusPill className="h-[19px] min-w-[84px] text-[15px]">{c.status}</StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
                  <PrimaryButton disabled={mutation.busy || !can("geography.create")} onClick={createCity}>
                    Add city
                  </PrimaryButton>
                  <PrimaryButton outline disabled={mutation.busy || !can("geography.edit")} onClick={editCoverage}>
                    Edit coverage
                  </PrimaryButton>
                  <PrimaryButton outline disabled={mutation.busy || !can("geography.edit")} onClick={() => cityAction(false)}>
                    Deactivate
                  </PrimaryButton>
                </div>
              </Panel>
            )}

            {showHierarchy && (
              <Panel title="Geographical hierarchy" bodyClassName="flex flex-col pt-[8px]">
                <div className="rounded-[10px] border border-[#dce6f7] bg-[#f4f8ff] px-[14px] py-[14px] text-center">
                  <p className="text-[15px] font-semibold text-[#0b0c36]">India → State / UT → City</p>
                  <p className="my-[4px] text-[15px] leading-none text-[#1d4fe0]">↓</p>
                  <p className="text-[15px] font-semibold text-[#0b0c36]">Zone → Service centre → Locality / PIN</p>
                </div>
                <div className="mt-[18px] grid grid-cols-3 gap-[12px]">
                  {hierarchyCities.map((c) => (
                    <div key={c.name} className="flex flex-col gap-[2px]">
                      <span className="text-[15px] font-semibold text-[#0b0c36]">{c.name}</span>
                      <span className="text-[14px] font-medium text-[#3b4256]">{c.status}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>
        )}

        {/* Bottom row — readiness, routing, controls */}
        {bottomRow && (
          <div
            className={`grid gap-[10px] lg:min-h-0 lg:flex-[275_1_0] ${
              bottomCount === 3 ? "lg:grid-cols-3" : bottomCount === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1"
            } lg:[grid-template-rows:minmax(0,1fr)]`}
          >
            {showReadiness && (
              <Panel title="Activation readiness" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col">
                  {readiness.map((r) => (
                    <KV
                      key={r.label}
                      k={r.label}
                      v={r.pill ? <Pill tone="green" className="h-[19px] text-[15px]">{r.value}</Pill> : r.value}
                      className="py-[5px]"
                    />
                  ))}
                </div>
                <div className="mt-auto pt-[8px]">
                  <PrimaryButton disabled={mutation.busy || !can("geography.edit")} onClick={() => cityAction(true)}>
                    Review activation
                  </PrimaryButton>
                </div>
              </Panel>
            )}

            {showRouting && (
              <Panel title="Routing & website sync" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col">
                  {routing.map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="py-[5px]" />
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
                  <PrimaryButton disabled onClick={() => notice.show(EMPTY)}>
                    Sync preview
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => router.push("/dashboard/super-admin/audit-logs")}>
                    View history
                  </PrimaryButton>
                </div>
              </Panel>
            )}

            {showControls && (
              <Panel title="Centre controls" bodyClassName="flex flex-col pt-[4px]">
                <div className="flex flex-col">
                  {controls.map(([k, v]) => (
                    <KV key={k} k={k} v={v} className="py-[5px]" />
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
                  <PrimaryButton disabled={mutation.busy || !can("geography.edit")} onClick={() => manage("zones")}>
                    Manage zones
                  </PrimaryButton>
                  <PrimaryButton outline disabled={mutation.busy || !can("geography.edit")} onClick={() => manage("centres")}>
                    Manage centres
                  </PrimaryButton>
                </div>
              </Panel>
            )}
          </div>
        )}
      </div>

      {notice.node}
    </SuperAdminFrame>
  );
}
