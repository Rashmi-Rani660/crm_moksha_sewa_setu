import type { Metadata } from "next";
import SA015CaseManagement from "@/components/dashboards/super-admin/pages/SA015CaseManagement";

export const metadata: Metadata = {
  title: "Case Management | Super Admin",
};

export default function Page() {
  return <SA015CaseManagement />;
}
