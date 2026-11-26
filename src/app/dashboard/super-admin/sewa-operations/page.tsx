import type { Metadata } from "next";
import SA013LeadsRequests from "@/components/dashboards/super-admin/pages/SA013LeadsRequests";

export const metadata: Metadata = {
  title: "Central Leads & Requests Management | Super Admin",
};

export default function Page() {
  return <SA013LeadsRequests />;
}
