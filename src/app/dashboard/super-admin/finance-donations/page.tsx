import type { Metadata } from "next";
import SA039FinanceCommand from "@/components/dashboards/super-admin/pages/SA039FinanceCommand";

export const metadata: Metadata = {
  title: "Finance Command Centre | Super Admin",
};

export default function Page() {
  return <SA039FinanceCommand />;
}
