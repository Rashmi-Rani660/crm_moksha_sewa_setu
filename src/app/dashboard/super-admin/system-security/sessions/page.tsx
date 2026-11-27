import type { Metadata } from "next";
import SA064SessionMonitoring from "@/components/dashboards/super-admin/pages/SA064SessionMonitoring";

export const metadata: Metadata = {
  title: "Login & Active Session Monitoring (SA-064) | Super Admin",
};

export default function Page() {
  return <SA064SessionMonitoring />;
}
