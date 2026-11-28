"use client";

import { useRef, useState } from "react";
import { useCrmAccess } from "@/lib/api/useCrmAccess";
import { useCrmQuery } from "@/lib/api/useCrmQuery";
import { useCrmMutation } from "@/lib/api/useCrmMutation";
import { at, choose, count, records, text, istTimestamp, EMPTY, type CrmRecord } from "@/lib/crm/data";
import { humanize } from "@/lib/format";
import {
  UserFrame,
  UserHeader,
  UserKVList,
  UserKpiRow,
  UserPanel,
  UserPill,
  useUserNotice,
  userInk,
  userInputCls,
  userOutlineBtn,
  userPrimaryBtn,
  userTextareaCls,
} from "@/components/dashboards/user/UserScreenKit";

export default function US019VehicleMaterialRequests() {
  const { show, node } = useUserNotice();
  const { profile,can } = useCrmAccess();
  const mutation = useCrmMutation(show);
  const cases = useCrmQuery<CrmRecord[]>(can("cases.view") ? "/cases?active=true&limit=100" : null);
  const trips = useCrmQuery<CrmRecord[]>(can("fleet.view") ? "/fleet/trips?limit=100" : null);
  const materials = useCrmQuery<CrmRecord[]>(can("inventory.view") ? "/inventory/material-requests?mine=true&limit=100" : null);
  const vehicles = useCrmQuery<CrmRecord[]>(can("fleet.view") ? "/fleet/vehicles?limit=100" : null);
  const stock = useCrmQuery<CrmRecord[]>(can("inventory.view") ? "/inventory/stock?limit=100" : null);
  const fleet = useCrmQuery<CrmRecord>(can("fleet.view") ? "/fleet/summary" : null);
  const inventory = useCrmQuery<CrmRecord>(can("inventory.view") ? "/inventory/summary" : null);
  const submitted = useRef(new Map<string,CrmRecord>());
  const locked = useRef(false);
  const [materialItem,setMaterialItem] = useState<CrmRecord | null>(null);
  const [linkedCase, setLinkedCase] = useState("");
  const [reqType, setReqType] = useState("Vehicle");
  const [reqDate, setReqDate] = useState("");
  const [location, setLocation] = useState("");
  const [qty, setQty] = useState("");
  const [priority, setPriority] = useState("High");
  const [purpose, setPurpose] = useState("");

  const rows = [...records(trips.data).filter(row => row.requestedBy === profile?.id),...records(materials.data)];
  async function submit() {
    if (locked.current || mutation.busy) return;
    locked.current = true;
    try {
      const kase = records(cases.data).find(row => row.caseNo === linkedCase || row.id === linkedCase);
      if (!kase) return show("Choose a real assigned case.");
      const centreId = at(kase,"centre.id") ?? profile?.centres[0]?.id;
      if (!centreId) return show("A service centre is required.");
      if (reqType.includes("Vehicle")) {
        if (!can("fleet.create")) return;
        const scheduledAt = istTimestamp(reqDate);
        if (!scheduledAt || !location.trim()) return show("Enter a pickup location and required time as YYYY-MM-DD HH:MM (IST).");
        const body = { purpose: "BODY_TRANSPORT",centreId,caseId: kase.id,pickup: { address: location },drop: {},scheduledAt,notes: purpose };
        const key = JSON.stringify(body);
        let created = submitted.current.get(key);
        if (!created) { created = await mutation.run<CrmRecord>("/fleet/trips", { body }); if (created) submitted.current.set(key,created); }
        if (!created) return;
        show(text(created.tripNo) + ': ' + humanize(text(created.status,"")));
      }
      if (reqType.includes("Material")) {
        if (!can("inventory.create")) return;
        const item = materialItem ?? choose(records(stock.data).map(row => ({ ...row,...(row.item as CrmRecord) })),"Choose material");
        const quantity = Number(qty);
        if (!item || !Number.isInteger(quantity) || quantity <= 0 || !purpose.trim()) return show("Choose material, a positive whole quantity and a purpose.");
        const body = { centreId,caseId: kase.id,purpose,lines: [{ itemId: item.id,quantity }] };
        const key = JSON.stringify(body);
        let created = submitted.current.get(key);
        if (!created) { created = await mutation.run<CrmRecord>("/inventory/material-requests", { body }); if (created) submitted.current.set(key,created); }
        if (created) show(text(created.requestNo) + ': ' + humanize(text(created.status,"")));
      }
    } finally { locked.current = false; }
  }
  return (
    <UserFrame active="resources-expenses">
      <UserHeader code="US-019" title="Vehicle & Material Requests" />
      <UserKpiRow
        items={[
          { value: profile ? count(rows.length) : EMPTY, label: "My resource requests", tone: "blue" },
          { value: profile ? count(rows.filter(row => row.status === "REQUESTED").length) : EMPTY, label: "Awaiting approval", tone: "orange" },
          { value: profile ? count(rows.filter(row => row.status === "DISPATCHED" || row.status === "ISSUED").length) : EMPTY, label: "Allocated", tone: "green" },
          { value: count(at(fleet.data,"vehicles.available")), label: "Vehicle available", tone: "green" },
          { value: count(inventory.data?.lowStockLines), label: "Low stock items", tone: "red", valueRed: true },
          { value: EMPTY, label: "Case clearance", tone: "orange" },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-rows:338fr_160fr] lg:gap-[12px]">
        <div className="grid min-h-0 grid-cols-1 gap-3 lg:[grid-template-columns:750fr_406fr] lg:gap-[12px]">
          <UserPanel title="Request vehicle or materials">
            <div className="grid grid-cols-1 gap-x-[14px] gap-y-[6px] sm:grid-cols-2">
              <label className={`text-[13.8px] ${userInk}`}>
                Linked case
                <input value={linkedCase} onChange={(e) => setLinkedCase(e.target.value)} className={`${userInputCls} mt-[3px]`} />
              </label>
              <label className={`text-[13.8px] ${userInk}`}>
                Request type
                <select value={reqType} onChange={(e) => setReqType(e.target.value)} className={`${userInputCls} mt-[3px]`}>
                  <option>Vehicle</option>
                  <option>Material</option>
                  <option>Vehicle &amp; Material</option>
                </select>
              </label>
              <label className={`text-[13.8px] ${userInk}`}>
                Required date
                <input value={reqDate} onChange={(e) => setReqDate(e.target.value)} className={`${userInputCls} mt-[3px]`} />
              </label>
              <label className={`text-[13.8px] ${userInk}`}>
                Location
                <input value={location} onChange={(e) => setLocation(e.target.value)} className={`${userInputCls} mt-[3px]`} />
              </label>
              <label className={`text-[13.8px] ${userInk}`}>
                Quantity / unit
                <input value={qty} onChange={(e) => setQty(e.target.value)} className={`${userInputCls} mt-[3px]`} />
              </label>
              <label className={`text-[13.8px] ${userInk}`}>
                Priority
                <input value={priority} onChange={(e) => setPriority(e.target.value)} className={`${userInputCls} mt-[3px]`} />
              </label>
            </div>
            <label className={`mt-[6px] block text-[13.8px] ${userInk}`}>
              Purpose
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Describe resource need"
                className={`${userTextareaCls} mt-[3px] h-[54px] resize-none`}
              />
            </label>
            <div className="mt-[8px] flex flex-wrap gap-[7px]">
              <button type="button" disabled={mutation.busy} onClick={submit} className={userPrimaryBtn}>Submit request</button>
              <button type="button" disabled onClick={() => show(EMPTY)} className={userOutlineBtn}>Save draft</button>
              <button type="button" onClick={() => { const item = choose(records(stock.data).map(row => ({ ...row,...(row.item as CrmRecord) })),"Choose material"); if (item) { setMaterialItem(item); show(text(item.name)); } }} className={userOutlineBtn}>Add material</button>
            </div>
            <p className="mt-[6px] text-[13px] text-[#4a5468]">
              Availability is indicative; Admin confirms allocation and dispatch clearance.
            </p>
          </UserPanel>

          <UserPanel title="Availability & readiness">
            <UserKVList
              rows={[
                ["MV-01 · Force Traveller", "In service"],
                ["MV-02 · Maruti EECO", <UserPill key="mv2" tone="green">{humanize(text(vehicles.data?.[1]?.status,""))}</UserPill>],
                ["Case legal clearance", <UserPill key="cl" tone="red">{EMPTY}</UserPill>],
                ["Driver / safety checks", "Admin verification"],
                [text(at(stock.data?.[0],"item.name")),text(stock.data?.[0]?.quantity)],
                [text(at(stock.data?.[1],"item.name")),text(stock.data?.[1]?.quantity)],
              ]}
            />
            <div className="mt-[8px] rounded-[6px] border border-[#dce6f5] bg-[#eef4fc] px-[10px] py-[5px] text-[13.8px] text-[#1a1d36]">
              Requesting a vehicle does not authorise dispatch.
            </div>
            <div className="mt-[8px]">
              <button type="button" onClick={() => show(rows.map(row => `${text(row.tripNo ?? row.requestNo)}: ${text(row.status)}`).join("\n") || EMPTY)} className={userPrimaryBtn}>View request status</button>
            </div>
          </UserPanel>
        </div>

        <UserPanel title="My requests">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse">
              <thead>
                <tr className="h-[27px] bg-[#e2e9f4] text-left text-[13.8px] font-medium text-[#1a1d36]">
                  <th className="px-[8px]">ID</th>
                  <th className="px-[8px]">Resource</th>
                  <th className="px-[8px]">Status</th>
                  <th className="px-[8px]">Next action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                <tr key={text(row.id)} className="h-[32px] border-b border-[#dce4ee] text-[14.2px] text-[#1a1d36]">
                  <td className="px-[8px]">{text(row.tripNo ?? row.requestNo)}</td>
                  <td className="px-[8px]">{text(row.purpose)}</td>
                  <td className="px-[8px]"><UserPill tone="amber">{humanize(text(row.status,""))}</UserPill></td>
                  <td className="px-[8px]">{EMPTY}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-[6px]">
            <button type="button" onClick={() => { trips.reload();materials.reload();stock.reload(); }} className={userPrimaryBtn}>View history</button>
          </div>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
