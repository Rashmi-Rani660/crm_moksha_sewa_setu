import type { Metadata } from "next";
import SuperAdminDashboard from "@/components/dashboards/SuperAdminDashboard";

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
};

export default function Page() {
  return <SuperAdminDashboard />;
}
