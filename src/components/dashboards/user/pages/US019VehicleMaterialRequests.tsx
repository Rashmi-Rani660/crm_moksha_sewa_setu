"use client";

import { useState } from "react";
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
  const [linkedCase, setLinkedCase] = useState("MS-26-1101");
  const [reqType, setReqType] = useState("Vehicle");
  const [reqDate, setReqDate] = useState("28 Nov 2026");
  const [location, setLocation] = useState("Ghaziabad");
  const [qty, setQty] = useState("1 vehicle");
  const [priority, setPriority] = useState("High");
  const [purpose, setPurpose] = useState("");

  return (
    <UserFrame active="resources-expenses">
      <UserHeader code="US-019" title="Vehicle & Material Requests" />
      <UserKpiRow
        items={[
          { value: "02", label: "My resource requests", tone: "blue" },
          { value: "01", label: "Awaiting approval", tone: "orange" },
          { value: "01", label: "Allocated", tone: "green" },
          { value: "01", label: "Vehicle available", tone: "green" },
          { value: "02", label: "Low stock items", tone: "red", valueRed: true },
          { value: "Pending", label: "Case clearance", tone: "orange" },
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
              <button type="button" onClick={() => show(`Resource request submitted for ${linkedCase}.`)} className={userPrimaryBtn}>Submit request</button>
              <button type="button" onClick={() => show("Resource request draft saved.")} className={userOutlineBtn}>Save draft</button>
              <button type="button" onClick={() => show("Additional material row added.")} className={userOutlineBtn}>Add material</button>
            </div>
            <p className="mt-[6px] text-[13px] text-[#4a5468]">
              Availability is indicative; Admin confirms allocation and dispatch clearance.
            </p>
          </UserPanel>

          <UserPanel title="Availability & readiness">
            <UserKVList
              rows={[
                ["MV-01 · Force Traveller", "In service"],
                ["MV-02 · Maruti EECO", <UserPill key="mv2" tone="green">Available</UserPill>],
                ["Case legal clearance", <UserPill key="cl" tone="red">Pending</UserPill>],
                ["Driver / safety checks", "Admin verification"],
                ["Body cover", "6 pieces · low stock"],
                ["Sanitisation supplies", "8 units · low stock"],
              ]}
            />
            <div className="mt-[8px] rounded-[6px] border border-[#dce6f5] bg-[#eef4fc] px-[10px] py-[5px] text-[13.8px] text-[#1a1d36]">
              Requesting a vehicle does not authorise dispatch.
            </div>
            <div className="mt-[8px]">
              <button type="button" onClick={() => show("Viewing RES-011 approval status.")} className={userPrimaryBtn}>View request status</button>
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
                <tr className="h-[32px] border-b border-[#dce4ee] text-[14.2px] text-[#1a1d36]">
                  <td className="px-[8px]">RES-011</td>
                  <td className="px-[8px]">Vehicle MV-02</td>
                  <td className="px-[8px]"><UserPill tone="amber">Awaiting approval</UserPill></td>
                  <td className="px-[8px]">Admin review</td>
                </tr>
                <tr className="h-[32px] border-b border-[#dce4ee] text-[14.2px] text-[#1a1d36]">
                  <td className="px-[8px]">RES-012</td>
                  <td className="px-[8px]">Cremation kit</td>
                  <td className="px-[8px]"><UserPill tone="green">Allocated</UserPill></td>
                  <td className="px-[8px]">Acknowledge issue</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-[6px]">
            <button type="button" onClick={() => show("Resource request history opened.")} className={userPrimaryBtn}>View history</button>
          </div>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
