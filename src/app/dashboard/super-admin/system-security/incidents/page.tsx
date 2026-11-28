import type { Metadata } from "next";
import SA066Incidents from "@/components/dashboards/super-admin/pages/SA066Incidents";

export const metadata: Metadata = {
  title: "Security Alerts & Incident Management (SA-066) | Super Admin",
};

export default function Page() {
  return <SA066Incidents />;
}

