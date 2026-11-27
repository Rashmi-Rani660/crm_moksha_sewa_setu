import type { Metadata } from "next";
import BudgetControl from "@/components/dashboards/super-admin/pages/BudgetControl";

export const metadata: Metadata = {
  title: "Financial Approvals & Budget Control | Super Admin",
};

export default function Page() {
  return <BudgetControl />;
}
