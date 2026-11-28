import type { Metadata } from "next";
import US020ExpensesReimbursement from "@/components/dashboards/user/pages/US020ExpensesReimbursement";

export const metadata: Metadata = {
  title: "Expenses & Reimbursement | User",
};

export default function Page() {
  return <US020ExpensesReimbursement />;
}
