import type { Metadata } from "next";
import CaseExpenses from "@/components/dashboards/super-admin/pages/CaseExpenses";

export const metadata: Metadata = {
  title: "Case Expenses & Reimbursement | Super Admin",
};

export default function Page() {
  return <CaseExpenses />;
}
