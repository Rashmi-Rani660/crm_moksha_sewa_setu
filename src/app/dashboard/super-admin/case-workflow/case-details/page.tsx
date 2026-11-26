import type { Metadata } from "next";
import SA016CaseDetails from "@/components/dashboards/super-admin/pages/SA016CaseDetails";

export const metadata: Metadata = {
  title: "Complete Case Details | Super Admin",
};

export default function Page() {
  return <SA016CaseDetails />;
}
