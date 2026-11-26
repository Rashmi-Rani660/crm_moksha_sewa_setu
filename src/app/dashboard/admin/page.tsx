import type { Metadata } from "next";
import AdminDashboard from "@/components/dashboards/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function Page() {
  return <AdminDashboard />;
}
