"use client";

/**
 * SA-006 — City, Zone & Service Centre Management.
 * Matched to the SA-006 reference design: 6 KPI tiles, 6 tabs, top row
 * (city list + geographical hierarchy) and bottom row (activation readiness,
 * routing & website sync, centre controls). Only Ghaziabad is active; Delhi
 * and Noida are coming soon. Demo data only.
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
  CentreDropdown,
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

const cities: City[] = [
  { code: "CT-001", name: "Ghaziabad", state: "Uttar Pradesh", zones: "3", centres: "1", pins: "12", status: "Active" },
  { code: "CT-002", name: "Noida", state: "Uttar Pradesh", zones: "2", centres: "0", pins: "8", status: "Coming soon" },
  { code: "CT-003", name: "Delhi", state: "Delhi NCT", zones: "2", centres: "0", pins: "8", status: "Coming soon" },
];

const hierarchyCities = [
  { name: "Ghaziabad", status: "Active" },
  { name: "Delhi", status: "Coming soon" },
  { name: "Noida", status: "Coming soon" },
] as const;

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
  ["Last sync", "Demo • 10:20"],
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
  const notice = useNotice();
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
        <CentreDropdown className="w-[165px]" />
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="blue" icon={Radio} value="02" label="States / UTs" sub="Configured" />
        <KpiTile tone="green" icon={Bell} value="03" label="Cities" sub="Registered" />
        <KpiTile tone="orange" icon={CircleCheck} value="01" label="Active cities" sub="Ghaziabad" />
        <KpiTile tone="purple" icon={Users} value="02" label="Upcoming" sub="Delhi / Noida" />
        <KpiTile tone="sky" icon={Layers} value="01" label="Active centres" sub="Demo" />
        <KpiTile tone="green" icon={Radio} value="28" label="Mapped PINs" sub="Demo • 12 active" />
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
                    {["Code", "City", "State / UT", "Zones", "Centres", "PINs", "Status"].map((h, i) => (
                      <th key={h} className={`${th} px-[6px] py-[6px] text-[12.5px] ${i >= 3 ? "text-center" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </Thead>
                  <tbody>
                    {cities.map((c) => (
                      <tr key={c.code}>
                        <td className={`${td} px-[6px] py-[7px] font-semibold`}>{c.code}</td>
                        <td className={`${td} px-[6px] py-[7px] font-bold`}>{c.name}</td>
                        <td className={`${td} px-[6px] py-[7px]`}>{c.state}</td>
                        <td className={`${td} px-[6px] py-[7px] text-center`}>{c.zones}</td>
                        <td className={`${td} px-[6px] py-[7px] text-center`}>{c.centres}</td>
                        <td className={`${td} px-[6px] py-[7px] text-center font-semibold`}>{c.pins}</td>
                        <td className={`${td} px-[6px] py-[7px] text-center`}>
                          <StatusPill className="h-[19px] min-w-[84px] text-[11px]">{c.status}</StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                <div className="mt-auto flex flex-wrap gap-[8px] pt-[8px]">
                  <PrimaryButton onClick={() => notice.show("Add city: readiness checks required (demo).")}>
                    Add city
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => notice.show("Edit coverage: PIN validation runs first (demo).")}>
                    Edit coverage
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => notice.show("Deactivate: archive only — no delete (demo).")}>
                    Deactivate
                  </PrimaryButton>
                </div>
              </Panel>
            )}

            {showHierarchy && (
              <Panel title="Geographical hierarchy" bodyClassName="flex flex-col pt-[8px]">
                <div className="rounded-[10px] border border-[#dce6f7] bg-[#f4f8ff] px-[14px] py-[14px] text-center">
                  <p className="text-[13px] font-semibold text-[#0b0c36]">India → State / UT → City</p>
                  <p className="my-[4px] text-[13px] leading-none text-[#1d4fe0]">↓</p>
                  <p className="text-[13px] font-semibold text-[#0b0c36]">Zone → Service centre → Locality / PIN</p>
                </div>
                <div className="mt-[18px] grid grid-cols-3 gap-[12px]">
                  {hierarchyCities.map((c) => (
                    <div key={c.name} className="flex flex-col gap-[2px]">
                      <span className="text-[13px] font-semibold text-[#0b0c36]">{c.name}</span>
                      <span className="text-[12px] font-medium text-[#3b4256]">{c.status}</span>
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
                      v={r.pill ? <Pill tone="green" className="h-[19px] text-[11px]">{r.value}</Pill> : r.value}
                      className="py-[5px]"
                    />
                  ))}
                </div>
                <div className="mt-auto pt-[8px]">
                  <PrimaryButton onClick={() => notice.show("Review activation: all checks must pass (demo).")}>
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
                  <PrimaryButton onClick={() => notice.show("Sync preview: website coverage diff (demo).")}>
                    Sync preview
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => notice.show("Change history opened (demo).")}>
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
                  <PrimaryButton onClick={() => notice.show("Manage zones opened (demo).")}>
                    Manage zones
                  </PrimaryButton>
                  <PrimaryButton outline onClick={() => notice.show("Manage centres opened (demo).")}>
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
