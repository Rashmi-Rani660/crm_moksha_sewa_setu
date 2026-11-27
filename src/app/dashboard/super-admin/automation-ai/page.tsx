import type { Metadata } from "next";
import AiAutomationDashboard from "@/components/dashboards/super-admin/pages/AiAutomationDashboard";

export const metadata: Metadata = {
  title: "AI & Automation Dashboard | Super Admin",
};

export default function Page() {
  return <AiAutomationDashboard />;
}
