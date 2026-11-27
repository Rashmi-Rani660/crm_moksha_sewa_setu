import type { Metadata } from "next";
import SA069BackupDashboard from "@/components/dashboards/super-admin/pages/SA069BackupDashboard";

export const metadata: Metadata = {
  title: "Backup & Recovery Dashboard (SA-069) | Super Admin",
};

export default function Page() {
  return <SA069BackupDashboard />;
}

