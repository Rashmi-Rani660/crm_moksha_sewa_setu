"use client";

/**
 * SA-005 — Organisation Setup.
 * Notes (design brief 05): registration number, PAN, contact details and
 * certificates need source verification — never fabricate or assume validity;
 * FY identifiers, INR and IST; no cash donations; the existing HRMS and website
 * CMS stay separate systems.
 */

import { Fragment, useState } from "react";
import {
  Building2,
  FileText,
  FolderOpen,
  HandHeart,
  IndianRupee,
  MapPin,
  Network,
  Pencil,
  Plus,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import {
  KpiRow,
  KpiTile,
  PageHead,
  Panel,
  Pill,
  PrimaryButton,
  StatusPill,
  SuperAdminFrame,
  TableWrap,
  Thead,
  ViewLink,
  td,
  th,
  useNotice,
} from "@/components/dashboards/super-admin/kit";

const info: [string, string, boolean?][] = [
  ["Organisation Name", "Namo Gange Trust", true],
  ["Initiative / Project", "Moksha Sewa", true],
  ["Type", "Public Charitable Trust", true],
  ["Registration No.", "Pending verification"],
  ["Registered Date", "30 Mar 2015", true],
  ["PAN", "Pending verification"],
  ["Head Office", "Mohan Nagar, Ghaziabad"],
  ["Contact No.", "Pending verification"],
  ["Official Email", "Pending verification"],
  ["Website", "mokshasewa.org"],
];

const branches: { icon: LucideIcon; label: string[]; bg: string; border: string; fg: string }[] = [
  { icon: UsersRound, label: ["Operations", "& Sewa"], bg: "#e8f7e6", border: "#bfe3bb", fg: "#1f9a2b" },
  { icon: HandHeart, label: ["CSR &", "Partnerships"], bg: "#f1ebff", border: "#d9ccfa", fg: "#7a3fe0" },
  { icon: IndianRupee, label: ["Finance", "& Donations"], bg: "#e7f0ff", border: "#c9dafa", fg: "#1d5bd6" },
  { icon: UsersRound, label: ["Admin", "& Support"], bg: "#fff1d6", border: "#f3d9a4", fg: "#ef9a12" },
];

const documents = ["Trust Deed", "Registration Certificate", "PAN Card", "12A / 80G Certificate", "Other Statutory Documents"];

const centres = [
  { code: "MS-C01", name: "Ghaziabad Centre (HO)", location: "Ghaziabad", status: "Active" },
  { code: "–", name: "Noida (upcoming)", location: "Noida", status: "Coming Soon" },
  { code: "–", name: "Delhi (upcoming)", location: "Delhi", status: "Coming Soon" },
];

const config = ["FY 2026–27  |  INR  |  Asia/Kolkata", "Free Sewa  |  No cash donations", "Mandatory MFA – enforced", "HRMS / website integration", "Data retention – approved policy"];

export default function SA005OrganisationSetup() {
  const notice = useNotice();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(() => Object.fromEntries(info.map(([k, v]) => [k, v])));

  return (
    <SuperAdminFrame active="organisation-setup">
      <PageHead
        icon={Building2}
        title="Organisation Setup"
        links={["Organisation Details", "Structure & Hierarchy", "Centres", "Documents", "Configuration"]}
      >
        <PrimaryButton outline icon={Plus} onClick={() => notice.show("New centres need readiness checks and authorisation before activation (demo).")}>Add Centre</PrimaryButton>
        <PrimaryButton outline icon={Plus} onClick={() => notice.show("Departments come from HRMS; CRM access is configured separately (demo).")}>Add Department</PrimaryButton>
      </PageHead>

      <KpiRow cols={6}>
        <KpiTile tone="red" icon={Network} value="01" label="Organisation" />
        <KpiTile tone="green" icon={MapPin} value="01" label="Active centre" />
        <KpiTile tone="orange" icon={UsersRound} value="07" label="Departments" />
        <KpiTile tone="purple" icon={UsersRound} value="186" label="Total users" />
        <KpiTile tone="red" icon={HandHeart} value="18" label="Volunteers" />
        <KpiTile tone="sky" icon={Settings} value="12" label="Connected APIs" />
      </KpiRow>

      <div className="grid gap-[12px] lg:h-[348px] lg:grid-cols-[395fr_433fr_327fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel
          bodyClassName="pt-[6px]"
          title="Organisation Information"
          icon={FileText}
          action={
            <button
              type="button"
              onClick={() => {
                if (editing) notice.show("Changes sent for verification — values stay 'Pending verification' until checked against source documents (demo).");
                setEditing((e) => !e);
              }}
              className="flex h-[28px] items-center gap-[5px] rounded-[7px] border-[1.5px] border-[#2f4fe0] px-[12px] text-[12.5px] font-semibold text-[#1d3fc4] hover:bg-[#f1f4ff]"
            >
              <Pencil strokeWidth={2.2} className="h-[13px] w-[13px]" />
              {editing ? "Save" : "Edit"}
            </button>
          }
        >
          <dl className="grid grid-cols-[140px_1fr] overflow-hidden rounded-[8px] border border-[#e6e9f0] text-[12.4px] leading-[18px]">
            {info.map(([k, , strong]) => (
              <Fragment key={k}>
                <dt className="border-b border-[#eef0f5] bg-[#f5f7fb] px-[10px] py-[3px] font-semibold">{k}</dt>
                <dd className={`border-b border-[#eef0f5] px-[10px] py-px ${strong ? "font-bold" : "font-medium"}`}>
                  {editing ? (
                    <input
                      value={values[k]}
                      onChange={(e) => setValues({ ...values, [k]: e.target.value })}
                      aria-label={k}
                      className="h-[20px] w-full rounded border border-[#cfd5e2] px-[6px] text-[12.5px] outline-none focus:border-[#5b6fe0]"
                    />
                  ) : (
                    <span className="block py-[2px] leading-[18px]">{values[k]}</span>
                  )}
                </dd>
              </Fragment>
            ))}
            <dt className="bg-[#f5f7fb] px-[10px] py-[3px] font-semibold">Status</dt>
            <dd className="px-[10px] py-[2px]"><StatusPill className="w-[64px]">Active</StatusPill></dd>
          </dl>
        </Panel>

        <Panel title="Organisation Hierarchy" icon={Network} bodyClassName="flex flex-col items-center pt-[12px]">
          <OrgBox bg="#fff1d6" border="#f3d9a4" title="Namo Gange Trust" sub="(Governing Body / Management)" />
          <span className="h-[18px] w-[2px] bg-[#1d4fe0]" />
          <OrgBox bg="#e7f0ff" border="#9cbcf5" title="Moksha Sewa" sub="(Project / Initiative)" />
          <span className="h-[14px] w-[2px] bg-[#1d4fe0]" />
          <div className="relative grid w-full grid-cols-4 gap-[8px] pt-[14px]">
            <span className="absolute left-[12.5%] right-[12.5%] top-0 h-[2px] bg-[#1d4fe0]" />
            {branches.map((b) => (
              <div key={b.label.join()} className="relative flex flex-col items-center">
                <span className="absolute -top-[14px] h-[14px] w-[2px] bg-[#1d4fe0]" />
                <div style={{ background: b.bg, borderColor: b.border }} className="flex h-[74px] w-full flex-col items-center justify-center rounded-[9px] border text-center">
                  <b.icon strokeWidth={2} style={{ color: b.fg }} className="h-[22px] w-[22px]" />
                  {b.label.map((l) => (
                    <span key={l} className="text-[12px] font-bold leading-tight">{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Documents & Compliance" icon={FolderOpen} bodyClassName="pt-[8px]">
          <ul className="overflow-hidden rounded-[9px] border border-[#e6e9f0]">
            {documents.map((d) => (
              <li key={d} className="flex items-center gap-[10px] border-b border-[#eef0f5] px-[12px] py-[10px] last:border-0">
                <span className="h-[6px] w-[6px] rounded-full bg-[#c88a00]" />
                <span className="flex-1 text-[13.2px] font-semibold">{d}</span>
                <button type="button" onClick={() => notice.show(`${d}: upload and verify against the source (demo).`)} className="rounded-[5px] bg-[#fdf1c4] px-[10px] py-[3px] text-[11.5px] font-semibold text-[#7a5b00] hover:brightness-95">
                  To verify
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-[12px] lg:h-[254px] lg:grid-cols-[840fr_327fr] lg:[grid-template-rows:minmax(0,1fr)]">
        <Panel title="Service Centres — 1 active / 2 upcoming" icon={MapPin} action={<ViewLink to="City, Zone & Centres" />} bodyClassName="flex flex-col pt-[8px]">
          <TableWrap>
            <Thead>
              {["Centre Code", "Centre Name", "Location", "Centre Head", "Contact No.", "Status", "Action"].map((h) => (
                <th key={h} className={`${th} ${h === "Centre Code" || h === "Centre Name" ? "" : "text-center"}`}>{h}</th>
              ))}
            </Thead>
            <tbody>
              {centres.map((c) => (
                <tr key={c.name} className="border-b border-[#eef0f5]">
                  <td className={`${td} py-[10px] font-semibold`}>{c.code}</td>
                  <td className={`${td} font-semibold`}>{c.name}</td>
                  <td className={`${td} text-center`}>{c.location}</td>
                  <td className={`${td} text-center`}>To assign</td>
                  <td className={`${td} text-center`}>To verify</td>
                  <td className={`${td} text-center`}>
                    <Pill tone={c.status === "Active" ? "green" : "amber"} className="w-[96px] rounded-[5px]">{c.status}</Pill>
                  </td>
                  <td className={`${td} text-center`}>
                    <button type="button" onClick={() => notice.show(`${c.name}: details (demo).`)} className="font-semibold hover:text-[#2320c4] hover:underline">View</button>
                    {" / "}
                    <button type="button" onClick={() => notice.show(`${c.name}: changes need authorisation (demo).`)} className="font-semibold hover:text-[#2320c4] hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          <p className="mt-auto pt-[8px] text-[12px] font-medium text-[#3b4256]">Centre setup and activation require authorisation; only Ghaziabad currently provides service.</p>
        </Panel>

        <Panel title="Configuration & Settings" icon={Settings} bodyClassName="flex flex-col pt-[4px]">
          {config.map((c) => (
            <p key={c} className="flex flex-1 items-center border-b border-[#eef0f5] text-[13px] font-medium last:border-0 [word-spacing:2px]">{c}</p>
          ))}
        </Panel>
      </div>
      {notice.node}
    </SuperAdminFrame>
  );
}

function OrgBox({ bg, border, title, sub }: { bg: string; border: string; title: string; sub: string }) {
  return (
    <div style={{ background: bg, borderColor: border }} className="w-[230px] rounded-[9px] border px-[10px] py-[6px] text-center shadow-[0_2px_6px_rgba(30,50,110,0.07)]">
      <b className="block text-[14.5px] leading-tight">{title}</b>
      <span className="text-[12px] font-semibold">{sub}</span>
    </div>
  );
}
