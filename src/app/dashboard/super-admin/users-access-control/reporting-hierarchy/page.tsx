import type { Metadata } from "next";
import SA011ReportingHierarchy from "@/components/dashboards/super-admin/pages/SA011ReportingHierarchy";

export const metadata: Metadata = {
  title: "Reporting Hierarchy | Super Admin",
};

export default function Page() {
  return <SA011ReportingHierarchy />;
}
