import type { Metadata } from "next";
import SA070BackupSchedule from "@/components/dashboards/super-admin/pages/SA070BackupSchedule";

export const metadata: Metadata = {
  title: "Backup Schedule & Restoration (SA-070) | Super Admin",
};

export default function Page() {
  return <SA070BackupSchedule />;
}

