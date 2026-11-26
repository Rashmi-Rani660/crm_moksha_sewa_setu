import type { Metadata } from "next";
import SA004Approvals from "@/components/dashboards/super-admin/pages/SA004Approvals";

export const metadata: Metadata = {
  title: "Central Approval Centre | Super Admin",
};

export default function Page() {
  return <SA004Approvals />;
}
