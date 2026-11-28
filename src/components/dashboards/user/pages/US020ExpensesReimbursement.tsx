"use client";

import { useState } from "react";
import {
  UserFlowSteps,
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

export default function US020ExpensesReimbursement() {
  const { show, node } = useUserNotice();
  const [linkedCase, setLinkedCase] = useState("MS-26-1099");
  const [category, setCategory] = useState("Transport");
  const [amount, setAmount] = useState("3000");
  const [expDate, setExpDate] = useState("28 Nov 2026");
  const [invoiceRef, setInvoiceRef] = useState("INV-DEMO-01");
  const [payMethod, setPayMethod] = useState("Bank / digital");
  const [remarks, setRemarks] = useState("");
  const [hasInvoice, setHasInvoice] = useState(false);

  return (
    <UserFrame active="resources-expenses">
      <UserHeader code="US-020" title="Expenses & Reimbursement" />
      <UserKpiRow
        items={[
          { value: "₹4,500", label: "My claim amount", tone: "blue" },
          { value: "₹3,000", label: "Pending review", tone: "orange" },
          { value: "₹1,500", label: "Approved", tone: "green" },
          { value: "00", label: "Returned", tone: "green" },
          { value: "01", label: "Draft claim", tone: "purple" },
          { value: "Pending", label: "Payment status", tone: "orange" },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 lg:mt-[9px] lg:min-h-0 lg:flex-1 lg:[grid-template-rows:338fr_160fr] lg:gap-[12px]">
        <div className="grid min-h-0 grid-cols-1 gap-3 lg:[grid-template-columns:750fr_406fr] lg:gap-[12px]">
          <UserPanel title="Submit case expense">
            <div className="grid grid-cols-1 gap-x-[14px] gap-y-[5px] sm:grid-cols-2">
              <label className={`text-[13.8px] ${userInk}`}>
                Linked case
                <input value={linkedCase} onChange={(e) => setLinkedCase(e.target.value)} className={`${userInputCls} mt-[2px] h-[29px]`} />
              </label>
              <label className={`text-[13.8px] ${userInk}`}>
                Expense category
                <input value={category} onChange={(e) => setCategory(e.target.value)} className={`${userInputCls} mt-[2px] h-[29px]`} />
              </label>
              <label className={`text-[13.8px] ${userInk}`}>
                Amount (INR)
                <input value={amount} onChange={(e) => setAmount(e.target.value)} className={`${userInputCls} mt-[2px] h-[29px]`} />
              </label>
              <label className={`text-[13.8px] ${userInk}`}>
                Expense date
                <input value={expDate} onChange={(e) => setExpDate(e.target.value)} className={`${userInputCls} mt-[2px] h-[29px]`} />
              </label>
              <label className={`text-[13.8px] ${userInk}`}>
                Invoice reference
                <input value={invoiceRef} onChange={(e) => setInvoiceRef(e.target.value)} className={`${userInputCls} mt-[2px] h-[29px]`} />
              </label>
              <label className={`text-[13.8px] ${userInk}`}>
                Payment method
                <input value={payMethod} onChange={(e) => setPayMethod(e.target.value)} className={`${userInputCls} mt-[2px] h-[29px]`} />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                setHasInvoice(true);
                show("Invoice attached & duplicate check passed (demo).");
              }}
              className="mt-[6px] flex h-[29px] w-full items-center justify-center rounded-[6px] border border-dashed border-[#a9bddf] bg-white text-[13.8px] text-[#1a1d36] hover:bg-[#f3f6fc]"
            >
              {hasInvoice ? "Invoice INV-DEMO-01 attached · Ready for validation" : "Drop invoice or receipt here · Browse files"}
            </button>

            <label className={`mt-[5px] block text-[13.8px] ${userInk}`}>
              Expense remarks
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add remarks or voice note"
                className={`${userTextareaCls} mt-[2px] h-[44px] resize-none py-[6px]`}
              />
            </label>

            <div className="mt-[7px] flex flex-wrap gap-[7px]">
              <button
                type="button"
                disabled={!hasInvoice}
                onClick={() => show(`Expense claim for ${linkedCase} submitted to Admin.`)}
                className={userPrimaryBtn}
              >
                Submit claim
              </button>
              <button type="button" onClick={() => show("Expense draft saved.")} className={userOutlineBtn}>Save draft</button>
              <button type="button" onClick={() => setHasInvoice(true)} className={userOutlineBtn}>Add invoice</button>
            </div>
            <p className="mt-[4px] text-[13px] text-[#4a5468]">
              Upload and validate invoice before submitting. No payment is initiated here.
            </p>
          </UserPanel>

          <UserPanel title="Claim review & status">
            <UserKVList
              rows={[
                ["Duplicate invoice check", <UserPill key="dc" tone={hasInvoice ? "green" : "amber"}>{hasInvoice ? "Passed" : "Pending"}</UserPill>],
                ["Supporting evidence", "Required"],
                ["Approval authority", "Assigned Admin"],
                ["Payment release", "Separate authorised role"],
                ["Self-approval", "Not allowed"],
              ]}
            />
            <p className={`mt-[8px] text-[13.8px] ${userInk}`}>Reimbursement progress</p>
            <div className="mt-[4px]">
              <UserFlowSteps steps={["Submit", "Review", "Approve", "Pay"]} />
            </div>
            <p className="mt-[6px] text-[13px] text-[#4a5468]">
              Approved does not mean paid. Show actual payment reference when available.
            </p>
            <div className="mt-[7px]">
              <button type="button" onClick={() => show("Claim history opened.")} className={userPrimaryBtn}>View claim history</button>
            </div>
          </UserPanel>
        </div>

        <UserPanel title="My reimbursement history">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse">
              <thead>
                <tr className="h-[27px] bg-[#e2e9f4] text-left text-[13.8px] font-medium text-[#1a1d36]">
                  <th className="px-[8px]">Claim</th>
                  <th className="px-[8px]">Case</th>
                  <th className="px-[8px]">Amount</th>
                  <th className="px-[8px]">Status</th>
                  <th className="px-[8px]">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="h-[32px] border-b border-[#dce4ee] text-[14.2px] text-[#1a1d36]">
                  <td className="px-[8px]">EXP-011</td>
                  <td className="px-[8px]">MS-26-1099</td>
                  <td className="px-[8px]">₹3,000</td>
                  <td className="px-[8px]"><UserPill tone="amber">Pending</UserPill></td>
                  <td className="px-[8px]"><button type="button" onClick={() => show("Viewing EXP-011.")} className={userOutlineBtn}>View</button></td>
                </tr>
                <tr className="h-[32px] border-b border-[#dce4ee] text-[14.2px] text-[#1a1d36]">
                  <td className="px-[8px]">EXP-012</td>
                  <td className="px-[8px]">MS-26-1098</td>
                  <td className="px-[8px]">₹1,500</td>
                  <td className="px-[8px]"><UserPill tone="green">Approved</UserPill></td>
                  <td className="px-[8px]"><button type="button" onClick={() => show("Viewing EXP-012.")} className={userOutlineBtn}>View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-[6px] flex gap-[7px]">
            <button type="button" onClick={() => show("Claim filter opened.")} className={userPrimaryBtn}>Filter claims</button>
            <button type="button" onClick={() => show("Resumed draft EXP-011.")} className={userOutlineBtn}>Resume draft</button>
          </div>
        </UserPanel>
      </div>
      {node}
    </UserFrame>
  );
}
